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
  Checkbox,
  Stack,
  Link,
  Image,
  Container,
  AbsoluteCenter,
} from "@chakra-ui/react";
import { User, Lock, Eye } from "lucide-react";

// Custom Google Icon Component since Lucide doesn't include brand logos
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20px" height="20px" {...props}>
    <g fill="none" fillRule="evenodd">
      <path
        d="M20.64 12.2c0-.63-.06-1.25-.16-1.84H12v3.49h4.84a4.13 4.13 0 0 1-1.8 2.71v2.2h2.92c1.7-1.56 2.68-3.88 2.68-6.56z"
        fill="#4285F4"
      />
      <path
        d="M12 21a8.99 8.99 0 0 0 6.22-2.31l-2.92-2.2c-.97.66-2.22 1.05-3.3 1.05-2.58 0-4.83-1.74-5.6-4.13H3.25v2.65A9 9 0 0 0 12 21z"
        fill="#34A853"
      />
      <path
        d="M6.4 13.41A5.63 5.63 0 0 1 6 12c0-.49.09-.96.24-1.41V7.94H3.25a9.01 9.01 0 0 0 0 8.12l3.15-2.65z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.4 0 2.67.48 3.66 1.43l2.74-2.74A8.99 8.99 0 0 0 3.25 7.94l3.15 2.65c.77-2.39 3.02-4.13 5.6-4.13z"
        fill="#EA4335"
      />
    </g>
  </svg>
);

function Login() {
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
        display={{ base: "none", md: "flex" }} // Hidden on small mobile for better UX, or change to 'flex' to show
      >
        <Image
          // Replace this src with your actual uploaded image path or import
          src="https://placehold.co/600x600/e2e8f0/386641?text=Farm+Illustration"
          alt="Farmer Illustration"
          objectFit="contain"
          maxH="80vh"
        />
      </Flex>

      {/* Right Section - Login Form */}
      <Flex
        flex={1}
        align="center"
        justify="center"
        p={{ base: 6, md: 12 }}
        bg="white"
      >
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
                Welcome Back
              </Heading>
              <Text color="gray.500" fontSize="lg">
                login in your account
              </Text>
            </Box>

            {/* Form Fields */}
            <Stack gap={5}>
              {/* Username Input */}
              <InputGroup startElement={<User color="#2F4F2F" size={20} />}>
                <Input
                  type="text"
                  placeholder="user name / email"
                  _placeholder={{ color: "green.800", opacity: 0.6 }}
                  bg="green.200" // Muted sage green background
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

              {/* Options Row */}
              <Flex justify="space-between" align="center" fontSize="sm">
                <Checkbox.Root colorScheme="green" defaultChecked>
                  <Text color="gray.600">Remember me</Text>
                </Checkbox.Root>
                <Link color="gray.500" href="#">
                  forget password?
                </Link>
              </Flex>

              {/* Sign In Button */}
              <Link href="/home" style={{ width: "100%", display: "block" }}>
                <Button
                  width="full"
                  size="lg"
                  bg="green.700"
                  color="white"
                  borderRadius="full"
                  _hover={{ bg: "green.800" }}
                  fontSize="md"
                  boxShadow="lg"
                >
                  Sign in
                </Button>
              </Link>

              {/* Divider */}
              <Box position="relative" py={2}>
                <AbsoluteCenter
                  bg="white"
                  px={4}
                  color="gray.500"
                  fontSize="sm"
                >
                  or
                </AbsoluteCenter>
              </Box>

              {/* Google Button */}
              <Button
                size="lg"
                variant="outline"
                colorScheme="gray"
                borderRadius="full"
                bg="green.50"
                border="1px solid"
                borderColor="green.200"
                color="green.800"
                _hover={{ bg: "green.100" }}
              >
                <GoogleIcon /> Sign in with Google
              </Button>
            </Stack>

            {/* Footer */}
            <Text alignContent="center" fontSize="sm" color="gray.500" mt={4}>
              create account ?{" "}
              <Link color="green.700" fontWeight="bold" href="/signup">
                Sign up
              </Link>
            </Text>
          </Stack>
        </Container>
      </Flex>
    </Flex>
  );
}

export default Login;
