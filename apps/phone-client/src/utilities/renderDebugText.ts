export const DebugEmptyLine = "";

const fontSize = 12;

export function renderDebugText(ctx: CanvasRenderingContext2D, ...args: Array<string>) {
  ctx.fillStyle = "white";
  ctx.lineWidth = 1;
  ctx.font = `${fontSize}px consolas`;
  args.forEach((string, index) => {
    ctx.fillText(string, 25, fontSize + 25 + (index * (fontSize + 4)));
  });
}
