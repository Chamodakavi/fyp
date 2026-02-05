"use client";

import React from "react";
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
} from "@chakra-ui/react";
import { Wind, Droplets } from "lucide-react";
import CropRegistrationForm from "../RegistrationForm/CropRegistrationForm";

// Reusable card component for consistency
interface DashboardCardProps {
  children: React.ReactNode;
  bg?: string;
  [key: string]: any;
}

const DashboardCard = ({
  children,
  bg = "orange.100",
  ...props
}: DashboardCardProps) => (
  <Box bg={bg} borderRadius="2xl" p={6} boxShadow="sm" {...props}>
    {children}
  </Box>
);

// Reusable product card for the right-hand list
interface ProductCardProps {
  name: string;
  price: string;
  stockStatus: string;
  stockColor: string;
  bgColor: string;
  imageSrc: string;
}

const ProductCard = ({
  name,
  price,
  stockStatus,
  stockColor,
  bgColor,
  imageSrc,
}: ProductCardProps) => (
  <Flex bg={bgColor} borderRadius="2xl" p={4} align="center" gap={4}>
    <Image src={imageSrc} alt={name} boxSize="60px" objectFit="contain" />
    <VStack align="start" gap={1}>
      <Text fontWeight="bold" fontSize="md" color="gray.800">
        {name}
      </Text>
      <Text fontSize="sm" color="gray.600">
        {price}
      </Text>
      <Badge colorScheme={stockColor} fontSize="xs" px={2} borderRadius="full">
        {stockStatus}
      </Badge>
    </VStack>
  </Flex>
);

function Dashboard() {
  return (
    <Box bg="#d5efb0" minH="100vh" p={8}>
      <SimpleGrid columns={{ base: 1, lg: 3 }} gap={8}>
        {/* Weather Widget - Top Left */}
        <DashboardCard bg="orange.100">
          <Flex justify="space-between" align="center">
            <VStack align="start" gap={1}>
              <Text fontSize="sm" color="gray.600">
                Weather's today
              </Text>
              <Heading as="h2" size="lg" fontWeight="bold">
                Monday
              </Heading>
              <Text fontSize="sm" color="gray.600">
                (10th Apr, 2023)
              </Text>
            </VStack>
            <Flex align="center">
              {/* Replace with your actual weather icon image */}
              <Image
                src="https://placehold.co/100x100/FBD38D/F6AD55?text=Sun"
                alt="Sun and Thermometer"
                boxSize="80px"
              />
            </Flex>
          </Flex>
          <Heading as="h3" size="2xl" fontWeight="bold" mt={4}>
            29 C
          </Heading>
          <HStack mt={4} gap={6} color="gray.600">
            <HStack>
              <Wind size={18} />
              <Text fontSize="sm">0km/h</Text>
            </HStack>
            <HStack>
              <Droplets size={18} />
              <Text fontSize="sm">86%</Text>
            </HStack>
          </HStack>
        </DashboardCard>

        {/* Pie Chart Widget - Top Right */}
        <DashboardCard bg="orange.100" gridColumn={{ lg: "span 2" }}>
          <Heading as="h3" size="md" fontWeight="bold" mb={4}>
            Most vegetables sold in 2025
          </Heading>
          <Flex justify="center" align="center" h="full">
            {/* Replace with a charting library or an image of your chart */}
            <Image
              src="https://placehold.co/400x200/FBD38D/F6AD55?text=Pie+Chart+Placeholder"
              alt="Vegetable Sales Pie Chart"
              objectFit="contain"
              h="180px"
            />
          </Flex>
        </DashboardCard>

        {/* Production Summary Chart - Bottom Left */}
        <DashboardCard bg="white" gridColumn={{ lg: "span 2" }} h="full">
          <Flex justify="space-between" align="center" mb={6}>
            <Heading as="h3" size="lg" fontWeight="bold">
              Summary of production
            </Heading>
            <Badge
              colorScheme="green"
              variant="solid"
              fontSize="sm"
              px={3}
              py={1}
              borderRadius="full"
            >
              This week
            </Badge>
          </Flex>
          <Box h="300px">
            {/* Replace with a charting library (e.g., Recharts) or an image */}
            <Image
              src="https://placehold.co/600x300/FFFFFF/E2E8F0?text=Production+Bar+Chart"
              alt="Production Summary Chart"
              objectFit="contain"
              w="full"
              h="full"
            />
          </Box>
        </DashboardCard>

        {/* Product List - Bottom Right */}
        <VStack gap={4}>
          <ProductCard
            name="Fresh Brinjals"
            price="Rs 320.00/ 1kg"
            stockStatus="LOW STOCK - Order Now!"
            stockColor="red"
            bgColor="purple.200"
            imageSrc="https://placehold.co/60x60/D6BCFA/6B46C1?text=Brinjal"
          />
          <ProductCard
            name="Orange Carrots"
            price="Rs 450.00/ 1kg"
            stockStatus="MID STOCK - Buy Now!"
            stockColor="orange"
            bgColor="orange.200"
            imageSrc="https://placehold.co/60x60/FBD38D/DD6B20?text=Carrot"
          />
          <ProductCard
            name="Green Beans"
            price="Rs 240.00/ 1kg"
            stockStatus="HALF SOLD - Order Fast!"
            stockColor="green"
            bgColor="green.200"
            imageSrc="https://placehold.co/60x60/9AE6B4/2F855A?text=Beans"
          />
          <ProductCard
            name="Red Tomatoes"
            price="Rs 150.00/ 1kg"
            stockStatus="LIMITED - Act Soon!"
            stockColor="red"
            bgColor="red.200"
            imageSrc="https://placehold.co/60x60/FEB2B2/C53030?text=Tomato"
          />
        </VStack>
        <CropRegistrationForm />
      </SimpleGrid>
    </Box>
  );
}

export default Dashboard;
