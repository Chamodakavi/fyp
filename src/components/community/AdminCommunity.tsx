"use client";

import React from "react";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
  Button,
  Input,
  NativeSelect,
  Avatar,
  Container,
} from "@chakra-ui/react";
import { Search, Bell, ChevronDown, Trash2 } from "lucide-react";

// Mock Data for Moderation
const communityPosts = [
  {
    id: 1,
    user: "User Name",
    date: "06/29/2022",
    content:
      "Lorem ipsum dolor sit amet, consetetur adipscing elit, sed do eiusmod tempor incididunt",
  },
  {
    id: 2,
    user: "Atina Smith",
    date: "06/29/2022",
    content:
      "Lorem ipsum dolor sit amet, consetetur adipscing elit, sed do eiusmod tempor",
  },
  {
    id: 3,
    user: "User Name",
    date: "06/29/2022",
    content:
      "Lorem ipsum dolor sit amet, consetetur adipscing elit, sed do eiusmod tempor",
  },
  {
    id: 4,
    user: "Jamn Warney",
    date: "06/29/2022",
    content: "Lorem ipsum dolor sit amet, consetetur adipscing elit",
  },
];
function AdminCommunity() {
  return (
    <Box bg="#F8FAFC" minH="100vh" p="8">
      <Container maxW="full">
        {/* --- HEADER (Consistent with other Admin pages) --- */}
        {/* <Flex justify="flex-end" align="center" gap="6" mb="8">
          <Search size={20} color="#64748B" style={{ cursor: "pointer" }} />
          <Bell size={20} color="#64748B" style={{ cursor: "pointer" }} />
          <HStack gap="3" cursor="pointer">
            <Box boxSize="35px" bg="gray.200" borderRadius="full" />
            <ChevronDown size={16} color="#94A3B8" />
          </HStack>
        </Flex> */}

        {/* --- PAGE TITLE --- */}
        {/* <Heading size="md" color="gray.800" fontWeight="bold" mb="6">
          Community Moderation
        </Heading> */}

        {/* --- FILTERS SECTION --- */}
        <Flex gap={4} mb={8} wrap="wrap" align="center">
          <NativeSelect.Root width="200px" variant="subtle">
            <NativeSelect.Field bg="white" h="45px">
              <option value="all">All Posts</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>

          <NativeSelect.Root width="200px" variant="subtle">
            <NativeSelect.Field bg="white" h="45px">
              <option value="reported">Reported Posts</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>

          <Box flex="1" position="relative">
            <Input
              placeholder="Search"
              bg="white"
              h="45px"
              pl="10"
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
            />
            <Box position="absolute" left="3" top="13px">
              <Search size={18} color="#94A3B8" />
            </Box>
          </Box>
        </Flex>

        {/* --- POST CARDS LIST --- */}
        <VStack gap={4} w="full">
          {communityPosts.map((post) => (
            <Box
              key={post.id}
              w="full"
              bg="white"
              p={6}
              borderRadius="xl"
              border="1px solid"
              borderColor="gray.100"
              boxShadow="sm"
            >
              <Flex justify="space-between" align="start">
                <HStack gap={4} align="start">
                  <Avatar.Root size="md">
                    <Avatar.Fallback name={post.user} />
                  </Avatar.Root>
                  <VStack align="start" gap={0}>
                    <Text fontWeight="bold" color="gray.800">
                      {post.user}
                    </Text>
                    <Text fontSize="md" color="gray.700" mt={1}>
                      {post.content}
                    </Text>
                    <Text
                      fontSize="xs"
                      color="gray.400"
                      mt={2}
                      fontWeight="medium"
                    >
                      Posted {post.date}
                    </Text>
                  </VStack>
                </HStack>

                <Button
                  colorPalette="red"
                  variant="solid"
                  size="sm"
                  h="40px"
                  px={6}
                  borderRadius="md"
                  _hover={{ bg: "red.600" }}
                >
                  Delete
                </Button>
              </Flex>
            </Box>
          ))}
        </VStack>
      </Container>
    </Box>
  );
}

export default AdminCommunity;
