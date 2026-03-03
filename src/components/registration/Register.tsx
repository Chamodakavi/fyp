"use client";

import React from "react";
import { Box } from "@chakra-ui/react";
import RegisterForm from "./RegisterForm";

function Register() {
  return (
    <Box bg="#d5efb0" minH="100vh" p={8}>
      <RegisterForm />
    </Box>
  );
}

export default Register;
