"use client";

import { useState } from "react";
import {
  Avatar, Box, Button, HStack, IconButton, Input, Separator, Text, VStack,
  Image as ChakraImage,
} from "@chakra-ui/react";
import { Bookmark, Leaf, MessageCircle, Send, Share2 } from "lucide-react";
import { createClient } from "@/utils/supabase/createClient";
import { useUser } from "@/hooks/useUser";
import type { PostWithData } from "@/hooks/usePosts";

export function PostCard({ post, onRefresh }: { post: PostWithData; onRefresh: () => void }) {
  const supabase = createClient();
  const { user } = useUser();
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleSave = async () => {
    if (!user) return alert("Please login");
    if (post.is_saved) {
      await supabase.from("saved_posts").delete().eq("user_id", user.id).eq("post_id", post.id);
    } else {
      await supabase.from("saved_posts").insert({ user_id: user.id, post_id: post.id });
    }
    onRefresh();
  };

  const handleLike = async () => {
    if (!user) return alert("Please login");
    if (post.is_liked) {
      await supabase.from("post_likes").delete().eq("user_id", user.id).eq("post_id", post.id);
    } else {
      await supabase.from("post_likes").insert({ user_id: user.id, post_id: post.id });
    }
    onRefresh();
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentInput.trim()) return;
    setIsSubmitting(true);
    try {
      await supabase.from("comments").insert({ user_id: user.id, post_id: post.id, content: commentInput });
      setCommentInput("");
      onRefresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box bg="white" w="100%" boxShadow="sm" rounded="md" p={4} border="1px solid" borderColor="gray.200">
      <HStack mb={3} justify="space-between" align="start">
        <HStack>
          <Avatar.Root>
            <Avatar.Fallback name={post.users?.u_name || "User"} />
            <Avatar.Image src={post.users?.u_avatar || undefined} />
          </Avatar.Root>
          <Box>
            <Text fontWeight="bold" color="gray.800" fontSize="sm">{post.users?.u_name || "Unknown User"}</Text>
            <Text fontSize="xs" color="gray.500">{new Date(post.created_at).toLocaleDateString()}</Text>
          </Box>
        </HStack>
        <IconButton
          variant="ghost" size="sm" aria-label="Save Post"
          color={post.is_saved ? "green.600" : "gray.400"}
          onClick={handleToggleSave}
          _hover={{ bg: "gray.100", color: post.is_saved ? "green.700" : "gray.600" }}
        >
          <Bookmark size={22} fill={post.is_saved ? "currentColor" : "none"} />
        </IconButton>
      </HStack>

      <Text color="gray.800" mb={3}>{post.content}</Text>

      {post.image && (
        <Box mb={4} borderRadius="md" overflow="hidden" border="1px solid" borderColor="gray.100">
          <ChakraImage src={post.image} alt="Post content" width="100%" objectFit="cover" maxH="400px" />
        </Box>
      )}

      <HStack justify="space-between" fontSize="sm" color="gray.500" mb={2}>
        <HStack gap={1}>
          <Box color="green.500"><Leaf size={16} fill={post.is_liked ? "currentColor" : "none"} /></Box>
          <Text>{post.likes_count}</Text>
        </HStack>
        <Text cursor="pointer" onClick={() => setShowComments(v => !v)} _hover={{ textDecoration: "underline" }}>
          {post.comments?.length || 0} comments
        </Text>
      </HStack>

      <Separator mb={2} />
      <HStack justify="space-around" mb={2}>
        <Button variant="ghost" color={post.is_liked ? "green.600" : "gray.600"} onClick={handleLike} flex="1">
          <Leaf size={20} fill={post.is_liked ? "currentColor" : "none"} />
          <Text ml={2}>{post.is_liked ? "Liked" : "Like"}</Text>
        </Button>
        <Button variant="ghost" color="gray.600" flex="1" onClick={() => setShowComments(v => !v)}>
          <MessageCircle size={20} /><Text ml={2}>Comment</Text>
        </Button>
        <Button variant="ghost" color="gray.600" flex="1">
          <Share2 size={20} /><Text ml={2}>Share</Text>
        </Button>
      </HStack>
      <Separator mb={4} />

      <VStack align="stretch" gap={3}>
        {showComments && post.comments?.map((comment: any, index: number) => (
          <HStack key={index} align="start" bg="gray.50" p={2} rounded="md">
            <Text fontWeight="bold" fontSize="xs" minW="60px" color="gray.700">{comment.users?.u_name || "User"}</Text>
            <Text fontSize="sm" color="gray.800">{comment.content}</Text>
          </HStack>
        ))}
        <form onSubmit={handleCommentSubmit}>
          <HStack mt={2}>
            <Avatar.Root size="xs"><Avatar.Fallback name="Me" /></Avatar.Root>
            <Input placeholder="Write a comment..." size="sm" borderRadius="full" value={commentInput} onChange={e => setCommentInput(e.target.value)} />
            <IconButton aria-label="Send" size="sm" variant="ghost" type="submit" disabled={!commentInput.trim() || isSubmitting}>
              <Send size={16} />
            </IconButton>
          </HStack>
        </form>
      </VStack>
    </Box>
  );
}
