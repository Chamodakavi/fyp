import { Badge, Box, Flex, HStack, Text } from "@chakra-ui/react";
import { ChevronRight } from "lucide-react";
import { getStatusColor, getStatusLabel } from "./orderUtils";

type OrderRowProps = {
  order: any;
  onClick: () => void;
};

export function OrderRow({ order, onClick }: OrderRowProps) {
  return (
    <Box
      as="button"
      type="button"
      w="full"
      textAlign="left"
      bg="#F8FCF4"
      rounded="xl"
      border="1px solid"
      borderColor="green.100"
      p={5}
      cursor="pointer"
      transition="all 0.2s"
      _hover={{
        borderColor: "green.300",
        shadow: "sm",
        transform: "translateY(-1px)",
      }}
      _focusVisible={{
        outline: "2px solid",
        outlineColor: "green.500",
        outlineOffset: "2px",
      }}
      onClick={onClick}
    >
      <Flex justify="space-between" align="center" gap={4}>
        <Box minW={0}>
          <HStack mb={1} wrap="wrap">
            <Text fontWeight="bold" color="#0D2818">
              Order #{order.id}
            </Text>
            <Badge colorPalette={getStatusColor(order.status)}>
              {getStatusLabel(order.status)}
            </Badge>
          </HStack>

          <Text fontSize="sm" color="gray.600">
            {new Date(order.created_at).toLocaleString()}
          </Text>
        </Box>

        <HStack flexShrink={0}>
          <Box textAlign="right">
            <Text fontWeight="bold" color="#0D2818">
              LKR {Number(order.total_amount || 0).toLocaleString()}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {order.items?.length || 0} item(s)
            </Text>
          </Box>
          <ChevronRight size={20} />
        </HStack>
      </Flex>
    </Box>
  );
}
