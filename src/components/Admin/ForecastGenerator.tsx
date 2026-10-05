"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  SimpleGrid,
} from "@chakra-ui/react";
import { LineChart } from "lucide-react";
import {
  SUPPORTED_CROPS,
  RAINFALL_NORMALS,
  DEFAULT_DIESEL_PRICE,
  fetchAdvisoryQuota,
  fetchDieselPrice,
  saveForecast,
  updateDieselPrice,
  errorMessage,
} from "@/lib/services/quotaService";

// The AI engine runs on a small shared instance — keep parallel calls low
const CONCURRENCY = 3;
const MAX_MONTHS = 24;

function ForecastGenerator() {
  const [startYear, setStartYear] = useState(() => new Date().getFullYear());
  const [startMonth, setStartMonth] = useState(
    () => new Date().getMonth() + 1,
  );
  const [months, setMonths] = useState(12);
  const [diesel, setDiesel] = useState(DEFAULT_DIESEL_PRICE);

  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(0);
  const [runTotal, setRunTotal] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [inputError, setInputError] = useState("");
  const stopRef = useRef(false);

  useEffect(() => {
    fetchDieselPrice()
      .then(setDiesel)
      .catch(() => {});

    // Stop the queue if the admin leaves the page mid-run
    return () => {
      stopRef.current = true;
    };
  }, []);

  const inputsValid =
    Number.isInteger(startYear) &&
    startYear >= 2000 &&
    Number.isInteger(startMonth) &&
    startMonth >= 1 &&
    startMonth <= 12 &&
    Number.isInteger(months) &&
    months >= 1 &&
    months <= MAX_MONTHS &&
    diesel > 0;

  const total = inputsValid ? SUPPORTED_CROPS.length * months : 0;

  const buildJobs = () => {
    const jobs: { crop: string; year: number; month: number }[] = [];
    for (const crop of SUPPORTED_CROPS) {
      let y = startYear;
      let m = startMonth;
      for (let i = 0; i < months; i++) {
        jobs.push({ crop, year: y, month: m });
        m += 1;
        if (m > 12) {
          m = 1;
          y += 1;
        }
      }
    }
    return jobs;
  };

  const handleRun = async () => {
    if (!inputsValid) {
      setInputError(
        `Check the inputs: month 1–12, 1–${MAX_MONTHS} months and a diesel price above 0.`,
      );
      return;
    }

    const jobs = buildJobs();
    stopRef.current = false;
    setInputError("");
    setRunning(true);
    setDone(0);
    setRunTotal(jobs.length);
    setErrors([]);

    // Remember the price for next time (AI Targets reads it as its default)
    try {
      await updateDieselPrice(diesel);
    } catch (e) {
      console.warn("Diesel price not saved:", e);
    }

    let next = 0;
    const worker = async () => {
      while (next < jobs.length && !stopRef.current) {
        const job = jobs[next++];
        const rainfall = RAINFALL_NORMALS[job.month];
        try {
          const advisory = await fetchAdvisoryQuota({
            crop: job.crop,
            year: job.year,
            month: job.month,
            rainfall,
            dieselPrice: diesel,
          });
          await saveForecast(
            job.crop,
            advisory,
            rainfall,
            diesel,
            "bulk_generator",
          );
        } catch (e) {
          const label = `${job.crop} ${job.year}-${String(job.month).padStart(2, "0")}`;
          setErrors((prev) => [...prev, `${label}: ${errorMessage(e, "failed")}`]);
        } finally {
          setDone((d) => d + 1);
        }
      }
    };

    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    setRunning(false);
  };

  const pct = runTotal ? Math.round((done / runTotal) * 100) : 0;
  const stopped = !running && runTotal > 0 && done < runTotal;

  return (
    <Box
      bg="white"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.100"
      p={6}
      mb={6}
      boxShadow="sm"
    >
      <HStack mb={2} gap={3}>
        <LineChart size={18} color="#2B6CB0" />
        <Heading size="sm" fontWeight="bold" color="gray.800">
          Price Forecast Generator
        </Heading>
      </HStack>
      <Text fontSize="sm" color="gray.500" mb={4}>
        Runs the AI engine for every crop and planting month and saves the
        results for the farmer price screens. Uses monthly normal rainfall.
        This does <b>not</b> change any national target.
      </Text>

      <SimpleGrid columns={{ base: 2, md: 4 }} gap={3} mb={4}>
        <Box>
          <Text fontSize="xs" mb={1}>
            Start year
          </Text>
          <Input
            type="number"
            value={startYear}
            onChange={(e) => setStartYear(Number(e.target.value))}
            bg="gray.50"
            disabled={running}
          />
        </Box>
        <Box>
          <Text fontSize="xs" mb={1}>
            Start month
          </Text>
          <Input
            type="number"
            min={1}
            max={12}
            value={startMonth}
            onChange={(e) => setStartMonth(Number(e.target.value))}
            bg="gray.50"
            disabled={running}
          />
        </Box>
        <Box>
          <Text fontSize="xs" mb={1}>
            Months
          </Text>
          <Input
            type="number"
            min={1}
            max={MAX_MONTHS}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            bg="gray.50"
            disabled={running}
          />
        </Box>
        <Box>
          <Text fontSize="xs" mb={1}>
            Diesel (LKR)
          </Text>
          <Input
            type="number"
            value={diesel}
            onChange={(e) => setDiesel(Number(e.target.value))}
            bg="gray.50"
            disabled={running}
          />
        </Box>
      </SimpleGrid>

      <HStack gap={3}>
        <Button
          colorPalette="blue"
          onClick={handleRun}
          loading={running}
          disabled={running}
          flex={1}
        >
          Generate {total} forecasts
        </Button>
        {running && (
          <Button
            variant="outline"
            colorPalette="red"
            onClick={() => {
              stopRef.current = true;
            }}
          >
            Stop
          </Button>
        )}
      </HStack>

      {inputError && (
        <Box mt={4} p={3} bg="red.50" borderRadius="md">
          <Text fontSize="sm" color="red.700">
            {inputError}
          </Text>
        </Box>
      )}

      {runTotal > 0 && (
        <VStack align="stretch" mt={4} gap={2}>
          <Box
            w="full"
            h="8px"
            bg="gray.100"
            borderRadius="full"
            overflow="hidden"
          >
            <Box h="full" w={`${pct}%`} bg="blue.500" transition="width .3s" />
          </Box>
          <Text fontSize="sm" color="gray.700">
            {done} / {runTotal} done
            {errors.length ? ` · ${errors.length} failed` : ""}
            {stopped ? " · stopped" : ""}
          </Text>
          {errors.slice(0, 5).map((e) => (
            <Text key={e} fontSize="xs" color="red.600">
              {e}
            </Text>
          ))}
          {errors.length > 5 && (
            <Text fontSize="xs" color="red.600">
              …and {errors.length - 5} more
            </Text>
          )}
        </VStack>
      )}
    </Box>
  );
}

export default ForecastGenerator;
