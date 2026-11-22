import { describe, expect, it } from "vitest";
import type { FeatureCard } from "../data/cards";
import type { Framework, Language } from "../data/technologies";
import { applyAxisWeights, beginnerPrior, bestCombination, buildPreference, cosine, rank, reasonsFor, recommend } from "./scoring";

const cards: FeatureCard[] = [
  { id: "a", axis: "language", text: "", tags: { "static-typing": 1 } },
  { id: "b", axis: "language", text: "", tags: { gc: -1, "native-compile": 0.5 } },
  { id: "c", axis: "domain", text: "", tags: { "web-frontend": 1 } },
];

const lang = (id: string, tagWeights: Language["tagWeights"]): Language => ({
  department: "language", id, name: id, summary: "", tagWeights, resources: [],
});

const fw = (id: string, languages: string[], tagWeights: Framework["tagWeights"]): Framework => ({
  department: "framework", category: "frontend", id, name: id, summary: "", languages, tagWeights, resources: [],
});

describe("buildPreference", () => {
  it("❤ は重みをそのまま足し、✕ は符号を反転して足す", () => {
    const pref = buildPreference(
      [{ cardId: "a", liked: true }, { cardId: "b", liked: false }],
      cards,
    );
    expect(pref).toEqual({ "static-typing": 1, gc: 1, "native-compile": -0.5 });
  });

  it("✕ の係数を変えられる", () => {
    const pref = buildPreference([{ cardId: "a", liked: false }], cards, 0.5);
    expect(pref).toEqual({ "static-typing": -0.5 });
  });

  it("存在しないカードの回答は無視する", () => {
    expect(buildPreference([{ cardId: "zzz", liked: true }], cards)).toEqual({});
  });
});

describe("cosine", () => {
  it("同じ向きなら 1、逆向きなら −1", () => {
    expect(cosine({ gc: 1, oop: 1 }, { gc: 2, oop: 2 })).toBeCloseTo(1);
    expect(cosine({ gc: 1 }, { gc: -1 })).toBeCloseTo(-1);
  });

  it("どちらかが空なら 0", () => {
    expect(cosine({}, { gc: 1 })).toBe(0);
    expect(cosine({ gc: 1 }, {})).toBe(0);
  });
});

describe("rank と reasonsFor", () => {
  const typed = lang("typed", { "static-typing": 1 });
  const dynamic = lang("dynamic", { "static-typing": -1 });

  it("好みに近い技術が上に来る", () => {
    const answers = [{ cardId: "a", liked: true }];
    const ranked = rank([dynamic, typed], buildPreference(answers, cards), answers, cards);
    expect(ranked.map((r) => r.tech.id)).toEqual(["typed", "dynamic"]);
  });

  it("推薦理由は、スコアを押し上げた ❤ のカードだけ", () => {
    const liked = [cards[0], cards[2]];
    expect(reasonsFor(typed.tagWeights, liked, 3).map((r) => r.card.id)).toEqual(["a"]);
    expect(reasonsFor(dynamic.tagWeights, liked, 3)).toEqual([]);
  });
});

describe("bestCombination", () => {
  it("フレームワークのスコア ＋ α × 言語のスコアが最大の組を選ぶ", () => {
    const L = (id: string, score: number) => ({ tech: lang(id, {}), score, reasons: [] });
    const F = (id: string, languages: string[], score: number) => ({ tech: fw(id, languages, {}), score, reasons: [] });
    const combo = bestCombination(
      [F("x", ["l1"], 0.8), F("y", ["l1", "l2"], 0.7)],
      [L("l1", 0.1), L("l2", 0.9)],
      0.5,
    );
    // x + l1 = 0.85, y + l2 = 1.15
    expect(combo?.framework.tech.id).toBe("y");
    expect(combo?.language.tech.id).toBe("l2");
    expect(combo?.score).toBeCloseTo(1.15);
  });

  it("スコアが正のフレームワークがなければ null", () => {
    const L = { tech: lang("l1", {}), score: 0.9, reasons: [] };
    const F = { tech: fw("x", ["l1"], {}), score: 0, reasons: [] };
    expect(bestCombination([F], [L], 1)).toBeNull();
  });
});

describe("beginnerPrior", () => {
  it("LV.0 で最も強く、LV.10 では空", () => {
    expect(beginnerPrior(0, 1.5)).toEqual({ "simple-syntax": 1.5, gc: 1.5, "fast-feedback": 1.5, maturity: 0.75 });
    expect(beginnerPrior(5, 1.5)["simple-syntax"]).toBeCloseTo(0.75);
    expect(beginnerPrior(10, 1.5)).toEqual({});
  });

  it("範囲外のレベルは 0〜10 に丸める", () => {
    expect(beginnerPrior(-3, 1)).toEqual(beginnerPrior(0, 1));
    expect(beginnerPrior(99, 1)).toEqual({});
  });
});

describe("applyAxisWeights", () => {
  it("軸ごとの重みを掛ける。指定のない軸は 1 倍", () => {
    expect(applyAxisWeights({ "web-frontend": 1, gc: -1 }, { domain: 2 })).toEqual({ "web-frontend": 2, gc: -1 });
  });
});

describe("recommend", () => {
  it("言語とフレームワークを別々にランキングする", () => {
    const techs = [lang("typed", { "static-typing": 1 }), fw("ui", ["typed"], { "web-frontend": 1 })];
    const result = recommend([{ cardId: "a", liked: true }, { cardId: "c", liked: true }], cards, techs);
    expect(result.languages.map((r) => r.tech.id)).toEqual(["typed"]);
    expect(result.frameworks.map((r) => r.tech.id)).toEqual(["ui"]);
    expect(result.combination?.framework.tech.id).toBe("ui");
  });
});
