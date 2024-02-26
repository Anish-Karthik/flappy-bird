import { gameSize } from "@/app/constants";
import { useGameState } from "@/hooks/use-game";
import Image from "next/image";
import React from "react";

const BottomPipe = () => {
  const { pipeSize, pipeCoords } = useGameState();
  return (
    <Image
      src={"/sprites/pipe-green.png"}
      alt="pipe"
      width={pipeSize.x * 2}
      height={pipeSize.y * 2}
      content="cover"
      className="z-10"
      style={{
        position: "absolute",
        top: gameSize.height - (pipeCoords.y - pipeCoords.offset),
        left: pipeCoords.x,
      }}
    />
  );
};

export default BottomPipe;
