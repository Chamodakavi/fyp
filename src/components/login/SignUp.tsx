"use client";

import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  Button,
  InputGroup,
  Stack,
  Link as ChakraLink,
  Image,
  Container,
} from "@chakra-ui/react";
import { Alert } from "@chakra-ui/react";
import { User, Lock, Eye, EyeOff, Mail } from "lucide-react";
import { createClient } from "@/utils/supabase/createClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

function SignUp() {
  const router = useRouter();
  const supabase = createClient();

  // --- STATES ---
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // --- LOGIC ---
  const handleSignUp = async () => {
    setLoading(true);
    setErrorMsg("");

    const cleanEmail = email.trim().toLowerCase().replace(/\s+/g, "");
    const cleanUsername = username.trim();

    if (!cleanEmail || !password || !cleanUsername) {
      setErrorMsg("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            username: cleanUsername,
            full_name: cleanUsername,
          },
        },
      });

      if (error) throw error;

      setSuccessMsg("Account created successfully!");
      router.push("/");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

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

            {errorMsg && (
              <Alert.Root status="error" borderRadius="md">
                <Alert.Indicator />
                <Alert.Title>{errorMsg}</Alert.Title>
              </Alert.Root>
            )}
            {successMsg && (
              <Alert.Root status="error" borderRadius="md">
                <Alert.Indicator />
                <Alert.Title>{successMsg}</Alert.Title>
              </Alert.Root>
            )}

            {/* Form Fields */}
            <Stack gap={5}>
              {/* Username Input */}
              <InputGroup startElement={<User color="#2F4F2F" size={20} />}>
                <Input
                  type="text"
                  placeholder="user name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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

              {/* Email Input */}
              <InputGroup startElement={<Mail color="#2F4F2F" size={20} />}>
                <Input
                  type="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                endElement={
                  <Box
                    cursor="pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Box>
                }
              >
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

              {/* Confirm Password Input */}
              <InputGroup startElement={<Lock color="#2F4F2F" size={20} />}>
                <Input
                  type="password"
                  placeholder="confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              <Button
                size="lg"
                bg="green.700"
                color="white"
                borderRadius="full"
                _hover={{ bg: "green.800" }}
                fontSize="md"
                boxShadow="lg"
                mt={2}
                onClick={handleSignUp}
                loading={loading}
                loadingText="Creating Account..."
              >
                Sign Up
              </Button>
            </Stack>

            {/* Footer */}
            <Box textAlign="center" fontSize="sm" color="gray.500" mt={4}>
              Already have an account?{" "}
              <Link href="/" passHref>
                <ChakraLink as="span" color="green.700" fontWeight="bold">
                  Sign in
                </ChakraLink>
              </Link>
            </Box>
          </Stack>
        </Container>
      </Flex>
    </Flex>
  );
}

export default SignUp;
