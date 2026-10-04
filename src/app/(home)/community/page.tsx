"use client";

import { useState } from "react";
import { Bookmark, User } from "lucide-react";
import { Box, Button, Flex, HStack, VStack } from "@chakra-ui/react";
import { usePosts, PostWithData } from "@/hooks/usePosts";
import { createClient } from "@/utils/supabase/createClient";
import { useUser } from "@/hooks/useUser";
import { CreatePostWidget } from "@/components/community/CreatePostWidget";
import {
  DesktopSidebarWidget,
  PostsDialog,
} from "@/components/community/PostsDialog";
import { PostsLoading } from "@/components/community/PostsLoading";
import { PostCard } from "@/components/community/PostCard";
import { SinglePostModal } from "@/components/community/SinglePostModal";

export default function Page() {
  const supabase = createClient();
  const { user } = useUser();
  const [selectedPost, setSelectedPost] = useState<PostWithData | null>(null);

  const {
    posts: allPosts,
    loading: allPostsLoading,
    refreshPosts: refreshAll,
  } = usePosts("all");
  const { posts: myPosts, refreshPosts: refreshMy } = usePosts("my_posts");
  const { posts: savedPosts, refreshPosts: refreshSaved } = usePosts("saved");

  const handleGlobalRefresh = () => {
    refreshAll();
    refreshMy();
    refreshSaved();
  };

  const addNewPost = async (content: string, imageFile: File | null) => {
    if (!user) return alert("Please login");
    let imageUrl: string | null = null;

    try {
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("posts")
          .upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        imageUrl = supabase.storage.from("posts").getPublicUrl(fileName)
          .data.publicUrl;
      }

      const { error } = await supabase
        .from("posts")
        .insert({ user_id: user.id, content, image: imageUrl });
      if (error) throw error;
      handleGlobalRefresh();
    } catch (error: any) {
      console.error(error);
      alert("Error creating post: " + error.message);
    }
  };

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

  const handleDeletePost = async (postId: number) => {
    try {
      const { error } = await supabase.from("posts").delete().eq("id", postId);
      if (error) throw error;
      setSelectedPost(null);
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

              {allPostsLoading ? (
                <PostsLoading />
              ) : allPosts.length === 0 ? (
                <Box py={10} textAlign="center" color="gray.500">
                  No posts yet. Be the first to share something!
                </Box>
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

        <SinglePostModal
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          post={selectedPost}
          onUpdate={handleUpdatePost}
          onDelete={handleDeletePost}
          onRefresh={handleGlobalRefresh}
        />
      </Box>
    </Box>
  );
}
