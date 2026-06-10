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
import { SingleButtonTapGameModeState } from "../state/SingleButtonTapGameModeState";
import { renderDebugText } from "../utilities/renderDebugText";

const UPDATE_FREQUENCY = 2.0;

export class SingleButtonTapGameMode {
  public static initGameMode = (
    gameModeState: SingleButtonTapGameModeState,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
  ) => {
    const { setTimeSinceLastMessage, resetTapCount } = gameModeState;

    setTimeSinceLastMessage(0);
    resetTapCount();
  };

  public static update = (
    gameModeState: SingleButtonTapGameModeState,
    dt: number,
    send: (data: ClientEvent) => void,
  ) => {
    const {
      timeSinceLastMessage,
      setTimeSinceLastMessage,
      tapCount,
      resetTapCount,
    } = gameModeState;

    const updatedTime = timeSinceLastMessage + dt;

    if (updatedTime > UPDATE_FREQUENCY) {
      if (tapCount > 0) {
        send({
          action: ClientEventAction.SEND_MESSAGE,
          to: "host",
          type: ClientEventSendMessageType.TAP_COUNT,
          tapCount,
        });
      }

      setTimeSinceLastMessage(0);
      resetTapCount();
    } else {
      setTimeSinceLastMessage(updatedTime);
    }
  };

  public static render = (
    gameModeState: SingleButtonTapGameModeState,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    ctx: CanvasRenderingContext2D,
  ) => {
    const BUTTON_RADIUS = getButtonRadius(canvas);

    const { debug } = canvasState;
    const { isButtonActivated, tapCount, timeSinceLastMessage } = gameModeState;

    ctx.lineWidth = 3;

    if (isButtonActivated) {
      ctx.fillStyle = "green";
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
      ctx.fill();
    }

    ctx.strokeStyle = "white";
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

    if (debug) {
      renderDebugText(
        ctx,
        `Tap Count: ${tapCount}`,
        `Time Left: ${(UPDATE_FREQUENCY - timeSinceLastMessage).toFixed(2)}`,
      );
    }
  };

  public static handlePointerDown = (
    gameModeState: SingleButtonTapGameModeState,
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    send: (data: ClientEvent) => void,
  ) => {
    if (e.pointerType === "mouse" && !(e.buttons & 1)) return;

    const { setIsButtonActivated, setTimeActivated, pointerId, setPointerId } =
      gameModeState;

    if (pointerId && pointerId !== e.pointerId) return;

    const BUTTON_RADIUS = getButtonRadius(canvas);

    canvasState.pointer = getCanvasCoords(e, canvas);

    if (
      Math.hypot(
        canvasState.pointer.x - canvas.width / 2,
        canvasState.pointer.y - canvas.height / 2,
      ) > BUTTON_RADIUS
    ) {
      return;
    }

    setIsButtonActivated(true);
    setTimeActivated(Date.now());
    setPointerId(e.pointerId);
  };

  public static handlePointerMove = (
    gameModeState: SingleButtonTapGameModeState,
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    send: (data: ClientEvent) => void,
  ) => {
    throw new Error("Method not implemented.");
  };

  public static handlePointerUp = (
    gameModeState: SingleButtonTapGameModeState,
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    send: (data: ClientEvent) => void,
  ) => {
    const {
      isButtonActivated,
      setIsButtonActivated,
      incrementTapCount,
      pointerId,
      setPointerId,
    } = gameModeState;
    if (pointerId && pointerId !== e.pointerId) return;
    if (!isButtonActivated) return;

    setIsButtonActivated(false);
    incrementTapCount();
    setPointerId(undefined);
  };
}

const getButtonRadius = (canvas: HTMLCanvasElement) => {
  return Math.min(canvas.width / 2 * 0.8, 150);
}