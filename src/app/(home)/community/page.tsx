"use client";

import React, { useState } from "react";
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
} from "@chakra-ui/react";
import {
  Leaf,
  MessageCircle,
  Share2,
  Send,
  Image as ImageIcon,
  Smile,
  Bookmark,
} from "lucide-react";

const dummyPostsData = [
  {
    id: 1,
    author: "Saman Perera",
    avatar: "https://bit.ly/dan-abramov",
    time: "2 hrs ago",
    content:
      "Just harvested the first batch of organic carrots! 🥕 The rainy season really helped this time. #Farming #Organic #SriLanka",
    image:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    likes: 24,
    comments: [
      { user: "Kamal", text: "Great work Saman! Are you selling these?" },
      { user: "Nimal", text: "Looks fresh!" },
    ],
    saved: false,
  },
  {
    id: 2,
    author: "Nimali Silva",
    avatar: "https://bit.ly/prosper-baba",
    time: "5 hrs ago",
    content:
      "Looking for buyers for 500kg of Pumpkin. Harvest expected next week in Anuradhapura area. DM me if interested!",
    image: null,
    likes: 12,
    comments: [],
    saved: false,
  },
];

const CreatePostWidget = ({
  onAddPost,
}: {
  onAddPost: (content: string) => void;
}) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    onAddPost(input);
    setInput("");
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
      <HStack gap={3} mb={3}>
        <Avatar.Root size="md">
          <Avatar.Fallback name="You" />
          <Avatar.Image src="https://bit.ly/code-beast" />
        </Avatar.Root>
        <form style={{ width: "100%" }} onSubmit={handleSubmit}>
          <Input
            placeholder="What's on your mind, Chamoda?"
            bg="gray.100"
            border="none"
            borderRadius="full"
            py={5}
            _focus={{ bg: "gray.200", outline: "none" }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </form>
      </HStack>
      <Separator mb={2} />
      <HStack justify="space-around" pt={1}>
        <Button variant="ghost" color="gray.600" flex="1">
          <ImageIcon color="#45BD62" size={24} />
          <Text ml={2} display={{ base: "none", sm: "block" }}>
            Photo/Video
          </Text>
        </Button>
        <Button variant="ghost" color="gray.600" flex="1">
          <Smile color="#F7B928" size={24} />
          <Text ml={2} display={{ base: "none", sm: "block" }}>
            Feeling/Activity
          </Text>
        </Button>
      </HStack>
    </Box>
  );
};

const PostCard = ({
  post,
  onToggleSave,
}: {
  post: (typeof dummyPostsData)[0];
  onToggleSave: (postId: number) => void;
}) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [inputValue, setInputValue] = useState("");
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;
    setComments([...comments, { user: "You", text: inputValue }]);
    setInputValue("");
    if (!showComments) setShowComments(true);
  };

  return (
    <Box
      id={`post-${post.id}`}
      bg="white"
      w="100%"
      boxShadow="sm"
      rounded="md"
      p={4}
      border="1px solid"
      borderColor="gray.200"
    >
      {/* --- HEADER --- */}
      <HStack mb={3} justify="space-between" align="start">
        <HStack>
          <Avatar.Root>
            <Avatar.Fallback name={post.author} />
            <Avatar.Image src={post.avatar} />
          </Avatar.Root>
          <Box>
            <Text fontWeight="bold" color="gray.800" fontSize="sm">
              {post.author}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {post.time}
            </Text>
          </Box>
        </HStack>

        {/* --- SAVE BUTTON --- */}
        <IconButton
          variant="ghost"
          size="sm"
          color={post.saved ? "green.600" : "gray.400"}
          onClick={() => onToggleSave(post.id)}
          aria-label="Save Post"
          _hover={{
            bg: "gray.100",
            color: post.saved ? "green.700" : "gray.600",
          }}
        >
          <Bookmark size={22} fill={post.saved ? "currentColor" : "none"} />
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

      {/* Stats and Actions */}
      <HStack justify="space-between" fontSize="sm" color="gray.500" mb={2}>
        <HStack gap={1}>
          <Box color="green.500">
            <Leaf size={16} fill="currentColor" />
          </Box>
          <Text>{likeCount}</Text>
        </HStack>
        <Text
          cursor="pointer"
          onClick={() => setShowComments(!showComments)}
          _hover={{ textDecoration: "underline" }}
        >
          {comments.length} comments
        </Text>
      </HStack>

      <Separator mb={2} />

      <HStack justify="space-around" mb={2}>
        <Button
          variant="ghost"
          color={liked ? "green.600" : "gray.600"}
          onClick={handleLike}
          flex="1"
        >
          <Leaf size={20} fill={liked ? "currentColor" : "none"} />
          <Text ml={2}>Like</Text>
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
          comments.map((c, i) => (
            <HStack key={i} align="start" bg="gray.50" p={2} rounded="md">
              <Text
                fontWeight="bold"
                fontSize="xs"
                minW="40px"
                color="gray.700"
              >
                {c.user}
              </Text>
              <Text fontSize="sm" color="gray.800">
                {c.text}
              </Text>
            </HStack>
          ))}
        <form onSubmit={handleCommentSubmit}>
          <HStack mt={2}>
            <Avatar.Root size="xs">
              <Avatar.Fallback name="You" />
            </Avatar.Root>
            <Input
              placeholder="Write a comment..."
              size="sm"
              borderRadius="full"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setShowComments(true)}
            />
            <IconButton
              aria-label="Send"
              size="sm"
              variant="ghost"
              type="submit"
              disabled={!inputValue}
            >
              <Send size={16} />
            </IconButton>
          </HStack>
        </form>
      </VStack>
    </Box>
  );
};

// --- Saved Posts Sidebar  ---
const SavedPostsWidget = ({
  savedPosts,
}: {
  savedPosts: typeof dummyPostsData;
}) => {
  return (
    <Box
      bg="white"
      w="100%"
      boxShadow="sm"
      rounded="md"
      p={4}
      border="1px solid"
      borderColor="gray.200"
      position="sticky"
      top="20px"
    >
      <HStack mb={4} color="gray.700">
        <Bookmark size={20} fill="currentColor" />
        <Heading size="sm">Saved Posts</Heading>
      </HStack>

      {savedPosts.length === 0 ? (
        <Text fontSize="sm" color="gray.500" fontStyle="italic">
          You haven't saved any posts yet.
        </Text>
      ) : (
        <VStack align="stretch" gap={3}>
          {savedPosts.map((post: any) => (
            <Link
              key={post.id}
              href={`#post-${post.id}`}
              _hover={{ textDecoration: "none" }}
            >
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
                  <Avatar.Image src={post.avatar} />
                </Avatar.Root>
                <VStack gap={0} align="start" w="100%">
                  <Text fontSize="xs" fontWeight="bold" color="gray.800">
                    {post.author}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {post.content}
                  </Text>
                </VStack>
              </HStack>
            </Link>
          ))}
        </VStack>
      )}
    </Box>
  );
};

// ---  Main Page ---
function Page() {
  const [posts, setPosts] = useState(dummyPostsData);

  // Toggle Save Logic
  const toggleSavePost = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, saved: !post.saved } : post,
      ),
    );
  };

  const addNewPost = (content: string) => {
    const newPost = {
      id: Date.now(),
      author: "Chamoda",
      avatar: "https://bit.ly/code-beast",
      time: "Just now",
      content: content,
      image: null,
      likes: 0,
      comments: [],
      saved: false,
    };
    setPosts([newPost, ...posts]);
  };

  // Filter for the sidebar
  const savedPosts = posts.filter((post) => post.saved);

  return (
    <Box minH="100vh" bg="#D4F2C4" py={8} px={4}>
      {/* MAX WIDTH CONTAINER */}
      <Box maxW="1200px" mx="auto">
        {/* FLEX LAYOUT: Left (Feed) - Right (Sidebar) */}
        <Flex gap={8} direction={{ base: "column", lg: "row" }}>
          {/* --- LEFT COLUMN: FEED --- */}
          <Box flex={{ base: "1", lg: "2.5" }}>
            <VStack gap={6}>
              <CreatePostWidget onAddPost={addNewPost} />

              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onToggleSave={toggleSavePost}
                />
              ))}
            </VStack>
          </Box>

          {/* --- RIGHT COLUMN: SAVED POSTS (Hidden on mobile) --- */}
          <Box
            flex={{ base: "1", lg: "1" }}
            display={{ base: "none", lg: "block" }}
            minW="300px"
          >
            <SavedPostsWidget savedPosts={savedPosts} />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

export default Page;
