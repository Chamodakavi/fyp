import { Flex, Spinner } from "@chakra-ui/react";

export function PostsLoading() {
  return <Flex w="100%" justify="center" align="center" py={10}><Spinner size="lg" color="green.600" /></Flex>;
}
