"use client";

import React from "react";
import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  usePlotArea,
} from "recharts";
import {
  PriceForecast,
  formatPrice,
  shortMonth,
} from "@/lib/services/priceForecastService";
import { monthName } from "@/lib/services/quotaService";

type SeriesKey = "wholesale_price" | "retail_price" | "fair_price";

// Colour follows the price type everywhere this chart appears. The fair price
// is also dashed so the three lines can be told apart without colour.
const PRICE_SERIES: {
  key: SeriesKey;
  label: string;
  color: string;
  dashed: boolean;
}[] = [
  {
    key: "wholesale_price",
    label: "Predicted wholesale",
    color: "#2a78d6",
    dashed: false,
  },
  {
    key: "retail_price",
    label: "Predicted retail",
    color: "#eb6834",
    dashed: false,
  },
  { key: "fair_price", label: "Farmer fair price", color: "#1baf7a", dashed: true },
];

const DASH = "5 4";
const END_LABEL_GAP = 14;

interface ChartPoint {
  label: string;
  fullLabel: string;
  wholesale_price: number | null;
  retail_price: number | null;
  fair_price: number | null;
}

/** Round axis maximum and ticks (0 / 100 / 200 …) that cover the highest price. */
function niceAxis(max: number): { yMax: number; ticks: number[] } {
  if (max <= 0) return { yMax: 100, ticks: [0, 50, 100] };
  const rough = max / 4;
  const pow = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= rough)!;
  const yMax = Math.ceil(max / step) * step;
  const ticks = Array.from(
    { length: Math.round(yMax / step) + 1 },
    (_, i) => i * step,
  );
  return { yMax, ticks };
}

const LineKey = ({ color, dashed }: { color: string; dashed: boolean }) => (
  <svg width="18" height="8" aria-hidden="true" style={{ flexShrink: 0 }}>
    <line
      x1="1"
      y1="4"
      x2="17"
      y2="4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray={dashed ? DASH : undefined}
    />
  </svg>
);

function PriceTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: ChartPoint }>;
}) {
  const point = active ? payload?.[0]?.payload : undefined;
  if (!point) return null;

  return (
    <Box
      bg="white"
      borderRadius="lg"
      border="1px solid"
      borderColor="gray.100"
      boxShadow="lg"
      px={3}
      py={2}
    >
      <Text fontSize="xs" color="gray.500" mb={1}>
        {point.fullLabel} harvest
      </Text>
      {PRICE_SERIES.map((s) => (
        <HStack key={s.key} gap={2}>
          <LineKey color={s.color} dashed={s.dashed} />
          <Text fontSize="sm" fontWeight="bold" color="gray.800">
            {formatPrice(point[s.key])}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {s.label}
          </Text>
        </HStack>
      ))}
    </Box>
  );
}

/** Latest value of each line, written at the right edge and nudged apart when they'd overlap. */
function EndLabels({
  ends,
  yMax,
}: {
  ends: { key: string; color: string; value: number }[];
  yMax: number;
}) {
  const plot = usePlotArea();
  if (!plot || yMax <= 0) return null;

  const bottom = plot.y + plot.height;
  const placed = ends
    .map((e) => ({ ...e, y: plot.y + plot.height * (1 - e.value / yMax) }))
    .sort((a, b) => a.y - b.y);

  for (let i = 1; i < placed.length; i++) {
    placed[i].y = Math.max(placed[i].y, placed[i - 1].y + END_LABEL_GAP);
  }
  for (let i = placed.length - 1; i >= 0; i--) {
    const limit =
      i === placed.length - 1 ? bottom : placed[i + 1].y - END_LABEL_GAP;
    placed[i].y = Math.min(placed[i].y, limit);
  }

  const x = plot.x + plot.width + 8;

  return (
    <g aria-hidden="true">
      {placed.map((p) => (
        <g key={p.key}>
          <circle cx={x + 3} cy={p.y} r={3} fill={p.color} />
          <text
            x={x + 10}
            y={p.y}
            dominantBaseline="central"
            fontSize={11}
            fontWeight={600}
            fill="#374151"
          >
            {Math.round(p.value).toLocaleString("en-US")}
          </text>
        </g>
      ))}
    </g>
  );
}

function PriceForecastChart({
  rows,
  height = 300,
}: {
  rows: PriceForecast[];
  height?: number;
}) {
  const data: ChartPoint[] = rows.map((r) => ({
    label: shortMonth(r.year, r.month),
    fullLabel: monthName(r.year, r.month),
    wholesale_price: r.wholesale_price,
    retail_price: r.retail_price,
    fair_price: r.fair_price,
  }));

  const highest = Math.max(
    0,
    ...rows.flatMap((r) => PRICE_SERIES.map((s) => r[s.key] ?? 0)),
  );
  const { yMax, ticks } = niceAxis(highest);

  const ends = PRICE_SERIES.flatMap((s) => {
    const last = [...rows].reverse().find((r) => r[s.key] !== null);
    return last ? [{ key: s.key, color: s.color, value: last[s.key]! }] : [];
  });

  // A single month has no line to draw, so the points must show on their own
  const singlePoint = rows.length === 1;
  const showDots = rows.length <= 12;
  const first = rows[0];
  const last = rows[rows.length - 1];

  return (
    <Box w="full">
      <Flex justify="space-between" align="center" wrap="wrap" gap={2} mb={2}>
        <HStack gap={4} wrap="wrap">
          {PRICE_SERIES.map((s) => (
            <HStack key={s.key} gap={1.5}>
              <LineKey color={s.color} dashed={s.dashed} />
              <Text fontSize="xs" color="gray.600">
                {s.label}
              </Text>
            </HStack>
          ))}
        </HStack>
        <Text fontSize="xs" color="gray.500">
          Rs. per kg, by harvest month
        </Text>
      </Flex>

      <Box
        h={`${height}px`}
        w="full"
        role="img"
        aria-label={
          first && last
            ? `Line chart of predicted wholesale, retail and farmer fair prices in rupees per kg, ${monthName(first.year, first.month)} to ${monthName(last.year, last.month)}.`
            : "Predicted price chart"
        }
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 600, height }}
        >
          <LineChart
            data={data}
            margin={{ top: 10, right: 46, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} stroke="#EEF2F6" />
            <XAxis
              dataKey="label"
              axisLine={{ stroke: "#CBD5E1" }}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 12 }}
              padding={{ left: 12, right: 12 }}
              interval="preserveStartEnd"
              minTickGap={24}
              dy={8}
            />
            <YAxis
              domain={[0, yMax]}
              ticks={ticks}
              width={44}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 12 }}
              tickFormatter={(v: number) => v.toLocaleString("en-US")}
            />
            <Tooltip
              content={<PriceTooltip />}
              cursor={{ stroke: "#94A3B8", strokeWidth: 1 }}
            />
            {PRICE_SERIES.map((s) => (
              <Line
                key={s.key}
                dataKey={s.key}
                name={s.label}
                type="monotone"
                stroke={s.color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={s.dashed ? DASH : undefined}
                dot={
                  singlePoint || (showDots && !s.dashed)
                    ? {
                        r: 4,
                        fill: s.color,
                        stroke: "#FFFFFF",
                        strokeWidth: 2,
                        strokeDasharray: "0",
                      }
                    : false
                }
                activeDot={{
                  r: 5,
                  fill: s.color,
                  stroke: "#FFFFFF",
                  strokeWidth: 2,
                  strokeDasharray: "0",
                }}
                connectNulls
                isAnimationActive={false}
              />
            ))}
            <EndLabels ends={ends} yMax={yMax} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

export default PriceForecastChart;
