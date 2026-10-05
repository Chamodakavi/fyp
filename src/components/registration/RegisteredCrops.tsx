"use client";

import React from "react";
import Link from "next/link";
import {
  Box,
  BoxProps,
  Flex,
  Heading,
  Text,
  VStack,
  Badge,
  Button,
  Spinner,
  Table,
} from "@chakra-ui/react";
import { useRegisteredCrops } from "@/hooks/useRegisteredCrop";
import { monthName } from "@/lib/services/quotaService";
import { LuSprout, LuHistory } from "react-icons/lu";

const DashboardCard = ({ children, bg = "white", ...props }: BoxProps) => (
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

function RegisteredCrops({ refreshKey = 0 }: { refreshKey?: number }) {
  const { crops, loadingCrops, error } = useRegisteredCrops(refreshKey);
  const activeCount = crops.filter((c) => c.status !== "cancelled").length;

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
          {activeCount} Records
        </Badge>
      </Flex>

      {loadingCrops ? (
        <Flex justify="center" p={10}>
          <Spinner color="green.500" size="xl" />
        </Flex>
      ) : error ? (
        <Box p={4} bg="red.50" borderRadius="xl">
          <Text fontSize="sm" color="red.700">
            Could not load your registrations. Check your connection and
            reload the page.
          </Text>
        </Box>
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
          <Box overflowX="auto">
            <Table.Root size="sm" variant="line">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader color="green.800">
                    Crop Name
                  </Table.ColumnHeader>
                  <Table.ColumnHeader color="green.800">
                    Harvest
                  </Table.ColumnHeader>
                  <Table.ColumnHeader color="green.800" textAlign="right">
                    Amount (MT)
                  </Table.ColumnHeader>
                  <Table.ColumnHeader color="green.800" textAlign="right">
                    Date
                  </Table.ColumnHeader>
                  <Table.ColumnHeader />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {crops.map((crop) => {
                  const cancelled = crop.status === "cancelled";
                  return (
                    <Table.Row
                      key={crop.id}
                      _hover={{ bg: "green.50" }}
                      opacity={cancelled ? 0.5 : 1}
                    >
                      <Table.Cell fontWeight="bold">
                        {crop.crop_name}
                        {cancelled && (
                          <Badge ml={2} colorPalette="gray" size="sm">
                            Cancelled
                          </Badge>
                        )}
                      </Table.Cell>
                      <Table.Cell fontSize="xs">
                        {monthName(crop.target?.year, crop.target?.month)}
                      </Table.Cell>
                      <Table.Cell textAlign="right">
                        {crop.amount_mt}
                      </Table.Cell>
                      <Table.Cell
                        textAlign="right"
                        fontSize="xs"
                        color="gray.500"
                      >
                        {new Date(crop.registered_at).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell textAlign="right">
                        {!cancelled && (
                          <Button
                            asChild
                            size="xs"
                            variant="outline"
                            colorPalette="blue"
                          >
                            <Link
                              href={`/quota-support?registration=${crop.id}`}
                            >
                              Request change
                            </Link>
                          </Button>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Root>
          </Box>

          <Box
            p={3}
            bg="blue.50"
            borderRadius="lg"
            border="1px solid"
            borderColor="blue.100"
          >
            <Text fontSize="xs" color="blue.700">
              💡 These quotas are locked in. Need to change one?{" "}
              <Link
                href="/quota-support"
                style={{ textDecoration: "underline" }}
              >
                Open Quota Support
              </Link>
              .
            </Text>
          </Box>
        </VStack>
      )}
    </DashboardCard>
  );
}

export default RegisteredCrops;
