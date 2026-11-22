// スプライトを SVG で描く。横に同じ色が続くピクセルは 1 つの rect にまとめる。
import type { Sprite } from "./sprites";

type Run = { x: number; y: number; width: number; color: string };

const cache = new WeakMap<Sprite, Run[]>();

/** スプライトの各行を、同じ色が続く区間（run）に分ける */
export function toRuns(sprite: Sprite): Run[] {
  const cached = cache.get(sprite);
  if (cached) return cached;
  const runs: Run[] = [];
  sprite.rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      let end = x + 1;
      while (end < row.length && row[end] === ch) end++;
      if (ch !== ".") runs.push({ x, y, width: end - x, color: sprite.palette[ch] });
      x = end;
    }
  });
  cache.set(sprite, runs);
  return runs;
}

type Props = {
  sprite: Sprite;
  /** 1 ピクセルを何 px で描くか。整数にすると輪郭がにじまない */
  scale?: number;
  className?: string;
  /** 意味のある画像のときだけ指定する。省略すると装飾として読み上げから外す */
  label?: string;
};

export default function PixelSprite({ sprite, scale = 4, className, label }: Props) {
  const width = sprite.rows[0].length;
  const height = sprite.rows.length;
  return (
    <svg
      className={className ? `px-sprite ${className}` : "px-sprite"}
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {toRuns(sprite).map((run) => (
        <rect key={`${run.x}-${run.y}`} x={run.x} y={run.y} width={run.width} height={1} style={{ fill: run.color }} />
      ))}
    </svg>
  );
}
