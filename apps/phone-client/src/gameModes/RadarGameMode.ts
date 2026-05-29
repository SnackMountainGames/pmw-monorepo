import { CanvasState } from "../state/GameState";
import { SimulatedPointerEvent } from "../components/canvas/CanvasUtilities";
import { ClientEvent } from "shared-type-library";
import { RadarGameModeState } from "../state/RadarGameModeState";

export class RadarGameMode {
  public static initGameMode = (
    gameModeState: RadarGameModeState,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
  ) => {
    throw new Error("Method not implemented.");
  };

  public static render = (
    gameModeState: RadarGameModeState,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    ctx: CanvasRenderingContext2D,
  ) => {
    const mid = {
      x: canvas.width / 2,
      y: canvas.height / 2,
    };

    const { location } = gameModeState;

    ctx.strokeStyle = "green";
    ctx.lineWidth = 1;

    ctx.fillStyle = "green";

    ctx.beginPath();
    ctx.ellipse(mid.x, mid.y, 5, 5, 0, 0, 360);
    ctx.fill();

    for (let i = 1; i < 5; i++) {
      ctx.beginPath();
      ctx.ellipse(mid.x, mid.y, 100 * i, 100 * i, 0, 0, 360);
      ctx.stroke();
    }

    if (location) {
      // map it to the screen
      const x = (location.x / 10) + mid.x;
      const y = (location.y / 10) + mid.y;


      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.ellipse(x, y, 5, 5, 0, 0, 360);
      ctx.fill();
    }
  };

  public static handlePointerDown = (
    gameModeState: RadarGameModeState,
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    send: (data: ClientEvent) => void,
  ) => {
    throw new Error("Method not implemented.");
  };

  public static handlePointerMove = (
    gameModeState: RadarGameModeState,
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    send: (data: ClientEvent) => void,
  ) => {
    throw new Error("Method not implemented.");
  };

  public static handlePointerUp = (
    gameModeState: RadarGameModeState,
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    send: (data: ClientEvent) => void,
  ) => {
    throw new Error("Method not implemented.");
  };
}