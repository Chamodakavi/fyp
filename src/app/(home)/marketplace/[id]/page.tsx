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
// 👇 IMPORT TOASTER FROM YOUR SNIPPET
import { toaster } from "@/components/ui/toaster";
import {
  Minus,
  Plus,
  ShoppingCart,
  ArrowLeft,
  Heart,
  Share2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/utils/supabase/createClient";
import { Check } from "lucide-react";

function DetailedCardPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  const { user } = useUser();
  const { products } = useProducts();

  const item = products.find((i) => i.id.toString() === params.id);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(item?.image);
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (item) setSelectedImage(item.image);
  }, [item]);

  if (!item) return <Box p={10}>Loading or Item not found...</Box>;

  const handleIncrement = () => setQuantity((p) => p + 1);
  const handleDecrement = () => setQuantity((p) => (p > 1 ? p - 1 : 1));

  const handleAddToCart = async () => {
    if (!user) {
      toaster.create({ title: "Please login first", type: "warning" });
      router.push("/");
      return;
    }

    setIsAdding(true);

    try {
      // 1. Check if item exists
      const { data: existingItem, error: fetchError } = await supabase
        .from("cart")
        .select("id, qty")
        .eq("user_id", user.id)
        .eq("product_id", item.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }

      let error;

      if (existingItem) {
        // 2. Update Quantity
        const result = await supabase
          .from("cart")
          .update({ quantity: existingItem.qty + quantity })
          .eq("id", existingItem.id);
        error = result.error;
      } else {
        // 3. Insert New Row
        const result = await supabase.from("cart").insert({
          user_id: user.id,
          product_id: item.id,
          qty: quantity,
        });
        error = result.error;
      }

      // 🛑 CRITICAL CHECK: If DB says no, throw error immediately
      if (error) throw error;

      // 4. Success Toast
      toaster.create({
        title: "Added to Cart!",
        type: "success",
        duration: 2000,
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        // router.push("/cart");
      }, 1000);
    } catch (error: any) {
      console.error("Cart Error:", error.message); // Check Console!
      toaster.create({
        title: "Error adding to cart",
        description: error.message || "Database rejected the item",
        type: "error",
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Box minH="100vh" bg="#D4F2C4" p={{ base: 4, md: 8 }}>
      <Button
        onClick={() => router.back()}
        variant="ghost"
        color="#0F2B1D"
        mb={6}
        _hover={{ bg: "transparent", opacity: 0.7 }}
      >
        <ArrowLeft /> Back
      </Button>

      <Box
        bg="white"
        borderRadius="3xl"
        overflow="hidden"
        boxShadow="xl"
        maxW="1200px"
        mx="auto"
      >
        <Flex direction={{ base: "column", md: "row" }}>
          {/* LEFT: Image Section */}
          <Box w={{ base: "100%", md: "50%" }} bg="#FDF6E3" p={8}>
            <Box
              borderRadius="2xl"
              overflow="hidden"
              h={{ base: "300px", md: "450px" }}
              mb={4}
            >
              <Image
                src={selectedImage || item.image}
                alt={item.name}
                w="100%"
                h="100%"
                objectFit="cover"
              />
            </Box>
            <Flex gap={4} justify="center">
              {(item.images || [item.image]).map((img: string, id: number) => (
                <Box
                  key={id}
                  w="80px"
                  h="80px"
                  borderRadius="xl"
                  border="2px solid"
                  borderColor={
                    selectedImage === img ? "#0F2B1D" : "transparent"
                  }
                  opacity={selectedImage === img ? 1 : 0.6}
                  onClick={() => setSelectedImage(img)}
                  cursor="pointer"
                >
                  <Image src={img} w="100%" h="100%" objectFit="cover" />
                </Box>
              ))}
            </Flex>
          </Box>

          {/* RIGHT: Details Section */}
          <Box w={{ base: "100%", md: "50%" }} p={{ base: 6, md: 10 }}>
            <Flex justify="space-between" mb={2}>
              <Badge
                colorPalette={item.colorScheme || "green"} // colorScheme -> colorPalette in v3
                borderRadius="full"
                px={3}
              >
                {item.tag || item.category}
              </Badge>
              <Flex gap={2}>
                <Share2 size={20} />
                <Heart size={20} />
              </Flex>
            </Flex>

            <Heading size="2xl" color="#0F2B1D" mb={2}>
              {item.name}
            </Heading>
            <Text fontSize="lg" color="gray.500" mb={6}>
              {item.unit}
            </Text>
            <Text fontSize="3xl" fontWeight="bold" color="#0F2B1D" mb={6}>
              LKR {item.price?.toLocaleString()}
            </Text>
            <Text color="gray.600" fontSize="lg" mb={8}>
              {item.description || "No description available."}
            </Text>

            {/* Quantity */}
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
                  disabled={quantity <= 1}
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
                >
                  <Plus size={18} />
                </IconButton>
              </Flex>
            </Box>

            {/* Add to Cart Button */}
            <Button
              w="full"
              size="lg"
              h="56px"
              borderRadius={10}
              bg={isSuccess ? "green.500" : "#0F2B1D"}
              color="white"
              _hover={{ bg: isSuccess ? "green.600" : "#1a4a32" }}
              onClick={handleAddToCart}
              loading={isAdding} // isLoading -> loading in v3
              loadingText="Adding..."
              disabled={isSuccess}
            >
              {isSuccess ? (
                <>
                  <Icon as={Check} mr={2} boxSize={6} /> Added!
                </>
              ) : (
                <>
                  <Icon as={ShoppingCart} mr={2} /> Add to Cart
                </>
              )}
            </Button>

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
                  Returns
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
