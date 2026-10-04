import { Box, Flex, HStack, IconButton, Image, Text, Heading } from "@chakra-ui/react";
import { Minus, Plus, Trash2 } from "lucide-react";

type CartItemProps = {
  item: any;
  onQuantityChange: (id: number, change: number) => void;
  onRemove: (productId: number, cartRowId: number) => void;
};

export function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  return (
    <Flex
      bg="white"
      p={4}
      rounded="lg"
      shadow="sm"
      border="1px solid"
      borderColor="gray.100"
      gap={4}
      direction={{ base: "column", sm: "row" }}
      align={{ base: "start", sm: "center" }}
    >
      <Box
        bg="gray.100"
        rounded="md"
        overflow="hidden"
        w={{ base: "100%", sm: "100px" }}
        h="100px"
      >
        <Image
          src={item.image_links || item.image || "https://placehold.co/100"}
          alt={item.name}
          w="full"
          h="full"
          objectFit="cover"
        />
      </Box>

      <Box flex="1">
        <Text fontSize="sm" color="gray.500" fontWeight="medium">
          {item.category}
        </Text>
        <Heading size="md" color="gray.800" mb={1}>
          {item.name}
        </Heading>
        <Text fontWeight="bold" color="#0D2818">
          LKR {Number(item.price || 0).toLocaleString()}
        </Text>
      </Box>

      <HStack w={{ base: "full", sm: "auto" }} justify="space-between" gap={6}>
        <HStack border="1px solid" borderColor="gray.300" rounded="md">
          <IconButton
            variant="ghost"
            size="sm"
            aria-label="Decrease quantity"
            onClick={() => onQuantityChange(item.id, -1)}
            disabled={item.quantity <= 1}
          >
            <Minus size={16} />
          </IconButton>
          <Text fontWeight="bold" w="30px" textAlign="center">
            {item.quantity}
          </Text>
          <IconButton
            variant="ghost"
            size="sm"
            aria-label="Increase quantity"
            onClick={() => onQuantityChange(item.id, 1)}
          >
            <Plus size={16} />
          </IconButton>
        </HStack>

        <IconButton
          variant="ghost"
          color="red.500"
          aria-label="Remove item"
          _hover={{ bg: "red.50" }}
          onClick={() => onRemove(item.id, item.cart_row_id)}
        >
          <Trash2 size={18} />
        </IconButton>
      </HStack>
    </Flex>
  );
}
