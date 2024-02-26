import { useGameState } from "@/hooks/use-game";
import Image from "next/image";
import React from "react";

const TopPipe = () => {
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
        transform: "rotate(180deg)",
        position: "absolute",
        bottom: pipeCoords.y + pipeCoords.offset,
        left: pipeCoords.x,
      }}
    />
  );
};

export default TopPipe;
