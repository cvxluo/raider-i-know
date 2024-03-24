import { Link, Spacer } from "@chakra-ui/react";
import { Box, Heading, Text } from "@chakra-ui/react";

const FAQPage = () => {
  return (
    <Box maxW="6xl" mx="auto" p={4}>
      <Heading>FAQ</Heading>
      <Box
        mt={4}
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="md"
      >
        <Heading size="md">
          Why are my runs/my characters not showing up?
        </Heading>
        <Text>
          Because of storage limitations, only top (usually 25+) runs from the
          season are tracked. Additionally, server transfers or name changes may
          affect the your runs. If you believe some bug or error is occuring,
          contact me at vexvex on Discord.
        </Text>
        <br />

        <Heading size="md">Where is the data from?</Heading>
        <Text>
          <Link href="https://raider.io/" isExternal color="teal.500">
            Raider IO
          </Link>{" "}
          and the{" "}
          <Link href="https://raider.io/api" isExternal color="teal.500">
            RIO API
          </Link>
        </Text>
        <br />

        <Heading size="md">
          How often is the data updated/when was this data taken?
        </Heading>
        <Text>The last snapshot was taken 3/1/2024.</Text>
        <br />

        <Heading size="md">Code?</Heading>
        <Text>
          Open sourced here:{" "}
          <Link
            href="https://github.com/cvxluo/raider-i-know"
            isExternal
            color="teal.500"
          >
            GitHub
          </Link>
        </Text>
        <br />

        <Heading size="md">Contact</Heading>
        <Text>
          Built by Vexea-Azshara (vexvex on Discord). Feel free to reach out
          with any feedback or questions!
        </Text>
      </Box>
    </Box>
  );
};

export default FAQPage;
