"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Image,
  Heading,
  Text,
  Button,
  IconButton,
  Badge,
  SimpleGrid,
  Icon,
} from "@chakra-ui/react";
import {
  Minus,
  Plus,
  ShoppingCart,
  ArrowLeft,
  Heart,
  Share2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ALL_ITEMS } from "@/data/data";

function DetailedCardPage() {
  const router = useRouter();
  const params = useParams();

  // Find the item based on the URL ID
  // Note: params.id is a string, so we convert item.id to string for comparison
  const item = ALL_ITEMS.find((i) => i.id.toString() === params.id);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(item?.image);

  // Update selected image if item loads (prevents hydration mismatch)
  useEffect(() => {
    if (item) setSelectedImage(item.image);
  }, [item]);

  if (!item) {
    return <Box p={10}>Item not found</Box>;
  }

  const handleIncrement = () => setQuantity((p) => p + 1);
  const handleDecrement = () => setQuantity((p) => (p > 1 ? p - 1 : 1));

  return (
    <Box minH="100vh" bg="#D4F2C4" p={{ base: 4, md: 8 }}>
      {/* Back Button */}
      <Button
        onClick={() => router.back()}
        variant="ghost"
        color="#0F2B1D"
        mb={6}
        _hover={{ bg: "rgba(15, 43, 29, 0)" }}
      >
        <ArrowLeft />
        Back to Marketplace
      </Button>

      {/* Main Content Card */}
      <Box
        bg="white"
        borderRadius="3xl"
        overflow="hidden"
        boxShadow="xl"
        maxW="1200px"
        mx="auto"
      >
        <Flex direction={{ base: "column", md: "row" }}>
          {/* LEFT: Image Gallery */}
          <Box w={{ base: "100%", md: "50%" }} bg="#FDF6E3" p={8}>
            <Box
              borderRadius="2xl"
              overflow="hidden"
              h={{ base: "300px", md: "450px" }}
              mb={4}
              boxShadow="lg"
            >
              <Image
                src={selectedImage}
                alt={item.name}
                w="100%"
                h="100%"
                objectFit="cover"
              />
            </Box>

            {/* Thumbnails */}
            <Flex gap={4} justify="center">
              {item.images?.map((img, idx) => (
                <Box
                  key={idx}
                  w="80px"
                  h="80px"
                  borderRadius="xl"
                  overflow="hidden"
                  cursor="pointer"
                  border="2px solid"
                  borderColor={
                    selectedImage === img ? "#0F2B1D" : "transparent"
                  }
                  opacity={selectedImage === img ? 1 : 0.6}
                  onClick={() => setSelectedImage(img)}
                  transition="all 0.2s"
                  _hover={{ opacity: 1, transform: "scale(1.05)" }}
                >
                  <Image src={img} w="100%" h="100%" objectFit="cover" />
                </Box>
              ))}
            </Flex>
          </Box>

          {/* RIGHT: Details */}
          <Box w={{ base: "100%", md: "50%" }} p={{ base: 6, md: 10 }}>
            <Flex justify="space-between" align="start" mb={2}>
              <Badge
                colorScheme={item.colorScheme}
                fontSize="0.9em"
                px={3}
                py={1}
                borderRadius="full"
              >
                {item.tag}
              </Badge>
              <Flex gap={2}>
                <IconButton aria-label="Share" variant="ghost">
                  <Share2 />
                </IconButton>
                <IconButton aria-label="Like" variant="ghost">
                  <Heart size={20} />
                </IconButton>
              </Flex>
            </Flex>

            <Heading size="2xl" color="#0F2B1D" mb={2}>
              {item.name}
            </Heading>
            <Text fontSize="lg" color="gray.500" mb={6}>
              {item.unit}
            </Text>

            <Text fontSize="3xl" fontWeight="bold" color="#0F2B1D" mb={6}>
              {item.price}
            </Text>

            <Text color="gray.600" fontSize="lg" lineHeight="1.8" mb={8}>
              {item.description}
            </Text>

            {/* Quantity Selector */}
            <Box mb={8}>
              <Text fontWeight="bold" mb={3} color="#0F2B1D">
                Quantity
              </Text>
              <Flex
                align="center"
                w="fit-content"
                border="2px solid"
                borderColor="gray.100"
                borderRadius="xl"
                p={1}
              >
                <IconButton
                  aria-label="Decrease"
                  variant="ghost"
                  onClick={handleDecrement}
                  color="#0F2B1D"
                >
                  <Minus size={18} />
                </IconButton>
                <Text px={6} fontWeight="bold" fontSize="lg">
                  {quantity}
                </Text>
                <IconButton
                  aria-label="Increase"
                  variant="ghost"
                  onClick={handleIncrement}
                  color="#0F2B1D"
                >
                  <Plus size={18} />
                </IconButton>
              </Flex>
            </Box>

            {/* Action Buttons */}
            <Flex gap={4} direction={{ base: "column", sm: "row" }}>
              <Button
                flex={1}
                size="lg"
                bg="#0F2B1D"
                color="white"
                _hover={{ bg: "#1a4a32" }}
                h="56px"
                fontSize="lg"
                borderRadius={10}
              >
                <Icon as={ShoppingCart} />
                Add to Cart
              </Button>
            </Flex>

            {/* Additional Info Box (Optional) */}
            <SimpleGrid
              columns={2}
              gap={4}
              mt={10}
              pt={10}
              borderTop="1px solid"
              borderColor="gray.100"
            >
              <Box>
                <Text color="gray.400" fontSize="sm">
                  Delivery
                </Text>
                <Text fontWeight="medium">2-3 Days</Text>
              </Box>
              <Box>
                <Text color="gray.400" fontSize="sm">
                  Return Policy
                </Text>
                <Text fontWeight="medium">30 Days</Text>
              </Box>
            </SimpleGrid>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

export default DetailedCardPage;
