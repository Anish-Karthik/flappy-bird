"use client";

import { initialData } from "@/app/constants";
import { useGameState } from "@/hooks/use-game";
import { useCallback, useEffect } from "react";
import BottomPipe from "./BottomPipe";
import Score from "./Score";
import TopPipe from "./TopPipe";
import Bird from "./bird";

const GameScreen = () => {
  const {
    initializeGame,
    isStarted,
    moveBirdY,
    setGravityInterval,
    setIsStarted,
    clearGravityInterval,
    setTimer,
    setPipeMovementInterval,
  } = useGameState();

  const performMovement = useCallback(() => {
    if (!isStarted) {
      initializeGame({
        ...initialData,
        isStarted: true,
      });
    } else if (isStarted) {
      console.log("jump");
      clearGravityInterval();
      moveBirdY(120);
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
    initializeGame(initialData);
  }, [initializeGame]);
  useEffect(() => {
    if (isStarted) {
      setPipeMovementInterval(50, 15);
      setGravityInterval(100, 0.9);
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
  }, [
    isStarted,
    performMovement,
    setGravityInterval,
    setIsStarted,
    setPipeMovementInterval,
    setTimer,
  ]);

  return (
    <main className="w-[400px] border-2 border-black mx-auto h-[640px] game relative overflow-hidden">
      <Score />
      <TopPipe />
      <Bird />
      <BottomPipe />
    </main>
  );
};

export default GameScreen;
