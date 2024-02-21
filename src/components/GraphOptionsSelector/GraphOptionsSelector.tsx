import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Switch,
  Text,
} from "@chakra-ui/react";

const GraphOptionsSelector = () => {
  return (
    <Box>
      <FormControl>
        <FormLabel>Graph Options</FormLabel>
        <HStack>
          <Switch id="showLabels" colorScheme="teal" size="lg" />
          <Text>Degree:</Text>
          <NumberInput width={200}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          <Text>Run Limit:</Text>

          <NumberInput width={200}>
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
