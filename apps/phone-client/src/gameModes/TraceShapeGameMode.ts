import { CanvasState, Vector2D } from "../state/GameState";
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
import {
  ShapeVector2D,
  TraceShapeGameModeState,
} from "../state/TraceShapeGameModeState";
import { renderDebugText } from "../utilities/renderDebugText";

const CYCLE_TIME = 1.5;
const THRESHOLD_PERCENT = 0.1;

const CLOSENESS_THRESHOLD = 60;

export class TraceShapeGameMode {
  public static initGameMode = (
    gameModeState: TraceShapeGameModeState,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    createTutorial?: boolean,
  ) => {
    gameModeState.cycleInterval = CYCLE_TIME;

    gameModeState.userPoints = [];

    const midWidth = canvas.width / 2;
    const midHeight = canvas.height / 2;

    const isCovered = false;

    const points: ShapeVector2D[] = [];
    const segmentCount = 60;
    const r = midWidth * 0.7;
    for (let i = 0; i < segmentCount; i++) {
      const angle = -Math.PI / 2 + (i / segmentCount) * Math.PI * 2; // evenly spaced fraction of a full turn
      points.push({
        x: midWidth + r * Math.cos(angle),
        y: midHeight + r * Math.sin(angle),
        isCovered,
      });
    }
    gameModeState.shapePoints = [...points];

    let totalShapeDistance = 0;
    gameModeState.shapePoints.forEach((p, i) => {
      const next =
        i + 1 < gameModeState.shapePoints.length
          ? gameModeState.shapePoints[i + 1]
          : gameModeState.shapePoints[0];
      totalShapeDistance += distanceBetween(p, next);
    });
    gameModeState.shapeDistance = totalShapeDistance;

    gameModeState.distance = 0;

    if (createTutorial) {
      gameModeState.tutorial = {
        cyclesRemaining: 3,
        shapePointIndex: 0,
        timeSinceLastMove: -1.0,
      };
    }
  };

  public static update = (
    gameModeState: TraceShapeGameModeState,
    dt: number,
  ) => {
    const { tutorial, shapePoints } = gameModeState;

    const timeAroundPerSegment = CYCLE_TIME / shapePoints.length;

    if (tutorial) {
      tutorial.timeSinceLastMove += dt;

      if (tutorial.timeSinceLastMove > timeAroundPerSegment) {
        tutorial.timeSinceLastMove -= timeAroundPerSegment;
        tutorial.shapePointIndex++;
      }
      if (tutorial.shapePointIndex >= shapePoints.length) {
        tutorial.shapePointIndex = 0;
        tutorial.cyclesRemaining--;
      }

      if (tutorial.cyclesRemaining <= 0) {
        gameModeState.tutorial = undefined;
      }
    }
  };

  public static render = (
    gameModeState: TraceShapeGameModeState,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    ctx: CanvasRenderingContext2D,
  ) => {
    const { debug } = canvasState;
    const {
      userPoints,
      shapePoints,
      distance,
      tutorial,
      startTime,
      isDrawing,
    } = gameModeState;

    ctx.beginPath();
    shapePoints.forEach((p, i) =>
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y),
    );
    ctx.lineTo(shapePoints[0].x, shapePoints[0].y);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#AAAAAA";
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    shapePoints
      .filter((p) => p.isCovered)
      .forEach((p) => {
        ctx.strokeStyle = "green";
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, 2, 2, 0, 0, 360);
        ctx.stroke();
      });

    if (tutorial) {
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.ellipse(
        shapePoints[tutorial.shapePointIndex].x,
        shapePoints[tutorial.shapePointIndex].y,
        CLOSENESS_THRESHOLD,
        CLOSENESS_THRESHOLD,
        0,
        0,
        360,
      );
      ctx.fill();
      ctx.restore();
    }

    ctx.beginPath();
    userPoints.forEach((p, i) =>
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y),
    );
    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = "#378ADD";
    ctx.lineWidth = 100;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    if (debug) {
      renderDebugText(
        ctx,
        `Trace Distance: ${Math.floor(distance).toString()}`,
        `Total Covered: ${shapePoints.filter((p) => p.isCovered).length} / ${
          shapePoints.length
        }`,
        isDrawing
          ? `Trace Time: ${((new Date().getTime() - startTime) / 1000).toFixed(
              1,
            )}s`
          : "",
      );
    }
  };

  public static handlePointerDown = (
    gameModeState: TraceShapeGameModeState,
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    send: (data: ClientEvent) => void,
  ) => {
    this.initGameMode(gameModeState, canvas, canvasState);

    const pointerLocation = getCanvasCoords(e, canvas);
    gameModeState.isDrawing = isCoveringPoint(
      pointerLocation,
      gameModeState.shapePoints[0],
    );

    gameModeState.userPoints.push(pointerLocation);

    gameModeState.startTime = new Date().getTime();

    this.handlePointerMove(gameModeState, e, canvas, canvasState, send);
  };

  public static handlePointerMove = (
    gameModeState: TraceShapeGameModeState,
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    send: (data: ClientEvent) => void,
  ) => {
    if (!gameModeState.isDrawing) return;

    const { shapePoints, userPoints, shapeDistance, distance } = gameModeState;

    const coords = getCanvasCoords(e, canvas);

    shapePoints
      .filter((point) => !point.isCovered)
      .forEach((point) => {
        if (distanceBetween(point, coords) <= CLOSENESS_THRESHOLD) {
          point.isCovered = true;
        }
      });

    userPoints.push(coords);

    gameModeState.distance = gameModeState.userPoints.reduce(
      (acc, point, i) => {
        if (i === 0) return acc;
        const prev = gameModeState.userPoints[i - 1];
        return acc + distanceBetween(point, prev);
      },
      0,
    );

    // check points
    if (
      shapePoints.every((point) => point.isCovered) &&
      isCoveringPoint(coords, shapePoints[0])
    ) {
      console.log("Covered everything");

      if (distance > shapeDistance * (1 - THRESHOLD_PERCENT)) {
        send({
          action: ClientEventAction.SEND_MESSAGE,
          to: "host",
          type: ClientEventSendMessageType.RIDER_STATUS,
          status: RiderStatus.SUCCESS,
          time: new Date().getTime() - gameModeState.startTime,
        });
        this.initGameMode(gameModeState, canvas, canvasState);
        gameModeState.startTime = new Date().getTime();
      }
    }
  };

  public static handlePointerUp = (
    gameModeState: TraceShapeGameModeState,
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    send: (data: ClientEvent) => void,
  ) => {
    gameModeState.isDrawing = false;
    this.initGameMode(gameModeState, canvas, canvasState);
  };
}

const distanceBetween = (p1: Vector2D, p2: Vector2D): number => {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;

  return Math.sqrt(dx * dx + dy * dy);
};

const isCoveringPoint = (
  userPoint: Vector2D,
  shapePoint: ShapeVector2D,
): boolean => {
  return distanceBetween(userPoint, shapePoint) <= CLOSENESS_THRESHOLD;
};
