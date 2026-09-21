import { CanvasState, Vector2D } from "../state/GameState";
import { getCanvasCoords, SimulatedPointerEvent } from "../components/canvas/CanvasUtilities";
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

const THRESHOLD = 0.05;

export class TraceShapeGameMode {
  public static initGameMode = (
    gameModeState: TraceShapeGameModeState,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
  ) => {
    gameModeState.userPoints = [];

    const midWidth = canvas.width / 2;
    const midHeight = canvas.height / 2;

    const isCovered = false;

    const points: ShapeVector2D[] = [];
    const segmentCount = 30;
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
  };

  public static render = (
    gameModeState: TraceShapeGameModeState,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    ctx: CanvasRenderingContext2D,
  ) => {
    const { userPoints, shapePoints, distance } = gameModeState;

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
      .forEach((p, i) => {
        ctx.strokeStyle = "green";
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, 2, 2, 0, 0, 360);
        ctx.stroke();
      });

    ctx.beginPath();
    userPoints.forEach((p, i) =>
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y),
    );
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = "#378ADD";
    ctx.lineWidth = 50;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    ctx.fillText(Math.floor(distance).toString(), 50, 50);
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
        if (distanceBetween(point, coords) <= 30) {
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
    const pointerLocation = getCanvasCoords(e, canvas);
    if (
      shapePoints.every((point) => point.isCovered) &&
      isCoveringPoint(pointerLocation, shapePoints[0]) &&
      distance > shapeDistance * (1 - THRESHOLD) &&
      distance < shapeDistance * (1 + THRESHOLD)
    ) {
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
  };

  public static handlePointerUp = (
    gameModeState: TraceShapeGameModeState,
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    send: (data: ClientEvent) => void,
  ) => {
    this.initGameMode(gameModeState, canvas, canvasState);
  };
}

const distanceBetween = (p1: Vector2D, p2: Vector2D): number => {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;

  return Math.sqrt(dx * dx + dy * dy);
}

const isCoveringPoint = (
  userPoint: Vector2D,
  shapePoint: ShapeVector2D,
): boolean => {
  return distanceBetween(userPoint, shapePoint) <= 30;
}