"use client";

import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Flex,
  Container,
  Spinner,
} from "@chakra-ui/react";
import { Newspaper } from "lucide-react";
import NewsCard from "@/components/news/NewsCard";
import { useNews } from "@/hooks/useNews";

function NewsPage() {
  const { news, loading, error } = useNews();

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
              <Newspaper size={28} />
              <Heading size={{ base: "2xl", md: "3xl" }}>Latest News</Heading>
            </HStack>
            <Text color="gray.600">
              Stay updated with the latest trends and updates from the farming
              world.
            </Text>
          </Box>
        </Flex>

        {/* --- NEWS LIST --- */}
        {loading ? (
          <Flex justify="center" p={20}>
            <Spinner color="#0F2B1D" size="xl" />
          </Flex>
        ) : error ? (
          <Flex
            justify="center"
            p={10}
            bg="white"
            borderRadius="xl"
            shadow="sm"
          >
            <Text color="red.500">Failed to load news articles.</Text>
          </Flex>
        ) : news.length === 0 ? (
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
            <Newspaper
              size={48}
              color="gray"
              style={{ opacity: 0.5, marginBottom: "16px" }}
            />
            <Heading size="md" color="gray.600">
              No News Available
            </Heading>
            <Text color="gray.500" mt={2}>
              Check back later for more updates from the farming community.
            </Text>
          </Flex>
        ) : (
          <VStack gap={5} w="100%" align="stretch">
            {news.map((item) => (
              <NewsCard key={item.n_id} news={item} />
            ))}
          </VStack>
        )}
      </Container>
    </Box>
  );
}

export default NewsPage;
