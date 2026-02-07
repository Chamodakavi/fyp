"use client";

import React from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Icon,
  Image,
  Badge,
  Card,
  Separator,
  Link as ChakraLink,
} from "@chakra-ui/react";
import NextLink from "next/link";
import {
  LucideSprout,
  LucideTrendingUp,
  LucideShieldAlert,
  LucideStore,
  LucideNewspaper,
  LucideMessageCircle,
  LucideCheckCircle,
  LucideArrowRight,
  LucideLeaf,
  LucideFacebook,
  LucideTwitter,
  LucideInstagram,
} from "lucide-react";


// --- Hero Component ---
const HeroSection = () => {
  return (
    <Box
      position="relative"
      pt={{ base: 20, md: 32 }}
      pb={{ base: 20, md: 32 }}
      bg="green.50"
      overflow="hidden"
    >
      {/* Background Decoration */}
      <Box
        position="absolute"
        top="-10%"
        right="-5%"
        opacity={0.1}
        transform="rotate(45deg)"
        zIndex={0}
      >
        <Icon as={LucideLeaf} boxSize="500px" color="green.400" />
      </Box>

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={12} alignItems="center">
          <Stack gap={6}>
            <Badge
              colorPalette="green"
              variant="solid"
              size="lg"
              w="fit-content"
              px={4}
              py={1}
              rounded="full"
            >
              Revolutionizing Agriculture
            </Badge>
            <Heading
              size="4xl"
              lineHeight="1.2"
              color="gray.900"
              fontWeight="extrabold"
            >
              Predict Crop Prices.{" "}
              <Text as="span" color="green.600">
                Prevent Surplus.
              </Text>{" "}
              Increase Profit.
            </Heading>
            <Text fontSize="xl" color="gray.600" maxW="lg">
              Empowering Sri Lankan farmers to tackle price crashes,
              overproduction, and post-harvest losses with AI-driven insights.
            </Text>
            <Flex gap={4}>
              <Button
                asChild
                size="lg"
                color="white"
                bg="green.600"
                _hover={{ bg: "green.700" }}
                rounded="full"
                px={8}
              >
                <NextLink href="/login">Get Started</NextLink>
              </Button>
            </Flex>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

// --- Features Component ---
const FeaturesSection = () => {
  const features = [
    {
      icon: LucideTrendingUp,
      title: "Crop Price Prediction",
      desc: "ML-based forecasting to help you decide when to sell for maximum profit.",
    },
    {
      icon: LucideShieldAlert,
      title: "Surplus Prevention",
      desc: "Real-time alerts on potential overproduction in your area.",
    },
    {
      icon: LucideSprout,
      title: "Smart Crop Suggestions",
      desc: "Get recommendations on what to plant based on market demand.",
    },
    {
      icon: LucideStore,
      title: "Marketplace Integration",
      desc: "Connect directly with buyers and eliminate middlemen exploitation.",
    },
    {
      icon: LucideNewspaper,
      title: "News & Diseases",
      desc: "Stay updated with agricultural news and disease outbreak alerts.",
    },
    {
      icon: LucideMessageCircle,
      title: "Chatbot Assistant",
      desc: "24/7 AI support for all your farming questions and needs.",
    },
  ];

  return (
    <Box py={24} bg="white">
      <Container maxW="container.xl">
        <Stack gap={4} alignItems="center" textAlign="center" mb={16}>
          <Text
            color="green.600"
            fontWeight="bold"
            textTransform="uppercase"
            letterSpacing="wider"
          >
            Capabilities
          </Text>
          <Heading size="3xl" color="gray.800">
            Everything You Need to Succeed
          </Heading>
          <Text fontSize="lg" color="gray.500" maxW="2xl">
            Our platform provides end-to-end solutions for modern agriculture challenges.
          </Text>
        </Stack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
          {features.map((feature, index) => (
            <Card.Root
              key={index}
              variant="elevated"
              boxShadow="lg"
              borderTopWidth="4px"
              borderColor="green.500"
              _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
              transition="all 0.3s"
            >
              <Card.Body p={8}>
                <Icon
                  as={feature.icon}
                  boxSize={10}
                  color="green.500"
                  mb={4}
                  bg="green.50"
                  p={2}
                  rounded="lg"
                />
                <Card.Title fontSize="xl" mb={2}>
                  {feature.title}
                </Card.Title>
                <Card.Description fontSize="md" color="gray.600">
                  {feature.desc}
                </Card.Description>
              </Card.Body>
            </Card.Root>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

// --- How It Works Component ---
const HowItWorksSection = () => {
  const steps = [
    {
      id: "01",
      title: "Register Your Crops",
      desc: "Input your cultivation details and expected harvest dates.",
    },
    {
      id: "02",
      title: "Get Insights",
      desc: "View price forecasts and surplus risk alerts for your crops.",
    },
    {
      id: "03",
      title: "Sell Smart",
      desc: "Connect with buyers in the marketplace and maximize revenue.",
    },
  ];

  return (
    <Box py={24} bg="gray.50">
      <Container maxW="container.xl">
        <Heading size="3xl" textAlign="center" mb={16} color="gray.800">
          How Smart Agri Works
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={10}>
          {steps.map((step) => (
            <Flex
              key={step.id}
              direction="column"
              align="center"
              textAlign="center"
              bg="white"
              p={8}
              rounded="2xl"
              boxShadow="sm"
            >
              <Text
                fontSize="6xl"
                fontWeight="bold"
                color="green.100"
                lineHeight="1"
                mb={4}
              >
                {step.id}
              </Text>
              <Heading size="lg" mb={3} color="gray.700">
                {step.title}
              </Heading>
              <Text color="gray.500">{step.desc}</Text>
            </Flex>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

// --- Impact Section ---
const ImpactSection = () => {
  const stats = [
    { value: "40%", label: "Reduction in Post-Harvest Loss" },
    { value: "2x", label: "Increase in Income Stability" },
    { value: "24/7", label: "Real-time Market Access" },
  ];

  return (
    <Box py={24} bg="green.900" color="white">
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={16} alignItems="center">
          <Stack gap={6}>
            <Heading size="3xl">Why Sri Lanka Needs This?</Heading>
            <Text fontSize="xl" color="green.100">
              Our agriculture sector faces critical challenges: unexpected price
              crashes, massive post-harvest wastage, and disconnect between
              farmers and markets.
            </Text>
            <Stack gap={3}>
              {[
                "Reduce food shortages and unnecessary imports",
                "Protect farmers from market manipulation",
                "Ensure fair prices for both farmers and consumers",
              ].map((item, i) => (
                <Flex key={i} gap={3} align="center">
                  <Icon as={LucideCheckCircle} color="green.400" />
                  <Text>{item}</Text>
                </Flex>
              ))}
            </Stack>
          </Stack>

          <SimpleGrid columns={{ base: 1, sm: 3 }} gap={6}>
            {stats.map((stat, i) => (
              <Box
                key={i}
                bg="white/10"
                backdropFilter="blur(10px)"
                p={6}
                rounded="xl"
                textAlign="center"
                border="1px solid"
                borderColor="white/20"
              >
                <Text fontSize="4xl" fontWeight="bold" color="green.300">
                  {stat.value}
                </Text>
                <Text fontSize="sm" color="green.100" mt={2}>
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

// --- Testimonials Component ---
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Saman Perera",
      role: "Farmer, Polonnaruwa",
      text: "Smart Agri saved me from a huge loss last season. The price prediction told me to wait two weeks before selling!",
    },
    {
      name: "Nimali Silva",
      role: "Wholesale Buyer",
      text: "Finding consistent quality crops was hard. The marketplace makes it easy to connect directly with trustworthy farmers.",
    },
    {
      name: "Mr. Dissanayake",
      role: "Agriculture Officer",
      text: "This system is exactly what our country needs to modernize cultivation planning and reduce national waste.",
    },
  ];

  return (
    <Box py={24} bg="white">
      <Container maxW="container.xl">
        <Heading size="2xl" textAlign="center" mb={16} color="gray.800">
          Trusted by the Community
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
          {testimonials.map((t, i) => (
            <Card.Root key={i} variant="outline" bg="gray.50" border="none">
              <Card.Body p={8}>
                <Text
                  fontSize="lg"
                  fontStyle="italic"
                  color="gray.600"
                  mb={6}
                >
                  "{t.text}"
                </Text>
                <Box>
                  <Text fontWeight="bold" color="gray.900">
                    {t.name}
                  </Text>
                  <Text fontSize="sm" color="green.600">
                    {t.role}
                  </Text>
                </Box>
              </Card.Body>
            </Card.Root>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

// --- CTA Component ---
const CTASection = () => {
  return (
    <Box py={24} textAlign="center">
      <Container maxW="container.md">
        <Stack gap={8} align="center">
          <Heading size="3xl" color="green.800">
            Ready to Transform Your Harvest?
          </Heading>
          <Text fontSize="xl" color="gray.600">
            Join thousands of Sri Lankan farmers and buyers who are smarter,
            safer, and more profitable with Smart Agri.
          </Text>
          <Button
            asChild
            size="lg"
            color="white"
            bg="green.600"
            _hover={{ bg: "green.700", transform: "scale(1.05)" }}
            rounded="full"
            px={12}
            fontSize="xl"
            boxShadow="lg"
          >
            <NextLink href="/login">
              Get Started Now <LucideArrowRight />
            </NextLink>
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

// --- Footer Component ---
const Footer = () => {
  return (
    <Box bg="gray.900" color="gray.400" py={12}>
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, md: 4 }} gap={10}>
          <Stack gap={4}>
            <Flex align="center" gap={2}>
              <Icon as={LucideSprout} boxSize={6} color="green.400" />
              <Heading size="md" color="white">
                Smart Agri
              </Heading>
            </Flex>
            <Text fontSize="sm">
              Innovating agriculture for a sustainable future in Sri Lanka.
            </Text>
          </Stack>
          <Stack gap={2}>
            <Text color="white" fontWeight="bold">
              Quick Links
            </Text>
            <ChakraLink asChild>
              <NextLink href="#">About Us</NextLink>
            </ChakraLink>
            <ChakraLink asChild>
              <NextLink href="#">Features</NextLink>
            </ChakraLink>
            <ChakraLink asChild>
              <NextLink href="#">Marketplace</NextLink>
            </ChakraLink>
          </Stack>
          <Stack gap={2}>
            <Text color="white" fontWeight="bold">
              Support
            </Text>
            <ChakraLink asChild>
              <NextLink href="#">Help Center</NextLink>
            </ChakraLink>
            <ChakraLink asChild>
              <NextLink href="#">Contact Us</NextLink>
            </ChakraLink>
            <ChakraLink asChild>
              <NextLink href="#">Privacy Policy</NextLink>
            </ChakraLink>
          </Stack>
          <Stack gap={4}>
            <Text color="white" fontWeight="bold">
              Connect With Us
            </Text>
            <Flex gap={4}>
              <Icon
                as={LucideFacebook}
                boxSize={5}
                _hover={{ color: "green.400" }}
                cursor="pointer"
              />
              <Icon
                as={LucideTwitter}
                boxSize={5}
                _hover={{ color: "green.400" }}
                cursor="pointer"
              />
              <Icon
                as={LucideInstagram}
                boxSize={5}
                _hover={{ color: "green.400" }}
                cursor="pointer"
              />
            </Flex>
            <Text fontSize="sm">contact@smartagri.lk</Text>
          </Stack>
        </SimpleGrid>
        <Separator my={8} borderColor="gray.800" />
        <Text textAlign="center" fontSize="xs">
          © {new Date().getFullYear()} Smart Agri Sri Lanka. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
};

// --- Main Landing Page ---
const Landing = () => {
  return (
    <Box minH="100vh" bg="white">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ImpactSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </Box>
  );
};

export default Landing;