// 結果のシェア（requirements.md の F-4）。
// シェア用の URL には推薦された技術の ID だけを入れ、回答の中身は入れない。
// SNS のサムネイル（OGP 画像）を出すため、シェアされうる結果ごとに静的なページ（/m/...）を作る。
import type { Technology } from "../data/technologies";

/** 古い形式のシェア用 URL のクエリの名前（?match=typescript,react） */
export const SHARE_PARAM = "match";

/** 1 つの URL に入れる技術の最大数 */
export const MAX_SHARED = 3;

/** OGP 画像の大きさ */
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/**
 * シェアされうる結果の一覧。
 * - おすすめの組み合わせ: フレームワークと、その言語の組（[言語, フレームワーク]）
 * - 組み合わせがないとき: 言語 1 つ（[言語]）
 */
export function shareTargets(technologies: Technology[]): string[][] {
  const languageIds = new Set(technologies.filter((t) => t.department === "language").map((t) => t.id));
  const pairs = technologies.flatMap((t) =>
    t.department === "framework" ? t.languages.filter((id) => languageIds.has(id)).map((lang) => [lang, t.id]) : [],
  );
  return [...pairs, ...[...languageIds].map((id) => [id])];
}

/** シェア用のページのパス。例: /m/typescript/react/ */
export function sharePath(techIds: string[]): string {
  return `/m/${techIds.slice(0, MAX_SHARED).join("/")}/`;
}

/** シェア用の URL。例: https://example.com/m/typescript/react/ */
export function buildShareUrl(origin: string, techIds: string[]): string {
  return new URL(sharePath(techIds), origin).href;
}

/** OGP 画像のパス。例: /og/typescript--react.png。ID には "--" が含まれないので区切りに使う */
export function ogImagePath(techIds?: string[]): string {
  return techIds ? `/og/${techIds.join("--")}.png` : "/og/default.png";
}

/** ID の並びを技術に変換する。不正な値（知らない ID、多すぎる、空）なら null */
export function parseSharedIds(ids: string[], technologies: Technology[]): Technology[] | null {
  const clean = ids.filter((id) => id.length > 0);
  if (clean.length === 0 || clean.length > MAX_SHARED) return null;
  const byId = new Map(technologies.map((t) => [t.id, t]));
  const found = clean.map((id) => byId.get(id));
  if (found.some((t) => t === undefined)) return null;
  return found as Technology[];
}

/** 古い形式の URL のクエリ（?match=typescript,react）から、シェアされた技術を読み取る */
export function parseSharedMatch(search: string, technologies: Technology[]): Technology[] | null {
  const raw = new URLSearchParams(search).get(SHARE_PARAM);
  return raw ? parseSharedIds(raw.split(","), technologies) : null;
}

/** シェアする文章 */
export function shareText(techNames: string[]): string {
  return `tecupid で私にぴったりの技術は ${techNames.join(" ＋ ")} でした`;
}

/** SNS に投稿するときに付けるハッシュタグ */
export const SHARE_HASHTAG = "#tecupid";

/** SNS に投稿する文章。シェアする文章の最後にハッシュタグを付ける */
export function sharePostText(techNames: string[]): string {
  return `${shareText(techNames)}\n\n${SHARE_HASHTAG}`;
}

/** X（旧 Twitter）の投稿画面の URL。SNS の共有ボタンは、ひとまず X だけにしている */
export function xShareUrl(text: string, url: string): string {
  const q = new URLSearchParams({ text, url });
  return `https://x.com/intent/post?${q}`;
}
