// 1 回のセッションで出すカードを選ぶ。案は docs/feature-cards.md の 5 章。
import type { FeatureCard } from "../data/cards";
import { DEPARTMENTS } from "../data/departments";
import type { Axis } from "../data/tags";
import { buildPreference, departmentInterest, type Answer } from "./scoring";

export type Quota = Record<Axis, number>;

/** 部門の専用カード（department）は最初の山札に入れず、followUpCards で追加する */
// 分野は、部門ごとの関心を聞くカード（部門の数 − 1 枚）に加えて、低レイヤなどのカードも出せるよう多めにする
export const DEFAULT_QUOTA: Quota = { domain: 9, language: 6, framework: 3, department: 0, ecosystem: 2 };

/** 追加で出す部門の専用カードの最大枚数 */
export const MAX_FOLLOW_UPS = 4;

/** 経験レベルがこれ以下の人には、専門用語の多いカード（advanced）を出さない */
export const BEGINNER_MAX_LEVEL = 3;

/** 経験レベルに合わせて、出してよいカードだけを返す */
export function cardsForLevel(cards: FeatureCard[], level: number): FeatureCard[] {
  return level <= BEGINNER_MAX_LEVEL ? cards.filter((c) => !c.advanced) : cards;
}

/** 同じ軸のカードを続けてよい最大枚数 */
export const MAX_SAME_AXIS_RUN = 2;

export type Random = () => number;

/** 軸ごとの枚数どおりにカードをランダムに選び、同じ軸が続きすぎないように並べる */
export function buildDeck(
  cards: FeatureCard[],
  quota: Quota = DEFAULT_QUOTA,
  random: Random = Math.random,
): FeatureCard[] {
  const picked: FeatureCard[] = [];
  for (const axis of Object.keys(quota) as Axis[]) {
    const pool = shuffle(cards.filter((c) => c.axis === axis), random);
    if (axis === "domain") {
      const must = interestCards(pool);
      const rest = pool.filter((c) => !must.includes(c));
      picked.push(...must, ...rest.slice(0, Math.max(0, quota.domain - must.length)));
    } else {
      picked.push(...pool.slice(0, quota[axis]));
    }
  }
  return arrange(shuffle(picked, random));
}

/**
 * 部門ごとに、関心を聞く分野のカードを 1 枚ずつ選ぶ。
 * どの部門についても、少なくとも 1 回は関心を答えてもらうため。
 */
function interestCards(domainPool: FeatureCard[]): FeatureCard[] {
  const must: FeatureCard[] = [];
  for (const d of DEPARTMENTS) {
    if (d.interestTags === null) continue;
    const tags = d.interestTags;
    const card = domainPool.find((c) => !must.includes(c) && tags.some((t) => (c.tags[t] ?? 0) > 0));
    if (card) must.push(card);
  }
  return must;
}

/**
 * 同じ軸が MAX_SAME_AXIS_RUN 枚を超えて続かないように並べ替える。
 * 毎回「続けて出しても上限を超えない軸」のうち、残りが最も多い軸のカードを出す。
 * こうすると、多い軸のカードが最後に固まって残ることを防げる。
 * 軸が偏っていてどうしても避けられない場合は、上限を超えて並べる。
 * 同じ軸の中では、入力の順番を保つ。
 */
export function arrange(cards: FeatureCard[]): FeatureCard[] {
  const rest = [...cards];
  const out: FeatureCard[] = [];
  while (rest.length > 0) {
    const remaining = new Map<Axis, number>();
    for (const c of rest) remaining.set(c.axis, (remaining.get(c.axis) ?? 0) + 1);
    let pick = -1;
    for (let i = 0; i < rest.length; i++) {
      const axis = rest[i].axis;
      if (wouldExceedRun(out, axis)) continue;
      if (pick === -1 || remaining.get(axis)! > remaining.get(rest[pick].axis)!) pick = i;
    }
    out.push(rest.splice(pick === -1 ? 0 : pick, 1)[0]);
  }
  return out;
}

/**
 * 回答から関心があると判定した部門（関心度 > 0）の専用カードを、関心度の高い部門から順に選ぶ。
 * 複数の部門に関心がある場合は、部門を順番に回って 1 枚ずつ選ぶ。
 * まだ答えていないカードだけを返す。
 */
export function followUpCards(
  answers: Answer[],
  cards: FeatureCard[],
  max = MAX_FOLLOW_UPS,
  random: Random = Math.random,
): FeatureCard[] {
  const pref = buildPreference(answers, cards);
  const answered = new Set(answers.map((a) => a.cardId));
  const pools = DEPARTMENTS
    .map((d) => ({
      interest: departmentInterest(d, pref),
      pool: shuffle(cards.filter((c) => c.axis === "department" && c.department === d.id && !answered.has(c.id)), random),
    }))
    .filter((d) => d.interest > 0 && Number.isFinite(d.interest) && d.pool.length > 0)
    .sort((a, b) => b.interest - a.interest)
    .map((d) => d.pool);

  const out: FeatureCard[] = [];
  while (out.length < max && pools.some((p) => p.length > 0)) {
    for (const pool of pools) {
      const card = pool.shift();
      if (card && out.length < max) out.push(card);
    }
  }
  return out;
}

function wouldExceedRun(out: FeatureCard[], axis: Axis): boolean {
  if (out.length < MAX_SAME_AXIS_RUN) return false;
  return out.slice(-MAX_SAME_AXIS_RUN).every((c) => c.axis === axis);
}

function shuffle<T>(items: T[], random: Random): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
