"use client";

import {
  Box,
  Button,
  createListCollection,
  Field,
  Heading,
  HStack,
  Input,
  Portal,
  Select,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";

const settingItems = [
  {
    id: 1,
    name: "Account",
    value: "account",
  },
  {
    id: 2,
    name: "Notifications",
    value: "notification",
  },
  {
    id: 3,
    name: "Credentials",
    value: "credentials",
  },
];

const types = createListCollection({
  items: [
    { label: "Farmer", value: "farmer" },
    { label: "Seller", value: "seller" },
  ],
});

const districts = createListCollection({
  items: [
    { label: "Ampara", value: "ampara" },
    { label: "Anuradhapura", value: "anuradhapura" },
    { label: "Badulla", value: "badulla" },
    { label: "Batticaloa", value: "batticaloa" },
    { label: "Colombo", value: "colombo" },
    { label: "Galle", value: "galle" },
    { label: "Gampaha", value: "gampaha" },
    { label: "Hambantota", value: "hambantota" },
    { label: "Jaffna", value: "jaffna" },
    { label: "Kalutara", value: "kalutara" },
    { label: "Kandy", value: "kandy" },
    { label: "Kegalle", value: "kegalle" },
    { label: "Kilinochchi", value: "kilinochchi" },
    { label: "Kurunegala", value: "kurunegala" },
    { label: "Mannar", value: "mannar" },
    { label: "Matale", value: "matale" },
    { label: "Matara", value: "matara" },
    { label: "Monaragala", value: "monaragala" },
    { label: "Mullaitivu", value: "mullaitivu" },
    { label: "Nuwara Eliya", value: "nuwara-eliya" },
    { label: "Polonnaruwa", value: "polonnaruwa" },
    { label: "Puttalam", value: "puttalam" },
    { label: "Ratnapura", value: "ratnapura" },
    { label: "Trincomalee", value: "trincomalee" },
    { label: "Vavuniya", value: "vavuniya" },
  ],
});

function page() {
  const Account = () => (
    <Box>
      <form>
        <HStack
          mt={4}
          display={{ base: "block", md: "flex" }}
          spaceY={{ base: 4, md: 0 }}
        >
          <Field.Root required>
            <Field.Label>
              Name <Field.RequiredIndicator />
            </Field.Label>
            <Input placeholder="Enter your name" />
          </Field.Root>

          <Field.Root required>
            <Field.Label>
              Surname <Field.RequiredIndicator />
            </Field.Label>
            <Input placeholder="Enter your surname" />
          </Field.Root>
        </HStack>

        <Field.Root required my={5}>
          <Field.Label>
            Email <Field.RequiredIndicator />
          </Field.Label>
          <Input placeholder="anurafernando@gmail.com" />
        </Field.Root>

        <Field.Root required my={5} w={{ base: "100%", md: "50%" }}>
          <Field.Label>
            Telephone <Field.RequiredIndicator />
          </Field.Label>
          <Input placeholder="+94 70 456 8769" />
        </Field.Root>

        <HStack gap={5}>
          <Select.Root collection={types} size="sm" width="320px">
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
                  {types.items.map((type) => (
                    <Select.Item item={type} key={type.value}>
                      {type.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>

          <Select.Root collection={districts} size="sm" width="320px">
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
                  {districts.items.map((districts) => (
                    <Select.Item item={districts} key={districts.value}>
                      {districts.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </HStack>
        <Button bg={"green.600"} mt={8} type="submit">
          Update
        </Button>
      </form>
    </Box>
  );
  const [notificationsOn, setNotificationsOn] = useState(false);
  const Notification = () => (
    <HStack width="full">
      <Text>Turn Notifications On/Off</Text>

      {/* 2. The Switch Component */}
      <Switch.Root
        checked={notificationsOn}
        onCheckedChange={(e) => setNotificationsOn(e.checked)}
        colorPalette="green"
        ml={10}
      >
        <Switch.HiddenInput />
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Root>
    </HStack>
  );

  const Credentials = () => (
    <Box>
      <form>
        <Field.Root required my={5} w={{ base: "100%", md: "50%" }}>
          <Field.Label>
            Existing Password <Field.RequiredIndicator />
          </Field.Label>
          <Input type="password" />
        </Field.Root>
        <Field.Root required my={5} w={{ base: "100%", md: "50%" }}>
          <Field.Label>
            New Password <Field.RequiredIndicator />
          </Field.Label>
          <Input type="password" />
        </Field.Root>
        <Field.Root required my={5} w={{ base: "100%", md: "50%" }}>
          <Field.Label>
            Re enter new Password <Field.RequiredIndicator />
          </Field.Label>
          <Input type="password" />
        </Field.Root>
        <Button bg={"green.600"} mt={6} type="submit">
          Change Password
        </Button>
      </form>
    </Box>
  );

  const [isActive, setIsActive] = useState("account");

  return (
    <Box w="100%" minH="100vh" bg="#ffffff" p={8}>
      <Box>
        <Heading color="#080e0b" mb={2}>
          Settings
        </Heading>
        <Text color="gray.900" mb={8}>
          Manage your account settings and preferences
        </Text>
        <HStack>
          {settingItems.map((item, id) => (
            <Text
              key={id}
              cursor={"pointer"}
              mx={{ base: 2, md: 4 }}
              color={isActive === item.value ? "green.600" : "gray.900"}
              //  fontWeight={isActive === item.value ? "bold" : "normal"}
              onClick={() => setIsActive(item.value)}
            >
              {item.name}
            </Text>
          ))}
        </HStack>
        {/* divider */}
        <Box w={"full"} h={0.5} bg="#3a3131" mt={4} mb={6}></Box>
        {/* </Box>    <Box w={{ base: "100%", md: "50%" }}> */}

        {isActive === "account" ? (
          <Account />
        ) : isActive === "notification" ? (
          <Notification />
        ) : (
          <Credentials />
        )}
      </Box>
    </Box>
  );
}

export default page;
