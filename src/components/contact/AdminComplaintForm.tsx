"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Heading,
  Container,
  Text,
  Stack,
  HStack,
  Icon,
  Spinner,
  Badge,
  Button,
  Textarea,
  VStack,
  Flex,
  Dialog,
  IconButton,
} from "@chakra-ui/react";
import {
  MessageSquare,
  Calendar,
  User,
  Mail,
  CheckCircle,
  Eye,
  Reply,
  X,
} from "lucide-react";
import { createClient } from "@/utils/supabase/createClient";

type Complaint = {
  id: number;
  created_at: string;
  subject: string;
  body: string;
  user_id?: string | null;
  user_name?: string | null;
  user_email?: string | null;
  status?: string | null;
  admin_reply?: string | null;
  replied_at?: string | null;
  read_at?: string | null;
};

// -----------------------------------------------------------------
// Chat Modal Component
// -----------------------------------------------------------------
function ChatModal({
  isOpen,
  onClose,
  complaint,
  onUpdateStatus,
  onSendReply,
  actionLoadingId,
  getStatusColor,
}: {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint | null;
  onUpdateStatus: (id: number, status: "read" | "resolved") => Promise<void>;
  onSendReply: (id: number, message: string) => Promise<void>;
  actionLoadingId: number | null;
  getStatusColor: (status?: string | null) => string;
}) {
  const [replyText, setReplyText] = useState("");

  // Reset reply text when modal opens for a different complaint
  useEffect(() => {
    if (isOpen) {
      setReplyText("");
    }
  }, [isOpen, complaint?.id]);

  if (!complaint) return null;

  const handleSend = async () => {
    if (!replyText.trim()) return;
    await onSendReply(complaint.id, replyText);
    setReplyText("");
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Dialog.Backdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <Dialog.Positioner>
        <Dialog.Content
          bg="white"
          borderRadius="xl"
          shadow="xl"
          maxW="2xl"
          w="full"
          mx="4"
          p="0"
          overflow="hidden"
        >
          {/* Modal Header */}
          <Dialog.Header bg="#0F2B1D" color="white" py="4" px="6">
            <Flex justify="space-between" align="center">
              <VStack align="start" gap="0">
                <Dialog.Title fontSize="lg" fontWeight="bold">
                  {complaint.subject}
                </Dialog.Title>
                <HStack fontSize="sm" color="gray.300" gap="4">
                  <HStack gap="1">
                    <User size={14} />
                    <Text>{complaint.user_name || "Unknown User"}</Text>
                  </HStack>
                  <HStack gap="1">
                    <Mail size={14} />
                    <Text>{complaint.user_email || "No email"}</Text>
                  </HStack>
                </HStack>
              </VStack>
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
            </Flex>
          </Dialog.Header>

          {/* Modal Body - Chat Area */}
          <Dialog.Body px="6" py="6" bg="#F9FBF8">
            <VStack align="stretch" gap="6">
              {/* Status & Actions Banner */}
              <Flex
                justify="space-between"
                align="center"
                bg="white"
                p="3"
                borderRadius="lg"
                shadow="sm"
                border="1px solid"
                borderColor="gray.100"
              >
                <HStack>
                  <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                    Status:
                  </Text>
                  <Badge
                    colorPalette={getStatusColor(complaint.status)}
                    variant="solid"
                    textTransform="capitalize"
                  >
                    {complaint.status || "unread"}
                  </Badge>
                </HStack>

                <HStack gap="2">
                  {complaint.status === "unread" && (
                    <Button
                      size="sm"
                      colorPalette="orange"
                      variant="outline"
                      onClick={() => onUpdateStatus(complaint.id, "read")}
                      loading={actionLoadingId === complaint.id}
                    >
                      <Eye size={14} />
                      Mark Read
                    </Button>
                  )}
                  {complaint.status !== "resolved" && (
                    <Button
                      size="sm"
                      colorPalette="green"
                      variant="solid"
                      onClick={() => onUpdateStatus(complaint.id, "resolved")}
                      loading={actionLoadingId === complaint.id}
                    >
                      <CheckCircle size={14} />
                      Resolve
                    </Button>
                  )}
                </HStack>
              </Flex>

              {/* User Message */}
              <Box
                bg="white"
                p="4"
                borderRadius="lg"
                shadow="sm"
                border="1px solid"
                borderColor="gray.100"
              >
                <HStack justify="space-between" mb="2">
                  <Text fontWeight="bold" color="#0F2B1D">
                    User Message
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    {new Date(complaint.created_at).toLocaleString()}
                  </Text>
                </HStack>
                <Text whiteSpace="pre-wrap" color="gray.700" fontSize="sm">
                  {complaint.body}
                </Text>
              </Box>

              {/* Admin Reply Chat Bubble */}
              {complaint.admin_reply && (
                <Box
                  bg="#F0FDF4"
                  p="4"
                  borderRadius="lg"
                  shadow="sm"
                  borderLeft="4px solid"
                  borderColor="green.500"
                  alignSelf="flex-end"
                  w="90%"
                >
                  <HStack justify="space-between" mb="2">
                    <Text fontWeight="bold" color="green.800">
                      Admin Reply
                    </Text>
                    {complaint.replied_at && (
                      <Text fontSize="xs" color="gray.500">
                        {new Date(complaint.replied_at).toLocaleString()}
                      </Text>
                    )}
                  </HStack>
                  <Text whiteSpace="pre-wrap" color="green.900" fontSize="sm">
                    {complaint.admin_reply}
                  </Text>
                </Box>
              )}
            </VStack>
          </Dialog.Body>

          {/* Modal Footer - Reply Area */}
          {complaint.status !== "resolved" && (
            <Box
              px="6"
              py="4"
              bg="white"
              borderTop="1px solid"
              borderColor="gray.100"
            >
              <VStack align="stretch" gap="3">
                <Text fontWeight="semibold" fontSize="sm" color="gray.700">
                  Write a Reply
                </Text>
                <Textarea
                  placeholder="Type your reply to the user here..."
                  size="md"
                  minH="100px"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <Flex justify="flex-end">
                  <Button
                    colorPalette="blue"
                    onClick={handleSend}
                    loading={actionLoadingId === complaint.id}
                    disabled={!replyText.trim()}
                  >
                    <Reply size={16} />
                    Send Reply
                  </Button>
                </Flex>
              </VStack>
            </Box>
          )}
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}

// -----------------------------------------------------------------
// Main Table Component
// -----------------------------------------------------------------
function AdminComplaintsTable() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "unread" | "read" | "replied" | "resolved"
  >("all");

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const supabase = createClient();

  const fetchComplaints = async () => {
    setLoading(true);

    try {
      let query = supabase
        .from("complaints")
        .select("*")
        .order("created_at", { ascending: false });

      if (selectedStatus !== "all") {
        query = query.eq("status", selectedStatus);
      }

      const { data, error } = await query;

      if (error) throw error;

      setComplaints(data || []);

      // Update selected complaint in modal if it's currently open
      if (selectedComplaint) {
        const updated = (data || []).find((c) => c.id === selectedComplaint.id);
        if (updated) setSelectedComplaint(updated);
      }
    } catch (error: any) {
      console.error("Error fetching complaints:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStatus]);

  const updateComplaintStatus = async (
    complaintId: number,
    status: "read" | "resolved",
  ) => {
    setActionLoadingId(complaintId);

    try {
      const updateData =
        status === "read"
          ? {
              status: "read",
              read_at: new Date().toISOString(),
            }
          : {
              status: "resolved",
            };

      const { error } = await supabase
        .from("complaints")
        .update(updateData)
        .eq("id", complaintId);

      if (error) throw error;

      await fetchComplaints();
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const sendReply = async (complaintId: number, message: string) => {
    setActionLoadingId(complaintId);

    try {
      const { error } = await supabase
        .from("complaints")
        .update({
          admin_reply: message,
          status: "replied",
          replied_at: new Date().toISOString(),
        })
        .eq("id", complaintId);

      if (error) throw error;

      await fetchComplaints();
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusColor = (status?: string | null) => {
    if (status === "resolved") return "green";
    if (status === "replied") return "blue";
    if (status === "read") return "orange";
    return "red";
  };

  const handleRowClick = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);

    // Auto-mark as read if clicked while unread
    if (complaint.status === "unread") {
      updateComplaintStatus(complaint.id, "read");
    }
  };

  if (loading && complaints.length === 0) {
    return (
      <HStack justify="center" pt="40">
        <Spinner color="#0F2B1D" size="xl" />
        <Text fontWeight="bold">Fetching Complaints...</Text>
      </HStack>
    );
  }

  return (
    <Box bg="#FDF6E3" minH="100vh" py="10" px={{ base: 4, md: 8 }}>
      <Container maxW="7xl">
        <Stack gap="8">
          <Box>
            <HStack color="#0F2B1D" mb="2">
              <Icon size="md">
                <MessageSquare />
              </Icon>
              <Heading size="3xl">System Complaints</Heading>
            </HStack>

            <Text color="gray.600">
              Review farmer issues, reply to users, and manage complaint status.
            </Text>
          </Box>

          <HStack gap="3" flexWrap="wrap">
            {(["all", "unread", "read", "replied", "resolved"] as const).map(
              (status) => (
                <Button
                  key={status}
                  size="sm"
                  borderRadius="full"
                  colorPalette={selectedStatus === status ? "green" : "gray"}
                  variant={selectedStatus === status ? "solid" : "outline"}
                  onClick={() => setSelectedStatus(status)}
                  textTransform="capitalize"
                >
                  {status}
                </Button>
              ),
            )}
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
              <Table.Header bg="#0F2B1D">
                <Table.Row color="black">
                  <Table.ColumnHeader py="4">Date & Time</Table.ColumnHeader>
                  <Table.ColumnHeader py="4">User</Table.ColumnHeader>
                  <Table.ColumnHeader py="4">Subject</Table.ColumnHeader>
                  <Table.ColumnHeader py="4">Status</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {complaints.length === 0 ? (
                  <Table.Row>
                    <Table.Cell
                      colSpan={4}
                      textAlign="center"
                      py="20"
                      color="gray.400"
                    >
                      No complaints found.
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  complaints.map((item) => (
                    <Table.Row
                      key={item.id}
                      _hover={{ bg: "#F9FBF8", cursor: "pointer" }}
                      onClick={() => handleRowClick(item)}
                    >
                      <Table.Cell w="200px">
                        <HStack gap="2" color="gray.500" fontSize="sm">
                          <Calendar size={14} />
                          <Box>
                            <Text>
                              {new Date(item.created_at).toLocaleDateString()}
                            </Text>
                            <Text fontSize="xs">
                              {new Date(item.created_at).toLocaleTimeString()}
                            </Text>
                          </Box>
                        </HStack>
                      </Table.Cell>

                      <Table.Cell w="250px">
                        <VStack align="start" gap="1">
                          <HStack color="#0F2B1D">
                            <User size={14} />
                            <Text fontWeight="bold" fontSize="sm">
                              {item.user_name || "Unknown User"}
                            </Text>
                          </HStack>
                          <HStack color="gray.500">
                            <Mail size={14} />
                            <Text fontSize="xs">
                              {item.user_email || "No email"}
                            </Text>
                          </HStack>
                        </VStack>
                      </Table.Cell>

                      <Table.Cell
                        fontWeight="medium"
                        color="#0F2B1D"
                        maxW="300px"
                      >
                        <Text truncate>{item.subject}</Text>
                      </Table.Cell>

                      <Table.Cell>
                        <Badge
                          colorPalette={getStatusColor(item.status)}
                          variant="solid"
                          textTransform="capitalize"
                        >
                          {item.status || "unread"}
                        </Badge>
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table.Root>
          </Box>

          <Flex justify="space-between" color="gray.500" fontSize="sm">
            <Text textTransform="capitalize">Showing: {selectedStatus}</Text>
            <Text>Total Records: {complaints.length}</Text>
          </Flex>
        </Stack>
      </Container>

      {/* Render the extracted Chat Modal */}
      <ChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        complaint={selectedComplaint}
        onUpdateStatus={updateComplaintStatus}
        onSendReply={sendReply}
        actionLoadingId={actionLoadingId}
        getStatusColor={getStatusColor}
      />
    </Box>
  );
}

export default AdminComplaintsTable;
