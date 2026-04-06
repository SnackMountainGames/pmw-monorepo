import {
  forwardRef,
  type PointerEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { CanvasState, defaultCanvasState, } from "../../state/GameState";
import { handlePointerDown, handlePointerMove, handlePointerUp, handleResizeCanvas, } from "./CanvasUtilities";
import { GameCanvasControls } from "../../types/types";
import { useSharedWebSocket } from "shared-component-library";
import { GameMode, ServerEvent, ServerEventType } from "shared-type-library";
import { usePhoneClientStore } from "../../state/PhoneClientStoreProvider";
import { DebugGameMode } from "../../gameModes/DebugGameMode";
import { SingleButtonMode } from "../../gameModes/SingleButtonGameMode";

export const GameCanvas = forwardRef<GameCanvasControls>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasStateRef = useRef<CanvasState>(defaultCanvasState());

  const gameMode = usePhoneClientStore((state) => state.gameMode);
  const setGameMode = usePhoneClientStore((state) => state.setGameMode);

  const { subscribe, send } = useSharedWebSocket();

  // This is for the simulated clicks
  useImperativeHandle(ref, () => ({
    pointerDown(x, y) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      handlePointerDown(
        {
          clientX: x,
          clientY: y,
          pointerType: "mouse",
          buttons: 1,
          simulated: true,
        } as any,
        canvas,
        canvasStateRef.current,
      );
    },

    pointerMove(x, y) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      handlePointerMove(
        {
          clientX: x,
          clientY: y,
          pointerType: "mouse",
          buttons: 1,
          simulated: true,
        } as any,
        canvas,
        canvasStateRef.current,
      );
    },

    pointerUp(x, y) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      handlePointerUp(
        {
          clientX: x,
          clientY: y,
          pointerType: "mouse",
          buttons: 1,
          simulated: true,
        } as any,
        canvas,
        canvasStateRef.current,
        send,
      );
    },
  }));

  useEffect(() => {
    return subscribe((message: ServerEvent) => {
      console.log("Client", message);

      switch (message.type) {
        case ServerEventType.CHANGE_GAME_MODE:
          setGameMode(message.mode);
          break;
      }
    });
  }, [subscribe]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let animationId: number;
    let lastTime = 0;

    const init = async () => {
      // load any images and other things here

      switch (gameMode) {
        case GameMode.BLANK:
          break;
        case GameMode.SINGLE_BUTTON:
          SingleButtonMode.initGameMode(canvasStateRef.current);
          break;
        case GameMode.DEBUG:
          break;
      }

      startLoop();
    };

    const startLoop = () => {
      const loop = (time: number) => {
        const dt = (time - lastTime) / 1000; // convert ms → seconds
        lastTime = time;

        update(Math.min(dt, 0.1));
        render(canvas, canvasStateRef.current, ctx);
        animationId = requestAnimationFrame(loop);
      };

      // Begin game loop
      animationId = requestAnimationFrame(loop);
    };

    init();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [gameMode]);

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

  const render = useCallback((canvas: HTMLCanvasElement, canvasState: CanvasState, ctx: CanvasRenderingContext2D) => {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (gameMode) {
      case GameMode.BLANK:
        return;
      case GameMode.SINGLE_BUTTON:
        SingleButtonMode.render(canvas, canvasState, ctx);
        return;
      case GameMode.DEBUG:
        DebugGameMode.render(canvas, canvasState, ctx);
        return;
    }
  }, [gameMode]);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    handleResizeCanvas(canvas);
  };

  const onPointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasState = canvasStateRef.current;

    switch (gameMode) {
      case GameMode.BLANK:
        return;
      case GameMode.SINGLE_BUTTON:
        SingleButtonMode.handlePointerDown(event, canvas, canvasState);
        return;
      case GameMode.DEBUG:
        handlePointerDown(event, canvas, canvasState);
        return;
    }
  };

  const onPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasState = canvasStateRef.current;

    switch (gameMode) {
      case GameMode.BLANK:
        return;
      case GameMode.SINGLE_BUTTON:
        SingleButtonMode.handlePointerMove(event, canvas, canvasState);
        return;
      case GameMode.DEBUG:
        handlePointerMove(event, canvas, canvasState);
        return;
    }
  };

  const onPointerUp = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasState = canvasStateRef.current;

    switch (gameMode) {
      case GameMode.BLANK:
        return;
      case GameMode.SINGLE_BUTTON:
        SingleButtonMode.handlePointerUp(event, canvas, canvasState, send);
        return;
      case GameMode.DEBUG:
        handlePointerUp(event, canvas, canvasState, send);
        return;
    }
  };

  return (
    <canvas
      id="game-canvas"
      key={`game-canvas-${Math.random()}`}
      ref={canvasRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
});
