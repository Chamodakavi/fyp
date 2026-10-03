"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  HStack,
  Input,
  Text,
  Avatar,
  IconButton,
  Menu,
  VStack,
} from "@chakra-ui/react";
import {
  LuMenu,
  LuSearch,
  LuBell,
  LuLogOut,
  LuShieldCheck,
  LuSettings,
  LuLayoutGrid,
  LuBrainCircuit,
  LuStore,
  LuNewspaper,
  LuMessageCircle,
  LuClipboardList,
  LuPackageCheck,
} from "react-icons/lu";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

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

export default function AdminHeader({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const router = useRouter();
  const { user } = useUser();

  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.replace("/");
  };

  /* ============================================
     FILTER SIDEBAR PAGES
  ============================================ */

  const filteredPages = adminPages.filter((page) =>
    page.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  /* ============================================
     CLOSE SEARCH WHEN CLICKING OUTSIDE
  ============================================ */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ============================================
     NAVIGATE TO SEARCH RESULT
  ============================================ */

  const handleSearchNavigation = (link: string) => {
    setSearch("");
    setShowResults(false);
    router.push(link);
  };

  /* ============================================
     ENTER KEY
  ============================================ */

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter" && filteredPages.length > 0) {
      handleSearchNavigation(filteredPages[0].link);
    }

    if (event.key === "Escape") {
      setShowResults(false);
    }
  };

  return (
    <Flex
      h="70px"
      minH="70px"
      w="100%"
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      align="center"
      justify="space-between"
      px={{ base: 4, md: 8 }}
      position="relative"
      zIndex={1000}
    >
      {/* ==========================================
          DESKTOP SEARCH
      =========================================== */}

      <Box
        ref={searchRef}
        display={{ base: "none", lg: "block" }}
        w="350px"
        flexShrink={0}
        position="relative"
      >
        {/* Search input */}
        <Flex
          align="center"
          bg="gray.50"
          px={4}
          py={2}
          h="40px"
          borderRadius="full"
          border="1px solid"
          borderColor="gray.200"
        >
          <LuSearch color="#718096" size={18} />

          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => {
              if (search.trim()) {
                setShowResults(true);
              }
            }}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search orders, users, or news..."
            ml={3}
            size="sm"
            border="none"
            bg="transparent"
            boxShadow="none"
            outline="none"
            _hover={{
              border: "none",
              boxShadow: "none",
            }}
            _focus={{
              border: "none",
              boxShadow: "none",
              outline: "none",
            }}
            _focusVisible={{
              border: "none",
              boxShadow: "none",
              outline: "none",
            }}
          />
        </Flex>

        {/* ==========================================
            SEARCH RESULTS
        =========================================== */}

        {showResults && search.trim() && (
          <Box
            position="absolute"
            top="48px"
            left={0}
            right={0}
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            boxShadow="0 10px 30px rgba(0, 0, 0, 0.12)"
            overflow="hidden"
            zIndex={9999}
          >
            {filteredPages.length > 0 ? (
              <VStack gap={0} align="stretch" py={1}>
                {filteredPages.map((page) => {
                  const Icon = page.icon;

                  return (
                    <HStack
                      key={page.id}
                      px={4}
                      py={3}
                      gap={3}
                      cursor="pointer"
                      onClick={() => handleSearchNavigation(page.link)}
                      _hover={{
                        bg: "gray.50",
                      }}
                    >
                      <Box color="gray.500">
                        <Icon size={18} />
                      </Box>

                      <Box>
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          color="gray.800"
                        >
                          {page.name}
                        </Text>

                        <Text fontSize="xs" color="gray.500">
                          {page.link}
                        </Text>
                      </Box>
                    </HStack>
                  );
                })}
              </VStack>
            ) : (
              <Box px={4} py={4}>
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  No pages found
                </Text>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* ==========================================
          MOBILE LOGO
      =========================================== */}

      <HStack gap={2} display={{ base: "flex", lg: "none" }} flexShrink={0}>
        <Box bg="blue.600" p={1.5} borderRadius="md">
          <LuShieldCheck size={20} color="white" />
        </Box>

        <Text fontWeight="bold" fontSize="lg" color="gray.800">
          Admin
        </Text>
      </HStack>

      {/* ==========================================
          RIGHT SIDE
      =========================================== */}

      <HStack gap={{ base: 2, md: 4 }} ml="auto">
        {/* Notification */}
        <IconButton
          variant="ghost"
          aria-label="Notifications"
          color="gray.500"
          display={{ base: "none", md: "flex" }}
          _hover={{
            bg: "gray.100",
            color: "gray.700",
          }}
        >
          <LuBell size={20} />
        </IconButton>

        {/* Divider */}
        <Box
          w="1px"
          h="24px"
          bg="gray.200"
          display={{ base: "none", md: "block" }}
        />

        {/* ========================================
            PROFILE MENU
        ========================================= */}

        <Menu.Root positioning={{ placement: "bottom-end" }}>
          <Menu.Trigger asChild>
            <Box
              display={{ base: "none", md: "flex" }}
              cursor="pointer"
              position="relative"
              zIndex={1002}
              _hover={{ opacity: 0.8 }}
              transition="opacity 0.2s"
            >
              <HStack gap={3}>
                <Box display={{ base: "none", md: "block" }} textAlign="right">
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color="gray.800"
                    lineHeight="1.2"
                  >
                    {user?.u_name || "Admin User"}
                  </Text>

                  <Text fontSize="xs" color="gray.500" lineHeight="1.2" mt={1}>
                    {user?.u_email || "admin@crops.lk"}
                  </Text>
                </Box>

                <Avatar.Root size="sm">
                  <Avatar.Fallback
                    name={user?.u_name || "Admin"}
                    bg="blue.600"
                    color="white"
                  />
                </Avatar.Root>
              </HStack>
            </Box>
          </Menu.Trigger>

          <Menu.Positioner zIndex={9999}>
            <Menu.Content
              minW="210px"
              mt={2}
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              boxShadow="0 10px 30px rgba(0, 0, 0, 0.12)"
              py={2}
              zIndex={9999}
            >
              <Menu.Item
                value="settings"
                onClick={() => router.push("/admin/settings")}
              >
                <HStack gap={3}>
                  <LuSettings size={16} />
                  <Text>Settings</Text>
                </HStack>
              </Menu.Item>

              <Menu.Separator />

              <Menu.Item
                value="logout"
                color="red.500"
                onClick={handleLogout}
                _hover={{
                  bg: "red.50",
                }}
              >
                <HStack gap={3}>
                  <LuLogOut size={16} />
                  <Text>Logout</Text>
                </HStack>
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>

        {/* ========================================
            MOBILE HAMBURGER
        ========================================= */}

        <IconButton
          variant="ghost"
          onClick={onMenuClick}
          aria-label="Open Menu"
          display={{ base: "flex", lg: "none" }}
          flexShrink={0}
          color="gray.600"
          _hover={{
            bg: "gray.100",
            color: "gray.800",
          }}
        >
          <LuMenu size={24} />
        </IconButton>
      </HStack>
    </Flex>
  );
}
