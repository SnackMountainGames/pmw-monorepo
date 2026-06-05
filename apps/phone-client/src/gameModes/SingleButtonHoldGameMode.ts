import { CanvasState } from "../state/GameState";
import {
  getCanvasCoords,
  SimulatedPointerEvent,
} from "../components/canvas/CanvasUtilities";
import {
  ClientEvent,
  ClientEventAction,
  ClientEventSendMessageType,
  RiderStatus,
} from "shared-type-library";
import { SingleButtonHoldGameModeState } from "../state/SingleButtonHoldGameModeState";

export class SingleButtonHoldGameMode {
  public static initGameMode = (
    gameModeState: SingleButtonHoldGameModeState,
    canvasState: CanvasState,
  ) => {
    throw new Error("Method not implemented.");
  };

  public static update = (
    gameModeState: SingleButtonHoldGameModeState,
    dt: number,
  ) => {
    throw new Error("Method not implemented.");
  };

  public static render = (
    gameModeState: SingleButtonHoldGameModeState,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    ctx: CanvasRenderingContext2D,
  ) => {
    const BUTTON_RADIUS = getButtonRadius(canvas);

    const { isButtonActivated } = gameModeState;

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
  };

  public static handlePointerDown = (
    gameModeState: SingleButtonHoldGameModeState,
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    send: (data: ClientEvent) => void,
  ) => {
    if (e.pointerType === "mouse" && !(e.buttons & 1)) return;

    const { setIsButtonActivated, pointerId, setPointerId } = gameModeState;

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

    setPointerId(e.pointerId);
    setIsButtonActivated(true);

    send({
      action: ClientEventAction.SEND_MESSAGE,
      to: "host",
      type: ClientEventSendMessageType.RIDER_STATUS,
      status: RiderStatus.ACTIVE,
    });
  };

  public static handlePointerMove = (
    gameModeState: SingleButtonHoldGameModeState,
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    send: (data: ClientEvent) => void,
  ) => {
    if (e.pointerType === "mouse" && !(e.buttons & 1)) return;

    const { isButtonActivated, setIsButtonActivated, pointerId, setPointerId } = gameModeState;

    if (pointerId && pointerId !== e.pointerId) return;
    if (!isButtonActivated) return;

    const BUTTON_RADIUS = getButtonRadius(canvas);

    canvasState.pointer = getCanvasCoords(e, canvas);

    if (
      Math.hypot(
        canvasState.pointer.x - canvas.width / 2,
        canvasState.pointer.y - canvas.height / 2,
      ) > BUTTON_RADIUS
    ) {
      setIsButtonActivated(false);
      setPointerId(undefined);

      send({
        action: ClientEventAction.SEND_MESSAGE,
        to: "host",
        type: ClientEventSendMessageType.RIDER_STATUS,
        status: RiderStatus.IDLE,
      });

      return;
    }
  };

  public static handlePointerUp = (
    gameModeState: SingleButtonHoldGameModeState,
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    send: (data: ClientEvent) => void,
  ) => {
    const {
      isButtonActivated,
      setIsButtonActivated,
      pointerId,
      setPointerId,
    } = gameModeState;

    if (pointerId && pointerId !== e.pointerId) return;
    if (!isButtonActivated) return;

    send({
      action: ClientEventAction.SEND_MESSAGE,
      to: "host",
      type: ClientEventSendMessageType.RIDER_STATUS,
      status: RiderStatus.IDLE,
    });

    setIsButtonActivated(false);
    setPointerId(undefined);
  };
}

const getButtonRadius = (canvas: HTMLCanvasElement) => {
  return Math.min(canvas.width / 2 * 0.8, 150);
}