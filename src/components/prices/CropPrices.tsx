"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Box,
  BoxProps,
  Flex,
  Heading,
  Text,
  VStack,
  Badge,
  Spinner,
  SimpleGrid,
  Table,
} from "@chakra-ui/react";
import { TrendingUp } from "lucide-react";
import { usePriceForecasts } from "@/hooks/usePriceForecasts";
import {
  formatPrice,
  summarizePrices,
  PriceForecast,
} from "@/lib/services/priceForecastService";
import {
  cropLabel,
  monthName,
  formatDateTime,
} from "@/lib/services/quotaService";
import CropSelect from "./CropSelect";
import PriceForecastChart from "./PriceForecastChart";

const VARIANTS = {
  farmer: {
    pageBg: "#D4F2C4",
    accent: "green",
    headingColor: "green.800",
    cardRadius: "2xl",
    subtitle:
      "See what each crop is expected to sell for in its harvest month before you decide what to plant.",
  },
  admin: {
    pageBg: "#F8FAFC",
    accent: "blue",
    headingColor: "gray.800",
    cardRadius: "xl",
    subtitle:
      "AI price predictions shown to farmers, by crop and harvest month.",
  },
} as const;

const StatTile = ({
  label,
  value,
  hint,
  ...props
}: { label: string; value: string; hint: string } & BoxProps) => (
  <Box
    bg="white"
    p={5}
    boxShadow="sm"
    border="1px solid"
    borderColor="gray.100"
    {...props}
  >
    <Text
      fontSize="xs"
      fontWeight="bold"
      textTransform="uppercase"
      color="gray.500"
    >
      {label}
    </Text>
    <Text fontSize="2xl" fontWeight="black" color="gray.800" lineHeight="1.3">
      {value}
    </Text>
    <Text fontSize="xs" color="gray.500" mt={1}>
      {hint}
    </Text>
  </Box>
);

/** Predicted wholesale price compared with the farmer fair price for that month. */
const MarketVsFair = ({ row }: { row: PriceForecast }) => {
  if (row.wholesale_price === null || row.fair_price === null) return <>—</>;
  const diff = row.wholesale_price - row.fair_price;
  const above = diff >= 0;
  return (
    <Badge colorPalette={above ? "green" : "red"} variant="subtle">
      {above ? "▲" : "▼"} {formatPrice(Math.abs(diff))}{" "}
      {above ? "above" : "below"}
    </Badge>
  );
};

function CropPrices({ variant }: { variant: "farmer" | "admin" }) {
  const theme = VARIANTS[variant];
  const params = useSearchParams();
  // Set by the "View all" link on the dashboards
  const requested = params.get("crop")?.toUpperCase() ?? null;

  const { byCrop, crops, loading, error } = usePriceForecasts();
  const [selected, setSelected] = useState<string | null>(requested);

  const crop = selected && byCrop[selected] ? selected : (crops[0] ?? null);
  const rows = crop ? byCrop[crop] : [];
  const summary = summarizePrices(rows);

  const cardProps: BoxProps = {
    bg: "white",
    borderRadius: theme.cardRadius,
    boxShadow: "sm",
    border: "1px solid",
    borderColor: "gray.100",
  };

  return (
    <Box minH="100vh" bg={theme.pageBg} py={8} px={{ base: 4, md: 8 }}>
      <Box maxW="1200px" mx="auto">
        <Flex
          justify="space-between"
          align={{ base: "start", md: "center" }}
          direction={{ base: "column", md: "row" }}
          gap={4}
          mb={6}
        >
          <VStack align="start" gap={1}>
            <Heading
              size="xl"
              color={theme.headingColor}
              fontWeight="bold"
              display="flex"
              alignItems="center"
              gap={2}
            >
              <TrendingUp /> Crop Price Predictions
            </Heading>
            <Text color="gray.700" fontSize="sm">
              {theme.subtitle}
            </Text>
          </VStack>

          {crops.length > 0 && (
            <CropSelect
              crops={crops}
              value={crop}
              onChange={setSelected}
              size="lg"
            />
          )}
        </Flex>

        {loading ? (
          <Flex justify="center" p={16}>
            <Spinner color={`${theme.accent}.500`} size="xl" />
          </Flex>
        ) : error ? (
          <Box {...cardProps} p={6}>
            <Text fontSize="sm" color="red.700">
              Could not load price predictions. Check your connection and
              reload the page.
            </Text>
          </Box>
        ) : !crop ? (
          <Box {...cardProps} p={10} textAlign="center">
            <Text color="gray.600">
              {variant === "admin" ? (
                <>
                  No price predictions yet. Run the Price Forecast Generator on
                  the{" "}
                  <Link
                    href="/admin/ai-targets"
                    style={{ textDecoration: "underline" }}
                  >
                    AI Targets
                  </Link>{" "}
                  page.
                </>
              ) : (
                "No price predictions have been published yet. Please check back soon."
              )}
            </Text>
          </Box>
        ) : (
          <VStack align="stretch" gap={5}>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
              <StatTile
                borderRadius={theme.cardRadius}
                label="Farmer fair price"
                value={`${formatPrice(summary.fairPrice)} /kg`}
                hint={
                  summary.costPerKg !== null
                    ? `Estimated cost ${formatPrice(summary.costPerKg)}/kg plus a fair margin`
                    : "Production cost plus a fair margin"
                }
              />
              <StatTile
                borderRadius={theme.cardRadius}
                label="Best month to sell"
                value={
                  summary.bestMonth
                    ? monthName(summary.bestMonth.year, summary.bestMonth.month)
                    : "—"
                }
                hint={
                  summary.bestMonth
                    ? `Predicted wholesale ${formatPrice(summary.bestMonth.wholesale_price)}/kg`
                    : "No wholesale prediction"
                }
              />
              <StatTile
                borderRadius={theme.cardRadius}
                label="Average predicted wholesale"
                value={`${formatPrice(
                  summary.avgWholesale !== null
                    ? Math.round(summary.avgWholesale * 100) / 100
                    : null,
                )} /kg`}
                hint={`Across ${rows.length} harvest month${rows.length === 1 ? "" : "s"}`}
              />
            </SimpleGrid>

            <Box {...cardProps} p={6}>
              <Heading size="md" color="gray.800" mb={4}>
                {cropLabel(crop)} — predicted prices
              </Heading>
              <PriceForecastChart rows={rows} height={340} />
            </Box>

            <Box {...cardProps} p={6}>
              <Flex justify="space-between" align="center" mb={4} gap={2}>
                <Heading size="md" color="gray.800">
                  Prices by harvest month
                </Heading>
                <Badge colorPalette={theme.accent} variant="subtle">
                  {rows.length} Records
                </Badge>
              </Flex>

              <Box overflowX="auto">
                <Table.Root size="sm" variant="line">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>Harvest month</Table.ColumnHeader>
                      <Table.ColumnHeader>Plant in</Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="right">
                        Wholesale (Rs./kg)
                      </Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="right">
                        Retail (Rs./kg)
                      </Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="right">
                        Fair price (Rs./kg)
                      </Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="right">
                        Wholesale vs fair price
                      </Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {rows.map((row) => (
                      <Table.Row
                        key={`${row.year}-${row.month}`}
                        _hover={{ bg: "gray.50" }}
                      >
                        <Table.Cell fontWeight="bold">
                          {monthName(row.year, row.month)}
                        </Table.Cell>
                        <Table.Cell color="gray.600">
                          {monthName(row.planting_year, row.planting_month)}
                        </Table.Cell>
                        <Table.Cell
                          textAlign="right"
                          fontVariantNumeric="tabular-nums"
                        >
                          {formatPrice(row.wholesale_price)}
                        </Table.Cell>
                        <Table.Cell
                          textAlign="right"
                          fontVariantNumeric="tabular-nums"
                        >
                          {formatPrice(row.retail_price)}
                        </Table.Cell>
                        <Table.Cell
                          textAlign="right"
                          fontVariantNumeric="tabular-nums"
                        >
                          {formatPrice(row.fair_price)}
                        </Table.Cell>
                        <Table.Cell textAlign="right">
                          <MarketVsFair row={row} />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>

              <Text fontSize="xs" color="gray.500" mt={4}>
                Prices are AI predictions, not guarantees.
                {summary.lastGeneratedAt &&
                  ` Last updated ${formatDateTime(summary.lastGeneratedAt)}.`}
              </Text>
            </Box>
          </VStack>
        )}
      </Box>
    </Box>
  );
}

export default CropPrices;
