import { GraphOptions } from "@/utils/types";
import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Switch,
  Text,
  Tooltip,
} from "@chakra-ui/react";

const GraphOptionsSelector = ({
  graphOptions,
  setGraphOptions,
}: {
  graphOptions: GraphOptions;
  setGraphOptions: (graphOptions: GraphOptions) => void;
}) => {
  const { showLabels, treeMode, radialMode, runBasedLinks } = graphOptions;

  return (
    <Box>
      <FormControl>
        <FormLabel>Graph Options</FormLabel>
        <HStack>
          <Tooltip label="Show character names instead of nodes">
            <Text>Show Labels:</Text>
          </Tooltip>
          <Switch
            id="showLabels"
            colorScheme="teal"
            isChecked={showLabels}
            onChange={(e) =>
              setGraphOptions({ ...graphOptions, showLabels: e.target.checked })
            }
          />

          <Tooltip label="Changes tree mode to be radial out">
            <Text>Radial Mode:</Text>
          </Tooltip>
          <Switch
            id="radialMode"
            colorScheme="teal"
            isChecked={radialMode}
            onChange={(e) =>
              setGraphOptions({ ...graphOptions, radialMode: e.target.checked })
            }
            isDisabled={!treeMode}
          />
          <Tooltip label="Calculate node distance based on number of runs between characters">
            <Text>Run-based Links:</Text>
          </Tooltip>
          <Switch
            id="treeMode"
            colorScheme="teal"
            isChecked={runBasedLinks}
            isDisabled={treeMode}
            onChange={(e) =>
              setGraphOptions({
                ...graphOptions,
                runBasedLinks: e.target.checked,
              })
            }
          />
          <Box>
            <Tooltip label="Changes how spread nodes are from each other">
              <Text fontSize="sm" display="inline" mr={2}>
                Node Spread
              </Text>
            </Tooltip>
            <Slider
              aria-label="slider-node-distance"
              defaultValue={100}
              min={0}
              max={200}
              step={1}
              isDisabled={treeMode}
              onChange={(value) =>
                setGraphOptions({ ...graphOptions, nodeForceStrength: -value })
              }
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>
          <Box>
            <Tooltip label="Changes the distance between nodes">
              <Text fontSize="sm" display="inline" mr={2}>
                Node Distance
              </Text>
            </Tooltip>
            <Slider
              aria-label="slider-node-distance"
              defaultValue={30}
              min={0}
              max={60}
              step={5}
              isDisabled={treeMode}
              onChange={(value) =>
                setGraphOptions({ ...graphOptions, linkDistance: value })
              }
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>
        </HStack>
      </FormControl>
    </Box>
  );
};

export default GraphOptionsSelector;
