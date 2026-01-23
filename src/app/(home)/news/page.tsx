"use client";

import React from "react";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { ArrowRight, Calendar, User } from "lucide-react";
import NewsCard from "@/components/news/NewsCard";

// --- DUMMY DATA ---
const NEWS_DATA = [
  {
    id: 1,
    title: "New Sustainable Farming Initiative Launched",
    description:
      "The Ministry of Agriculture has announced a new subsidy plan for farmers adopting organic practices. This initiative aims to reduce chemical usage by 40% over the next five years while ensuring soil health.",
    date: "10th Oct, 2023",
    author: "Ministry of Agri",
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=300&h=200",
    category: "Policy",
  },
  {
    id: 2,
    title: "Top 5 Tools Every Modern Farmer Needs",
    description:
      "From automated irrigation systems to drone monitoring, technology is changing the landscape of farming. We explore the most essential tools that can increase your yield this season.",
    date: "8th Oct, 2023",
    author: "Tech Farm Weekly",
    image:
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=300&h=200",
    category: "Technology",
  },
  {
    id: 3,
    title: "Weather Alert: Heavy Rains Expected",
    description:
      "Meteorologists predict heavy rainfall across the western province starting next week. Farmers are advised to clear drainage systems and protect sensitive seedlings immediately.",
    date: "5th Oct, 2023",
    author: "Weather Center",
    image:
      "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=300&h=200",
    category: "Alert",
  },
];

// --- MAIN PAGE ---
function NewsPage() {
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
          {NEWS_DATA.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </VStack>
      </Box>
    </Box>
  );
}

export default NewsPage;
