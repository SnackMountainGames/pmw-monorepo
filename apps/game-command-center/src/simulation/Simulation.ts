import { GameCanvasControls } from "phone-client/dist";

export enum SimulationOption {
  None  ,
  ShortTaps,
  MediumTaps,
  LongTaps,
}

export const SIMULATION_TIME = 5000;

export const buildTasks = (
  option: SimulationOption,
  game: GameCanvasControls,
): Array<() => void> => {
  switch (option) {
    case SimulationOption.ShortTaps: {
      const tasks = [];
      for (let i = 0; i < SIMULATION_TIME / 100; i++) {
        tasks.push(
          ...[
            () => game.pointerDown(0, 0),
            async () => await new Promise((resolve) => setTimeout(resolve, 75)),
            () => game.pointerUp(0, 0),
            async () => await new Promise((resolve) => setTimeout(resolve, 25)),
          ],
        );
      }
      return tasks;
    }
    case SimulationOption.MediumTaps: {
      const tasks = [];
      for (let i = 0; i < SIMULATION_TIME / 200; i++) {
        tasks.push(
          ...[
            () => game.pointerDown(0, 0),
            async () =>
              await new Promise((resolve) => setTimeout(resolve, 150)),
            () => game.pointerUp(0, 0),
            async () =>
              await new Promise((resolve) => setTimeout(resolve, 50)),
          ],
        );
      }
      return tasks;
    }
    case SimulationOption.LongTaps: {
      const tasks = [];
      for (let i = 0; i < SIMULATION_TIME / 300; i++) {
        tasks.push(
          ...[
            () => game.pointerDown(0, 0),
            async () =>
              await new Promise((resolve) => setTimeout(resolve, 225)),
            () => game.pointerUp(0, 0),
            async () =>
              await new Promise((resolve) => setTimeout(resolve, 75)),
          ],
        );
      }
      return tasks;
    }
    default:
      return [];
  }
};