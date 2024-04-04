import {
  Button,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
} from "@chakra-ui/react";

import { Character, Run } from "@/utils/types";

import { DungeonIdToName, DungeonIds } from "@/utils/consts";
import { useRouter } from "next/navigation";

const CharGraphModal = ({
  isOpen,
  onClose,
  selectedNode,
  graphInfo,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedNode: Character | null;
  graphInfo: {
    layers: Character[][];
    linkCounts: { [key: number]: { [key: number]: number } };
    runs: { [key: number]: Run[] };
  };
}) => {
  const router = useRouter();

  const mostPlayedWith = (char: Character, n = 5) => {
    const linkCounts = graphInfo.linkCounts[char.id as number];
    if (!linkCounts) {
      return [];
    }
    return Object.entries(linkCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([id, count]) => {
        return [
          graphInfo.layers.flat().find((c) => c.id === parseInt(id))?.name,
          count,
        ];
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {selectedNode ? selectedNode.name : "Character not found"}
        </ModalHeader>
        <ModalCloseButton />
        {selectedNode &&
          graphInfo.runs &&
          graphInfo.runs[selectedNode.id as number] && (
            <ModalBody>
              <Text as="b">
                Number of runs in database:{" "}
                {graphInfo.runs[selectedNode.id as number].length}
              </Text>
              <br />
              <Text as="b">Most Frequently Played With:</Text>
              <br />
              <UnorderedList>
                {
                  // shows most played with characters
                  mostPlayedWith(selectedNode as Character).map(
                    ([char, count]) => {
                      return (
                        <ListItem key={char}>
                          {char} ({count})
                        </ListItem>
                      );
                    },
                  )
                }
              </UnorderedList>
              <Text as="b"># Runs Per Dungeon:</Text>
              <br />
              <UnorderedList>
                {
                  // shows how many runs for each dungeon
                  DungeonIds.map((dungeonId) => {
                    return (
                      <ListItem key={dungeonId}>
                        {DungeonIdToName[dungeonId]}:{" "}
                        {
                          graphInfo.runs[selectedNode.id as number].filter(
                            (run) => run.dungeon.id === dungeonId,
                          ).length
                        }
                      </ListItem>
                    );
                  })
                }
              </UnorderedList>
            </ModalBody>
          )}

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              if (selectedNode) router.push(`/character/${selectedNode.id}`);
            }}
          >
            More Info
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CharGraphModal;
