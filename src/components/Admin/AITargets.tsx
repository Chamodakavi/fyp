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
  Separator,
  Icon,
} from "@chakra-ui/react";
import {
  BrainCircuit,
  Search,
  Bell,
  ChevronDown,
  Sparkles,
} from "lucide-react";

// --- CUSTOM COMPONENTS ---
const TargetCard = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => (
  <Box
    bg="white"
    borderRadius="xl"
    border="1px solid"
    borderColor="gray.100"
    overflow="hidden"
    w="full"
    mb={6}
  >
    <Box px={6} py={4} borderBottom="1px solid" borderColor="gray.50">
      <Heading size="sm" fontWeight="bold" color="gray.800">
        {title}
      </Heading>
    </Box>
    <Box p={6}>{children}</Box>
  </Box>
);

function AITargets() {
  const [crop, setCrop] = useState("Carrot");
  const [season, setSeason] = useState("Next Season");

  return (
    <Box bg="#F8FAFC" minH="100vh" p="8">
      <Container maxW="full">
        {/* --- HEADER --- */}
        {/* <Flex justify="flex-end" align="center" gap="6" mb="8">
          <Search size={20} color="#64748B" style={{ cursor: "pointer" }} />
          <Bell size={20} color="#64748B" style={{ cursor: "pointer" }} />
          <HStack gap="3" cursor="pointer">
            <Box boxSize="35px" bg="gray.200" borderRadius="full" />
            <ChevronDown size={16} color="#94A3B8" />
          </HStack>
        </Flex> */}

        <VStack align="start" gap={2} mb={6}>
          <Heading size="md" color="gray.800" fontWeight="bold">
            AI Targets
          </Heading>
        </VStack>

        {/* --- SET TARGET SECTION --- */}
        <TargetCard title="Set Next Season's Target">
          <Flex gap={8} direction={{ base: "column", md: "row" }} mb={6}>
            <VStack align="start" flex={1} gap={2}>
              <Text fontSize="sm" fontWeight="bold" color="gray.700">
                Select Crop
              </Text>
              <NativeSelect.Root variant="subtle">
                <NativeSelect.Field
                  value={crop}
                  onChange={(e) => setCrop(e.currentTarget.value)}
                  bg="gray.50"
                  h="45px"
                >
                  <option value="Carrot">Carrot</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Potato">Potato</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </VStack>

            <VStack align="start" flex={1} gap={2}>
              <Text fontSize="sm" fontWeight="bold" color="gray.700">
                Select Season
              </Text>
              <NativeSelect.Root variant="subtle">
                <NativeSelect.Field
                  value={season}
                  onChange={(e) => setSeason(e.currentTarget.value)}
                  bg="gray.50"
                  h="45px"
                >
                  <option value="Next Season">Next Season</option>
                  <option value="Current Season">Current Season</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </VStack>
          </Flex>

          <Button
            w="full"
            bg="blue.600"
            color="white"
            h="45px"
            _hover={{ bg: "blue.700" }}
            fontWeight="bold"
          >
            Ask AI for Target
          </Button>
        </TargetCard>

        {/* --- AI SUGGESTION SECTION --- */}
        <TargetCard title="AI Suggestion">
          <VStack gap={6} py={4}>
            <VStack gap={0}>
              <Text fontSize="5xl" fontWeight="black" color="gray.800">
                155,000 MT
              </Text>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">
                Suggested Production Target
              </Text>
            </VStack>

            <HStack gap={2}>
              <Text fontSize="sm" fontWeight="bold" color="gray.700">
                Confidence Score:
              </Text>
              <Text fontSize="sm" fontWeight="bold" color="green.600">
                92%
              </Text>
            </HStack>

            <Button
              w="full"
              bg="green.600"
              color="white"
              h="45px"
              _hover={{ bg: "green.700" }}
              fontWeight="bold"
              display="flex"
              gap={2}
            >
              Update System Target
              <Sparkles size={18} />
            </Button>
          </VStack>
        </TargetCard>
      </Container>
    </Box>
  );
}

export default AITargets;
