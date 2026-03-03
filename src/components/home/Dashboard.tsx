"use client";

import React from "react";
import {
  Box,
  Flex,
  SimpleGrid,
  Heading,
  Text,
  Image,
  VStack,
  Badge,
} from "@chakra-ui/react";

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
  return (
    <Box bg="#d5efb0" minH="100vh" p={8}>
      <SimpleGrid columns={{ base: 1, lg: 3 }} gap={8}>
        {/* Weather Widget... (Keep same code) */}
        <DashboardCard bg="orange.100">
          {/* ... Weather content ... */}
          <Heading size="lg">Weather</Heading>
          <Text>29°C</Text>
        </DashboardCard>
      </SimpleGrid>
    </Box>
  );
}

export default Dashboard;
