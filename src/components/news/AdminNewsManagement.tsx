"use client";

import React, { useRef, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  HStack,
  VStack,
  Text,
  Input,
  Button,
  Table,
  Image,
  Container,
  Textarea,
  Drawer,
  Portal,
  Alert,
  Spinner,
  NativeSelect,
  Dialog,
} from "@chakra-ui/react";
import {
  Plus,
  Pencil,
  Trash2,
  Newspaper,
  X as LuX,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { useNews } from "@/hooks/useNews";
import { createClient } from "@/utils/supabase/createClient";

function AdminNewsManagement() {
  const { news, loading } = useNews();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- STATE ---
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any>(null);

  const [formData, setFormData] = useState({
    n_title: "",
    n_description: "",
    n_type: "General",
    n_author: "",
    n_img: "", // Public URL
  });

  // ✅ Image Management State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // --- HELPERS ---
  const showAlert = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  // --- HANDLERS ---
  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedNews(null);
    setImageFile(null);
    setPreviewUrl("");
    setFormData({
      n_title: "",
      n_description: "",
      n_type: "General",
      n_author: "",
      n_img: "",
    });
    setIsOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setIsEditing(true);
    setSelectedNews(item);
    setImageFile(null);
    setPreviewUrl("");
    setFormData({
      n_title: item.n_title || "",
      n_description: item.n_description || "",
      n_type: item.n_type || "General",
      n_author: item.n_author || "",
      n_img: item.n_img || "",
    });
    setIsOpen(true);
  };

  // ✅ Image Selection Handler
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (file.size > 2 * 1024 * 1024) {
      showAlert("error", "File too large. Keep it under 2MB.");
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl("");
    setFormData((prev) => ({ ...prev, n_img: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const confirmDelete = async () => {
    if (!selectedNews) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("news")
        .delete()
        .eq("n_id", selectedNews.n_id);
      if (error) throw error;
      setIsDeleteDialogOpen(false);
      showAlert("success", "Article deleted successfully.");
      window.location.reload();
    } catch (err: any) {
      showAlert("error", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.n_title || !formData.n_description) {
      showAlert("error", "Title and Description are required.");
      return;
    }

    setIsSubmitting(true);
    let finalImageUrl = formData.n_img;

    try {
      // ✅ Handle Storage Upload if a new file is selected
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `news-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("news") // Ensure you have a 'news' bucket in Supabase
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("news").getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }

      const payload = { ...formData, n_img: finalImageUrl };

      if (isEditing && selectedNews) {
        const { error } = await supabase
          .from("news")
          .update(payload)
          .eq("n_id", selectedNews.n_id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("news").insert([payload]);
        if (error) throw error;
      }

      setIsOpen(false);
      window.location.reload();
    } catch (err: any) {
      showAlert("error", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );

  return (
    <Box bg="#F8FAFC" minH="100vh" p="8">
      <Container maxW="full">
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="md" color="gray.800">
            News Management
          </Heading>
          <Button bg="blue.600" color="white" onClick={handleOpenAdd} gap={2}>
            <Plus size={18} /> Add News
          </Button>
        </Flex>

        {statusMessage && (
          <Alert.Root
            status={statusMessage.type}
            mb={4}
            borderRadius="md"
            variant="solid"
          >
            <Alert.Indicator />
            <Alert.Title>{statusMessage.text}</Alert.Title>
          </Alert.Root>
        )}

        {/* --- TABLE --- */}
        <Box
          bg="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.100"
          boxShadow="sm"
          overflow="hidden"
        >
          <Table.Root>
            <Table.Header bg="gray.50">
              <Table.Row>
                <Table.ColumnHeader py={4}>Image</Table.ColumnHeader>
                <Table.ColumnHeader py={4}>Title</Table.ColumnHeader>
                <Table.ColumnHeader py={4}>Type</Table.ColumnHeader>
                <Table.ColumnHeader py={4} textAlign="right">
                  Actions
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {news.map((item) => (
                <Table.Row key={item.n_id}>
                  <Table.Cell py={4}>
                    <Image
                      src={item.n_img || "https://placehold.co/50"}
                      boxSize="50px"
                      borderRadius="md"
                      objectFit="cover"
                    />
                  </Table.Cell>
                  <Table.Cell fontWeight="medium">{item.n_title}</Table.Cell>
                  <Table.Cell fontSize="sm">{item.n_type}</Table.Cell>
                  <Table.Cell textAlign="right">
                    <HStack gap={2} justify="flex-end">
                      <Button
                        size="sm"
                        variant="subtle"
                        colorPalette="blue"
                        onClick={() => handleOpenEdit(item)}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="subtle"
                        colorPalette="red"
                        onClick={() => {
                          setSelectedNews(item);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>

        {/* --- DELETE CONFIRMATION DIALOG --- */}
        <Dialog.Root
          open={isDeleteDialogOpen}
          onOpenChange={(e) => setIsDeleteDialogOpen(e.open)}
          role="alertdialog"
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Delete News Article</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <Text>
                    Are you sure you want to delete{" "}
                    <strong>{selectedNews?.n_title}</strong>?
                  </Text>
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.ActionTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                  </Dialog.ActionTrigger>
                  <Button
                    colorPalette="red"
                    loading={isSubmitting}
                    onClick={confirmDelete}
                  >
                    Delete Forever
                  </Button>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>

        {/* --- ADD/EDIT DRAWER --- */}
        <Drawer.Root
          open={isOpen}
          onOpenChange={(e) => setIsOpen(e.open)}
          placement="end"
        >
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content
                bg="white"
                w={{ base: "100%", md: "700px" }}
                maxW="100vw"
                minW={{ md: "700px" }}
              >
                <Drawer.Header borderBottomWidth="1px" py={5}>
                  <Drawer.Title fontSize="xl">
                    {isEditing ? "Edit News" : "Add News"}
                  </Drawer.Title>
                </Drawer.Header>

                <Drawer.Body py={6}>
                  <VStack gap={5} align="stretch">
                    {/* ✅ Image Upload Section */}
                    <Box>
                      <Text fontWeight="bold" mb={2}>
                        News Image
                      </Text>
                      <Flex
                        border="2px dashed"
                        borderColor="gray.200"
                        p={4}
                        borderRadius="md"
                        align="center"
                        gap={4}
                      >
                        {previewUrl || formData.n_img ? (
                          <Box position="relative">
                            <Image
                              src={previewUrl || formData.n_img}
                              boxSize="120px"
                              objectFit="cover"
                              borderRadius="md"
                            />
                            <Button
                              size="xs"
                              colorPalette="red"
                              position="absolute"
                              top="-2"
                              right="-2"
                              borderRadius="full"
                              onClick={handleRemoveImage}
                            >
                              <X size={12} />
                            </Button>
                          </Box>
                        ) : (
                          <Flex
                            boxSize="120px"
                            bg="gray.50"
                            align="center"
                            justify="center"
                            borderRadius="md"
                          >
                            <ImageIcon color="gray" />
                          </Flex>
                        )}
                        <Box>
                          <Input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            variant="flushed"
                            onChange={handleImageSelect}
                          />
                          <Text fontSize="xs" color="gray.500" mt={2}>
                            Uploads when you save the news.
                          </Text>
                        </Box>
                      </Flex>
                    </Box>

                    <Box>
                      <Text fontWeight="bold" mb={2}>
                        News Title
                      </Text>
                      <Input
                        value={formData.n_title}
                        onChange={(e) =>
                          setFormData({ ...formData, n_title: e.target.value })
                        }
                        bg="gray.50"
                      />
                    </Box>
                    <HStack gap={4}>
                      <Box flex={1}>
                        <Text fontWeight="bold" mb={2}>
                          Author
                        </Text>
                        <Input
                          value={formData.n_author}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              n_author: e.target.value,
                            })
                          }
                          bg="gray.50"
                        />
                      </Box>
                      <Box flex={1}>
                        <Text fontWeight="bold" mb={2}>
                          Type
                        </Text>
                        <NativeSelect.Root>
                          <NativeSelect.Field
                            value={formData.n_type}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                n_type: e.target.value,
                              })
                            }
                            bg="gray.50"
                          >
                            <option value="General">General</option>
                            <option value="Urgent">Urgent</option>
                            <option value="Market">Market</option>
                          </NativeSelect.Field>
                        </NativeSelect.Root>
                      </Box>
                    </HStack>
                    <Box>
                      <Text fontWeight="bold" mb={2}>
                        Description
                      </Text>
                      <Textarea
                        value={formData.n_description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            n_description: e.target.value,
                          })
                        }
                        bg="gray.50"
                        rows={6}
                      />
                    </Box>
                  </VStack>
                </Drawer.Body>

                <Drawer.Footer borderTopWidth="1px">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    bg="blue.600"
                    color="white"
                    onClick={handleSubmit}
                    loading={isSubmitting}
                  >
                    {isEditing ? "Update News" : "Save News"}
                  </Button>
                </Drawer.Footer>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      </Container>
    </Box>
  );
}

export default AdminNewsManagement;
