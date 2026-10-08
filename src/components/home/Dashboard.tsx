"use client";

import React, { useEffect, useState } from "react";

import {
  Box,
  Flex,
  SimpleGrid,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Badge,
  Button,
  Spinner,
} from "@chakra-ui/react";

import { useRouter } from "next/navigation";

import {
  CloudSun,
  ShoppingBasket,
  Newspaper,
  Sprout,
  Bot,
  ArrowRight,
  Package,
} from "lucide-react";

import { useProducts } from "@/hooks/useProducts";
import { useNews } from "@/hooks/useNews";
import { useRegisteredCrops } from "@/hooks/useRegisteredCrop";
import { monthName, monthIndex } from "@/lib/services/quotaService";
import { createClient } from "@/utils/supabase/createClient";
import PriceForecastPanel from "@/components/prices/PriceForecastPanel";

const THEME = {
  pageBg: "#d5efb0",
  darkGreen: "#0D2818",
  green: "#1F6B3A",
  softGreen: "#EAF6DB",
  paleGreen: "#F4FAEE",
  orange: "#F8D9A0",
  lightOrange: "#FFF4DF",
  textDark: "#1F2933",
  textMuted: "#667085",
};

type WeatherData = {
  district: string;
  isFallback: boolean;

  current: {
    temperature_2m: number | null;
    relative_humidity_2m: number | null;
    precipitation: number | null;
    weather_code: number | null;
    wind_speed_10m: number | null;
  };
};

const DashboardCard = ({ children, bg = "white", ...props }: any) => (
  <Box
    bg={bg}
    borderRadius="2xl"
    p={{ base: 5, md: 6 }}
    boxShadow="0 10px 25px rgba(13, 40, 24, 0.08)"
    border="1px solid"
    borderColor="rgba(13, 40, 24, 0.08)"
    {...props}
  >
    {children}
  </Box>
);

const SectionTitle = ({
  title,
  subtitle,
  actionText,
  onAction,
}: {
  title: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
}) => (
  <Flex justify="space-between" align="center" gap={4} mb={4}>
    <Box>
      <Heading size="md" color={THEME.textDark}>
        {title}
      </Heading>

      {subtitle && (
        <Text fontSize="sm" color={THEME.textMuted} mt={1}>
          {subtitle}
        </Text>
      )}
    </Box>

    {actionText && (
      <Button
        size="sm"
        variant="ghost"
        color={THEME.green}
        fontWeight="bold"
        onClick={onAction}
      >
        {actionText}

        <ArrowRight size={16} />
      </Button>
    )}
  </Flex>
);

const QuickActionCard = ({
  title,
  subtitle,
  icon,
  onClick,
  bg,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onClick: () => void;
  bg: string;
}) => (
  <Flex
    bg={bg}
    borderRadius="2xl"
    p={5}
    gap={4}
    align="center"
    cursor="pointer"
    border="1px solid"
    borderColor="rgba(13, 40, 24, 0.08)"
    _hover={{
      transform: "translateY(-3px)",
      boxShadow: "0 14px 30px rgba(13, 40, 24, 0.12)",
    }}
    transition="all 0.2s ease"
    onClick={onClick}
  >
    <Flex
      w="46px"
      h="46px"
      borderRadius="full"
      bg="white"
      align="center"
      justify="center"
      color={THEME.green}
      flexShrink={0}
    >
      {icon}
    </Flex>

    <Box>
      <Text fontWeight="bold" color={THEME.textDark}>
        {title}
      </Text>

      <Text fontSize="sm" color={THEME.textMuted}>
        {subtitle}
      </Text>
    </Box>
  </Flex>
);

function Dashboard() {
  const router = useRouter();

  const supabase = createClient();

  const { products, loading: productsLoading } = useProducts();

  const { news, loading: newsLoading } = useNews();

  const { crops, loadingCrops } = useRegisteredCrops();

  const [weather, setWeather] = useState<WeatherData | null>(null);

  const [weatherLoading, setWeatherLoading] = useState(true);

  /*
   * Load weather based on the logged-in user's district.
   *
   * If u_district is:
   *
   *   Colombo
   *   COLOMBO
   *   colombo
   *   " Colombo "
   *
   * the API normalizes it and finds Colombo.
   *
   * If u_district is missing or unknown,
   * the API automatically falls back to Colombo.
   */
  useEffect(() => {
    let cancelled = false;

    const loadWeather = async () => {
      try {
        setWeatherLoading(true);

        /*
         * Get the current authenticated user.
         */
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        let district: string | null = null;

        /*
         * Get u_district from users table.
         */
        if (user) {
          const { data, error } = await supabase
            .from("users")
            .select("u_district")
            .eq("id", user.id)
            .maybeSingle();

          if (error) {
            throw error;
          }

          district = data?.u_district ?? null;
        }

        /*
         * If district is null/empty, don't send it.
         * The API will use Colombo.
         */
        const url = district?.trim()
          ? `/api/weather?district=${encodeURIComponent(district)}`
          : "/api/weather";

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch weather");
        }

        const data: WeatherData = await response.json();

        if (!cancelled) {
          setWeather(data);
        }
      } catch (error) {
        console.error("Failed to load weather:", error);

        if (!cancelled) {
          setWeather(null);
        }
      } finally {
        if (!cancelled) {
          setWeatherLoading(false);
        }
      }
    };

    loadWeather();

    return () => {
      cancelled = true;
    };
  }, []);

  const latestProducts = products.slice(0, 4);

  const latestNews = news.slice(0, 3);

  const latestCrops = crops.slice(0, 3);

  // Cancelled registrations stay in the history but no longer hold quota.
  // Each registration belongs to one harvest-month target, so the count is
  // "how many harvest months am I registered for" (R5) — never a crop total.
  const activeCrops = crops.filter((crop) => crop.status !== "cancelled");

  const nextHarvest = activeCrops
    .filter((c) => c.target?.year && c.target?.month)
    .sort(
      (a, b) =>
        monthIndex(a.target!.year!, a.target!.month!) -
        monthIndex(b.target!.year!, b.target!.month!),
    )[0]?.target;

  const temperature = weather?.current?.temperature_2m;

  return (
    <Box bg={THEME.pageBg} minH="100vh" p={{ base: 4, md: 8 }}>
      <VStack align="stretch" gap={6}>
        {/* Welcome Section */}

        <Flex
          bg={THEME.darkGreen}
          color="white"
          borderRadius="3xl"
          p={{ base: 6, md: 8 }}
          justify="space-between"
          align={{
            base: "start",
            md: "center",
          }}
          direction={{
            base: "column",
            md: "row",
          }}
          gap={6}
          boxShadow="0 18px 35px rgba(13, 40, 24, 0.25)"
        >
          <Box>
            <Badge
              bg={THEME.orange}
              color={THEME.darkGreen}
              borderRadius="full"
              px={3}
              py={1}
              mb={4}
            >
              Smart Farming Dashboard
            </Badge>

            <Heading
              size={{
                base: "xl",
                md: "2xl",
              }}
              lineHeight="1.1"
            >
              Welcome back to FarmFriend
            </Heading>

            <Text color="green.100" mt={3} maxW="650px">
              Track your crop registrations, explore marketplace products, read
              farming updates, and get help from the AI assistant.
            </Text>
          </Box>

          <HStack gap={3}>
            <Button
              bg={THEME.orange}
              color={THEME.darkGreen}
              borderRadius="full"
              fontWeight="bold"
              _hover={{
                bg: "#F3C66D",
              }}
              onClick={() => router.push("/registration")}
            >
              Register Crop
            </Button>

            <Button
              variant="outline"
              color="white"
              borderColor="whiteAlpha.600"
              borderRadius="full"
              _hover={{
                bg: "whiteAlpha.200",
              }}
              onClick={() => router.push("/marketplace")}
            >
              Marketplace
            </Button>
          </HStack>
        </Flex>

        {/* Summary Cards */}

        <SimpleGrid
          columns={{
            base: 1,
            md: 2,
            xl: 4,
          }}
          gap={5}
        >
          {/* WEATHER */}

          <DashboardCard bg={THEME.lightOrange}>
            <HStack justify="space-between" align="start">
              <Box>
                <Text color={THEME.textMuted} fontSize="sm" fontWeight="medium">
                  Weather
                </Text>

                <Heading size="xl" color={THEME.textDark} mt={2}>
                  {weatherLoading ? (
                    <Spinner size="sm" />
                  ) : temperature != null ? (
                    `${Math.round(temperature)}°C`
                  ) : (
                    "--°C"
                  )}
                </Heading>

                <Text fontSize="sm" color={THEME.textMuted} mt={1}>
                  {weather?.district
                    ? `Weather in ${weather.district}`
                    : "Weather unavailable"}
                </Text>
              </Box>

              <Flex
                bg="white"
                w="48px"
                h="48px"
                borderRadius="full"
                align="center"
                justify="center"
                color="#D97706"
              >
                <CloudSun size={26} />
              </Flex>
            </HStack>
          </DashboardCard>

          {/* CROPS */}

          <DashboardCard bg={THEME.paleGreen}>
            <HStack justify="space-between" align="start">
              <Box>
                <Text color={THEME.textMuted} fontSize="sm" fontWeight="medium">
                  My Registered Crops
                </Text>

                <Heading size="xl" color={THEME.textDark} mt={2}>
                  {loadingCrops ? <Spinner size="sm" /> : activeCrops.length}
                </Heading>

                <Text fontSize="sm" color={THEME.textMuted} mt={1}>
                  {nextHarvest
                    ? `Next harvest: ${monthName(nextHarvest.year, nextHarvest.month)}`
                    : "No upcoming harvest registered"}
                </Text>
              </Box>

              <Flex
                bg="white"
                w="48px"
                h="48px"
                borderRadius="full"
                align="center"
                justify="center"
                color={THEME.green}
              >
                <Sprout size={26} />
              </Flex>
            </HStack>
          </DashboardCard>

          {/* PRODUCTS */}

          <DashboardCard bg="white">
            <HStack justify="space-between" align="start">
              <Box>
                <Text color={THEME.textMuted} fontSize="sm" fontWeight="medium">
                  Marketplace Items
                </Text>

                <Heading size="xl" color={THEME.textDark} mt={2}>
                  {productsLoading ? <Spinner size="sm" /> : products.length}
                </Heading>

                <Text fontSize="sm" color={THEME.textMuted} mt={1}>
                  Products available now
                </Text>
              </Box>

              <Flex
                bg={THEME.softGreen}
                w="48px"
                h="48px"
                borderRadius="full"
                align="center"
                justify="center"
                color={THEME.green}
              >
                <ShoppingBasket size={26} />
              </Flex>
            </HStack>
          </DashboardCard>

          {/* NEWS */}

          <DashboardCard bg="white">
            <HStack justify="space-between" align="start">
              <Box>
                <Text color={THEME.textMuted} fontSize="sm" fontWeight="medium">
                  Farming News
                </Text>

                <Heading size="xl" color={THEME.textDark} mt={2}>
                  {newsLoading ? <Spinner size="sm" /> : news.length}
                </Heading>

                <Text fontSize="sm" color={THEME.textMuted} mt={1}>
                  Latest updates and alerts
                </Text>
              </Box>

              <Flex
                bg={THEME.softGreen}
                w="48px"
                h="48px"
                borderRadius="full"
                align="center"
                justify="center"
                color={THEME.green}
              >
                <Newspaper size={26} />
              </Flex>
            </HStack>
          </DashboardCard>
        </SimpleGrid>

        {/* Main Content */}

        <SimpleGrid
          columns={{
            base: 1,
            xl: 3,
          }}
          gap={6}
        >
          {/* Left Column */}

          <VStack
            align="stretch"
            gap={6}
            gridColumn={{
              base: "auto",
              xl: "span 2",
            }}
          >
            {/* Quick Actions */}

            <DashboardCard bg="white">
              <SectionTitle
                title="Quick Actions"
                subtitle="Common tasks for farmers"
              />

              <SimpleGrid
                columns={{
                  base: 1,
                  md: 3,
                }}
                gap={4}
              >
                <QuickActionCard
                  title="Register Harvest"
                  subtitle="Add expected crop amount"
                  icon={<Sprout size={22} />}
                  bg={THEME.paleGreen}
                  onClick={() => router.push("/registration")}
                />

                <QuickActionCard
                  title="Browse Products"
                  subtitle="Buy or sell farm items"
                  icon={<Package size={22} />}
                  bg={THEME.lightOrange}
                  onClick={() => router.push("/marketplace")}
                />

                <QuickActionCard
                  title="Ask Assistant"
                  subtitle="Use the AI chat bubble"
                  icon={<Bot size={22} />}
                  bg="#EEF9F1"
                  onClick={() => {
                    alert("Use the green chat button at bottom-right.");
                  }}
                />
              </SimpleGrid>
            </DashboardCard>

            {/* Predicted Prices */}

            <DashboardCard bg="white">
              <PriceForecastPanel variant="farmer" />
            </DashboardCard>

            {/* Products */}

            <DashboardCard bg="white">
              <SectionTitle
                title="Latest Marketplace Products"
                subtitle="Recently available farming products"
                actionText="View all"
                onAction={() => router.push("/marketplace")}
              />

              {productsLoading ? (
                <Flex justify="center" py={8}>
                  <Spinner />
                </Flex>
              ) : latestProducts.length === 0 ? (
                <Text color={THEME.textMuted}>No products available yet.</Text>
              ) : (
                <SimpleGrid
                  columns={{
                    base: 1,
                    md: 2,
                  }}
                  gap={4}
                >
                  {latestProducts.map((product: any) => (
                    <Flex
                      key={product.id}
                      bg={THEME.paleGreen}
                      borderRadius="2xl"
                      p={4}
                      align="center"
                      gap={4}
                      cursor="pointer"
                      _hover={{
                        bg: "#E7F3D8",
                      }}
                      onClick={() => router.push(`/marketplace/${product.id}`)}
                    >
                      <Image
                        src={product.image || "/images/logo.png"}
                        alt={product.name || "Product"}
                        boxSize="64px"
                        borderRadius="xl"
                        objectFit="cover"
                        bg="white"
                      />

                      <Box flex="1">
                        <Text fontWeight="bold" color={THEME.textDark}>
                          {product.name || "Unnamed Product"}
                        </Text>

                        <Text fontSize="sm" color={THEME.textMuted}>
                          LKR {product.price || 0}
                        </Text>

                        <HStack mt={2}>
                          <Badge colorPalette="green" variant="subtle">
                            {product.category || "Product"}
                          </Badge>

                          <Badge
                            colorPalette={
                              Number(product.stock || 0) > 0 ? "green" : "red"
                            }
                            variant="solid"
                          >
                            Stock: {product.stock || 0}
                          </Badge>
                        </HStack>
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              )}
            </DashboardCard>
          </VStack>

          {/* Right Column */}

          <VStack align="stretch" gap={6}>
            {/* Crop Registrations */}

            <DashboardCard bg="white">
              <SectionTitle
                title="My Crop Registrations"
                subtitle="Recent harvest plans"
                actionText="Register"
                onAction={() => router.push("/registration")}
              />

              {loadingCrops ? (
                <Flex justify="center" py={8}>
                  <Spinner />
                </Flex>
              ) : latestCrops.length === 0 ? (
                <Box bg={THEME.paleGreen} borderRadius="xl" p={4}>
                  <Text color={THEME.textDark} fontWeight="medium">
                    No crop registrations yet.
                  </Text>

                  <Text fontSize="sm" color={THEME.textMuted} mt={1}>
                    Register your expected harvest to check quota availability.
                  </Text>
                </Box>
              ) : (
                <VStack align="stretch" gap={3}>
                  {latestCrops.map((crop) => (
                    <Flex
                      key={crop.id}
                      justify="space-between"
                      align="center"
                      bg={THEME.paleGreen}
                      borderRadius="xl"
                      p={4}
                    >
                      <Box>
                        <Text fontWeight="bold" color={THEME.textDark}>
                          {crop.crop_name} · harvest{" "}
                          {monthName(crop.target?.year, crop.target?.month)}
                        </Text>

                        <Text fontSize="sm" color={THEME.textMuted}>
                          {crop.amount_mt} MT registered
                        </Text>
                      </Box>

                      {/* No approval step exists: a registration is either held or cancelled */}
                      {crop.status === "cancelled" ? (
                        <Badge colorPalette="gray" variant="solid">
                          Cancelled
                        </Badge>
                      ) : (
                        <Badge colorPalette="green" variant="solid">
                          Registered
                        </Badge>
                      )}
                    </Flex>
                  ))}
                </VStack>
              )}
            </DashboardCard>

            {/* News */}

            <DashboardCard bg="white">
              <SectionTitle
                title="Latest Farming News"
                subtitle="Updates for farmers"
                actionText="View all"
                onAction={() => router.push("/news")}
              />

              {newsLoading ? (
                <Flex justify="center" py={8}>
                  <Spinner />
                </Flex>
              ) : latestNews.length === 0 ? (
                <Text color={THEME.textMuted}>No news available yet.</Text>
              ) : (
                <VStack align="stretch" gap={3}>
                  {latestNews.map((item: any) => (
                    <Box
                      key={item.id}
                      bg={THEME.paleGreen}
                      borderRadius="xl"
                      p={4}
                      cursor="pointer"
                      _hover={{
                        bg: "#E7F3D8",
                      }}
                      onClick={() => router.push("/news")}
                    >
                      <Badge colorPalette="orange" variant="subtle" mb={2}>
                        {item.n_type || "News"}
                      </Badge>

                      <Text
                        fontWeight="bold"
                        color={THEME.textDark}
                        lineClamp={2}
                      >
                        {item.n_title || "Untitled News"}
                      </Text>

                      <Text
                        fontSize="sm"
                        color={THEME.textMuted}
                        mt={1}
                        lineClamp={2}
                      >
                        {item.n_description || "No description available."}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              )}
            </DashboardCard>
          </VStack>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}

export default Dashboard;
