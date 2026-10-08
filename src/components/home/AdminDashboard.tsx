"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Flex,
  SimpleGrid,
  Heading,
  Text,
  HStack,
  VStack,
  Button,
  Container,
  Separator,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import {
  Users,
  Sprout,
  Sparkles,
  ArrowRight,
  Calendar,
  Layers,
  Scale,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  getDashboardData,
  DashboardKPIs,
  TrajectoryPoint,
} from "@/lib/services/dashboardService";
import {
  TargetSummary,
  STATUS_LABEL,
  STATUS_COLOR,
  healthOf,
} from "@/lib/services/quotaService";
import FillBar from "@/components/quota/FillBar";
import PriceForecastPanel from "@/components/prices/PriceForecastPanel";

const StatCard = ({
  label,
  value,
  subtext,
  icon: LucideIcon,
  iconBg,
  iconColor,
}: any) => (
  <Box
    bg="white"
    p="6"
    borderRadius="xl"
    border="1px solid"
    borderColor="gray.100"
    boxShadow="sm"
    w="full"
  >
    <Flex justify="space-between" align="start">
      <VStack align="start" gap="1">
        <Text
          fontSize="xs"
          fontWeight="bold"
          textTransform="uppercase"
          color="gray.500"
        >
          {label}
        </Text>
        <Text
          fontSize="3xl"
          fontWeight="black"
          color="gray.800"
          lineHeight="1.2"
        >
          {value}
        </Text>
        {subtext && (
          <Text fontSize="xs" color="gray.500" mt="1">
            {subtext}
          </Text>
        )}
      </VStack>
      <Box bg={iconBg} p="3" borderRadius="xl">
        <LucideIcon size={22} color={iconColor} />
      </Box>
    </Flex>
  </Box>
);

/** One card per target (crop + harvest month) — numbers are never shared across months. */
const TargetQuotaCard = ({ t }: { t: TargetSummary }) => {
  const health = healthOf(t.fill_ratio);
  return (
    <Box
      p="3.5"
      borderRadius="lg"
      border="1px solid"
      borderColor="gray.100"
      bg="gray.50"
    >
      <Flex justify="space-between" align="center" mb="1" gap="2" wrap="wrap">
        <HStack gap="2">
          <Text fontSize="sm" fontWeight="bold" color="gray.800">
            {t.crop_name}
          </Text>
          <Badge variant="outline" colorPalette="gray" size="sm">
            Harvest {t.harvest_label}
          </Badge>
        </HStack>
        <Badge colorPalette={health.color} variant="subtle" size="sm">
          {health.label}
        </Badge>
      </Flex>

      <Text fontSize="2xs" color="gray.500" mb="2">
        Register: {t.registration_label ?? "—"} ·{" "}
        <Text as="span" color={`${STATUS_COLOR[t.status]}.600`} fontWeight="bold">
          {STATUS_LABEL[t.status]}
        </Text>
      </Text>

      <FillBar ratio={t.fill_ratio} h="6px" />

      <Flex justify="space-between" fontSize="2xs" color="gray.600" mt="2">
        <Text>
          Registered: <b>{t.filled_mt} MT</b>
          {t.filled_ha != null ? ` (${t.filled_ha} ha)` : ""}
        </Text>
        <Text>
          Limit: <b>{t.target_limit_mt} MT</b>
          {t.allowed_extent_ha != null ? ` (${t.allowed_extent_ha} ha)` : ""} ·{" "}
          {Math.round(t.fill_ratio * 100)}%
        </Text>
      </Flex>
    </Box>
  );
};

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<DashboardKPIs>({
    totalFarmers: 0,
    registeredSupplyMt: 0,
    harvestMonthsCount: 0,
    activeCropsCount: 0,
    pendingComplaintsCount: 0,
  });
  const [targets, setTargets] = useState<TargetSummary[]>([]);
  const [trajectory, setTrajectory] = useState<TrajectoryPoint[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const data = await getDashboardData();
        setKpis(data.kpis);
        setTargets(data.targets);
        setTrajectory(data.trajectory);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <Box bg="#F8FAFC" minH="100vh" p={{ base: 4, md: 8 }}>
      <Container maxW="7xl">
        {/* --- HEADER --- */}
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "start", md: "center" }}
          mb="8"
          gap="4"
        >
          <VStack align="start" gap="1">
            <Heading size="xl" color="gray.800" fontWeight="black">
              National Agricultural Command Center
            </Heading>
            <Text color="gray.500" fontSize="sm">
              Live database monitoring of production quotas, market equilibrium,
              and complaints.
            </Text>
          </VStack>

          <HStack
            bg="green.50"
            border="1px solid"
            borderColor="green.200"
            px="4"
            py="2"
            borderRadius="full"
            gap="2"
          >
            <Box boxSize="8px" bg="green.500" borderRadius="full" />
            <Text fontSize="xs" fontWeight="bold" color="green.700">
              Database Sync: Active
            </Text>
          </HStack>
        </Flex>

        {/* --- FULL-WIDTH AI TARGETS CALLOUT BANNER --- */}
        <Box
          w="full"
          bgGradient="to-r"
          gradientFrom="blue.600"
          gradientTo="indigo.700"
          borderRadius="2xl"
          p={{ base: 6, md: 8 }}
          color="white"
          boxShadow="lg"
          mb="8"
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "start", md: "center" }}
            gap="6"
          >
            <VStack align="start" gap="2" maxW="2xl">
              <HStack
                bg="whiteAlpha.200"
                px="3"
                py="1"
                borderRadius="full"
                gap="2"
              >
                <Sparkles size={14} color="#bc850e" />
                <Text fontSize="xs" fontWeight="bold" color="yellow.700">
                  HYBRID ECONOMIC ENGINE READY
                </Text>
              </HStack>
              <Heading size="lg" fontWeight="extrabold" color="blackAlpha.900">
                Solve & Enforce National Production Targets
              </Heading>
              <Text fontSize="sm" color="blue.600" lineHeight="tall">
                Generate and persist forward supply targets directly to the
                national quota schema to prevent post-harvest market collapse.
              </Text>
            </VStack>

            <Link
              href="/admin/ai-targets"
              style={{ width: "100%", maxWidth: "260px" }}
            >
              <Button
                w="full"
                bg="white"
                color="blue.700"
                h="52px"
                px="6"
                fontWeight="bold"
                fontSize="sm"
                borderRadius="xl"
                boxShadow="md"
                _hover={{ bg: "blue.50", transform: "translateY(-1px)" }}
                transition="all 0.2s"
                gap="2"
              >
                Open AI Quota Solver <ArrowRight size={18} />
              </Button>
            </Link>
          </Flex>
        </Box>

        {loading ? (
          <Flex justify="center" align="center" minH="300px">
            <Spinner size="xl" color="blue.600" />
          </Flex>
        ) : (
          <>
            {/* --- DYNAMIC STAT CARDS --- */}
            <SimpleGrid
              columns={{ base: 1, sm: 2, lg: 4 }}
              gap="6"
              w="full"
              mb="8"
            >
              <StatCard
                label="Registered Supply"
                value={`${kpis.registeredSupplyMt.toLocaleString()} MT`}
                subtext={`Across ${kpis.harvestMonthsCount} harvest month${kpis.harvestMonthsCount === 1 ? "" : "s"} taking registrations`}
                icon={Scale}
                iconBg="blue.50"
                iconColor="#2563EB"
              />
              <StatCard
                label="Registered Farmers"
                value={kpis.totalFarmers.toLocaleString()}
                subtext="Producers registered on platform"
                icon={Users}
                iconBg="indigo.50"
                iconColor="#4F46E5"
              />
              <StatCard
                label="Regulated Crops"
                value={`${kpis.activeCropsCount} Varieties`}
                subtext={`${targets.length} active harvest-month target${targets.length === 1 ? "" : "s"}`}
                icon={Sprout}
                iconBg="emerald.50"
                iconColor="#059669"
              />
              <StatCard
                label="Pending Inquiries"
                value={kpis.pendingComplaintsCount.toString()}
                subtext="Farmer complaints awaiting review"
                icon={AlertCircle}
                iconBg="red.50"
                iconColor="#EF4444"
              />
            </SimpleGrid>

            {/* --- ANALYTICS & REGISTRATION SPLIT --- */}
            <SimpleGrid columns={{ base: 1, lg: 3 }} gap="6" w="full">
              {/* Main Chart */}
              <Box
                gridColumn={{ lg: "span 2" }}
                bg="white"
                p="6"
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.100"
                boxShadow="sm"
              >
                <Flex justify="space-between" align="center" mb="6">
                  <VStack align="start" gap="0">
                    <Heading size="sm" color="gray.800" fontWeight="bold">
                      National Supply by Harvest Month (Metric Tons)
                    </Heading>
                    <Text fontSize="xs" color="gray.500">
                      Registered supply vs AI limit — one pair of bars per
                      target
                    </Text>
                  </VStack>
                  <HStack gap="2">
                    <Calendar size={16} color="#64748B" />
                    <Text fontSize="xs" fontWeight="semibold" color="gray.600">
                      Database Records
                    </Text>
                  </HStack>
                </Flex>

                <Box h="340px" w="full">
                  {trajectory.length === 0 ? (
                    <Flex h="full" align="center" justify="center">
                      <Text fontSize="sm" color="gray.400">
                        No active targets to chart yet.
                      </Text>
                    </Flex>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={trajectory}
                        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                        barGap={2}
                        barCategoryGap="25%"
                      >
                        <CartesianGrid
                          vertical={false}
                          strokeDasharray="3 3"
                          stroke="#F1F5F9"
                        />
                        <XAxis
                          dataKey="label"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#64748B", fontSize: 11 }}
                          dy={8}
                          interval={0}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#64748B", fontSize: 12 }}
                        />
                        <Tooltip
                          cursor={{ fill: "#F8FAFC" }}
                          contentStyle={{
                            borderRadius: "12px",
                            border: "none",
                            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                            fontSize: "12px",
                          }}
                        />
                        <Legend
                          verticalAlign="top"
                          align="right"
                          height={36}
                          iconType="circle"
                        />
                        <Bar
                          name="AI Limit (MT)"
                          dataKey="targetMT"
                          fill="#A7F3D0"
                          radius={[6, 6, 0, 0]}
                        />
                        <Bar
                          name="Registered (MT)"
                          dataKey="registeredMT"
                          fill="#2563EB"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </Box>
              </Box>

              {/* Active Quota Windows Sidebar */}
              <Box
                bg="white"
                p="6"
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.100"
                boxShadow="sm"
              >
                <Flex justify="space-between" align="center" mb="5">
                  <VStack align="start" gap="0">
                    <Heading size="sm" color="gray.800" fontWeight="bold">
                      Active Target Quotas
                    </Heading>
                    <Text fontSize="xs" color="gray.500">
                      One card per crop and harvest month
                    </Text>
                  </VStack>
                  <Layers size={18} color="#64748B" />
                </Flex>

                <VStack gap="4" align="stretch">
                  {targets.length === 0 ? (
                    <Text
                      fontSize="xs"
                      color="gray.400"
                      py={4}
                      textAlign="center"
                    >
                      No published national targets yet.
                    </Text>
                  ) : (
                    targets.map((t) => (
                      <TargetQuotaCard key={t.target_id} t={t} />
                    ))
                  )}
                </VStack>

                <Separator my="4" />

                <HStack>
                  <Link href="/admin/ai-targets" style={{ width: "100%" }}>
                    <Button
                      w="full"
                      variant="subtle"
                      colorPalette="blue"
                      size="sm"
                      gap="2"
                      fontWeight="bold"
                    >
                      New Target <ArrowRight size={14} />
                    </Button>
                  </Link>
                  <Link href="/admin/targets" style={{ width: "100%" }}>
                    <Button
                      w="full"
                      variant="outline"
                      colorPalette="blue"
                      size="sm"
                      gap="2"
                      fontWeight="bold"
                    >
                      Windows
                    </Button>
                  </Link>
                </HStack>
              </Box>
            </SimpleGrid>

            {/* --- PREDICTED CROP PRICES --- */}
            <Box
              bg="white"
              p="6"
              mt="6"
              borderRadius="xl"
              border="1px solid"
              borderColor="gray.100"
              boxShadow="sm"
            >
              <PriceForecastPanel variant="admin" />
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}

export default AdminDashboard;
