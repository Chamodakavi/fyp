"use client";

import { Inter } from "next/font/google";

import React, { useContext } from "react";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { Provider } from "@/components/ui/provider";
import SideNav from "@/components/SideNav";
import AdminNav from "@/components/AdminNav";
import AdminHeader from "@/components/ui/AdminHeader";

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
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <Flex h="100vh" w="full" bg="#F4F5F7" p={0} m={0}>
      {/* SIDEBAR (Desktop) */}
      <Box
        display={{ base: "none", lg: "block" }}
        w="260px"
        h="full"
        bg="white"
        borderRight="1px solid"
        borderColor="gray.200"
      >
        <AdminNav open={open} onClose={onClose} isMobile={false} />
      </Box>

      {/* MOBILE DRAWER (Controlled by AdminNav internally) */}
      <Box display={{ base: "block", lg: "none" }}>
        <AdminNav open={open} onClose={onClose} isMobile={true} />
      </Box>

      {/* MAIN CONTENT */}
      <Box flex="1" h="full" overflowY="hidden">
        <Flex direction="column" h="full">
          {/* --- HEADER --- */}
          <Box flexShrink={0}>
            <AdminHeader onMenuClick={onOpen} />
          </Box>

          {/* --- BODY --- */}
          <Box flex="1" overflowY="auto">
            {children}
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
