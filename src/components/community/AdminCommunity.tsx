"use client";

import React, { useState } from "react";
import {
  Box,
  Flex,
  HStack,
  Text,
  VStack,
  Button,
  Input,
  NativeSelect,
  Avatar,
  Container,
  Spinner,
  createToaster,
  Toaster,
  Dialog, // ✅ Imported Dialog components
  Portal,
} from "@chakra-ui/react";
import { Search, Trash2, AlertTriangle } from "lucide-react";
import { usePosts } from "@/hooks/usePosts";
import { createClient } from "@/utils/supabase/createClient";

// ✅ Create Toaster Instance
const toaster = createToaster({
  placement: "top-end",
  pauseOnPageIdle: true,
});

function AdminCommunity() {
  const { posts, loading, refreshPosts } = usePosts("all");
  const supabase = createClient();

  // --- LOCAL STATE ---
  const [searchQuery, setSearchQuery] = useState("");

  // Stores the ID of the post selected for deletion. If null, dialog is closed.
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false); // Loading state for the API call

  // ✅ 1. Search Logic (Client-Side Filtering)
  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase();
    const contentMatch = post.content.toLowerCase().includes(query);
    const userMatch = post.users?.u_name?.toLowerCase().includes(query);
    return contentMatch || userMatch;
  });

  // ✅ 2. Open Delete Confirmation
  const promptDelete = (postId: number) => {
    setPostToDelete(postId);
  };

  // ✅ 3. Execute Delete (Called from Dialog)
  const handleConfirmDelete = async () => {
    if (!postToDelete) return;

    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postToDelete);

      if (error) throw error;

      toaster.create({
        title: "Post deleted successfully",
        type: "success",
      });

      // Refresh list and close dialog
      await refreshPosts();
      setPostToDelete(null);
    } catch (error: any) {
      console.error("Delete error:", error);
      toaster.create({
        title: "Error deleting post",
        description: error.message,
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Box bg="#F8FAFC" minH="100vh" p="8">
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
        {/* --- FILTERS SECTION --- */}
        <Flex gap={4} mb={8} wrap="wrap" align="center">
          <NativeSelect.Root width="200px" variant="subtle">
            <NativeSelect.Field bg="white" h="45px">
              <option value="all">All Posts</option>
              <option value="reported" disabled>
                Reported Posts (Coming Soon)
              </option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>

          <Box flex="1" position="relative">
            <Input
              placeholder="Search by content or username..."
              bg="white"
              h="45px"
              pl="10"
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Box position="absolute" left="3" top="13px">
              <Search size={18} color="#94A3B8" />
            </Box>
          </Box>
        </Flex>

        {/* --- POST CARDS LIST --- */}
        {loading ? (
          <Flex justify="center" p={10}>
            <Spinner color="blue.500" size="xl" />
          </Flex>
        ) : (
          <VStack gap={4} w="full">
            {filteredPosts.length === 0 ? (
              <Flex
                direction="column"
                align="center"
                justify="center"
                py={10}
                color="gray.500"
              >
                <Search
                  size={40}
                  strokeWidth={1.5}
                  style={{ marginBottom: "10px", opacity: 0.5 }}
                />
                <Text>No posts found matching "{searchQuery}"</Text>
              </Flex>
            ) : (
              filteredPosts.map((post) => (
                <Box
                  key={post.id}
                  w="full"
                  bg="white"
                  p={6}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="gray.100"
                  boxShadow="sm"
                >
                  <Flex justify="space-between" align="start">
                    <HStack gap={4} align="start" flex={1}>
                      {/* Avatar */}
                      <Avatar.Root size="md">
                        <Avatar.Image src={post.users?.u_avatar || undefined} />
                        <Avatar.Fallback name={post.users?.u_name || "U"} />
                      </Avatar.Root>

                      <VStack align="start" gap={1} maxW="80%">
                        {/* User Name */}
                        <Text fontWeight="bold" color="gray.800">
                          {post.users?.u_name || "Unknown User"}
                        </Text>

                        {/* Post Content */}
                        <Text fontSize="md" color="gray.700">
                          {post.content}
                        </Text>

                        {/* Post Image (If exists) */}
                        {post.image && (
                          <Box
                            mt={2}
                            borderRadius="md"
                            overflow="hidden"
                            maxH="200px"
                          >
                            <img
                              src={post.image}
                              alt="Post content"
                              style={{
                                maxWidth: "100%",
                                maxHeight: "200px",
                                objectFit: "cover",
                              }}
                            />
                          </Box>
                        )}

                        {/* Date & Stats */}
                        <HStack gap={3} mt={1}>
                          <Text
                            fontSize="xs"
                            color="gray.400"
                            fontWeight="medium"
                          >
                            Posted{" "}
                            {new Date(post.created_at).toLocaleDateString()}
                          </Text>
                          <Text fontSize="xs" color="gray.400">
                            • {post.likes_count} Likes
                          </Text>
                        </HStack>
                      </VStack>
                    </HStack>

                    {/* Delete Trigger */}
                    <Button
                      colorPalette="red"
                      variant="solid"
                      size="sm"
                      h="40px"
                      px={6}
                      borderRadius="md"
                      _hover={{ bg: "red.600" }}
                      onClick={() => promptDelete(post.id)}
                    >
                      <Trash2 size={16} style={{ marginRight: "8px" }} />
                      Delete
                    </Button>
                  </Flex>
                </Box>
              ))
            )}
          </VStack>
        )}
      </Container>

      {/* ✅ DELETE CONFIRMATION DIALOG */}
      <Dialog.Root
        open={!!postToDelete}
        onOpenChange={(e) => !e.open && setPostToDelete(null)}
        placement="center"
        role="alertdialog"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <HStack gap={2} color="red.600">
                  <AlertTriangle size={20} />
                  <Dialog.Title>Delete Post</Dialog.Title>
                </HStack>
              </Dialog.Header>
              <Dialog.Body>
                <Text color="gray.600">
                  Are you sure you want to delete this post? This action cannot
                  be undone and will remove the post permanently from the
                  timeline.
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" disabled={isDeleting}>
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  colorPalette="red"
                  onClick={handleConfirmDelete}
                  loading={isDeleting}
                >
                  Confirm Delete
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
}

export default AdminCommunity;
