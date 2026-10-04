"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, Box, Button, HStack, IconButton, Input, Separator, Spinner, Text, VStack, Image as ChakraImage } from "@chakra-ui/react";
import { Image as ImageIcon, Smile, X } from "lucide-react";

export function CreatePostWidget({ onAddPost }: { onAddPost: (content: string, imageFile: File | null) => Promise<void> }) {
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const clearImage = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() && !selectedFile) return;
    setIsPosting(true);
    try {
      await onAddPost(input, selectedFile);
      setInput("");
      clearImage();
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Box bg="white" w="100%" boxShadow="sm" rounded="md" p={4} border="1px solid" borderColor="gray.200">
      <form onSubmit={handleSubmit}>
        <HStack gap={3} mb={3} align="start">
          <Avatar.Root size="md"><Avatar.Fallback name="You" /><Avatar.Image src="https://bit.ly/code-beast" /></Avatar.Root>
          <VStack w="full" align="stretch" gap={3}>
            <Input placeholder="What's on your mind?" bg="gray.100" border="none" borderRadius="xl" py={5} _focus={{ bg: "gray.200", outline: "none" }} value={input} onChange={e => setInput(e.target.value)} disabled={isPosting} />
            {previewUrl && (
              <Box position="relative" borderRadius="md" overflow="hidden" maxH="300px" bg="gray.50">
                <ChakraImage src={previewUrl} objectFit="contain" maxH="300px" mx="auto" />
                <IconButton aria-label="Remove" size="xs" position="absolute" top={2} right={2} bg="blackAlpha.600" color="white" onClick={clearImage}>
                  <X size={14} />
                </IconButton>
              </Box>
            )}
          </VStack>
        </HStack>
        <Separator mb={2} />
        <HStack justify="space-between" pt={1}>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
            const file = e.target.files?.[0];
            if (!file) return;
            setSelectedFile(file);
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(URL.createObjectURL(file));
          }} />
          <HStack flex={1}>
            <Button variant="ghost" color="gray.600" flex="1" onClick={() => fileInputRef.current?.click()} disabled={isPosting}>
              <ImageIcon color="#45BD62" size={24} /><Text ml={2} display={{ base: "none", sm: "block" }}>Photo</Text>
            </Button>
            <Button variant="ghost" color="gray.600" flex="1" disabled={isPosting}>
              <Smile color="#F7B928" size={24} /><Text ml={2} display={{ base: "none", sm: "block" }}>Activity</Text>
            </Button>
          </HStack>
          <Button type="submit" disabled={(!input.trim() && !selectedFile) || isPosting} bg={isPosting ? "gray.400" : "green.600"} color="white" _hover={{ bg: "green.700" }} minW="80px">
            {isPosting ? <Spinner size="sm" color="white" /> : "Post"}
          </Button>
        </HStack>
      </form>
    </Box>
  );
}
