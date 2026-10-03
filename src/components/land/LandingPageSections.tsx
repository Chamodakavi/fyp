"use client";

import React from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  HStack,
  Flex,
} from "@chakra-ui/react";
import {
  TrendingUp,
  ShieldAlert,
  Sprout,
  Store,
  Newspaper,
  MessageSquare,
  CheckCircle2,
  Quote,
} from "lucide-react";
import Link from "next/link";

// ---------------------------------------------------------
// 1. CAPABILITIES SECTION (Light with green accents)
// ---------------------------------------------------------
export const CapabilitiesSection = () => {
  const features = [
    {
      title: "Crop Price Prediction",
      desc: "ML-based forecasting to help you decide when to sell for maximum profit.",
      icon: TrendingUp,
    },
    {
      title: "Surplus Prevention",
      desc: "Real-time alerts on potential overproduction in your area.",
      icon: ShieldAlert,
    },
    {
      title: "Smart Crop Suggestions",
      desc: "Get recommendations on what to plant based on market demand.",
      icon: Sprout,
    },
    {
      title: "Marketplace Integration",
      desc: "Connect directly with buyers and eliminate middlemen exploitation.",
      icon: Store,
    },
    {
      title: "News & Diseases",
      desc: "Stay updated with agriculture news and disease outbreak alerts.",
      icon: Newspaper,
    },
    {
      title: "Chatbot Assistant",
      desc: "24/7 AI support for all your farming questions and needs.",
      icon: MessageSquare,
    },
  ];

  return (
    <Box py={{ base: 20, md: 32 }} bg="white">
      <Container maxW="container.xl">
        <VStack gap={4} textAlign="center" mb={16}>
          <Text
            color="green.500"
            fontWeight="bold"
            letterSpacing="widest"
            fontSize="sm"
            textTransform="uppercase"
          >
            Capabilities
          </Text>
          <Heading as="h2" size="2xl" color="#06150d">
            Everything You Need to Succeed
          </Heading>
          <Text color="gray.600" fontSize="lg" maxW="2xl">
            Our platform provides end-to-end solutions for modern agriculture
            challenges.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
          {features.map((feature, idx) => (
            <Box
              key={idx}
              p={8}
              bg="green.50"
              rounded="2xl"
              borderWidth="1px"
              borderColor="green.100"
              transition="all 0.3s ease"
              _hover={{
                transform: "translateY(-4px)",
                shadow: "xl",
                bg: "white",
                borderColor: "green.300",
              }}
            >
              <Flex
                w={12}
                h={12}
                align="center"
                justify="center"
                rounded="full"
                bg="green.100"
                color="green.600"
                mb={6}
              >
                <Icon as={feature.icon} boxSize={5} />
              </Flex>
              <Heading as="h3" size="md" mb={3} color="#06150d">
                {feature.title}
              </Heading>
              <Text color="gray.600" lineHeight="tall">
                {feature.desc}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

// ---------------------------------------------------------
// 2. HOW IT WORKS SECTION (Dark green theme)
// ---------------------------------------------------------
export const HowItWorksSection = () => {
  const steps = [
    {
      step: "01",
      title: "Register Your Crops",
      desc: "Input your cultivation details and expected harvest dates.",
    },
    {
      step: "02",
      title: "Get Insights",
      desc: "View price forecasts and surplus risk alerts for your area.",
    },
    {
      step: "03",
      title: "Sell Smart",
      desc: "Connect with buyers in the marketplace and maximize revenue.",
    },
  ];

  return (
    <Box py={{ base: 20, md: 32 }} bg="#06150d" color="white">
      <Container maxW="container.xl">
        <VStack gap={16}>
          <Heading as="h2" size="2xl" textAlign="center">
            How Smart Agri Works
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap={10} w="full">
            {steps.map((item, idx) => (
              <Box
                key={idx}
                position="relative"
                p={10}
                bg="#0a2316"
                borderWidth="1px"
                borderColor="#124a2c"
                rounded="3xl"
                textAlign="center"
                overflow="hidden"
                transition="all 0.3s"
                _hover={{ borderColor: "green.400", bg: "#0d3a22" }}
              >
                <Text
                  position="absolute"
                  top="-2"
                  right="2"
                  fontSize="9xl"
                  fontWeight="black"
                  color="green.900"
                  opacity={0.3}
                  userSelect="none"
                >
                  {item.step}
                </Text>
                <Text
                  fontSize="4xl"
                  fontWeight="bold"
                  color="green.300"
                  mb={4}
                  position="relative"
                >
                  {item.step}
                </Text>
                <Heading
                  as="h3"
                  size="lg"
                  mb={4}
                  color="white"
                  position="relative"
                >
                  {item.title}
                </Heading>
                <Text color="green.100" opacity={0.8} position="relative">
                  {item.desc}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

// ---------------------------------------------------------
// 3. WHY WE NEED IT SECTION (Dark gradient)
// ---------------------------------------------------------
export const WhyWeNeedItSection = () => {
  const stats = [
    { metric: "40%", label: "Reduction in Post Harvest Loss" },
    { metric: "2x", label: "Increase in Income Stability" },
    { metric: "24/7", label: "Real-time Market Access" },
  ];

  return (
    <Box
      py={{ base: 20, md: 28 }}
      bg="#0a2316"
      backgroundImage="radial-gradient(circle at 100% 100%, #124a2c 0%, transparent 50%)"
      color="white"
    >
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={16} alignItems="center">
          <Stack gap={8}>
            <Heading as="h2" size="2xl" lineHeight="1.2">
              Why Sri Lanka Needs This?
            </Heading>
            <Text fontSize="lg" color="green.100" opacity={0.9} maxW="md">
              Our agriculture sector faces critical challenges: unexpected price
              crashes, massive post-harvest wastage, and disconnect between
              farmers and markets.
            </Text>
            <VStack align="flex-start" gap={4}>
              {[
                "Reduce food shortages and unnecessary imports",
                "Protect farmers from market manipulation",
                "Ensure fair prices for both farmers and consumers",
              ].map((point, idx) => (
                <HStack key={idx} gap={4}>
                  <Icon as={CheckCircle2} color="green.400" boxSize={5} />
                  <Text color="gray.200" fontSize="md">
                    {point}
                  </Text>
                </HStack>
              ))}
            </VStack>
          </Stack>

          <SimpleGrid columns={{ base: 1, sm: 2 }} gap={6}>
            {stats.map((stat, idx) => (
              <Box
                key={idx}
                p={8}
                bg="whiteAlpha.50"
                backdropFilter="blur(10px)"
                borderWidth="1px"
                borderColor="whiteAlpha.200"
                rounded="2xl"
                textAlign="center"
                _hover={{ bg: "whiteAlpha.100", borderColor: "green.400" }}
                transition="all 0.2s"
              >
                <Text fontSize="4xl" fontWeight="bold" color="green.300" mb={2}>
                  {stat.metric}
                </Text>
                <Text color="gray.300" fontSize="sm" fontWeight="medium">
                  {stat.label}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

// ---------------------------------------------------------
// 4. TESTIMONIALS SECTION (Soft green)
// ---------------------------------------------------------
export const TestimonialsSection = () => {
  const testimonials = [
    {
      quote:
        "Smart Agri saved me from a huge loss last season. The price prediction told me to wait two weeks before selling!",
      name: "Saman Perera",
      role: "Farmer, Polonnaruwa",
    },
    {
      quote:
        "Finding consistent quality crops was hard. The marketplace makes it easy to connect directly with trustworthy farmers.",
      name: "Nimali Silva",
      role: "Wholesale Buyer",
    },
    {
      quote:
        "This system is exactly what our country needs to modernize cultivation planning and reduce national waste.",
      name: "Mr. Dissanayake",
      role: "Agriculture Officer",
    },
  ];

  return (
    <Box py={{ base: 20, md: 32 }} bg="green.50">
      <Container maxW="container.xl">
        <Heading as="h2" size="xl" textAlign="center" mb={16} color="#06150d">
          Trusted by the Community
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
          {testimonials.map((testimonial, idx) => (
            <Box
              key={idx}
              p={8}
              bg="white"
              rounded="2xl"
              position="relative"
              shadow="sm"
            >
              <Icon
                as={Quote}
                boxSize={8}
                color="green.100"
                position="absolute"
                top={6}
                right={6}
              />
              <Text
                fontStyle="italic"
                color="gray.700"
                mb={8}
                lineHeight="tall"
                fontSize="md"
              >
                "{testimonial.quote}"
              </Text>
              <Box>
                <Text fontWeight="bold" color="#06150d">
                  {testimonial.name}
                </Text>
                <Text fontSize="sm" color="green.600" fontWeight="medium">
                  {testimonial.role}
                </Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

// ---------------------------------------------------------
// 5. CTA SECTION (Dark green highlight)
// ---------------------------------------------------------
export const CtaSection = () => {
  return (
    <Box py={{ base: 24, md: 40 }} bg="white" textAlign="center">
      <Container maxW="4xl">
        <Box
          bg="#06150d"
          backgroundImage="radial-gradient(600px circle at 50% 0%, #124a2c 0%, transparent 100%)"
          rounded="3xl"
          p={{ base: 10, md: 20 }}
          color="white"
          shadow="2xl"
        >
          <Heading as="h2" size="2xl" mb={6}>
            Ready to Transform Your Harvest?
          </Heading>
          <Text
            fontSize="lg"
            color="green.100"
            opacity={0.9}
            mb={10}
            maxW="2xl"
            mx="auto"
          >
            Join thousands of Sri Lankan farmers and buyers who are smarter,
            safer, and more profitable with Smart Agri.
          </Text>
          <Link href={"/login"}>
            <Button
              size="lg"
              px={10}
              py={7}
              rounded="full"
              bg="green.400"
              color="#06150d"
              fontSize="lg"
              fontWeight="bold"
              _hover={{
                bg: "green.300",
                transform: "translateY(-2px)",
                shadow: "0 0 20px rgba(72, 187, 120, 0.4)",
              }}
              transition="all 0.2s"
            >
              Get Started Now
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
};
