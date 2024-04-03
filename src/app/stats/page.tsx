"use client";

import DatabaseStats from "@/components/DatabaseStats";
import { Box, Text } from "@chakra-ui/react";

const StatsPage = () => {
  return (
    <Box p={4}>
      <Text>
        Please note that these statistics are not reflective of all M+ runs -
        only the ones stored in the database.
      </Text>
      <DatabaseStats />
    </Box>
  );
};

export default StatsPage;
