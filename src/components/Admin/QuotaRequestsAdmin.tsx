"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
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
  Spinner,
  Textarea,
  SimpleGrid,
  Checkbox,
} from "@chakra-ui/react";
import { Check, X, RefreshCw } from "lucide-react";
import { createClient } from "@/utils/supabase/createClient";
import {
  adminFetchQuotaRequests,
  adminReviewQuotaRequest,
  monthName,
  formatDateTime,
  rpcMessage,
  errorMessage,
  QuotaRequest,
  QuotaRequestStatus,
} from "@/lib/services/quotaService";

type Tab = QuotaRequestStatus | "all";

const TABS: Tab[] = ["pending", "approved", "rejected", "withdrawn", "all"];

const STATUS_COLORS: Record<string, string> = {
  pending: "orange",
  approved: "green",
  rejected: "red",
  withdrawn: "gray",
};

const TYPE_TEXT: Record<string, string> = {
  increase: "Increase",
  decrease: "Decrease",
  correction: "Correction",
  cancel: "Cancel registration",
};

function RequestCard({
  request: q,
  onDone,
}: {
  request: QuotaRequest;
  onDone: (text: string, ok: boolean) => void;
}) {
  const [note, setNote] = useState("");
  const [overrideCapacity, setOverrideCapacity] = useState(false);
  const [busy, setBusy] = useState(false);

  // Only requests that add MT can run into the national limit
  const growing =
    q.request_type !== "cancel" &&
    (q.requested_amount_mt ?? 0) > q.current_amount_mt;

  const decide = async (approve: boolean) => {
    if (!approve && note.trim().length < 3) {
      onDone(
        "Add a short note so the farmer knows why it was rejected.",
        false,
      );
      return;
    }

    setBusy(true);
    try {
      const result = await adminReviewQuotaRequest(
        q.id,
        approve,
        note.trim() || null,
        approve && growing && overrideCapacity,
      );
      const ok = result.status === "success";
      onDone(
        ok
          ? `Request #${q.id} ${approve ? "approved" : "rejected"}.`
          : rpcMessage(result),
        ok,
      );
    } catch (e) {
      onDone(errorMessage(e, "Action failed"), false);
    } finally {
      setBusy(false);
    }
  };

  const farmer = q.farmer;

  return (
    <Box
      p={5}
      bg="white"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.100"
      boxShadow="sm"
    >
      <Flex justify="space-between" gap={3} wrap="wrap">
        <Box>
          <HStack gap={2}>
            <Text fontWeight="bold" color="gray.800">
              #{q.id} · {q.crop_name} ·{" "}
              {monthName(q.target?.year, q.target?.month)}
            </Text>
            <Badge
              colorPalette={STATUS_COLORS[q.status] ?? "gray"}
              variant="solid"
              textTransform="capitalize"
            >
              {q.status}
            </Badge>
          </HStack>
          <Text fontSize="sm" color="gray.600">
            {[farmer?.u_name, farmer?.u_surname].filter(Boolean).join(" ") ||
              "Farmer"}
            {farmer?.u_district ? ` · ${farmer.u_district}` : ""}
            {farmer?.u_tel ? ` · ${farmer.u_tel}` : ""}
          </Text>
        </Box>
        <Text fontSize="xs" color="gray.500">
          {formatDateTime(q.created_at)}
        </Text>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={3} mt={3}>
        <Box>
          <Text fontSize="xs" color="gray.500">
            Request
          </Text>
          <Text fontWeight="semibold">
            {TYPE_TEXT[q.request_type] ?? q.request_type}
          </Text>
        </Box>
        <Box>
          <Text fontSize="xs" color="gray.500">
            Amount
          </Text>
          <Text fontWeight="semibold">
            {q.request_type === "cancel"
              ? `${q.current_amount_mt} MT → 0`
              : `${q.current_amount_mt} → ${q.requested_amount_mt} MT`}
          </Text>
        </Box>
        <Box>
          <Text fontSize="xs" color="gray.500">
            National limit
          </Text>
          <Text fontWeight="semibold">
            {q.target?.target_limit_mt ?? "—"} MT
          </Text>
        </Box>
      </SimpleGrid>

      <Box mt={3} p={3} bg="gray.50" borderRadius="md">
        <Text fontSize="sm" whiteSpace="pre-wrap">
          “{q.reason}”
        </Text>
      </Box>

      {q.status === "pending" ? (
        <VStack align="stretch" mt={3} gap={2}>
          <Textarea
            size="sm"
            rows={2}
            placeholder="Note to the farmer (required when rejecting)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          {growing && (
            <Checkbox.Root
              checked={overrideCapacity}
              onCheckedChange={(e) => setOverrideCapacity(e.checked === true)}
              colorPalette="orange"
              size="sm"
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>
                Override capacity (approve even if the national limit is
                exceeded)
              </Checkbox.Label>
            </Checkbox.Root>
          )}

          <HStack justify="flex-end">
            <Button
              size="sm"
              colorPalette="red"
              variant="outline"
              disabled={busy}
              onClick={() => decide(false)}
            >
              <X size={14} /> Reject
            </Button>
            <Button
              size="sm"
              colorPalette="green"
              disabled={busy}
              onClick={() => decide(true)}
            >
              <Check size={14} /> Approve & apply
            </Button>
          </HStack>
        </VStack>
      ) : q.admin_note ? (
        <Text mt={3} fontSize="sm" color="blue.800" whiteSpace="pre-wrap">
          <b>Admin note:</b> {q.admin_note} ({formatDateTime(q.reviewed_at)})
        </Text>
      ) : null}
    </Box>
  );
}

function QuotaRequestsAdmin() {
  const [tab, setTab] = useState<Tab>("pending");
  const [rows, setRows] = useState<QuotaRequest[]>([]);
  // Which tab `rows` belongs to; the spinner shows only while a tab's first load is pending
  const [loadedTab, setLoadedTab] = useState<Tab | null>(null);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  // Only the newest request may update the list (tabs can be switched mid-load)
  const requestSeq = useRef(0);

  const load = useCallback(async () => {
    const seq = ++requestSeq.current;
    try {
      const data = await adminFetchQuotaRequests(tab);
      if (seq !== requestSeq.current) return;
      setRows(data);
    } catch (e) {
      if (seq !== requestSeq.current) return;
      console.error("Error loading quota requests:", e);
      setRows([]);
      setMsg({
        text: errorMessage(e, "Could not load quota requests."),
        ok: false,
      });
    } finally {
      if (seq === requestSeq.current) setLoadedTab(tab);
    }
  }, [tab]);

  useEffect(() => {
    load();
  }, [load]);

  // Live: new requests and withdrawals appear without refreshing. Background
  // reloads keep the cards mounted so a note the admin is typing isn't lost.
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("admin-quota-requests")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "quota_change_requests" },
        () => load(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  const loading = loadedTab !== tab;

  return (
    <Box bg="#F8FAFC" minH="100vh" p={{ base: 4, md: 8 }}>
      <Container maxW="4xl">
        <VStack align="start" gap={1} mb={6}>
          <Heading size="xl" color="gray.800" fontWeight="bold">
            Quota Change Requests
          </Heading>
          <Text color="gray.500">
            Approving applies the change to the farmer&apos;s registration
            immediately.
          </Text>
        </VStack>

        <HStack mb={4} gap={2} wrap="wrap">
          {TABS.map((t) => (
            <Button
              key={t}
              size="sm"
              borderRadius="full"
              colorPalette={tab === t ? "blue" : "gray"}
              variant={tab === t ? "solid" : "outline"}
              textTransform="capitalize"
              onClick={() => setTab(t)}
            >
              {t}
            </Button>
          ))}
          <Button
            size="sm"
            variant="ghost"
            onClick={load}
            aria-label="Refresh requests"
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
        ) : rows.length === 0 ? (
          <Box
            p={10}
            bg="white"
            borderRadius="xl"
            border="1px dashed"
            borderColor="gray.300"
            textAlign="center"
          >
            <Text color="gray.500">No requests here.</Text>
          </Box>
        ) : (
          <VStack align="stretch" gap={4}>
            {rows.map((q) => (
              <RequestCard
                key={q.id}
                request={q}
                onDone={(text, ok) => {
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

export default QuotaRequestsAdmin;
