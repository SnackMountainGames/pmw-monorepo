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
import { SingleButtonGameModeState } from "../state/SingleButtonGameModeState";

const BUTTON_ACTIVATION_TIME = 0.0;

export class SingleButtonMode {
  public static initGameMode(
    singleButtonGameModeState: SingleButtonGameModeState,
    canvasState: CanvasState,
  ) {
    // Nothing to do now
  }

  public static update = (
    singleButtonGameModeState: SingleButtonGameModeState,
    dt: number,
  ) => {
    const { isButtonActivated, activationPercent, setActivationPercent } =
      singleButtonGameModeState;

    if (isButtonActivated) {
      setActivationPercent(
        Math.min(activationPercent + dt / BUTTON_ACTIVATION_TIME, 1),
      );
    } else {
      setActivationPercent(
        Math.max(activationPercent - dt / BUTTON_ACTIVATION_TIME, 0),
      );
    }
  };

  public static render = (
    singleButtonGameModeState: SingleButtonGameModeState,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    ctx: CanvasRenderingContext2D,
  ) => {
    const BUTTON_RADIUS = getButtonRadius(canvas);

    const { activationPercent } = singleButtonGameModeState;

    ctx.lineWidth = 3;

    if (activationPercent > 0) {
      ctx.fillStyle = activationPercent >= 1 ? "green" : "grey";
      ctx.beginPath();
      ctx.ellipse(
        canvas.width / 2,
        canvas.height / 2,
        Math.min(activationPercent * BUTTON_RADIUS, BUTTON_RADIUS),
        Math.min(activationPercent * BUTTON_RADIUS, BUTTON_RADIUS),
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
    singleButtonGameModeState: SingleButtonGameModeState,
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
  ) => {
    if (e.pointerType === "mouse" && !(e.buttons & 1)) return;

    const BUTTON_RADIUS = getButtonRadius(canvas);

    const { setIsButtonActivated } = singleButtonGameModeState;

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

    // canvasState.isPointerDown = true;
    // canvasState.pointerDownStart = {
    //   time: Date.now(),
    //   ...canvasState.pointer,
    // };
  };

  public static handlePointerMove = (
    singleButtonGameModeState: SingleButtonGameModeState,
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
  ) => {
    if (e.pointerType === "mouse" && !(e.buttons & 1)) return;

    const BUTTON_RADIUS = getButtonRadius(canvas);

    const { setIsButtonActivated } = singleButtonGameModeState;

    canvasState.pointer = getCanvasCoords(e, canvas);

    if (
      Math.hypot(
        canvasState.pointer.x - canvas.width / 2,
        canvasState.pointer.y - canvas.height / 2,
      ) > BUTTON_RADIUS
    ) {
      setIsButtonActivated(false);

      // canvasState.pointer = undefined;
      // canvasState.isPointerDown = false;
      // canvasState.pointerDownStart = undefined;
      return;
    }
  };

  public static handlePointerUp = (
    singleButtonGameModeState: SingleButtonGameModeState,
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    send: (data: ClientEvent) => void,
  ) => {
    const {
      isButtonActivated,
      setIsButtonActivated,
      activationPercent,
      setActivationPercent,
    } = singleButtonGameModeState;

    if (isButtonActivated) {
      if (activationPercent >= 1) {
        send({
          action: ClientEventAction.SEND_MESSAGE,
          to: "host",
          type: ClientEventSendMessageType.TEXT,
          text: "Click",
        });
        setActivationPercent(0);
      }
    }

    setIsButtonActivated(false);

    // canvasState.pointer = undefined;
    // canvasState.isPointerDown = false;
    // canvasState.pointerDownStart = undefined;
  };
}

const getButtonRadius = (canvas: HTMLCanvasElement) => {
  return Math.min(canvas.width / 2 * 0.8, 150);
}