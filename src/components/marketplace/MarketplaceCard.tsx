"use client";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Text,
  Icon,
} from "@chakra-ui/react";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

function MarketplaceCard({ item }: { item: any }) {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/marketplace/${item.id}`);
  };

  return (
    <Box
      onClick={handleNavigate}
      bg="#FDF6E3"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="sm"
      transition="all 0.3s"
      cursor="pointer"
      _hover={{ transform: "translateY(-5px)", boxShadow: "md" }}
      border="1px solid"
      borderColor="transparent"
    >
      {/* Image Section */}
      <Box position="relative" h="160px" w="100%">
        <Image
          src={item.image}
          alt={item.name}
          objectFit="cover"
          w="100%"
          h="100%"
        />
        <Badge
          position="absolute"
          top={3}
          right={3}
          colorScheme={item.colorScheme}
          borderRadius="full"
          px={3}
          boxShadow="md"
        >
          {item.type}
        </Badge>
      </Box>

      {/* Content Section */}
      <Box p={4}>
        <Text fontSize="sm" color="gray.500" mb={1}>
          Package ({item.weight})
        </Text>
        <Heading size="md" color="#0F2B1D" mb={2}>
          {item.name}
        </Heading>

        <Flex justify="space-between" align="center" mt={4}>
          <Text fontWeight="bold" fontSize="lg" color="#0F2B1D">
            Rs.{item.price}.00
          </Text>
          <Button
            size="sm"
            bg="#D4F2C4"
            color="#0F2B1D"
            _hover={{ bg: "#C1E8AE" }}
            borderRadius="lg"
            onClick={(e) => {
              e.stopPropagation(); // Prevent double triggering
              handleNavigate();
            }}
          >
            <Flex align="center" gap={2}>
              <Icon as={ShoppingCart} boxSize={4} />
              <Text>Add</Text>
            </Flex>
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}

export default MarketplaceCard;
