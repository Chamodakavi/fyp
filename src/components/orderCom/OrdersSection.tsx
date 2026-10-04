import { Badge, Box, Center, Heading, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import { PackageCheck } from "lucide-react";
import { OrderRow } from "./OrderRow";

type OrdersSectionProps = {
  orders: any[];
  loading: boolean;
  onSelectOrder: (order: any) => void;
};

export function OrdersSection({ orders, loading, onSelectOrder }: OrdersSectionProps) {
  return (
    <Box
      bg="white"
      rounded="2xl"
      shadow="sm"
      border="1px solid"
      borderColor="gray.100"
      p={{ base: 5, md: 6 }}
    >
      <HStack justify="space-between" mb={5}>
        <Box>
          <HStack color="#0D2818">
            <PackageCheck size={22} />
            <Heading size="md">My Orders</Heading>
          </HStack>
          <Text color="gray.600" fontSize="sm" mt={1}>
            Click an order to view its details and cancellation options.
          </Text>
        </Box>
        <Badge colorPalette="green" borderRadius="full" px={3}>
          {orders.length} Orders
        </Badge>
      </HStack>

      {loading ? (
        <Center py={10}>
          <Spinner color="#0D2818" />
        </Center>
      ) : orders.length === 0 ? (
        <Box border="1px dashed" borderColor="gray.300" rounded="xl" p={8} textAlign="center">
          <Text color="gray.500">No orders placed yet.</Text>
        </Box>
      ) : (
        <VStack align="stretch" gap={3}>
          {orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              onClick={() => onSelectOrder(order)}
            />
          ))}
        </VStack>
      )}
    </Box>
  );
}
