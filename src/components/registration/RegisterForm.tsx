"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Box,
  BoxProps,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Input,
  Button,
  NativeSelect,
  Spinner,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  CalendarClock,
} from "lucide-react";
import { createClient } from "@/utils/supabase/createClient";
import {
  fetchBucketStatus,
  registerHarvest,
  BucketStatus,
  Alternative,
  cropLabel,
  monthName,
  formatDateTime,
} from "@/lib/services/quotaService";
import FillBar from "@/components/quota/FillBar";

type Feedback = {
  type: "success" | "error" | "warning" | null;
  message: string;
};

const NO_FEEDBACK: Feedback = { type: null, message: "" };

const DashboardCard = ({ children, bg = "orange.100", ...props }: BoxProps) => (
  <Box bg={bg} borderRadius="2xl" p={6} boxShadow="sm" {...props}>
    {children}
  </Box>
);

interface Props {
  onRegistered?: () => void;
}

const RegisterForm = ({ onRegistered }: Props) => {
  const [amount, setAmount] = useState("");
  const [targets, setTargets] = useState<BucketStatus[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loadingTargets, setLoadingTargets] = useState(true);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(NO_FEEDBACK);
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [existingRegId, setExistingRegId] = useState<number | null>(null);

  const [farmerId, setFarmerId] = useState<string | null>(null);

  // silent = background refresh (realtime / polling): keep the form on screen
  // and don't replace the farmer's current message with a connection error.
  const load = useCallback(async (silent = false) => {
    try {
      const rows = await fetchBucketStatus(false);
      setTargets(rows);
      setSelectedId((prev) => {
        const open = rows.filter((r) => r.is_open);
        if (prev && open.some((r) => r.target_id === prev)) return prev;
        return (
          open.find((r) => r.remaining_mt > 0)?.target_id ??
          open[0]?.target_id ??
          null
        );
      });
    } catch (e) {
      console.error("Error loading crop targets:", e);
      if (!silent) {
        setFeedback({
          type: "error",
          message: "Could not load crop targets. Check your connection.",
        });
      }
    } finally {
      setLoadingTargets(false);
    }
  }, []);

  useEffect(() => {
    const initializeForm = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setFarmerId(user.id);
      } else {
        setFeedback({ type: "error", message: "Please Log In to Register." });
      }

      // Signed out: keep the "log in" message instead of a load error
      await load(!user);
    };

    initializeForm();
  }, [load]);

  // Live updates: window open/close and target changes
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("register-form")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "registration_windows" },
        () => load(true),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "national_targets" },
        () => load(true),
      )
      .subscribe();

    // Other farmers' registrations aren't visible via realtime, so poll the fill level
    const poll = setInterval(() => load(true), 60_000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(poll);
    };
  }, [load]);

  const openTargets = useMemo(
    () => targets.filter((t) => t.is_open),
    [targets],
  );
  const upcoming = useMemo(
    () =>
      targets
        .filter((t) => !t.is_open && t.next_opens_at)
        .sort((a, b) => (a.next_opens_at! < b.next_opens_at! ? -1 : 1)),
    [targets],
  );
  const selected = openTargets.find((t) => t.target_id === selectedId) ?? null;
  const alreadyMine = selected?.my_registration_id ?? null;

  const clearMessages = () => {
    setFeedback(NO_FEEDBACK);
    setAlternatives([]);
    setExistingRegId(null);
  };

  const handleRegister = async () => {
    clearMessages();

    if (!farmerId) {
      setFeedback({
        type: "error",
        message: "You must be logged in to register!",
      });
      return;
    }

    if (!selected) {
      setFeedback({
        type: "error",
        message: "Please select an open crop target.",
      });
      return;
    }

    const value = Number(amount);
    if (!amount || Number.isNaN(value) || value <= 0) {
      setFeedback({ type: "error", message: "Please enter a valid amount." });
      return;
    }

    setLoading(true);

    try {
      const result = await registerHarvest(selected.target_id, value);

      switch (result.status) {
        case "success":
          setFeedback({
            type: "success",
            message: `✅ Registered ${result.amount_mt} MT of ${result.crop_name}. ${result.remaining_mt} MT space left.`,
          });
          setAmount("");
          onRegistered?.();
          break;
        case "surplus_warning":
          setFeedback({
            type: "warning",
            message: `⚠️ Only ${result.remaining_mt} MT left for ${result.crop_name} (${result.filled_mt} of ${result.limit_mt} MT already registered). Registering ${value} MT would cause a surplus.`,
          });
          setAlternatives(result.alternatives ?? []);
          break;
        case "registration_closed":
          setFeedback({
            type: "error",
            message: result.next_opens_at
              ? `Registration for ${result.crop_name} is closed. It opens again on ${formatDateTime(result.next_opens_at)}.`
              : `Registration for ${result.crop_name} is closed.`,
          });
          break;
        case "already_registered":
          setExistingRegId(result.registration_id);
          setFeedback({
            type: "warning",
            message: `You have already registered for ${result.crop_name} this season. To change the amount, send a quota change request.`,
          });
          break;
        case "invalid_amount":
          setFeedback({
            type: "error",
            message: "Please enter an amount between 0 and 100,000 MT.",
          });
          break;
        case "not_authenticated":
          setFeedback({
            type: "error",
            message: "Your session expired. Please log in again.",
          });
          break;
        default:
          setFeedback({
            type: "error",
            message: "This crop target is no longer available.",
          });
      }

      await load(true);
    } catch (e) {
      console.error("Register error:", e);
      setFeedback({
        type: "error",
        message: "System Error. Check connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  const chooseAlternative = (alt: Alternative) => {
    setSelectedId(alt.target_id);
    clearMessages();
  };

  return (
    <DashboardCard bg="white" w="full" maxW="2xl" mx="auto">
      <Flex justify="space-between" align="center" mb={6} gap={3} wrap="wrap">
        <Heading size="lg" fontWeight="bold" color="green.700">
          🚜 Register Harvest Quota
        </Heading>
        <Badge colorPalette={farmerId ? "green" : "red"} variant="solid">
          {farmerId ? "🟢 Farmer Authenticated" : "🔴 Guest (Read Only)"}
        </Badge>
      </Flex>

      <VStack gap={5} align="stretch">
        <Box
          bg="green.50"
          p={4}
          borderRadius="xl"
          border="1px dashed"
          borderColor="green.300"
        >
          <Text>
            Register your crops to secure price. Registration is open only
            during each crop&apos;s registration period.
          </Text>
        </Box>

        {loadingTargets ? (
          <Flex
            align="center"
            gap={3}
            p={2}
            bg="gray.50"
            borderRadius="md"
            h="45px"
          >
            <Spinner size="sm" color="green.500" />
            <Text fontSize="sm" color="gray.500">
              Loading open registrations...
            </Text>
          </Flex>
        ) : openTargets.length === 0 ? (
          <Box
            p={5}
            bg="orange.50"
            borderRadius="xl"
            border="1px solid"
            borderColor="orange.200"
          >
            <HStack mb={2}>
              <Clock size={18} />
              <Text fontWeight="bold">Registration is closed right now</Text>
            </HStack>
            {upcoming.length > 0 ? (
              <VStack align="stretch" gap={1}>
                <Text fontSize="sm" color="gray.600">
                  Next openings:
                </Text>
                {upcoming.slice(0, 5).map((t) => (
                  <Text key={t.target_id} fontSize="sm">
                    • <b>{cropLabel(t.crop_name)}</b> (
                    {monthName(t.year, t.month)} harvest) — opens{" "}
                    {formatDateTime(t.next_opens_at)}
                  </Text>
                ))}
              </VStack>
            ) : (
              <Text fontSize="sm" color="gray.600">
                No upcoming registration periods yet. Check the news page for
                announcements.
              </Text>
            )}
          </Box>
        ) : (
          <>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Select Crop
              </Text>
              <NativeSelect.Root size="lg" variant="subtle">
                <NativeSelect.Field
                  value={selectedId ?? ""}
                  onChange={(e) => {
                    setSelectedId(Number(e.currentTarget.value));
                    clearMessages();
                  }}
                  bg="gray.50"
                >
                  {openTargets.map((t) => (
                    <option
                      key={t.target_id}
                      value={t.target_id}
                      disabled={t.remaining_mt <= 0}
                    >
                      {t.crop_name} · {monthName(t.year, t.month)} harvest ·{" "}
                      {t.remaining_mt <= 0
                        ? "FULL"
                        : `${t.remaining_mt} MT left`}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Box>

            {selected && (
              <Box
                p={4}
                bg="gray.50"
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.200"
              >
                <Flex justify="space-between" mb={2} wrap="wrap" gap={2}>
                  <Text fontWeight="bold">{cropLabel(selected.crop_name)}</Text>
                  <HStack color="orange.600" fontSize="sm">
                    <CalendarClock size={16} />
                    <Text>
                      Closes {formatDateTime(selected.window_closes_at)}
                    </Text>
                  </HStack>
                </Flex>

                <FillBar ratio={selected.fill_ratio} />
                <Text fontSize="sm" color="gray.600" mt={1}>
                  {selected.filled_mt} of {selected.target_limit_mt} MT
                  registered · <b>{selected.remaining_mt} MT left</b> ·{" "}
                  {selected.farmer_count} farmers
                </Text>

                <SimpleGrid columns={{ base: 2, md: 4 }} gap={3} mt={3}>
                  <Box>
                    <Text fontSize="xs" color="gray.500">
                      Plant in
                    </Text>
                    <Text fontWeight="semibold">
                      {selected.planting_date ?? "—"}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="gray.500">
                      Harvest
                    </Text>
                    <Text fontWeight="semibold">
                      {monthName(selected.year, selected.month)}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="gray.500">
                      Fair price
                    </Text>
                    <Text fontWeight="semibold" color="green.700">
                      {selected.target_fair_price
                        ? `Rs. ${selected.target_fair_price}/kg`
                        : "—"}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="gray.500">
                      Expected wholesale
                    </Text>
                    <Text fontWeight="semibold">
                      {selected.estimated_wholesale_price
                        ? `Rs. ${selected.estimated_wholesale_price}/kg`
                        : "—"}
                    </Text>
                  </Box>
                </SimpleGrid>

                {alreadyMine && (
                  <Box mt={3} p={3} bg="blue.50" borderRadius="md">
                    <Text fontSize="sm" color="blue.800">
                      You registered <b>{selected.my_amount_mt} MT</b> for this
                      crop.{" "}
                      <Link
                        href={`/quota-support?registration=${alreadyMine}`}
                        style={{ textDecoration: "underline" }}
                      >
                        Request a change
                      </Link>
                    </Text>
                  </Box>
                )}
              </Box>
            )}

            <Box>
              <Text fontWeight="bold" mb={2}>
                Expected Harvest Amount (MT)
              </Text>
              <Input
                size="lg"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.1"
                placeholder="e.g. 100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                bg="gray.50"
                disabled={!!alreadyMine}
              />
              {selected && !alreadyMine && (
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Maximum you can register now: {selected.remaining_mt} MT
                </Text>
              )}
            </Box>

            <Button
              size="lg"
              colorPalette="green"
              onClick={handleRegister}
              disabled={
                loading ||
                !farmerId ||
                !selected ||
                !!alreadyMine ||
                selected.remaining_mt <= 0
              }
              w="full"
              mt={2}
            >
              {loading ? <Spinner size="sm" /> : "Check & Register"}
            </Button>
          </>
        )}

        {/* Feedback Message */}
        {feedback.type && (
          <Flex
            bg={
              feedback.type === "success"
                ? "green.50"
                : feedback.type === "warning"
                  ? "orange.50"
                  : "red.50"
            }
            p={3}
            borderRadius="md"
            align="flex-start"
            gap={2}
          >
            <Box flexShrink={0} mt="1px">
              {feedback.type === "success" ? (
                <CheckCircle size={18} color="green" />
              ) : feedback.type === "warning" ? (
                <AlertTriangle size={18} color="#C05621" />
              ) : (
                <XCircle size={18} color="red" />
              )}
            </Box>
            <Box>
              <Text
                fontSize="sm"
                fontWeight="medium"
                color={
                  feedback.type === "success"
                    ? "green.700"
                    : feedback.type === "warning"
                      ? "orange.800"
                      : "red.700"
                }
              >
                {feedback.message}
              </Text>
              {existingRegId && (
                <Link href={`/quota-support?registration=${existingRegId}`}>
                  <Text
                    fontSize="sm"
                    color="blue.600"
                    textDecoration="underline"
                    mt={1}
                  >
                    Go to Quota Support →
                  </Text>
                </Link>
              )}
            </Box>
          </Flex>
        )}

        {/* Surplus: other open crops that still have room for this amount */}
        {alternatives.length > 0 && (
          <Box
            p={4}
            border="1px solid"
            borderColor="green.200"
            borderRadius="xl"
          >
            <Text fontWeight="bold" mb={2}>
              Consider these crops instead (open now, with enough space):
            </Text>
            <VStack align="stretch" gap={2}>
              {alternatives.map((alt) => (
                <Flex
                  key={alt.target_id}
                  justify="space-between"
                  align="center"
                  p={2}
                  bg="green.50"
                  borderRadius="md"
                  gap={2}
                  wrap="wrap"
                >
                  <Box>
                    <Text fontWeight="semibold">
                      {cropLabel(alt.crop_name)} ·{" "}
                      {monthName(alt.year, alt.month)} harvest
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      {alt.remaining_mt} MT left
                      {alt.target_fair_price
                        ? ` · fair price Rs. ${alt.target_fair_price}/kg`
                        : ""}{" "}
                      · closes {formatDateTime(alt.window_closes_at)}
                    </Text>
                  </Box>
                  <Button
                    size="sm"
                    colorPalette="green"
                    variant="outline"
                    onClick={() => chooseAlternative(alt)}
                  >
                    Choose
                  </Button>
                </Flex>
              ))}
            </VStack>
          </Box>
        )}
      </VStack>
    </DashboardCard>
  );
};

export default RegisterForm;
