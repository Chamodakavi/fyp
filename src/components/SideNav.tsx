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
} from "@chakra-ui/react";
import { ChevronRight, Search } from "lucide-react";
import Link from "next/link";
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
} from "react-icons/lu";

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
  { id: 4, name: "Chatting", icon: LuMessageCircle, link: "/chat" },
  { id: 5, name: "Setting", icon: LuSettings, link: "/settings" },
  { id: 6, name: "Cart", icon: LuShoppingCart, link: "/cart" },
];

function SideNav() {
  const { open, onOpen, onClose } = useDisclosure();

  const SidebarContent = () => (
    <Flex direction="column" h="full" w="full" justify="space-between">
      <Box>
        <HStack my={5} px={5} color={"white"}>
          Logo Details here
        </HStack>
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
        <Box mt={10}>
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
        </Box>
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
        <Box flex={1} overflow="hidden">
          <Text fontSize="xs" fontWeight="bold" color="green.900">
            Chamoda Hapuarachchi
          </Text>
          <Text fontSize="2xs" color="green.800">
            chamoda@gmail.com
          </Text>
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
              <Drawer.CloseTrigger />
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </nav>
  );
}

export default SideNav;
