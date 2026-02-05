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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/utils/supabase/createClient";

const settingItems = [
  { id: 1, name: "Account", value: "account" },
  { id: 2, name: "Notifications", value: "notification" },
  { id: 3, name: "Credentials", value: "credentials" },
];

const types = createListCollection({
  items: [
    { label: "Farmer", value: "Farmer" },
    { label: "Seller", value: "Seller" },
  ],
});

const districts = createListCollection({
  items: [
    { label: "Ampara", value: "Ampara" },
    { label: "Anuradhapura", value: "Anuradhapura" },
    { label: "Badulla", value: "Badulla" },
    { label: "Batticaloa", value: "Batticaloa" },
    { label: "Colombo", value: "Colombo" },
    { label: "Galle", value: "Galle" },
    { label: "Gampaha", value: "Gampaha" },
    { label: "Hambantota", value: "Hambantota" },
    { label: "Jaffna", value: "Jaffna" },
    { label: "Kalutara", value: "Kalutara" },
    { label: "Kandy", value: "Kandy" },
    { label: "Kegalle", value: "Kegalle" },
    { label: "Kilinochchi", value: "Kilinochchi" },
    { label: "Kurunegala", value: "Kurunegala" },
    { label: "Mannar", value: "Mannar" },
    { label: "Matale", value: "Matale" },
    { label: "Matara", value: "Matara" },
    { label: "Monaragala", value: "Monaragala" },
    { label: "Mullaitivu", value: "Mullaitivu" },
    { label: "Nuwara Eliya", value: "Nuwara Eliya" },
    { label: "Polonnaruwa", value: "Polonnaruwa" },
    { label: "Puttalam", value: "Puttalam" },
    { label: "Ratnapura", value: "Ratnapura" },
    { label: "Trincomalee", value: "Trincomalee" },
    { label: "Vavuniya", value: "Vavuniya" },
  ],
});

function AdminSettings() {
  const supabase = createClient();
  const { user, loading } = useUser();
  const [isActive, setIsActive] = useState("account");

  // -- STATES FOR FORM DATA --
  const [formData, setFormData] = useState({
    u_name: "",
    u_surname: "",
    u_email: "",
    u_tel: "",
    u_type: [] as string[],
    u_district: [] as string[],
    u_notify: false,
  });

  const [statusMsg, setStatusMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // 1. LOAD DATA INTO FORM
  useEffect(() => {
    if (user) {
      setFormData({
        u_name: user.u_name || "",
        u_surname: user.u_surname || "",
        u_email: user.u_email || "",
        u_tel: user.u_tel || "",
        u_type: user.u_type ? [user.u_type] : [],
        u_district: user.u_district ? [user.u_district] : [],
        u_notify: user.u_notify || false,
      });
    }
  }, [user]);

  // Clear status message after 3 seconds
  useEffect(() => {
    if (statusMsg) {
      const timer = setTimeout(() => setStatusMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMsg]);

  // 2. HANDLE ACCOUNT UPDATE
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg("");

    try {
      const { error } = await supabase
        .from("users")
        .update({
          u_name: formData.u_name,
          u_surname: formData.u_surname,
          u_tel: formData.u_tel,
          u_type: formData.u_type[0],
          u_district: formData.u_district[0],
        })
        .eq("id", user?.id);

      if (error) throw error;
      setStatusMsg("Profile updated successfully!");
    } catch (error: any) {
      console.error(error);
      setStatusMsg("Error updating profile.");
    } finally {
      setIsSaving(false);
    }
  };

  // 3. HANDLE NOTIFICATION TOGGLE
  const handleNotifyToggle = async (checked: boolean) => {
    setFormData((prev) => ({ ...prev, u_notify: checked }));
    if (user) {
      await supabase
        .from("users")
        .update({ u_notify: checked })
        .eq("id", user.id);
    }
  };

  // 4. HANDLE PASSWORD CHANGE
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const newPassword = (
      form.elements.namedItem("newPassword") as HTMLInputElement
    ).value;
    const confirmPassword = (
      form.elements.namedItem("confirmPassword") as HTMLInputElement
    ).value;

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) alert("Error changing password: " + error.message);
    else alert("Password changed successfully!");

    form.reset();
  };

  if (loading) return <Box p={8}>Loading settings...</Box>;

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
              fontWeight={isActive === item.value ? "bold" : "normal"}
              onClick={() => setIsActive(item.value)}
            >
              {item.name}
            </Text>
          ))}
        </HStack>
        <Box w={"full"} h={0.5} bg="#3a3131" mt={4} mb={6}></Box>

        {/* --- ACCOUNT FORM --- */}
        {isActive === "account" && (
          <Box>
            <form onSubmit={handleUpdateProfile}>
              <HStack
                mt={4}
                display={{ base: "block", md: "flex" }}
                spaceY={{ base: 4, md: 0 }}
              >
                <Field.Root required>
                  <Field.Label>
                    Name <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    value={formData.u_name}
                    onChange={(e) =>
                      setFormData({ ...formData, u_name: e.target.value })
                    }
                    placeholder="Enter your name"
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Surname</Field.Label>
                  <Input
                    value={formData.u_surname}
                    onChange={(e) =>
                      setFormData({ ...formData, u_surname: e.target.value })
                    }
                    placeholder="Enter your surname"
                  />
                </Field.Root>
              </HStack>

              <Field.Root required my={5} disabled>
                <Field.Label>Email (Cannot be changed)</Field.Label>
                <Input
                  value={formData.u_email}
                  readOnly
                  bg="gray.100"
                  cursor="not-allowed"
                />
              </Field.Root>

              <Field.Root required my={5} w={{ base: "100%", md: "50%" }}>
                <Field.Label>
                  Telephone <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  value={formData.u_tel}
                  onChange={(e) =>
                    setFormData({ ...formData, u_tel: e.target.value })
                  }
                  placeholder="+94 70..."
                />
              </Field.Root>

              <HStack gap={5}>
                <Select.Root
                  collection={types}
                  size="sm"
                  width="320px"
                  value={formData.u_type}
                  onValueChange={(e) =>
                    setFormData({ ...formData, u_type: e.value })
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

                <Select.Root
                  collection={districts}
                  size="sm"
                  width="320px"
                  value={formData.u_district}
                  onValueChange={(e) =>
                    setFormData({ ...formData, u_district: e.value })
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
                        {districts.items.map((district) => (
                          <Select.Item item={district} key={district.value}>
                            {district.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              </HStack>

              <Button bg={"green.600"} mt={8} type="submit" loading={isSaving}>
                {isSaving ? "Updating..." : "Update Profile"}
              </Button>

              {statusMsg && (
                <Text mt={4} color="green.600" fontWeight="bold">
                  {statusMsg}
                </Text>
              )}
            </form>
          </Box>
        )}

        {/* --- NOTIFICATIONS FORM --- */}
        {isActive === "notification" && (
          <HStack width="full">
            <Text>Turn Notifications On/Off</Text>
            <Switch.Root
              checked={formData.u_notify}
              onCheckedChange={(e) => handleNotifyToggle(e.checked)}
              colorPalette="green"
              ml={10}
            >
              <Switch.HiddenInput />
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
            </Switch.Root>
          </HStack>
        )}

        {/* --- CREDENTIALS FORM --- */}
        {isActive === "credentials" && (
          <Box>
            <form onSubmit={handlePasswordChange}>
              <Field.Root required my={5} w={{ base: "100%", md: "50%" }}>
                <Field.Label>
                  New Password <Field.RequiredIndicator />
                </Field.Label>
                <Input type="password" name="newPassword" />
              </Field.Root>
              <Field.Root required my={5} w={{ base: "100%", md: "50%" }}>
                <Field.Label>
                  Re-enter new Password <Field.RequiredIndicator />
                </Field.Label>
                <Input type="password" name="confirmPassword" />
              </Field.Root>
              <Button bg={"green.600"} mt={6} type="submit">
                Change Password
              </Button>
            </form>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default AdminSettings;
