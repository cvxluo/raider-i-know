import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import {
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderMark,
} from "@chakra-ui/react";

const RunLevelRangeSlider = ({
  range,
  setRange,
  minLevel,
  maxLevel,
}: {
  range: number[];
  setRange: (range: number[]) => void;
  minLevel: number;
  maxLevel: number;
}) => {
  console.log(range);
  return (
    <Box>
      <RangeSlider
        aria-label={["min", "max"]}
        min={minLevel}
        max={maxLevel}
        colorScheme="teal"
        defaultValue={[minLevel, maxLevel]}
        value={range}
        onChange={(values) => {
          setRange(values);
        }}
        mb={4}
      >
        <RangeSliderMark value={minLevel} mt="2" fontSize="sm">
          {minLevel}
        </RangeSliderMark>
        <RangeSliderMark value={maxLevel} mt="2" ml="-2.5" fontSize="sm">
          {maxLevel}
        </RangeSliderMark>
        <RangeSliderMark value={range[0]} textAlign="center" mt="-8" ml="-2.5">
          {range[0]}
        </RangeSliderMark>
        <RangeSliderMark value={range[1]} textAlign="center" mt="-8" ml="-2.5">
          {range[1]}
        </RangeSliderMark>

        <RangeSliderTrack>
          <RangeSliderFilledTrack />
        </RangeSliderTrack>
        <RangeSliderThumb index={0} />
        <RangeSliderThumb index={1} />
      </RangeSlider>
    </Box>
  );
};

export default RunLevelRangeSlider;
