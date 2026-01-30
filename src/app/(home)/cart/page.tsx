"use client";

import React, { useState, useEffect } from "react"; // Import useEffect
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  VStack,
  HStack,
  Separator,
  IconButton,
  Spinner, // Import Spinner for loading state
  Center,
} from "@chakra-ui/react";
import { Trash2, Minus, Plus, ShoppingBag, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";

const THEME = {
  primary: "#0D2818",
  accent: "#D6E8D5",
  bg: "#f4fcf6",
};
// --- Dummy Data ---
const initialCartItems = [
  {
    id: 1,
    name: "Organic Carrots (1kg)",
    category: "Vegetables",
    price: 450,
    image:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=300&q=80",
    quantity: 2,
  },
  {
    id: 2,
    name: "Red Pumpkin",
    category: "Vegetables",
    price: 300,
    image:
      "https://images.unsplash.com/photo-1570586437263-ab629fccc818?auto=format&fit=crop&w=300&q=80",
    quantity: 1,
  },
  {
    id: 3,
    name: "NPK Fertilizer (5kg)",
    category: "Supplies",
    price: 2500,
    image:
      "https://images.unsplash.com/photo-1628157588553-53970aa6b315?auto=format&fit=crop&w=300&q=80",
    quantity: 1,
  },
];
function CartPage() {
  const { cart, loading, error } = useCart();
  const [cartItems, setCartItems] = useState<any[]>([]);

  console.log(cartItems);

  // --- FIX: Sync local state with fetched data ---
  useEffect(() => {
    if (cart && cart.length > 0) {
      setCartItems(cart[0].items || []);
    }
  }, [cart]);

  // --- Logic Helpers ---
  const updateQuantity = (id: number, change: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }),
    );
  };

  const removeItem = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 5000 ? 0 : 350;
  const total = subtotal + shipping;

  // --- Loading State ---
  if (loading) {
    return (
      <Center minH="100vh" bg={THEME.bg}>
        <Spinner size="xl" color={THEME.primary} />
      </Center>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <Center minH="100vh" bg={THEME.bg}>
        <Text color="red.500">Error loading cart. Please try again.</Text>
      </Center>
    );
  }

  // --- Empty State Component ---
  if (cartItems.length === 0) {
    return (
      <Box
        minH="100vh"
        bg={THEME.bg}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack gap={6} textAlign="center" p={8}>
          <Box bg={THEME.accent} p={6} rounded="full">
            <ShoppingBag size={48} color={THEME.primary} />
          </Box>
          <Heading color={THEME.primary} size="xl">
            Your Cart is Empty
          </Heading>
          <Text color="gray.600" maxW="md">
            Looks like you haven't added any fresh produce or supplies yet. Head
            over to the marketplace to start shopping!
          </Text>
          <Link href={"/marketplace"}>
            <Button
              bg={THEME.primary}
              color="white"
              size="lg"
              _hover={{ bg: "green.800" }}
            >
              Start Shopping
            </Button>
          </Link>
        </VStack>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={THEME.bg} p={{ base: 4, md: 8 }}>
      <Box maxW="1200px" mx="auto">
        {/* Header */}
        <HStack mb={8} justify="space-between">
          <Heading color={THEME.primary} size="xl">
            Shopping Cart ({cartItems.length})
          </Heading>
        </HStack>

        <Flex gap={8} direction={{ base: "column", lg: "row" }}>
          {/* ---  Cart Items List --- */}
          <VStack flex="2" align="stretch" gap={4}>
            {cartItems.map((item) => (
              <Flex
                key={item.id}
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
                {/* Product Image */}
                <Box
                  bg="gray.100"
                  rounded="md"
                  overflow="hidden"
                  w={{ base: "100%", sm: "100px" }}
                  h="100px"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    w="full"
                    h="full"
                    objectFit="cover"
                  />
                </Box>

                {/* Product Details */}
                <Box flex="1">
                  <Text fontSize="sm" color="gray.500" fontWeight="medium">
                    {item.category}
                  </Text>
                  <Heading size="md" color="gray.800" mb={1}>
                    {item.name}
                  </Heading>
                  <Text fontWeight="bold" color={THEME.primary}>
                    LKR {item.price?.toLocaleString() || 0}
                  </Text>
                </Box>

                {/* Quantity & Remove */}
                <HStack
                  w={{ base: "full", sm: "auto" }}
                  justify="space-between"
                  gap={6}
                >
                  <HStack
                    border="1px solid"
                    borderColor="gray.300"
                    rounded="md"
                  >
                    <IconButton
                      variant="ghost"
                      size="sm"
                      aria-label="Decrease quantity"
                      onClick={() => updateQuantity(item.id, -1)}
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
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus size={16} />
                    </IconButton>
                  </HStack>

                  <IconButton
                    variant="ghost"
                    color="red.500"
                    aria-label="Remove item"
                    _hover={{ bg: "red.50" }}
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </HStack>
              </Flex>
            ))}

            <Link href="/marketplace">
              <Button
                variant="ghost"
                justifyContent="start"
                w="fit-content"
                color="gray.600"
              >
                <ChevronLeft size={18} /> Continue Shopping
              </Button>
            </Link>
          </VStack>

          {/* --- Order Summary --- */}
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
                  <Text fontWeight="medium">
                    LKR {subtotal.toLocaleString()}
                  </Text>
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
                  <Text color={THEME.primary}>
                    LKR {total.toLocaleString()}
                  </Text>
                </HStack>
              </VStack>

              <Button
                w="full"
                bg={THEME.primary}
                color={THEME.accent}
                size="xl"
                fontSize="lg"
                _hover={{ bg: "green.800", transform: "translateY(-2px)" }}
                transition="all 0.2s"
              >
                Checkout
              </Button>

              <Text fontSize="xs" color="gray.500" mt={4} textAlign="center">
                Secure checkout powered by PayHere
              </Text>
            </Box>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

export default CartPage;
