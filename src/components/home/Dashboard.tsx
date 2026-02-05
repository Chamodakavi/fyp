"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  SimpleGrid,
  Heading,
  Text,
  Image,
  HStack,
  VStack,
  Badge,
  Input,
  Button,
  NativeSelect,
  Separator,
  Spinner,
} from "@chakra-ui/react";
import {
  Wind,
  Droplets,
  Sprout,
  Tractor,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { cropManager } from "@/utils/cropManager/cropManager";
import { createClient } from "@/utils/supabase/createClient";

const DashboardCard = ({ children, bg = "orange.100", ...props }: any) => (
  <Box bg={bg} borderRadius="2xl" p={6} boxShadow="sm" {...props}>
    {children}
  </Box>
);

const ProductCard = ({
  name,
  price,
  stockStatus,
  stockColor,
  bgColor,
  imageSrc,
}: any) => (
  <Flex bg={bgColor} borderRadius="2xl" p={4} align="center" gap={4}>
    <Image src={imageSrc} alt={name} boxSize="60px" objectFit="contain" />
    <VStack align="start" gap={1}>
      <Text fontWeight="bold" fontSize="md" color="gray.800">
        {name}
      </Text>
      <Text fontSize="sm" color="gray.600">
        {price}
      </Text>
      <Badge colorPalette={stockColor} variant="solid" size="sm">
        {stockStatus}
      </Badge>
    </VStack>
  </Flex>
);

// --- MAIN DASHBOARD ---
function Dashboard() {
  const [amount, setAmount] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("CARROT");
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
        setFarmerId(user.id); // Save the Real User ID
        console.log("Logged in as Farmer:", user.id);
      } else {
        // Redirect if not logged in (Optional)
        // window.location.href = '/login';
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
        farmerId, // <--- NOW USING REAL AUTH ID
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
    <Box bg="#d5efb0" minH="100vh" p={8}>
      <SimpleGrid columns={{ base: 1, lg: 3 }} gap={8}>
        {/* Weather Widget... (Keep same code) */}
        <DashboardCard bg="orange.100">
          {/* ... Weather content ... */}
          <Heading size="lg">Weather</Heading>
          <Text>29°C</Text>
        </DashboardCard>

        {/* 🚜 CROP REGISTRATION WIDGET */}
        <DashboardCard bg="white" gridColumn={{ lg: "span 2" }}>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="lg" fontWeight="bold" color="green.700">
              🚜 Register Harvest Quota
            </Heading>
            {/* Show User Status Badge */}
            <Badge colorPalette={farmerId ? "green" : "red"} variant="solid">
              {farmerId ? "🟢 Farmer Authenticated" : "🔴 Guest (Read Only)"}
            </Badge>
          </Flex>

          <Flex direction={{ base: "column", md: "row" }} gap={6} align="start">
            <Box flex="1" w="full">
              <VStack gap={4} align="stretch">
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
                      <option value="CARROT">🥕 Carrot</option>
                      <option value="BEANS">🫘 Beans</option>
                      <option value="LEEKS">🌿 Leeks</option>
                      <option value="CABBAGE">🥬 Cabbage</option>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={2}>
                    Amount to Grow (MT)
                  </Text>
                  <Input
                    size="lg"
                    type="number"
                    placeholder="e.g. 50"
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
                      color={
                        feedback.type === "success" ? "green.700" : "red.700"
                      }
                    >
                      {feedback.message}
                    </Text>
                  </Flex>
                )}
              </VStack>
            </Box>

            <Box
              flex="1"
              bg="green.50"
              p={5}
              borderRadius="xl"
              border="1px dashed"
              borderColor="green.300"
            >
              <Text>Register your crops to secure price.</Text>
            </Box>
          </Flex>
        </DashboardCard>
      </SimpleGrid>
    </Box>
  );
}

export default Dashboard;
