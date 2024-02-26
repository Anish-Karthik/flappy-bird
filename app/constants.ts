import { GameState } from "@/hooks/use-game";

export const birdSize = {
  width: 50,
  height: 50,
};
export const gameSize = {
  width: 400,
  height: 640,
};

export const rodSize = {
  x: 80,
  y: 300,
  offset: 80,
};

export const initialData: Partial<GameState> = {
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
  pipeSize: {
    x: rodSize.x / 2,
    y: rodSize.y / 2,
  },
  pipeCoords: {
    x: gameSize.width,
    y: rodSize.y,
    offset: rodSize.offset,
  },
};
