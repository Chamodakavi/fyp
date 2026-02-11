"use client";

import React, { useState } from "react";
import {
  Box,
  Flex,
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
import { Sparkles, Calendar, Wheat, Info } from "lucide-react";

// --- CUSTOM COMPONENTS ---

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

function AITargets() {
  const [crop, setCrop] = useState("CARROT");
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(4);
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [error, setError] = useState("");

  /**
   * CONNECTING TO NEXT.JS API ROUTE
   * This function sends the selected crop, year, and month to your
   * /app/api/advisory/route.ts endpoint.
   */
  const handleAskAI = async () => {
    setLoading(true);
    setError("");
    setApiResponse(null);

    try {
      const response = await fetch("/api/advisory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop: crop.toUpperCase(), // Ensure uppercase for Python backend
          year: Number(year),
          month: Number(month),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "API responded with an error");
      }

      const data = await response.json();

      // Data expected from your route.ts:
      // { Required_Harvest_MT, Suggested_Hectares, Calculated_Fair_Price, Estimated_Consumer_Price }
      setApiResponse(data);
    } catch (err: any) {
      setError(err.message || "Failed to connect to AI server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="#F8FAFC" minH="100vh" p="8">
      <Container>
        <VStack align="start" mb={8} gap={1}>
          <Heading size="xl" color="gray.800" fontWeight="bold">
            AI Supply Forecast
          </Heading>
          <Text color="gray.500">
            Determine national production targets based on market demand.
          </Text>
        </VStack>

        {/* --- INPUT SECTION --- */}
        <TargetCard title="Target Parameters" icon={Wheat}>
          <VStack gap={6} align="stretch">
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={5}>
              <Stack gap={2}>
                <Text fontSize="sm" fontWeight="bold" color="gray.700">
                  Crop Type
                </Text>
                <NativeSelect.Root variant="subtle">
                  <NativeSelect.Field
                    value={crop}
                    onChange={(e) => setCrop(e.currentTarget.value)}
                    bg="gray.50"
                    h="45px"
                  >
                    <option value="CARROT">🥕 Carrot</option>
                    <option value="BEANS">🫘 Beans</option>
                    <option value="LEEKS">🌿 Leeks</option>
                    <option value="CABBAGE">🥬 Cabbage</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Stack>

              <Stack gap={2}>
                <Text fontSize="sm" fontWeight="bold" color="gray.700">
                  Target Year
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
                  Target Month
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
                  <Sparkles size={18} /> Ask AI for Target
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
        </TargetCard>

        {/* --- RESULTS SECTION --- */}
        {apiResponse && (
          <TargetCard title="AI Analysis Results" icon={Sparkles}>
            <VStack gap={8} py={4}>
              <VStack gap={1}>
                <Text
                  fontSize="6xl"
                  fontWeight="black"
                  color="gray.800"
                  lineHeight="1"
                >
                  {apiResponse.Required_Harvest_MT?.toLocaleString()} MT
                </Text>
                <Badge
                  colorPalette="blue"
                  size="lg"
                  variant="solid"
                  borderRadius="full"
                >
                  Supply Target
                </Badge>
              </VStack>

              <HStack
                gap={10}
                justify="center"
                w="full"
                bg="blue.50"
                p={6}
                borderRadius="2xl"
              >
                <VStack gap={0} flex={1}>
                  <Text
                    fontSize="xs"
                    color="blue.700"
                    fontWeight="bold"
                    textTransform="uppercase"
                  >
                    Required Land
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="blue.900">
                    {apiResponse.Suggested_Hectares} Ha
                  </Text>
                </VStack>

                <Separator
                  orientation="vertical"
                  height="40px"
                  borderColor="blue.200"
                />

                <VStack gap={0} flex={1}>
                  <Text
                    fontSize="xs"
                    color="blue.700"
                    fontWeight="bold"
                    textTransform="uppercase"
                  >
                    Confidence
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="blue.900">
                    94.2%
                  </Text>
                </VStack>
              </HStack>

              <SimpleGrid columns={2} gap={4} w="full">
                <Box
                  p={4}
                  border="1px solid"
                  borderColor="gray.100"
                  borderRadius="xl"
                >
                  <Text fontSize="xs" color="gray.500" mb={1}>
                    Farmer Price (Min)
                  </Text>
                  <Text fontSize="xl" fontWeight="bold" color="green.600">
                    LKR {apiResponse.Calculated_Fair_Price}
                  </Text>
                </Box>
                <Box
                  p={4}
                  border="1px solid"
                  borderColor="gray.100"
                  borderRadius="xl"
                >
                  <Text fontSize="xs" color="gray.500" mb={1}>
                    Consumer Price (Est)
                  </Text>
                  <Text fontSize="xl" fontWeight="bold" color="orange.600">
                    LKR {apiResponse.Estimated_Consumer_Price}
                  </Text>
                </Box>
              </SimpleGrid>

              <Button
                w="full"
                colorPalette="green"
                size="lg"
                h="55px"
                gap={3}
                fontWeight="bold"
                onClick={() => alert("System targets updated!")}
              >
                Apply System-Wide Target <Calendar size={18} />
              </Button>
            </VStack>
          </TargetCard>
        )}
      </Container>
    </Box>
  );
}

const Badge = ({ children, colorPalette, ...props }: any) => (
  <Box
    bg={`${colorPalette}.600`}
    color="white"
    px={3}
    py={1}
    borderRadius="full"
    fontSize="xs"
    fontWeight="bold"
    {...props}
  >
    {children}
  </Box>
);

export default AITargets;
