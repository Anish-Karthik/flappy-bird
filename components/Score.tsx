import { useGameState } from "@/hooks/use-game";
import React, { useMemo } from "react";

const Score = () => {
  const { score } = useGameState();
  console.log(`Score: ${score}`);
  const scoreComponent = useMemo(() => {
    console.log("ScoreComponent");
    return (
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          color: "white",
          fontSize: 30,
        }}
      >
        Score: {score}
      </div>
    );
  }, [score]);
  return scoreComponent;
};

export default Score;
