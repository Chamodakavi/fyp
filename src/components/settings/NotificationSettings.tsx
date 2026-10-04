import { HStack, Spinner, Switch, Text } from "@chakra-ui/react";

type NotificationSettingsProps = {
  enabled: boolean;
  saving: boolean;
  onChange: (checked: boolean) => void;
};

export function NotificationSettings({
  enabled,
  saving,
  onChange,
}: NotificationSettingsProps) {
  return (
    <HStack justify="space-between" maxW="520px" py={2}>
      <Text>Turn notifications on/off</Text>

      <Switch.Root
        checked={enabled}
        disabled={saving}
        onCheckedChange={(e) => onChange(e.checked)}
        colorPalette="green"
      >
        <Switch.HiddenInput />
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Root>

      {saving && <Spinner size="sm" color="green.600" />}
    </HStack>
  );
}
