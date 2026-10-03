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
  Table,
  Dialog,
  IconButton,
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
  X,
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

// -----------------------------------------------------------------
// Order Modal Component
// -----------------------------------------------------------------
function OrderModal({
  isOpen,
  onClose,
  order,
  onUpdateStatus,
  onSaveNote,
  actionLoadingId,
}: {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdateStatus: (
    id: number,
    status: "processing" | "handed_over" | "delivered" | "cancelled",
  ) => Promise<void>;
  onSaveNote: (id: number, note: string) => Promise<void>;
  actionLoadingId: number | null;
}) {
  const [noteText, setNoteText] = useState("");

  // Initialize or reset note text when modal opens
  useEffect(() => {
    if (isOpen && order) {
      setNoteText("");
    }
  }, [isOpen, order?.id]);

  if (!order) return null;

  const handleSaveNote = async () => {
    if (!noteText.trim()) return;
    await onSaveNote(order.id, noteText);
    setNoteText("");
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Dialog.Backdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <Dialog.Positioner>
        <Dialog.Content
          bg="white"
          borderRadius="xl"
          shadow="xl"
          maxW="4xl"
          w="full"
          mx="4"
          p="0"
          overflow="hidden"
        >
          {/* Modal Header */}
          <Dialog.Header bg={THEME.darkGreen} color="white" py="4" px="6">
            <Flex justify="space-between" align="center">
              <VStack align="start" gap="1">
                <HStack>
                  <Dialog.Title fontSize="xl" fontWeight="bold">
                    Order #{order.id}
                  </Dialog.Title>
                  <Badge
                    colorPalette={getStatusColor(order.status)}
                    variant="solid"
                    textTransform="capitalize"
                  >
                    {getStatusLabel(order.status)}
                  </Badge>
                </HStack>
                <HStack fontSize="sm" color="green.100" gap="1">
                  <Calendar size={14} />
                  <Text>{new Date(order.created_at).toLocaleString()}</Text>
                </HStack>
              </VStack>

              <HStack gap="4">
                <Box textAlign="right" display={{ base: "none", md: "block" }}>
                  <Text fontSize="xs" color="green.100">
                    Total Amount
                  </Text>
                  <Text fontWeight="bold" fontSize="lg">
                    LKR {Number(order.total_amount || 0).toLocaleString()}
                  </Text>
                </Box>
                <Dialog.CloseTrigger asChild>
                  <IconButton
                    variant="ghost"
                    color="white"
                    _hover={{ bg: "whiteAlpha.200" }}
                    onClick={onClose}
                  >
                    <X size={20} />
                  </IconButton>
                </Dialog.CloseTrigger>
              </HStack>
            </Flex>
          </Dialog.Header>

          {/* Modal Body */}
          <Dialog.Body px="6" py="6" bg="gray.50" maxH="75vh" overflowY="auto">
            <Flex
              gap="6"
              direction={{ base: "column", lg: "row" }}
              align="start"
            >
              {/* Left Column: Customer & Items */}
              <Box flex="1" w="full">
                {/* Customer Details */}
                <Box
                  bg="white"
                  p="5"
                  borderRadius="xl"
                  shadow="sm"
                  border="1px solid"
                  borderColor="gray.100"
                  mb="5"
                >
                  <Heading size="sm" color={THEME.darkGreen} mb="3">
                    Customer Details
                  </Heading>
                  <VStack align="start" gap="2" color="gray.700" fontSize="sm">
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
                </Box>

                {/* Order Items */}
                <Heading size="sm" color={THEME.darkGreen} mb="3">
                  Order Items
                </Heading>
                <VStack align="stretch" gap="3">
                  {(order.items || []).map((item) => (
                    <Flex
                      key={item.id}
                      bg="white"
                      borderRadius="xl"
                      shadow="sm"
                      border="1px solid"
                      borderColor="gray.100"
                      p="3"
                      justify="space-between"
                      align="center"
                      gap="3"
                    >
                      <HStack>
                        <Image
                          src={item.product_image || "https://placehold.co/60"}
                          alt={item.product_name}
                          boxSize="56px"
                          borderRadius="lg"
                          objectFit="cover"
                          bg="gray.100"
                        />
                        <Box>
                          <Text
                            fontWeight="bold"
                            fontSize="sm"
                            color={THEME.darkGreen}
                          >
                            {item.product_name}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            Qty: {item.quantity} × LKR{" "}
                            {Number(item.product_price || 0).toLocaleString()}
                          </Text>
                        </Box>
                      </HStack>
                      <Text
                        fontWeight="bold"
                        fontSize="sm"
                        color={THEME.darkGreen}
                      >
                        LKR {Number(item.subtotal || 0).toLocaleString()}
                      </Text>
                    </Flex>
                  ))}
                </VStack>
              </Box>

              {/* Right Column: Management Actions & Notes */}
              <Box
                w={{ base: "full", lg: "340px" }}
                bg="white"
                borderRadius="xl"
                shadow="sm"
                border="1px solid"
                borderColor="gray.100"
                p="5"
                flexShrink={0}
              >
                <Heading size="sm" color={THEME.darkGreen} mb="4">
                  Order Management
                </Heading>
                <VStack align="stretch" gap="3" mb="6">
                  <Button
                    size="sm"
                    colorPalette="orange"
                    variant="outline"
                    onClick={() => onUpdateStatus(order.id, "processing")}
                    loading={actionLoadingId === order.id}
                    disabled={
                      order.status === "processing" ||
                      order.status === "cancelled"
                    }
                  >
                    <Clock size={16} />
                    Mark Processing
                  </Button>
                  <Button
                    size="sm"
                    colorPalette="blue"
                    variant="outline"
                    onClick={() => onUpdateStatus(order.id, "handed_over")}
                    loading={actionLoadingId === order.id}
                    disabled={
                      order.status === "handed_over" ||
                      order.status === "cancelled"
                    }
                  >
                    <Truck size={16} />
                    Mark Handed Over
                  </Button>
                  <Button
                    size="sm"
                    colorPalette="green"
                    variant="outline"
                    onClick={() => onUpdateStatus(order.id, "delivered")}
                    loading={actionLoadingId === order.id}
                    disabled={
                      order.status === "delivered" ||
                      order.status === "cancelled"
                    }
                  >
                    <CheckCircle size={16} />
                    Mark Delivered
                  </Button>
                  <Button
                    size="sm"
                    colorPalette="red"
                    variant="outline"
                    onClick={() => onUpdateStatus(order.id, "cancelled")}
                    loading={actionLoadingId === order.id}
                    disabled={order.status === "cancelled"}
                  >
                    <XCircle size={16} />
                    Cancel Order
                  </Button>
                </VStack>

                <Separator mb="5" />

                <Heading size="sm" color={THEME.darkGreen} mb="3">
                  Admin Note
                </Heading>
                {order.admin_note && (
                  <Box
                    bg={THEME.softGreen}
                    borderLeft="4px solid"
                    borderColor="green.500"
                    borderRadius="md"
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
                  size="sm"
                  minH="80px"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <Button
                  mt="3"
                  w="full"
                  size="sm"
                  colorPalette="green"
                  onClick={handleSaveNote}
                  loading={actionLoadingId === order.id}
                  disabled={!noteText.trim()}
                >
                  Save Note
                </Button>
              </Box>
            </Flex>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}

// -----------------------------------------------------------------
// Main Table Component
// -----------------------------------------------------------------
function AdminOrdersPage() {
  const supabase = createClient();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "pending" | "processing" | "handed_over" | "delivered" | "cancelled"
  >("all");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

      if (orderError) throw orderError;

      const orderIds = (orderData || []).map((order) => order.id);

      if (orderIds.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const { data: itemData, error: itemError } = await supabase
        .from("order_items")
        .select("*")
        .in("order_id", orderIds);

      if (itemError) throw itemError;

      const ordersWithItems = (orderData || []).map((order) => ({
        ...order,
        items: (itemData || []).filter((item) => item.order_id === order.id),
      }));

      setOrders(ordersWithItems);

      // Keep modal in sync if open
      if (selectedOrder) {
        const updatedOrder = ordersWithItems.find(
          (o) => o.id === selectedOrder.id,
        );
        if (updatedOrder) setSelectedOrder(updatedOrder);
      }
    } catch (error: any) {
      console.error("Error fetching orders:", error.message);
      alert("Failed to fetch orders: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      if (error) throw error;

      await fetchOrders();
    } catch (error: any) {
      alert("Failed to update order: " + error.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const saveAdminNote = async (orderId: number, note: string) => {
    setActionLoadingId(orderId);

    try {
      const { error } = await supabase
        .from("orders")
        .update({
          admin_note: note,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) throw error;

      await fetchOrders();
    } catch (error: any) {
      alert("Failed to save note: " + error.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRowClick = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  if (loading && orders.length === 0) {
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

          <Box
            bg="white"
            borderRadius="2xl"
            shadow="md"
            overflow="hidden"
            border="1px solid"
            borderColor="gray.100"
          >
            <Table.Root variant="line" size="md" interactive>
              <Table.Header bg={THEME.darkGreen}>
                <Table.Row>
                  <Table.ColumnHeader py="4" color="black">
                    Order ID
                  </Table.ColumnHeader>
                  <Table.ColumnHeader py="4" color="black">
                    Date & Time
                  </Table.ColumnHeader>
                  <Table.ColumnHeader py="4" color="black">
                    Customer
                  </Table.ColumnHeader>
                  <Table.ColumnHeader py="4" color="black">
                    Total Amount
                  </Table.ColumnHeader>
                  <Table.ColumnHeader py="4" color="black">
                    Status
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {orders.length === 0 ? (
                  <Table.Row>
                    <Table.Cell
                      colSpan={5}
                      textAlign="center"
                      py="20"
                      color="gray.400"
                    >
                      <PackageCheck
                        size={32}
                        style={{ margin: "0 auto 8px", opacity: 0.5 }}
                      />
                      No orders found for this status.
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  orders.map((order) => (
                    <Table.Row
                      key={order.id}
                      _hover={{ bg: "#F9FBF8", cursor: "pointer" }}
                      onClick={() => handleRowClick(order)}
                    >
                      <Table.Cell fontWeight="bold" color={THEME.darkGreen}>
                        #{order.id}
                      </Table.Cell>

                      <Table.Cell w="200px">
                        <HStack gap="2" color="gray.500" fontSize="sm">
                          <Calendar size={14} />
                          <Box>
                            <Text>
                              {new Date(order.created_at).toLocaleDateString()}
                            </Text>
                            <Text fontSize="xs">
                              {new Date(order.created_at).toLocaleTimeString()}
                            </Text>
                          </Box>
                        </HStack>
                      </Table.Cell>

                      <Table.Cell w="250px">
                        <VStack align="start" gap="1">
                          <HStack color={THEME.darkGreen}>
                            <User size={14} />
                            <Text fontWeight="bold" fontSize="sm">
                              {order.user_name || "Unknown User"}
                            </Text>
                          </HStack>
                          <HStack color="gray.500">
                            <Mail size={14} />
                            <Text fontSize="xs">
                              {order.user_email || "No email"}
                            </Text>
                          </HStack>
                        </VStack>
                      </Table.Cell>

                      <Table.Cell fontWeight="bold">
                        LKR {Number(order.total_amount || 0).toLocaleString()}
                      </Table.Cell>

                      <Table.Cell>
                        <Badge
                          colorPalette={getStatusColor(order.status)}
                          variant="solid"
                          textTransform="capitalize"
                        >
                          {getStatusLabel(order.status)}
                        </Badge>
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table.Root>
          </Box>

          <Text textAlign="right" color="gray.500" fontSize="sm">
            Total Records: {orders.length}
          </Text>
        </Stack>
      </Container>

      {/* Render the extracted Order Modal */}
      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onUpdateStatus={updateOrderStatus}
        onSaveNote={saveAdminNote}
        actionLoadingId={actionLoadingId}
      />
    </Box>
  );
}

export default AdminOrdersPage;
