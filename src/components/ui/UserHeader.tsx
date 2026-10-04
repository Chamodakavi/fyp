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
  Image,
} from "@chakra-ui/react";
import {
  LuMenu,
  LuSearch,
  LuBell,
  LuLogOut,
  LuSettings,
  LuLayoutGrid,
  LuStore,
  LuNewspaper,
  LuMessageCircle,
  LuShoppingCart,
  LuCircleHelp,
} from "react-icons/lu";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/utils/supabase/createClient";

const userPages = [
  { id: 1, name: "Dashboard", icon: LuLayoutGrid, link: "/home" },
  { id: 2, name: "Marketplace", icon: LuStore, link: "/marketplace" },
  { id: 3, name: "News", icon: LuNewspaper, link: "/news" },
  { id: 4, name: "Community", icon: LuMessageCircle, link: "/community" },
  { id: 5, name: "Cart", icon: LuShoppingCart, link: "/cart" },
  { id: 6, name: "Registration", icon: LuBell, link: "/registration" },
  { id: 7, name: "Contact", icon: LuCircleHelp, link: "/contact" },
  { id: 8, name: "Settings", icon: LuSettings, link: "/settings" },
];

export default function UserHeader({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const router = useRouter();
  const { user } = useUser();

  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const filteredPages = userPages.filter((page) =>
    page.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

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

  const handleSearchNavigation = (link: string) => {
    setSearch("");
    setShowResults(false);
    router.push(link);
  };

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
      bg="#0D2818"
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
        w={{ base: "300px", xl: "450px" }}
        flexShrink={0}
        position="relative"
      >
        <Flex
          align="center"
          bg="white"
          px={4}
          py={2}
          h="40px"
          borderRadius="full"
        >
          <LuSearch color="#718096" size={18} />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => {
              if (search.trim()) setShowResults(true);
            }}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search products, news, or community..."
            ml={3}
            size="sm"
            color="gray.800"
            border="none"
            bg="transparent"
            boxShadow="none"
            outline="none"
            _placeholder={{ color: "gray.400" }}
            _hover={{ border: "none", boxShadow: "none" }}
            _focus={{ border: "none", boxShadow: "none", outline: "none" }}
            _focusVisible={{
              border: "none",
              boxShadow: "none",
              outline: "none",
            }}
          />
        </Flex>

        {/* SEARCH RESULTS DROPDOWN */}
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
                      _hover={{ bg: "gray.50" }}
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
          MOBILE LOGO & MENU
      =========================================== */}
      <HStack gap={3} display={{ base: "flex", lg: "none" }} flexShrink={0}>
        <IconButton
          variant="ghost"
          onClick={onMenuClick}
          aria-label="Open Menu"
          color="white"
          _hover={{ bg: "whiteAlpha.200" }}
        >
          <LuMenu size={24} />
        </IconButton>
        <HStack cursor="pointer" onClick={() => router.push("/home")}>
          <Image w={8} objectFit="contain" src="/images/logo.png" alt="Logo" />
          <Text fontWeight="bold" fontSize="lg" color="white">
            Farmer
          </Text>
        </HStack>
      </HStack>

      {/* ==========================================
          RIGHT SIDE ACTIONS
      =========================================== */}
      <HStack gap={{ base: 2, md: 5 }} ml="auto">
        <HStack gap={2} display={{ base: "none", md: "flex" }}>
          <IconButton
            variant="ghost"
            aria-label="Cart"
            color="white"
            onClick={() => router.push("/cart")}
            _hover={{ bg: "whiteAlpha.200" }}
          >
            <LuShoppingCart size={20} />
          </IconButton>

          <IconButton
            variant="ghost"
            aria-label="Notifications"
            color="white"
            _hover={{ bg: "whiteAlpha.200" }}
          >
            <LuBell size={20} />
          </IconButton>
        </HStack>

        <Box
          w="1px"
          h="24px"
          bg="whiteAlpha.300"
          display={{ base: "none", md: "block" }}
        />

        {/* PROFILE MENU */}
        <Menu.Root positioning={{ placement: "bottom-end" }}>
          <Menu.Trigger asChild>
            <Box
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
                    color="white"
                    lineHeight="1.2"
                  >
                    {user?.u_name || "Guest User"}
                  </Text>
                  <Text
                    fontSize="xs"
                    color="whiteAlpha.700"
                    lineHeight="1.2"
                    mt={1}
                  >
                    {user?.u_email || "No Email"}
                  </Text>
                </Box>

                <Avatar.Root size="sm">
                  <Avatar.Fallback
                    name={user?.u_name || "Guest"}
                    bg="green.600"
                    color="white"
                  />
                  {user?.u_avatar && <Avatar.Image src={user.u_avatar} />}
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
              boxShadow="lg"
              py={2}
              zIndex={9999}
            >
              <Menu.Item
                value="cart"
                display={{ base: "flex", md: "none" }}
                onClick={() => router.push("/cart")}
              >
                <HStack gap={3}>
                  <LuShoppingCart size={16} />
                  <Text>Cart</Text>
                </HStack>
              </Menu.Item>

              <Menu.Item
                value="notifications"
                display={{ base: "flex", md: "none" }}
              >
                <HStack gap={3}>
                  <LuBell size={16} />
                  <Text>Notifications</Text>
                </HStack>
              </Menu.Item>

              <Menu.Separator display={{ base: "block", md: "none" }} />

              <Menu.Item
                value="settings"
                onClick={() => router.push("/settings")}
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
                _hover={{ bg: "red.50" }}
              >
                <HStack gap={3}>
                  <LuLogOut size={16} />
                  <Text>Logout</Text>
                </HStack>
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>
      </HStack>
    </Flex>
  );
}
