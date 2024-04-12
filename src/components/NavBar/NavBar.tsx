import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

const Links = [
  { text: "Home", href: "/" },
  { text: "Database Statistics", href: "/stats" },
  { text: "Character Info", href: "/character" },
  { text: "FAQ", href: "/faq" },
  { text: "Title Tracker", href: "/title-tracker" },
];

const NavLink = ({ text, href }: { text: string; href: string }) => {
  return (
    <Link href={href}>
      <Box _hover={{ bg: "gray.300" }} rounded={"md"} ml={2}>
        <Text fontSize="xl" fontWeight="md" color="black" p={1}>
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
      <Flex p={2}>
        <Text fontSize="2xl" fontWeight="bold" color="black" pl={2} pr={2}>
          Raider I Know
        </Text>
        {Links.map((link) => (
          <NavLink key={link.text} text={link.text} href={link.href} />
        ))}
      </Flex>
    </Box>
  );
};

export default NavBar;
