import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Button,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Realms, Regions } from "@/utils/consts";

const CharacterSelector = ({ handleCharSubmit }) => {
  const [charInfo, setCharInfo] = useState({
    name: "",
    region: Regions[0],
    realm: Realms[0],
  });

  const [isError, setIsError] = useState(false);

  useEffect(() => {
    console.log(charInfo);
  }, [charInfo]);

  return (
    <Box>
      <FormControl>
        <FormLabel>Character</FormLabel>
        <HStack>
          <Input
            placeholder="Character Name"
            value={charInfo.name}
            onChange={(e) => setCharInfo({ ...charInfo, name: e.target.value })}
            isRequired
            isInvalid={isError}
          />
          <Select
            value={charInfo.realm}
            onChange={(e) =>
              setCharInfo({ ...charInfo, realm: e.target.value })
            }
            width={600}
          >
            {Realms.map((realm, index) => (
              <option key={index} value={realm}>
                {realm}
              </option>
            ))}
          </Select>
          <Select
            value={charInfo.region}
            onChange={(e) =>
              setCharInfo({ ...charInfo, region: e.target.value })
            }
            width={1200}
          >
            {Regions.map((region, index) => (
              <option key={index} value={region}>
                {region}
              </option>
            ))}
          </Select>
          <Button
            colorScheme="teal"
            width={400}
            onClick={() => {
              if (charInfo.name === "") {
                setIsError(true);
              } else {
                setIsError(false);
                handleCharSubmit(charInfo);
              }
            }}
          >
            Search
          </Button>
        </HStack>
      </FormControl>
    </Box>
  );
};

export default CharacterSelector;
