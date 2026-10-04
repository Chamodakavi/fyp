"use client";

import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useProducts } from "@/hooks/useProducts";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/utils/supabase/createClient";
import { CartItem } from "@/components/orderCom/CartItem";
import { OrderSummary } from "@/components/orderCom/OrderSummary";
import { OrdersSection } from "@/components/orderCom/OrdersSection";
import { OrderDetailsModal } from "@/components/orderCom/OrderDetailsModal";

const THEME = {
  primary: "#0D2818",
  accent: "#D6E8D5",
  bg: "#f4fcf6",
};

function CartPage() {
  const supabase = createClient();

  const { cart, loading: cartLoading } = useCart();
  const { products, loading: productsLoading } = useProducts();
  const { user, loading: userLoading } = useUser();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState(false);

  useEffect(() => {
    if (!cart || cart.length === 0) {
      setCartItems([]);
      return;
    }

    if (products && products.length > 0) {
      const mergedItems = cart
        .map((cartItem: any) => {
          const productDetails = products.find(
            (p) => String(p.id) === String(cartItem.product_id),
          );

          if (!productDetails) return null;

          return {
            ...productDetails,
            quantity: Number(cartItem.qty || cartItem.quantity || 1),
            cart_row_id: cartItem.id,
          };
        })
        .filter(Boolean);

      setCartItems(mergedItems);
    }
  }, [cart, products]);

  const fetchMyOrders = async () => {
    if (!user?.id) {
      setOrders([]);
      setOrdersLoading(false);
      return;
    }

    setOrdersLoading(true);

    try {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (orderError) throw orderError;

      const orderIds = (orderData || []).map((order) => order.id);

      if (orderIds.length === 0) {
        setOrders([]);
        return;
      }

      const { data: itemData, error: itemError } = await supabase
        .from("order_items")
        .select("*")
        .in("order_id", orderIds);

      if (itemError) throw itemError;

      setOrders(
        (orderData || []).map((order) => ({
          ...order,
          items: (itemData || []).filter((item) => item.order_id === order.id),
        })),
      );
    } catch (error: any) {
      console.error("Error fetching orders:", error.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (!userLoading) fetchMyOrders();
  }, [user?.id, userLoading]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, Number(item.quantity) + change) }
          : item,
      ),
    );
  };

  const handleRemoveItem = async (productId: number, cartRowId: number) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId),
    );

    const { error } = await supabase.from("cart").delete().eq("id", cartRowId);

    if (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item from database.");
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 1),
    0,
  );
  const shipping = subtotal > 5000 ? 0 : 350;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (!user?.id) {
      alert("Please login before checkout.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setCheckoutLoading(true);

    try {
      const now = new Date().toISOString();

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          user_name: user.u_name || "Unknown User",
          user_email: user.u_email || "No Email",
          user_phone: user.u_tel || "",
          total_amount: total,
          shipping_amount: shipping,
          status: "pending",
          admin_note: "",
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: String(item.id),
        product_name: item.name || "Unnamed Product",
        product_image: item.image_links || item.image || "",
        product_price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
        subtotal: Number(item.price || 0) * Number(item.quantity || 1),
        created_at: now,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      const cartRowIds = cartItems.map((item) => item.cart_row_id);
      const { error: clearCartError } = await supabase
        .from("cart")
        .delete()
        .in("id", cartRowIds);

      if (clearCartError) throw clearCartError;

      setCartItems([]);
      await fetchMyOrders();
      alert("Order placed successfully! Admin can now review your order.");
    } catch (error: any) {
      console.error("Checkout error:", error);
      alert("Checkout failed: " + error.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string | number) => {
    const order = orders.find((item) => item.id === orderId);
    if (!order) return;

    const createdAt = new Date(order.created_at).getTime();
    const age = Date.now() - createdAt;

    if (age > 24 * 60 * 60 * 1000) {
      alert("This order can only be cancelled within 1 day of placing it.");
      return;
    }

    if (["cancelled", "delivered", "handed_over"].includes(order.status)) {
      alert("This order can no longer be cancelled.");
      return;
    }

    setCancellingOrder(true);

    try {
      const { data, error } = await supabase
        .from("orders")
        .update({
          status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId)
        .eq("user_id", user?.id)
        .select()
        .single();

      if (error) throw error;

      const updatedOrder = { ...order, ...data };
      setOrders((prev) =>
        prev.map((item) => (item.id === orderId ? updatedOrder : item)),
      );
      setSelectedOrder(updatedOrder);

      alert("Order cancelled successfully.");
    } catch (error: any) {
      console.error("Cancel order error:", error);
      alert("Failed to cancel order: " + error.message);
    } finally {
      setCancellingOrder(false);
    }
  };

  if (cartLoading || productsLoading || userLoading) {
    return (
      <Center minH="100vh" bg={THEME.bg}>
        <Spinner size="xl" color={THEME.primary} />
      </Center>
    );
  }

  return (
    <Box minH="100vh" bg={THEME.bg} p={{ base: 4, md: 8 }}>
      <Box maxW="1200px" mx="auto">
        <VStack align="stretch" gap={8}>
          <HStack justify="space-between" align="start">
            <Box>
              <Heading color={THEME.primary} size="xl">
                Shopping Cart
              </Heading>
              <Text color="gray.600" mt={1}>
                Review your cart and track your submitted orders.
              </Text>
            </Box>
            <Badge colorPalette="green" px={3} py={1} borderRadius="full">
              Cash on Delivery
            </Badge>
          </HStack>

          {cartItems.length === 0 ? (
            <Box
              bg="white"
              rounded="2xl"
              shadow="sm"
              border="1px solid"
              borderColor="gray.100"
              p={10}
              textAlign="center"
            >
              <VStack gap={5}>
                <Box bg={THEME.accent} p={6} rounded="full">
                  <ShoppingBag size={44} color={THEME.primary} />
                </Box>
                <Heading color={THEME.primary} size="lg">
                  Your Cart is Empty
                </Heading>
                <Text color="gray.600" maxW="md">
                  Your cart is clear. You can browse products or check your
                  order history below.
                </Text>
                <Link href="/marketplace">
                  <Button
                    bg={THEME.primary}
                    color="white"
                    size="lg"
                    _hover={{ bg: "green.800" }}
                  >
                    Start Shopping
                  </Button>
                </Link>
              </VStack>
            </Box>
          ) : (
            <Flex gap={8} direction={{ base: "column", lg: "row" }}>
              <VStack flex="2" align="stretch" gap={4}>
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onQuantityChange={updateQuantity}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </VStack>

              <OrderSummary
                subtotal={subtotal}
                shipping={shipping}
                total={total}
                loading={checkoutLoading}
                onCheckout={handleCheckout}
              />
            </Flex>
          )}

          <OrdersSection
            orders={orders}
            loading={ordersLoading}
            onSelectOrder={setSelectedOrder}
          />
        </VStack>
      </Box>

      <OrderDetailsModal
        order={selectedOrder}
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        onCancel={handleCancelOrder}
        cancelling={cancellingOrder}
      />
    </Box>
  );
}

export default CartPage;
