"use client";

import React from "react";
import {
  Box,
  Flex,
  SimpleGrid,
  Heading,
  Text,
  HStack,
  VStack,
  Icon,
  Container,
} from "@chakra-ui/react";

import {
  Users,
  Sprout,
  MessageSquare,
  AlertTriangle,
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "0", uv: 0 },
  { name: "5", uv: 500 },
  { name: "10", uv: 1000 },
  { name: "15", uv: 800 },
  { name: "20", uv: 1400 },
  { name: "25", uv: 1200 },
  { name: "30", uv: 2200 },
];

const StatCard = ({
  label,
  value,
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
    flex="1"
  >
    <Flex justify="space-between" align="start">
      <VStack align="start" gap="1">
        <Text fontSize="sm" fontWeight="medium" color="gray.500">
          {label}
        </Text>
        <Text fontSize="3xl" fontWeight="bold" color="gray.800">
          {value}
        </Text>
      </VStack>
      <Box bg={iconBg} p="3" borderRadius="lg">
        <LucideIcon size={20} color={iconColor} />
      </Box>
    </Flex>
  </Box>
);

function AdminDashboard() {
  return (
    <Box bg="#F8FAFC" minH="100vh" p="8">
      <Container maxW="full">
        {/* --- TOP HEADER (Search & Icons) --- */}
        {/* <Flex justify="flex-end" align="center" gap="6" mb="8">
          <Search size={20} color="#64748B" style={{ cursor: "pointer" }} />
          <Bell size={20} color="#64748B" style={{ cursor: "pointer" }} />
          <HStack gap="3" cursor="pointer">
            <Box boxSize="35px" bg="gray.200" borderRadius="full" />
            <ChevronDown size={16} color="#94A3B8" />
          </HStack>
        </Flex> */}

        {/* --- MAIN CONTENT AREA --- */}
        <VStack align="start" gap="6" w="full">
          {/* <Heading size="2xl" color="gray.800" fontWeight="bold">
            Summary
          </Heading> */}

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="6" w="full">
            <StatCard
              label="Total Users"
              value="12,450"
              icon={Users}
              iconBg="blue.50"
              iconColor="#3B82F6"
            />
            <StatCard
              label="Active Crops"
              value="45"
              icon={Sprout}
              iconBg="green.50"
              iconColor="#10B981"
            />
            <StatCard
              label="Community Posts"
              value="8,900"
              icon={MessageSquare}
              iconBg="indigo.50"
              iconColor="#6366F1"
            />
            <StatCard
              label="Pending Actions"
              value="15"
              icon={AlertTriangle}
              iconBg="red.50"
              iconColor="#EF4444"
            />
          </SimpleGrid>

          {/* --- CHART SECTION --- */}
          <Box
            bg="white"
            w="full"
            p="6"
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.100"
            mt="2"
          >
            <Heading size="sm" color="gray.800" mb="8" fontWeight="bold">
              User Activity (Last 30 Days)
            </Heading>

            <Box h="350px" w="full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="#F1F5F9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="uv"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorUv)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

export default AdminDashboard;
