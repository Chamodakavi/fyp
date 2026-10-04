"use client";

import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Text,
  Input,
  Button,
  Container,
  Spinner,
  Image,
  Badge,
  Icon,
  Grid,
} from "@chakra-ui/react";
import { Store, ShoppingCart, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProducts } from "@/hooks/useProducts"; // Ensure this matches your path

// -----------------------------------------------------------------
// 1. Marketplace Card Component (User Facing)
// -----------------------------------------------------------------
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
          src={item.image || "https://placehold.co/400x300"}
          alt={item.name}
          objectFit="cover"
          w="100%"
          h="100%"
        />
        <Badge
          position="absolute"
          top={3}
          right={3}
          colorPalette={item.type === "seeds" ? "green" : "orange"}
          borderRadius="full"
          px={3}
          boxShadow="md"
          textTransform="capitalize"
        >
          {item.type}
        </Badge>
      </Box>

      {/* Content Section */}
      <Box p={4}>
        <Text fontSize="sm" color="gray.500" mb={1}>
          {item.stock > 0 ? `In Stock: ${item.stock}` : "Out of Stock"}
        </Text>
        <Heading size="md" color="#0F2B1D" mb={2} truncate>
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
              e.stopPropagation(); // Prevent double triggering navigation
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

// -----------------------------------------------------------------
// 2. Main Marketplace Page Component
// -----------------------------------------------------------------
export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  // Pass active tab and the applied search term to the hook
  const { products, loading } = useProducts(activeTab, appliedSearch);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(searchInput);
  };

  const clearSearch = () => {
    setSearchInput("");
    setAppliedSearch("");
  };

  return (
    <Box bg="gray.50" minH="100vh" py="10" px={{ base: 4, md: 8 }}>
      <Container maxW="7xl">
        {/* --- HEADER TEMPLATE --- */}
        <Flex
          justify="space-between"
          align={{ base: "start", md: "flex-end" }}
          direction={{ base: "column", md: "row" }}
          mb={8}
          gap={6}
        >
          <Box>
            <HStack color="#0F2B1D" mb="2">
              <Store size={28} />
              <Heading size={{ base: "2xl", md: "3xl" }}>Marketplace</Heading>
            </HStack>
            <Text color="gray.600">
              Browse agricultural tools, seeds, and equipment for your farm.
            </Text>
          </Box>

          {/* Search Bar */}
          <Box w={{ base: "full", md: "350px" }}>
            <form onSubmit={handleSearchSubmit}>
              <Flex
                align="center"
                bg="white"
                px={4}
                py={2}
                borderRadius="full"
                border="1px solid"
                borderColor="gray.200"
                shadow="sm"
              >
                <Search color="gray" size={18} />
                <Input
                  placeholder="Search products..."
                  ml={3}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                {appliedSearch && (
                  <Button size="xs" variant="ghost" onClick={clearSearch}>
                    Clear
                  </Button>
                )}
              </Flex>
            </form>
          </Box>
        </Flex>

        {/* --- FILTER BUTTONS --- */}
        <HStack gap="3" mb="8" flexWrap="wrap">
          {(["all", "seeds", "tools"] as const).map((tab) => (
            <Button
              key={tab}
              size="sm"
              borderRadius="full"
              colorPalette={activeTab === tab ? "green" : "gray"}
              variant={activeTab === tab ? "solid" : "outline"}
              onClick={() => setActiveTab(tab)}
              textTransform="capitalize"
              px={6}
            >
              {tab}
            </Button>
          ))}
        </HStack>

        {/* --- PRODUCT GRID --- */}
        {loading ? (
          <Flex justify="center" p={20}>
            <Spinner color="#0F2B1D" size="xl" />
          </Flex>
        ) : products.length === 0 ? (
          <Flex
            direction="column"
            align="center"
            justify="center"
            p={20}
            bg="white"
            borderRadius="xl"
            border="1px dashed"
            borderColor="gray.300"
          >
            <Store
              size={48}
              color="gray"
              style={{ opacity: 0.5, marginBottom: "16px" }}
            />
            <Heading size="md" color="gray.600">
              No Products Found
            </Heading>
            <Text color="gray.500" mt={2}>
              Try adjusting your search or category filters.
            </Text>
          </Flex>
        ) : (
          <Grid
            templateColumns={{
              base: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={6}
          >
            {products.map((product) => (
              <MarketplaceCard key={product.id} item={product} />
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
