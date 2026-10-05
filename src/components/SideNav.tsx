"use client";

import {
  Box,
  Drawer,
  HStack,
  Portal,
  Text,
  VStack,
  Flex,
  Image,
} from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  LuLayoutGrid,
  LuStore,
  LuNewspaper,
  LuMessageCircle,
  LuSettings,
  LuBell,
  LuShoppingCart,
  LuX,
  LuCircleHelp,
  LuClipboardPen,
  LuChartLine,
} from "react-icons/lu";

const THEME = {
  bg: "#0D2818",
  activeBg: "#1A3C25",
  textInactive: "whiteAlpha.700",
  textActive: "white",
};

const pages = [
  { id: 1, name: "Dashboard", icon: LuLayoutGrid, link: "/home" },
  { id: 2, name: "Marketplace", icon: LuStore, link: "/marketplace" },
  { id: 3, name: "News", icon: LuNewspaper, link: "/news" },
  { id: 4, name: "Community", icon: LuMessageCircle, link: "/community" },
  { id: 5, name: "Cart", icon: LuShoppingCart, link: "/cart" },
  { id: 6, name: "Registration", icon: LuBell, link: "/registration" },
  { id: 7, name: "Crop Prices", icon: LuChartLine, link: "/prices" },
  {
    id: 8,
    name: "Quota Support",
    icon: LuClipboardPen,
    link: "/quota-support",
  },
  { id: 9, name: "Contact", icon: LuCircleHelp, link: "/contact" },
  { id: 10, name: "Settings", icon: LuSettings, link: "/settings" },
];

export default function SideNav({
  open,
  onClose,
  isMobile,
}: {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
}) {
  const pathname = usePathname();

  const SidebarContent = () => (
    <Flex direction="column" h="full" w="full">
      <Box>
        <Link href={"/home"} style={{ textDecoration: "none" }}>
          <HStack my={4} mb={10} color="white" cursor="pointer" px={2}>
            <Image
              w={10}
              objectFit="contain"
              src="/images/logo.png"
              alt="Logo"
            />
            <Text
              fontWeight="bold"
              fontSize={{ base: "2xl", md: "xl", lg: "2xl" }}
              letterSpacing="wide"
            >
              Farmer
            </Text>
          </HStack>
        </Link>

        {/* Menu Items */}
        <VStack gap={3} align="start" w="full">
          {pages.map((page) => {
            const isActive = pathname === page.link;
            return (
              <Link
                href={page.link}
                key={page.id}
                style={{ width: "100%", textDecoration: "none" }}
                onClick={isMobile ? onClose : undefined}
              >
                <HStack
                  w="full"
                  cursor="pointer"
                  px={4}
                  py={3}
                  borderRadius="xl"
                  color={isActive ? THEME.textActive : THEME.textInactive}
                  bg={isActive ? THEME.activeBg : "transparent"}
                  _hover={{
                    color: "white",
                    bg: THEME.activeBg,
                  }}
                  transition="all 0.2s ease"
                  gap={4}
                >
                  <page.icon size={22} />
                  <Text fontSize="md" fontWeight={isActive ? "bold" : "medium"}>
                    {page.name}
                  </Text>
                </HStack>
              </Link>
            );
          })}
        </VStack>
      </Box>
    </Flex>
  );

  if (!isMobile) {
    return (
      <Box h="100vh" w="full" bg={THEME.bg} p={5} position="sticky" top={0}>
        <SidebarContent />
      </Box>
    );
  }

  return (
    <Drawer.Root open={open} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content bg={THEME.bg} color="white">
            <Drawer.Body p={6}>
              <SidebarContent />
            </Drawer.Body>
            <Drawer.CloseTrigger
              position="absolute"
              top={4}
              right={4}
              color="white"
            >
              <LuX size={24} />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
