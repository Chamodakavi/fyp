"use client";

import React from "react";
import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  HStack,
  Icon,
  Link,
} from "@chakra-ui/react";
import { Separator } from "@chakra-ui/react";
import { Sprout, Facebook, Twitter, Instagram } from "lucide-react";

export const Footer = () => {
  return (
    <Box bg="#111315" color="white" pt={16} pb={8}>
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={10} mb={12}>
          {/* Column 1: Brand */}
          <Stack gap={6}>
            <HStack gap={2} align="center">
              <Icon as={Sprout} boxSize={6} color="green.400" />
              <Text fontSize="xl" fontWeight="bold" letterSpacing="tight">
                Smart Agri
              </Text>
            </HStack>
            <Text color="gray.400" fontSize="sm" lineHeight="tall" maxW="xs">
              Innovating agriculture for a sustainable future in Sri Lanka.
            </Text>
          </Stack>

          {/* Column 2: Quick Links */}
          <Stack gap={6}>
            <Text fontSize="md" fontWeight="bold">
              Quick Links
            </Text>
            <VStack align="flex-start" gap={3}>
              {["About Us", "Features", "Marketplace"].map((link) => (
                <Link
                  key={link}
                  href="#"
                  color="gray.400"
                  fontSize="sm"
                  _hover={{ color: "green.400", textDecoration: "none" }}
                  transition="color 0.2s"
                >
                  {link}
                </Link>
              ))}
            </VStack>
          </Stack>

          {/* Column 3: Support */}
          <Stack gap={6}>
            <Text fontSize="md" fontWeight="bold">
              Support
            </Text>
            <VStack align="flex-start" gap={3}>
              {["Help Center", "Contact Us", "Privacy Policy"].map((link) => (
                <Link
                  key={link}
                  href="#"
                  color="gray.400"
                  fontSize="sm"
                  _hover={{ color: "green.400", textDecoration: "none" }}
                  transition="color 0.2s"
                >
                  {link}
                </Link>
              ))}
            </VStack>
          </Stack>

          {/* Column 4: Connect With Us */}
          <Stack gap={6}>
            <Text fontSize="md" fontWeight="bold">
              Connect With Us
            </Text>
            <HStack gap={4}>
              <Link href="#" color="gray.400" _hover={{ color: "green.400" }}>
                <Icon as={Facebook} boxSize={5} />
              </Link>
              <Link href="#" color="gray.400" _hover={{ color: "green.400" }}>
                <Icon as={Twitter} boxSize={5} />
              </Link>
              <Link href="#" color="gray.400" _hover={{ color: "green.400" }}>
                <Icon as={Instagram} boxSize={5} />
              </Link>
            </HStack>
            <Link
              href="mailto:contact@smartagri.lk"
              color="gray.400"
              fontSize="sm"
              _hover={{ color: "green.400", textDecoration: "none" }}
            >
              contact@smartagri.lk
            </Link>
          </Stack>
        </SimpleGrid>

        <Separator borderColor="whiteAlpha.200" mb={8} />

        <Text textAlign="center" color="gray.400" fontSize="sm">
          © {new Date().getFullYear()} Smart Agri Sri Lanka. All rights
          reserved.
        </Text>
      </Container>
    </Box>
  );
};
