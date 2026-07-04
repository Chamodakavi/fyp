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
} from "@chakra-ui/react";
import { MessageSquare, Calendar, User } from "lucide-react";
import { createClient } from "@/utils/supabase/createClient";

function AdminComplaintsTable() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();
  // Fetch data on component mount
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data, error } = await supabase
          .from("complaints")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setComplaints(data || []);
      } catch (error: any) {
        console.error("Error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) {
    return (
      <HStack justify="center" pt="40">
        <Spinner color="#0F2B1D" size="xl" />
        <Text fontWeight="bold">Fetching Complaints...</Text>
      </HStack>
    );
  }

  return (
    <Box bg="#FDF6E3" minH="100vh" py="10">
      <Container maxW="5xl">
        <Stack gap="8">
          {/* Header */}
          <Box>
            <HStack color="#0F2B1D" mb="2">
              <Icon size="md">
                <MessageSquare />
              </Icon>
              <Heading size="3xl">System Complaints</Heading>
            </HStack>
            <Text color="gray.600">
              Review issues submitted via the farmer support portal.
            </Text>
          </Box>

          {/* Table Container */}
          <Box
            bg="white"
            borderRadius="xl"
            shadow="md"
            overflow="hidden"
            border="1px solid"
            borderColor="gray.100"
          >
            <Table.Root variant="line" size="lg">
              <Table.Header bg="#0F2B1D">
                <Table.Row>
                  <Table.ColumnHeader py="4">Date</Table.ColumnHeader>
                  <Table.ColumnHeader py="4">Subject</Table.ColumnHeader>
                  <Table.ColumnHeader py="4">Details</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {complaints.length === 0 ? (
                  <Table.Row>
                    <Table.Cell
                      colSpan={3}
                      textAlign="center"
                      py="20"
                      color="gray.400"
                    >
                      No complaints found in the database.
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  complaints.map((item) => (
                    <Table.Row key={item.id} _hover={{ bg: "#F9FBF8" }}>
                      <Table.Cell w="180px">
                        <HStack gap="2" color="gray.500" fontSize="sm">
                          <Calendar size={14} />
                          <Text>
                            {new Date(item.created_at).toLocaleDateString()}
                          </Text>
                        </HStack>
                      </Table.Cell>

                      <Table.Cell fontWeight="bold" color="#0F2B1D">
                        {item.subject}
                      </Table.Cell>

                      <Table.Cell color="gray.700" fontSize="sm" py="4">
                        {item.body}
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table.Root>
          </Box>

          <Text textAlign="right" fontSize="xs" color="gray.400">
            Total Records: {complaints.length}
          </Text>
        </Stack>
      </Container>
    </Box>
  );
}

export default AdminComplaintsTable;
