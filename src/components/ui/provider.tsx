"use client";

import {
  ChakraProvider,
  defaultSystem,
  createSystem,
  defaultConfig,
  defineConfig,
} from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        main: { value: "#E0F24B" },
        secondary: { value: "#0A2540" },
      },
      fonts: {
        body: { value: "var(--font-poppins), sans-serif" },
        heading: { value: "var(--font-poppins), sans-serif" },
      },
    },
  },
});

const system = createSystem(defaultConfig, config);

export function Provider({ children }: { children: React.ReactNode }) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
}
