import {
  Badge,
  Box,
  Button,
  Dialog,
  Flex,
  HStack,
  Image,
  Separator,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { PackageCheck, X } from "lucide-react";
import {
  canCancelOrder,
  getStatusColor,
  getStatusIcon,
  getStatusLabel,
  getStatusMessage,
} from "./orderUtils";

type OrderDetailsModalProps = {
  order: any | null;
  open: boolean;
  onClose: () => void;
  onCancel: (orderId: string | number) => Promise<void>;
  cancelling: boolean;
};

export function OrderDetailsModal({
  order,
  open,
  onClose,
  onCancel,
  cancelling,
}: OrderDetailsModalProps) {
  if (!order) return null;

  const cancellable = canCancelOrder(order);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details) => !details.open && onClose()}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="700px" mx={4}>
          <Dialog.Header>
            <Dialog.Title>
              <HStack color="#0D2818">
                <PackageCheck size={21} />
                <Text>Order #{order.id}</Text>
              </HStack>
            </Dialog.Title>
            <Dialog.CloseTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Close order details"
              >
                <X size={18} />
              </Button>
            </Dialog.CloseTrigger>
          </Dialog.Header>

          <Dialog.Body>
            <VStack align="stretch" gap={5}>
              <Flex justify="space-between" gap={4} wrap="wrap">
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Placed on
                  </Text>
                  <Text fontWeight="medium">
                    {new Date(order.created_at).toLocaleString()}
                  </Text>
                </Box>
                <Box textAlign={{ base: "left", sm: "right" }}>
                  <Text fontSize="sm" color="gray.500">
                    Total
                  </Text>
                  <Text fontWeight="bold" color="#0D2818" fontSize="lg">
                    LKR {Number(order.total_amount || 0).toLocaleString()}
                  </Text>
                </Box>
              </Flex>

              <HStack bg="#F8FCF4" rounded="lg" p={4} color="#0D2818">
                {getStatusIcon(order.status)}
                <Box>
                  <HStack>
                    <Badge colorPalette={getStatusColor(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </HStack>
                  <Text fontSize="sm" mt={1}>
                    {getStatusMessage(order.status)}
                  </Text>
                </Box>
              </HStack>

              {order.admin_note && (
                <Box
                  bg="gray.50"
                  borderLeft="4px solid"
                  borderColor="green.500"
                  rounded="lg"
                  p={4}
                >
                  <Text fontSize="sm" fontWeight="bold" color="#0D2818">
                    Admin Note
                  </Text>
                  <Text fontSize="sm" color="gray.700" mt={1}>
                    {order.admin_note}
                  </Text>
                </Box>
              )}

              <Box>
                <Text fontWeight="bold" mb={3}>
                  Items
                </Text>
                <Stack gap={3}>
                  {(order.items || []).map((item: any) => (
                    <Flex
                      key={item.id}
                      justify="space-between"
                      align="center"
                      bg="gray.50"
                      rounded="lg"
                      p={3}
                      gap={3}
                    >
                      <HStack>
                        <Image
                          src={item.product_image || "https://placehold.co/60"}
                          alt={item.product_name}
                          boxSize="52px"
                          rounded="md"
                          objectFit="cover"
                          bg="gray.100"
                        />
                        <Box>
                          <Text fontWeight="bold" color="gray.800">
                            {item.product_name}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            Qty: {item.quantity} × LKR{" "}
                            {Number(item.product_price || 0).toLocaleString()}
                          </Text>
                        </Box>
                      </HStack>
                      <Text fontWeight="bold" color="#0D2818">
                        LKR {Number(item.subtotal || 0).toLocaleString()}
                      </Text>
                    </Flex>
                  ))}
                </Stack>
              </Box>
            </VStack>
          </Dialog.Body>

          <Dialog.Footer>
            {cancellable ? (
              <Button
                colorPalette="red"
                onClick={() => onCancel(order.id)}
                loading={cancelling}
                disabled={cancelling}
              >
                Cancel Order
              </Button>
            ) : (
              <Text fontSize="sm" color="gray.500">
                {order.status === "cancelled"
                  ? "This order is already cancelled."
                  : "This order can no longer be cancelled."}
              </Text>
            )}
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
