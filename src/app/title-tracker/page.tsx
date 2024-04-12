"use client";

import TitleInfoGraphs from "@/components/TitleInfoGraphs/TitleInfoGraphs";
import { Box, Link, Text } from "@chakra-ui/react";

const StatsPage = () => {
  return (
    <Box p={4}>
      <Text>
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
      <Text>
        Please note that these statistics are not reflective of all M+ runs -
        only the ones stored in the database.
      </Text>
      <TitleInfoGraphs />
    </Box>
  );
};

export default StatsPage;
