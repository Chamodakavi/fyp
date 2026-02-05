import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  NativeSelect,
  VStack,
  Text,
  Heading,
  Alert,
} from "@chakra-ui/react";
import { useCropRegistration } from "@/hooks/useCropRegistration";

const CROPS = [
  "Carrot",
  "Pumpkin",
  "Green Chillies",
  "Red Onions",
  "Beans",
  "Tomatoes",
];

const CropRegistrationForm = () => {
  const { checkAndRegister, loading } = useCropRegistration();
  const [crop, setCrop] = useState("Carrot");
  const [date, setDate] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async () => {
    if (!date) return alert("Please select a planting date");
    setResult(null);
    const res = await checkAndRegister(crop, date);
    setResult(res);
  };

  return (
    <Box
      bg="white"
      p={6}
      rounded="xl"
      shadow="sm"
      border="1px solid"
      borderColor="gray.200"
    >
      <VStack align="stretch" gap={4}>
        <Heading size="md" color="green.700">
          🚜 Crop Risk Analyzer
        </Heading>
        <Text fontSize="sm" color="gray.600">
          We calculate market saturation to protect your profits.
        </Text>

        <Box>
          <Text mb={1} fontWeight="bold" fontSize="sm">
            Crop:
          </Text>
          <NativeSelect.Root>
            <NativeSelect.Field
              value={crop}
              onChange={(e) => setCrop(e.currentTarget.value)}
            >
              {CROPS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Box>

        <Box>
          <Text mb={1} fontWeight="bold" fontSize="sm">
            Planting Date:
          </Text>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Box>

        <Button
          colorPalette={result?.status === "warning" ? "orange" : "green"}
          onClick={handleSubmit}
          loading={loading}
          disabled={!date}
        >
          Check Market Status
        </Button>

        {result && (
          <Alert.Root
            status={result.status} // 'success' | 'warning' | 'error'
            variant="subtle"
            flexDirection="column"
            alignItems="start"
            justifyContent="center"
            textAlign="left"
            rounded="md"
            mt={2}
          >
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>
                {result.status === "success" && "Production Approved"}
                {result.status === "warning" && "Warning: High Risk"}
                {result.status === "error" && "Registration Blocked"}
              </Alert.Title>
              <Alert.Description fontSize="sm">
                {result.message}

                {/* ALTERNATIVE SUGGESTION (Only if Error) */}
                {result.status === "error" && (
                  <Box mt={2} p={2} bg="red.100" rounded="md">
                    <Text fontSize="xs" fontWeight="bold" color="red.800">
                      💡 Try planting Beans instead. Market is open.
                    </Text>
                  </Box>
                )}
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}
      </VStack>
    </Box>
  );
};

export default CropRegistrationForm;
