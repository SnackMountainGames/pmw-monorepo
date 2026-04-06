import { CanvasState } from "../state/GameState";
import {
  getCanvasCoords,
  SimulatedPointerEvent,
} from "../components/canvas/CanvasUtilities";
import {
  ClientEvent,
  ClientEventAction,
  ClientEventSendMessageType,
} from "shared-type-library";

const BUTTON_RADIUS = 100;

export class SingleButtonMode {
  public static initGameMode(canvasState: CanvasState) {}

  public static render = (
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    ctx: CanvasRenderingContext2D,
  ) => {
    ctx.lineWidth = 3;

    if (canvasState.isPointerDown && canvasState.pointerDownStart) {
      const dt = Date.now() - canvasState.pointerDownStart.time;

      ctx.fillStyle = dt / 1000 > 2 ? "green" : "grey";
      ctx.beginPath();
      ctx.ellipse(
        canvas.width / 2,
        canvas.height / 2,
        Math.min((dt / 1000 / 2) * BUTTON_RADIUS, BUTTON_RADIUS),
        Math.min((dt / 1000 / 2) * BUTTON_RADIUS, BUTTON_RADIUS),
        0,
        0,
        360,
      );
      ctx.fill();
    }

    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.ellipse(
      canvas.width / 2,
      canvas.height / 2,
      BUTTON_RADIUS,
      BUTTON_RADIUS,
      0,
      0,
      360,
    );
    ctx.stroke();
  };

  public static handlePointerDown = (
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
  ) => {
    if (e.pointerType === "mouse" && !(e.buttons & 1)) return;

    canvasState.pointer = getCanvasCoords(e, canvas);

    if (
      Math.hypot(
        canvasState.pointer.x - canvas.width / 2,
        canvasState.pointer.y - canvas.height / 2,
      ) > BUTTON_RADIUS
    ) {
      return;
    }

    canvasState.isPointerDown = true;
    canvasState.pointerDownStart = {
      time: Date.now(),
      ...canvasState.pointer,
    };
  };

  public static handlePointerMove = (
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
  ) => {
    if (e.pointerType === "mouse" && !(e.buttons & 1)) return;

    canvasState.pointer = getCanvasCoords(e, canvas);

    if (
      Math.hypot(
        canvasState.pointer.x - canvas.width / 2,
        canvasState.pointer.y - canvas.height / 2,
      ) > BUTTON_RADIUS
    ) {
      canvasState.pointer = undefined;
      canvasState.isPointerDown = false;
      canvasState.pointerDownStart = undefined;
      return;
    }
  };

  public static handlePointerUp = (
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    send: (data: ClientEvent) => void,
  ) => {
    if (canvasState.pointerDownStart) {
      const dt = Date.now() - canvasState.pointerDownStart.time;
      if (dt / 1000 >= 2) {
        send({
          action: ClientEventAction.SEND_MESSAGE,
          to: "host",
          type: ClientEventSendMessageType.TEXT,
          text: "Click",
        });
      }
    }

    canvasState.pointer = undefined;
    canvasState.isPointerDown = false;
    canvasState.pointerDownStart = undefined;
  };
}
