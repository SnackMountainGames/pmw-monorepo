import { type PointerEvent } from "react";
import { CanvasState, PointerObject } from "../../state/GameState";
import { BOTTOM_HUD_HEIGHT, TOP_HUD_HEIGHT } from "../hud/Hud";
import {
  ClientEvent,
  ClientEventAction,
  ClientEventSendMessageType,
} from "shared-type-library";

export type SimulatedPointerEvent = {
  simulated?: boolean;
} & PointerEvent<HTMLCanvasElement>;

export const getCanvasCoords = (
  e: SimulatedPointerEvent,
  canvas: HTMLCanvasElement,
): PointerObject => {
  if (e.simulated) {
    return {
      x: e.clientX,
      y: e.clientY,
    };
  }

  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
};

export const handleResizeCanvas = (canvas: HTMLCanvasElement) => {
  const containingNode = canvas.parentNode as HTMLElement;
  canvas.width = containingNode.clientWidth;
  canvas.height =
    containingNode.clientHeight - TOP_HUD_HEIGHT - BOTTOM_HUD_HEIGHT;
};

export const handlePointerDown = (
  e: SimulatedPointerEvent,
  canvas: HTMLCanvasElement,
  canvasState: CanvasState,
) => {
  if (e.pointerType === "mouse" && !(e.buttons & 1)) return;

  canvasState.pointer = getCanvasCoords(e, canvas);
  canvasState.isPointerDown = true;
  canvasState.pointerDownStart = {
    time: Date.now(),
    ...canvasState.pointer,
  };
};

export const handlePointerMove = (
  e: SimulatedPointerEvent,
  canvas: HTMLCanvasElement,
  canvasState: CanvasState,
) => {
  if (e.pointerType === "mouse" && !(e.buttons & 1)) return;

  canvasState.pointer = getCanvasCoords(e, canvas);
};

export const handlePointerUp = (
  e: SimulatedPointerEvent,
  canvas: HTMLCanvasElement,
  canvasState: CanvasState,
  send: (data: ClientEvent) => void,
) => {
  const MIN_DISTANCE = 50;
  const MAX_TIME = 500;

  canvasState.pointer = undefined;
  canvasState.isPointerDown = false;

  const pointerUp = getCanvasCoords(e, canvas);

  if (canvasState.pointerDownStart) {
    const dx = pointerUp.x - canvasState.pointerDownStart.x;
    const dy = pointerUp.y - canvasState.pointerDownStart.y;
    const dt = Date.now() - canvasState.pointerDownStart.time;

    if (dt > MAX_TIME) return;

    if (
      (Math.abs(dx) > MIN_DISTANCE && Math.abs(dx) > Math.abs(dy)) ||
      (Math.abs(dy) > MIN_DISTANCE && Math.abs(dy) > Math.abs(dx))
    ) {
      send({
        action: ClientEventAction.SEND_MESSAGE,
        to: "host",
        type: ClientEventSendMessageType.TEXT,
        text: "Swiped",
      });
      canvasState.objects.push({
        x: canvasState.pointerDownStart.x,
        y: canvasState.pointerDownStart.y,
        dx: dx * 2,
        dy: dy * 2,
        time: 1,
      });
      return;
    }

    if (dt < 200) {
      send({
        action: ClientEventAction.SEND_MESSAGE,
        to: "host",
        type: ClientEventSendMessageType.TEXT,
        text: "It's a click!",
      });
      send({
        action: ClientEventAction.SEND_MESSAGE,
        to: "host",
        type: ClientEventSendMessageType.TAP,
        x: canvasState.pointerDownStart.x,
        y: canvasState.pointerDownStart.y,
      });
      canvasState.objects.push({
        x: canvasState.pointerDownStart.x,
        y: canvasState.pointerDownStart.y,
        dx: 0,
        dy: 0,
        time: 0.5,
      });
      return;
    }
  }

  canvasState.isPointerDown = false;
  canvasState.pointerDownStart = undefined;
};
