import { initialData } from '@/app/constants';
import { useGameState } from '@/hooks/use-game';
import { useCallback, useEffect } from 'react';

const GameActions = () => {
    const {
    initializeGame,
    isStarted,
    isGameOver,
    moveBirdY,
    setGravityInterval,
    setIsStarted,
    clearGravityInterval,
    setTimer,
    setPipeMovementInterval,
  } = useGameState();

  const performMovement = useCallback(() => {
    console.log("performMovement", isGameOver);
    if (isGameOver) {
      // initializeGame({
      //   ...initialData,
      //   isStarted: false,
      //   isGameOver: false,
      // });
      return;
    }
    if (!isStarted) {
      initializeGame({
        ...initialData,
        isStarted: true,
        isGameOver: false,
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
    isGameOver,
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
      if (e.code === "Space" || e.code === "Enter" || e.code === "ArrowUp") {
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
  return null;
}

export default GameActions