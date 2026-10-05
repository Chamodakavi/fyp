"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Input,
  Spinner,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  DoorOpen,
  DoorClosed,
  CalendarPlus,
  Power,
  RefreshCw,
  History,
} from "lucide-react";
import {
  fetchBucketStatus,
  fetchWindowHistory,
  openPlantingMonth,
  openRegistration,
  closeRegistration,
  extendRegistration,
  setTargetActive,
  cropLabel,
  monthName,
  formatDateTime,
  toLocalInput,
  rpcMessage,
  errorMessage,
  BucketStatus,
  RegistrationWindow,
  RpcResult,
} from "@/lib/services/quotaService";
import FillBar from "@/components/quota/FillBar";

type Filter = "all" | "open" | "upcoming" | "closed" | "inactive";

const FILTERS: Filter[] = ["all", "open", "upcoming", "closed", "inactive"];
const DAY_MS = 86_400_000;

const statusOf = (
  t: BucketStatus,
): { label: string; color: string; key: Filter } => {
  if (!t.is_active) return { label: "Inactive", color: "gray", key: "inactive" };
  if (t.is_open && t.remaining_mt <= 0)
    return { label: "Open · FULL", color: "red", key: "open" };
  if (t.is_open) return { label: "Open", color: "green", key: "open" };
  if (t.next_opens_at)
    return { label: "Scheduled", color: "blue", key: "upcoming" };
  return { label: "Closed", color: "orange", key: "closed" };
};

function TargetRow({
  target: t,
  onChanged,
}: {
  target: BucketStatus;
  onChanged: (text: string, ok: boolean) => void;
}) {
  const status = statusOf(t);

  const [busy, setBusy] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [showExtend, setShowExtend] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<RegistrationWindow[] | null>(null);

  const [opens, setOpens] = useState(() => toLocalInput(new Date()));
  const [closes, setCloses] = useState(() =>
    toLocalInput(new Date(Date.now() + 14 * DAY_MS)),
  );
  const [reason, setReason] = useState("Reopened — space still available");
  const [extendTo, setExtendTo] = useState(() =>
    toLocalInput(
      t.window_closes_at
        ? new Date(new Date(t.window_closes_at).getTime() + 7 * DAY_MS)
        : new Date(),
    ),
  );

  const loadHistory = async () => {
    try {
      setHistory(await fetchWindowHistory(t.target_id));
    } catch (e) {
      console.error("Error loading window history:", e);
      setHistory([]);
    }
  };

  const run = async (action: () => Promise<RpcResult>, okText: string) => {
    setBusy(true);
    try {
      const result = await action();
      const ok = result.status === "success";
      if (ok) {
        setShowCustom(false);
        setShowExtend(false);
        if (showHistory) await loadHistory();
      }
      onChanged(ok ? okText : rpcMessage(result), ok);
    } catch (e) {
      onChanged(errorMessage(e, "Action failed"), false);
    } finally {
      setBusy(false);
    }
  };

  const toggleHistory = () => {
    if (!showHistory) loadHistory();
    setShowHistory((v) => !v);
  };

  const handleOpenCustom = () => {
    const o = new Date(opens);
    const c = new Date(closes);
    if (Number.isNaN(o.getTime()) || Number.isNaN(c.getTime())) {
      onChanged("Set both registration dates.", false);
      return;
    }
    run(
      () => openRegistration(t.target_id, o, c, reason.trim() || undefined),
      `${t.crop_name}: registration window opened`,
    );
  };

  const handleExtend = () => {
    const c = new Date(extendTo);
    if (!t.current_window_id || Number.isNaN(c.getTime())) {
      onChanged("Set the new closing time.", false);
      return;
    }
    run(
      () => extendRegistration(t.current_window_id!, c),
      `${t.crop_name}: window extended`,
    );
  };

  const handleToggleActive = () => {
    if (
      t.is_active &&
      !window.confirm(
        `Deactivate ${t.crop_name} (${monthName(t.year, t.month)})? Farmers will no longer see it and its registration window will close.`,
      )
    ) {
      return;
    }
    run(
      () => setTargetActive(t.target_id, !t.is_active),
      `${t.crop_name}: ${t.is_active ? "deactivated" : "activated"}`,
    );
  };

  return (
    <Box
      p={5}
      bg="white"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.100"
      boxShadow="sm"
    >
      <Flex justify="space-between" align="start" gap={3} wrap="wrap">
        <Box>
          <HStack gap={2}>
            <Text fontWeight="bold" fontSize="lg" color="gray.800">
              {cropLabel(t.crop_name)}
            </Text>
            <Badge colorPalette={status.color} variant="solid">
              {status.label}
            </Badge>
          </HStack>
          <Text fontSize="sm" color="gray.600">
            Harvest {monthName(t.year, t.month)} · plant{" "}
            {t.planting_date ?? "—"} · fair Rs. {t.target_fair_price ?? "—"}/kg
          </Text>
        </Box>

        <Box textAlign="right" fontSize="sm">
          {t.is_open && (
            <Text color="green.700">
              Open until <b>{formatDateTime(t.window_closes_at)}</b>
            </Text>
          )}
          {!t.is_open && t.next_opens_at && (
            <Text color="blue.700">
              Opens {formatDateTime(t.next_opens_at)}
            </Text>
          )}
        </Box>
      </Flex>

      <Box mt={3}>
        <FillBar ratio={t.fill_ratio} h="8px" />
        <Text fontSize="sm" color="gray.600" mt={1}>
          {t.filled_mt} / {t.target_limit_mt} MT registered ·{" "}
          <b>{t.remaining_mt} MT left</b> · {t.farmer_count} farmers
        </Text>
      </Box>

      <HStack mt={4} gap={2} wrap="wrap">
        {t.is_open ? (
          <>
            <Button
              size="sm"
              colorPalette="orange"
              variant="outline"
              disabled={busy}
              onClick={() =>
                run(
                  () => closeRegistration(t.target_id),
                  `${t.crop_name}: registration closed`,
                )
              }
            >
              <DoorClosed size={14} /> Close now
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => setShowExtend((v) => !v)}
            >
              <CalendarPlus size={14} /> Extend
            </Button>
          </>
        ) : t.is_active ? (
          <>
            <Button
              size="sm"
              colorPalette="green"
              disabled={busy}
              onClick={() =>
                run(
                  () => openPlantingMonth(t.target_id),
                  `${t.crop_name}: opened for the planting month`,
                )
              }
            >
              <DoorOpen size={14} /> Open planting month
            </Button>
            <Button
              size="sm"
              colorPalette="green"
              variant="outline"
              disabled={busy}
              onClick={() => setShowCustom((v) => !v)}
            >
              <RefreshCw size={14} />{" "}
              {t.filled_mt > 0 ? "Reopen…" : "Open custom…"}
            </Button>
          </>
        ) : null}

        <Button
          size="sm"
          variant="ghost"
          colorPalette={t.is_active ? "red" : "green"}
          disabled={busy}
          onClick={handleToggleActive}
        >
          <Power size={14} /> {t.is_active ? "Deactivate" : "Activate"}
        </Button>
        <Button size="sm" variant="ghost" onClick={toggleHistory}>
          <History size={14} /> Windows
        </Button>
      </HStack>

      {showCustom && !t.is_open && t.is_active && (
        <Box mt={4} p={4} bg="green.50" borderRadius="lg">
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={3}>
            <Box>
              <Text fontSize="xs" mb={1}>
                Opens
              </Text>
              <Input
                type="datetime-local"
                size="sm"
                bg="white"
                value={opens}
                onChange={(e) => setOpens(e.target.value)}
              />
            </Box>
            <Box>
              <Text fontSize="xs" mb={1}>
                Closes
              </Text>
              <Input
                type="datetime-local"
                size="sm"
                bg="white"
                value={closes}
                onChange={(e) => setCloses(e.target.value)}
              />
            </Box>
            <Box>
              <Text fontSize="xs" mb={1}>
                Reason (shown in history)
              </Text>
              <Input
                size="sm"
                bg="white"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </Box>
          </SimpleGrid>
          <Button
            mt={3}
            size="sm"
            colorPalette="green"
            disabled={busy}
            onClick={handleOpenCustom}
          >
            Open window
          </Button>
        </Box>
      )}

      {showExtend && t.is_open && t.current_window_id && (
        <HStack mt={4} p={4} bg="gray.50" borderRadius="lg" gap={3} wrap="wrap">
          <Text fontSize="sm">New closing time</Text>
          <Input
            type="datetime-local"
            size="sm"
            w="auto"
            bg="white"
            value={extendTo}
            onChange={(e) => setExtendTo(e.target.value)}
          />
          <Button
            size="sm"
            colorPalette="blue"
            disabled={busy}
            onClick={handleExtend}
          >
            Save
          </Button>
        </HStack>
      )}

      {showHistory && (
        <VStack mt={4} align="stretch" gap={1}>
          {history === null ? (
            <Spinner size="sm" color="gray.400" />
          ) : history.length === 0 ? (
            <Text fontSize="sm" color="gray.500">
              No windows yet.
            </Text>
          ) : (
            history.map((w) => (
              <Text key={w.id} fontSize="xs" color="gray.700">
                #{w.id} · {formatDateTime(w.opens_at)} →{" "}
                {formatDateTime(w.closes_at)}
                {w.closed_early_at &&
                  ` (closed early ${formatDateTime(w.closed_early_at)})`}
                {w.reason && ` · ${w.reason}`}
              </Text>
            ))
          )}
        </VStack>
      )}
    </Box>
  );
}

function TargetsManager() {
  const [rows, setRows] = useState<BucketStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  // Reloads keep the list on screen so open panels in each row aren't lost
  const load = useCallback(async () => {
    try {
      setRows(await fetchBucketStatus(true));
    } catch (e) {
      console.error("Error loading targets:", e);
      setMsg({
        text: errorMessage(e, "Could not load national targets."),
        ok: false,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = rows
    .filter((t) => filter === "all" || statusOf(t).key === filter)
    .filter(
      (t) =>
        !search || t.crop_name.toLowerCase().includes(search.toLowerCase()),
    )
    .sort(
      (a, b) =>
        (b.year ?? 0) - (a.year ?? 0) || (b.month ?? 0) - (a.month ?? 0),
    );

  return (
    <Box bg="#F8FAFC" minH="100vh" p={{ base: 4, md: 8 }}>
      <Container maxW="5xl">
        <VStack align="start" gap={1} mb={6}>
          <Heading size="xl" color="gray.800" fontWeight="bold">
            Targets & Registration Windows
          </Heading>
          <Text color="gray.500">
            Open, close, extend or reopen farmer registration for each
            national target.
          </Text>
        </VStack>

        <HStack mb={4} gap={2} wrap="wrap">
          {FILTERS.map((f) => (
            <Button
              key={f}
              size="sm"
              borderRadius="full"
              colorPalette={filter === f ? "blue" : "gray"}
              variant={filter === f ? "solid" : "outline"}
              onClick={() => setFilter(f)}
              textTransform="capitalize"
            >
              {f}
            </Button>
          ))}
          <Input
            size="sm"
            maxW="220px"
            placeholder="Search crop"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            bg="white"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={load}
            aria-label="Refresh targets"
          >
            <RefreshCw size={14} />
          </Button>
        </HStack>

        {msg && (
          <Box mb={4} p={3} borderRadius="md" bg={msg.ok ? "green.50" : "red.50"}>
            <Text fontSize="sm" color={msg.ok ? "green.700" : "red.700"}>
              {msg.text}
            </Text>
          </Box>
        )}

        {loading ? (
          <Flex justify="center" p={10}>
            <Spinner color="blue.500" size="xl" />
          </Flex>
        ) : visible.length === 0 ? (
          <Box
            p={10}
            bg="white"
            borderRadius="xl"
            border="1px dashed"
            borderColor="gray.300"
            textAlign="center"
          >
            <Text color="gray.500">
              {rows.length === 0
                ? "No national targets yet. Publish one from AI Targets."
                : "No targets in this view."}
            </Text>
          </Box>
        ) : (
          <VStack align="stretch" gap={4}>
            {visible.map((t) => (
              <TargetRow
                key={t.target_id}
                target={t}
                onChanged={(text, ok) => {
                  setMsg({ text, ok });
                  load();
                }}
              />
            ))}
          </VStack>
        )}
      </Container>
    </Box>
  );
}

export default TargetsManager;
