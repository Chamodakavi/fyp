"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  Badge,
  Input,
  Button,
  NativeSelect,
  Spinner,
} from "@chakra-ui/react";
import { CheckCircle, XCircle } from "lucide-react";
import { cropManager } from "@/utils/cropManager/cropManager";
import { createClient } from "@/utils/supabase/createClient";

// Array of all available crops
const CROP_LIST = [
  "ASH PLANTAINS",
  "BEETROOT",
  "BITTER GOURD",
  "BRINJALS",
  "CABBAGE",
  "CAPSICUM",
  "CARROT",
  "CUCUMBER",
  "LEEKS",
  "LUFFA",
  "RADDISH",
  "TOMATOES",
];

const DashboardCard = ({ children, bg = "orange.100", ...props }: any) => (
  <Box bg={bg} borderRadius="2xl" p={6} boxShadow="sm" {...props}>
    {children}
  </Box>
);

const RegisterForm = () => {
  const [amount, setAmount] = useState("");
  // Initialize with the first crop in the list
  const [selectedCrop, setSelectedCrop] = useState(CROP_LIST[0]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // 🔐 1. STATE FOR THE LOGGED-IN FARMER
  const [farmerId, setFarmerId] = useState<string | null>(null);

  // 🔐 2. FETCH THE REAL USER ON LOAD
  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setFarmerId(user.id);
        console.log("Logged in as Farmer:", user.id);
      } else {
        setFeedback({ type: "error", message: "Please Log In to Register." });
      }
    };
    getUser();
  }, []);

  const handleRegister = async () => {
    setFeedback({ type: null, message: "" });

    // 🔐 3. CHECK IF LOGGED IN
    if (!farmerId) {
      setFeedback({
        type: "error",
        message: "You must be logged in to register!",
      });
      return;
    }

    if (!amount) {
      setFeedback({ type: "error", message: "Please enter a valid amount." });
      return;
    }

    setLoading(true);

    try {
      // 🚜 4. SEND REAL FARMER ID TO SUPABASE
      const result = await cropManager.registerCrop(
        farmerId,
        selectedCrop,
        Number(amount),
      );

      setLoading(false);

      if (result.status === "approved") {
        setFeedback({
          type: "success",
          message: `✅ Approved! ${result.message}`,
        });
        setAmount("");
      } else {
        setFeedback({
          type: "error",
          message: `❌ Rejected: ${result.message}`,
        });
      }
    } catch (e) {
      setLoading(false);
      setFeedback({
        type: "error",
        message: "System Error. Check connection.",
      });
    }
  };

  return (
    <DashboardCard bg="white" w="full" maxW="2xl" mx="auto">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" fontWeight="bold" color="green.700">
          🚜 Register Harvest Quota
        </Heading>
        {/* Show User Status Badge */}
        <Badge colorPalette={farmerId ? "green" : "red"} variant="solid">
          {farmerId ? "🟢 Farmer Authenticated" : "🔴 Guest (Read Only)"}
        </Badge>
      </Flex>

      <VStack gap={5} align="stretch">
        <Box
          bg="green.50"
          p={4}
          borderRadius="xl"
          border="1px dashed"
          borderColor="green.300"
        >
          <Text>Register your crops to secure price.</Text>
        </Box>

        <Box>
          <Text fontWeight="bold" mb={2}>
            Select Crop
          </Text>
          <NativeSelect.Root size="lg" variant="subtle">
            <NativeSelect.Field
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.currentTarget.value)}
              bg="gray.50"
            >
              {CROP_LIST.map((crop) => (
                <option key={crop} value={crop}>
                  {crop}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Box>

        <Box>
          <Text fontWeight="bold" mb={2}>
            Amount to Grow (Hectare)
          </Text>
          <Input
            size="lg"
            type="number"
            placeholder="e.g. 2.5"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            bg="gray.50"
          />
        </Box>

        <Button
          size="lg"
          colorPalette="green"
          onClick={handleRegister}
          disabled={loading || !farmerId} // Disable if not logged in
          w="full"
          mt={2}
        >
          {loading ? <Spinner size="sm" /> : "Check & Register"}
        </Button>

        {/* Feedback Message */}
        {feedback.type && (
          <Flex
            bg={feedback.type === "success" ? "green.50" : "red.50"}
            p={3}
            borderRadius="md"
            align="center"
            gap={2}
          >
            {feedback.type === "success" ? (
              <CheckCircle size={18} color="green" />
            ) : (
              <XCircle size={18} color="red" />
            )}
            <Text
              fontSize="sm"
              fontWeight="medium"
              color={feedback.type === "success" ? "green.700" : "red.700"}
            >
              {feedback.message}
            </Text>
          </Flex>
        )}
      </VStack>
    </DashboardCard>
  );
};

export default RegisterForm;
