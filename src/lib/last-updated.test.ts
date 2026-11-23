import { describe, expect, it } from "vitest";
import { jstDate, lastUpdated, TECH_DATA_FILES, techDataUpdated } from "./last-updated";

describe("jstDate", () => {
  it("日本時間の日付にする", () => {
    expect(jstDate(new Date("2026-11-23T14:59:59Z"))).toBe("2026-11-23");
    expect(jstDate(new Date("2026-11-23T15:00:00Z"))).toBe("2026-11-24");
  });
});

describe("lastUpdated", () => {
  it("YYYY-MM-DD を返す", () => {
    expect(lastUpdated("package.json")).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("複数のファイルなら、最も新しい日付", () => {
    const a = lastUpdated("package.json");
    const b = lastUpdated("LICENSE");
    expect(lastUpdated("package.json", "LICENSE")).toBe(a > b ? a : b);
  });

  it("ないファイルはエラー（ファイル名の書き間違いに気づけるように）", () => {
    expect(() => lastUpdated("src/no-such-file.ts")).toThrow();
  });

  it("技術の情報のファイルは、すべて存在する", () => {
    expect(TECH_DATA_FILES.length).toBeGreaterThan(0);
    expect(techDataUpdated()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
