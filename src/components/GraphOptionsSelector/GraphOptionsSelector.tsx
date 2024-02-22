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
  graphOptions: {
    showLabels: boolean;
    degree: number;
    runLimit: number;
  };
  setGraphOptions: (graphOptions: {
    showLabels: boolean;
    degree: number;
    runLimit: number;
  }) => void;
}) => {
  const { showLabels, degree, runLimit } = graphOptions;

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
