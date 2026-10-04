"use client";

import React, { useEffect, useState } from "react";
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

import { toaster } from "@/components/ui/toaster";

import {
  Minus,
  Plus,
  ShoppingCart,
  ArrowLeft,
  Heart,
  Share2,
  Check,
} from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/utils/supabase/createClient";

function DetailedCardPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  const { user } = useUser();
  const { products } = useProducts();

  // Safely get the ID from Next.js params
  const productId = Array.isArray(params.id) ? params.id[0] : params.id;

  const item = products.find((product) => product.id.toString() === productId);

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setQuantity(1);
  }, [item]);

  if (!item) {
    return <Box p={10}>Loading or Item not found...</Box>;
  }

  const handleIncrement = () => {
    // Don't allow quantity above stock
    if (quantity < item.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = async () => {
    if (!user) {
      toaster.create({
        title: "Please login first",
        type: "warning",
      });

      router.push("/");
      return;
    }

    if (item.stock <= 0) {
      toaster.create({
        title: "Out of stock",
        type: "warning",
      });

      return;
    }

    setIsAdding(true);

    try {
      // Check whether this product is already in the cart
      const { data: existingItem, error: fetchError } = await supabase
        .from("cart")
        .select("id, qty")
        .eq("user_id", user.id)
        .eq("product_id", item.id)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      if (existingItem) {
        // Update existing quantity
        const newQuantity = Number(existingItem.qty) + quantity;

        if (newQuantity > item.stock) {
          toaster.create({
            title: "Not enough stock",
            description: `Only ${item.stock} items are available.`,
            type: "warning",
          });

          return;
        }

        const { error } = await supabase
          .from("cart")
          .update({
            qty: newQuantity,
          })
          .eq("id", existingItem.id);

        if (error) {
          throw error;
        }
      } else {
        // Add new cart item
        const { error } = await supabase.from("cart").insert({
          user_id: user.id,
          product_id: item.id,
          qty: quantity,
        });

        if (error) {
          throw error;
        }
      }

      toaster.create({
        title: "Added to Cart!",
        description: `${item.name} has been added to your cart.`,
        type: "success",
        duration: 2000,
      });

      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
      }, 1000);
    } catch (error: any) {
      console.error("Cart Error:", error);

      toaster.create({
        title: "Error adding to cart",
        description: error?.message || "Database rejected the item",
        type: "error",
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Box minH="100vh" bg="#D4F2C4" p={{ base: 4, md: 8 }}>
      {/* Back Button */}
      <Button
        onClick={() => router.back()}
        variant="ghost"
        color="#0F2B1D"
        mb={6}
        _hover={{
          bg: "transparent",
          opacity: 0.7,
        }}
      >
        <ArrowLeft />
        Back
      </Button>

      <Box
        bg="white"
        borderRadius="3xl"
        overflow="hidden"
        boxShadow="xl"
        maxW="1200px"
        mx="auto"
      >
        <Flex
          direction={{
            base: "column",
            md: "row",
          }}
        >
          {/* ============================= */}
          {/* LEFT - PRODUCT IMAGE */}
          {/* ============================= */}

          <Box
            w={{
              base: "100%",
              md: "50%",
            }}
            bg="#FDF6E3"
            p={8}
          >
            <Box
              borderRadius="2xl"
              overflow="hidden"
              h={{
                base: "300px",
                md: "450px",
              }}
              mb={4}
            >
              <Image
                src={item.image || "https://placehold.co/600x600"}
                alt={item.name}
                w="100%"
                h="100%"
                objectFit="cover"
              />
            </Box>

            {/* Single image thumbnail */}
            {item.image && (
              <Flex gap={4} justify="center">
                <Box
                  w="80px"
                  h="80px"
                  borderRadius="xl"
                  border="2px solid"
                  borderColor="#0F2B1D"
                  overflow="hidden"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                  />
                </Box>
              </Flex>
            )}
          </Box>

          {/* ============================= */}
          {/* RIGHT - PRODUCT DETAILS */}
          {/* ============================= */}

          <Box
            w={{
              base: "100%",
              md: "50%",
            }}
            p={{
              base: 6,
              md: 10,
            }}
          >
            {/* Type + Icons */}
            <Flex justify="space-between" mb={4}>
              <Badge
                colorPalette={item.type === "seeds" ? "green" : "orange"}
                borderRadius="full"
                px={3}
                textTransform="capitalize"
              >
                {item.type}
              </Badge>

              <Flex gap={4}>
                <Share2 size={20} cursor="pointer" />

                <Heart size={20} cursor="pointer" />
              </Flex>
            </Flex>

            {/* Product Name */}
            <Heading size="2xl" color="#0F2B1D" mb={2}>
              {item.name}
            </Heading>

            {/* Weight */}
            {item.weight && (
              <Text fontSize="lg" color="gray.500" mb={6}>
                {item.weight}
              </Text>
            )}

            {/* Price */}
            <Text fontSize="3xl" fontWeight="bold" color="#0F2B1D" mb={6}>
              LKR {item.price.toLocaleString()}
            </Text>

            {/* Description */}
            <Text color="gray.600" fontSize="lg" mb={8}>
              {item.description || "No description available."}
            </Text>

            {/* Stock */}
            <Text
              fontWeight="medium"
              mb={6}
              color={item.stock > 0 ? "green.600" : "red.500"}
            >
              {item.stock > 0
                ? `${item.stock} items available`
                : "Out of stock"}
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
                  aria-label="Decrease quantity"
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
                  aria-label="Increase quantity"
                  variant="ghost"
                  onClick={handleIncrement}
                  disabled={quantity >= item.stock}
                >
                  <Plus size={18} />
                </IconButton>
              </Flex>
            </Box>

            {/* Add To Cart */}
            <Button
              w="full"
              size="lg"
              h="56px"
              borderRadius={10}
              bg={isSuccess ? "green.500" : "#0F2B1D"}
              color="white"
              _hover={{
                bg: isSuccess ? "green.600" : "#1a4a32",
              }}
              onClick={handleAddToCart}
              loading={isAdding}
              loadingText="Adding..."
              disabled={isSuccess || item.stock <= 0}
            >
              {isSuccess ? (
                <>
                  <Icon as={Check} mr={2} boxSize={6} />
                  Added!
                </>
              ) : (
                <>
                  <Icon as={ShoppingCart} mr={2} />
                  Add to Cart
                </>
              )}
            </Button>

            {/* Delivery / Returns */}
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
