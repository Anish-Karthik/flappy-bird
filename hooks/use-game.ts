import { gameSize, rodSize } from "@/app/constants";
import { create } from "zustand";

type Point = { x: number; y: number };
const birdImage = [
  "/sprites/bluebird-midflap.png",
  "/sprites/bluebird-downflap.png",
  "/sprites/bluebird-midflap.png",
  "/sprites/bluebird-upflap.png",
];

function doOverlap(l1: Point, r1: Point, l2: Point, r2: Point) {
  // if rectangle has area 0, no overlap
  if (l1.x == r1.x || l1.y == r1.y || r2.x == l2.x || l2.y == r2.y)
    return false;

  // If one rectangle is on left side of other
  if (l1.x > r2.x || l2.x > r1.x) {
    return false;
  }

  // If one rectangle is above other
  if (r1.y > l2.y || r2.y > l1.y) {
    return false;
  }

  return true;
}

const getRectangle = (
  coords: { x: number; y: number },
  size: { x: number; y: number }
) => {
  return {
    topLeft: { x: coords.x - size.x, y: coords.y + size.y },
    topRight: { x: coords.x + size.x, y: coords.y + size.y },
    bottomLeft: { x: coords.x - size.x, y: coords.y - size.y },
    bottomRight: { x: coords.x + size.x, y: coords.y - size.y },
  };
};

export type GameState = {
  time: number;
  bottom: number;
  top: number;
  birdImage: string;
  isStarted: boolean;
  ySpeed: number;

  isGameOver: boolean;
  score: number;
  birdSize: { x: number; y: number };
  birdCoords: { x: number; y: number };

  pipeSize: { x: number; y: number };
  pipeCoords: { x: number; y: number; offset: number };

  pipeMovementInterval: NodeJS.Timeout | null;
  gravityInterval: NodeJS.Timeout | null;
  pipeRadomizationInterval: NodeJS.Timeout | null;
  timerInterval: NodeJS.Timeout | null;
};

type UseGameState = GameState & {
  clearTimer: () => void;
  setTimer: (time: number) => void;
  setIsGameOver: (isGameOver: boolean) => void;
  setScore: (score: number) => void;

  moveBirdY: (dy: number) => void;

  setBirdSize: (size: { x: number; y: number }) => void;
  setBirdCoords: (coords: { x: number; y: number }) => void;
  setPipeSize: (size: { x: number; y: number }) => void;
  setPipeCoords: (coords: { x: number; y: number; offset: number }) => void;

  setPipeMovementInterval: (time: number, dx: number) => void;
  setGravityInterval: (time: number, dy: number) => void;

  clearGravityInterval: () => void;

  isCrossed: () => boolean;

  isHittingBottom: () => boolean;
  isHittingPipe: () => boolean;

  initializeGame: (game: Partial<GameState>) => void;
  stopGame: () => void;
  
  setIsStarted: (isStarted: boolean) => void;
  setSpeed: (ySpeed: number) => void;
  setBirdImage: (image: string) => void;
};

export const useGameState = create<UseGameState>((set, get) => ({
  bottom: 0,
  top: 0,
  birdImage: "/sprites/bluebird-midflap.png",
  isGameOver: false,
  ySpeed: 0,
  isStarted: false,
  score: 0,
  birdSize: { x: 0, y: 0 },
  pipeSize: { x: 0, y: 0 },

  birdCoords: { x: 0, y: 0 },
  pipeCoords: { x: 0, y: 0, offset: 80 },

  pipeMovementInterval: null,
  gravityInterval: null,
  pipeRadomizationInterval: null,
  time: 0,
  timerInterval: null,

  setBirdImage: (birdImage: string) => set({ birdImage }),
  setIsGameOver: (isGameOver: boolean) => set({ isGameOver }),
  initializeGame: (game) => set({ ...game, time: 0, score: 0 }),
  clearTimer: () => {
    set((state) => {
      if (state.timerInterval) {
        clearInterval(state.timerInterval);
      }
      return { ...state, timerInterval: null };
    });
  },
  setTimer: (time: number) => {
    if (get().timerInterval && get().isStarted) {
      return;
    }
    set({
      timerInterval: setInterval(() => {
        set((state) => {
          console.log(state.time);
          return {
            ...state,
            time: state.time + 1,
            birdImage: birdImage[state.time % 4],
          };
        });
      }, time),
    });
  },

  clearGravityInterval: () =>
    set((state) => {
      if (state.gravityInterval) {
        clearInterval(state.gravityInterval);
      }
      return { ...state, gravityInterval: null, ySpeed: 0 };
    }),
  isHittingPipe: () => {
    const { birdCoords, birdSize, pipeCoords, pipeSize } = get();
    const { topLeft, bottomRight } = getRectangle(birdCoords, birdSize);
    return (
      doOverlap(
        topLeft,
        bottomRight,
        { x: pipeCoords.x, y: pipeCoords.y - 1.5 * pipeCoords.offset },
        { x: pipeCoords.x + pipeSize.x * 2, y: 0 }
      ) ||
      doOverlap(
        topLeft,
        bottomRight,
        { x: pipeCoords.x, y: gameSize.height },
        {
          x: pipeCoords.x + pipeSize.x * 2,
          y: pipeCoords.y + 1.5 * pipeCoords.offset,
        }
      )
    );
  },

  setIsStarted: (isStarted: boolean) => set({ isStarted }),
  isCrossed: () => {
    const { birdCoords, pipeSize, pipeCoords } = get();
    if (birdCoords.x > pipeCoords.x + pipeSize.x * 2) {
      return true;
    }
    return false;
  },
  stopGame: () => {
    const {
      pipeMovementInterval,
      gravityInterval,
      pipeRadomizationInterval,
      timerInterval,
    } = get();
    if (pipeMovementInterval) {
      clearInterval(pipeMovementInterval);
    }
    if (gravityInterval) {
      clearInterval(gravityInterval);
    }
    if (pipeRadomizationInterval) {
      clearInterval(pipeRadomizationInterval);
    }
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    set({
      pipeMovementInterval: null,
      gravityInterval: null,
      pipeRadomizationInterval: null,
      timerInterval: null,
      isStarted: false,
      isGameOver: true,
    });
  },
  isHittingBottom: () => {
    const { birdCoords, bottom, birdSize } = get();
    return birdCoords.y - birdSize.y * 2 <= bottom;
  },

  setScore: (score: number) => set({ score }),
  setBirdSize: (birdSize: { x: number; y: number }) => set({ birdSize }),
  setPipeSize: (pipeSize: { x: number; y: number }) => set({ pipeSize }),

  setBirdCoords: (birdCoords: { x: number; y: number }) => set({ birdCoords }),
  setPipeCoords: (pipeCoords: { x: number; y: number; offset: number }) =>
    set({ pipeCoords }),

  setSpeed: (ySpeed: number) => set({ ySpeed }),
  moveBirdY: (birdY: number) => {
    set((state) => {
      console.log(state.birdCoords, birdY);
      const newY = Math.min(
        state.top,
        state.birdCoords.y + birdY - state.birdSize.y
      );
      return { birdCoords: { x: state.birdCoords.x, y: newY } };
    });
    if (get().isHittingBottom() || get().isHittingPipe()) {
      console.log("game over");
      get().stopGame();
    }
  },

  setPipeMovementInterval: (time: number, dx: number) => {
    if (get().pipeMovementInterval && get().isStarted) {
      return;
    }
    set({
      pipeMovementInterval: setInterval(() => {
        set((state) => {
          const pipeCoords = {
            x:
              state.pipeCoords.x - dx + state.pipeSize.x * 2 <= 0
                ? gameSize.width - 20
                : state.pipeCoords.x - dx,
            y:
              state.pipeCoords.x - dx + state.pipeSize.x * 2 <= 0
                ? rodSize.y +
                  [
                    Math.floor(Math.random() * 200),
                    -Math.floor(Math.random() * 200),
                  ][state.time % 2]
                : state.pipeCoords.y,
            offset: state.pipeCoords.offset,
          };
          return {
            pipeCoords,
            score: Math.floor(state.time < 8 ? state.time / 4 : state.time / 7),
          };
        });
      }, time),
    });
  },
  setGravityInterval: (time: number, dy: number) => {
    if (get().gravityInterval && get().isStarted) {
      return;
    } else {
      set({
        gravityInterval: setInterval(() => {
          get().setSpeed(get().ySpeed + dy);
          if (get().ySpeed + dy > 10) {
          }
          get().moveBirdY(-get().ySpeed);
        }, time),
      });
    }
  },
}));
