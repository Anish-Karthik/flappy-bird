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

const isRectangleIntersected = (
  coords: { x: number; y: number },
  size: { x: number; y: number },
  coords2: { x: number; y: number },
  size2: { x: number; y: number }
) => {
  const { bottomRight: bottomRight1, topLeft: topLeft1 } = getRectangle(
    coords,
    size
  );
  const { bottomRight: bottomRight2, topLeft: topLeft2 } = getRectangle(
    coords2,
    size2
  );
  return doOverlap(bottomRight1, topLeft1, bottomRight2, topLeft2);
};

type GameState = {
  time: number;
  bottom: number;
  top: number;
  birdImage: string;
  isStarted: boolean;
  ySpeed: number;

  isGameOver: boolean;
  score: number;
  birdSize: { x: number; y: number };
  topRodSize: { x: number; y: number };
  bottomRodSize: { x: number; y: number };

  birdCoords: { x: number; y: number };
  topRodCoords: { x: number; y: number };
  bottomRodCoords: { x: number; y: number };

  rodMovementInterval: NodeJS.Timeout | null;
  gravityInterval: NodeJS.Timeout | null;
  rodRadomizationInterval: NodeJS.Timeout | null;
  timerInterval: NodeJS.Timeout | null;
};

type UseGameState = GameState & {
  clearTimer: () => void;
  setTimer: (time: number) => void;
  setIsGameOver: (isGameOver: boolean) => void;
  setScore: (score: number) => void;
  setBirdSize: (size: { x: number; y: number }) => void;
  setTopRodSize: (size: { x: number; y: number }) => void;
  setBottomRodSize: (size: { x: number; y: number }) => void;

  moveBirdY: (dy: number) => void;
  moveRodsX: (dx: number) => void;

  setBirdCoords: (coords: { x: number; y: number }) => void;
  setTopRodCoords: (coords: { x: number; y: number }) => void;
  setBottomRodCoords: (coords: { x: number; y: number }) => void;

  setRodMovementInterval: (time: number, dx: number) => void;
  setGravityInterval: (time: number, dy: number) => void;
  setRodRadomizationInterval: (time: number, dy: number) => void;

  clearRodMovementInterval: () => void;
  clearGravityInterval: () => void;
  clearRodRadomizationInterval: () => void;

  isCrossed: () => boolean;
  isHittingBottom: () => boolean;
  resetGame: () => void;
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
  topRodSize: { x: 0, y: 0 },
  bottomRodSize: { x: 0, y: 0 },

  birdCoords: { x: 0, y: 0 },
  topRodCoords: { x: 0, y: 0 },
  bottomRodCoords: { x: 0, y: 0 },

  rodMovementInterval: null,
  gravityInterval: null,
  rodRadomizationInterval: null,
  time: 0,
  timerInterval: null,

  setBirdImage: (birdImage: string) => set({ birdImage }),
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
  clearRodMovementInterval: () => {
    const { rodMovementInterval } = get();
    if (rodMovementInterval) {
      clearInterval(rodMovementInterval);
    }
  },
  clearRodRadomizationInterval: () => {
    const { rodRadomizationInterval } = get();
    if (rodRadomizationInterval) {
      clearInterval(rodRadomizationInterval);
    }
  },

  setIsGameOver: (isGameOver: boolean) => set({ isGameOver }),
  initializeGame: (game) => set(game),
  resetGame: () => {
    set({ score: 0 });
    set({ birdCoords: { x: 0, y: 0 } });
    set({ topRodCoords: { x: 0, y: 0 } });
    set({ bottomRodCoords: { x: 0, y: 0 } });
  },
  setIsStarted: (isStarted: boolean) => set({ isStarted }),
  isCrossed: () => {
    const {
      birdCoords,
      topRodCoords,
      topRodSize,
      bottomRodCoords,
      bottomRodSize,
      birdSize,
    } = get();

    const isHittingTopRod = isRectangleIntersected(
      birdCoords,
      birdSize,
      topRodCoords,
      topRodSize
    );
    const isHittingBottomRod = isRectangleIntersected(
      birdCoords,
      birdSize,
      bottomRodCoords,
      bottomRodSize
    );

    return isHittingTopRod || isHittingBottomRod;
  },
  stopGame: () => {
    const {
      rodMovementInterval,
      gravityInterval,
      rodRadomizationInterval,
      timerInterval,
    } = get();
    if (rodMovementInterval) {
      clearInterval(rodMovementInterval);
    }
    if (gravityInterval) {
      clearInterval(gravityInterval);
    }
    if (rodRadomizationInterval) {
      clearInterval(rodRadomizationInterval);
    }
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    set({
      rodMovementInterval: null,
      gravityInterval: null,
      rodRadomizationInterval: null,
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
  setTopRodSize: (topRodSize: { x: number; y: number }) => set({ topRodSize }),
  setBottomRodSize: (bottomRodSize: { x: number; y: number }) =>
    set({ bottomRodSize }),

  setBirdCoords: (birdCoords: { x: number; y: number }) => set({ birdCoords }),
  setTopRodCoords: (topRodCoords: { x: number; y: number }) =>
    set({ topRodCoords }),
  setBottomRodCoords: (bottomRodCoords: { x: number; y: number }) =>
    set({ bottomRodCoords }),
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
    if (get().isHittingBottom() || get().isCrossed()) {
      console.log("game over");
      get().stopGame();
    }
  },
  moveRodsX: (rodX: number) => {
    set((state) => {
      const newX = state.topRodCoords.x + rodX;
      return {
        topRodCoords: { x: newX, y: state.topRodCoords.y },
        bottomRodCoords: { x: newX, y: state.bottomRodCoords.y },
      };
    });
  },

  setRodMovementInterval: (time: number, dx: number) => {
    set({
      rodMovementInterval: setInterval(() => {
        set((state) => {
          const topRodCoords = {
            x: state.topRodCoords.x - dx,
            y: state.topRodCoords.y,
          };
          const bottomRodCoords = {
            x: state.bottomRodCoords.x - dx,
            y: state.bottomRodCoords.y,
          };
          return { topRodCoords, bottomRodCoords };
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
  setRodRadomizationInterval: (time: number, dy: number) => {
    set({
      rodRadomizationInterval: setInterval(() => {
        set((state) => {
          const topRodCoords = {
            x: state.topRodCoords.x,
            y: state.topRodCoords.y + dy,
          };
          const bottomRodCoords = {
            x: state.bottomRodCoords.x,
            y: state.bottomRodCoords.y + dy,
          };
          return { topRodCoords, bottomRodCoords };
        });
      }, time),
    });
  },
}));
