"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  NativeSelect,
  Container,
  Input,
  Spinner,
  SimpleGrid,
  Separator,
  Stack,
  Checkbox,
} from "@chakra-ui/react";
import {
  Sparkles,
  Calendar,
  Wheat,
  Info,
  CheckCircle2,
  DoorOpen,
  ListChecks,
  AlertTriangle,
} from "lucide-react";
import {
  fetchAdvisoryQuota,
  applyNationalTarget,
  fetchDieselPrice,
  fetchCropCycles,
  harvestFromRegistration,
  registrationMonthWindow,
  monthIndex,
  parseYearMonth,
  ym,
  toLocalInput,
  formatDateTime,
  monthName,
  rpcMessage,
  cropLabel,
  errorMessage,
  AdvisoryData,
  SUPPORTED_CROPS,
  RAINFALL_NORMALS,
  DEFAULT_DIESEL_PRICE,
  CROP_CYCLE_FALLBACK,
} from "@/lib/services/quotaService";
import ForecastGenerator from "@/components/Admin/ForecastGenerator";

const TargetCard = ({
  children,
  title,
  icon: IconComponent,
}: {
  children: React.ReactNode;
  title: string;
  icon?: any;
}) => (
  <Box
    bg="white"
    borderRadius="xl"
    border="1px solid"
    borderColor="gray.100"
    overflow="hidden"
    w="full"
    mb={6}
    boxShadow="sm"
  >
    <Box px={6} py={4} borderBottom="1px solid" borderColor="gray.50">
      <HStack gap={3}>
        {IconComponent && <IconComponent size={18} color="#2B6CB0" />}
        <Heading size="sm" fontWeight="bold" color="gray.800">
          {title}
        </Heading>
      </HStack>
    </Box>
    <Box p={6}>{children}</Box>
  </Box>
);

const Badge = ({ children, colorPalette = "blue", ...props }: any) => (
  <Box
    bg={`${colorPalette}.600`}
    color="white"
    px={3}
    py={1}
    borderRadius="full"
    fontSize="xs"
    fontWeight="bold"
    display="inline-flex"
    alignItems="center"
    {...props}
  >
    {children}
  </Box>
);

const CheckOption = ({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) => (
  <Checkbox.Root
    checked={checked}
    onCheckedChange={(e) => onChange(e.checked === true)}
    colorPalette="green"
    size="sm"
  >
    <Checkbox.HiddenInput />
    <Checkbox.Control />
    <Checkbox.Label>{label}</Checkbox.Label>
  </Checkbox.Root>
);

const DAY_MS = 86_400_000;

function AITargets() {
  const now = new Date();
  const [crop, setCrop] = useState("CARROT");
  // The admin picks the REGISTRATION month (R2/R4); harvest is derived below.
  const [regYear, setRegYear] = useState(() => now.getFullYear());
  const [regMonth, setRegMonth] = useState(() => now.getMonth() + 1);
  const [cycles, setCycles] =
    useState<Record<string, number>>(CROP_CYCLE_FALLBACK);
  const [dieselPrice, setDieselPrice] = useState(DEFAULT_DIESEL_PRICE);
  const [rainfall, setRainfall] = useState<number>(0);
  const [rainfallEdited, setRainfallEdited] = useState(false);

  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [apiResponse, setApiResponse] = useState<AdvisoryData | null>(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  // Target saved, but the registration window could not be opened
  const [windowWarning, setWindowWarning] = useState("");

  // Farmer registration window for the target being published
  const [openWindow, setOpenWindow] = useState(true);
  const [opensAt, setOpensAt] = useState("");
  const [closesAt, setClosesAt] = useState("");
  const [notifyFarmers, setNotifyFarmers] = useState(true);

  const cycle = cycles[crop] ?? 3;
  const harvest = harvestFromRegistration(regYear, regMonth, cycle);
  const isPast =
    monthIndex(regYear, regMonth) <
    monthIndex(now.getFullYear(), now.getMonth() + 1);

  useEffect(() => {
    fetchDieselPrice()
      .then(setDieselPrice)
      .catch(() => {});
    fetchCropCycles()
      .then(setCycles)
      .catch(() => {}); // keep the model mirror
  }, []);

  // The model's weather input is for the harvest month, so the default follows it.
  useEffect(() => {
    if (!rainfallEdited) setRainfall(RAINFALL_NORMALS[harvest.month]);
  }, [harvest.month, rainfallEdited]);

  const clearMessages = () => {
    setError("");
    setSuccessMsg("");
    setWindowWarning("");
  };

  const handleAskAI = async () => {
    if (isPast) {
      setError("This registration month has passed — pick this month or later.");
      return;
    }
    setLoading(true);
    clearMessages();
    setApiResponse(null);

    try {
      // The engine takes the REGISTRATION month and adds the cycle itself.
      const data = await fetchAdvisoryQuota({
        crop,
        year: regYear,
        month: regMonth,
        rainfall,
        dieselPrice,
      });

      // Cross-check: the model's cycle must match crop_lifecycle (B9),
      // otherwise the target would be filed under the wrong harvest month (B1).
      const apiHarvest = parseYearMonth(data.Target_Harvest_Date);
      if (
        apiHarvest &&
        (apiHarvest.year !== harvest.year || apiHarvest.month !== harvest.month)
      ) {
        throw new Error(
          `AI engine returned harvest ${data.Target_Harvest_Date} but the ${cycle}-month cycle for ${crop} gives ${ym(harvest.year, harvest.month)}. Update crop_lifecycle to match the model before publishing.`,
        );
      }

      setApiResponse(data);

      // Default window = the registration month the admin chose (B2), not the API date.
      const w = registrationMonthWindow(regYear, regMonth);
      setOpensAt(toLocalInput(w?.opensAt ?? now));
      setClosesAt(
        toLocalInput(w?.closesAt ?? new Date(now.getTime() + 30 * DAY_MS)),
      );
    } catch (err) {
      setError(errorMessage(err, "Failed to connect to AI advisory service."));
    } finally {
      setLoading(false);
    }
  };

  const handleApplyTarget = async () => {
    if (!apiResponse) {
      setError("Please generate an AI target first.");
      return;
    }

    let regWindow: { opensAt: Date; closesAt: Date } | null = null;
    if (openWindow) {
      const opens = new Date(opensAt);
      const closes = new Date(closesAt);
      if (Number.isNaN(opens.getTime()) || Number.isNaN(closes.getTime())) {
        setError("Set both registration dates.");
        return;
      }
      if (closes <= opens) {
        setError("Registration must close after it opens.");
        return;
      }
      if (closes <= new Date()) {
        setError("Closing date is already in the past.");
        return;
      }
      regWindow = { opensAt: opens, closesAt: closes };
    }

    setApplying(true);
    clearMessages();

    try {
      const { windowResult } = await applyNationalTarget(
        crop,
        harvest,
        apiResponse,
        {
          rainfall,
          dieselPrice,
          window: regWindow
            ? {
                ...regWindow,
                reason: `Registration month ${ym(regYear, regMonth)}`,
              }
            : null,
          notifyFarmers,
        },
      );

      const locked = `Published ${crop} target for the ${monthName(harvest.year, harvest.month)} harvest (registration month ${monthName(regYear, regMonth)}).`;

      if (!regWindow) {
        setSuccessMsg(
          `${locked} Registration is closed — open it from Targets & Windows when ready.`,
        );
      } else if (windowResult?.status === "success") {
        setSuccessMsg(
          `${locked} Registration open ${formatDateTime(regWindow.opensAt.toISOString())} → ${formatDateTime(regWindow.closesAt.toISOString())}.`,
        );
      } else {
        setSuccessMsg(locked);
        setWindowWarning(
          `Registration window NOT opened: ${rpcMessage(windowResult) || "unknown error"} Open it from Targets & Windows.`,
        );
      }
    } catch (err) {
      console.error("Apply target error:", err);
      setError(
        errorMessage(err, "Failed to update national system targets."),
      );
    } finally {
      setApplying(false);
    }
  };

  const messages = (
    <>
      {error && (
        <Box
          mt={4}
          p={3}
          bg="red.50"
          color="red.700"
          borderRadius="md"
          fontSize="sm"
          w="full"
        >
          <HStack align="start">
            <Box flexShrink={0} mt="2px">
              <Info size={16} />
            </Box>
            <Text>{error}</Text>
          </HStack>
        </Box>
      )}

      {successMsg && (
        <Box
          mt={4}
          p={3}
          bg="green.50"
          color="green.700"
          borderRadius="md"
          fontSize="sm"
          w="full"
        >
          <HStack align="start">
            <Box flexShrink={0} mt="2px">
              <CheckCircle2 size={16} />
            </Box>
            <Text>{successMsg}</Text>
          </HStack>
        </Box>
      )}

      {windowWarning && (
        <Box
          mt={4}
          p={3}
          bg="orange.50"
          color="orange.800"
          borderRadius="md"
          fontSize="sm"
          w="full"
        >
          <HStack align="start">
            <Box flexShrink={0} mt="2px">
              <AlertTriangle size={16} />
            </Box>
            <Text>{windowWarning}</Text>
          </HStack>
        </Box>
      )}
    </>
  );

  return (
    <Box bg="#F8FAFC" minH="100vh" p={{ base: 4, md: 8 }}>
      <Container maxW="4xl">
        <HStack justify="space-between" align="start" mb={8} wrap="wrap" gap={3}>
          <VStack align="start" gap={1}>
            <Heading size="xl" color="gray.800" fontWeight="bold">
              National Agricultural Quota Engine
            </Heading>
            <Text color="gray.500">
              Regulate seasonal planting volumes to prevent post-harvest price
              collapse.
            </Text>
          </VStack>

          <Button asChild variant="outline" colorPalette="blue">
            <Link href="/admin/targets">
              <ListChecks size={16} /> Targets & Windows
            </Link>
          </Button>
        </HStack>

        <TargetCard title="Registration Parameters" icon={Wheat}>
          <VStack gap={6} align="stretch">
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={5}>
              <Stack gap={2}>
                <Text fontSize="sm" fontWeight="bold" color="gray.700">
                  Target Vegetable
                </Text>
                <NativeSelect.Root variant="subtle">
                  <NativeSelect.Field
                    value={crop}
                    onChange={(e) => setCrop(e.currentTarget.value)}
                    bg="gray.50"
                    h="45px"
                  >
                    {SUPPORTED_CROPS.map((c) => (
                      <option key={c} value={c}>
                        {cropLabel(c)}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Stack>

              <Stack gap={2}>
                <Text fontSize="sm" fontWeight="bold" color="gray.700">
                  Registration Year
                </Text>
                <Input
                  type="number"
                  value={regYear}
                  onChange={(e) => setRegYear(Number(e.target.value))}
                  bg="gray.50"
                  h="45px"
                />
              </Stack>

              <Stack gap={2}>
                <Text fontSize="sm" fontWeight="bold" color="gray.700">
                  Registration Month
                </Text>
                <NativeSelect.Root variant="subtle">
                  <NativeSelect.Field
                    value={regMonth}
                    onChange={(e) => setRegMonth(Number(e.currentTarget.value))}
                    bg="gray.50"
                    h="45px"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString("en-US", {
                          month: "long",
                        })}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Stack>
            </SimpleGrid>

            <Text fontSize="sm" color={isPast ? "red.600" : "gray.600"}>
              {isPast
                ? "This registration month has passed — pick this month or later."
                : `Farmers register in ${monthName(regYear, regMonth)} → ${cropLabel(crop)} harvest ${monthName(harvest.year, harvest.month)} (${cycle}-month cycle)`}
            </Text>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
              <Stack gap={2}>
                <Text fontSize="sm" fontWeight="bold" color="gray.700">
                  National Diesel Price (LKR)
                </Text>
                <Input
                  type="number"
                  value={dieselPrice}
                  onChange={(e) => setDieselPrice(Number(e.target.value))}
                  bg="gray.50"
                  h="45px"
                />
              </Stack>

              <Stack gap={2}>
                <Text fontSize="sm" fontWeight="bold" color="gray.700">
                  Expected Rainfall at Harvest (mm)
                </Text>
                <Input
                  type="number"
                  value={rainfall}
                  onChange={(e) => {
                    setRainfallEdited(true);
                    setRainfall(Number(e.target.value));
                  }}
                  bg="gray.50"
                  h="45px"
                />
                <Text fontSize="xs" color="gray.500">
                  Defaults to the {monthName(harvest.year, harvest.month)}{" "}
                  normal ({RAINFALL_NORMALS[harvest.month]} mm).
                </Text>
              </Stack>
            </SimpleGrid>

            <Button
              w="full"
              bg="blue.600"
              color="white"
              h="50px"
              _hover={{ bg: "blue.700" }}
              onClick={handleAskAI}
              loading={loading}
              disabled={loading || isPast}
              gap={2}
            >
              {loading ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <Sparkles size={18} /> Solve Economic Quota
                </>
              )}
            </Button>
          </VStack>

          {/* Once results are showing, messages move next to the Publish button */}
          {!apiResponse && messages}
        </TargetCard>

        {apiResponse && (
          <TargetCard title="Agro-Economic Advisory Results" icon={Sparkles}>
            <VStack gap={6} py={2}>
              <HStack
                w="full"
                justify="space-between"
                p={4}
                bg="gray.50"
                borderRadius="xl"
                border="1px dashed"
                borderColor="gray.200"
              >
                <VStack align="start" gap={0}>
                  <Text fontSize="xs" color="gray.500" fontWeight="semibold">
                    REGISTRATION WINDOW
                  </Text>
                  <Text fontSize="md" fontWeight="bold" color="gray.800">
                    {monthName(regYear, regMonth)}
                  </Text>
                </VStack>

                <Badge colorPalette="purple">{cycle}-month cycle</Badge>

                <VStack align="end" gap={0}>
                  <Text fontSize="xs" color="gray.500" fontWeight="semibold">
                    TARGET MARKET HARVEST
                  </Text>
                  <Text fontSize="md" fontWeight="bold" color="blue.600">
                    {monthName(harvest.year, harvest.month)}
                  </Text>
                </VStack>
              </HStack>

              <VStack gap={1} my={2}>
                <Text
                  fontSize="5xl"
                  fontWeight="black"
                  color="gray.800"
                  lineHeight="1"
                >
                  {apiResponse.Required_Harvest_MT?.toLocaleString()} MT
                </Text>
                <Badge colorPalette="blue" size="lg" borderRadius="full">
                  National Supply Cap
                </Badge>
              </VStack>

              <HStack
                gap={10}
                justify="center"
                w="full"
                bg="blue.50"
                p={5}
                borderRadius="2xl"
              >
                <VStack gap={0} flex={1}>
                  <Text
                    fontSize="xs"
                    color="blue.700"
                    fontWeight="bold"
                    textTransform="uppercase"
                  >
                    Allowed Land Allocation
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="blue.900">
                    {apiResponse.Allowed_Extent_Ha} Hectares
                  </Text>
                </VStack>
                <Separator
                  orientation="vertical"
                  height="35px"
                  borderColor="blue.200"
                />
                <VStack gap={0} flex={1}>
                  <Text
                    fontSize="xs"
                    color="blue.700"
                    fontWeight="bold"
                    textTransform="uppercase"
                  >
                    Market Equilibrium
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="blue.900">
                    Protected Status
                  </Text>
                </VStack>
              </HStack>

              <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} w="full">
                <Box
                  p={4}
                  border="1px solid"
                  borderColor="gray.100"
                  borderRadius="xl"
                >
                  <Text fontSize="xs" color="gray.500" mb={1}>
                    Farmer Fair Floor (+40%)
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="green.600">
                    LKR {apiResponse.Calculated_Fair_Price} /kg
                  </Text>
                </Box>

                <Box
                  p={4}
                  border="1px solid"
                  borderColor="gray.100"
                  borderRadius="xl"
                >
                  <Text fontSize="xs" color="gray.500" mb={1}>
                    Expected Wholesale
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="blue.600">
                    LKR {apiResponse.Estimated_Wholesale_Price} /kg
                  </Text>
                </Box>

                <Box
                  p={4}
                  border="1px solid"
                  borderColor="gray.100"
                  borderRadius="xl"
                >
                  <Text fontSize="xs" color="gray.500" mb={1}>
                    Expected Retail
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="orange.600">
                    LKR {apiResponse.Estimated_Consumer_Price} /kg
                  </Text>
                </Box>
              </SimpleGrid>

              {/* Farmer registration window opened together with the target */}
              <Box
                w="full"
                p={5}
                borderRadius="xl"
                border="1px solid"
                borderColor="green.200"
                bg="green.50"
              >
                <HStack mb={3}>
                  <DoorOpen size={18} color="#2F855A" />
                  <Text fontWeight="bold" color="gray.800">
                    Farmer registration window
                  </Text>
                </HStack>

                <VStack align="stretch" gap={3}>
                  <CheckOption
                    checked={openWindow}
                    onChange={setOpenWindow}
                    label="Open farmer registration when publishing"
                  />

                  {openWindow && (
                    <>
                      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                        <Stack gap={1}>
                          <Text fontSize="sm" fontWeight="semibold">
                            Opens
                          </Text>
                          <Input
                            type="datetime-local"
                            value={opensAt}
                            onChange={(e) => setOpensAt(e.target.value)}
                            bg="white"
                          />
                        </Stack>
                        <Stack gap={1}>
                          <Text fontSize="sm" fontWeight="semibold">
                            Closes
                          </Text>
                          <Input
                            type="datetime-local"
                            value={closesAt}
                            onChange={(e) => setClosesAt(e.target.value)}
                            bg="white"
                          />
                        </Stack>
                      </SimpleGrid>

                      <Text fontSize="xs" color="gray.600">
                        Default: the whole registration month (
                        {monthName(regYear, regMonth)}, Sri Lanka time), or from
                        now if it has already started. Farmers can register only
                        between these times. Edit, extend or cancel it later from
                        Targets & Windows.
                      </Text>

                      <CheckOption
                        checked={notifyFarmers}
                        onChange={setNotifyFarmers}
                        label="Post a notification to all farmers"
                      />
                    </>
                  )}
                </VStack>
              </Box>

              <Button
                w="full"
                bg="green.600"
                _hover={{ bg: "green.700" }}
                color="white"
                size="lg"
                h="52px"
                gap={3}
                fontWeight="bold"
                onClick={handleApplyTarget}
                loading={applying}
                disabled={applying}
              >
                Publish & Enforce National Target <Calendar size={18} />
              </Button>
            </VStack>

            {messages}
          </TargetCard>
        )}

        <ForecastGenerator />
      </Container>
    </Box>
  );
}

export default AITargets;
