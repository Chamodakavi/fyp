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
} from "@chakra-ui/react";
import {
  MessageSquare,
  Calendar,
  User,
  Mail,
  CheckCircle,
  Eye,
  Reply,
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

function AdminComplaintsTable() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "unread" | "read" | "replied" | "resolved"
  >("all");

  const [replyText, setReplyText] = useState<Record<number, string>>({});
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
    } catch (error: any) {
      console.error("Error fetching complaints:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
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

  const sendReply = async (complaintId: number) => {
    const message = replyText[complaintId]?.trim();

    if (!message) {
      alert("Please enter a reply.");
      return;
    }

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

      setReplyText((prev) => ({
        ...prev,
        [complaintId]: "",
      }));

      await fetchComplaints();
      alert("Reply sent successfully!");
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

  if (loading) {
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
            <Table.Root variant="line" size="md">
              <Table.Header bg="#0F2B1D">
                <Table.Row>
                  <Table.ColumnHeader py="4" color="white">
                    Date & Time
                  </Table.ColumnHeader>
                  <Table.ColumnHeader py="4" color="white">
                    User
                  </Table.ColumnHeader>
                  <Table.ColumnHeader py="4" color="white">
                    Subject
                  </Table.ColumnHeader>
                  <Table.ColumnHeader py="4" color="white">
                    Details / Reply
                  </Table.ColumnHeader>
                  <Table.ColumnHeader py="4" color="white">
                    Status
                  </Table.ColumnHeader>
                  <Table.ColumnHeader py="4" color="white">
                    Actions
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {complaints.length === 0 ? (
                  <Table.Row>
                    <Table.Cell
                      colSpan={6}
                      textAlign="center"
                      py="20"
                      color="gray.400"
                    >
                      No complaints found.
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  complaints.map((item) => (
                    <Table.Row key={item.id} _hover={{ bg: "#F9FBF8" }}>
                      <Table.Cell w="190px" verticalAlign="top">
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

                      <Table.Cell w="220px" verticalAlign="top">
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
                        fontWeight="bold"
                        color="#0F2B1D"
                        verticalAlign="top"
                        w="220px"
                      >
                        {item.subject}
                      </Table.Cell>

                      <Table.Cell color="gray.700" fontSize="sm" py="4">
                        <VStack align="stretch" gap="3">
                          <Box>
                            <Text fontWeight="bold" color="#0F2B1D" mb="1">
                              User Message
                            </Text>
                            <Text whiteSpace="pre-wrap">{item.body}</Text>
                          </Box>

                          {item.admin_reply && (
                            <Box
                              bg="#F0FDF4"
                              p="3"
                              borderRadius="lg"
                              borderLeft="4px solid"
                              borderColor="green.500"
                            >
                              <Text fontWeight="bold" color="green.700" mb="1">
                                Admin Reply
                              </Text>
                              <Text whiteSpace="pre-wrap">
                                {item.admin_reply}
                              </Text>
                              {item.replied_at && (
                                <Text fontSize="xs" color="gray.500" mt="2">
                                  Replied at:{" "}
                                  {new Date(item.replied_at).toLocaleString()}
                                </Text>
                              )}
                            </Box>
                          )}

                          {item.status !== "resolved" && (
                            <Box>
                              <Textarea
                                placeholder="Type admin reply..."
                                size="sm"
                                minH="80px"
                                value={replyText[item.id] || ""}
                                onChange={(e) =>
                                  setReplyText((prev) => ({
                                    ...prev,
                                    [item.id]: e.target.value,
                                  }))
                                }
                              />

                              <Button
                                mt="2"
                                size="sm"
                                colorPalette="blue"
                                onClick={() => sendReply(item.id)}
                                loading={actionLoadingId === item.id}
                              >
                                <Reply size={14} />
                                Send Reply
                              </Button>
                            </Box>
                          )}
                        </VStack>
                      </Table.Cell>

                      <Table.Cell verticalAlign="top">
                        <Badge
                          colorPalette={getStatusColor(item.status)}
                          variant="solid"
                          textTransform="capitalize"
                        >
                          {item.status || "unread"}
                        </Badge>
                      </Table.Cell>

                      <Table.Cell verticalAlign="top">
                        <VStack align="stretch" gap="2">
                          {item.status === "unread" && (
                            <Button
                              size="xs"
                              colorPalette="orange"
                              variant="outline"
                              onClick={() =>
                                updateComplaintStatus(item.id, "read")
                              }
                              loading={actionLoadingId === item.id}
                            >
                              <Eye size={13} />
                              Mark Read
                            </Button>
                          )}

                          {item.status !== "resolved" && (
                            <Button
                              size="xs"
                              colorPalette="green"
                              variant="outline"
                              onClick={() =>
                                updateComplaintStatus(item.id, "resolved")
                              }
                              loading={actionLoadingId === item.id}
                            >
                              <CheckCircle size={13} />
                              Resolve
                            </Button>
                          )}
                        </VStack>
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
    </Box>
  );
}

export default AdminComplaintsTable;
