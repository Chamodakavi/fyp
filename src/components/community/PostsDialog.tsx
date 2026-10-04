"use client";

import { Badge, Box, Button, Dialog, Heading, HStack, Portal, Text } from "@chakra-ui/react";
import { ChevronRight } from "lucide-react";
import type { PostWithData } from "@/hooks/usePosts";
import { SidebarList } from "./SidebarList";

export function PostsDialog({ trigger, title, icon, posts, emptyMessage, onPostClick }: {
  trigger: React.ReactNode; title: string; icon: React.ReactNode; posts: PostWithData[]; emptyMessage: string; onPostClick: (post: PostWithData) => void;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <HStack>{icon}<Heading size="md">{title}</Heading></HStack>
              <Dialog.CloseTrigger />
            </Dialog.Header>
            <Dialog.Body><SidebarList posts={posts} emptyMessage={emptyMessage} onPostClick={onPostClick} /></Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export function DesktopSidebarWidget({ title, icon, posts, emptyMessage, onPostClick }: {
  title: string; icon: React.ReactNode; posts: PostWithData[]; emptyMessage: string; onPostClick: (post: PostWithData) => void;
}) {
  return (
    <PostsDialog
      title={title} icon={icon} posts={posts} emptyMessage={emptyMessage} onPostClick={onPostClick}
      trigger={
        <Box bg="white" w="100%" boxShadow="sm" rounded="md" p={4} border="1px solid" borderColor="gray.200" cursor="pointer" _hover={{ borderColor: "green.500", bg: "green.50" }} transition="all 0.2s">
          <HStack justify="space-between" mb={2}>
            <HStack color="gray.700">{icon}<Heading size="sm">{title}</Heading></HStack>
            <Badge colorPalette="green" variant="solid" borderRadius="full" px={2}>{posts.length}</Badge>
          </HStack>
          <HStack justify="space-between" color="gray.500"><Text fontSize="xs">Click to view all items</Text><ChevronRight size={16} /></HStack>
        </Box>
      }
    />
  );
}
