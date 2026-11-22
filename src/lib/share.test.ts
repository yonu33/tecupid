import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { CARDS } from "../data/cards";
import { TECHNOLOGIES } from "../data/technologies";
import { recommend } from "./scoring";
import {
  buildShareUrl,
  ogImagePath,
  parseSharedIds,
  parseSharedMatch,
  sharePath,
  shareTargets,
  sharePostText,
  shareText,
  xShareUrl,
} from "./share";

describe("shareTargets", () => {
  const targets = shareTargets(TECHNOLOGIES);
  const keys = targets.map((ids) => ids.join("/"));

  it("言語とフレームワークの組と、言語 1 つずつを含む", () => {
    expect(keys).toContain("typescript/react");
    expect(keys).toContain("kotlin/spring-boot");
    expect(keys).toContain("python");
    expect(keys).not.toContain("python/react");
  });

  it("重複がなく、すべて parseSharedIds で読める", () => {
    expect(new Set(keys).size).toBe(keys.length);
    for (const ids of targets) expect(parseSharedIds(ids, TECHNOLOGIES)).not.toBeNull();
  });

  it("結果画面でシェアされる組は、必ず一覧に含まれる（ページと画像がある）", () => {
    const cardIds = CARDS.map((c) => c.id);
    // 回答のパターンをいくつか作って確かめる
    for (let seed = 0; seed < 60; seed++) {
      const answers = cardIds.map((cardId, i) => ({ cardId, liked: (i * 7 + seed) % 3 !== 0 }));
      const r = recommend(answers.slice(0, 10 + (seed % 30)), CARDS, TECHNOLOGIES, { level: seed % 11 });
      const ids = r.combination
        ? [r.combination.language.tech.id, r.combination.framework.tech.id]
        : [r.languages[0].tech.id];
      expect(keys).toContain(ids.join("/"));
    }
  });

  it("すべての組に OGP 画像がある（npm run og で作る）", () => {
    const publicDir = fileURLToPath(new URL("../../public", import.meta.url));
    for (const ids of [...targets, undefined]) {
      const file = path.join(publicDir, ogImagePath(ids));
      expect(existsSync(file), `${file} がない。npm run og で作る`).toBe(true);
    }
  });
});

describe("シェア用の URL", () => {
  it("技術の ID だけをパスに入れる", () => {
    expect(sharePath(["typescript", "react"])).toBe("/m/typescript/react/");
    expect(buildShareUrl("https://example.com/result?x=1", ["go"])).toBe("https://example.com/m/go/");
  });

  it("OGP 画像のパス", () => {
    expect(ogImagePath(["typescript", "react"])).toBe("/og/typescript--react.png");
    expect(ogImagePath()).toBe("/og/default.png");
  });

  it("X の投稿画面の URL", () => {
    expect(xShareUrl("テキスト", "https://example.com/m/go/")).toBe(
      "https://x.com/intent/post?text=%E3%83%86%E3%82%AD%E3%82%B9%E3%83%88&url=https%3A%2F%2Fexample.com%2Fm%2Fgo%2F",
    );
  });
});

describe("parseSharedIds と parseSharedMatch", () => {
  it("知っている ID を、順番どおりに技術として返す", () => {
    expect(parseSharedIds(["typescript", "react"], TECHNOLOGIES)?.map((t) => t.name)).toEqual(["TypeScript", "React"]);
    expect(parseSharedMatch("?match=go,kubernetes", TECHNOLOGIES)?.map((t) => t.id)).toEqual(["go", "kubernetes"]);
  });

  it("不正な値なら null（何も表示しない）", () => {
    expect(parseSharedMatch("", TECHNOLOGIES)).toBeNull();
    expect(parseSharedMatch("?match=", TECHNOLOGIES)).toBeNull();
    expect(parseSharedMatch("?match=typescript,unknown", TECHNOLOGIES)).toBeNull();
    expect(parseSharedMatch("?match=go,rust,python,java", TECHNOLOGIES)).toBeNull();
    expect(parseSharedMatch("?match=<script>", TECHNOLOGIES)).toBeNull();
  });
});

describe("sharePostText", () => {
  it("文章の最後に #tecupid を付ける", () => {
    expect(sharePostText(["Go", "Gin"])).toBe("tecupid で私にぴったりの技術は Go ＋ Gin でした\n\n#tecupid");
  });
});

describe("shareText", () => {
  it("技術名を ＋ でつなぐ", () => {
    expect(shareText(["TypeScript", "React"])).toBe("tecupid で私にぴったりの技術は TypeScript ＋ React でした");
  });
});
