"use client";

import React, { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import RegisterForm from "./RegisterForm";
import RegisteredCrops from "./RegisteredCrops";

function Register() {
  // Bumped after a successful registration so the list reloads
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <Box minH="100vh" bg="#D4F2C4" py={8} px={4}>
      <Box maxW="1200px" mx="auto">
        <Flex
          gap={4}
          direction={{ base: "column", lg: "row" }}
          align="flex-start"
        >
          <Box flex={{ base: "1", lg: "2.2" }} w="full">
            <RegisterForm onRegistered={() => setRefreshKey((k) => k + 1)} />
          </Box>
          <Box flex={{ base: "1", lg: "1.3" }} w="full" minW={{ lg: "360px" }}>
            <RegisteredCrops refreshKey={refreshKey} />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

export default Register;
