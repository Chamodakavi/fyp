"use client";

import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  Button,
  InputGroup,
  Stack,
  Link,
  Image,
  Container,
} from "@chakra-ui/react";
import { User, Lock, Eye, Mail } from "lucide-react";

function SignUp() {
  return (
    <Flex
      minH="100vh"
      direction={{ base: "column", md: "row" }}
      bg="white"
      overflow="hidden"
    >
      {/* Left Section - Illustration */}
      <Flex
        flex={1}
        bg="gray.50"
        align="center"
        justify="center"
        p={8}
        display={{ base: "none", md: "flex" }}
      >
        <Image
          src="https://placehold.co/600x600/e2e8f0/386641?text=Farm+Illustration"
          alt="Farmer Illustration"
          objectFit="contain"
          maxH="80vh"
        />
      </Flex>

      {/* Right Section - Register Form */}
      <Flex
        flex={1}
        align="center"
        justify="center"
        p={{ base: 6, md: 12 }}
        bg="white"
        position="relative"
      >
        {/* Optional: Decorative leaves could go here with absolute positioning */}

        <Container maxW="md">
          <Stack gap={6}>
            {/* Header */}
            <Box>
              <Heading
                as="h1"
                size="xl"
                color="green.800"
                fontWeight="bold"
                mb={2}
              >
                Register
              </Heading>
              <Text color="gray.500" fontSize="lg">
                Create your new account
              </Text>
            </Box>

            {/* Form Fields */}
            <Stack gap={5}>
              {/* Username Input */}
              <InputGroup startElement={<User color="#2F4F2F" size={20} />}>
                <Input
                  type="text"
                  placeholder="user name"
                  _placeholder={{ color: "green.800", opacity: 0.6 }}
                  bg="green.200"
                  border="none"
                  borderRadius="full"
                  color="green.900"
                  _focus={{
                    bg: "green.100",
                    boxShadow: "0 0 0 2px #386641",
                  }}
                />
              </InputGroup>

              {/* Email Input (New) */}
              <InputGroup startElement={<Mail color="#2F4F2F" size={20} />}>
                <Input
                  type="email"
                  placeholder="email"
                  _placeholder={{ color: "green.800", opacity: 0.6 }}
                  bg="green.200"
                  border="none"
                  borderRadius="full"
                  color="green.900"
                  _focus={{
                    bg: "green.100",
                    boxShadow: "0 0 0 2px #386641",
                  }}
                />
              </InputGroup>

              {/* Password Input */}
              <InputGroup
                startElement={<Lock color="#2F4F2F" size={20} />}
                endElement={<Eye size={20} />}
              >
                <Input
                  type="password"
                  placeholder="password"
                  _placeholder={{ color: "green.800", opacity: 0.6 }}
                  bg="green.200"
                  border="none"
                  borderRadius="full"
                  color="green.900"
                  _focus={{
                    bg: "green.100",
                    boxShadow: "0 0 0 2px #386641",
                  }}
                />
              </InputGroup>

              {/* Confirm Password Input (New) */}
              <InputGroup
                startElement={<Lock color="#2F4F2F" size={20} />}
                endElement={<Eye size={20} />}
              >
                <Input
                  type="password"
                  placeholder="confirm password"
                  _placeholder={{ color: "green.800", opacity: 0.6 }}
                  bg="green.200"
                  border="none"
                  borderRadius="full"
                  color="green.900"
                  _focus={{
                    bg: "green.100",
                    boxShadow: "0 0 0 2px #386641",
                  }}
                />
              </InputGroup>

              {/* Register Button */}
              {/* Used "Sign Up" for clarity, though image had a typo "Sign in" */}
              <Button
                size="lg"
                bg="green.700"
                color="white"
                borderRadius="full"
                _hover={{ bg: "green.800" }}
                fontSize="md"
                boxShadow="lg"
                mt={2}
              >
                Sign Up
              </Button>
            </Stack>

            {/* Footer */}
            <Box textAlign="center" fontSize="sm" color="gray.500" mt={4}>
              Already have an account?{" "}
              <Link href="/" style={{ textDecoration: "none" }}>
                <span style={{ color: "green", fontWeight: "bold" }}>
                  Sign in
                </span>
              </Link>
            </Box>
          </Stack>
        </Container>
      </Flex>
    </Flex>
  );
}

export default SignUp;
