import { Box, Button, HStack, Separator, Text, VStack, Heading } from "@chakra-ui/react";

type OrderSummaryProps = {
  subtotal: number;
  shipping: number;
  total: number;
  loading: boolean;
  onCheckout: () => void;
};

export function OrderSummary({
  subtotal,
  shipping,
  total,
  loading,
  onCheckout,
}: OrderSummaryProps) {
  return (
    <Box flex="1" w="full">
      <Box
        bg="white"
        p={6}
        rounded="lg"
        shadow="sm"
        border="1px solid"
        borderColor="gray.100"
        position={{ lg: "sticky" }}
        top="20px"
      >
        <Heading size="md" mb={6} color="gray.800">
          Order Summary
        </Heading>

        <VStack gap={4} align="stretch" mb={6}>
          <HStack justify="space-between" color="gray.600">
            <Text>Subtotal</Text>
            <Text fontWeight="medium">LKR {subtotal.toLocaleString()}</Text>
          </HStack>
          <HStack justify="space-between" color="gray.600">
            <Text>Shipping Estimate</Text>
            <Text fontWeight="medium">
              {shipping === 0 ? "Free" : `LKR ${shipping}`}
            </Text>
          </HStack>
          <Separator borderColor="gray.200" />
          <HStack justify="space-between" fontSize="lg" fontWeight="bold">
            <Text color="gray.800">Total</Text>
            <Text color="#0D2818">LKR {total.toLocaleString()}</Text>
          </HStack>
        </VStack>

        <Button
          w="full"
          bg="#0D2818"
          color="#D6E8D5"
          size="xl"
          fontSize="lg"
          _hover={{ bg: "green.800", transform: "translateY(-2px)" }}
          transition="all 0.2s"
          onClick={onCheckout}
          loading={loading}
          disabled={loading}
        >
          {loading ? "Placing Order..." : "Checkout"}
        </Button>

        <Text fontSize="xs" color="gray.500" mt={4} textAlign="center">
          Your order will be sent to admin for delivery/COD processing.
        </Text>
      </Box>
    </Box>
  );
}
