"use client";

import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  HStack,
  VStack,
  Text,
  Input,
  Button,
  Table,
  Image,
  Container,
  Drawer,
  Portal,
  NativeSelect,
} from "@chakra-ui/react";
import {
  Search,
  Bell,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  Store,
  Image as ImageIcon,
  X,
} from "lucide-react";

// Mock Data for the Marketplace
const initialProducts = [
  {
    id: 1,
    name: "Organic Carrot Seeds",
    category: "Carrot",
    price: "$10.00",
    stock: 3,
    image: "/images/carrot-seeds.jpg",
  },
  {
    id: 2,
    name: "Tomato Sapling",
    category: "Saplings",
    price: "$1.00",
    stock: 30,
    image: "/images/tomato.jpg",
  },
  {
    id: 3,
    name: "Farming Tools Kit",
    category: "Tools",
    price: "$25.00",
    stock: 400,
    image: "/images/tools.jpg",
  },
];

function MarketplaceManagement() {
  const [products, setProducts] = useState(initialProducts);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box bg="#F8FAFC" minH="100vh" p="8">
      <Container maxW="full">
        {/* --- TOP HEADER (Search & Profile) --- */}
        <Flex justify="flex-end" align="center" gap="6" mb="8">
          <Search size={20} color="#64748B" style={{ cursor: "pointer" }} />
          <Bell size={20} color="#64748B" style={{ cursor: "pointer" }} />
          <HStack gap="3" cursor="pointer">
            <Box boxSize="35px" bg="gray.200" borderRadius="full" />
            <ChevronDown size={16} color="#94A3B8" />
          </HStack>
        </Flex>

        {/* --- PAGE TITLE & ACTION --- */}
        <Flex justify="space-between" align="center" mb="6">
          <Heading size="md" color="gray.800" fontWeight="bold">
            Product Management
          </Heading>
          <Button
            bg="blue.600"
            color="white"
            _hover={{ bg: "blue.700" }}
            borderRadius="md"
            gap={2}
            onClick={() => setIsOpen(true)}
          >
            <Plus size={18} />
            Add New Product
          </Button>
        </Flex>

        {/* --- PRODUCT TABLE --- */}
        <Box
          bg="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.100"
          overflow="hidden"
          boxShadow="sm"
        >
          <Table.Root>
            <Table.Header bg="gray.50">
              <Table.Row>
                <Table.ColumnHeader color="gray.600" py={4}>
                  Image
                </Table.ColumnHeader>
                <Table.ColumnHeader color="gray.600" py={4}>
                  Product Name
                </Table.ColumnHeader>
                <Table.ColumnHeader color="gray.600" py={4}>
                  Category
                </Table.ColumnHeader>
                <Table.ColumnHeader color="gray.600" py={4}>
                  Price
                </Table.ColumnHeader>
                <Table.ColumnHeader color="gray.600" py={4}>
                  Stock
                </Table.ColumnHeader>
                <Table.ColumnHeader color="gray.600" py={4}>
                  Actions
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {products.map((product) => (
                <Table.Row key={product.id} _hover={{ bg: "gray.50/50" }}>
                  <Table.Cell py={4}>
                    <Box
                      boxSize="50px"
                      bg="gray.100"
                      borderRadius="lg"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      overflow="hidden"
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        boxSize="50px"
                        borderRadius="lg"
                        objectFit="cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <ImageIcon size={20} color="gray.400" />
                    </Box>
                  </Table.Cell>
                  <Table.Cell fontWeight="medium" color="gray.800">
                    {product.name}
                  </Table.Cell>
                  <Table.Cell color="gray.600">{product.category}</Table.Cell>
                  <Table.Cell fontWeight="semibold" color="gray.800">
                    {product.price}
                  </Table.Cell>
                  <Table.Cell color="gray.600">{product.stock}</Table.Cell>
                  <Table.Cell>
                    <HStack gap={2}>
                      <Button
                        size="sm"
                        variant="subtle"
                        colorPalette="blue"
                        gap={1}
                      >
                        <Pencil size={14} /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="subtle"
                        colorPalette="red"
                        gap={1}
                      >
                        <Trash2 size={14} /> Delete
                      </Button>
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>

        {/* --- ADD PRODUCT DRAWER --- */}
        <Drawer.Root
          open={isOpen}
          onOpenChange={(e) => setIsOpen(e.open)}
          placement="end"
        >
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content
                bg="white"
                p={0}
                borderRadius="xl"
                m={4}
                w={{ base: "90vw", md: "500px" }}
                maxW="100vw"
              >
                <Drawer.Header
                  borderBottom="1px solid"
                  borderColor="gray.100"
                  py={5}
                >
                  <Flex justify="space-between" align="center">
                    <HStack gap={2}>
                      <Store size={20} color="#2B6CB0" />
                      <Drawer.Title
                        fontSize="xl"
                        fontWeight="bold"
                        color="gray.800"
                      >
                        Add New Product
                      </Drawer.Title>
                    </HStack>
                    <Drawer.CloseTrigger asChild>
                      <Box
                        as="button"
                        p={2}
                        borderRadius="md"
                        _hover={{ bg: "gray.100" }}
                        transition="0.2s"
                      >
                        <X size={20} color="#4A5568" />
                      </Box>
                    </Drawer.CloseTrigger>
                  </Flex>
                </Drawer.Header>

                <Drawer.Body py={6}>
                  <VStack gap={5} align="stretch">
                    <Box>
                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        mb={2}
                        color="gray.700"
                      >
                        Product Name
                      </Text>
                      <Input
                        placeholder="e.g. Organic Carrot Seeds"
                        bg="gray.50"
                        h="45px"
                        border="1px solid"
                        borderColor="gray.200"
                      />
                    </Box>

                    <Box>
                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        mb={2}
                        color="gray.700"
                      >
                        Category
                      </Text>
                      <NativeSelect.Root variant="subtle">
                        <NativeSelect.Field
                          bg="gray.50"
                          h="45px"
                          border="1px solid"
                          borderColor="gray.200"
                        >
                          <option value="seeds">Seeds</option>
                          <option value="saplings">Saplings</option>
                          <option value="tools">Tools</option>
                          <option value="fertilizer">Fertilizer</option>
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                      </NativeSelect.Root>
                    </Box>

                    <HStack gap={4}>
                      <Box flex={1}>
                        <Text
                          fontSize="sm"
                          fontWeight="bold"
                          mb={2}
                          color="gray.700"
                        >
                          Price ($)
                        </Text>
                        <Input
                          type="number"
                          placeholder="0.00"
                          bg="gray.50"
                          h="45px"
                          border="1px solid"
                          borderColor="gray.200"
                        />
                      </Box>
                      <Box flex={1}>
                        <Text
                          fontSize="sm"
                          fontWeight="bold"
                          mb={2}
                          color="gray.700"
                        >
                          Stock Quantity
                        </Text>
                        <Input
                          type="number"
                          placeholder="0"
                          bg="gray.50"
                          h="45px"
                          border="1px solid"
                          borderColor="gray.200"
                        />
                      </Box>
                    </HStack>

                    <Box>
                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        mb={2}
                        color="gray.700"
                      >
                        Product Image URL
                      </Text>
                      <Input
                        placeholder="https://image-url.com/item.jpg"
                        bg="gray.50"
                        h="45px"
                        border="1px solid"
                        borderColor="gray.200"
                      />
                    </Box>
                  </VStack>
                </Drawer.Body>

                <Drawer.Footer
                  borderTop="1px solid"
                  borderColor="gray.100"
                  py={4}
                >
                  <HStack w="full" gap={3}>
                    <Button
                      variant="outline"
                      h="45px"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      bg="blue.600"
                      color="white"
                      h="45px"
                      _hover={{ bg: "blue.700" }}
                      fontWeight="bold"
                    >
                      Save Product
                    </Button>
                  </HStack>
                </Drawer.Footer>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      </Container>
    </Box>
  );
}

export default MarketplaceManagement;
