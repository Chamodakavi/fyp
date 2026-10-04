import { Button, Field, Input, Text, VStack } from "@chakra-ui/react";

type CredentialsSettingsProps = {
  saving: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function CredentialsSettings({
  saving,
  onSubmit,
}: CredentialsSettingsProps) {
  return (
    <form onSubmit={onSubmit}>
      <VStack align="stretch" gap={5} maxW={{ base: "100%", md: "520px" }}>
        <Field.Root required>
          <Field.Label>
            New Password <Field.RequiredIndicator />
          </Field.Label>
          <Input
            type="password"
            name="newPassword"
            minLength={6}
            autoComplete="new-password"
            required
          />
          <Field.HelperText>Use at least 6 characters.</Field.HelperText>
        </Field.Root>

        <Field.Root required>
          <Field.Label>
            Re-enter New Password <Field.RequiredIndicator />
          </Field.Label>
          <Input
            type="password"
            name="confirmPassword"
            minLength={6}
            autoComplete="new-password"
            required
          />
        </Field.Root>

        <Button
          alignSelf="flex-start"
          bg="green.600"
          color="white"
          type="submit"
          loading={saving}
          disabled={saving}
          _hover={{ bg: "green.700" }}
        >
          {saving ? "Changing Password..." : "Change Password"}
        </Button>

        <Text fontSize="sm" color="gray.500">
          After changing your password, use the new password the next time you sign in.
        </Text>
      </VStack>
    </form>
  );
}
