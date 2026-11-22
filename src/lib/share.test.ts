import { describe, expect, it } from "vitest";
import { TECHNOLOGIES } from "../data/technologies";
import { buildShareUrl, parseSharedMatch, shareText } from "./share";

describe("buildShareUrl", () => {
  it("技術の ID だけをクエリに入れる", () => {
    expect(buildShareUrl("https://example.com/result?x=1", ["typescript", "react"])).toBe(
      "https://example.com/?match=typescript%2Creact",
    );
  });

  it("4 件目以降は入れない", () => {
    const url = new URL(buildShareUrl("https://example.com", ["a", "b", "c", "d"]));
    expect(url.searchParams.get("match")).toBe("a,b,c");
  });
});

describe("parseSharedMatch", () => {
  it("知っている ID を、順番どおりに技術として返す", () => {
    const result = parseSharedMatch("?match=typescript,react", TECHNOLOGIES);
    expect(result?.map((t) => t.name)).toEqual(["TypeScript", "React"]);
  });

  it("buildShareUrl で作った URL を読める", () => {
    const url = new URL(buildShareUrl("https://example.com", ["go", "kubernetes"]));
    expect(parseSharedMatch(url.search, TECHNOLOGIES)?.map((t) => t.id)).toEqual(["go", "kubernetes"]);
  });

  it("不正な値なら null（何も表示しない）", () => {
    expect(parseSharedMatch("", TECHNOLOGIES)).toBeNull();
    expect(parseSharedMatch("?match=", TECHNOLOGIES)).toBeNull();
    expect(parseSharedMatch("?match=typescript,unknown", TECHNOLOGIES)).toBeNull();
    expect(parseSharedMatch("?match=go,rust,python,java", TECHNOLOGIES)).toBeNull();
    expect(parseSharedMatch("?match=<script>", TECHNOLOGIES)).toBeNull();
  });
});

describe("shareText", () => {
  it("技術名を ＋ でつなぐ", () => {
    expect(shareText(["TypeScript", "React"])).toBe("tecupid で私にぴったりの技術は TypeScript ＋ React でした");
  });
});
