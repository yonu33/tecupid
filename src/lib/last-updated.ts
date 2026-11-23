// ページやデータの最終更新日を、git の履歴から求める。
// 日付を手で書くと更新し忘れるため、ビルド時（Node）に自動で決める。ブラウザ側のコードからは使わない。
import { execFileSync } from "node:child_process";
import { statSync } from "node:fs";

/** 技術の情報（概要、タグの重み、リンク）が書かれたファイル */
export const TECH_DATA_FILES = ["src/data/technologies.ts"];

/** 日本時間の日付（YYYY-MM-DD） */
export function jstDate(date: Date): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(date);
}

/**
 * ファイルの最終更新日（日本時間）。複数渡すと、最も新しい日付を返す。
 * - コミットしていない変更があれば、今日
 * - なければ、そのファイルを最後に変えたコミットの日付
 * - git が使えなければ、ファイルの更新日時
 * パスはリポジトリのルート（ビルドを実行する場所）からの相対パス。ファイルがなければエラーにする。
 */
export function lastUpdated(...paths: string[]): string {
  if (paths.length === 0) throw new Error("lastUpdated: ファイルを 1 つ以上指定する");
  return paths.map(fileUpdated).sort().at(-1)!;
}

/** 技術の情報の最終更新日。結果画面と「tecupid について」に「〜時点の情報」として出す */
export function techDataUpdated(): string {
  return lastUpdated(...TECH_DATA_FILES);
}

function fileUpdated(path: string): string {
  const mtime = statSync(path).mtime; // ファイルがなければここで例外
  try {
    if (git("status", "--porcelain", "--", path) !== "") return jstDate(new Date());
    const committed = git("log", "-1", "--format=%cI", "--", path);
    if (committed !== "") return jstDate(new Date(committed));
  } catch {
    // git がない環境では、ファイルの更新日時を使う
  }
  return jstDate(mtime);
}

function git(...args: string[]): string {
  return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
}
