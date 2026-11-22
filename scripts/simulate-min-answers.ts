// 「結果を見る」を押せるまでの最低枚数（MIN_ANSWERS）を決めるためのシミュレーション。
//
// 使い方: npx tsx scripts/simulate-min-answers.ts
//
// 好みの異なる架空のユーザーを作り、山札のカードに答えさせる。
// 途中の k 枚までの回答で出した 1 位が、最初の山札をすべて答えたときの 1 位と一致する割合を、k ごとに数える。
import { CARDS } from "../src/data/cards";
import { TAGS } from "../src/data/tags";
import { TECHNOLOGIES } from "../src/data/technologies";
import { buildDeck } from "../src/lib/deck";
import { recommend, type Answer } from "../src/lib/scoring";

const USERS = 2000;

/** 再現できるように、種から決まる乱数を使う */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const random = seeded(42);
const gaussian = () => {
  const u = Math.max(random(), 1e-9);
  const v = random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

type Agreement = { language: number; framework: number };
const results = new Map<number, Agreement>();

for (let u = 0; u < USERS; u++) {
  // 架空のユーザーの本当の好み（タグごとの重み）
  const hidden = Object.fromEntries(TAGS.map((t) => [t, gaussian()])) as Record<string, number>;
  const deck = buildDeck(CARDS, undefined, random);
  const answers: Answer[] = deck.map((card) => {
    const affinity = Object.entries(card.tags).reduce((sum, [tag, w]) => sum + w * hidden[tag], 0);
    // 気まぐれも少し入れる
    return { cardId: card.id, liked: affinity + gaussian() * 0.5 > 0 };
  });

  const full = recommend(answers, CARDS, TECHNOLOGIES);
  for (let k = 4; k <= deck.length; k++) {
    const partial = recommend(answers.slice(0, k), CARDS, TECHNOLOGIES);
    const a = results.get(k) ?? { language: 0, framework: 0 };
    if (partial.languages[0].tech.id === full.languages[0].tech.id) a.language++;
    if (partial.frameworks[0].tech.id === full.frameworks[0].tech.id) a.framework++;
    results.set(k, a);
  }
}

console.log(`架空のユーザー ${USERS} 人。k 枚目までの 1 位が、最初の山札をすべて答えたときの 1 位と一致した割合`);
console.log("k\t言語\tフレームワーク");
for (const [k, a] of [...results.entries()].sort((x, y) => x[0] - y[0])) {
  console.log(`${k}\t${((a.language / USERS) * 100).toFixed(0)}%\t${((a.framework / USERS) * 100).toFixed(0)}%`);
}
