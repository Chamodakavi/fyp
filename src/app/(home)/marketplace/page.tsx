"use client"; // Important for Next.js App Router to allow hooks like useState

import React, { useEffect, useState } from "react";
import {
  Box,
  SimpleGrid,
  Text,
  Button,
  Image,
  Flex,
  Badge,
  Heading,
  Icon,
  Input,
  InputGroup,
} from "@chakra-ui/react";
import {
  Search,
  ShoppingCart,
  Filter,
  Sprout,
  Hammer,
  HammerIcon,
} from "lucide-react";
import MarketplaceCard from "@/components/marketplace/MarketplaceCard";
import { useProducts } from "@/hooks/useProducts";

// ---  MAIN PAGE COMPONENT ---
function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const { products, loading, error } = useProducts();

  // Filter logic
  //const itemsToDisplay = activeCategory === "seeds" ? SEEDS_DATA : TOOLS_DATA;

  return (
    <Box w="100%" minH="100vh" bg="#D4F2C4" p={8}>
      {/* Page Header */}
      <Box
        justifyContent="space-between"
        alignContent="center"
        mb={8}
        spaceY={3}
        display={{ base: "block", md: "flex" }}
      >
        <Box>
          <Heading color="#0F2B1D" mb={1}>
            Marketplace
          </Heading>
          <Text color="gray.600">Find the best supplies for your farm</Text>
        </Box>

        {/*  Search Bar */}
        <InputGroup
          startElement={<Icon as={Search} color="gray.400" />}
          w="300px"
          bg="#FDF6E3"
          borderRadius="full"
          border={"none"}
        >
          <Input
            type="text"
            placeholder="Search items..."
            border="none"
            _focus={{ boxShadow: "none" }}
            focusRing={"none"}
          />
        </InputGroup>
      </Box>

      {/* Category Filter Tabs */}
      <Flex gap={2} mb={8} justify={{ base: "space-around", md: "left" }}>
        <Button
          onClick={() => setActiveCategory("all")}
          bg={activeCategory === "all" ? "#0F2B1D" : "transparent"}
          color={activeCategory === "all" ? "white" : "#0F2B1D"}
          border="1px solid #0F2B1D"
          borderRadius="full"
          // leftIcon={<Icon as={Sprout} />}
          px={6}
          _hover={{
            bg: activeCategory === "all" ? "#0F2B1D" : "rgba(15, 43, 29, 0.1)",
          }}
        >
          <Sprout />
          All
        </Button>

        <Button
          onClick={() => setActiveCategory("seeds")}
          bg={activeCategory === "seeds" ? "#0F2B1D" : "transparent"}
          color={activeCategory === "seeds" ? "white" : "#0F2B1D"}
          border="1px solid #0F2B1D"
          borderRadius="full"
          // leftIcon={<Icon as={Sprout} />}
          px={6}
          _hover={{
            bg:
              activeCategory === "seeds" ? "#0F2B1D" : "rgba(15, 43, 29, 0.1)",
          }}
        >
          <Sprout />
          Seeds
        </Button>

        <Button
          onClick={() => setActiveCategory("tools")}
          bg={activeCategory === "tools" ? "#0F2B1D" : "transparent"}
          color={activeCategory === "tools" ? "white" : "#0F2B1D"}
          border="1px solid #0F2B1D"
          borderRadius="full"
          //  leftIcon={<Icon as={Hammer} />}
          px={6}
          _hover={{
            bg:
              activeCategory === "tools" ? "#0F2B1D" : "rgba(15, 43, 29, 0.1)",
          }}
        >
          <HammerIcon />
          Tools
        </Button>
      </Flex>

      {/* Product Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={6}>
        {products.map((item) => (
          <MarketplaceCard key={item.id} item={item} />
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default MarketplacePage;
