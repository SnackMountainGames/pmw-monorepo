import { CanvasState } from "../state/GameState";

export class SingleButtonMode {
  public static render = (
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    ctx: CanvasRenderingContext2D,
  ) => {
    ctx.strokeStyle = "green";
    ctx.beginPath();
    ctx.ellipse(canvas.width /2 , canvas.height / 2, 10, 10, 0, 0, 360);
    ctx.stroke();
  };
}
