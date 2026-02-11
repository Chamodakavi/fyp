"use client";

import React, { useState, useRef, useEffect } from "react";
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
  Drawer,
  Portal,
  NativeSelect,
  Spinner,
  Dialog,
  Alert, // ✅ Added Alert Component
} from "@chakra-ui/react";
import { Plus, Pencil, Trash2, Image as ImageIcon, X } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { createClient } from "@/utils/supabase/createClient";

function AdminMarketplaceCard() {
  const { products, loading } = useProducts();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- STATE ---
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // ✅ New Simple Alert State
  const [status, setStatus] = useState<{
    type: "success" | "error";
    title: string;
    description?: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "seeds",
    price: "",
    stock: "",
    image: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // ✅ Auto-hide alert after 5 seconds
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // --- HANDLERS ---

  const handleOpenAdd = () => {
    setStatus(null); // Clear previous alerts
    setIsEditing(false);
    setSelectedProduct(null);
    setImageFile(null);
    setPreviewUrl("");
    setFormData({
      name: "",
      description: "",
      type: "seeds",
      price: "",
      stock: "",
      image: "",
    });
    setIsOpen(true);
  };

  const handleOpenEdit = (product: any) => {
    setStatus(null);
    setIsEditing(true);
    setSelectedProduct(product);
    setImageFile(null);
    setPreviewUrl("");
    setFormData({
      name: product.name,
      description: product.description || "",
      type: product.type || "seeds",
      price: product.price,
      stock: product.stock,
      image: product.image || "",
    });
    setIsOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (file.size > 2 * 1024 * 1024) {
      // ✅ Set Alert instead of Toaster
      setStatus({
        type: "error",
        title: "File too large",
        description: "Keep it under 2MB",
      });
      return;
    }
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl("");
    setFormData((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ✅ CONFIRM DELETE HANDLER
  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsSubmitting(true);
    setStatus(null); // Clear previous alerts

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productToDelete.id);
      if (error) throw error;

      // ✅ Success Alert
      setStatus({
        type: "success",
        title: "Product Deleted",
        description: `${productToDelete.name} has been removed.`,
      });

      setIsDeleteOpen(false);

      // Optional: Delay reload slightly so user sees the alert
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      setStatus({
        type: "error",
        title: "Delete Failed",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setStatus(null);
    if (!formData.name || !formData.price) {
      setStatus({ type: "error", title: "Required fields missing" });
      return;
    }

    setIsSubmitting(true);
    let finalImageUrl = formData.image;

    try {
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage
          .from("products")
          .getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }

      const basePayload = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        price: Number(formData.price),
        stock: Number(formData.stock),
        image: finalImageUrl,
      };

      if (isEditing && selectedProduct) {
        const { error } = await supabase
          .from("products")
          .update(basePayload)
          .eq("id", selectedProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert([basePayload]);
        if (error) throw error;
      }

      setIsOpen(false);
      // ✅ Success Alert
      setStatus({
        type: "success",
        title: isEditing ? "Product Updated" : "Product Added",
        description: "Your changes have been saved successfully.",
      });

      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      setStatus({
        type: "error",
        title: "Error saving product",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <Flex justify="center" p={10}>
        <Spinner color="blue.500" />
      </Flex>
    );

  return (
    <Box bg="gray.50" minH="100vh" p="8">
      <Container maxW="6xl">
        {/* ✅ ALERT COMPONENT (Replaces Toaster) */}
        {status && (
          <Alert.Root status={status.type} mb={6} variant="surface">
            <Alert.Indicator />
            <Box flex="1">
              <Alert.Title>{status.title}</Alert.Title>
              {status.description && (
                <Alert.Description>{status.description}</Alert.Description>
              )}
            </Box>
            <Button size="xs" variant="ghost" onClick={() => setStatus(null)}>
              <X size={16} />
            </Button>
          </Alert.Root>
        )}

        <Flex justify="space-between" mb="6">
          <Heading size="md">Marketplace Admin</Heading>
          <Button bg="blue.600" color="white" onClick={handleOpenAdd} gap={2}>
            <Plus size={16} /> Add Product
          </Button>
        </Flex>

        <Box
          bg="white"
          borderRadius="lg"
          shadow="sm"
          overflow="hidden"
          border="1px solid"
          borderColor="gray.200"
        >
          <Table.Root variant="line">
            <Table.Header bg="gray.50">
              <Table.Row>
                <Table.ColumnHeader>Preview</Table.ColumnHeader>
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader>Price</Table.ColumnHeader>
                <Table.ColumnHeader>Stock</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">
                  Actions
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {products.map((p) => (
                <Table.Row key={p.id}>
                  <Table.Cell>
                    <Image
                      src={p.image || "https://placehold.co/40"}
                      boxSize="40px"
                      borderRadius="md"
                      objectFit="cover"
                    />
                  </Table.Cell>
                  <Table.Cell fontWeight="medium">{p.name}</Table.Cell>
                  <Table.Cell>Rs. {p.price}</Table.Cell>
                  <Table.Cell>{p.stock}</Table.Cell>
                  <Table.Cell textAlign="right">
                    <HStack justify="flex-end" gap={1}>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => handleOpenEdit(p)}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        colorPalette="red"
                        onClick={() => {
                          setProductToDelete(p);
                          setIsDeleteOpen(true);
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
          open={isDeleteOpen}
          onOpenChange={(e) => setIsDeleteOpen(e.open)}
          role="alertdialog"
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Delete Product</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <Text>
                    Are you sure you want to delete{" "}
                    <strong>{productToDelete?.name}</strong>? This action cannot
                    be undone.
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
                    Delete
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
                <Drawer.Header borderBottomWidth="1px">
                  <Drawer.Title>
                    {isEditing ? "Edit Product" : "Add Product"}
                  </Drawer.Title>
                </Drawer.Header>
                <Drawer.Body py={6}>
                  <VStack gap={5} align="stretch">
                    <Box>
                      <Text textStyle="sm" fontWeight="bold" mb={2}>
                        Product Photo
                      </Text>
                      <Flex
                        border="2px dashed"
                        borderColor="gray.200"
                        p={4}
                        borderRadius="md"
                        align="center"
                        gap={4}
                      >
                        {previewUrl || formData.image ? (
                          <Box position="relative">
                            <Image
                              src={previewUrl || formData.image}
                              boxSize="100px"
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
                            boxSize="100px"
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
                            Upload triggers on save.
                          </Text>
                        </Box>
                      </Flex>
                    </Box>
                    <Box>
                      <Text textStyle="sm" fontWeight="bold" mb={1}>
                        Product Name
                      </Text>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </Box>
                    <Box>
                      <Text textStyle="sm" fontWeight="bold" mb={1}>
                        Category
                      </Text>
                      <NativeSelect.Root>
                        <NativeSelect.Field
                          name="type"
                          value={formData.type}
                          onChange={handleChange}
                        >
                          <option value="seeds">Seeds</option>
                          <option value="tools">Tools</option>
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                      </NativeSelect.Root>
                    </Box>
                    <HStack gap={4}>
                      <Box flex={1}>
                        <Text textStyle="sm" fontWeight="bold" mb={1}>
                          Price
                        </Text>
                        <Input
                          name="price"
                          type="number"
                          value={formData.price}
                          onChange={handleChange}
                        />
                      </Box>
                      <Box flex={1}>
                        <Text textStyle="sm" fontWeight="bold" mb={1}>
                          Stock
                        </Text>
                        <Input
                          name="stock"
                          type="number"
                          value={formData.stock}
                          onChange={handleChange}
                        />
                      </Box>
                    </HStack>
                  </VStack>
                </Drawer.Body>
                <Drawer.Footer borderTopWidth="1px">
                  <Button variant="ghost" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    bg="blue.600"
                    color="white"
                    loading={isSubmitting}
                    onClick={handleSubmit}
                  >
                    Save Changes
                  </Button>
                </Drawer.Footer>
                <Drawer.CloseTrigger asChild>
                  <Button variant="ghost" position="absolute" top="2" right="2">
                    <X size={20} />
                  </Button>
                </Drawer.CloseTrigger>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      </Container>
    </Box>
  );
}

export default AdminMarketplaceCard;
