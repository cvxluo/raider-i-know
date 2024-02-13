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
import { Character, Realm, Region } from "@/utils/types";

const CharacterSelector = ({
  handleCharSubmit,
}: {
  handleCharSubmit: (charInfo: Character) => void;
}) => {
  const [charInfo, setCharInfo] = useState<Character>({
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
            value={charInfo.realm.name}
            onChange={(e) =>
              setCharInfo({
                ...charInfo,
                realm: Realms.find(
                  (realm) => e.target.value === realm.name,
                ) as Realm,
              })
            }
            width={600}
          >
            {Realms.map((realm, index) => (
              <option key={index} value={realm.name}>
                {realm.name}
              </option>
            ))}
          </Select>
          <Select
            value={charInfo.region.name}
            onChange={(e) =>
              setCharInfo({
                ...charInfo,
                region: Regions.find(
                  (region) => e.target.value === region.name,
                ) as Region,
              })
            }
            width={1200}
          >
            {Regions.map((region, index) => (
              <option key={index} value={region.name}>
                {region.name}
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