// タグの定義。判定基準は docs/requirements.md の 6.5 を参照。
import type { DepartmentId } from "./departments";

export const TAGS = [
  // 分野
  "web-frontend",
  "web-backend",
  "mobile",
  "systems",
  "data-ai",
  "cross-platform",
  "full-stack",
  "infra",
  // 言語の性質
  "static-typing",
  "null-safety",
  "native-compile",
  "gc",
  "concurrency",
  "functional",
  "oop",
  "simple-syntax",
  // フレームワークの性質
  "batteries-included",
  "template-syntax",
  "compile-time-ui",
  // インフラ・DevOps の性質
  "declarative",
  "distributed",
  "containers",
  "ci-cd",
  // AI・データの性質
  "deep-learning",
  "high-level-api",
  "dataframe",
  // 開発環境とエコシステム
  "fast-feedback",
  "maturity",
] as const;

export type Tag = (typeof TAGS)[number];

/**
 * カードの軸。1 回のセッションで出すカードの配分に使う。
 * department は、部門ごとの専用カード（関心のある人にだけ追加で出す）。
 */
export type Axis = "domain" | "language" | "framework" | "department" | "ecosystem";

export type TagInfo = {
  label: string;
  axis: Axis;
  /** このタグを付けてよい部門。"all" はすべての部門 */
  appliesTo: DepartmentId[] | "all";
};

const LF: DepartmentId[] = ["language", "framework"];

export const TAG_INFO: Record<Tag, TagInfo> = {
  "web-frontend": { label: "Web フロントエンド", axis: "domain", appliesTo: LF },
  "web-backend": { label: "Web バックエンド", axis: "domain", appliesTo: LF },
  mobile: { label: "モバイル", axis: "domain", appliesTo: LF },
  systems: { label: "低レイヤ", axis: "domain", appliesTo: ["language"] },
  "data-ai": { label: "データ・AI", axis: "domain", appliesTo: ["language", "ai-data"] },
  "cross-platform": { label: "クロスプラットフォーム", axis: "domain", appliesTo: LF },
  "full-stack": { label: "フルスタック", axis: "domain", appliesTo: ["framework"] },
  infra: { label: "インフラ・DevOps", axis: "domain", appliesTo: ["language", "infra"] },
  "static-typing": { label: "静的型付け", axis: "language", appliesTo: ["language"] },
  "null-safety": { label: "null 安全", axis: "language", appliesTo: ["language"] },
  "native-compile": { label: "ネイティブコンパイル", axis: "language", appliesTo: ["language"] },
  gc: { label: "自動メモリ管理", axis: "language", appliesTo: ["language"] },
  concurrency: { label: "並行処理", axis: "language", appliesTo: ["language"] },
  functional: { label: "関数型", axis: "language", appliesTo: ["language"] },
  oop: { label: "オブジェクト指向", axis: "language", appliesTo: ["language"] },
  "simple-syntax": { label: "小さな言語仕様", axis: "language", appliesTo: ["language"] },
  "batteries-included": { label: "全部入り", axis: "framework", appliesTo: ["framework"] },
  "template-syntax": { label: "HTML テンプレート", axis: "framework", appliesTo: ["framework"] },
  "compile-time-ui": { label: "ビルド時コンパイル", axis: "framework", appliesTo: ["framework"] },
  declarative: { label: "宣言的な設定", axis: "department", appliesTo: ["infra"] },
  distributed: { label: "複数台の管理", axis: "department", appliesTo: ["infra"] },
  containers: { label: "コンテナ", axis: "department", appliesTo: ["infra"] },
  "ci-cd": { label: "CI/CD", axis: "department", appliesTo: ["infra"] },
  "deep-learning": { label: "ディープラーニング", axis: "department", appliesTo: ["ai-data"] },
  "high-level-api": { label: "高水準 API", axis: "department", appliesTo: ["ai-data"] },
  dataframe: { label: "表データの加工", axis: "department", appliesTo: ["ai-data"] },
  "fast-feedback": { label: "すぐ試せる", axis: "ecosystem", appliesTo: LF },
  maturity: { label: "歴史の長さ", axis: "ecosystem", appliesTo: "all" },
};

/**
 * 重みは −1.0〜1.0。
 * +1 = その性質がはっきり当てはまる / −1 = 反対の性質がはっきり当てはまる / 0 = 該当しない（省略する）
 */
export type TagWeights = Partial<Record<Tag, number>>;
