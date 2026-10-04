"use client";

import { Avatar, Box, Text, VStack, HStack } from "@chakra-ui/react";
import type { PostWithData } from "@/hooks/usePosts";

export function SidebarList({ posts, emptyMessage, onPostClick }: { posts: PostWithData[]; emptyMessage: string; onPostClick: (post: PostWithData) => void }) {
  if (posts.length === 0) return <Text fontSize="sm" color="gray.500" fontStyle="italic">{emptyMessage}</Text>;
  return (
    <VStack align="stretch" gap={3}>
      {posts.map(post => (
        <Box key={post.id} onClick={() => onPostClick(post)} cursor="pointer">
          <HStack p={2} rounded="md" bg="gray.50" _hover={{ bg: "green.50", borderLeft: "4px solid", borderColor: "green.500" }} transition="all 0.2s">
            <Avatar.Root size="xs"><Avatar.Image src={post.users?.u_avatar || undefined} /></Avatar.Root>
            <VStack gap={0} align="start" w="100%">
              <Text fontSize="xs" fontWeight="bold" color="gray.800" truncate>{post.users?.u_name || "User"}</Text>
              <Text fontSize="xs" color="gray.500">{post.content}</Text>
            </VStack>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
}
