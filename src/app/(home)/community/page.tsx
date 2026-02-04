"use client";

import React, { useState, useRef } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Avatar,
  Separator,
  IconButton,
  Image as ChakraImage,
  Flex,
  Link,
  Heading,
  Dialog,
  Portal,
  Badge,
  Spinner,
  Textarea,
} from "@chakra-ui/react";
import {
  Leaf,
  MessageCircle,
  Share2,
  Send,
  Image as ImageIcon,
  Smile,
  Bookmark,
  User,
  ChevronRight,
  X,
  Trash2,
  Edit2,
  Save,
} from "lucide-react";
import { usePosts, PostWithData } from "@/hooks/usePosts";
import { createClient } from "@/utils/supabase/createClient";
import { useUser } from "@/hooks/useUser";

// --- 1. POST CARD (Moved UP so it can be used in the Modal) ---
const PostCard = ({
  post,
  onRefresh,
}: {
  post: PostWithData;
  onRefresh: () => void;
}) => {
  const supabase = createClient();
  const { user } = useUser();

  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- ACTIONS ---
  const handleToggleSave = async () => {
    if (!user) return alert("Please login");
    if (post.is_saved) {
      await supabase
        .from("saved_posts")
        .delete()
        .eq("user_id", user.id)
        .eq("post_id", post.id);
    } else {
      await supabase
        .from("saved_posts")
        .insert({ user_id: user.id, post_id: post.id });
    }
    onRefresh();
  };

  const handleLike = async () => {
    if (!user) return alert("Please login");
    if (post.is_liked) {
      await supabase
        .from("post_likes")
        .delete()
        .eq("user_id", user.id)
        .eq("post_id", post.id);
    } else {
      await supabase
        .from("post_likes")
        .insert({ user_id: user.id, post_id: post.id });
    }
    onRefresh();
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentInput.trim()) return;
    setIsSubmitting(true);
    await supabase
      .from("comments")
      .insert({ user_id: user.id, post_id: post.id, content: commentInput });
    setCommentInput("");
    setIsSubmitting(false);
    onRefresh();
  };

  return (
    <Box
      bg="white"
      w="100%"
      boxShadow="sm"
      rounded="md"
      p={4}
      border="1px solid"
      borderColor="gray.200"
    >
      <HStack mb={3} justify="space-between" align="start">
        <HStack>
          <Avatar.Root>
            <Avatar.Fallback name={post.users?.u_name || "User"} />
            <Avatar.Image src={post.users?.u_avatar || undefined} />
          </Avatar.Root>
          <Box>
            <Text fontWeight="bold" color="gray.800" fontSize="sm">
              {post.users?.u_name || "Unknown User"}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {new Date(post.created_at).toLocaleDateString()}
            </Text>
          </Box>
        </HStack>
        <IconButton
          variant="ghost"
          size="sm"
          color={post.is_saved ? "green.600" : "gray.400"}
          onClick={handleToggleSave}
          aria-label="Save Post"
          _hover={{
            bg: "gray.100",
            color: post.is_saved ? "green.700" : "gray.600",
          }}
        >
          <Bookmark size={22} fill={post.is_saved ? "currentColor" : "none"} />
        </IconButton>
      </HStack>
      <Text color="gray.800" mb={3} fontSize="md">
        {post.content}
      </Text>
      {post.image && (
        <Box
          mb={4}
          borderRadius="md"
          overflow="hidden"
          border="1px solid"
          borderColor="gray.100"
        >
          <ChakraImage
            src={post.image}
            alt="Post content"
            width="100%"
            objectFit="cover"
            maxH="400px"
          />
        </Box>
      )}
      <HStack justify="space-between" fontSize="sm" color="gray.500" mb={2}>
        <HStack gap={1}>
          <Box color="green.500">
            <Leaf size={16} fill={post.is_liked ? "currentColor" : "none"} />
          </Box>
          <Text>{post.likes_count}</Text>
        </HStack>
        <Text
          cursor="pointer"
          onClick={() => setShowComments(!showComments)}
          _hover={{ textDecoration: "underline" }}
        >
          {post.comments?.length || 0} comments
        </Text>
      </HStack>
      <Separator mb={2} />
      <HStack justify="space-around" mb={2}>
        <Button
          variant="ghost"
          color={post.is_liked ? "green.600" : "gray.600"}
          onClick={handleLike}
          flex="1"
        >
          <Leaf size={20} fill={post.is_liked ? "currentColor" : "none"} />
          <Text ml={2}>{post.is_liked ? "Liked" : "Like"}</Text>
        </Button>
        <Button
          variant="ghost"
          color="gray.600"
          flex="1"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle size={20} />
          <Text ml={2}>Comment</Text>
        </Button>
        <Button variant="ghost" color="gray.600" flex="1">
          <Share2 size={20} />
          <Text ml={2}>Share</Text>
        </Button>
      </HStack>
      <Separator mb={4} />
      <VStack align="stretch" gap={3}>
        {showComments &&
          post.comments?.map((c: any, i: number) => (
            <HStack key={i} align="start" bg="gray.50" p={2} rounded="md">
              <Text
                fontWeight="bold"
                fontSize="xs"
                minW="60px"
                color="gray.700"
              >
                {c.users?.u_name || "User"}
              </Text>
              <Text fontSize="sm" color="gray.800">
                {c.content}
              </Text>
            </HStack>
          ))}
        <form onSubmit={handleCommentSubmit}>
          <HStack mt={2}>
            <Avatar.Root size="xs">
              <Avatar.Fallback name="Me" />
            </Avatar.Root>
            <Input
              placeholder="Write a comment..."
              size="sm"
              borderRadius="full"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
            <IconButton
              aria-label="Send"
              size="sm"
              variant="ghost"
              type="submit"
              disabled={!commentInput || isSubmitting}
            >
              <Send size={16} />
            </IconButton>
          </HStack>
        </form>
      </VStack>
    </Box>
  );
};

// --- 2. SINGLE POST MODAL (Now Uses PostCard) ---
const SinglePostModal = ({
  isOpen,
  onClose,
  post,
  onUpdate,
  onDelete,
  onRefresh, // Added onRefresh Prop
}: {
  isOpen: boolean;
  onClose: () => void;
  post: PostWithData | null;
  onUpdate: (postId: number, newContent: string) => Promise<void>;
  onDelete: (postId: number) => Promise<void>;
  onRefresh: () => void;
}) => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (post) setEditContent(post.content);
    setIsEditing(false);
  }, [post, isOpen]);

  if (!post) return null;

  const isAuthor = user?.id === post.user_id;

  const handleSave = async () => {
    setLoading(true);
    await onUpdate(post.id, editContent);
    setLoading(false);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      setLoading(true);
      await onDelete(post.id);
      setLoading(false);
      onClose();
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="600px" p={0}>
            {/* Minimal Header just for Close Button */}
            <Dialog.Header pb={0}>
              <HStack justify="flex-end">
                <Dialog.CloseTrigger />
              </HStack>
            </Dialog.Header>

            <Dialog.Body p={4}>
              {/* EDIT MODE (Simplified for Text Edit) */}
              {isEditing ? (
                <VStack align="stretch" gap={4}>
                  <Heading size="sm">Edit Post</Heading>
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={5}
                  />
                  <HStack justify="flex-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditing(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="green"
                      bg="green.600"
                      color="white"
                      onClick={handleSave}
                      disabled={loading}
                    >
                      {loading ? <Spinner size="xs" /> : "Save Changes"}
                    </Button>
                  </HStack>
                </VStack>
              ) : (
                // VIEW MODE: RENDER THE FULL POSTCARD
                <Box>
                  <PostCard post={post} onRefresh={onRefresh} />

                  {/* ADMIN CONTROLS (Only for Author) */}
                  {isAuthor && (
                    <HStack
                      pt={4}
                      mt={4}
                      borderTop="1px solid"
                      borderColor="gray.100"
                      justify="flex-end"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit2 size={14} style={{ marginRight: "5px" }} /> Edit
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        bg="red.50"
                        color="red.600"
                        _hover={{ bg: "red.100" }}
                        onClick={handleDelete}
                      >
                        <Trash2 size={14} style={{ marginRight: "5px" }} />{" "}
                        Delete
                      </Button>
                    </HStack>
                  )}
                </Box>
              )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

// --- 3. SIDEBAR LIST ---
const SidebarList = ({
  posts,
  emptyMessage,
  onPostClick,
}: {
  posts: PostWithData[];
  emptyMessage: string;
  onPostClick: (post: PostWithData) => void;
}) => {
  if (posts.length === 0)
    return (
      <Text fontSize="sm" color="gray.500" fontStyle="italic">
        {emptyMessage}
      </Text>
    );
  return (
    <VStack align="stretch" gap={3}>
      {posts.map((post) => (
        <Box key={post.id} onClick={() => onPostClick(post)} cursor="pointer">
          <HStack
            p={2}
            rounded="md"
            bg="gray.50"
            _hover={{
              bg: "green.50",
              borderLeft: "4px solid",
              borderColor: "green.500",
            }}
            transition="all 0.2s"
          >
            <Avatar.Root size="xs">
              <Avatar.Image src={post.users?.u_avatar || undefined} />
            </Avatar.Root>
            <VStack gap={0} align="start" w="100%">
              <Text fontSize="xs" fontWeight="bold" color="gray.800" truncate>
                {post.users?.u_name || "User"}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {post.content}
              </Text>
            </VStack>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
};

// --- CREATE POST WIDGET ---
const CreatePostWidget = ({
  onAddPost,
}: {
  onAddPost: (content: string, imageFile: File | null) => Promise<void>;
}) => {
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() && !selectedFile) return;
    setIsPosting(true);
    await onAddPost(input, selectedFile);
    setInput("");
    clearImage();
    setIsPosting(false);
  };

  return (
    <Box
      bg="white"
      w="100%"
      boxShadow="sm"
      rounded="md"
      p={4}
      border="1px solid"
      borderColor="gray.200"
    >
      <HStack gap={3} mb={3} align="start">
        <Avatar.Root size="md">
          <Avatar.Fallback name="You" />
          <Avatar.Image src="https://bit.ly/code-beast" />
        </Avatar.Root>
        <form style={{ width: "100%" }} onSubmit={handleSubmit}>
          <VStack w="full" align="stretch" gap={3}>
            <Input
              placeholder="What's on your mind?"
              bg="gray.100"
              border="none"
              borderRadius="xl"
              py={5}
              _focus={{ bg: "gray.200", outline: "none" }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isPosting}
            />
            {previewUrl && (
              <Box
                position="relative"
                borderRadius="md"
                overflow="hidden"
                maxH="300px"
                bg="gray.50"
              >
                <ChakraImage
                  src={previewUrl}
                  objectFit="contain"
                  maxH="300px"
                  mx="auto"
                />
                <IconButton
                  aria-label="Remove"
                  size="xs"
                  position="absolute"
                  top={2}
                  right={2}
                  bg="blackAlpha.600"
                  color="white"
                  onClick={clearImage}
                >
                  <X size={14} />
                </IconButton>
              </Box>
            )}
          </VStack>
        </form>
      </HStack>
      <Separator mb={2} />
      <HStack justify="space-between" pt={1}>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileSelect}
          title="Upload image"
        />
        <HStack flex={1}>
          <Button
            variant="ghost"
            color="gray.600"
            flex="1"
            onClick={() => fileInputRef.current?.click()}
            disabled={isPosting}
          >
            <ImageIcon color="#45BD62" size={24} />
            <Text ml={2} display={{ base: "none", sm: "block" }}>
              Photo
            </Text>
          </Button>
          <Button
            variant="ghost"
            color="gray.600"
            flex="1"
            disabled={isPosting}
          >
            <Smile color="#F7B928" size={24} />
            <Text ml={2} display={{ base: "none", sm: "block" }}>
              Activity
            </Text>
          </Button>
        </HStack>
        <Button
          onClick={() => handleSubmit({ preventDefault: () => {} } as any)}
          disabled={(!input.trim() && !selectedFile) || isPosting}
          bg={isPosting ? "gray.400" : "green.600"}
          color="white"
          _hover={{ bg: "green.700" }}
          minW="80px"
        >
          {isPosting ? <Spinner size="sm" color="white" /> : "Post"}
        </Button>
      </HStack>
    </Box>
  );
};

// --- WRAPPERS FOR MODALS ---
const PostsDialog = ({
  trigger,
  title,
  icon,
  posts,
  emptyMessage,
  onPostClick,
}: {
  trigger: React.ReactNode;
  title: string;
  icon: React.ReactNode;
  posts: PostWithData[];
  emptyMessage: string;
  onPostClick: (post: PostWithData) => void;
}) => (
  <Dialog.Root>
    <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <HStack>
              {icon}
              <Heading size="md">{title}</Heading>
            </HStack>
            <Dialog.CloseTrigger />
          </Dialog.Header>
          <Dialog.Body>
            <SidebarList
              posts={posts}
              emptyMessage={emptyMessage}
              onPostClick={onPostClick}
            />
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root>
);

const DesktopSidebarWidget = ({
  title,
  icon,
  posts,
  emptyMessage,
  onPostClick,
}: {
  title: string;
  icon: React.ReactNode;
  posts: PostWithData[];
  emptyMessage: string;
  onPostClick: (post: PostWithData) => void;
}) => (
  <PostsDialog
    title={title}
    icon={icon}
    posts={posts}
    emptyMessage={emptyMessage}
    onPostClick={onPostClick}
    trigger={
      <Box
        bg="white"
        w="100%"
        boxShadow="sm"
        rounded="md"
        p={4}
        border="1px solid"
        borderColor="gray.200"
        cursor="pointer"
        _hover={{ borderColor: "green.500", bg: "green.50" }}
        transition="all 0.2s"
      >
        <HStack justify="space-between" mb={2}>
          <HStack color="gray.700">
            {icon}
            <Heading size="sm">{title}</Heading>
          </HStack>
          <Badge
            colorPalette="green"
            variant="solid"
            borderRadius="full"
            px={2}
          >
            {posts.length}
          </Badge>
        </HStack>
        <HStack justify="space-between" color="gray.500">
          <Text fontSize="xs">Click to view all items</Text>
          <ChevronRight size={16} />
        </HStack>
      </Box>
    }
  />
);

// --- MAIN PAGE ---
function Page() {
  const supabase = createClient();
  const { user } = useUser();

  // State for opening the Single Post Modal
  const [selectedPost, setSelectedPost] = useState<PostWithData | null>(null);

  const { posts: allPosts, refreshPosts: refreshAll } = usePosts("all");
  const { posts: myPosts, refreshPosts: refreshMy } = usePosts("my_posts");
  const { posts: savedPosts, refreshPosts: refreshSaved } = usePosts("saved");

  const handleGlobalRefresh = () => {
    refreshAll();
    refreshMy();
    refreshSaved();
  };

  // Add Post Handler
  const addNewPost = async (content: string, imageFile: File | null) => {
    if (!user) return alert("Please login");
    let imageUrl = null;
    try {
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("posts")
          .upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from("posts").getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }
      const { error } = await supabase
        .from("posts")
        .insert({ user_id: user.id, content: content, image: imageUrl });
      if (error) throw error;
      handleGlobalRefresh();
    } catch (error: any) {
      console.error(error);
      alert("Error creating post: " + error.message);
    }
  };

  // Update Post Handler
  const handleUpdatePost = async (postId: number, newContent: string) => {
    try {
      const { error } = await supabase
        .from("posts")
        .update({ content: newContent })
        .eq("id", postId);

      if (error) throw error;

      if (selectedPost)
        setSelectedPost({ ...selectedPost, content: newContent });

      handleGlobalRefresh();
    } catch (error: any) {
      alert("Error updating post: " + error.message);
    }
  };

  // Delete Post Handler
  const handleDeletePost = async (postId: number) => {
    try {
      const { error } = await supabase.from("posts").delete().eq("id", postId);

      if (error) throw error;

      setSelectedPost(null); // Close modal
      handleGlobalRefresh();
    } catch (error: any) {
      alert("Error deleting post: " + error.message);
    }
  };

  return (
    <Box minH="100vh" bg="#D4F2C4" py={8} px={4}>
      <Box maxW="1200px" mx="auto">
        <Flex gap={8} direction={{ base: "column", lg: "row" }}>
          <Box flex={{ base: "1", lg: "2.5" }}>
            <VStack gap={6}>
              <CreatePostWidget onAddPost={addNewPost} />

              <HStack display={{ base: "flex", lg: "none" }} w="full" gap={4}>
                <PostsDialog
                  title="My Posts"
                  icon={<User size={20} />}
                  posts={myPosts}
                  emptyMessage="You haven't posted anything yet."
                  onPostClick={setSelectedPost}
                  trigger={
                    <Button flex={1} variant="outline" bg="white">
                      <User size={18} /> My Posts
                    </Button>
                  }
                />
                <PostsDialog
                  title="Saved Posts"
                  icon={<Bookmark size={20} />}
                  posts={savedPosts}
                  emptyMessage="You haven't saved any posts yet."
                  onPostClick={setSelectedPost}
                  trigger={
                    <Button flex={1} variant="outline" bg="white">
                      <Bookmark size={18} /> Saved Posts
                    </Button>
                  }
                />
              </HStack>

              {allPosts.length === 0 ? (
                <Text color="gray.500" textAlign="center" py={10}>
                  No posts yet. Be the first to share something!
                </Text>
              ) : (
                allPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onRefresh={handleGlobalRefresh}
                  />
                ))
              )}
            </VStack>
          </Box>

          <Box
            flex={{ base: "1", lg: "1" }}
            display={{ base: "none", lg: "block" }}
            minW="300px"
          >
            <VStack gap={6} position="sticky" top="20px">
              <DesktopSidebarWidget
                title="My Posts"
                icon={<User size={20} fill="currentColor" />}
                posts={myPosts}
                emptyMessage="You haven't posted anything yet."
                onPostClick={setSelectedPost}
              />
              <DesktopSidebarWidget
                title="Saved Posts"
                icon={<Bookmark size={20} fill="currentColor" />}
                posts={savedPosts}
                emptyMessage="You haven't saved any posts yet."
                onPostClick={setSelectedPost}
              />
            </VStack>
          </Box>
        </Flex>

        {/* --- 3. RENDER THE SINGLE POST MODAL --- */}
        <SinglePostModal
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          post={selectedPost}
          onUpdate={handleUpdatePost}
          onDelete={handleDeletePost}
          onRefresh={handleGlobalRefresh} // Pass refresh handler
        />
      </Box>
    </Box>
  );
}

export default Page;
