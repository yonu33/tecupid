// スプライトの描き間違い（行の長さのずれ、色の指定漏れ）を検出する
import { describe, expect, it } from "vitest";
import { toRuns } from "./PixelSprite";
import { ALL_SPRITES } from "./sprites";

describe("スプライト", () => {
  for (const [name, sprite] of Object.entries(ALL_SPRITES)) {
    it(`${name}: すべての行の長さが同じ`, () => {
      const width = sprite.rows[0].length;
      for (const [i, row] of sprite.rows.entries()) {
        expect(row.length, `${name} の ${i} 行目`).toBe(width);
      }
    });

    it(`${name}: 使っている文字すべてに色がある`, () => {
      for (const ch of new Set(sprite.rows.join(""))) {
        if (ch === ".") continue;
        expect(sprite.palette[ch], `${name} の「${ch}」`).toBeDefined();
      }
    });
  }
});

describe("toRuns", () => {
  it("横に同じ色が続くピクセルを 1 つにまとめ、透明は飛ばす", () => {
    const runs = toRuns({ rows: ["aab.a"], palette: { a: "red", b: "blue" } });
    expect(runs).toEqual([
      { x: 0, y: 0, width: 2, color: "red" },
      { x: 2, y: 0, width: 1, color: "blue" },
      { x: 4, y: 0, width: 1, color: "red" },
    ]);
  });
});
