"use client";

import { useEffect, useState } from "react";
import { Box, Button, Dialog, Heading, HStack, Portal, Spinner, Textarea } from "@chakra-ui/react";
import { Edit2, Trash2 } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import type { PostWithData } from "@/hooks/usePosts";
import { PostCard } from "./PostCard";

export function SinglePostModal({ isOpen, onClose, post, onUpdate, onDelete, onRefresh }: {
  isOpen: boolean; onClose: () => void; post: PostWithData | null;
  onUpdate: (postId: number, newContent: string) => Promise<void>;
  onDelete: (postId: number) => Promise<void>; onRefresh: () => void;
}) {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (post) setEditContent(post.content);
    setIsEditing(false);
  }, [post, isOpen]);

  if (!post) return null;
  const isAuthor = user?.id === post.user_id;

  const handleSave = async () => {
    setLoading(true);
    try { await onUpdate(post.id, editContent); setIsEditing(false); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    setLoading(true);
    try { await onDelete(post.id); onClose(); }
    finally { setLoading(false); }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={e => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="600px" p={0}>
            <Dialog.Header pb={0}><HStack justify="flex-end"><Dialog.CloseTrigger /></HStack></Dialog.Header>
            <Dialog.Body p={4}>
              {isEditing ? (
                <Box>
                  <Heading size="sm" mb={4}>Edit Post</Heading>
                  <Textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={5} />
                  <HStack justify="flex-end" mt={4}>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} disabled={loading}>Cancel</Button>
                    <Button size="sm" bg="green.600" color="white" onClick={handleSave} disabled={loading}>{loading ? <Spinner size="xs" /> : "Save Changes"}</Button>
                  </HStack>
                </Box>
              ) : (
                <Box>
                  <PostCard post={post} onRefresh={onRefresh} />
                  {isAuthor && (
                    <HStack pt={4} mt={4} borderTop="1px solid" borderColor="gray.100" justify="flex-end">
                      <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}><Edit2 size={14} /> Edit</Button>
                      <Button size="sm" bg="red.50" color="red.600" _hover={{ bg: "red.100" }} onClick={handleDelete} disabled={loading}>
                        {loading ? <Spinner size="xs" /> : <><Trash2 size={14} /> Delete</>}
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
}
