// データの整合性チェック（requirements.md 8 章の品質要件）
import { describe, expect, it } from "vitest";
import { CARDS } from "./cards";
import { TAG_INFO, TAGS, type Tag, type TagWeights } from "./tags";
import { DEPARTMENTS } from "./departments";
import { AI_DATA, DATABASES, FRAMEWORKS, INFRA, LANGUAGES, TECHNOLOGIES } from "./technologies";

const ALLOWED_WEIGHTS = new Set([-1, -0.5, 0.5, 1]);

function checkWeights(owner: string, weights: TagWeights) {
  for (const [tag, w] of Object.entries(weights)) {
    expect(TAGS, `${owner}: 未定義のタグ ${tag}`).toContain(tag);
    expect(ALLOWED_WEIGHTS.has(w as number), `${owner}.${tag}: 重み ${w} は −1, −0.5, 0.5, 1 のどれか`).toBe(true);
  }
}

describe("タグ", () => {
  it("すべてのタグに TAG_INFO がある", () => {
    expect(Object.keys(TAG_INFO).sort()).toEqual([...TAGS].sort());
  });
});

describe("特徴カード", () => {
  it("id が重複していない", () => {
    const ids = CARDS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("タグと重みが正しい", () => {
    for (const card of CARDS) {
      expect(Object.keys(card.tags).length, `${card.id}: タグが空`).toBeGreaterThan(0);
      checkWeights(card.id, card.tags);
    }
  });

  it("カードの文に技術名が入っていない", () => {
    // 単語の一部としての一致（例: "Google" の中の "Go"）は除く
    const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const patterns = TECHNOLOGIES.map((t) => ({
      name: t.name,
      re: new RegExp(`(^|[^A-Za-z0-9])${escape(t.name)}($|[^A-Za-z0-9])`),
    }));
    for (const card of CARDS) {
      for (const { name, re } of patterns) {
        expect(re.test(card.text), `${card.id} に「${name}」が入っている`).toBe(false);
      }
    }
  });

  it("部門の専用カードにだけ department が付いている", () => {
    for (const card of CARDS) {
      expect(card.axis === "department", `${card.id}`).toBe(card.department !== undefined);
    }
  });

  it("すべてのタグが、少なくとも 1 枚のカードに +1 か +0.5 で出てくる", () => {
    for (const tag of TAGS) {
      const found = CARDS.some((c) => (c.tags[tag] ?? 0) > 0);
      expect(found, `${tag} を好きと答えられるカードがない`).toBe(true);
    }
  });
});

describe("技術", () => {
  it("id が重複していない", () => {
    const ids = TECHNOLOGIES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("タグと重みが正しい", () => {
    for (const tech of TECHNOLOGIES) checkWeights(tech.id, tech.tagWeights);
  });

  it("各技術には、その部門に付けてよいタグだけが付いている", () => {
    for (const tech of TECHNOLOGIES) {
      for (const tag of Object.keys(tech.tagWeights) as Tag[]) {
        const target = TAG_INFO[tag].appliesTo;
        expect(target === "all" || target.includes(tech.department), `${tech.id} に ${tag} は付けられない`).toBe(true);
      }
    }
  });

  it("すべての部門に技術がある", () => {
    for (const d of DEPARTMENTS) {
      expect(TECHNOLOGIES.some((t) => t.department === d.id), `${d.id} に技術がない`).toBe(true);
    }
  });

  it("部門の関心度に使うタグは、分野の軸のタグである", () => {
    for (const d of DEPARTMENTS) {
      for (const tag of d.interestTags ?? []) expect(TAG_INFO[tag].axis, `${d.id}: ${tag}`).toBe("domain");
    }
  });

  it("フレームワークの言語が存在する", () => {
    const langIds = new Set(LANGUAGES.map((l) => l.id));
    for (const fw of FRAMEWORKS) {
      expect(fw.languages.length).toBeGreaterThan(0);
      for (const id of fw.languages) expect(langIds.has(id), `${fw.id}: 言語 ${id} がない`).toBe(true);
    }
  });

  it("学習リソースの URL が https である", () => {
    for (const tech of TECHNOLOGIES) {
      expect(tech.resources.length).toBeGreaterThan(0);
      for (const r of tech.resources) expect(r.url.startsWith("https://"), `${tech.id}: ${r.url}`).toBe(true);
    }
  });

  // 重みが同じだと推薦で区別できない。
  // ただしフレームワークは、使う言語が違えば組み合わせのスコアで区別できるので許す
  // （例: Ruby on Rails と Laravel。technology-weights.md の 3.1）。
  it("同じ部門の中に、区別できない技術がない", () => {
    const keyOf = (w: object) => JSON.stringify(Object.entries(w).sort());
    for (const group of [LANGUAGES, INFRA, AI_DATA, DATABASES]) {
      const seen = new Map<string, string>();
      for (const t of group) {
        const key = keyOf(t.tagWeights);
        expect(seen.get(key), `${t.id} と ${seen.get(key)} の重みが同じ`).toBeUndefined();
        seen.set(key, t.id);
      }
    }
    const fwSeen = new Map<string, string>();
    for (const f of FRAMEWORKS) {
      const key = keyOf(f.tagWeights) + keyOf([...f.languages].sort());
      expect(fwSeen.get(key), `${f.id} と ${fwSeen.get(key)} の重みも言語も同じ`).toBeUndefined();
      fwSeen.set(key, f.id);
    }
  });
});
