import React from "react";
import { NativeSelect } from "@chakra-ui/react";
import { cropLabel } from "@/lib/services/quotaService";

/** Dropdown of the crops that have price predictions. */
function CropSelect({
  crops,
  value,
  onChange,
  size = "sm",
}: {
  crops: string[];
  value: string | null;
  onChange: (crop: string) => void;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <NativeSelect.Root size={size} variant="subtle" w="auto" minW="190px">
      <NativeSelect.Field
        aria-label="Crop"
        value={value ?? ""}
        onChange={(e) => onChange(e.currentTarget.value)}
        bg="gray.50"
      >
        {crops.map((c) => (
          <option key={c} value={c}>
            {cropLabel(c)}
          </option>
        ))}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
}

export default CropSelect;
