import { CanvasState } from "../../state/GameState";
import {
  getCanvasCoords,
  renderGradiantBackground,
  SimulatedPointerEvent,
} from "../../components/canvas/CanvasUtilities";
import {
  ClientEvent,
  ClientEventAction,
  ClientEventSendMessageType,
} from "shared-type-library";
import { renderDebugText } from "../../utilities/renderDebugText";
import { SwipeGameModeState } from "./SwipeGameModeState";

export class SwipeGameMode {
  public static initGameMode = (
    gameModeState: SwipeGameModeState,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    createTutorial?: boolean,
  ) => {
    gameModeState.pointerId = undefined;

    if (createTutorial) {
      gameModeState.tutorial = {
        swipesRemaining: 5,
        swipeTime: 0.3,
        timeSinceLastMove: -1.0,
      };
    }
  };

  public static update = (canvasState: CanvasState, gameModeState: SwipeGameModeState, dt: number) => {
    const { tutorial } = gameModeState;

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

    if (tutorial) {
      const DELAY = 0.1;

      tutorial.timeSinceLastMove += dt;

      if (tutorial.timeSinceLastMove > tutorial.swipeTime) {
        tutorial.timeSinceLastMove -= tutorial.swipeTime + DELAY;
        tutorial.swipesRemaining--;
      }

      if (tutorial.swipesRemaining <= 0) {
        gameModeState.tutorial = undefined;
      }
    }
  };

  public static render = (
    gameModeState: SwipeGameModeState,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    ctx: CanvasRenderingContext2D,
  ) => {
    const { tutorial, background } = gameModeState;

    renderGradiantBackground(canvas, ctx, background);

    const TOTAL_DISTANCE = 300;
    const midWidth = canvas.width / 2;
    const midHeight = canvas.height / 2;

    if (tutorial) {
      const y = tutorial.timeSinceLastMove < 0 ?
        midHeight + (TOTAL_DISTANCE / 2) :
        midHeight - (tutorial.timeSinceLastMove / tutorial.swipeTime * TOTAL_DISTANCE) + (TOTAL_DISTANCE / 2);

      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.ellipse(midWidth, y, 60, 60, 0, 0, 360);
      ctx.fill();
      ctx.restore();
    }

    ctx.beginPath();
    ctx.globalAlpha = 1.0;
    ctx.strokeStyle = "grey";
    ctx.lineWidth = 3;
    ctx.rect(
      midWidth - 60,
      midHeight - 60 - TOTAL_DISTANCE / 2,
      120,
     120 + TOTAL_DISTANCE,
    );
    ctx.stroke();
    ctx.restore();

    const { debug } = canvasState;


    if (debug) {
      renderDebugText(
        ctx,
        "Swipe up!",
        tutorial && `Time: ${tutorial.swipeTime}`,
        tutorial && `swipesRemaining: ${tutorial.swipesRemaining}`,
      );

      // objects
      ctx.lineWidth = 3;
      canvasState.objects.forEach((object) => {
        ctx.strokeStyle = "green";
        ctx.beginPath();
        ctx.ellipse(object.x, object.y, 2, 2, 0, 0, 360);
        ctx.stroke();

        ctx.strokeStyle = "purple";
        ctx.beginPath();
        ctx.ellipse(object.x, object.y, 25, 25, 0, 0, 360);
        ctx.stroke();
      });
    }
  };

  public static handlePointerDown = (
    gameModeState: SwipeGameModeState,
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    send: (data: ClientEvent) => void,
  ) => {
    if (e.pointerType === "mouse" && !(e.buttons & 1)) return;

    const { pointerId, setPointerStart } = gameModeState;

    if (pointerId && pointerId !== e.pointerId) return;

    setPointerStart({
      time: Date.now(),
      ...getCanvasCoords(e, canvas),
    });
  };

  public static handlePointerMove = (
    gameModeState: SwipeGameModeState,
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    send: (data: ClientEvent) => void,
  ) => {
    if (e.pointerType === "mouse" && !(e.buttons & 1)) return;

    const { pointerId } = gameModeState;

    if (pointerId && pointerId !== e.pointerId) return;
  };

  private static MIN_DISTANCE = 50;
  private static MAX_TIME = 500;

  public static handlePointerUp = (
    gameModeState: SwipeGameModeState,
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    send: (data: ClientEvent) => void,
  ) => {
    const { pointerId, pointerStart, setPointerId, setPointerStart } =
      gameModeState;

    if (pointerId && pointerId !== e.pointerId) return;

    setPointerId(undefined);

    const coords = getCanvasCoords(e, canvas);

    if (pointerStart) {
      const dx = coords.x - pointerStart.x;
      const dy = coords.y - pointerStart.y;
      const dt = Date.now() - pointerStart.time;

      if (dt > this.MAX_TIME) return;

      if (
        (Math.abs(dx) > this.MIN_DISTANCE && Math.abs(dx) > Math.abs(dy)) ||
        (Math.abs(dy) > this.MIN_DISTANCE && Math.abs(dy) > Math.abs(dx))
      ) {
        console.log("swiped!");
        send({
          action: ClientEventAction.SEND_MESSAGE,
          to: "host",
          type: ClientEventSendMessageType.TEXT,
          text: "Swiped",
        });
        canvasState.objects.push({
          x: pointerStart.x,
          y: pointerStart.y,
          dx: dx * 2,
          dy: dy * 2,
          time: 1,
        });
      }

      setPointerStart(undefined);
    }
  };
}