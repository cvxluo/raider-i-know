import { GraphOptions } from "@/utils/types";
import {
  Box,
  FormControl,
  FormLabel,
  HStack,
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
  const { showLabels, treeMode, radialMode } = graphOptions;

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
            size="lg"
            isChecked={showLabels}
            onChange={(e) =>
              setGraphOptions({ ...graphOptions, showLabels: e.target.checked })
            }
          />

          <Tooltip label="Changes tree mode to be radial out">
            <Text>Radial Mode</Text>
          </Tooltip>
          <Switch
            id="radialMode"
            colorScheme="teal"
            size="lg"
            isChecked={radialMode}
            onChange={(e) =>
              setGraphOptions({ ...graphOptions, radialMode: e.target.checked })
            }
            isDisabled={!treeMode}
          />
        </HStack>
      </FormControl>
    </Box>
  );
};

export default GraphOptionsSelector;
