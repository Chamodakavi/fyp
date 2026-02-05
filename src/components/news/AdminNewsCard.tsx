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
  Textarea,
  Drawer,
  Portal,
} from "@chakra-ui/react";
import {
  Search,
  Bell,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  Calendar as CalendarIcon,
  Newspaper,
  X as LuX,
} from "lucide-react";

const initialNews = [
  {
    id: 1,
    title: "New Crop Insurance Policy",
    date: "06/29/2022",
    image: "https://images.unsplash.com/photo-1500382017468-9049fee74a62?w=100",
  },
  {
    id: 2,
    title: "Market Trends 2026",
    date: "06/25/2022",
    image: "https://images.unsplash.com/photo-1444852538915-ac95232916dd?w=100",
  },
];

function AdminNewsManagement() {
  const [newsList, setNewsList] = useState(initialNews);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box bg="#F8FAFC" minH="100vh" p="8">
      <Container maxW="full">
        {/* --- TOP HEADER --- */}
        <Flex justify="flex-end" align="center" gap="6" mb="8">
          <Search size={20} color="#64748B" style={{ cursor: "pointer" }} />
          <Bell size={20} color="#64748B" style={{ cursor: "pointer" }} />
          <HStack gap="3" cursor="pointer">
            <Box boxSize="35px" bg="gray.200" borderRadius="full" />
            <ChevronDown size={16} color="#94A3B8" />
          </HStack>
        </Flex>

        {/* --- PAGE TITLE & TRIGGER --- */}
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="md" color="gray.800" fontWeight="bold">
            News Management
          </Heading>
          <Button
            bg="blue.600"
            color="white"
            _hover={{ bg: "blue.700" }}
            onClick={() => setIsOpen(true)}
            gap={2}
          >
            <Plus size={18} />
            Add News
          </Button>
        </Flex>

        {/* --- NEWS TABLE --- */}
        <Box
          bg="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.100"
          boxShadow="sm"
          overflow="hidden"
        >
          <Box p={6} borderBottom="1px solid" borderColor="gray.50">
            <Heading size="sm" color="gray.800">
              Manage Published News
            </Heading>
          </Box>

          <Table.Root>
            <Table.Header bg="gray.50">
              <Table.Row>
                <Table.ColumnHeader py={4}>Image</Table.ColumnHeader>
                <Table.ColumnHeader py={4}>Title</Table.ColumnHeader>
                <Table.ColumnHeader py={4}>Date</Table.ColumnHeader>
                <Table.ColumnHeader py={4}>Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {newsList.map((item) => (
                <Table.Row key={item.id} _hover={{ bg: "gray.50/50" }}>
                  <Table.Cell py={4}>
                    <Image
                      src={item.image}
                      boxSize="50px"
                      borderRadius="md"
                      objectFit="cover"
                    />
                  </Table.Cell>
                  <Table.Cell fontWeight="medium" color="gray.800">
                    {item.title}
                  </Table.Cell>
                  <Table.Cell color="gray.600" fontSize="sm">
                    {item.date}
                  </Table.Cell>
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

        {/* --- ADD NEWS DRAWER (CENTER OVERLAY MODAL STYLE) --- */}

        <Drawer.Root
          open={isOpen}
          onOpenChange={(e) => setIsOpen(e.open)}
          placement="end" // You can use "end" or "start"
        >
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content
                bg="white"
                p={0}
                borderRadius="xl"
                m={4}
                // --- UPDATED WIDTH HERE ---
                // base: 90% for mobile, md: 500px or 600px for desktop
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
                      <Newspaper size={20} color="#2B6CB0" />
                      <Drawer.Title
                        fontSize="xl"
                        fontWeight="bold"
                        color="gray.800"
                      >
                        Add News
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
                        <LuX size={20} color="#4A5568" />
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
                        Title
                      </Text>
                      <Input
                        placeholder="Enter news title"
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
                        Content
                      </Text>
                      <Textarea
                        placeholder="Enter news content"
                        bg="gray.50"
                        rows={8}
                        resize="none"
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
                        Publish Date
                      </Text>
                      <Flex
                        align="center"
                        bg="gray.50"
                        borderRadius="md"
                        border="1px solid"
                        borderColor="gray.200"
                        px={3}
                      >
                        <Input
                          type="text"
                          placeholder="MM/DD/YYYY"
                          //   variant="unstyled"
                          h="45px"
                        />
                        <CalendarIcon size={18} color="#94A3B8" />
                      </Flex>
                    </Box>
                  </VStack>
                </Drawer.Body>

                <Drawer.Footer
                  borderTop="1px solid"
                  borderColor="gray.100"
                  py={4}
                >
                  <HStack gap={3}>
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
                      Publish News
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

export default AdminNewsManagement;
