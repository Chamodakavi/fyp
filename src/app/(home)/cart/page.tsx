"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  VStack,
  HStack,
  Separator,
  IconButton,
  Spinner,
  Center,
  Badge,
  Stack,
} from "@chakra-ui/react";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  PackageCheck,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useProducts } from "@/hooks/useProducts";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/utils/supabase/createClient";

const THEME = {
  primary: "#0D2818",
  accent: "#D6E8D5",
  bg: "#f4fcf6",
  card: "#ffffff",
};

const getStatusColor = (status: string) => {
  if (status === "delivered") return "green";
  if (status === "handed_over") return "blue";
  if (status === "processing") return "orange";
  if (status === "cancelled") return "red";
  return "gray";
};

const getStatusLabel = (status: string) => {
  if (status === "handed_over") return "Handed Over";
  if (status === "processing") return "Processing";
  if (status === "delivered") return "Delivered";
  if (status === "cancelled") return "Cancelled";
  return "Pending";
};

const getStatusMessage = (status: string) => {
  if (status === "handed_over") {
    return "Your order has been handed over to the delivery/COD service.";
  }

  if (status === "processing") {
    return "Admin is preparing your order.";
  }

  if (status === "delivered") {
    return "Your order has been delivered.";
  }

  if (status === "cancelled") {
    return "This order has been cancelled.";
  }

  return "Your order is waiting for admin review.";
};

const getStatusIcon = (status: string) => {
  if (status === "delivered") return <CheckCircle size={18} />;
  if (status === "handed_over") return <Truck size={18} />;
  if (status === "cancelled") return <XCircle size={18} />;
  return <Clock size={18} />;
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

          if (productDetails) {
            return {
              ...productDetails,
              quantity: Number(cartItem.qty || cartItem.quantity || 1),
              cart_row_id: cartItem.id,
            };
          }

          return null;
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

      if (orderError) {
        throw orderError;
      }

      const orderIds = (orderData || []).map((order) => order.id);

      if (orderIds.length === 0) {
        setOrders([]);
        return;
      }

      const { data: itemData, error: itemError } = await supabase
        .from("order_items")
        .select("*")
        .in("order_id", orderIds);

      if (itemError) {
        throw itemError;
      }

      const ordersWithItems = (orderData || []).map((order) => ({
        ...order,
        items: (itemData || []).filter((item) => item.order_id === order.id),
      }));

      setOrders(ordersWithItems);
    } catch (error: any) {
      console.error("Error fetching orders:", error.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (!userLoading) {
      fetchMyOrders();
    }
  }, [user?.id, userLoading]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, Number(item.quantity) + change);
          return { ...item, quantity: newQuantity };
        }

        return item;
      }),
    );
  };

  const handleRemoveItem = async (product_id: number, cart_row_id: number) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== product_id),
    );

    try {
      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("id", cart_row_id);

      if (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item from database.");
      }
    } catch (err) {
      console.error(err);
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
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: String(item.id),
        product_name: item.name || "Unnamed Product",
        product_image: item.image_links || item.image || "",
        product_price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
        subtotal: Number(item.price || 0) * Number(item.quantity || 1),
        created_at: new Date().toISOString(),
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        throw itemsError;
      }

      const cartRowIds = cartItems.map((item) => item.cart_row_id);

      const { error: clearCartError } = await supabase
        .from("cart")
        .delete()
        .in("id", cartRowIds);

      if (clearCartError) {
        throw clearCartError;
      }

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

                <Link href={"/marketplace"}>
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
                  <Flex
                    key={item.id}
                    bg="white"
                    p={4}
                    rounded="lg"
                    shadow="sm"
                    border="1px solid"
                    borderColor="gray.100"
                    gap={4}
                    direction={{ base: "column", sm: "row" }}
                    align={{ base: "start", sm: "center" }}
                  >
                    <Box
                      bg="gray.100"
                      rounded="md"
                      overflow="hidden"
                      w={{ base: "100%", sm: "100px" }}
                      h="100px"
                    >
                      <Image
                        src={
                          item.image_links ||
                          item.image ||
                          "https://placehold.co/100"
                        }
                        alt={item.name}
                        w="full"
                        h="full"
                        objectFit="cover"
                      />
                    </Box>

                    <Box flex="1">
                      <Text fontSize="sm" color="gray.500" fontWeight="medium">
                        {item.category}
                      </Text>

                      <Heading size="md" color="gray.800" mb={1}>
                        {item.name}
                      </Heading>

                      <Text fontWeight="bold" color={THEME.primary}>
                        LKR {Number(item.price || 0).toLocaleString()}
                      </Text>
                    </Box>

                    <HStack
                      w={{ base: "full", sm: "auto" }}
                      justify="space-between"
                      gap={6}
                    >
                      <HStack
                        border="1px solid"
                        borderColor="gray.300"
                        rounded="md"
                      >
                        <IconButton
                          variant="ghost"
                          size="sm"
                          aria-label="Decrease quantity"
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </IconButton>

                        <Text fontWeight="bold" w="30px" textAlign="center">
                          {item.quantity}
                        </Text>

                        <IconButton
                          variant="ghost"
                          size="sm"
                          aria-label="Increase quantity"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus size={16} />
                        </IconButton>
                      </HStack>

                      <IconButton
                        variant="ghost"
                        color="red.500"
                        aria-label="Remove item"
                        _hover={{ bg: "red.50" }}
                        onClick={() =>
                          handleRemoveItem(item.id, item.cart_row_id)
                        }
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    </HStack>
                  </Flex>
                ))}
              </VStack>

              <Box flex="1" w="full">
                <Box
                  bg="white"
                  p={6}
                  rounded="lg"
                  shadow="sm"
                  border="1px solid"
                  borderColor="gray.100"
                  position={{ lg: "sticky" }}
                  top="20px"
                >
                  <Heading size="md" mb={6} color="gray.800">
                    Order Summary
                  </Heading>

                  <VStack gap={4} align="stretch" mb={6}>
                    <HStack justify="space-between" color="gray.600">
                      <Text>Subtotal</Text>
                      <Text fontWeight="medium">
                        LKR {subtotal.toLocaleString()}
                      </Text>
                    </HStack>

                    <HStack justify="space-between" color="gray.600">
                      <Text>Shipping Estimate</Text>
                      <Text fontWeight="medium">
                        {shipping === 0 ? "Free" : `LKR ${shipping}`}
                      </Text>
                    </HStack>

                    <Separator borderColor="gray.200" />

                    <HStack
                      justify="space-between"
                      fontSize="lg"
                      fontWeight="bold"
                    >
                      <Text color="gray.800">Total</Text>
                      <Text color={THEME.primary}>
                        LKR {total.toLocaleString()}
                      </Text>
                    </HStack>
                  </VStack>

                  <Button
                    w="full"
                    bg={THEME.primary}
                    color={THEME.accent}
                    size="xl"
                    fontSize="lg"
                    _hover={{
                      bg: "green.800",
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.2s"
                    onClick={handleCheckout}
                    loading={checkoutLoading}
                    disabled={checkoutLoading}
                  >
                    {checkoutLoading ? "Placing Order..." : "Checkout"}
                  </Button>

                  <Text
                    fontSize="xs"
                    color="gray.500"
                    mt={4}
                    textAlign="center"
                  >
                    Your order will be sent to admin for delivery/COD
                    processing.
                  </Text>
                </Box>
              </Box>
            </Flex>
          )}

          {/* Order History */}
          <Box
            bg="white"
            rounded="2xl"
            shadow="sm"
            border="1px solid"
            borderColor="gray.100"
            p={{ base: 5, md: 6 }}
          >
            <HStack justify="space-between" mb={5}>
              <Box>
                <HStack color={THEME.primary}>
                  <PackageCheck size={22} />
                  <Heading size="md">My Orders</Heading>
                </HStack>

                <Text color="gray.600" fontSize="sm" mt={1}>
                  Track your checkout requests and delivery status.
                </Text>
              </Box>

              <Badge colorPalette="green" borderRadius="full" px={3}>
                {orders.length} Orders
              </Badge>
            </HStack>

            {ordersLoading ? (
              <Center py={10}>
                <Spinner color={THEME.primary} />
              </Center>
            ) : orders.length === 0 ? (
              <Box
                border="1px dashed"
                borderColor="gray.300"
                rounded="xl"
                p={8}
                textAlign="center"
              >
                <Text color="gray.500">No orders placed yet.</Text>
              </Box>
            ) : (
              <VStack align="stretch" gap={4}>
                {orders.map((order) => (
                  <Box
                    key={order.id}
                    bg="#F8FCF4"
                    rounded="xl"
                    border="1px solid"
                    borderColor="green.100"
                    p={5}
                  >
                    <Flex
                      justify="space-between"
                      align={{ base: "start", md: "center" }}
                      direction={{ base: "column", md: "row" }}
                      gap={3}
                      mb={4}
                    >
                      <Box>
                        <HStack>
                          <Text fontWeight="bold" color={THEME.primary}>
                            Order #{order.id}
                          </Text>

                          <Badge
                            colorPalette={getStatusColor(order.status)}
                            variant="solid"
                          >
                            {getStatusLabel(order.status)}
                          </Badge>
                        </HStack>

                        <Text fontSize="sm" color="gray.600" mt={1}>
                          Placed on{" "}
                          {new Date(order.created_at).toLocaleString()}
                        </Text>
                      </Box>

                      <Text fontWeight="bold" color={THEME.primary}>
                        LKR {Number(order.total_amount || 0).toLocaleString()}
                      </Text>
                    </Flex>

                    <HStack
                      bg="white"
                      rounded="lg"
                      p={3}
                      color={THEME.primary}
                      mb={4}
                    >
                      {getStatusIcon(order.status)}
                      <Text fontSize="sm">
                        {getStatusMessage(order.status)}
                      </Text>
                    </HStack>

                    {order.admin_note && (
                      <Box
                        bg="white"
                        borderLeft="4px solid"
                        borderColor="green.500"
                        rounded="lg"
                        p={3}
                        mb={4}
                      >
                        <Text
                          fontSize="sm"
                          fontWeight="bold"
                          color={THEME.primary}
                        >
                          Admin Note
                        </Text>
                        <Text fontSize="sm" color="gray.700" mt={1}>
                          {order.admin_note}
                        </Text>
                      </Box>
                    )}

                    <Stack gap={3}>
                      {(order.items || []).map((item: any) => (
                        <Flex
                          key={item.id}
                          justify="space-between"
                          align="center"
                          bg="white"
                          rounded="lg"
                          p={3}
                          gap={3}
                        >
                          <HStack>
                            <Image
                              src={
                                item.product_image || "https://placehold.co/60"
                              }
                              alt={item.product_name}
                              boxSize="52px"
                              rounded="md"
                              objectFit="cover"
                              bg="gray.100"
                            />

                            <Box>
                              <Text fontWeight="bold" color="gray.800">
                                {item.product_name}
                              </Text>
                              <Text fontSize="sm" color="gray.500">
                                Qty: {item.quantity} × LKR{" "}
                                {Number(
                                  item.product_price || 0,
                                ).toLocaleString()}
                              </Text>
                            </Box>
                          </HStack>

                          <Text fontWeight="bold" color={THEME.primary}>
                            LKR {Number(item.subtotal || 0).toLocaleString()}
                          </Text>
                        </Flex>
                      ))}
                    </Stack>
                  </Box>
                ))}
              </VStack>
            )}
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}

export default CartPage;
