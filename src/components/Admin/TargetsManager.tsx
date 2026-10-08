"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  CalendarX,
  Power,
  RefreshCw,
  History,
} from "lucide-react";
import {
  fetchTargetSummary,
  fetchWindowHistory,
  openPlantingMonth,
  openRegistration,
  closeRegistration,
  updateWindow,
  cancelWindow,
  setTargetActive,
  cropLabel,
  formatDateTime,
  toLocalInput,
  monthIndex,
  rpcMessage,
  errorMessage,
  STATUS_LABEL,
  STATUS_COLOR,
  TargetSummary,
  TargetStatus,
  RegistrationWindow,
  RpcResult,
} from "@/lib/services/quotaService";
import { groupBy } from "@/utils/groupBy";
import FillBar from "@/components/quota/FillBar";

type Filter = "all" | "open" | "scheduled" | "closed" | "inactive";

const FILTERS: Filter[] = ["all", "open", "scheduled", "closed", "inactive"];
const DAY_MS = 86_400_000;

const filterKey = (s: TargetStatus): Filter => (s === "full" ? "open" : s);

/** The window that has not started yet (the one a "scheduled" status refers to). */
const nextWindowOf = (windows: RegistrationWindow[] | null) => {
  const now = Date.now();
  return (
    (windows ?? [])
      .filter((w) => new Date(w.opens_at).getTime() > now)
      .sort((a, b) => a.opens_at.localeCompare(b.opens_at))[0] ?? null
  );
};

function TargetRow({
  target: t,
  onChanged,
}: {
  target: TargetSummary;
  onChanged: (text: string, ok: boolean) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<RegistrationWindow[] | null>(null);

  const [opens, setOpens] = useState(() => toLocalInput(new Date()));
  const [closes, setCloses] = useState(() =>
    toLocalInput(new Date(Date.now() + 14 * DAY_MS)),
  );
  const [reason, setReason] = useState("Reopened — space still available");

  // Edit-dates panel (open window: only the closing time can move)
  const [editOpens, setEditOpens] = useState("");
  const [editCloses, setEditCloses] = useState("");

  const loadHistory = useCallback(async () => {
    try {
      setHistory(await fetchWindowHistory(t.target_id));
    } catch (e) {
      console.error("Error loading window history:", e);
      setHistory([]);
    }
  }, [t.target_id]);

  // A scheduled row needs its upcoming window's id for Edit / Cancel
  useEffect(() => {
    if (t.status === "scheduled" && history === null) loadHistory();
  }, [t.status, history, loadHistory]);

  const nextWindow = useMemo(() => nextWindowOf(history), [history]);
  const editableWindowId =
    t.status === "open" || t.status === "full"
      ? t.current_window_id
      : t.status === "scheduled"
        ? (nextWindow?.id ?? null)
        : null;

  const now = new Date();
  const registrationMonthPassed =
    t.planting_year != null &&
    t.planting_month != null &&
    monthIndex(t.planting_year, t.planting_month) <
      monthIndex(now.getFullYear(), now.getMonth() + 1);

  const run = async (action: () => Promise<RpcResult>, okText: string) => {
    setBusy(true);
    try {
      const result = await action();
      const ok = result.status === "success";
      if (ok) {
        setShowCustom(false);
        setShowEdit(false);
        setHistory(null);
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
    if (!showHistory && history === null) loadHistory();
    setShowHistory((v) => !v);
  };

  const openEdit = () => {
    const w =
      t.status === "scheduled"
        ? nextWindow
        : { opens_at: t.window_opens_at!, closes_at: t.window_closes_at! };
    if (!w) return;
    setEditOpens(toLocalInput(new Date(w.opens_at)));
    setEditCloses(
      toLocalInput(
        t.status === "scheduled"
          ? new Date(w.closes_at)
          : new Date(new Date(w.closes_at).getTime() + 7 * DAY_MS),
      ),
    );
    setShowEdit((v) => !v);
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
      `${t.crop_name} · ${t.harvest_label}: registration window opened`,
    );
  };

  const handleSaveEdit = () => {
    const o = new Date(editOpens);
    const c = new Date(editCloses);
    if (
      !editableWindowId ||
      Number.isNaN(o.getTime()) ||
      Number.isNaN(c.getTime())
    ) {
      onChanged("Set both dates.", false);
      return;
    }
    run(
      () => updateWindow(editableWindowId, o, c),
      `${t.crop_name} · ${t.harvest_label}: window dates updated`,
    );
  };

  const handleCancelWindow = () => {
    if (!editableWindowId) return;
    if (
      !window.confirm(
        `Cancel the scheduled registration window for ${t.crop_name} (${t.harvest_label} harvest)?`,
      )
    ) {
      return;
    }
    run(
      () => cancelWindow(editableWindowId),
      `${t.crop_name} · ${t.harvest_label}: scheduled window cancelled`,
    );
  };

  const handleToggleActive = () => {
    if (
      t.is_active &&
      !window.confirm(
        `Deactivate ${t.crop_name} (${t.harvest_label} harvest)? Farmers will no longer see it and its registration window will close.`,
      )
    ) {
      return;
    }
    run(
      () => setTargetActive(t.target_id, !t.is_active),
      `${t.crop_name} · ${t.harvest_label}: ${t.is_active ? "deactivated" : "activated"}`,
    );
  };

  const isOpen = t.status === "open" || t.status === "full";

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
              {cropLabel(t.crop_name)} · harvest {t.harvest_label}
            </Text>
            <Badge colorPalette={STATUS_COLOR[t.status]} variant="solid">
              {STATUS_LABEL[t.status]}
            </Badge>
          </HStack>
          <Text fontSize="sm" color="gray.600">
            Registration month {t.registration_label ?? "—"} · fair Rs.{" "}
            {t.target_fair_price ?? "—"}/kg
          </Text>
        </Box>

        <Box textAlign="right" fontSize="sm">
          {isOpen && (
            <Text color="green.700">
              Open until <b>{formatDateTime(t.window_closes_at)}</b>
            </Text>
          )}
          {t.status === "scheduled" && (
            <Text color="blue.700">
              Opens {formatDateTime(t.next_opens_at)}
            </Text>
          )}
          {t.status === "closed" && registrationMonthPassed && (
            <Text color="gray.500">Registration month has passed</Text>
          )}
        </Box>
      </Flex>

      <Box mt={3}>
        <FillBar ratio={t.fill_ratio} h="8px" />
        <Text fontSize="sm" color="gray.600" mt={1}>
          {t.filled_mt} / {t.target_limit_mt} MT registered ·{" "}
          <b>{t.remaining_mt} MT left</b> · {t.farmer_count} farmers
          {t.filled_ha != null && t.allowed_extent_ha != null && (
            <>
              {" "}
              · ≈ {t.filled_ha} / {t.allowed_extent_ha} ha
            </>
          )}
        </Text>
      </Box>

      <HStack mt={4} gap={2} wrap="wrap">
        {isOpen && (
          <>
            <Button
              size="sm"
              colorPalette="orange"
              variant="outline"
              disabled={busy}
              onClick={() =>
                run(
                  () => closeRegistration(t.target_id),
                  `${t.crop_name} · ${t.harvest_label}: registration closed`,
                )
              }
            >
              <DoorClosed size={14} /> Close now
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busy || !editableWindowId}
              onClick={openEdit}
            >
              <CalendarPlus size={14} /> Extend / edit dates
            </Button>
          </>
        )}

        {t.status === "scheduled" && (
          <>
            <Button
              size="sm"
              colorPalette="blue"
              variant="outline"
              disabled={busy || !editableWindowId}
              onClick={openEdit}
            >
              <CalendarPlus size={14} /> Edit dates
            </Button>
            <Button
              size="sm"
              colorPalette="red"
              variant="outline"
              disabled={busy || !editableWindowId}
              onClick={handleCancelWindow}
            >
              <CalendarX size={14} /> Cancel window
            </Button>
          </>
        )}

        {t.status === "closed" && (
          <>
            {!registrationMonthPassed && t.planting_month != null && (
              <Button
                size="sm"
                colorPalette="green"
                disabled={busy}
                onClick={() =>
                  run(
                    () => openPlantingMonth(t.target_id),
                    `${t.crop_name} · ${t.harvest_label}: opened for ${t.registration_label}`,
                  )
                }
              >
                <DoorOpen size={14} /> Open registration month
              </Button>
            )}
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
        )}

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

      {showCustom && t.status === "closed" && (
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

      {showEdit && editableWindowId && (
        <Box mt={4} p={4} bg="gray.50" borderRadius="lg">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
            <Box>
              <Text fontSize="xs" mb={1}>
                Opens{isOpen ? " (fixed — already open)" : ""}
              </Text>
              <Input
                type="datetime-local"
                size="sm"
                bg="white"
                value={editOpens}
                disabled={isOpen}
                onChange={(e) => setEditOpens(e.target.value)}
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
                value={editCloses}
                onChange={(e) => setEditCloses(e.target.value)}
              />
            </Box>
          </SimpleGrid>
          <Button
            mt={3}
            size="sm"
            colorPalette="blue"
            disabled={busy}
            onClick={handleSaveEdit}
          >
            Save dates
          </Button>
        </Box>
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
  const [rows, setRows] = useState<TargetSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  // Reloads keep the list on screen so open panels in each row aren't lost
  const load = useCallback(async () => {
    try {
      setRows(await fetchTargetSummary(true));
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

  // One section per crop; inside it one row per harvest month, earliest first,
  // so CARROT Feb / Mar / Apr 2027 appear as consecutive rows.
  const groups = useMemo(() => {
    const visible = rows
      .filter((t) => filter === "all" || filterKey(t.status) === filter)
      .filter(
        (t) =>
          !search || t.crop_name.toLowerCase().includes(search.toLowerCase()),
      )
      .sort(
        (a, b) =>
          a.crop_name.localeCompare(b.crop_name) ||
          monthIndex(a.harvest_year, a.harvest_month) -
            monthIndex(b.harvest_year, b.harvest_month),
      );
    return Object.entries(groupBy(visible, (t) => t.crop_name));
  }, [rows, filter, search]);

  return (
    <Box bg="#F8FAFC" minH="100vh" p={{ base: 4, md: 8 }}>
      <Container maxW="5xl">
        <VStack align="start" gap={1} mb={6}>
          <Heading size="xl" color="gray.800" fontWeight="bold">
            Targets & Registration Windows
          </Heading>
          <Text color="gray.500">
            One target per crop and harvest month. Open, close, edit or cancel
            each target&apos;s registration window.
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
        ) : groups.length === 0 ? (
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
          <VStack align="stretch" gap={6}>
            {groups.map(([crop, targets]) => (
              <Box key={crop}>
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color="gray.500"
                  textTransform="uppercase"
                  mb={2}
                >
                  {cropLabel(crop)} · {targets.length} harvest month
                  {targets.length === 1 ? "" : "s"}
                </Text>
                <VStack align="stretch" gap={3}>
                  {targets.map((t) => (
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
              </Box>
            ))}
          </VStack>
        )}
      </Container>
    </Box>
  );
}

export default TargetsManager;
