"use client";

import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  HStack,
  Image,
  Separator,
  Spinner,
  Stack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import {
  Calendar,
  CheckCircle,
  Clock,
  Mail,
  PackageCheck,
  Phone,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import { createClient } from "@/utils/supabase/createClient";

type OrderItem = {
  id: number;
  order_id: number;
  product_id: string;
  product_name: string;
  product_image?: string;
  product_price: number;
  quantity: number;
  subtotal: number;
};

type Order = {
  id: number;
  user_id: string;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  total_amount: number;
  shipping_amount: number;
  status: string;
  admin_note?: string;
  created_at: string;
  updated_at?: string;
  items?: OrderItem[];
};

const THEME = {
  bg: "#FDF6E3",
  darkGreen: "#0F2B1D",
  softGreen: "#F0FDF4",
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

function AdminOrdersPage() {
  const supabase = createClient();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "pending" | "processing" | "handed_over" | "delivered" | "cancelled"
  >("all");
  const [noteText, setNoteText] = useState<Record<number, string>>({});
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const fetchOrders = async () => {
    setLoading(true);

    try {
      let orderQuery = supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (selectedStatus !== "all") {
        orderQuery = orderQuery.eq("status", selectedStatus);
      }

      const { data: orderData, error: orderError } = await orderQuery;

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
      alert("Failed to fetch orders: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const updateOrderStatus = async (
    orderId: number,
    status: "processing" | "handed_over" | "delivered" | "cancelled",
  ) => {
    setActionLoadingId(orderId);

    try {
      const { error } = await supabase
        .from("orders")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) {
        throw error;
      }

      await fetchOrders();
    } catch (error: any) {
      alert("Failed to update order: " + error.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const saveAdminNote = async (orderId: number) => {
    const note = noteText[orderId]?.trim();

    if (!note) {
      alert("Please type an admin note first.");
      return;
    }

    setActionLoadingId(orderId);

    try {
      const { error } = await supabase
        .from("orders")
        .update({
          admin_note: note,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) {
        throw error;
      }

      setNoteText((prev) => ({
        ...prev,
        [orderId]: "",
      }));

      await fetchOrders();
      alert("Admin note saved.");
    } catch (error: any) {
      alert("Failed to save note: " + error.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <Center minH="100vh" bg={THEME.bg}>
        <HStack>
          <Spinner color={THEME.darkGreen} size="xl" />
          <Text fontWeight="bold">Loading orders...</Text>
        </HStack>
      </Center>
    );
  }

  return (
    <Box bg={THEME.bg} minH="100vh" py="10" px={{ base: 4, md: 8 }}>
      <Container maxW="7xl">
        <Stack gap="8">
          <Box>
            <HStack color={THEME.darkGreen} mb="2">
              <PackageCheck size={28} />
              <Heading size="3xl">Customer Orders</Heading>
            </HStack>

            <Text color="gray.600">
              Review checkout requests, update delivery status, and add admin
              notes.
            </Text>
          </Box>

          <HStack gap="3" flexWrap="wrap">
            {(
              [
                "all",
                "pending",
                "processing",
                "handed_over",
                "delivered",
                "cancelled",
              ] as const
            ).map((status) => (
              <Button
                key={status}
                size="sm"
                borderRadius="full"
                colorPalette={selectedStatus === status ? "green" : "gray"}
                variant={selectedStatus === status ? "solid" : "outline"}
                onClick={() => setSelectedStatus(status)}
                textTransform="capitalize"
              >
                {status === "handed_over" ? "Handed Over" : status}
              </Button>
            ))}
          </HStack>

          {orders.length === 0 ? (
            <Box
              bg="white"
              borderRadius="2xl"
              shadow="md"
              p="12"
              textAlign="center"
            >
              <PackageCheck size={42} style={{ margin: "0 auto 12px" }} />
              <Heading size="md" color={THEME.darkGreen}>
                No orders found
              </Heading>
              <Text color="gray.500" mt="2">
                Orders will appear here after users checkout from the cart.
              </Text>
            </Box>
          ) : (
            <VStack align="stretch" gap="5">
              {orders.map((order) => (
                <Box
                  key={order.id}
                  bg="white"
                  borderRadius="2xl"
                  shadow="md"
                  border="1px solid"
                  borderColor="gray.100"
                  overflow="hidden"
                >
                  <Flex
                    bg={THEME.darkGreen}
                    color="white"
                    p="5"
                    justify="space-between"
                    align={{ base: "start", md: "center" }}
                    direction={{ base: "column", md: "row" }}
                    gap="4"
                  >
                    <Box>
                      <HStack>
                        <Heading size="md">Order #{order.id}</Heading>
                        <Badge
                          colorPalette={getStatusColor(order.status)}
                          variant="solid"
                          textTransform="capitalize"
                        >
                          {getStatusLabel(order.status)}
                        </Badge>
                      </HStack>

                      <HStack color="green.100" fontSize="sm" mt="2">
                        <Calendar size={15} />
                        <Text>
                          {new Date(order.created_at).toLocaleString()}
                        </Text>
                      </HStack>
                    </Box>

                    <Box textAlign={{ base: "left", md: "right" }}>
                      <Text fontSize="sm" color="green.100">
                        Total Amount
                      </Text>
                      <Heading size="lg">
                        LKR {Number(order.total_amount || 0).toLocaleString()}
                      </Heading>
                    </Box>
                  </Flex>

                  <Box p="5">
                    <Flex
                      gap="6"
                      direction={{ base: "column", lg: "row" }}
                      align="start"
                    >
                      <Box flex="1">
                        <Heading size="sm" color={THEME.darkGreen} mb="3">
                          Customer Details
                        </Heading>

                        <VStack align="start" gap="2" color="gray.700">
                          <HStack>
                            <User size={16} />
                            <Text fontWeight="bold">
                              {order.user_name || "Unknown User"}
                            </Text>
                          </HStack>

                          <HStack>
                            <Mail size={16} />
                            <Text>{order.user_email || "No email"}</Text>
                          </HStack>

                          <HStack>
                            <Phone size={16} />
                            <Text>{order.user_phone || "No phone"}</Text>
                          </HStack>
                        </VStack>

                        <Separator my="5" />

                        <Heading size="sm" color={THEME.darkGreen} mb="3">
                          Order Items
                        </Heading>

                        <VStack align="stretch" gap="3">
                          {(order.items || []).map((item) => (
                            <Flex
                              key={item.id}
                              bg="#F8FCF4"
                              borderRadius="xl"
                              p="3"
                              justify="space-between"
                              align="center"
                              gap="3"
                            >
                              <HStack>
                                <Image
                                  src={
                                    item.product_image ||
                                    "https://placehold.co/60"
                                  }
                                  alt={item.product_name}
                                  boxSize="56px"
                                  borderRadius="lg"
                                  objectFit="cover"
                                  bg="gray.100"
                                />

                                <Box>
                                  <Text
                                    fontWeight="bold"
                                    color={THEME.darkGreen}
                                  >
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

                              <Text fontWeight="bold" color={THEME.darkGreen}>
                                LKR{" "}
                                {Number(item.subtotal || 0).toLocaleString()}
                              </Text>
                            </Flex>
                          ))}
                        </VStack>
                      </Box>

                      <Box
                        w={{ base: "full", lg: "360px" }}
                        bg="#F8FCF4"
                        borderRadius="xl"
                        p="4"
                      >
                        <Heading size="sm" color={THEME.darkGreen} mb="3">
                          Order Management
                        </Heading>

                        <VStack align="stretch" gap="3">
                          <Button
                            colorPalette="orange"
                            variant="outline"
                            onClick={() =>
                              updateOrderStatus(order.id, "processing")
                            }
                            loading={actionLoadingId === order.id}
                            disabled={order.status === "processing"}
                          >
                            <Clock size={16} />
                            Mark Processing
                          </Button>

                          <Button
                            colorPalette="blue"
                            variant="outline"
                            onClick={() =>
                              updateOrderStatus(order.id, "handed_over")
                            }
                            loading={actionLoadingId === order.id}
                            disabled={order.status === "handed_over"}
                          >
                            <Truck size={16} />
                            Mark Handed Over
                          </Button>

                          <Button
                            colorPalette="green"
                            variant="outline"
                            onClick={() =>
                              updateOrderStatus(order.id, "delivered")
                            }
                            loading={actionLoadingId === order.id}
                            disabled={order.status === "delivered"}
                          >
                            <CheckCircle size={16} />
                            Mark Delivered
                          </Button>

                          <Button
                            colorPalette="red"
                            variant="outline"
                            onClick={() =>
                              updateOrderStatus(order.id, "cancelled")
                            }
                            loading={actionLoadingId === order.id}
                            disabled={order.status === "cancelled"}
                          >
                            <XCircle size={16} />
                            Cancel Order
                          </Button>
                        </VStack>

                        <Separator my="5" />

                        <Heading size="sm" color={THEME.darkGreen} mb="3">
                          Admin Note
                        </Heading>

                        {order.admin_note && (
                          <Box
                            bg="white"
                            borderLeft="4px solid"
                            borderColor="green.500"
                            borderRadius="lg"
                            p="3"
                            mb="3"
                          >
                            <Text fontSize="sm" color="gray.700">
                              {order.admin_note}
                            </Text>
                          </Box>
                        )}

                        <Textarea
                          placeholder="Add note for user..."
                          bg="white"
                          value={noteText[order.id] || ""}
                          onChange={(e) =>
                            setNoteText((prev) => ({
                              ...prev,
                              [order.id]: e.target.value,
                            }))
                          }
                        />

                        <Button
                          mt="3"
                          w="full"
                          colorPalette="green"
                          onClick={() => saveAdminNote(order.id)}
                          loading={actionLoadingId === order.id}
                        >
                          Save Note
                        </Button>
                      </Box>
                    </Flex>
                  </Box>
                </Box>
              ))}
            </VStack>
          )}

          <Text textAlign="right" color="gray.500" fontSize="sm">
            Total Records: {orders.length}
          </Text>
        </Stack>
      </Container>
    </Box>
  );
}

export default AdminOrdersPage;
