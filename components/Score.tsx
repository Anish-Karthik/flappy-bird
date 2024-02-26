import { useGameState } from "@/hooks/use-game";
import React from "react";

const Score = () => {
  const { score } = useGameState();
  return <div>Score: {score}</div>;
};

export default Score;
