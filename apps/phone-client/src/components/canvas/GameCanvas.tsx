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
import { SingleButtonHoldGameMode } from "../../gameModes/SingleButtonHoldGameMode";
import { useSingleButtonHoldGameModeStore } from "../../state/SingleButtonHoldGameModeState";
import styled from "@emotion/styled";
import { TraceShapeGameMode } from "../../gameModes/TraceShapeGameMode";
import { useTraceShapeGameModeStore } from "../../state/TraceShapeGameModeState";
import { useRadarGameModeStore } from "../../state/RadarGameModeState";
import { RadarGameMode } from "../../gameModes/RadarGameMode";
import {FlashGameMode} from "../../gameModes/FlashGameMode";
import {useFlashGameModeStore} from "../../state/FlashGameModeState";
import { useSingleButtonTapGameModeStore } from "../../state/SingleButtonTapGameModeState";
import { SingleButtonTapGameMode } from "../../gameModes/SingleButtonTapGameMode";
import { BlankGameMode } from "../../gameModes/BlankGameMode";

const Canvas = styled.canvas`
  display: block;
  touch-action: none;
  -webkit-user-select: none;
  user-select: none;
  background-color: black;
`;

export const GameCanvas = forwardRef<GameCanvasControls>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasStateRef = useRef<CanvasState>(defaultCanvasState());

  const phoneClientState = usePhoneClientStore((state) => state);
  const { gameMode, setGameMode, debug } = phoneClientState;

  const singleButtonHoldGameModeState = useSingleButtonHoldGameModeStore();
  const singleButtonTapGameModeState = useSingleButtonTapGameModeStore();
  const traceShapeGameModeState = useTraceShapeGameModeStore();
  const radarGameModeState = useRadarGameModeStore();
  const flashGameModeState = useFlashGameModeStore();

  const { subscribe, send } = useSharedWebSocket();

  // This is for the simulated clicks
  // (0,0) is the middle of the screen
  useImperativeHandle(ref, () => {
    const mid = { x: 0, y: 0 };
    if (canvasRef.current) {
      mid.y = canvasRef.current.height / 2;
      mid.x = canvasRef.current.width / 2;
    }

    return {
      pointerDown(x, y) {
        onPointerDown({
          clientX: mid.x + x,
          clientY: mid.y + y,
          pointerType: "mouse",
          buttons: 1,
          simulated: true,
        } as any);
      },

      pointerMove(x, y) {
        onPointerMove({
          clientX: mid.x + x,
          clientY: mid.y + y,
          pointerType: "mouse",
          buttons: 1,
          simulated: true,
        } as any);
      },

      pointerUp(x, y) {
        onPointerUp({
          clientX: mid.x + x,
          clientY: mid.y + y,
          pointerType: "mouse",
          buttons: 1,
          simulated: true,
        } as any);
      },
    };
  });

  useEffect(() => {
    canvasStateRef.current = {
      ...canvasStateRef.current,
      debug,
    };
  }, [debug]);

  useEffect(() => {
    return subscribe((message: ServerEvent) => {
      console.log("Client", message);

      switch (message.type) {
        case ServerEventType.CHANGE_GAME_MODE:
          setGameMode(message.mode);
          break;
        case ServerEventType.COORDINATES:
          radarGameModeState.getState().location = {
            x: message.x,
            y: message.y,
          };
      }
    });
  }, [radarGameModeState, setGameMode, subscribe]);

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
      const canvasState = canvasStateRef.current;

      switch (gameMode) {
        case GameMode.BLANK:
          break;
        case GameMode.SINGLE_BUTTON_HOLD:
          break;
        case GameMode.SINGLE_BUTTON_TAP:
          SingleButtonTapGameMode.initGameMode(
            singleButtonTapGameModeState.getState(),
            canvas,
            canvasState,
          )
          break;
        case GameMode.TRACE_SHAPE:
          TraceShapeGameMode.initGameMode(
            traceShapeGameModeState.getState(),
            canvas,
            canvasState,
          );
          break;
        case GameMode.RADAR:
          break;
        case GameMode.DEBUG:
          break;
      }
      resizeCanvas();
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

  const update = useCallback((dt: number) => {
    const canvasState = canvasStateRef.current;

    switch (gameMode) {
      case GameMode.BLANK:
        break;
      case GameMode.SINGLE_BUTTON_HOLD:
        break;
      case GameMode.SINGLE_BUTTON_TAP:
        SingleButtonTapGameMode.update(singleButtonTapGameModeState.getState(), dt, send);
        break;
      case GameMode.TRACE_SHAPE:
        break;
      case GameMode.RADAR:
        break;
      case GameMode.FLASH:
        FlashGameMode.update(flashGameModeState.getState(), dt);
        break;
      case GameMode.DEBUG:
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
        break;
    }
  }, [gameMode]);

  const render = useCallback(
    (
      canvas: HTMLCanvasElement,
      canvasState: CanvasState,
      ctx: CanvasRenderingContext2D,
    ) => {
      // clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const standardArgs = [canvas, canvasState, ctx] as const;

      switch (gameMode) {
        case GameMode.BLANK:
          BlankGameMode.render(phoneClientState, ...standardArgs);
          break;
        case GameMode.SINGLE_BUTTON_HOLD:
          SingleButtonHoldGameMode.render(
            singleButtonHoldGameModeState.getState(),
            ...standardArgs,
          );
          break;
        case GameMode.SINGLE_BUTTON_TAP:
          SingleButtonTapGameMode.render(
            singleButtonTapGameModeState.getState(),
            ...standardArgs,
          );
          break;
        case GameMode.TRACE_SHAPE:
          TraceShapeGameMode.render(
            traceShapeGameModeState.getState(),
            ...standardArgs,
          );
          break;
        case GameMode.RADAR:
          RadarGameMode.render(radarGameModeState.getState(), ...standardArgs);
          break;
        case GameMode.FLASH:
          FlashGameMode.render(flashGameModeState.getState(), ...standardArgs);
          break;
        case GameMode.DEBUG:
          DebugGameMode.render(...standardArgs);
          break;
      }
    },
    [gameMode],
  );

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    handleResizeCanvas(canvas);
  };

  const onPointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const standardArgs = [event, canvas, canvasStateRef.current, send] as const;

    switch (gameMode) {
      case GameMode.BLANK:
        break;
      case GameMode.SINGLE_BUTTON_HOLD:
        SingleButtonHoldGameMode.handlePointerDown(
          singleButtonHoldGameModeState.getState(),
          ...standardArgs,
        );
        break;
      case GameMode.SINGLE_BUTTON_TAP:
        SingleButtonTapGameMode.handlePointerDown(
          singleButtonTapGameModeState.getState(),
          ...standardArgs,
        );
        break;
      case GameMode.TRACE_SHAPE:
        TraceShapeGameMode.handlePointerDown(
          traceShapeGameModeState.getState(),
          ...standardArgs,
        );
        break;
      case GameMode.RADAR:
        break;
      case GameMode.FLASH:
        FlashGameMode.handlePointerDown(flashGameModeState.getState(), ...standardArgs);
        break;
      case GameMode.DEBUG:
        handlePointerDown(event, canvas, canvasStateRef.current);
        break;
    }
  };

  const onPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const standardArgs = [event, canvas, canvasStateRef.current, send] as const;

    switch (gameMode) {
      case GameMode.BLANK:
        break;
      case GameMode.SINGLE_BUTTON_HOLD:
        SingleButtonHoldGameMode.handlePointerMove(
          singleButtonHoldGameModeState.getState(),
          ...standardArgs,
        );
        break;
      case GameMode.SINGLE_BUTTON_TAP:
        break;
      case GameMode.TRACE_SHAPE:
        TraceShapeGameMode.handlePointerMove(
          traceShapeGameModeState.getState(),
          ...standardArgs,
        );
        break;
      case GameMode.RADAR:
        break;
      case GameMode.DEBUG:
        handlePointerMove(event, canvas, canvasStateRef.current);
        break;
    }
  };

  const onPointerUp = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const standardArgs = [event, canvas, canvasStateRef.current, send] as const;

    switch (gameMode) {
      case GameMode.BLANK:
        break;
      case GameMode.SINGLE_BUTTON_HOLD:
        SingleButtonHoldGameMode.handlePointerUp(
          singleButtonHoldGameModeState.getState(),
          ...standardArgs,
        );
        break;
      case GameMode.SINGLE_BUTTON_TAP:
        SingleButtonTapGameMode.handlePointerUp(
          singleButtonTapGameModeState.getState(),
          ...standardArgs,
        );
        break;
      case GameMode.TRACE_SHAPE:
        TraceShapeGameMode.handlePointerUp(
          traceShapeGameModeState.getState(),
          ...standardArgs,
        );
        break;
      case GameMode.RADAR:
        break;
      case GameMode.DEBUG:
        handlePointerUp(...standardArgs);
        break;
    }
  };

  return (
    <Canvas
      id="game-canvas"
      ref={canvasRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
});
