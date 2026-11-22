import { describe, expect, it } from "vitest";
import { CARDS } from "../data/cards";
import { DEPARTMENTS } from "../data/departments";
import {
  arrange,
  BEGINNER_MAX_LEVEL,
  buildDeck,
  cardsForLevel,
  DEFAULT_QUOTA,
  followUpCards,
  MAX_FOLLOW_UPS,
  MAX_SAME_AXIS_RUN,
} from "./deck";

/** テスト用の決定的な乱数 */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

describe("buildDeck", () => {
  it("軸ごとの枚数どおりに、重複なく選ぶ", () => {
    for (let seed = 1; seed <= 50; seed++) {
      const deck = buildDeck(CARDS, DEFAULT_QUOTA, seeded(seed));
      const total = Object.values(DEFAULT_QUOTA).reduce((a, b) => a + b, 0);
      expect(deck).toHaveLength(total);
      expect(new Set(deck.map((c) => c.id)).size).toBe(total);
      for (const [axis, n] of Object.entries(DEFAULT_QUOTA)) {
        expect(deck.filter((c) => c.axis === axis)).toHaveLength(n);
      }
    }
  });

  it("同じ軸のカードが続きすぎない", () => {
    for (let seed = 1; seed <= 50; seed++) {
      const deck = buildDeck(CARDS, DEFAULT_QUOTA, seeded(seed));
      let run = 1;
      for (let i = 1; i < deck.length; i++) {
        run = deck[i].axis === deck[i - 1].axis ? run + 1 : 1;
        expect(run, `seed ${seed} の ${i} 枚目`).toBeLessThanOrEqual(MAX_SAME_AXIS_RUN);
      }
    }
  });
});

describe("buildDeck の部門", () => {
  it("どの部門についても、関心を聞くカードが必ず 1 枚以上入る", () => {
    for (let seed = 1; seed <= 50; seed++) {
      const deck = buildDeck(CARDS, DEFAULT_QUOTA, seeded(seed));
      for (const d of DEPARTMENTS) {
        if (d.interestTags === null) continue;
        const tags = d.interestTags;
        const found = deck.some((c) => tags.some((t) => (c.tags[t] ?? 0) > 0));
        expect(found, `seed ${seed}: ${d.id} の関心を聞くカードがない`).toBe(true);
      }
    }
  });

  it("部門の専用カードは最初の山札に入らない", () => {
    const deck = buildDeck(CARDS, DEFAULT_QUOTA, seeded(1));
    expect(deck.filter((c) => c.axis === "department")).toHaveLength(0);
  });
});

describe("cardsForLevel", () => {
  it(`LV.${BEGINNER_MAX_LEVEL} 以下では専門用語の多いカードを外し、それより上ではすべて出す`, () => {
    expect(cardsForLevel(CARDS, BEGINNER_MAX_LEVEL).some((c) => c.advanced)).toBe(false);
    expect(cardsForLevel(CARDS, BEGINNER_MAX_LEVEL + 1)).toEqual(CARDS);
  });

  it("初心者向けのカードだけでも、軸ごとの枚数を満たした山札を作れる", () => {
    const beginnerCards = cardsForLevel(CARDS, 0);
    for (let seed = 1; seed <= 20; seed++) {
      const deck = buildDeck(beginnerCards, DEFAULT_QUOTA, seeded(seed));
      for (const [axis, n] of Object.entries(DEFAULT_QUOTA)) {
        expect(deck.filter((c) => c.axis === axis)).toHaveLength(n);
      }
    }
  });
});

describe("followUpCards", () => {
  it("関心のある部門の専用カードを、最大枚数まで返す", () => {
    const cards = followUpCards([{ cardId: "d14", liked: true }], CARDS, MAX_FOLLOW_UPS, seeded(1));
    expect(cards).toHaveLength(MAX_FOLLOW_UPS);
    expect(cards.every((c) => c.department === "infra")).toBe(true);
  });

  it("関心のある部門がなければ、何も返さない", () => {
    expect(followUpCards([{ cardId: "d14", liked: false }], CARDS)).toEqual([]);
  });

  it("答えたカードは返さない", () => {
    const answers = [
      { cardId: "d14", liked: true },
      { cardId: "i01", liked: true },
      { cardId: "i02", liked: false },
      { cardId: "i03", liked: true },
    ];
    const ids = followUpCards(answers, CARDS, 10).map((c) => c.id);
    expect(ids.sort()).toEqual(["i04", "i05", "i06"]);
  });
});

describe("arrange", () => {
  it("避けられない場合は、そのまま並べる", () => {
    const same = CARDS.filter((c) => c.axis === "language").slice(0, 4);
    expect(arrange(same)).toHaveLength(4);
  });
});
