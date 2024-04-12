import { getLatestTitleInfo } from "@/actions/mongodb/title";
import { Button } from "@chakra-ui/react";

const TitleInfoGraphs = () => {
  return (
    <div>
      <h1>Graphs</h1>
      <Button
        onClick={() => {
          getLatestTitleInfo().then((res) => {
            console.log(res);
          });
        }}
      >
        Get Latest Title Info
      </Button>
    </div>
  );
};

export default TitleInfoGraphs;
