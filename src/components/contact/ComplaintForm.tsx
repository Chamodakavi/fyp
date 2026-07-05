"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Input,
  Textarea,
  Button,
  Container,
  HStack,
  Icon,
  Stack,
  Badge,
  Flex,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import {
  AlertCircle,
  Send,
  MessageSquare,
  Clock,
  CheckCircle,
} from "lucide-react";
import { createClient } from "@/utils/supabase/createClient";
import { useUser } from "@/hooks/useUser";

type Complaint = {
  id: number;
  created_at: string;
  subject: string;
  body: string;
  status?: string;
  admin_reply?: string | null;
  replied_at?: string | null;
};

function ComplaintForm() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);

  const supabase = createClient();
  const { user, loading: loadingUser } = useUser();

  const fetchMyComplaints = async () => {
    if (!user?.id) return;

    setLoadingComplaints(true);

    try {
      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setComplaints(data || []);
    } catch (error: any) {
      console.error("Error fetching complaints:", error.message);
    } finally {
      setLoadingComplaints(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchMyComplaints();
    }

    if (!loadingUser && !user?.id) {
      setLoadingComplaints(false);
    }
  }, [user?.id, loadingUser]);

  const handleSubmit = async () => {
    if (!subject.trim() || !body.trim()) {
      alert("Please fill in both fields.");
      return;
    }

    if (!user?.id) {
      alert("Please login before submitting a message.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("complaints").insert([
        {
          subject: subject.trim(),
          body: body.trim(),
          user_id: user.id,
          user_name: user.u_name || "Unknown User",
          user_email: user.u_email || "No Email",
          status: "unread",
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      alert("Message sent successfully!");

      setSubject("");
      setBody("");

      await fetchMyComplaints();
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    if (status === "resolved") return "green";
    if (status === "replied") return "blue";
    if (status === "read") return "orange";
    return "red";
  };

  return (
    <Box bg="#FDF6E3" minH="100vh" py="10" px={{ base: 4, md: 8 }}>
      <Container maxW="6xl">
        <Stack gap="8">
          <Box textAlign={{ base: "left", md: "center" }}>
            <HStack
              color="#0F2B1D"
              mb="2"
              justify={{ base: "start", md: "center" }}
            >
              <Icon size="md">
                <AlertCircle />
              </Icon>
              <Heading size="2xl">Contact Support</Heading>
            </HStack>

            <Text color="gray.600" fontSize="sm">
              Submit an issue, report a problem, or send a suggestion to the
              admin team.
            </Text>
          </Box>

          <Flex gap="8" align="start" direction={{ base: "column", lg: "row" }}>
            {/* Submit Form */}
            <Box
              bg="white"
              p="6"
              borderRadius="2xl"
              shadow="md"
              flex="1"
              w="full"
              border="1px solid"
              borderColor="gray.100"
            >
              <VStack align="stretch" gap="4">
                <Box>
                  <Heading size="md" color="#0F2B1D">
                    Send New Message
                  </Heading>
                  <Text fontSize="sm" color="gray.500" mt="1">
                    Admin will review your message and reply if needed.
                  </Text>
                </Box>

                <Input
                  placeholder="Subject"
                  variant="subtle"
                  bg="gray.50"
                  h="12"
                  px="4"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  _focus={{ ring: "2px", ringColor: "#D4F2C4", bg: "white" }}
                />

                <Textarea
                  placeholder="Describe your issue, problem, or suggestion..."
                  variant="subtle"
                  bg="gray.50"
                  p="4"
                  minH="180px"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  _focus={{ ring: "2px", ringColor: "#D4F2C4", bg: "white" }}
                />

                <Button
                  bg="#16A34A"
                  color="white"
                  size="lg"
                  fontWeight="bold"
                  borderRadius="lg"
                  _hover={{ bg: "#15803D" }}
                  onClick={handleSubmit}
                  loading={loading}
                  disabled={loading || loadingUser}
                >
                  <HStack gap="2">
                    <Send size={16} />
                    <Text>{loading ? "Sending..." : "Send Message"}</Text>
                  </HStack>
                </Button>
              </VStack>
            </Box>

            {/* My Sent Messages */}
            <Box
              bg="white"
              p="6"
              borderRadius="2xl"
              shadow="md"
              flex="1"
              w="full"
              border="1px solid"
              borderColor="gray.100"
            >
              <HStack justify="space-between" mb="4">
                <Box>
                  <Heading size="md" color="#0F2B1D">
                    My Sent Messages
                  </Heading>
                  <Text fontSize="sm" color="gray.500" mt="1">
                    Track your submitted issues and admin replies.
                  </Text>
                </Box>

                <Badge colorPalette="green" borderRadius="full" px="3">
                  {complaints.length} Records
                </Badge>
              </HStack>

              {loadingComplaints ? (
                <HStack justify="center" py="10">
                  <Spinner />
                  <Text fontSize="sm" color="gray.500">
                    Loading messages...
                  </Text>
                </HStack>
              ) : complaints.length === 0 ? (
                <Box
                  border="1px dashed"
                  borderColor="gray.300"
                  borderRadius="xl"
                  p="8"
                  textAlign="center"
                  color="gray.500"
                >
                  <MessageSquare size={32} style={{ margin: "0 auto 12px" }} />
                  <Text>No messages sent yet.</Text>
                </Box>
              ) : (
                <VStack
                  align="stretch"
                  gap="4"
                  maxH="520px"
                  overflowY="auto"
                  pr="1"
                >
                  {complaints.map((item) => (
                    <Box
                      key={item.id}
                      bg="#F6FBF3"
                      borderRadius="xl"
                      p="4"
                      border="1px solid"
                      borderColor="green.100"
                    >
                      <HStack justify="space-between" align="start" mb="2">
                        <Box>
                          <Text fontWeight="bold" color="#0F2B1D">
                            {item.subject}
                          </Text>

                          <HStack color="gray.500" fontSize="xs" mt="1">
                            <Clock size={13} />
                            <Text>
                              {new Date(item.created_at).toLocaleString()}
                            </Text>
                          </HStack>
                        </Box>

                        <Badge
                          colorPalette={getStatusColor(item.status)}
                          variant="solid"
                          textTransform="capitalize"
                        >
                          {item.status || "unread"}
                        </Badge>
                      </HStack>

                      <Text
                        fontSize="sm"
                        color="gray.700"
                        whiteSpace="pre-wrap"
                      >
                        {item.body}
                      </Text>

                      {item.admin_reply && (
                        <Box
                          mt="4"
                          bg="white"
                          borderRadius="lg"
                          p="3"
                          borderLeft="4px solid"
                          borderColor="green.500"
                        >
                          <HStack color="green.700" mb="1">
                            <CheckCircle size={14} />
                            <Text fontSize="sm" fontWeight="bold">
                              Admin Reply
                            </Text>
                          </HStack>

                          <Text
                            fontSize="sm"
                            color="gray.700"
                            whiteSpace="pre-wrap"
                          >
                            {item.admin_reply}
                          </Text>

                          {item.replied_at && (
                            <Text fontSize="xs" color="gray.500" mt="2">
                              Replied:{" "}
                              {new Date(item.replied_at).toLocaleString()}
                            </Text>
                          )}
                        </Box>
                      )}
                    </Box>
                  ))}
                </VStack>
              )}
            </Box>
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
}

export default ComplaintForm;
