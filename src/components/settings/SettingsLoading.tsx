import { Center, Spinner, Text, VStack } from "@chakra-ui/react";

export function SettingsLoading() {
  return (
    <Center minH="100vh" bg="white">
      <VStack gap={3}>
        <Spinner size="xl" color="green.600" borderWidth="3px" />
        <Text color="gray.600" fontSize="sm">
          Loading your settings...
        </Text>
      </VStack>
    </Center>
  );
}
