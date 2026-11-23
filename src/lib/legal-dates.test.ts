import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { LEGAL_DATES, type LegalPage } from "./legal-dates";

/** ページの本文（<DocLayout> の中身）。空白と改行の違いは無視する */
function pageText(page: LegalPage): string {
  const source = readFileSync(`src/pages/${page}.astro`, "utf8");
  const match = source.match(/<DocLayout\b[^>]*>([\s\S]*)<\/DocLayout>/);
  if (!match) throw new Error(`${page}.astro に <DocLayout> が見つからない`);
  return match[1].replace(/\s+/g, " ").trim();
}

function textHash(page: LegalPage): string {
  return createHash("sha256").update(pageText(page)).digest("hex").slice(0, 16);
}

describe("規約などの最終更新日", () => {
  for (const page of Object.keys(LEGAL_DATES) as LegalPage[]) {
    it(`${page}: 文面が変わったら、最終更新日も見直す`, () => {
      const { textHash: recorded } = LEGAL_DATES[page];
      expect(
        textHash(page),
        `${page}.astro の本文が変わった。文面を変えたなら LEGAL_DATES.${page}.updated を変更した日にする。` +
          `どちらの場合も textHash を "${textHash(page)}" にする（src/lib/legal-dates.ts）`,
      ).toBe(recorded);
    });

    it(`${page}: 日付は YYYY-MM-DD`, () => {
      expect(LEGAL_DATES[page].updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  }
});
