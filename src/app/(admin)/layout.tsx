"use client";

import { Inter } from "next/font/google";

import React, { useContext } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { Provider } from "@/components/ui/provider";
import SideNav from "@/components/SideNav";
import AdminNav from "@/components/AdminNav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider>
      <LayoutWithSidebar>{children}</LayoutWithSidebar>
    </Provider>
  );
}

function LayoutWithSidebar({ children }: { children: React.ReactNode }) {
  return (
    <Flex h="100vh" w="full" bg="#F4F5F7" p={0} m={0}>
      {/*  SIDEBAR */}
      <Box w={{ lg: "20%", mdDown: "0%" }} h="full" bg="white">
        <AdminNav />
      </Box>

      {/* MAIN CONTENT  */}
      <Box flex="1" h="full" overflowY="hidden">
        <Flex direction="column" h="full">
          {/* --- HEADER  --- */}
          <Box flexShrink={0}>{/* <Header /> */}</Box>

          {/* --- BODY  --- */}
          <Box flex="1" overflowY="auto">
            {children}
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
