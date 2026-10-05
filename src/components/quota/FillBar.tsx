import React from "react";
import { Box } from "@chakra-ui/react";

/** Quota fill indicator: green → yellow → orange → red as the target fills up. */
function FillBar({ ratio, h = "10px" }: { ratio: number; h?: string }) {
  const pct = Math.max(0, Math.min(100, Math.round(ratio * 100)));
  const color =
    pct >= 100
      ? "red.500"
      : pct >= 85
        ? "orange.400"
        : pct >= 60
          ? "yellow.400"
          : "green.500";

  return (
    <Box w="full" h={h} bg="gray.100" borderRadius="full" overflow="hidden">
      <Box h="full" w={`${pct}%`} bg={color} transition="width .3s" />
    </Box>
  );
}

export default FillBar;
