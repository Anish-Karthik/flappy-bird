"use client";
import { gameSize } from "@/app/constants";
import { useGameState } from "@/hooks/use-game";
import Image from "next/image";
import React, { useMemo } from "react";

const Bird = () => {
  const { birdImage, birdSize, birdCoords, rotate } = useGameState();
  console.log(birdImage);
  const bird = useMemo(() => {
    console.log("Bird");
    return (
      <Image
        src={birdImage}
        width={birdSize.x * 2}
        height={birdSize.y * 2}
        alt="bird"
        style={{
          position: "absolute",
          transform: `rotate(${rotate}deg)`,
          top: gameSize.height - birdCoords.y,
          left: birdCoords.x,
        }}
      />
    );
  }, [birdCoords.x, birdCoords.y, birdImage, birdSize.x, birdSize.y, rotate]);
  return bird;
};

export default Bird;
