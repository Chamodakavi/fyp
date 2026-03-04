"use client";

import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Spinner,
  Table,
  EmptyState,
} from "@chakra-ui/react";
import { useRegisteredCrops } from "@/hooks/useRegisteredCrop";
import { LuSprout, LuHistory } from "react-icons/lu";

// Matching your DashboardCard style
const DashboardCard = ({ children, bg = "white", ...props }: any) => (
  <Box
    bg={bg}
    borderRadius="2xl"
    p={6}
    boxShadow="sm"
    border="1px solid"
    borderColor="gray.100"
    {...props}
  >
    {children}
  </Box>
);

function RegisteredCrops() {
  const { crops, loadingCrops } = useRegisteredCrops();

  return (
    <DashboardCard w="full" maxW="2xl" mx="auto">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading
          size="lg"
          fontWeight="bold"
          color="green.700"
          display="flex"
          alignItems="center"
          gap={2}
        >
          <LuHistory /> My Registered Quotas
        </Heading>
        <Badge colorPalette="green" variant="subtle">
          {crops.length} Records
        </Badge>
      </Flex>

      {loadingCrops ? (
        <Flex justify="center" p={10}>
          <Spinner color="green.500" size="xl" />
        </Flex>
      ) : crops.length === 0 ? (
        <VStack
          p={10}
          bg="gray.50"
          borderRadius="xl"
          border="1px dashed"
          borderColor="gray.300"
        >
          <LuSprout size={40} color="gray" />
          <Text color="gray.500">No crops registered yet.</Text>
        </VStack>
      ) : (
        <VStack gap={4} align="stretch">
          {/* Table-like display for clean reading */}
          <Table.Root size="sm" variant="line">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader color="green.800">
                  Crop Name
                </Table.ColumnHeader>
                <Table.ColumnHeader color="green.800" textAlign="right">
                  Amount (MT)
                </Table.ColumnHeader>
                <Table.ColumnHeader color="green.800" textAlign="right">
                  Date
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {crops.map((crop: any) => (
                <Table.Row key={crop.id} _hover={{ bg: "green.50" }}>
                  <Table.Cell fontWeight="bold">{crop.crop_name}</Table.Cell>
                  <Table.Cell textAlign="right">{crop.amount_mt}</Table.Cell>
                  <Table.Cell textAlign="right" fontSize="xs" color="gray.500">
                    {new Date(crop.registered_at).toLocaleDateString()}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          <Box
            p={3}
            bg="blue.50"
            borderRadius="lg"
            border="1px solid"
            borderColor="blue.100"
          >
            <Text fontSize="xs" color="blue.700">
              💡 These quotas are locked in. Contact admin to modify records.
            </Text>
          </Box>
        </VStack>
      )}
    </DashboardCard>
  );
}

export default RegisteredCrops;
