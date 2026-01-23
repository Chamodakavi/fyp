import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Image,
  Text,
} from "@chakra-ui/react";
import { Calendar } from "lucide-react";

const NewsCard = ({ news }: { news: any }) => {
  return (
    <Box
      bg="#FDF6E3" // Matching beige color
      borderRadius="xl"
      overflow="hidden"
      boxShadow="sm"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-3px)", boxShadow: "md" }}
      w="100%"
    >
      <Flex direction={{ base: "column", sm: "row" }} h="100%">
        {/* Left: Image Section */}
        <Box
          w={{ base: "100%", sm: "200px" }}
          h={{ base: "150px", sm: "auto" }} // Fixed height on mobile, auto on desktop to stretch
          flexShrink={0}
        >
          <Image
            src={news.image}
            alt={news.title}
            w="100%"
            h="100%"
            objectFit="cover"
          />
        </Box>

        {/* Right: Content Section */}
        <Flex direction="column" p={5} flex={1} justify="space-between">
          <Box>
            <Flex justify="space-between" align="center" mb={2}>
              <Badge
                colorScheme="green"
                variant="solid"
                borderRadius="full"
                px={2}
                fontSize="0.7em"
              >
                {news.category}
              </Badge>
              <Flex align="center" gap={4} fontSize="xs" color="gray.500">
                <Flex align="center" gap={1}>
                  <Calendar size={12} />
                  <Text>{news.date}</Text>
                </Flex>
              </Flex>
            </Flex>

            <Heading size="md" color="#0F2B1D" mb={2} lineHeight="shorter">
              {news.title}
            </Heading>

            <Text fontSize="sm" color="gray.600">
              {news.description}
            </Text>
          </Box>

          {/* Bottom Right Button */}
          <Flex justify="flex-end" mt={3}>
            <Button
              size="xs"
              variant="outline"
              borderColor="#0F2B1D"
              color="#0F2B1D"
              _hover={{ bg: "#0F2B1D", color: "white" }}
              // rightIcon={<Icon as={ArrowRight} size={12} />}
              borderRadius="full"
              px={4}
            >
              Read More
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default NewsCard;
