"use client";

import React, { useMemo } from "react";
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
import { monthName, MyRegistration } from "@/lib/services/quotaService";
import { groupBy } from "@/utils/groupBy";
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

const UNLINKED = "unlinked";

/** "2027-02" for a linked registration, so groups sort chronologically. */
const harvestKey = (c: MyRegistration) =>
  c.target?.year && c.target?.month
    ? `${c.target.year}-${String(c.target.month).padStart(2, "0")}`
    : UNLINKED;

function RegisteredCrops({ refreshKey = 0 }: { refreshKey?: number }) {
  const { crops, loadingCrops, error } = useRegisteredCrops(refreshKey);
  const activeCount = crops.filter((c) => c.status !== "cancelled").length;

  // One section per harvest month (R5), earliest first; unlinked rows last
  const groups = useMemo(
    () =>
      Object.entries(groupBy(crops, harvestKey)).sort(([a], [b]) =>
        a === UNLINKED ? 1 : b === UNLINKED ? -1 : a.localeCompare(b),
      ),
    [crops],
  );

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
        <VStack gap={5} align="stretch">
          {groups.map(([key, rows]) => {
            const first = rows[0];
            const heading =
              key === UNLINKED
                ? "Not linked to a harvest month"
                : `Harvest ${monthName(first.target?.year, first.target?.month)}`;
            const sectionTotal = rows
              .filter((r) => r.status !== "cancelled")
              .reduce((s, r) => s + Number(r.amount_mt || 0), 0);

            return (
              <Box key={key}>
                <Flex justify="space-between" align="baseline" mb={2}>
                  <Text fontWeight="bold" color="green.800">
                    {heading}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {sectionTotal} MT registered
                  </Text>
                </Flex>
                <Box overflowX="auto">
                  <Table.Root size="sm" variant="line">
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader color="green.800">
                          Crop
                        </Table.ColumnHeader>
                        <Table.ColumnHeader color="green.800" textAlign="right">
                          Amount (MT)
                        </Table.ColumnHeader>
                        <Table.ColumnHeader color="green.800" textAlign="right">
                          Registered
                        </Table.ColumnHeader>
                        <Table.ColumnHeader />
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {rows.map((crop) => {
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
              </Box>
            );
          })}

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
