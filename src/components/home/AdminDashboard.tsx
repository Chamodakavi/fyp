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
} from "@chakra-ui/react";
import {
  Users,
  Sprout,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Calendar,
  Layers,
  Scale,
  AlertCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  getDashboardKPIs,
  getActiveCropWindows,
  getSupplyTrajectory,
  DashboardKPIs,
  ActiveCropWindow,
  TrajectoryPoint,
} from "@/lib/services/dashboardService";

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

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<DashboardKPIs>({
    totalFarmers: 0,
    totalAllocatedHa: 0,
    activeCropsCount: 0,
    pendingComplaintsCount: 0,
  });
  const [activeWindows, setActiveWindows] = useState<ActiveCropWindow[]>([]);
  const [trajectory, setTrajectory] = useState<TrajectoryPoint[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [kpiData, windowsData, trajectoryData] = await Promise.all([
          getDashboardKPIs(),
          getActiveCropWindows(),
          getSupplyTrajectory(),
        ]);

        setKpis(kpiData);
        setActiveWindows(windowsData);
        setTrajectory(trajectoryData);
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
              href="/ai-targets"
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
                label="Total Regulated Land"
                value={`${kpis.totalAllocatedHa.toLocaleString()} Ha`}
                subtext="Summed from active farmer land sizes"
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
                subtext="Configured in national targets"
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
                      National Supply Trajectory (Metric Tons)
                    </Heading>
                    <Text fontSize="xs" color="gray.500">
                      Actual supply vs AI target limits over time
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
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={trajectory}
                      margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorRegistered"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#2563EB"
                            stopOpacity={0.25}
                          />
                          <stop
                            offset="95%"
                            stopColor="#2563EB"
                            stopOpacity={0.0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorTarget"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10B981"
                            stopOpacity={0.15}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10B981"
                            stopOpacity={0.0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        vertical={false}
                        strokeDasharray="3 3"
                        stroke="#F1F5F9"
                      />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748B", fontSize: 12 }}
                        dy={8}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748B", fontSize: 12 }}
                      />
                      <Tooltip
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
                      <Area
                        name="AI Target Ceiling (MT)"
                        type="monotone"
                        dataKey="targetMT"
                        stroke="#10B981"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        fill="url(#colorTarget)"
                      />
                      <Area
                        name="Registered Supply (MT)"
                        type="monotone"
                        dataKey="registeredMT"
                        stroke="#2563EB"
                        strokeWidth={2.5}
                        fill="url(#colorRegistered)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
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
                      Live capacity from national_targets
                    </Text>
                  </VStack>
                  <Layers size={18} color="#64748B" />
                </Flex>

                <VStack gap="4" align="stretch">
                  {activeWindows.length === 0 ? (
                    <Text
                      fontSize="xs"
                      color="gray.400"
                      py={4}
                      textAlign="center"
                    >
                      No published national targets yet.
                    </Text>
                  ) : (
                    activeWindows.map((item, index) => (
                      <Box
                        key={index}
                        p="3.5"
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="gray.100"
                        bg="gray.50"
                      >
                        <Flex justify="space-between" align="center" mb="1.5">
                          <HStack gap="2">
                            <Text
                              fontSize="sm"
                              fontWeight="bold"
                              color="gray.800"
                            >
                              {item.crop}
                            </Text>
                            <Text
                              fontSize="2xs"
                              color="gray.500"
                              bg="white"
                              px="2"
                              py="0.5"
                              borderRadius="md"
                              border="1px solid"
                              borderColor="gray.200"
                            >
                              Harvest: {item.targetHarvest}
                            </Text>
                          </HStack>
                          <Text
                            fontSize="2xs"
                            fontWeight="bold"
                            px="2"
                            py="0.5"
                            borderRadius="full"
                            bg={
                              item.statusColor === "green"
                                ? "green.100"
                                : item.statusColor === "orange"
                                  ? "orange.100"
                                  : "red.100"
                            }
                            color={
                              item.statusColor === "green"
                                ? "green.800"
                                : item.statusColor === "orange"
                                  ? "orange.800"
                                  : "red.800"
                            }
                          >
                            {item.status}
                          </Text>
                        </Flex>

                        <Box
                          w="full"
                          bg="gray.200"
                          h="6px"
                          borderRadius="full"
                          overflow="hidden"
                          my="2"
                        >
                          <Box
                            h="full"
                            bg={
                              item.percentage >= 95
                                ? "red.500"
                                : item.percentage >= 80
                                  ? "orange.500"
                                  : "blue.600"
                            }
                            w={`${item.percentage}%`}
                            borderRadius="full"
                          />
                        </Box>

                        <Flex
                          justify="space-between"
                          fontSize="2xs"
                          color="gray.600"
                        >
                          <Text>
                            Registered: <b>{item.registeredHa} Ha</b>
                          </Text>
                          <Text>
                            Allowed: <b>{item.allowedHa} Ha</b> (
                            {item.percentage}%)
                          </Text>
                        </Flex>
                      </Box>
                    ))
                  )}
                </VStack>

                <Separator my="4" />

                <Link href="/ai-targets" style={{ width: "100%" }}>
                  <Button
                    w="full"
                    variant="subtle"
                    colorPalette="blue"
                    size="sm"
                    gap="2"
                    fontWeight="bold"
                  >
                    Configure New Target Window <ArrowRight size={14} />
                  </Button>
                </Link>
              </Box>
            </SimpleGrid>
          </>
        )}
      </Container>
    </Box>
  );
}

export default AdminDashboard;
