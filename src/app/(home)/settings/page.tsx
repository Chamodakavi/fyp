"use client";

import React, { useEffect, useState } from "react";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/utils/supabase/createClient";
import { SettingsFormData } from "@/components/settings/settingsData";
import { SettingsLoading } from "@/components/settings/SettingsLoading";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { CredentialsSettings } from "@/components/settings/CredentialsSettings";

function SettingsPage() {
  const supabase = createClient();
  const { user, loading } = useUser();

  const [isActive, setIsActive] = useState("account");
  const [formData, setFormData] = useState<SettingsFormData>({
    u_name: "",
    u_surname: "",
    u_email: "",
    u_tel: "",
    u_type: [],
    u_district: [],
    u_notify: false,
  });

  const [statusMsg, setStatusMsg] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingNotification, setIsSavingNotification] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (!user) return;

    setFormData({
      u_name: user.u_name || "",
      u_surname: user.u_surname || "",
      u_email: user.u_email || "",
      u_tel: user.u_tel || "",
      u_type: user.u_type ? [user.u_type] : [],
      u_district: user.u_district ? [user.u_district] : [],
      u_notify: Boolean(user.u_notify),
    });
  }, [user]);

  useEffect(() => {
    if (!statusMsg) return;

    const timer = setTimeout(() => setStatusMsg(""), 3000);
    return () => clearTimeout(timer);
  }, [statusMsg]);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.id) return;

    setIsSavingProfile(true);
    setStatusMsg("");

    try {
      const { error } = await supabase
        .from("users")
        .update({
          u_name: formData.u_name.trim(),
          u_surname: formData.u_surname.trim(),
          u_tel: formData.u_tel.trim(),
          u_type: formData.u_type[0] || null,
          u_district: formData.u_district[0] || null,
        })
        .eq("id", user.id);

      if (error) throw error;

      setStatusMsg("Profile updated successfully!");
    } catch (error: any) {
      console.error("Profile update error:", error);
      setStatusMsg(`Error updating profile: ${error.message}`);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleNotifyToggle = async (checked: boolean) => {
    if (!user?.id || isSavingNotification) return;

    const previous = formData.u_notify;
    setFormData((prev) => ({ ...prev, u_notify: checked }));
    setIsSavingNotification(true);

    try {
      const { error } = await supabase
        .from("users")
        .update({ u_notify: checked })
        .eq("id", user.id);

      if (error) throw error;

      setStatusMsg(
        checked
          ? "Notifications enabled successfully!"
          : "Notifications disabled successfully!",
      );
    } catch (error: any) {
      console.error("Notification update error:", error);
      setFormData((prev) => ({ ...prev, u_notify: previous }));
      setStatusMsg(`Error updating notifications: ${error.message}`);
    } finally {
      setIsSavingNotification(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const newPassword = (
      form.elements.namedItem("newPassword") as HTMLInputElement
    )?.value;
    const confirmPassword = (
      form.elements.namedItem("confirmPassword") as HTMLInputElement
    )?.value;

    if (!newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      setStatusMsg("Error: Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setStatusMsg("Error: Password must be at least 6 characters.");
      return;
    }

    setIsChangingPassword(true);
    setStatusMsg("");

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setStatusMsg("Password changed successfully!");
      form.reset();
    } catch (error: any) {
      console.error("Password update error:", error);
      setStatusMsg(`Error changing password: ${error.message}`);
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading) {
    return <SettingsLoading />;
  }

  if (!user) {
    return (
      <Box minH="100vh" bg="white" p={{ base: 5, md: 8 }}>
        <Text color="gray.600">Please sign in to manage your settings.</Text>
      </Box>
    );
  }

  return (
    <Box w="100%" minH="100vh" bg="white" p={{ base: 5, md: 8 }}>
      <Box maxW="1100px" mx="auto">
        <VStack align="stretch" gap={6}>
          <Box>
            <Heading color="#080e0b" mb={2}>
              Settings
            </Heading>
            <Text color="gray.600">
              Manage your account settings and preferences
            </Text>
          </Box>

          <SettingsTabs active={isActive} onChange={setIsActive} />

          {isActive === "account" && (
            <AccountSettings
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleUpdateProfile}
              saving={isSavingProfile}
              statusMsg={statusMsg}
            />
          )}

          {isActive === "notification" && (
            <NotificationSettings
              enabled={formData.u_notify}
              saving={isSavingNotification}
              onChange={handleNotifyToggle}
            />
          )}

          {isActive === "credentials" && (
            <CredentialsSettings
              saving={isChangingPassword}
              onSubmit={handlePasswordChange}
            />
          )}
        </VStack>
      </Box>
    </Box>
  );
}

export default SettingsPage;
