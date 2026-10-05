"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  Textarea,
  Button,
  NativeSelect,
  Spinner,
  SimpleGrid,
} from "@chakra-ui/react";
import { ClipboardPen, MessageSquare, Send, Undo2 } from "lucide-react";
import { createClient } from "@/utils/supabase/createClient";
import {
  fetchMyRegistrations,
  fetchMyQuotaRequests,
  submitQuotaRequest,
  withdrawQuotaRequest,
  MyRegistration,
  QuotaRequest,
  QuotaRequestType,
  monthName,
  formatDateTime,
  rpcMessage,
} from "@/lib/services/quotaService";

const TYPE_LABELS: Record<QuotaRequestType, string> = {
  increase: "Increase my amount",
  decrease: "Decrease my amount",
  correction: "Correct a wrong amount",
  cancel: "Cancel this registration",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "orange",
  approved: "green",
  rejected: "red",
  withdrawn: "gray",
};

const MIN_REASON_LENGTH = 10;

const Card = ({ children, ...props }: BoxProps) => (
  <Box
    bg="white"
    borderRadius="2xl"
    p={6}
    boxShadow="sm"
    border="1px solid"
    borderColor="gray.100"
    {...props}
  >
    {children}
  </Box>
);

function QuotaSupport() {
  const params = useSearchParams();
  // Set by the "Request change" links on the Registration page
  const preselect = Number(params.get("registration")) || null;

  const [registrations, setRegistrations] = useState<MyRegistration[]>([]);
  const [requests, setRequests] = useState<QuotaRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [registrationId, setRegistrationId] = useState<number | null>(
    preselect,
  );
  const [type, setType] = useState<QuotaRequestType>("increase");
  const [newAmount, setNewAmount] = useState("");
  const [reason, setReason] = useState("");
  const [sending, setSending] = useState(false);
  const [withdrawingId, setWithdrawingId] = useState<number | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const [regs, reqs] = await Promise.all([
        fetchMyRegistrations(),
        fetchMyQuotaRequests(),
      ]);
      const active = regs.filter((r) => r.status === "active");
      setRegistrations(active);
      setRequests(reqs);
      setRegistrationId((prev) =>
        prev && active.some((r) => r.id === prev)
          ? prev
          : (active[0]?.id ?? null),
      );
      setLoadError(false);
    } catch (e) {
      console.error("Error loading quota support data:", e);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Live: admin decisions appear without refreshing
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("my-quota-requests")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "quota_change_requests" },
        () => load(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  const selected = registrations.find((r) => r.id === registrationId) ?? null;
  const pendingForSelected = requests.some(
    (q) => q.registration_id === registrationId && q.status === "pending",
  );

  const handleSubmit = async () => {
    setMsg(null);

    if (!selected) {
      setMsg({ ok: false, text: "Choose a registration first." });
      return;
    }

    let amountValue: number | null = null;
    if (type !== "cancel") {
      amountValue = Number(newAmount);
      if (!newAmount || Number.isNaN(amountValue) || amountValue <= 0) {
        setMsg({ ok: false, text: "Enter the new amount in MT." });
        return;
      }
      const current = Number(selected.amount_mt);
      if (type === "increase" && amountValue <= current) {
        setMsg({
          ok: false,
          text: `To increase, the new amount must be more than ${current} MT.`,
        });
        return;
      }
      if (type === "decrease" && amountValue >= current) {
        setMsg({
          ok: false,
          text: `To decrease, the new amount must be less than ${current} MT.`,
        });
        return;
      }
      if (type === "correction" && amountValue === current) {
        setMsg({
          ok: false,
          text: "The new amount is the same as the current amount.",
        });
        return;
      }
    }

    if (reason.trim().length < MIN_REASON_LENGTH) {
      setMsg({
        ok: false,
        text: `Please explain the reason (at least ${MIN_REASON_LENGTH} characters).`,
      });
      return;
    }

    setSending(true);

    try {
      const result = await submitQuotaRequest(
        selected.id,
        type,
        amountValue,
        reason.trim(),
      );

      if (result.status === "success") {
        setMsg({
          ok: true,
          text: "Request sent. The admin team will review it and you'll see the decision here.",
        });
        setNewAmount("");
        setReason("");
        await load();
      } else {
        setMsg({ ok: false, text: rpcMessage(result) });
      }
    } catch (e) {
      console.error("Submit quota request error:", e);
      setMsg({ ok: false, text: "System Error. Check connection." });
    } finally {
      setSending(false);
    }
  };

  const handleWithdraw = async (requestId: number) => {
    setMsg(null);
    setWithdrawingId(requestId);

    try {
      const result = await withdrawQuotaRequest(requestId);
      if (result.status !== "success") {
        setMsg({ ok: false, text: rpcMessage(result) });
      }
      await load();
    } catch (e) {
      console.error("Withdraw quota request error:", e);
      setMsg({ ok: false, text: "System Error. Check connection." });
    } finally {
      setWithdrawingId(null);
    }
  };

  return (
    <Box minH="100vh" bg="#D4F2C4" py={8} px={4}>
      <Box maxW="1200px" mx="auto">
        <VStack align="start" mb={6} gap={1}>
          <Heading
            size="xl"
            color="green.800"
            display="flex"
            alignItems="center"
            gap={2}
          >
            <ClipboardPen /> Quota Support
          </Heading>
          <Text color="gray.700">
            Ask the admin team to change a registered harvest quota. For other
            problems use Contact Support.
          </Text>
        </VStack>

        {loadError && (
          <Box mb={4} p={3} bg="red.50" borderRadius="md">
            <Text fontSize="sm" color="red.700">
              Could not load your quota data. Check your connection and reload
              the page.
            </Text>
          </Box>
        )}

        <Flex
          gap={4}
          direction={{ base: "column", lg: "row" }}
          align="flex-start"
        >
          {/* Request form */}
          <Card flex={{ lg: 1.3 }} w="full">
            <Heading size="md" mb={4} color="green.700">
              New change request
            </Heading>

            {loading ? (
              <Flex justify="center" p={8}>
                <Spinner color="green.500" />
              </Flex>
            ) : registrations.length === 0 ? (
              <Text color="gray.500">
                You have no active registrations to change.
              </Text>
            ) : (
              <VStack align="stretch" gap={4}>
                <Box>
                  <Text fontWeight="bold" mb={1}>
                    Registration
                  </Text>
                  <NativeSelect.Root variant="subtle">
                    <NativeSelect.Field
                      value={registrationId ?? ""}
                      onChange={(e) => {
                        setRegistrationId(Number(e.currentTarget.value));
                        setMsg(null);
                      }}
                      bg="gray.50"
                    >
                      {registrations.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.crop_name} ·{" "}
                          {monthName(r.target?.year, r.target?.month)} harvest ·{" "}
                          {r.amount_mt} MT
                        </option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={1}>
                    What do you need?
                  </Text>
                  <NativeSelect.Root variant="subtle">
                    <NativeSelect.Field
                      value={type}
                      onChange={(e) =>
                        setType(e.currentTarget.value as QuotaRequestType)
                      }
                      bg="gray.50"
                    >
                      {(Object.keys(TYPE_LABELS) as QuotaRequestType[]).map(
                        (k) => (
                          <option key={k} value={k}>
                            {TYPE_LABELS[k]}
                          </option>
                        ),
                      )}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Box>

                {type !== "cancel" && (
                  <SimpleGrid columns={2} gap={3}>
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={1}>
                        Current amount
                      </Text>
                      <Input
                        value={selected ? `${selected.amount_mt} MT` : ""}
                        readOnly
                        bg="gray.100"
                      />
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={1}>
                        New amount (MT)
                      </Text>
                      <Input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="0.1"
                        value={newAmount}
                        onChange={(e) => setNewAmount(e.target.value)}
                        bg="gray.50"
                      />
                    </Box>
                  </SimpleGrid>
                )}

                <Box>
                  <Text fontWeight="bold" mb={1}>
                    Reason
                  </Text>
                  <Textarea
                    rows={4}
                    bg="gray.50"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. I leased 1 more acre this season / Part of my field was flooded"
                  />
                </Box>

                {pendingForSelected && (
                  <Text fontSize="sm" color="orange.700">
                    You already have a pending request for this registration.
                    Wait for a decision or withdraw it first.
                  </Text>
                )}

                <Button
                  colorPalette="green"
                  size="lg"
                  onClick={handleSubmit}
                  loading={sending}
                  disabled={sending || pendingForSelected}
                >
                  <Send size={16} /> Send request
                </Button>
              </VStack>
            )}

            {msg && (
              <Box mt={4} p={3} borderRadius="md" bg={msg.ok ? "green.50" : "red.50"}>
                <Text fontSize="sm" color={msg.ok ? "green.700" : "red.700"}>
                  {msg.text}
                </Text>
              </Box>
            )}
          </Card>

          {/* History */}
          <Card flex={{ lg: 1 }} w="full">
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md" color="green.700">
                My requests
              </Heading>
              <Badge colorPalette="green" variant="subtle">
                {requests.length} Records
              </Badge>
            </Flex>

            {loading ? (
              <Flex justify="center" p={8}>
                <Spinner color="green.500" />
              </Flex>
            ) : requests.length === 0 ? (
              <VStack
                p={8}
                bg="gray.50"
                borderRadius="xl"
                border="1px dashed"
                borderColor="gray.300"
                color="gray.500"
              >
                <MessageSquare size={32} />
                <Text>No requests yet.</Text>
              </VStack>
            ) : (
              <VStack align="stretch" gap={3} maxH="640px" overflowY="auto">
                {requests.map((q) => (
                  <Box
                    key={q.id}
                    p={3}
                    border="1px solid"
                    borderColor="gray.100"
                    borderRadius="lg"
                  >
                    <Flex justify="space-between" mb={1} gap={2}>
                      <Text fontWeight="bold">
                        {q.crop_name} ·{" "}
                        {monthName(q.target?.year, q.target?.month)}
                      </Text>
                      <Badge
                        colorPalette={STATUS_COLORS[q.status] ?? "gray"}
                        variant="solid"
                        textTransform="capitalize"
                      >
                        {q.status}
                      </Badge>
                    </Flex>

                    <Text fontSize="sm">
                      {TYPE_LABELS[q.request_type] ?? q.request_type}
                      {q.request_type !== "cancel" &&
                        `: ${q.current_amount_mt} → ${q.requested_amount_mt} MT`}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      Sent {formatDateTime(q.created_at)}
                    </Text>
                    <Text
                      fontSize="sm"
                      color="gray.700"
                      mt={1}
                      whiteSpace="pre-wrap"
                    >
                      “{q.reason}”
                    </Text>

                    {q.admin_note && (
                      <Box mt={2} p={2} bg="blue.50" borderRadius="md">
                        <Text
                          fontSize="xs"
                          color="blue.800"
                          whiteSpace="pre-wrap"
                        >
                          <b>Admin:</b> {q.admin_note}
                        </Text>
                        <Text fontSize="xs" color="blue.600">
                          {formatDateTime(q.reviewed_at)}
                        </Text>
                      </Box>
                    )}

                    {q.status === "pending" && (
                      <HStack justify="flex-end" mt={2}>
                        <Button
                          size="xs"
                          variant="ghost"
                          colorPalette="gray"
                          onClick={() => handleWithdraw(q.id)}
                          loading={withdrawingId === q.id}
                          disabled={withdrawingId !== null}
                        >
                          <Undo2 size={14} /> Withdraw
                        </Button>
                      </HStack>
                    )}
                  </Box>
                ))}
              </VStack>
            )}
          </Card>
        </Flex>
      </Box>
    </Box>
  );
}

export default QuotaSupport;
