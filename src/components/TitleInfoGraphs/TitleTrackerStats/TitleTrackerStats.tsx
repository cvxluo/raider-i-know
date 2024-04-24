import { TitleInfo } from "@/utils/types";
import {
  Box,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";

const TitleTrackerStats = ({ titleInfo }: { titleInfo: TitleInfo }) => {
  console.log(titleInfo.title_range_chars);
  return (
    <Box>
      <StatGroup>
        <Stat>
          <StatLabel>Title Score</StatLabel>
          <StatNumber>{titleInfo.title_score}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Number of Title Players</StatLabel>
          <StatNumber>{titleInfo.num_title_players}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Number of Title Players Tracked</StatLabel>
          <StatNumber>{titleInfo.num_title_range_chars_tracked}</StatNumber>
          <StatHelpText>
            {Math.round(
              Math.abs(
                (titleInfo.num_title_range_chars_tracked -
                  titleInfo.num_title_players) /
                  titleInfo.num_title_players,
              ) * 100,
            )}
            % error
          </StatHelpText>
        </Stat>
      </StatGroup>
    </Box>
  );
};

export default TitleTrackerStats;
