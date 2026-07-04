"use client";

import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { AlertCircle, Send } from "lucide-react";
import { createClient } from "@/utils/supabase/createClient";

function ComplaintForm() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleSubmit = async () => {
    if (!subject || !body) {
      alert("Please fill in both fields.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("complaints").insert([
        {
          subject: subject,
          body: body,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      alert("Complaint Sent Successfully!");

      // Clear fields
      setSubject("");
      setBody("");
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="#FDF6E3" minH="100vh" py="10">
      <Container maxW="md">
        <Stack gap="8">
          {/* Header Section */}
          <Box>
            <HStack color="#0F2B1D" mb="2">
              <Icon size="md">
                <AlertCircle />
              </Icon>
              <Heading size="2xl">Submit a Complaint</Heading>
            </HStack>
            <Text color="gray.600" fontSize="sm">
              Please describe the issue with your harvest or order below.
            </Text>
          </Box>

          {/* Form Box */}
          <Box bg="white" p="6" borderRadius="xl" shadow="sm">
            <Stack gap="4">
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
                placeholder="Describe your issue..."
                variant="subtle"
                bg="gray.50"
                p="4"
                minH="180px"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                _focus={{ ring: "2px", ringColor: "#D4F2C4", bg: "white" }}
              />

              <Button
                bg="#D4F2C4"
                color="#0F2B1D"
                size="lg"
                fontWeight="bold"
                borderRadius="lg"
                _hover={{ bg: "#C1E8AE" }}
                onClick={handleSubmit}
                //  isLoading={loading}
              >
                <HStack gap="2">
                  <Send size={16} />
                  <Text>Send Complaint</Text>
                </HStack>
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

export default ComplaintForm;
