import { type PointerEvent } from 'react';
import { CanvasState, PointerObject } from '../../state/GameState';
import { BOTTOM_HUD_HEIGHT, TOP_HUD_HEIGHT } from '../hud/Hud';

const getCanvasCoords = (
  e: PointerEvent<HTMLCanvasElement>
): PointerObject => {
  return {
    x: e.clientX,
    y: e.clientY - TOP_HUD_HEIGHT,
  };
};

export const handleResizeCanvas = (canvas: HTMLCanvasElement) => {
  const containingNode = canvas.parentNode as HTMLElement;
  canvas.width = containingNode.clientWidth;
  canvas.height = containingNode.clientHeight - TOP_HUD_HEIGHT - BOTTOM_HUD_HEIGHT;
};

export const handlePointerDown = (e: PointerEvent<HTMLCanvasElement>, canvasState: CanvasState) => {
  if (e.pointerType === 'mouse' && !(e.buttons & 1)) return;

  canvasState.pointer = getCanvasCoords(e);
  canvasState.isPointerDown = true;
  canvasState.pointerDownStart = {
    time: Date.now(),
    ...canvasState.pointer,
  };
};

export const handlePointerMove = (e: PointerEvent<HTMLCanvasElement>, canvasState: CanvasState) => {
  if (e.pointerType === "mouse" && !(e.buttons & 1)) return;

  canvasState.pointer = getCanvasCoords(e);
}

export const handlePointerUp = (e: PointerEvent<HTMLCanvasElement>, canvasState: CanvasState) => {
  const MIN_DISTANCE = 50;
  const MAX_TIME = 500;

  canvasState.pointer = undefined;
  canvasState.isPointerDown = false;

  const pointerUp = getCanvasCoords(e);

  if (canvasState.pointerDownStart) {
    const dx = pointerUp.x - canvasState.pointerDownStart.x;
    const dy = pointerUp.y - canvasState.pointerDownStart.y;
    const dt = Date.now() - canvasState.pointerDownStart.time;

    if (dt > MAX_TIME) return;

    if (
      (Math.abs(dx) > MIN_DISTANCE && Math.abs(dx) > Math.abs(dy)) ||
      (Math.abs(dy) > MIN_DISTANCE && Math.abs(dy) > Math.abs(dx))
    ) {
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
