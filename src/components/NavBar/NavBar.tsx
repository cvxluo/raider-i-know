import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

const NavLink = ({ text, href }: { text: string; href: string }) => {
  return (
    <Link href={href}>
      <Box _hover={{ bg: "gray.300" }} rounded={"md"}>
        <Text fontSize="xl" fontWeight="md" color="black" p={2} pt={3}>
          {text}
        </Text>
      </Box>
    </Link>
  );
};

const NavBar = () => {
  return (
    <Box
      bg="gray.200"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={1}
    >
      <Flex>
        <Text fontSize="2xl" fontWeight="bold" color="black" p={2}>
          Raider I Know
        </Text>
        <NavLink text="Home" href="/" />
      </Flex>
    </Box>
  );
};

export default NavBar;
