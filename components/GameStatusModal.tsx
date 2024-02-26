import { useGameState } from "@/hooks/use-game";
import React, { useMemo } from "react";
import { initialData } from "@/app/constants";
import { cn } from "@/lib/utils";

const GameStatusModal = () => {
  const { isGameOver, isStarted, initializeGame } = useGameState();
  const modal = useMemo(() => {
    console.log("render count");
    return (
      <div>
        {(isGameOver || !isStarted) && (
          <div
            className={cn(
              "inset-0 absolute z-50 text-blue-500",
              isGameOver && "bg-black/50"
            )}
            onClick={(e) => {
              console.log("click");
              if (!isGameOver) {
                return;
              }
              e.stopPropagation();
              initializeGame({
                ...initialData,
                isStarted: false,
                isGameOver: false,
              });
            }}
          >
            <div
              className="top-[50%] absolute left-[50%] flex flex-col items-center gap-5 w-full"
              style={{
                transform: "translate(-50%, -50%)",
              }}
            >
              {isGameOver && <h1 className="text-4xl font-bold">Game Over</h1>}
              <h1 className="text-3xl font-bold">
                Click to {isGameOver ? "restart" : "start"}
              </h1>
            </div>
          </div>
        )}
      </div>
    );
  }, [initializeGame, isGameOver, isStarted]);
  console.log("isGameOver", isGameOver);
  return modal;
};

export default GameStatusModal;
