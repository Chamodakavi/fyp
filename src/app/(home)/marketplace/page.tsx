"use client"; // Important for Next.js App Router to allow hooks like useState

import React, { useState } from "react";
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

// --- 1. DUMMY DATA ---
const SEEDS_DATA = [
  {
    id: 1,
    name: "Hybrid Tomato Seeds",
    price: "Rs 450.00",
    unit: "Packet (10g)",
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=300&h=200",
    tag: "High Yield",
    colorScheme: "red",
  },
  {
    id: 2,
    name: "Organic Carrot Seeds",
    price: "Rs 320.00",
    unit: "Packet (15g)",
    image:
      "https://images.unsplash.com/photo-1445282768818-728615cc8d07?auto=format&fit=crop&q=80&w=300&h=200",
    tag: "Organic",
    colorScheme: "orange",
  },
  {
    id: 3,
    name: "Green Spinach Seeds",
    price: "Rs 150.00",
    unit: "Packet (20g)",
    image:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=300&h=200",
    tag: "Fast Growth",
    colorScheme: "green",
  },
  {
    id: 4,
    name: "Bell Pepper Seeds",
    price: "Rs 500.00",
    unit: "Packet (5g)",
    image:
      "https://images.unsplash.com/photo-1563565375-f3fdf5dbc240?auto=format&fit=crop&q=80&w=300&h=200",
    tag: "Imported",
    colorScheme: "yellow",
  },
];

const TOOLS_DATA = [
  {
    id: 1,
    name: "Heavy Duty Shovel",
    price: "Rs 1,200.00",
    unit: "1 Unit",
    image:
      "https://images.unsplash.com/photo-1622383563227-044011358d16?auto=format&fit=crop&q=80&w=300&h=200",
    tag: "Durability",
    colorScheme: "gray",
  },
  {
    id: 2,
    name: "Garden Rake",
    price: "Rs 850.00",
    unit: "1 Unit",
    image:
      "https://images.unsplash.com/photo-1589051039495-2c2627447996?auto=format&fit=crop&q=80&w=300&h=200",
    tag: "Essential",
    colorScheme: "teal",
  },
  {
    id: 3,
    name: "Watering Can (5L)",
    price: "Rs 600.00",
    unit: "1 Unit",
    image:
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=300&h=200",
    tag: "Plastic",
    colorScheme: "blue",
  },
];

// ---  MAIN PAGE COMPONENT ---
function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("seeds"); // Default is 'seeds'

  // Filter logic
  const itemsToDisplay = activeCategory === "seeds" ? SEEDS_DATA : TOOLS_DATA;

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
        {itemsToDisplay.map((item) => (
          <MarketplaceCard key={item.id} item={item} />
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default MarketplacePage;
