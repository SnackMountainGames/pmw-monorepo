import { CanvasState } from "../state/GameState";
import { SimulatedPointerEvent } from "../components/canvas/CanvasUtilities";
import { ClientEvent } from "shared-type-library";
import { FlashGameModeState } from "../state/FlashGameModeState";

export class FlashGameMode {
  public static initGameMode = (
    gameModeState: FlashGameModeState,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
  ) => {
    throw new Error("Method not implemented.");
  };

  public static render = (
    gameModeState: FlashGameModeState,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    ctx: CanvasRenderingContext2D,
  ) => {
    const { intensity } = gameModeState;

    ctx.fillStyle = "black";
    ctx.globalAlpha = 1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (intensity > 0) {

      // console.log("intensity", intensity);
      // ctx.fillStyle = "white";
      // ctx.globalAlpha = intensity;
      // ctx.beginPath();
      // ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();

      // Scale to make the gradient elliptical
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(canvas.width * 0.9, canvas.height * 0.9);

      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 0.5);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${intensity})`); // solid center
      gradient.addColorStop(1, `rgba(255, 255, 255, 0)`); // transparent edge

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, 1, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  };

  public static update = (
    gameModeState: FlashGameModeState,
    dt: number,
  ) => {
    const { intensity, maxIntensity, rateOfDecay } = gameModeState;

    if (intensity >= maxIntensity && rateOfDecay < 0) {
      gameModeState.rateOfDecay = -gameModeState.rateOfDecay / 2;
    }

    if ((intensity > 0 && rateOfDecay > 0) || (intensity < maxIntensity && rateOfDecay < 0)) {
      gameModeState.intensity -= dt * rateOfDecay;
    }
  }

    public static handlePointerDown = (
    gameModeState: FlashGameModeState,
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    send: (data: ClientEvent) => void,
  ) => {
    const maxIntensity = Math.random();
    gameModeState.maxIntensity = maxIntensity;
    gameModeState.intensity = 0;
    gameModeState.rateOfDecay = -maxIntensity * 2;
  };

  public static handlePointerMove = (
    gameModeState: FlashGameModeState,
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    send: (data: ClientEvent) => void,
  ) => {
    throw new Error("Method not implemented.");
  };

  public static handlePointerUp = (
    gameModeState: FlashGameModeState,
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    send: (data: ClientEvent) => void,
  ) => {
    throw new Error("Method not implemented.");
  };
}