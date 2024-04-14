"use client";

import TitleInfoGraphs from "@/components/TitleInfoGraphs";
import { Box, Link, Text } from "@chakra-ui/react";

const StatsPage = () => {
  return (
    <Box p={4}>
      <Text fontSize="xl" fontWeight="bold" textAlign="center">
        Title Key Level Tracker
      </Text>
      <Text fontSize="lg" fontWeight="bold">
        What does this do?
      </Text>
      <Text fontSize="sm">
        This page shows the distribution of keys that current title players have
        timed.
      </Text>
      <Box>
        <Text fontSize="sm">
          Credit to Orthus and their{" "}
          <Link
            isExternal
            color="teal.500"
            href="https://mplus-title-tracker.web.app/us"
          >
            M+ Title Tracker
          </Link>{" "}
          for the original idea - their information is most likely more accurate
          than this one.
        </Text>
        <Text fontSize="sm">
          Please note that these statistics are not reflective of all M+ runs -
          only the ones stored in the database.
        </Text>
      </Box>

      <TitleInfoGraphs />
    </Box>
  );
};

export default StatsPage;
