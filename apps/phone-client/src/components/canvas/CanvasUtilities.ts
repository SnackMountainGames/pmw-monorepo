import { type PointerEvent } from 'react';
import { CanvasState } from '../../state/GameState';

export const handleResizeCanvas = (canvas: HTMLCanvasElement) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 60;
};

export const handlePointerDown = (e: PointerEvent<HTMLCanvasElement>, canvasState: CanvasState) => {
  if (e.pointerType === 'mouse' && !(e.buttons & 1)) return;

  canvasState.pointer = {
    x: e.clientX,
    y: e.clientY,
  };
  canvasState.isPointerDown = true;
  canvasState.pointerDownStart = {
    time: Date.now(),
    x: e.clientX,
    y: e.clientY,
  };
};

export const handlePointerMove = (e: PointerEvent<HTMLCanvasElement>, canvasState: CanvasState) => {
  if (e.pointerType === "mouse" && !(e.buttons & 1)) return;

  canvasState.pointer = {
    x: e.clientX,
    y: e.clientY,
  };
}

export const handlePointerUp = (e: PointerEvent<HTMLCanvasElement>, canvasState: CanvasState) => {
  const MIN_DISTANCE = 50;
  const MAX_TIME = 500;

  canvasState.pointer = undefined;
  canvasState.isPointerDown = false;

  if (canvasState.pointerDownStart) {
    const dx = e.clientX - canvasState.pointerDownStart.x;
    const dy = e.clientY - canvasState.pointerDownStart.y;
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
