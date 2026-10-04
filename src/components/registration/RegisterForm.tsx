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

const DashboardCard = ({ children, bg = "orange.100", ...props }: any) => (
  <Box bg={bg} borderRadius="2xl" p={6} boxShadow="sm" {...props}>
    {children}
  </Box>
);

const RegisterForm = () => {
  const [amount, setAmount] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("");
  const [availableCrops, setAvailableCrops] = useState<string[]>([]);
  const [loadingCrops, setLoadingCrops] = useState(true);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [farmerId, setFarmerId] = useState<string | null>(null);

  useEffect(() => {
    const initializeForm = async () => {
      const supabase = createClient();

      // 1. Fetch User
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setFarmerId(user.id);
      } else {
        setFeedback({ type: "error", message: "Please Log In to Register." });
      }

      // 2. Fetch Active Crops from national_targets
      const { data: targets, error } = await supabase
        .from("national_targets")
        .select("crop_name");

      if (!error && targets) {
        // Extract unique crop names and sort them alphabetically
        const uniqueCrops = Array.from(
          new Set(targets.map((t) => t.crop_name.toUpperCase())),
        ).sort();

        setAvailableCrops(uniqueCrops);
        if (uniqueCrops.length > 0) {
          setSelectedCrop(uniqueCrops[0]);
        }
      }
      setLoadingCrops(false);
    };

    initializeForm();
  }, []);

  const handleRegister = async () => {
    setFeedback({ type: null, message: "" });

    if (!farmerId) {
      setFeedback({
        type: "error",
        message: "You must be logged in to register!",
      });
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setFeedback({ type: "error", message: "Please enter a valid amount." });
      return;
    }

    if (!selectedCrop) {
      setFeedback({ type: "error", message: "Please select a crop." });
      return;
    }

    setLoading(true);

    try {
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
          {loadingCrops ? (
            <Flex
              align="center"
              gap={3}
              p={2}
              bg="gray.50"
              borderRadius="md"
              h="45px"
            >
              <Spinner size="sm" color="green.500" />
              <Text fontSize="sm" color="gray.500">
                Loading active targets...
              </Text>
            </Flex>
          ) : availableCrops.length === 0 ? (
            <Text color="red.500" fontSize="sm">
              No active crop targets available at the moment.
            </Text>
          ) : (
            <NativeSelect.Root size="lg" variant="subtle">
              <NativeSelect.Field
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.currentTarget.value)}
                bg="gray.50"
              >
                {availableCrops.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          )}
        </Box>

        <Box>
          <Text fontWeight="bold" mb={2}>
            Expected Harvest Amount (MT)
          </Text>
          <Input
            size="lg"
            type="number"
            placeholder="e.g. 100"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            bg="gray.50"
          />
        </Box>

        <Button
          size="lg"
          colorPalette="green"
          onClick={handleRegister}
          disabled={loading || !farmerId || availableCrops.length === 0}
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
