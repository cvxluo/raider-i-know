import { GraphOptions } from "@/utils/types";
import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Switch,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useState } from "react";

const GraphOptionsSelector = ({
  graphOptions,
  setGraphOptions,
}: {
  graphOptions: GraphOptions;
  setGraphOptions: (graphOptions: GraphOptions) => void;
}) => {
  const { showLabels, degree, runLimit, treeMode, radialMode } = graphOptions;

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

          <Tooltip label="Use tree mode for links">
            <Text>Tree Mode:</Text>
          </Tooltip>
          <Switch
            id="treeMode"
            colorScheme="teal"
            size="lg"
            isChecked={treeMode}
            onChange={(e) => {
              // radial mode is only available in tree mode, so we turn it off if tree mode is off
              setGraphOptions({
                ...graphOptions,
                treeMode: e.target.checked,
                radialMode: e.target.checked ? radialMode : false,
              });
            }}
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

          <Tooltip label="Number of degrees of separation">
            <Text>Degree:</Text>
          </Tooltip>
          <NumberInput
            width={100}
            defaultValue={2}
            min={1}
            max={6}
            onChange={(value) =>
              setGraphOptions({
                ...graphOptions,
                degree: parseInt(value || "0"),
              })
            }
            value={degree}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Tooltip label="Minimum number of runs for a character to be included">
            <Text>Run Limit:</Text>
          </Tooltip>
          <NumberInput
            width={100}
            defaultValue={15}
            min={1}
            value={runLimit}
            onChange={(value) =>
              setGraphOptions({
                ...graphOptions,
                runLimit: parseInt(value || "0"),
              })
            }
          >
            <NumberInputField />

            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </HStack>
      </FormControl>
    </Box>
  );
};

export default GraphOptionsSelector;
