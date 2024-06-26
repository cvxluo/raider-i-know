import { Realms, Regions } from "@/utils/consts";
import { Character, Realm, Region } from "@/utils/types";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";

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

  return (
    <Box>
      <FormControl>
        <FormLabel>Character</FormLabel>
        <HStack>
          <Input
            placeholder="Character Name"
            value={charInfo.name}
            onChange={(e) => {
              const nameCapitalized =
                e.target.value.charAt(0).toUpperCase() +
                e.target.value.slice(1).toLowerCase();
              setCharInfo({ ...charInfo, name: nameCapitalized });
            }}
            isRequired
            isInvalid={isError}
            width="40%"
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
            width="20%"
          >
            {Realms.sort((realm1, realm2) => {
              if (realm1.name < realm2.name) {
                return -1;
              }
              if (realm1.name > realm2.name) {
                return 1;
              }
              return 0;
            }).map((realm, index) => (
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
            width="25%"
          >
            {Regions.map((region, index) => (
              <option key={index} value={region.name}>
                {region.name}
              </option>
            ))}
          </Select>
          <Button
            colorScheme="teal"
            width="15%"
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
