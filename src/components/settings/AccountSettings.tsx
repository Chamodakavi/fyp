import {
  Button,
  createListCollection,
  Field,
  HStack,
  Input,
  Portal,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import { SettingsFormData, types, districts } from "./settingsData";

const typeCollection = createListCollection({ items: types });
const districtCollection = createListCollection({ items: districts });

type AccountSettingsProps = {
  formData: SettingsFormData;
  setFormData: React.Dispatch<React.SetStateAction<SettingsFormData>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  saving: boolean;
  statusMsg: string;
};

export function AccountSettings({
  formData,
  setFormData,
  onSubmit,
  saving,
  statusMsg,
}: AccountSettingsProps) {
  return (
    <form onSubmit={onSubmit}>
      <VStack align="stretch" gap={5}>
        <HStack
          align="stretch"
          gap={5}
          flexDirection={{ base: "column", md: "row" }}
        >
          <Field.Root required flex="1">
            <Field.Label>
              Name <Field.RequiredIndicator />
            </Field.Label>
            <Input
              value={formData.u_name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, u_name: e.target.value }))
              }
              placeholder="Enter your name"
            />
          </Field.Root>

          <Field.Root flex="1">
            <Field.Label>Surname</Field.Label>
            <Input
              value={formData.u_surname}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, u_surname: e.target.value }))
              }
              placeholder="Enter your surname"
            />
          </Field.Root>
        </HStack>

        <Field.Root>
          <Field.Label>Email</Field.Label>
          <Input
            value={formData.u_email}
            readOnly
            bg="gray.100"
            color="gray.600"
            cursor="not-allowed"
          />
          <Field.HelperText>Email cannot be changed here.</Field.HelperText>
        </Field.Root>

        <Field.Root required maxW={{ base: "100%", md: "50%" }}>
          <Field.Label>
            Telephone <Field.RequiredIndicator />
          </Field.Label>
          <Input
            value={formData.u_tel}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, u_tel: e.target.value }))
            }
            placeholder="+94 70..."
          />
        </Field.Root>

        <HStack
          gap={5}
          align="stretch"
          flexDirection={{ base: "column", md: "row" }}
        >
          <Select.Root
            collection={typeCollection}
            size="sm"
            width="full"
            maxW={{ md: "320px" }}
            value={formData.u_type}
            onValueChange={(e) =>
              setFormData((prev) => ({ ...prev, u_type: e.value }))
            }
          >
            <Select.HiddenSelect />
            <Select.Label>Select Type</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select type" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {typeCollection.items.map((item) => (
                    <Select.Item item={item} key={item.value}>
                      {item.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>

          <Select.Root
            collection={districtCollection}
            size="sm"
            width="full"
            maxW={{ md: "320px" }}
            value={formData.u_district}
            onValueChange={(e) =>
              setFormData((prev) => ({ ...prev, u_district: e.value }))
            }
          >
            <Select.HiddenSelect />
            <Select.Label>Select District</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select district" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {districtCollection.items.map((item) => (
                    <Select.Item item={item} key={item.value}>
                      {item.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </HStack>

        <Button
          alignSelf="flex-start"
          bg="green.600"
          color="white"
          mt={2}
          type="submit"
          loading={saving}
          disabled={saving}
          _hover={{ bg: "green.700" }}
        >
          {saving ? "Updating..." : "Update Profile"}
        </Button>

        {statusMsg && (
          <Text
            color={statusMsg.toLowerCase().includes("error") ? "red.600" : "green.600"}
            fontWeight="bold"
          >
            {statusMsg}
          </Text>
        )}
      </VStack>
    </form>
  );
}
