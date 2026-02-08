"use client";

import React, { useState } from "react";
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
  Badge,
  Textarea,
  createToaster,
  Toaster,
} from "@chakra-ui/react";
import {
  Search,
  Bell,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  Store,
  Image as ImageIcon,
  X,
  AlertCircle,
} from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { createClient } from "@/utils/supabase/createClient";

// ✅ 1. Create Toaster Instance
const toaster = createToaster({
  placement: "top-end",
  pauseOnPageIdle: true,
});

function AdminMarketplaceCard() {
  const { products, loading, error } = useProducts();
  const supabase = createClient();

  // --- STATE ---
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "seeds", // Default value
    price: "",
    stock: "",
    image: "",
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  // --- HANDLERS ---

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedProduct(null);
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
    setIsEditing(true);
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      type: product.type || "seeds",
      price: product.price,
      stock: product.stock,
      image: product.image_url || "",
    });
    setIsOpen(true);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Image Upload Logic
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;

      setUploadingImage(true);
      const file = e.target.files[0];

      // Sanitize filename to avoid issues
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload
      const { error: uploadError } = await supabase.storage
        .from("products") // ⚠️ Ensure a bucket named 'products' exists and is Public
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get URL
      const { data } = supabase.storage.from("products").getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, image_url: data.publicUrl }));

      toaster.create({
        title: "Image uploaded successfully",
        type: "success",
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toaster.create({
        title: "Upload failed",
        description: error.message,
        type: "error",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  // ✅ Submit Logic (Add & Update)
  const handleSubmit = async () => {
    if (!formData.name || !formData.price) {
      toaster.create({ title: "Name and Price are required", type: "error" });
      return;
    }

    setIsSubmitting(true);

    // ⚠️ Data Type Conversion: HTML inputs give strings, DB usually wants numbers
    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    };

    try {
      if (isEditing && selectedProduct) {
        // --- UPDATE ---
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", selectedProduct.id);

        if (error) throw error;
        toaster.create({
          title: "Product updated successfully!",
          type: "success",
        });
      } else {
        // --- INSERT ---
        // Note: Remove 'id' if it exists in payload, let DB auto-increment
        const { error } = await supabase.from("products").insert([payload]);

        if (error) throw error;
        toaster.create({
          title: "Product added successfully!",
          type: "success",
        });
      }

      setIsOpen(false);
      window.location.reload(); // Simple reload to refresh table
    } catch (error: any) {
      console.error("Database Error:", error);
      toaster.create({
        title: "Operation failed",
        description: error.message || "Check your RLS policies in Supabase.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Delete Logic
  const handleDelete = async (id: number) => {
    // Custom confirm dialog could be used here
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;

      toaster.create({ title: "Product deleted", type: "success" });
      window.location.reload();
    } catch (error: any) {
      toaster.create({
        title: "Delete failed",
        description: error.message,
        type: "error",
      });
    }
  };

  // --- LOADING / ERROR UI ---
  if (loading)
    return (
      <Flex justify="center" p={10}>
        <Spinner color="blue.500" size="xl" />
      </Flex>
    );
  if (error) return <Box color="red.500">Error: {error.message}</Box>;

  return (
    <Box bg="#F8FAFC" minH="100vh" p="8">
      {/* ✅ Required for Toasts to appear */}
      <Toaster toaster={toaster}>
        {(toast) => (
          <Box
            bg={toast.type === "error" ? "red.500" : "green.500"}
            color="white"
            p={4}
            borderRadius="md"
          >
            {toast.title}
            {toast.description && (
              <Text fontSize="sm">{toast.description}</Text>
            )}
          </Box>
        )}
      </Toaster>

      <Container maxW="full">
        {/* Header */}
        <Flex justify="space-between" align="center" mb="6">
          <Heading size="md" color="gray.800">
            Product Management
          </Heading>
          <Button bg="blue.600" color="white" gap={2} onClick={handleOpenAdd}>
            <Plus size={18} /> Add New Product
          </Button>
        </Flex>

        {/* Product Table */}
        <Box
          bg="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.100"
          overflow="hidden"
        >
          <Table.Root size="md" interactive>
            <Table.Header bg="gray.50">
              <Table.Row>
                <Table.ColumnHeader color="gray.600">Image</Table.ColumnHeader>
                <Table.ColumnHeader color="gray.600">
                  Product Name
                </Table.ColumnHeader>
                <Table.ColumnHeader color="gray.600">Type</Table.ColumnHeader>
                <Table.ColumnHeader color="gray.600">Price</Table.ColumnHeader>
                <Table.ColumnHeader color="gray.600">Stock</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right" color="gray.600">
                  Actions
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {products.map((product) => (
                <Table.Row key={product.id}>
                  <Table.Cell>
                    <Image
                      src={product.image_url || "https://placehold.co/50x50"}
                      boxSize="50px"
                      borderRadius="md"
                      objectFit="cover"
                      alt={product.name}
                    />
                  </Table.Cell>
                  <Table.Cell fontWeight="bold">{product.name}</Table.Cell>
                  <Table.Cell>
                    <Badge colorPalette="blue">{product.type}</Badge>
                  </Table.Cell>
                  <Table.Cell>Rs. {product.price}</Table.Cell>
                  <Table.Cell>{product.stock}</Table.Cell>
                  <Table.Cell textAlign="right">
                    <HStack justify="flex-end">
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => handleOpenEdit(product)}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        colorPalette="red"
                        onClick={() => handleDelete(product.id)}
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

        {/* --- ADD/EDIT DRAWER --- */}
        <Drawer.Root
          open={isOpen}
          onOpenChange={(e) => setIsOpen(e.open)}
          placement="end"
          // You can also control size here in v3 using size="lg" or "xl"
          size="lg"
        >
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              {/* ✅ DRAWER WIDTH CHANGING STYLE 
                 Change 'w' or 'maxW' here to increase space. 
                 Example: w={{ base: "100%", md: "600px" }}
              */}
              <Drawer.Content
                bg="white"
                p={0}
                w={{ base: "100%", md: "600px" }}
              >
                <Drawer.Header borderBottom="1px solid gray">
                  <Flex justify="space-between" align="center">
                    <Drawer.Title>
                      {isEditing ? "Edit Product" : "Add New Product"}
                    </Drawer.Title>
                    <Drawer.CloseTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <X size={20} />
                      </Button>
                    </Drawer.CloseTrigger>
                  </Flex>
                </Drawer.Header>

                <Drawer.Body p={6}>
                  <VStack gap={5} align="stretch">
                    {/* Image Upload */}
                    <Box>
                      <Text mb={2} fontWeight="bold" fontSize="sm">
                        Product Image
                      </Text>
                      <Flex
                        align="center"
                        gap={4}
                        border="1px dashed"
                        borderColor="gray.300"
                        p={4}
                        borderRadius="md"
                      >
                        {formData.image ? (
                          <Image
                            src={formData.image}
                            boxSize="80px"
                            borderRadius="md"
                            objectFit="cover"
                          />
                        ) : (
                          <Box
                            boxSize="80px"
                            bg="gray.100"
                            borderRadius="md"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <ImageIcon size={24} color="gray" />
                          </Box>
                        )}
                        <Box>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            p={1}
                            variant="flushed"
                          />
                          {uploadingImage && (
                            <Text fontSize="xs" color="blue.500" mt={1}>
                              Uploading image...
                            </Text>
                          )}
                        </Box>
                      </Flex>
                    </Box>

                    {/* Name */}
                    <Box>
                      <Text mb={1} fontWeight="bold" fontSize="sm">
                        Name
                      </Text>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Product Name"
                      />
                    </Box>

                    {/* Description */}
                    <Box>
                      <Text mb={1} fontWeight="bold" fontSize="sm">
                        Description
                      </Text>
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Product details..."
                      />
                    </Box>

                    {/* Type - v3 NativeSelect Composition */}
                    <Box>
                      <Text mb={1} fontWeight="bold" fontSize="sm">
                        Type
                      </Text>
                      <NativeSelect.Root>
                        <NativeSelect.Field
                          name="type"
                          value={formData.type}
                          onChange={handleChange}
                        >
                          <option value="seeds">Seeds</option>
                          <option value="fertilizer">Fertilizer</option>
                          <option value="tools">Tools</option>
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                      </NativeSelect.Root>
                    </Box>

                    {/* Price & Stock */}
                    <HStack>
                      <Box flex={1}>
                        <Text mb={1} fontWeight="bold" fontSize="sm">
                          Price (Rs)
                        </Text>
                        <Input
                          name="price"
                          type="number"
                          value={formData.price}
                          onChange={handleChange}
                        />
                      </Box>
                      <Box flex={1}>
                        <Text mb={1} fontWeight="bold" fontSize="sm">
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

                <Drawer.Footer borderTop="1px solid" borderColor="gray.100">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    bg="blue.600"
                    color="white"
                    onClick={handleSubmit}
                    loading={isSubmitting}
                    _hover={{ bg: "blue.700" }}
                  >
                    {isEditing ? "Update Product" : "Create Product"}
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

export default AdminMarketplaceCard;
