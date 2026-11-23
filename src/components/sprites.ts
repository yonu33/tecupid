// ドット絵のスプライト。tecupid のために描いたオリジナル。
// 1 文字が 1 ピクセル。"." は透明。色は palette で決める（CSS の色か var(--...)）。

export type Sprite = {
  rows: string[];
  palette: Record<string, string>;
};

const OUTLINE = "var(--px-outline)";

const HEART_COLORS = { k: OUTLINE, r: "#ff4f7b", R: "#d12c5c", h: "#ffb3c7" };

/** すき（11 × 10） */
export const HEART: Sprite = {
  rows: [
    "..kkk.kkk..",
    ".krrrkrrrk.",
    "krhhrrrrrRk",
    "krhrrrrrrRk",
    "krrrrrrrrRk",
    ".krrrrrrRk.",
    "..krrrrRk..",
    "...krrRk...",
    "....kRk....",
    ".....k.....",
  ],
  palette: HEART_COLORS,
};

/** 小さいハート（7 × 6）。マッチ度のメーターと推薦理由に使う */
export const SMALL_HEART: Sprite = {
  rows: [
    ".kk.kk.",
    "khrkrrk",
    "krrrrrk",
    ".krrrk.",
    "..krk..",
    "...k...",
  ],
  palette: HEART_COLORS,
};

/** 小さいハートの空（マッチ度のメーター用） */
export const SMALL_HEART_EMPTY: Sprite = {
  rows: [
    ".kk.kk.",
    "keekeek",
    "keeeeek",
    ".keeek.",
    "..kek..",
    "...k...",
  ],
  palette: { k: OUTLINE, e: "var(--px-empty)" },
};

/** 興味なし（12 × 12） */
export const CROSS: Sprite = {
  rows: [
    "kkk......kkk",
    "kggk....kggk",
    "kgggk..kgggk",
    ".kgggkkgggk.",
    "..kggggggk..",
    "...kggggk...",
    "...kggggk...",
    "..kggggggk..",
    ".kgggkkgggk.",
    "kgggk..kgggk",
    "kggk....kggk",
    "kkk......kkk",
  ],
  palette: { k: OUTLINE, g: "#a8afc8" },
};

/** マスコットのキューピッド（20 × 16） */
export const CUPID: Sprite = {
  rows: [
    ".......kkkkkk.......",
    "......kyyyyyyk......",
    ".....kyyYyyYyyk.....",
    ".....kyyyyyyyyk.....",
    ".....kyssyyssyk.....",
    ".....kssssssssk.....",
    ".....kskssssksk.....",
    ".....kpsssssspk.....",
    "......kssPPssk......",
    "..kk...kkkkkk...kk..",
    "..kwk..kssssk..kwk..",
    "..kwwk.kssssk.kwwk..",
    "..kwwwkkhhhhkkwwwk..",
    "...kwwkkhhhhkkwwk...",
    "....kk.kskksk.kk....",
    "........k..k........",
  ],
  palette: {
    k: OUTLINE,
    y: "#ffd35c",
    Y: "#e8a93a",
    s: "#ffdcc0",
    p: "#ff9bb8",
    P: "#e0457b",
    w: "#ffffff",
    h: "#ffc4da",
  },
};

/** きらきら（7 × 7） */
export const SPARKLE: Sprite = {
  rows: [
    "...y...",
    "...y...",
    "..ywy..",
    "yywwwyy",
    "..ywy..",
    "...y...",
    "...y...",
  ],
  palette: { y: "#ffd35c", w: "#ffffff" },
};

/** ▶（4 × 7）。文字と同じ色で描く */
export const CARET: Sprite = {
  rows: ["k...", "kk..", "kkk.", "kkkk", "kkk.", "kk..", "k..."],
  palette: { k: "currentColor" },
};

export const ALL_SPRITES = { HEART, SMALL_HEART, SMALL_HEART_EMPTY, CROSS, CUPID, SPARKLE, CARET };
