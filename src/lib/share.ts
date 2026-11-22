// 結果のシェア（requirements.md の F-4）。
// URL には推薦された技術の ID だけを入れ、回答の中身は入れない。
import type { Technology } from "../data/technologies";

/** シェア用 URL のクエリの名前 */
export const SHARE_PARAM = "match";

/** 1 つの URL に入れる技術の最大数 */
export const MAX_SHARED = 3;

/** シェア用の URL を作る。例: https://example.com/?match=typescript,react */
export function buildShareUrl(origin: string, techIds: string[]): string {
  const url = new URL("/", origin);
  url.searchParams.set(SHARE_PARAM, techIds.slice(0, MAX_SHARED).join(","));
  return url.href;
}

/**
 * URL のクエリから、シェアされた技術を読み取る。
 * 不正な値（知らない ID、多すぎる、空）は、何も表示しないよう null を返す。
 */
export function parseSharedMatch(search: string, technologies: Technology[]): Technology[] | null {
  const raw = new URLSearchParams(search).get(SHARE_PARAM);
  if (!raw) return null;
  const ids = raw.split(",").filter((id) => id.length > 0);
  if (ids.length === 0 || ids.length > MAX_SHARED) return null;
  const byId = new Map(technologies.map((t) => [t.id, t]));
  const found = ids.map((id) => byId.get(id));
  if (found.some((t) => t === undefined)) return null;
  return found as Technology[];
}

/** シェアする文章 */
export function shareText(techNames: string[]): string {
  return `tecupid で私にぴったりの技術は ${techNames.join(" ＋ ")} でした`;
}
