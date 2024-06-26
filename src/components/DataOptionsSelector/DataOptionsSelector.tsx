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

const DataOptionsSelector = ({
  graphOptions,
  setGraphOptions,
}: {
  graphOptions: GraphOptions;
  setGraphOptions: (graphOptions: GraphOptions) => void;
}) => {
  const { degree, runLimit, treeMode, radialMode } = graphOptions;

  return (
    <Box>
      <FormControl>
        <FormLabel>Data Options</FormLabel>
        <HStack>
          <Tooltip label="Number of degrees of separation">
            <Text>Degree:</Text>
          </Tooltip>
          <NumberInput
            width={100}
            defaultValue={3}
            min={1}
            max={6}
            onChange={(value) => {
              // this adds some extra clamping to degree
              // since changing degree can be very expensive both rendering and backend wise,
              // sending an invalid degree can be dangerous
              const val = parseInt(value || "0");
              const clampedVal = Math.min(6, Math.max(1, val));
              if (clampedVal !== degree)
                setGraphOptions({
                  ...graphOptions,
                  degree: clampedVal,
                });
            }}
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
            min={15}
            value={runLimit}
            onChange={(value) => {
              const val = parseInt(value || "0");
              if (val !== runLimit)
                setGraphOptions({
                  ...graphOptions,
                  runLimit: parseInt(value || "0"),
                });
            }}
          >
            <NumberInputField />

            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

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
        </HStack>
      </FormControl>
    </Box>
  );
};

export default DataOptionsSelector;
