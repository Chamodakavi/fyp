"use client";

import {
  Box,
  Drawer,
  HStack,
  Input,
  Portal,
  Text,
  VStack,
  useDisclosure,
  Avatar,
  Flex,
  Image,
} from "@chakra-ui/react";
import { ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import {
  LuLayoutGrid, // Dashboard
  LuStore, // Marketplace
  LuNewspaper, // News
  LuMessageCircle, // Chatting
  LuSettings, // Setting
  LuBell, // Notification
  LuMenu,
  LuShoppingCart,
  LuX,
  LuLogOut,
} from "react-icons/lu";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/utils/supabase/createClient";
import { Skeleton } from "@chakra-ui/react";

// Theme Colors derived from the image
const THEME = {
  bg: "#0D2818", // Deep Forest Green
  accent: "#D6E8D5", // Pale Sage/Tea Green
  text: "#D6E8D5",
  hover: "#1A3C25",
};

const pages = [
  { id: 1, name: "Dashboard", icon: LuLayoutGrid, link: "/home" },
  { id: 2, name: "Marketplace", icon: LuStore, link: "/marketplace" },
  { id: 3, name: "News", icon: LuNewspaper, link: "/news" },
  { id: 4, name: "Community", icon: LuMessageCircle, link: "/community" },
  { id: 5, name: "Cart", icon: LuShoppingCart, link: "/cart" },
  { id: 6, name: "Settings", icon: LuSettings, link: "/settings" },
];

function SideNav() {
  const { open, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const supabase = createClient();
  const { user, loading } = useUser();

  const handleLogout = () => {
    // Optional: Clear any stored user data/tokens here
    localStorage.removeItem("user");
    router.replace("/");
  };

  const SidebarContent = () => (
    <Flex direction="column" h="full" w="full" justify="space-between">
      <Box>
        <Link href={"/home"} style={{ textDecoration: "none" }}>
          <HStack my={5} color={"white"} cursor={"pointer"}>
            <Image w={20} objectFit={"contain"} src={"/images/logo.png"} />
            <Text fontWeight={"bold"} fontSize={"3xl"}>
              Farmer
            </Text>
          </HStack>
        </Link>
        {/* Search Bar */}
        <HStack
          w="full"
          bg={THEME.accent}
          borderRadius="full"
          px={4}
          py={2}
          mb={8}
        >
          <Input
            placeholder="Search anything here"
            //variant="unstyled"
            color="green.900"
            _placeholder={{ color: "green.700" }}
            fontSize="sm"
            focusRing={"none"}
            border={"none"}
          />
          <Search size={18} color="#1A3C1A" />
        </HStack>

        {/* Menu Items */}
        <VStack gap={4} align="start" w="full">
          {pages.map((page) => (
            <Link
              href={page.link}
              key={page.id}
              style={{ width: "100%", textDecoration: "none" }}
              onClick={onClose}
            >
              <HStack
                w="full"
                cursor="pointer"
                color={THEME.text}
                _hover={{ color: "white", transform: "translateX(5px)" }}
                transition="all 0.2s"
                gap={4}
              >
                <page.icon size={22} />
                <Text fontSize="lg" fontWeight="medium">
                  {page.name}
                </Text>
              </HStack>
            </Link>
          ))}
        </VStack>

        {/* Notifications Section */}
        {/* <Box mt={10}>
          <HStack
            color={THEME.text}
            cursor="pointer"
            _hover={{ color: "white" }}
            gap={4}
          >
            <Text fontSize="md" fontWeight="medium">
              notifications
            </Text>
            <LuBell size={20} />
          </HStack>
        </Box> */}
      </Box>

      {/* User Profile Card (Bottom) */}
      <HStack
        bg={THEME.accent}
        borderRadius="full"
        p={2}
        w="full"
        mt={6}
        gap={3}
      >
        <Avatar.Root size="md">
          <Avatar.Fallback
            name="Chamodia Hapuarachchi"
            bg="green.700"
            color="white"
          />
          <Avatar.Image
            w={"full"}
            h={"full"}
            objectFit={"contain"}
            src="https://bit.ly/dan-abramov"
          />
        </Avatar.Root>
        <Box flex={1} overflow="hidden" display={"flex"} gap={3}>
          <Box flex={1}>
            {/* 4. Dynamic Data with Loading State */}
            {loading ? (
              <VStack align="start" gap={1}>
                <Skeleton height="12px" width="80px" />
                <Skeleton height="10px" width="100px" />
              </VStack>
            ) : (
              <>
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color="green.900"
                  truncate
                >
                  {user?.u_name || "Guest User"}
                </Text>
                <Text fontSize="2xs" color="green.800" truncate>
                  {user?.u_email || "No Email"}
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
      {/* --- DESKTOP VIEW --- */}
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

      {/* --- MOBILE VIEW (Drawer) --- */}
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
            <LuMenu size={24} color="black" />
          </Box>
        </Drawer.Trigger>

        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content bg={THEME.bg} color="white">
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

export default SideNav;
