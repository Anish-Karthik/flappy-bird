"use client";

import { useGameState } from "@/hooks/use-game";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import Bird from "./bird";

export const birdSize = {
  width: 50,
  height: 50,
};
export const gameSize = {
  width: 400,
  height: 640,
};

const GameScreen = () => {
  const {
    initializeGame,
    isStarted,
    moveBirdY,
    setGravityInterval,
    setIsStarted,
    clearGravityInterval,
    setTimer,
  } = useGameState();

  const performMovement = useCallback(() => {
    if (!isStarted) {
      initializeGame({
        birdSize: {
          x: birdSize.width / 2,
          y: birdSize.height / 2,
        },
        birdImage: "/sprites/bluebird-midflap.png",
        birdCoords: {
          x: 200 - birdSize.width / 2,
          y: 320 + birdSize.height / 2,
        },
        bottom: 0,
        top: gameSize.height,
        ySpeed: 0,
        isStarted: true,
        isGameOver: false,
      });
    } else if (isStarted) {
      console.log("jump");
      clearGravityInterval();
      moveBirdY(150);
      setGravityInterval(100, 1);
    }
  }, [
    clearGravityInterval,
    initializeGame,
    isStarted,
    moveBirdY,
    setGravityInterval,
  ]);

  useEffect(() => {
    initializeGame({
      birdSize: {
        x: birdSize.width / 2,
        y: birdSize.height / 2,
      },
      birdImage: "/sprites/bluebird-midflap.png",
      birdCoords: {
        x: 200 - birdSize.width / 2,
        y: 320 + birdSize.height / 2,
      },
      bottom: 0,
      top: gameSize.height,
      ySpeed: 0,
      isStarted: false,
      isGameOver: false,
    });
  }, [initializeGame]);
  useEffect(() => {
    if (isStarted) {
      setGravityInterval(100, 1);
      setTimer(200);
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        performMovement();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.onclick = performMovement;
    return () => {
      window.onclick = null;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isStarted, performMovement, setGravityInterval, setIsStarted, setTimer]);

  return (
    <main className="w-[400px] border-2 border-black mx-auto h-[640px] game relative">
      <div>
        <Bird />
      </div>
    </main>
  );
};

export default GameScreen;
