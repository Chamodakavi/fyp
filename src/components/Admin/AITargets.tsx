"use client";

import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  NativeSelect,
  Container,
  Input,
  Spinner,
  SimpleGrid,
  Separator,
  Stack,
} from "@chakra-ui/react";
import { Sparkles, Calendar, Wheat, Info, CheckCircle2 } from "lucide-react";
import {
  fetchAdvisoryQuota,
  applyNationalTarget,
  AdvisoryData,
} from "@/lib/services/quotaService";

const TargetCard = ({
  children,
  title,
  icon: IconComponent,
}: {
  children: React.ReactNode;
  title: string;
  icon?: any;
}) => (
  <Box
    bg="white"
    borderRadius="xl"
    border="1px solid"
    borderColor="gray.100"
    overflow="hidden"
    w="full"
    mb={6}
    boxShadow="sm"
  >
    <Box px={6} py={4} borderBottom="1px solid" borderColor="gray.50">
      <HStack gap={3}>
        {IconComponent && <IconComponent size={18} color="#2B6CB0" />}
        <Heading size="sm" fontWeight="bold" color="gray.800">
          {title}
        </Heading>
      </HStack>
    </Box>
    <Box p={6}>{children}</Box>
  </Box>
);

const Badge = ({ children, colorPalette = "blue", ...props }: any) => (
  <Box
    bg={`${colorPalette}.600`}
    color="white"
    px={3}
    py={1}
    borderRadius="full"
    fontSize="xs"
    fontWeight="bold"
    display="inline-flex"
    alignItems="center"
    {...props}
  >
    {children}
  </Box>
);

function AITargets() {
  const [crop, setCrop] = useState("CARROT");
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(10);
  const [dieselPrice, setDieselPrice] = useState(392);
  const [rainfall, setRainfall] = useState(150);

  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [apiResponse, setApiResponse] = useState<AdvisoryData | null>(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleAskAI = async () => {
    setLoading(true);
    setError("");
    setSuccessMsg("");
    setApiResponse(null);

    try {
      const data = await fetchAdvisoryQuota({
        crop,
        year,
        month,
        rainfall,
        dieselPrice,
      });
      setApiResponse(data);
    } catch (err: any) {
      setError(err.message || "Failed to connect to AI advisory service.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyTarget = async () => {
    if (!apiResponse) {
      alert("Please generate an AI target first.");
      return;
    }

    setApplying(true);
    setError("");
    setSuccessMsg("");

    try {
      await applyNationalTarget(crop, apiResponse);
      setSuccessMsg(
        `Successfully locked national quota for ${crop} (Target: ${apiResponse.Target_Harvest_Date})`,
      );
    } catch (err: any) {
      console.error("Apply target error:", err);
      setError(err.message || "Failed to update national system targets.");
    } finally {
      setApplying(false);
    }
  };

  return (
    <Box bg="#F8FAFC" minH="100vh" p={{ base: 4, md: 8 }}>
      <Container maxW="4xl">
        <VStack align="start" mb={8} gap={1}>
          <Heading size="xl" color="gray.800" fontWeight="bold">
            National Agricultural Quota Engine
          </Heading>
          <Text color="gray.500">
            Regulate seasonal planting volumes to prevent post-harvest price
            collapse.
          </Text>
        </VStack>

        <TargetCard title="Registration Parameters" icon={Wheat}>
          <VStack gap={6} align="stretch">
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={5}>
              <Stack gap={2}>
                <Text fontSize="sm" fontWeight="bold" color="gray.700">
                  Target Vegetable
                </Text>
                <NativeSelect.Root variant="subtle">
                  <NativeSelect.Field
                    value={crop}
                    onChange={(e) => setCrop(e.currentTarget.value)}
                    bg="gray.50"
                    h="45px"
                  >
                    <option value="CARROT">🥕 Carrot</option>
                    <option value="TOMATOES">🍅 Tomatoes</option>
                    <option value="CABBAGE">🥬 Cabbage</option>
                    <option value="BRINJALS">🍆 Brinjals</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Stack>

              <Stack gap={2}>
                <Text fontSize="sm" fontWeight="bold" color="gray.700">
                  Registration Year
                </Text>
                <Input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  bg="gray.50"
                  h="45px"
                />
              </Stack>

              <Stack gap={2}>
                <Text fontSize="sm" fontWeight="bold" color="gray.700">
                  Registration Window
                </Text>
                <NativeSelect.Root variant="subtle">
                  <NativeSelect.Field
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    bg="gray.50"
                    h="45px"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString("en-US", {
                          month: "long",
                        })}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Stack>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
              <Stack gap={2}>
                <Text fontSize="sm" fontWeight="bold" color="gray.700">
                  National Diesel Price (LKR)
                </Text>
                <Input
                  type="number"
                  value={dieselPrice}
                  onChange={(e) => setDieselPrice(Number(e.target.value))}
                  bg="gray.50"
                  h="45px"
                />
              </Stack>

              <Stack gap={2}>
                <Text fontSize="sm" fontWeight="bold" color="gray.700">
                  Expected Rainfall (mm)
                </Text>
                <Input
                  type="number"
                  value={rainfall}
                  onChange={(e) => setRainfall(Number(e.target.value))}
                  bg="gray.50"
                  h="45px"
                />
              </Stack>
            </SimpleGrid>

            <Button
              w="full"
              bg="blue.600"
              color="white"
              h="50px"
              _hover={{ bg: "blue.700" }}
              onClick={handleAskAI}
              loading={loading}
              gap={2}
            >
              {loading ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <Sparkles size={18} /> Solve Economic Quota
                </>
              )}
            </Button>
          </VStack>

          {error && (
            <Box
              mt={4}
              p={3}
              bg="red.50"
              color="red.700"
              borderRadius="md"
              fontSize="sm"
            >
              <HStack>
                <Info size={16} />
                <Text>{error}</Text>
              </HStack>
            </Box>
          )}

          {successMsg && (
            <Box
              mt={4}
              p={3}
              bg="green.50"
              color="green.700"
              borderRadius="md"
              fontSize="sm"
            >
              <HStack>
                <CheckCircle2 size={16} />
                <Text>{successMsg}</Text>
              </HStack>
            </Box>
          )}
        </TargetCard>

        {apiResponse && (
          <TargetCard title="Agro-Economic Advisory Results" icon={Sparkles}>
            <VStack gap={6} py={2}>
              <HStack
                w="full"
                justify="space-between"
                p={4}
                bg="gray.50"
                borderRadius="xl"
                border="1px dashed"
                borderColor="gray.200"
              >
                <VStack align="start" gap={0}>
                  <Text fontSize="xs" color="gray.500" fontWeight="semibold">
                    REGISTRATION WINDOW
                  </Text>
                  <Text fontSize="md" fontWeight="bold" color="gray.800">
                    {apiResponse.Planting_Date}
                  </Text>
                </VStack>

                <Badge colorPalette="purple">Growth Lag Applied</Badge>

                <VStack align="end" gap={0}>
                  <Text fontSize="xs" color="gray.500" fontWeight="semibold">
                    TARGET MARKET HARVEST
                  </Text>
                  <Text fontSize="md" fontWeight="bold" color="blue.600">
                    {apiResponse.Target_Harvest_Date}
                  </Text>
                </VStack>
              </HStack>

              <VStack gap={1} my={2}>
                <Text
                  fontSize="5xl"
                  fontWeight="black"
                  color="gray.800"
                  lineHeight="1"
                >
                  {apiResponse.Required_Harvest_MT?.toLocaleString()} MT
                </Text>
                <Badge colorPalette="blue" size="lg" borderRadius="full">
                  National Supply Cap
                </Badge>
              </VStack>

              <HStack
                gap={10}
                justify="center"
                w="full"
                bg="blue.50"
                p={5}
                borderRadius="2xl"
              >
                <VStack gap={0} flex={1}>
                  <Text
                    fontSize="xs"
                    color="blue.700"
                    fontWeight="bold"
                    textTransform="uppercase"
                  >
                    Allowed Land Allocation
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="blue.900">
                    {apiResponse.Allowed_Extent_Ha} Hectares
                  </Text>
                </VStack>
                <Separator
                  orientation="vertical"
                  height="35px"
                  borderColor="blue.200"
                />
                <VStack gap={0} flex={1}>
                  <Text
                    fontSize="xs"
                    color="blue.700"
                    fontWeight="bold"
                    textTransform="uppercase"
                  >
                    Market Equilibrium
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="blue.900">
                    Protected Status
                  </Text>
                </VStack>
              </HStack>

              <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} w="full">
                <Box
                  p={4}
                  border="1px solid"
                  borderColor="gray.100"
                  borderRadius="xl"
                >
                  <Text fontSize="xs" color="gray.500" mb={1}>
                    Farmer Fair Floor (+40%)
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="green.600">
                    LKR {apiResponse.Calculated_Fair_Price} /kg
                  </Text>
                </Box>

                <Box
                  p={4}
                  border="1px solid"
                  borderColor="gray.100"
                  borderRadius="xl"
                >
                  <Text fontSize="xs" color="gray.500" mb={1}>
                    Expected Wholesale
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="blue.600">
                    LKR {apiResponse.Estimated_Wholesale_Price} /kg
                  </Text>
                </Box>

                <Box
                  p={4}
                  border="1px solid"
                  borderColor="gray.100"
                  borderRadius="xl"
                >
                  <Text fontSize="xs" color="gray.500" mb={1}>
                    Expected Retail
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="orange.600">
                    LKR {apiResponse.Estimated_Consumer_Price} /kg
                  </Text>
                </Box>
              </SimpleGrid>

              <Button
                w="full"
                bg="green.600"
                _hover={{ bg: "green.700" }}
                color="white"
                size="lg"
                h="52px"
                gap={3}
                fontWeight="bold"
                onClick={handleApplyTarget}
                loading={applying}
                disabled={applying}
              >
                Publish & Enforce National Target <Calendar size={18} />
              </Button>
            </VStack>
          </TargetCard>
        )}
      </Container>
    </Box>
  );
}

export default AITargets;
