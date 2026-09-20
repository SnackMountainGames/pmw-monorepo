import { CanvasState } from "../state/GameState";
import { SimulatedPointerEvent } from "../components/canvas/CanvasUtilities";
import { ClientEvent } from "shared-type-library";
import { RadarGameModeState } from "../state/RadarGameModeState";

export class RadarGameMode {
  public static initGameMode = (
    gameModeState: RadarGameModeState,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
  ) => {
    throw new Error("Method not implemented.");
  };

  public static render = (
    gameModeState: RadarGameModeState,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    ctx: CanvasRenderingContext2D,
  ) => {
    const low = {
      x: canvas.width / 2,
      y: canvas.height - canvas.height / 8,
    };

    const upperLeft = {
      x: canvas.width / 10,
      y: canvas.height / 6,
    };

    const upperRight = {
      x: canvas.width - canvas.width / 10,
      y: canvas.height / 6,
    };

    // atan2(dy, dx) gives the angle of the ray from `low` to each point
    const angleToLeft = Math.atan2(upperLeft.y - low.y, upperLeft.x - low.x);
    const angleToRight = Math.atan2(upperRight.y - low.y, upperRight.x - low.x);
    const startAngle = Math.min(angleToLeft, angleToRight);
    const endAngle = Math.max(angleToLeft, angleToRight);

    // radius = distance from apex to the farther of the two points
    const radius = Math.max(
      Math.hypot(upperLeft.x - low.x, upperLeft.y - low.y),
      Math.hypot(upperRight.x - low.x, upperRight.y - low.y),
    );

    // Build the wedge paths once
    const mainWedgePath = new Path2D();
    mainWedgePath.moveTo(low.x, low.y);
    mainWedgePath.arc(low.x, low.y, radius, startAngle, endAngle);
    mainWedgePath.closePath();

    ctx.fillStyle = "rgba(50, 80, 50, 0.35)";
    ctx.fill(mainWedgePath);

    const rightWedgePath = new Path2D();
    const angleToLowRight = Math.atan2(1, 5);
    rightWedgePath.moveTo(low.x, low.y);
    rightWedgePath.arc(low.x, low.y, radius, endAngle, angleToLowRight);
    rightWedgePath.closePath();

    const leftWedgePath = new Path2D();
    const angleToLowLeft = Math.atan2(1, -5);
    leftWedgePath.moveTo(low.x, low.y);
    leftWedgePath.arc(low.x, low.y, radius, angleToLowLeft, startAngle);
    leftWedgePath.closePath();

    const backWedgePath = new Path2D();
    backWedgePath.moveTo(low.x, low.y);
    backWedgePath.arc(low.x, low.y, radius, angleToLowRight, angleToLowLeft);
    backWedgePath.closePath();

    const { location } = gameModeState;

    ctx.strokeStyle = "green";
    ctx.lineWidth = 8;

    ctx.fillStyle = "green";

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(low.x, low.y);
    ctx.arc(low.x, low.y, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.clip(mainWedgePath);

    ctx.beginPath();
    ctx.moveTo(low.x, low.y);
    ctx.lineTo(upperLeft.x, upperLeft.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(low.x, low.y);
    ctx.lineTo(upperRight.x, upperRight.y);
    ctx.stroke();

    ctx.restore();

    for (let i = 1; i <= 6; i++) {
      const r = (radius / 6) * i;

      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(low.x, low.y, r, startAngle, endAngle);
      ctx.stroke();
    }

    if (location) {
      // map it to the screen
      const x = low.x + (location.x * radius);
      const y = low.y - (location.y * radius);

      if (ctx.isPointInPath(mainWedgePath, x, y)) {
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.ellipse(x, y, 5, 5, 0, 0, 360);
        ctx.fill();
      } else if (ctx.isPointInPath(rightWedgePath, x, y)) {
        ctx.fillStyle = "rgba(50, 0, 200, 0.35)";
        ctx.fill(rightWedgePath);
      } else if (ctx.isPointInPath(leftWedgePath, x, y)) {
        ctx.fillStyle = "rgba(50, 0, 200, 0.35)";
        ctx.fill(leftWedgePath);
      } else if (ctx.isPointInPath(backWedgePath, x, y)) {
        ctx.fillStyle = "rgba(50, 0, 200, 0.35)";
        ctx.fill(backWedgePath);
      }
    }
  };

  public static handlePointerDown = (
    gameModeState: RadarGameModeState,
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    send: (data: ClientEvent) => void,
  ) => {
    throw new Error("Method not implemented.");
  };

  public static handlePointerMove = (
    gameModeState: RadarGameModeState,
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    send: (data: ClientEvent) => void,
  ) => {
    throw new Error("Method not implemented.");
  };

  public static handlePointerUp = (
    gameModeState: RadarGameModeState,
    e: SimulatedPointerEvent,
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    send: (data: ClientEvent) => void,
  ) => {
    throw new Error("Method not implemented.");
  };
}