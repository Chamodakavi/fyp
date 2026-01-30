"use client";

import React from "react";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { ArrowRight, Calendar, User } from "lucide-react";
import NewsCard from "@/components/news/NewsCard";
import { useNews } from "@/hooks/useNews";

function NewsPage() {
  const { news, loading, error } = useNews();

  console.log(news);

  return (
    <Box w="100%" minH="100vh" bg="#D4F2C4" p={8}>
      <Box>
        <Heading color="#0F2B1D" mb={2}>
          Latest News
        </Heading>
        <Text color="gray.600" mb={8}>
          Updates from the farming world
        </Text>

        <VStack gap={5} w="100%">
          {news.map((item) => (
            <NewsCard key={item.n_id} news={item} />
          ))}
        </VStack>
      </Box>
    </Box>
  );
}

export default NewsPage;
