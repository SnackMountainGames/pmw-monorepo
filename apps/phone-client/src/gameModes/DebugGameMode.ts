import { CanvasState } from "../state/GameState";

export class DebugGameMode {
  public static render = (
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    ctx: CanvasRenderingContext2D,
  ) => {
    // canvas outline
    ctx.lineWidth = 3;
    ctx.strokeStyle = "blue";
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // pointer
    if (canvasState.pointer) {
      ctx.strokeStyle = "green";
      ctx.beginPath();
      ctx.ellipse(
        canvasState.pointer.x,
        canvasState.pointer.y,
        2,
        2,
        0,
        0,
        360,
      );
      ctx.stroke();
    }

    // objects
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
  };
}