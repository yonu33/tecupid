// SNS で共有したときのサムネイル（OGP 画像、1200 × 630）を public/og/ に作る。
//
// 使い方: npm run og
//   - シェアされうる結果（src/lib/share.ts の shareTargets）ごとに 1 枚と、トップページ用の default.png を作る。
//   - 技術を追加したり名前を変えたりしたら、作り直してコミットする（src/lib/share.test.ts が画像の有無を確かめる）。
//   - 手元の Edge（Windows）か Chrome でスクリーンショットを撮る。OG_BROWSER=chrome などで変えられる。
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright-core";
import { toRuns } from "../src/components/PixelSprite";
import { CUPID, HEART, type Sprite } from "../src/components/sprites";
import { TECHNOLOGIES } from "../src/data/technologies";
import { OG_HEIGHT, OG_WIDTH, ogImagePath, parseSharedIds, shareTargets } from "../src/lib/share";

const root = path.resolve(fileURLToPath(import.meta.url), "../..");
const publicDir = path.join(root, "public");
const fontCss = pathToFileURL(path.join(root, "node_modules/@fontsource/dotgothic16/index.css")).href;
const channel = process.env.OG_BROWSER ?? (process.platform === "win32" ? "msedge" : "chrome");

/** サイトと同じ緑の輪郭で、スプライトを SVG の文字列にする */
function spriteSvg(sprite: Sprite, scale: number): string {
  const width = sprite.rows[0].length;
  const height = sprite.rows.length;
  const rects = toRuns(sprite)
    .map((r) => {
      const fill = r.color.startsWith("var(") ? "#1f6b40" : r.color;
      return `<rect x="${r.x}" y="${r.y}" width="${r.width}" height="1" fill="${fill}"/>`;
    })
    .join("");
  return `<svg width="${width * scale}" height="${height * scale}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">${rects}</svg>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
}

const CSS = `
* { box-sizing: border-box; margin: 0; }
body {
  position: relative; width: ${OG_WIDTH}px; height: ${OG_HEIGHT}px; overflow: hidden;
  background: #0a0f0b conic-gradient(at 4px 4px, transparent 75%, #13241a 0) 0 0 / 24px 24px;
  color: #9cf7b9; font-family: "DotGothic16", monospace;
}
body::after {
  content: ""; position: absolute; inset: 0;
  background: repeating-linear-gradient(to bottom, transparent 0 2px, rgb(0 0 0 / 0.12) 2px 4px);
}
.win {
  position: absolute; left: 56px; top: 48px; width: 1080px; height: 520px; background: #050906;
  box-shadow: 0 -8px 0 0 #3fbf70, 0 8px 0 0 #3fbf70, -8px 0 0 0 #3fbf70, 8px 0 0 0 #3fbf70,
    8px 16px 0 0 #0d3a21, 16px 8px 0 0 #0d3a21;
}
.bar {
  display: flex; align-items: center; gap: 20px; height: 64px; padding: 0 24px;
  background: #13261a; border-bottom: 8px solid #3fbf70; color: #4f9e6b; font-size: 32px;
}
.dots { display: flex; gap: 12px; }
.dots i { display: block; width: 20px; height: 20px; }
.dots i:nth-child(1) { background: #ff6b92; }
.dots i:nth-child(2) { background: #ffd35c; }
.dots i:nth-child(3) { background: #4ef08a; }
.body { position: relative; height: calc(100% - 64px); padding: 32px 48px; }
.muted { color: #4f9e6b; font-size: 32px; line-height: 1.5; }
.names {
  display: flex; flex-wrap: wrap; align-items: center; gap: 8px 28px; max-width: 760px; margin-top: 28px;
  color: #4ef08a; font-size: 80px; line-height: 1.15; text-shadow: 0 0 24px rgb(78 240 138 / 0.45);
}
.desc { max-width: 720px; margin-top: 24px; font-size: 32px; line-height: 1.5; }
.cupid { position: absolute; right: 56px; top: 64px; }
.footer {
  position: absolute; left: 48px; right: 48px; bottom: 28px;
  display: flex; justify-content: space-between; align-items: center; color: #4f9e6b; font-size: 32px;
}
.logo { color: #4ef08a; font-size: 48px; text-shadow: 0 0 16px rgb(78 240 138 / 0.45); }
.cursor { display: inline-block; width: 0.5em; height: 1em; margin-left: 6px; vertical-align: -0.12em; background: currentColor; }
`;

function html(title: string, body: string): string {
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8">
<link rel="stylesheet" href="${fontCss}"><style>${CSS}</style></head><body>
<div class="win">
  <div class="bar"><span class="dots"><i></i><i></i><i></i></span><span>${escapeHtml(title)}</span></div>
  <div class="body">${body}<div class="cupid">${spriteSvg(CUPID, 10)}</div></div>
</div></body></html>`;
}

const FOOTER = `<div class="footer"><span>// エンジニアのための技術マッチングアプリ</span><span class="logo">tecupid<span class="cursor"></span></span></div>`;

function resultPage(names: string[]): string {
  const parts = names.map((n, i) => `${i > 0 ? spriteSvg(HEART, 6) : ""}<span>${escapeHtml(n)}</span>`).join("");
  return html(
    "~/tecupid/match",
    `<p class="muted">$ tecupid match</p><p class="muted"># マッチングしました！</p><div class="names">${parts}</div>${FOOTER}`,
  );
}

function defaultPage(): string {
  return html(
    "~/tecupid",
    `<p class="muted">$ tecupid --help</p><p class="muted"># エンジニアのための技術マッチングアプリ</p>
<div class="names"><span>tecupid<span class="cursor"></span></span></div>
<p class="desc">技術の特徴が書かれたカードに「すき」か「興味なし」で答えて、次に学ぶ技術を見つけよう</p>`,
  );
}

const jobs: { file: string; page: string }[] = [
  { file: ogImagePath(), page: defaultPage() },
  ...shareTargets(TECHNOLOGIES).map((ids) => ({
    file: ogImagePath(ids),
    page: resultPage(parseSharedIds(ids, TECHNOLOGIES)!.map((t) => t.name)),
  })),
];

const work = mkdtempSync(path.join(tmpdir(), "tecupid-og-"));
mkdirSync(path.join(publicDir, "og"), { recursive: true });
const browser = await chromium.launch({ channel, headless: true });
try {
  const page = await browser.newPage({ viewport: { width: OG_WIDTH, height: OG_HEIGHT } });
  for (const [i, job] of jobs.entries()) {
    const htmlFile = path.join(work, `${i}.html`);
    writeFileSync(htmlFile, job.page);
    await page.goto(pathToFileURL(htmlFile).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(publicDir, job.file) });
  }
  console.log(`OGP 画像を ${jobs.length} 枚作りました: public/og/`);
} finally {
  await browser.close();
  rmSync(work, { recursive: true, force: true });
}
