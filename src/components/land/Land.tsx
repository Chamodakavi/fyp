"use client";

import React, { useEffect, useRef, type RefObject } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";

const LEAF_COUNT = 46;
const PULL_RADIUS = 340;

type Leaf = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vr: number;
  depth: number;
  shade: number;
};

type MouseState = {
  x: number;
  y: number;
  gx: number;
  gy: number;
  active: boolean;
};

const rand = (a: number, b: number): number => a + Math.random() * (b - a);

const makeLeaf = (w: number, h: number): Leaf => {
  const depth = rand(0.35, 1);

  return {
    x: rand(0, w),
    y: rand(0, h),
    vx: rand(-0.15, 0.15),
    vy: rand(-0.1, 0.2),
    size: 10 + depth * 22,
    rot: rand(0, Math.PI * 2),
    vr: rand(-0.012, 0.012),
    depth,
    shade: rand(0, 1),
  };
};

const drawLeaf = (ctx: CanvasRenderingContext2D, leaf: Leaf): void => {
  const s = leaf.size;

  ctx.save();

  ctx.translate(leaf.x, leaf.y);
  ctx.rotate(leaf.rot);

  const light = 28 + leaf.shade * 30;

  ctx.fillStyle = `hsla(
    ${140 + leaf.shade * 18},
    55%,
    ${light}%,
    ${0.25 + leaf.depth * 0.65}
  )`;

  ctx.beginPath();

  ctx.moveTo(0, -s);

  ctx.bezierCurveTo(s * 0.9, -s * 0.4, s * 0.7, s * 0.6, 0, s);

  ctx.bezierCurveTo(-s * 0.7, s * 0.6, -s * 0.9, -s * 0.4, 0, -s);

  ctx.fill();

  ctx.strokeStyle = `hsla(
    150,
    60%,
    12%,
    ${0.35 * leaf.depth}
  )`;

  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(0, -s * 0.9);
  ctx.lineTo(0, s * 0.9);
  ctx.stroke();

  ctx.restore();
};

type LeafFieldProps = {
  containerRef: RefObject<HTMLDivElement | null>;
};

const LeafField = ({ containerRef }: LeafFieldProps): React.ReactElement => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) {
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let w = 0;
    let h = 0;
    let raf = 0;

    let leaves: Leaf[] = [];

    const mouse: MouseState = {
      x: 0,
      y: 0,
      gx: 0,
      gy: 0,
      active: false,
    };

    const resize = (): void => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      w = container.clientWidth;
      h = container.clientHeight;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);

      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!leaves.length) {
        leaves = Array.from({ length: LEAF_COUNT }, () => makeLeaf(w, h));
      }
    };

    const onMove = (event: PointerEvent): void => {
      const rect = container.getBoundingClientRect();

      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;

      if (!mouse.active) {
        mouse.gx = mouse.x;
        mouse.gy = mouse.y;
      }

      mouse.active = true;
    };

    const onLeave = (): void => {
      mouse.active = false;
    };

    const frame = (): void => {
      ctx.clearRect(0, 0, w, h);

      /*
       * Soft light following the cursor
       */
      if (mouse.active && !reduceMotion) {
        mouse.gx += (mouse.x - mouse.gx) * 0.12;
        mouse.gy += (mouse.y - mouse.gy) * 0.12;

        const gradient = ctx.createRadialGradient(
          mouse.gx,
          mouse.gy,
          0,
          mouse.gx,
          mouse.gy,
          260,
        );

        gradient.addColorStop(0, "rgba(120, 230, 160, 0.22)");

        gradient.addColorStop(1, "rgba(120, 230, 160, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      }

      for (const leaf of leaves) {
        if (!reduceMotion) {
          /*
           * Cursor attraction
           */
          if (mouse.active) {
            const dx = mouse.x - leaf.x;
            const dy = mouse.y - leaf.y;

            const distance = Math.hypot(dx, dy) || 1;

            if (distance < PULL_RADIUS) {
              const force = (1 - distance / PULL_RADIUS) * 0.09 * leaf.depth;

              /*
               * Pull toward cursor + sideways force
               * to create the swirling effect.
               */
              leaf.vx +=
                (dx / distance) * force + (-dy / distance) * force * 1.4;

              leaf.vy +=
                (dy / distance) * force + (dx / distance) * force * 1.4;

              leaf.vr += (dx / distance) * 0.0006;
            }
          }

          /*
           * Friction
           */
          leaf.vx *= 0.97;
          leaf.vy *= 0.97;
          leaf.vr *= 0.985;

          /*
           * Gentle idle movement
           */
          leaf.vx += Math.sin(leaf.y * 0.006 + leaf.rot) * 0.004;

          leaf.vy += 0.0015;

          leaf.x += leaf.vx;
          leaf.y += leaf.vy;

          leaf.rot += leaf.vr + 0.002;

          /*
           * Wrap leaves around the screen.
           */
          const margin = leaf.size * 2;

          if (leaf.x < -margin) {
            leaf.x = w + margin;
          }

          if (leaf.x > w + margin) {
            leaf.x = -margin;
          }

          if (leaf.y > h + margin) {
            leaf.y = -margin;
            leaf.x = rand(0, w);
          }

          if (leaf.y < -margin) {
            leaf.y = h + margin;
          }
        }

        drawLeaf(ctx, leaf);
      }

      raf = requestAnimationFrame(frame);
    };

    resize();
    frame();

    window.addEventListener("resize", resize);

    container.addEventListener("pointermove", onMove);

    container.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);

      window.removeEventListener("resize", resize);

      container.removeEventListener("pointermove", onMove);

      container.removeEventListener("pointerleave", onLeave);
    };
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
};

const HeroSection = (): React.ReactElement => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  return (
    <Box
      ref={sectionRef}
      position="relative"
      overflow="hidden"
      minH={{
        base: "100vh",
        md: "100vh",
      }}
      display="flex"
      alignItems="center"
      color="white"
      bg="#06150d"
      backgroundImage={
        "radial-gradient(900px 600px at 15% 20%, #124a2c 0%, transparent 60%), " +
        "radial-gradient(800px 600px at 90% 90%, #0d3a22 0%, transparent 65%), " +
        "linear-gradient(160deg, #06150d 0%, #0a2316 55%, #05100a 100%)"
      }
    >
      <LeafField containerRef={sectionRef} />

      <Container
        maxW="container.xl"
        position="relative"
        zIndex={1}
        py={{
          base: 20,
          md: 32,
        }}
      >
        <Stack gap={8} maxW="3xl" mx="auto" align="center" textAlign="center">
          {/* Badge */}
          <Text
            w="fit-content"
            px={4}
            py={1}
            rounded="full"
            fontSize="sm"
            color="green.200"
            border="1px solid"
            borderColor="green.700"
            bg="blackAlpha.400"
            backdropFilter="blur(6px)"
          >
            Built for Sri Lankan farmers
          </Text>

          {/* Heading */}
          <Heading
            as="h1"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight="semibold"
            fontSize={{
              base: "4xl",
              md: "6xl",
              lg: "7xl",
            }}
            lineHeight="1.05"
            letterSpacing="-0.02em"
            textShadow="0 4px 40px rgba(0,0,0,0.5)"
          >
            Know the Market before you harvest.
          </Heading>

          {/* Description */}
          <Text
            fontSize={{
              base: "lg",
              md: "xl",
            }}
            color="green.100"
            opacity={0.85}
            maxW="xl"
          >
            Smart Agri forecasts crop prices and warns you about surplus in your
            area, so you can plant what sells and sell when the price is right.
          </Text>

          {/* Buttons */}
          <Flex gap={4} wrap="wrap" justify="center">
            <Button
              asChild
              size="lg"
              rounded="full"
              px={8}
              color="#06150d"
              bg="green.300"
              _hover={{
                bg: "green.200",
                transform: "translateY(-2px)",
              }}
              transition="all 0.2s"
              boxShadow="0 0 40px rgba(104, 211, 145, 0.35)"
            >
              <Link href="/login">Get started</Link>
            </Button>

            <Button
              asChild
              size="lg"
              rounded="full"
              px={8}
              variant="outline"
              color="green.100"
              borderColor="green.600"
              _hover={{
                bg: "whiteAlpha.100",
              }}
            >
              <Link href="#features">See how it works</Link>
            </Button>
          </Flex>
        </Stack>
      </Container>

      {/* Bottom fade */}
      <Box
        position="absolute"
        left={0}
        right={0}
        bottom={0}
        h="120px"
        pointerEvents="none"
        bgGradient="to-b"
        gradientFrom="transparent"
        gradientTo="#06150d"
        opacity={0.6}
      />
    </Box>
  );
};

export default HeroSection;
