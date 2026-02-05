"use client";

import {
  Box,
  Drawer,
  HStack,
  Portal,
  Text,
  VStack,
  useDisclosure,
  Avatar,
  Flex,
  Badge,
} from "@chakra-ui/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import {
  LuLayoutGrid,
  LuBrainCircuit,
  LuStore,
  LuNewspaper,
  LuMessageCircle,
  LuSettings,
  LuMenu,
  LuLogOut,
  LuShieldCheck,
  LuX,
} from "react-icons/lu";
import { useUser } from "@/hooks/useUser";
import { Skeleton } from "@chakra-ui/react";

const THEME = {
  bg: "#FFFFFF",
  text: "#4A5568",
  textActive: "#2B6CB0",
  bgActive: "#EBF8FF",
  border: "#E2E8F0",
};

const adminPages = [
  {
    id: 1,
    name: "Dashboard",
    icon: LuLayoutGrid,
    link: "/admin/dashboard",
  },
  {
    id: 2,
    name: "AI Targets",
    icon: LuBrainCircuit,
    link: "/admin/ai-targets",
  },
  {
    id: 3,
    name: "Marketplace",
    icon: LuStore,
    link: "/admin/marketplace",
  },
  {
    id: 4,
    name: "News",
    icon: LuNewspaper,
    link: "/admin/news",
  },
  {
    id: 5,
    name: "Settings",
    icon: LuSettings,
    link: "/admin/settings",
  },
  {
    id: 6,
    name: "Community",
    icon: LuMessageCircle,
    link: "/admin/community",
  },
];

function AdminNav() {
  const { open, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useUser();

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.replace("/");
  };

  const SidebarContent = () => (
    <Flex direction="column" h="full" w="full" justify="space-between">
      <Box>
        {/* 1. Logo Area - Adjusted to match SideNav spacing (my={5}) */}
        <Link href="/admin/dashboard" style={{ textDecoration: "none" }}>
          <HStack my={5} cursor="pointer" gap={3}>
            <Box bg="blue.600" p={2} borderRadius="lg">
              <LuShieldCheck size={24} color="white" />
            </Box>
            <VStack align="start" gap={0}>
              <Text
                fontWeight="bold"
                fontSize="xl"
                color="gray.800"
                lineHeight={1.2}
              >
                Admin Panel
              </Text>
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                SRI LANKA CROPS
              </Text>
            </VStack>
          </HStack>
        </Link>

        {/* 2. Menu Items - Matches SideNav Typography and Hover behavior */}
        <VStack gap={4} align="start" w="full">
          {adminPages.map((page) => {
            const isActive = pathname === page.link;
            return (
              <Link
                href={page.link}
                key={page.id}
                style={{ width: "100%", textDecoration: "none" }}
                onClick={onClose}
              >
                <HStack
                  w="full"
                  cursor="pointer"
                  transition="all 0.2s"
                  gap={4}
                  color={isActive ? THEME.textActive : THEME.text}
                  _hover={{
                    color: "blue.600",
                    transform: "translateX(5px)", // SideNav style interaction
                  }}
                >
                  <page.icon size={22} />
                  <Text fontSize="lg" fontWeight={isActive ? "bold" : "medium"}>
                    {page.name}
                  </Text>
                  {page.name === "Community" && (
                    <Badge
                      colorPalette="red"
                      variant="solid"
                      size="sm"
                      ml="auto"
                    >
                      3
                    </Badge>
                  )}
                </HStack>
              </Link>
            );
          })}
        </VStack>
      </Box>

      {/* 3. User Profile Card - Refactored to "Pill" style with Avatar size md */}
      <HStack
        bg={THEME.bgActive}
        borderRadius="full"
        p={2}
        w="full"
        mt={6}
        gap={3}
      >
        <Avatar.Root size="md">
          <Avatar.Fallback name="Admin User" bg="blue.600" color="white" />
        </Avatar.Root>

        <Box flex={1} overflow="hidden" display="flex" gap={3}>
          <Box flex={1}>
            {loading ? (
              <VStack align="start" gap={1}>
                <Skeleton height="12px" width="80px" />
                <Skeleton height="10px" width="100px" />
              </VStack>
            ) : (
              <>
                <Text fontSize="xs" fontWeight="bold" color="gray.800" truncate>
                  {user?.u_name || "Admin User"}
                </Text>
                <Text fontSize="2xs" color="gray.500" truncate>
                  {user?.u_email || "admin@crops.lk"}
                </Text>
              </>
            )}
          </Box>
          <Box
            mt={1}
            onClick={handleLogout}
            cursor="pointer"
            _hover={{ color: "red.500" }}
          >
            <LuLogOut size={20} />
          </Box>
        </Box>
      </HStack>
    </Flex>
  );

  return (
    <nav>
      {/* --- DESKTOP SIDEBAR (Refactored to sticky/full width) --- */}
      <Box
        display={{ base: "none", lg: "block" }}
        h="100vh"
        w="full"
        bg={THEME.bg}
        p={6}
        position="sticky"
        top={0}
      >
        <SidebarContent />
      </Box>

      {/* --- MOBILE DRAWER (Refactored to match SideNav layout) --- */}
      <Drawer.Root
        open={open}
        onOpenChange={(e) => (e.open ? onOpen() : onClose())}
      >
        <Drawer.Trigger asChild>
          <Box
            position="fixed"
            top={4}
            left={4}
            zIndex={100}
            display={{ base: "block", lg: "none" }}
            bg="white"
            p={2}
            borderRadius="md"
            boxShadow="md"
            onClick={onOpen}
          >
            <LuMenu size={24} color="#4A5568" />
          </Box>
        </Drawer.Trigger>

        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content bg="white">
              <Drawer.Body p={6}>
                <SidebarContent />
              </Drawer.Body>
              <Drawer.CloseTrigger>
                <LuX />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </nav>
  );
}

export default AdminNav;
