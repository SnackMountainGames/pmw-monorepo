import { CanvasState, PhoneClientState } from "../state/GameState";
import { SimulatedPointerEvent } from "../components/canvas/CanvasUtilities";
import { ClientEvent } from "shared-type-library";
import { DebugEmptyLine, renderDebugText } from "../utilities/renderDebugText";

export class BlankGameMode {
  public static initGameMode = (
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
  ) => {
    throw new Error("Method not implemented.");
  };

  public static update = (dt: number, send: (data: ClientEvent) => void) => {
    throw new Error("Method not implemented.");
  };

  public static render = (
    phoneClientState: PhoneClientState,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    ctx: CanvasRenderingContext2D,
  ) => {
    const { debug } = canvasState;
    if (debug) {
      const { roomCode, name, playerId } = phoneClientState;
      renderDebugText(
        ctx,
        `Room code: ${roomCode ? roomCode : "----"}`,
        `Player name: ${name ? name : "----"}`,
        `Player id: ${playerId ? playerId : "----"}`,
        DebugEmptyLine,
        `Canvas height: ${canvas.height}`,
        `Canvas width: ${canvas.width}`,
      );
    }
  };

  public static handlePointerDown = (
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    send: (data: ClientEvent) => void,
  ) => {
    throw new Error("Method not implemented.");
  };

  public static handlePointerMove = (
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    send: (data: ClientEvent) => void,
  ) => {
    throw new Error("Method not implemented.");
  };

  public static handlePointerUp = (
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    send: (data: ClientEvent) => void,
  ) => {
    throw new Error("Method not implemented.");
  };
}