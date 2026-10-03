"use client";

import React from "react";
import {
  Box,
  Drawer,
  HStack,
  Portal,
  Text,
  VStack,
  Flex,
  Badge,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LuLayoutGrid,
  LuBrainCircuit,
  LuStore,
  LuNewspaper,
  LuMessageCircle,
  LuSettings,
  LuShieldCheck,
  LuX,
  LuClipboardList,
  LuPackageCheck,
  LuLogOut,
} from "react-icons/lu";

const THEME = {
  bg: "#FFFFFF",
  text: "#4A5568",
  textActive: "#2B6CB0",
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
    name: "Orders",
    icon: LuPackageCheck,
    link: "/admin/orders",
  },
  {
    id: 5,
    name: "News",
    icon: LuNewspaper,
    link: "/admin/news",
  },
  {
    id: 6,
    name: "Community",
    icon: LuMessageCircle,
    link: "/admin/community",
  },
  {
    id: 7,
    name: "Complaints",
    icon: LuClipboardList,
    link: "/admin/complaints",
  },
  {
    id: 8,
    name: "Settings",
    icon: LuSettings,
    link: "/admin/settings",
  },
];

export default function AdminNav({
  open,
  onClose,
  isMobile,
}: {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user");
    onClose();
    router.replace("/");
  };

  const SidebarContent = () => (
    <Flex direction="column" h="full" w="full" minW={0} overflowX="hidden">
      {/* ================================
          LOGO
      ================================= */}
      <Link href="/admin/dashboard" style={{ textDecoration: "none" }}>
        <HStack
          my={5}
          mb={8}
          cursor="pointer"
          gap={3}
          _hover={{ opacity: 0.85 }}
        >
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

      {/* ================================
          NAVIGATION
      ================================= */}
      <VStack gap={4} align="start" w="full" flex={1} overflowY="auto" minH={0}>
        {adminPages.map((page) => {
          const isActive = pathname === page.link;

          return (
            <Link
              href={page.link}
              key={page.id}
              style={{
                width: "100%",
                textDecoration: "none",
              }}
              onClick={isMobile ? onClose : undefined}
            >
              <HStack
                w="full"
                cursor="pointer"
                transition="all 0.2s"
                gap={4}
                p={2}
                borderRadius="md"
                bg={isActive ? "blue.50" : "transparent"}
                color={isActive ? THEME.textActive : THEME.text}
                _hover={{
                  color: "blue.600",
                  bg: "blue.50",
                }}
              >
                <page.icon size={22} />

                <Text fontSize="md" fontWeight={isActive ? "bold" : "medium"}>
                  {page.name}
                </Text>

                {page.name === "Community" && (
                  <Badge colorPalette="red" variant="solid" size="sm" ml="auto">
                    3
                  </Badge>
                )}
              </HStack>
            </Link>
          );
        })}
      </VStack>

      {/* ================================
          MOBILE LOGOUT
      ================================= */}
      {isMobile && (
        <Box pt={4} mt={4} borderTop="1px solid" borderColor="gray.200">
          <Button
            w="full"
            variant="ghost"
            justifyContent="flex-start"
            color="red.500"
            gap={4}
            px={2}
            h="44px"
            onClick={handleLogout}
            _hover={{
              bg: "red.50",
              color: "red.600",
            }}
          >
            <LuLogOut size={22} />

            <Text fontSize="md" fontWeight="medium">
              Logout
            </Text>
          </Button>
        </Box>
      )}
    </Flex>
  );

  {
    /* ================================
      DESKTOP SIDEBAR
  ================================= */
  }

  if (!isMobile) {
    return (
      <Box
        h="100vh"
        w="full"
        bg={THEME.bg}
        p={6}
        position="sticky"
        top={0}
        overflowX="hidden"
        overflowY="hidden"
      >
        <SidebarContent />
      </Box>
    );
  }

  {
    /* ================================
      MOBILE DRAWER
  ================================= */
  }

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(e) => {
        if (!e.open) {
          onClose();
        }
      }}
      placement="start"
    >
      <Portal>
        <Drawer.Backdrop zIndex={2000} bg="blackAlpha.500" />

        <Drawer.Positioner zIndex={2001}>
          <Drawer.Content bg="white" maxW="300px" w="85vw" h="100vh">
            <Drawer.Body p={6} h="full" overflow="hidden">
              <SidebarContent />
            </Drawer.Body>

            {/* Close button */}
            <Drawer.CloseTrigger
              position="absolute"
              top={5}
              right={5}
              zIndex={2002}
              w="36px"
              h="36px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="md"
              _hover={{
                bg: "gray.100",
              }}
              onClick={onClose}
            >
              <LuX size={22} />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
