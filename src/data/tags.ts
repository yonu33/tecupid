// タグの定義。判定基準は docs/requirements.md の 6.5 を参照。
import type { DepartmentId } from "./departments";

export const TAGS = [
  // 分野
  "web-frontend",
  "web-backend",
  "mobile",
  "ios",
  "android",
  "systems",
  "data-ai",
  "cross-platform",
  "full-stack",
  "infra",
  "database",
  "game",
  "algorithm",
  "math",
  "security",
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
  // データベースの性質
  "relational",
  "embedded",
  "in-memory",
  // ゲーム開発の性質
  "open-source",
  "visual-scripting",
  // 知識の分野（アルゴリズム、数学、セキュリティ）の内容。各トピックが何についての知識かを表す
  "data-structures",
  "sort-search",
  "dynamic-programming",
  "graph-algorithms",
  "linear-algebra",
  "probability",
  "discrete-math",
  "calculus",
  "web-security",
  "network-security",
  "cryptography",
  "ctf",
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
  "web-frontend": { label: "Web フロントエンド", axis: "domain", appliesTo: [...LF, "security"] },
  "web-backend": { label: "Web バックエンド", axis: "domain", appliesTo: [...LF, "security"] },
  mobile: { label: "モバイル", axis: "domain", appliesTo: LF },
  ios: { label: "iOS", axis: "domain", appliesTo: LF },
  android: { label: "Android", axis: "domain", appliesTo: LF },
  systems: { label: "低レイヤ", axis: "domain", appliesTo: ["language", "security"] },
  "data-ai": { label: "データ・AI", axis: "domain", appliesTo: ["language", "ai-data", "math"] },
  "cross-platform": { label: "クロスプラットフォーム", axis: "domain", appliesTo: LF },
  "full-stack": { label: "フルスタック", axis: "domain", appliesTo: ["framework"] },
  infra: { label: "インフラ・DevOps", axis: "domain", appliesTo: ["language", "infra", "algorithm", "security"] },
  database: { label: "データベース", axis: "domain", appliesTo: ["database", "algorithm"] },
  game: { label: "ゲーム開発", axis: "domain", appliesTo: ["language", "game", "algorithm", "math"] },
  algorithm: { label: "アルゴリズム", axis: "domain", appliesTo: ["algorithm", "math"] },
  math: { label: "数学", axis: "domain", appliesTo: ["math", "security"] },
  security: { label: "セキュリティ", axis: "domain", appliesTo: ["security"] },
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
  relational: { label: "リレーショナル", axis: "department", appliesTo: ["database"] },
  embedded: { label: "組み込み型", axis: "department", appliesTo: ["database"] },
  "in-memory": { label: "インメモリ", axis: "department", appliesTo: ["database"] },
  "open-source": { label: "オープンソース", axis: "department", appliesTo: ["game"] },
  "visual-scripting": { label: "ビジュアルスクリプト", axis: "department", appliesTo: ["game"] },
  "data-structures": { label: "データ構造", axis: "department", appliesTo: ["algorithm"] },
  "sort-search": { label: "ソートと探索", axis: "department", appliesTo: ["algorithm"] },
  "dynamic-programming": { label: "動的計画法", axis: "department", appliesTo: ["algorithm"] },
  "graph-algorithms": { label: "グラフ", axis: "department", appliesTo: ["algorithm"] },
  "linear-algebra": { label: "線形代数", axis: "department", appliesTo: ["math"] },
  probability: { label: "確率・統計", axis: "department", appliesTo: ["math"] },
  "discrete-math": { label: "離散数学", axis: "department", appliesTo: ["math"] },
  calculus: { label: "微分積分", axis: "department", appliesTo: ["math"] },
  "web-security": { label: "Web セキュリティ", axis: "department", appliesTo: ["security"] },
  "network-security": { label: "ネットワークセキュリティ", axis: "department", appliesTo: ["security"] },
  cryptography: { label: "暗号", axis: "department", appliesTo: ["security"] },
  ctf: { label: "CTF", axis: "department", appliesTo: ["security"] },
  "fast-feedback": { label: "すぐ試せる", axis: "ecosystem", appliesTo: LF },
  maturity: { label: "歴史の長さ", axis: "ecosystem", appliesTo: "all" },
};

/**
 * 重みは −1.0〜1.0。
 * +1 = その性質がはっきり当てはまる / −1 = 反対の性質がはっきり当てはまる / 0 = 該当しない（省略する）
 */
export type TagWeights = Partial<Record<Tag, number>>;
