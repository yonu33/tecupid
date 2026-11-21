// 推薦のスコアリング。仕様は docs/requirements.md の 6.2。
// UI に依存しない純粋関数だけを置く。
import type { FeatureCard } from "../data/cards";
import { DEPARTMENTS, type Department } from "../data/departments";
import { TAG_INFO, type Axis, type Tag, type TagWeights } from "../data/tags";
import type { Framework, Language, Technology } from "../data/technologies";

export type Answer = { cardId: string; liked: boolean };

export type Preference = Partial<Record<Tag, number>>;

export type Reason = { card: FeatureCard; contribution: number };

export type Ranked<T extends Technology> = {
  tech: T;
  score: number;
  reasons: Reason[];
};

export type Combination = {
  framework: Ranked<Framework>;
  language: Ranked<Language>;
  score: number;
};

export type DepartmentResult = {
  department: Department;
  /** 関心度。言語の部門は常に Infinity */
  interest: number;
  /** 関心があると判定した部門か（結果画面で上に大きく出す） */
  featured: boolean;
  ranked: Ranked<Technology>[];
};

export type Recommendation = {
  /** 言語を先頭に、関心度の高い順に並べた部門 */
  departments: DepartmentResult[];
  languages: Ranked<Language>[];
  frameworks: Ranked<Framework>[];
  combination: Combination | null;
};

export type ScoringOptions = {
  /** ✕ のカードに掛ける係数。1 なら ❤ と同じ強さで逆向きに効く */
  nopeFactor?: number;
  /** おすすめの組み合わせで、言語のスコアに掛ける係数 */
  alpha?: number;
  /** 推薦理由として返すカードの最大数 */
  maxReasons?: number;
  /**
   * 軸ごとの重み。類似度を計算する前に、ユーザーと技術の両方のベクトルに掛ける。
   * 分野のタグは 1 つの技術に 1〜2 個しかなく、言語の性質のタグに埋もれやすいので強める。
   */
  axisWeights?: Partial<Record<Axis, number>>;
};

const DEFAULTS: Required<ScoringOptions> = {
  nopeFactor: 1,
  alpha: 1,
  maxReasons: 3,
  axisWeights: { domain: 2 },
};

/** 回答からタグの選好ベクトルを作る */
export function buildPreference(
  answers: Answer[],
  cards: FeatureCard[],
  nopeFactor = DEFAULTS.nopeFactor,
): Preference {
  const byId = new Map(cards.map((c) => [c.id, c]));
  const pref: Preference = {};
  for (const answer of answers) {
    const card = byId.get(answer.cardId);
    if (!card) continue;
    const sign = answer.liked ? 1 : -nopeFactor;
    for (const [tag, weight] of entries(card.tags)) {
      pref[tag] = (pref[tag] ?? 0) + sign * weight;
    }
  }
  return pref;
}

/** 2 つの重みベクトルのコサイン類似度。どちらかが 0 ベクトルなら 0 */
export function cosine(a: TagWeights, b: TagWeights): number {
  let dot = 0;
  for (const [tag, wa] of entries(a)) dot += wa * (b[tag] ?? 0);
  const na = norm(a);
  const nb = norm(b);
  return na === 0 || nb === 0 ? 0 : dot / (na * nb);
}

/** 軸ごとの重みを掛けたベクトルを返す */
export function applyAxisWeights(w: TagWeights, axisWeights: Partial<Record<Axis, number>>): TagWeights {
  const out: TagWeights = {};
  for (const [tag, v] of entries(w)) out[tag] = v * (axisWeights[TAG_INFO[tag].axis] ?? 1);
  return out;
}

/** 技術をスコアの高い順に並べる。同点なら元の配列の順を保つ */
export function rank<T extends Technology>(
  techs: T[],
  pref: Preference,
  answers: Answer[],
  cards: FeatureCard[],
  options: Pick<ScoringOptions, "maxReasons" | "axisWeights"> = {},
): Ranked<T>[] {
  const maxReasons = options.maxReasons ?? DEFAULTS.maxReasons;
  const axisWeights = options.axisWeights ?? DEFAULTS.axisWeights;
  const liked = likedCards(answers, cards);
  const weightedPref = applyAxisWeights(pref, axisWeights);
  return techs
    .map((tech) => {
      const weightedTech = applyAxisWeights(tech.tagWeights, axisWeights);
      return {
        tech,
        score: cosine(weightedPref, weightedTech),
        reasons: reasonsFor(weightedTech, liked, maxReasons, axisWeights),
      };
    })
    .sort((a, b) => b.score - a.score);
}

/**
 * ❤ のカードのうち、その技術のスコアを押し上げたものを寄与の大きい順に返す。
 * techWeights には軸の重みを掛けたあとのベクトルを渡す。
 */
export function reasonsFor(
  techWeights: TagWeights,
  liked: FeatureCard[],
  max: number,
  axisWeights: Partial<Record<Axis, number>> = {},
): Reason[] {
  return liked
    .map((card) => ({ card, contribution: dot(applyAxisWeights(card.tags, axisWeights), techWeights) }))
    .filter((r) => r.contribution > 0)
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, max);
}

/**
 * フレームワークごとに最もスコアの高い言語と組にし、最も高い組を返す。
 * スコアが 0 より大きいフレームワークがなければ、組み合わせは出さない（null）。
 * 例: 低レイヤ志向の人に、合わないフレームワークを無理に勧めないため。
 */
export function bestCombination(
  frameworks: Ranked<Framework>[],
  languages: Ranked<Language>[],
  alpha = DEFAULTS.alpha,
): Combination | null {
  const langById = new Map(languages.map((l) => [l.tech.id, l]));
  let best: Combination | null = null;
  for (const fw of frameworks) {
    if (fw.score <= 0) continue;
    const candidates = fw.tech.languages
      .map((id) => langById.get(id))
      .filter((l): l is Ranked<Language> => l !== undefined);
    if (candidates.length === 0) continue;
    const lang = candidates.reduce((a, b) => (b.score > a.score ? b : a));
    const score = fw.score + alpha * lang.score;
    if (best === null || score > best.score) best = { framework: fw, language: lang, score };
  }
  return best;
}

/** 回答から、部門別のランキングとおすすめの組み合わせを作る */
export function recommend(
  answers: Answer[],
  cards: FeatureCard[],
  technologies: Technology[],
  options: ScoringOptions = {},
): Recommendation {
  const opt = { ...DEFAULTS, ...options };
  const pref = buildPreference(answers, cards, opt.nopeFactor);
  const languages = rank(
    technologies.filter((t): t is Language => t.department === "language"),
    pref, answers, cards, opt,
  );
  const frameworks = rank(
    technologies.filter((t): t is Framework => t.department === "framework"),
    pref, answers, cards, opt,
  );
  const departments = DEPARTMENTS
    .map((department): DepartmentResult => {
      const ranked =
        department.id === "language" ? languages
        : department.id === "framework" ? frameworks
        : rank(technologies.filter((t) => t.department === department.id), pref, answers, cards, opt);
      const interest = departmentInterest(department, pref);
      return { department, interest, featured: interest > 0, ranked };
    })
    .filter((d) => d.ranked.length > 0)
    .sort((a, b) => b.interest - a.interest);
  return { departments, languages, frameworks, combination: bestCombination(frameworks, languages, opt.alpha) };
}

/** 部門への関心度。interestTags のうち、選好ベクトルの値が最も大きいもの。言語は常に Infinity */
export function departmentInterest(department: Department, pref: Preference): number {
  if (department.interestTags === null) return Infinity;
  return Math.max(...department.interestTags.map((tag) => pref[tag] ?? 0));
}

function likedCards(answers: Answer[], cards: FeatureCard[]): FeatureCard[] {
  const byId = new Map(cards.map((c) => [c.id, c]));
  return answers
    .filter((a) => a.liked)
    .map((a) => byId.get(a.cardId))
    .filter((c): c is FeatureCard => c !== undefined);
}

function entries(w: TagWeights): [Tag, number][] {
  return Object.entries(w) as [Tag, number][];
}

function dot(a: TagWeights, b: TagWeights): number {
  let sum = 0;
  for (const [tag, wa] of entries(a)) sum += wa * (b[tag] ?? 0);
  return sum;
}

function norm(w: TagWeights): number {
  return Math.sqrt(entries(w).reduce((s, [, v]) => s + v * v, 0));
}
