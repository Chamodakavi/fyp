import { Box, HStack, Text } from "@chakra-ui/react";
import { settingItems } from "./settingsData";

type SettingsTabsProps = {
  active: string;
  onChange: (value: string) => void;
};

export function SettingsTabs({ active, onChange }: SettingsTabsProps) {
  return (
    <Box>
      <HStack
        gap={{ base: 5, md: 8 }}
        overflowX="auto"
        pb={1}
        scrollbarWidth="thin"
      >
        {settingItems.map((item) => {
          const selected = active === item.value;

          return (
            <Text
              key={item.value}
              as="button"
              type="button"
              flexShrink={0}
              cursor="pointer"
              color={selected ? "green.600" : "gray.700"}
              fontWeight={selected ? "bold" : "medium"}
              py={2}
              borderBottom="2px solid"
              borderColor={selected ? "green.600" : "transparent"}
              _hover={{ color: "green.600" }}
              onClick={() => onChange(item.value)}
            >
              {item.name}
            </Text>
          );
        })}
      </HStack>
      <Box w="full" h="1px" bg="gray.200" mt={2} />
    </Box>
  );
}
