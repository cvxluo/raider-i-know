import { Box, Divider, Heading, Link, Text } from "@chakra-ui/react";

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
        <Heading size="md">What is this?</Heading>
        <Text>
          This site tracks {'"'}high{'"'} M+ runs from Season 3 of Dragonflight,
          and displays a graph of characters who frequently play with each other
          -{" "}
          <Link href="/rikexample.png" isExternal color="teal.500">
            example here
          </Link>
          . Enter a character to see their graph and then hover/click on nodes
          to see more information. To view a denser graph, turn Tree Mode off,
          and decrease the run limit - similarly, to view a sparser, more
          compact graph, increase the run limit.
        </Text>
        <Divider my={4} />

        <Heading size="md">
          Why are my runs/my characters not showing up?
        </Heading>
        <Text>
          Because of storage limitations, only top (usually 25+) runs from the
          season are tracked. Additionally, server transfers or name changes may
          affect your runs. If you believe some bug or error is occuring,
          contact me at vexvex on Discord.
        </Text>
        <Divider my={4} />

        <Heading size="md">The site is crashing!</Heading>
        <Text>
          Unfortunately, there simply is a lot of data to load, and the site may
          crash on slower devices. If you are looking to view large degrees
          (usually {">"}4), try increasing the run limit to reduce render times.
        </Text>
        <Divider my={4} />

        <Heading size="md">
          The site said my runs were loaded, but nothing is showing up?
        </Heading>
        <Text>
          Usually, this issue is caused by your character not having enough runs
          tracked, or not playing frequently enough with other characters such
          that the run limit filters your runs out.
        </Text>
        <Divider my={4} />

        <Heading size="md">Where is the data from?</Heading>
        <Text>
          All data is from{" "}
          <Link href="https://raider.io/" isExternal color="teal.500">
            Raider IO
          </Link>{" "}
          and the{" "}
          <Link href="https://raider.io/api" isExternal color="teal.500">
            RIO API
          </Link>
          .
        </Text>
        <Divider my={4} />

        <Heading size="md">
          Why don{"'"}t you have my character/all characters/Europe support?
        </Heading>
        <Text>
          Season 3 of DF (as of 3/28/2024) has around 10M runs total, while my
          database stores around 200K - around 2 orders of magnitude off.
          Additionally, the API is rate limited to 300 requests per minute, so
          pulling runs individually, without having access to bulk access
          methods such as the Raider IO API top run endpoint, would take a very
          long time. After this season, I plan to offer the runs collected this
          season as a backup, and reset the database for Season 4.
        </Text>

        <Divider my={4} />

        <Heading size="md">
          How often is the data updated/when was this data taken?
        </Heading>
        <Text>The last snapshot was taken 3/1/2024.</Text>
        <Divider my={4} />

        <Heading size="md">Code?</Heading>
        <Text>
          Open sourced here, contributions welcome:{" "}
          <Link
            href="https://github.com/cvxluo/raider-i-know"
            isExternal
            color="teal.500"
          >
            GitHub
          </Link>
        </Text>
        <Divider my={4} />

        <Heading size="md">Inspirations</Heading>
        <Text>Shoutout to other projects that inspired this one:</Text>
        <Text>
          -{" "}
          <Link href="https://threechest.io/" isExternal color="teal.500">
            Threechest.io
          </Link>{" "}
          by Ortemis
        </Text>
        <Text>
          -{" "}
          <Link href="https://not-even-close.com/" isExternal color="teal.500">
            Not Even Close
          </Link>{" "}
          also by Ortemis
        </Text>
        <Text>
          -{" "}
          <Link
            href="https://mplus-title-tracker.web.app/us"
            isExternal
            color="teal.500"
          >
            M+ Title Tracker
          </Link>{" "}
          by Orthrus
        </Text>
        <Text>
          -{" "}
          <Link
            href="(https://bestkeystone.com/statistics/dungeons"
            isExternal
            color="teal.500"
          >
            Best Keystone
          </Link>{" "}
          by SindreMA
        </Text>
        <Divider my={4} />

        <Heading size="md">Contact</Heading>
        <Text>
          This website was built by Vexea-Azshara (vexvex on Discord). Feel free
          to reach out with any feedback or questions!
        </Text>
      </Box>
    </Box>
  );
};

export default FAQPage;
