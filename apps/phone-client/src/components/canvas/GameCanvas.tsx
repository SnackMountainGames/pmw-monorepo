import { type PointerEvent, useEffect, useRef } from 'react';
import { CanvasState, defaultCanvasState } from '../../state/GameState';
import {
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  handleResizeCanvas,
} from './CanvasUtilities';

export const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasStateRef = useRef<CanvasState>(defaultCanvasState);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationId: number;
    let lastTime = 0;

    const init = async () => {
      // load any images and other things here

      startLoop();
    };

    const startLoop = () => {
      const loop = (time: number) => {
        const dt = (time - lastTime) / 1000; // convert ms → seconds
        lastTime = time;

        update(Math.min(dt, 0.1));
        render(canvas, ctx);
        animationId = requestAnimationFrame(loop);
      };

      // Begin game loop
      animationId = requestAnimationFrame(loop);
    };

    init();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const update = (dt: number) => {
    const canvasState = canvasStateRef.current;

    for (let i = canvasState.objects.length - 1; i >= 0; i--) {
      const object = canvasState.objects[i];
      object.x += object.dx * dt;
      object.y += object.dy * dt;

      if (object.time) {
        object.time -= dt;
        if (object.time <= 0) {
          canvasState.objects.splice(i, 1);
        }
      }
    }
  };

  const render = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const canvasState = canvasStateRef.current;

    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // canvas outline
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'blue';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // pointer
    if (canvasState.pointer) {
      ctx.strokeStyle = 'green';
      ctx.beginPath();
      ctx.ellipse(
        canvasState.pointer.x,
        canvasState.pointer.y,
        2,
        2,
        0,
        0,
        360
      );
      ctx.stroke();
    }

    // objects
    canvasState.objects.forEach((object) => {
      ctx.strokeStyle = 'green';
      ctx.beginPath();
      ctx.ellipse(object.x, object.y, 2, 2, 0, 0, 360);
      ctx.stroke();

      ctx.strokeStyle = 'purple';
      ctx.beginPath();
      ctx.ellipse(object.x, object.y, 25, 25, 0, 0, 360);
      ctx.stroke();
    });
  }

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    handleResizeCanvas(canvas);
  };

  const onPointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    handlePointerDown(event, canvas, canvasStateRef.current);
  }

  const onPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    handlePointerMove(event, canvas, canvasStateRef.current);
  };

  const onPointerUp = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    handlePointerUp(event, canvas, canvasStateRef.current);
  }

  return (
    <canvas
      id='game-canvas'
      ref={canvasRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
}