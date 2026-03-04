"use client";

import React from "react";
import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";
import RegisterForm from "./RegisterForm";

function Register() {
  return (
    <Box minH="100vh" bg="#D4F2C4" py={8}>
      <Box maxW="1200px" mx="auto">
        <Flex gap={2} direction={{ base: "column", lg: "row" }}>
          <Box flex={{ base: "1", lg: "2.5" }}>
            <RegisterForm />
          </Box>
          <Box
            flex={{ base: "1", lg: "1" }}
            display={{ base: "block", lg: "block" }}
            minW="300px"
          >
            <RegisterForm />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

export default Register;
