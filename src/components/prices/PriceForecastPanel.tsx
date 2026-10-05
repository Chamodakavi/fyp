"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Box, Flex, Heading, Text, Button, Spinner } from "@chakra-ui/react";
import { ArrowRight } from "lucide-react";
import { usePriceForecasts } from "@/hooks/usePriceForecasts";
import {
  formatPrice,
  summarizePrices,
} from "@/lib/services/priceForecastService";
import { monthName } from "@/lib/services/quotaService";
import CropSelect from "./CropSelect";
import PriceForecastChart from "./PriceForecastChart";

const VARIANTS = {
  farmer: { href: "/prices", accent: "green", headingSize: "md" },
  admin: { href: "/admin/prices", accent: "blue", headingSize: "sm" },
} as const;

/**
 * Dashboard widget: pick a crop, see its predicted prices. Renders content
 * only — the dashboard wraps it in its own card.
 */
function PriceForecastPanel({ variant }: { variant: "farmer" | "admin" }) {
  const { href, accent, headingSize } = VARIANTS[variant];
  const { byCrop, crops, loading, error } = usePriceForecasts();
  const [selected, setSelected] = useState<string | null>(null);

  const crop = selected && byCrop[selected] ? selected : (crops[0] ?? null);
  const rows = crop ? byCrop[crop] : [];
  const { bestMonth, fairPrice } = summarizePrices(rows);

  return (
    <Box w="full">
      <Flex justify="space-between" align="center" gap={3} mb={4} wrap="wrap">
        <Box>
          <Heading size={headingSize} color="gray.800" fontWeight="bold">
            Predicted Crop Prices
          </Heading>
          <Text fontSize="xs" color="gray.500" mt={0.5}>
            AI price forecast for each harvest month
          </Text>
        </Box>

        <Flex align="center" gap={2} wrap="wrap">
          {crops.length > 0 && (
            <CropSelect crops={crops} value={crop} onChange={setSelected} />
          )}
          <Button
            asChild
            size="sm"
            variant="ghost"
            colorPalette={accent}
            fontWeight="bold"
          >
            <Link href={crop ? `${href}?crop=${encodeURIComponent(crop)}` : href}>
              View all <ArrowRight size={16} />
            </Link>
          </Button>
        </Flex>
      </Flex>

      {loading ? (
        <Flex justify="center" py={10}>
          <Spinner color={`${accent}.500`} />
        </Flex>
      ) : error ? (
        <Box p={4} bg="red.50" borderRadius="xl">
          <Text fontSize="sm" color="red.700">
            Could not load price predictions. Check your connection and reload
            the page.
          </Text>
        </Box>
      ) : !crop ? (
        <Box p={4} bg="gray.50" borderRadius="xl">
          <Text fontSize="sm" color="gray.600">
            {variant === "admin"
              ? "No price predictions yet. Run the Price Forecast Generator on the AI Targets page."
              : "No price predictions have been published yet."}
          </Text>
        </Box>
      ) : (
        <>
          <PriceForecastChart rows={rows} height={240} />

          {bestMonth && (
            <Text fontSize="sm" color="gray.600" mt={3}>
              Best month to sell:{" "}
              <b>{monthName(bestMonth.year, bestMonth.month)}</b> — predicted
              wholesale {formatPrice(bestMonth.wholesale_price)}/kg
              {fairPrice !== null &&
                ` · farmer fair price ${formatPrice(fairPrice)}/kg`}
            </Text>
          )}
        </>
      )}
    </Box>
  );
}

export default PriceForecastPanel;
