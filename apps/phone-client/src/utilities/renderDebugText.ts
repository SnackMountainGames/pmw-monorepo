export const DebugEmptyLine = "";

const fontSize = 12;

export function renderDebugText(
  ctx: CanvasRenderingContext2D,
  ...args: Array<string>
) {
  ctx.save();
  ctx.globalAlpha = 1.0;
  ctx.fillStyle = "white";
  ctx.lineWidth = 1;
  ctx.font = `${fontSize}px consolas`;
  args.forEach((string, index) => {
    ctx.fillText(string, 25, fontSize + 25 + index * (fontSize + 4));
  });
  ctx.restore();
}
