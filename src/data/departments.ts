// 結果画面の部門。docs/requirements.md の 6.6 を参照。
import type { Tag } from "./tags";

export const DEPARTMENT_IDS = ["language", "framework", "infra", "ai-data", "database"] as const;

export type DepartmentId = (typeof DEPARTMENT_IDS)[number];

export type Department = {
  id: DepartmentId;
  name: string;
  /**
   * 関心度を判定する分野のタグ。ユーザーの選好ベクトルで、このタグの値が最も大きいものを関心度とする。
   * null の部門（言語）は常にいちばん上に表示する。
   */
  interestTags: Tag[] | null;
};

export const DEPARTMENTS: Department[] = [
  { id: "language", name: "言語", interestTags: null },
  { id: "framework", name: "フレームワーク", interestTags: ["web-frontend", "web-backend", "mobile", "full-stack"] },
  { id: "infra", name: "インフラ・DevOps", interestTags: ["infra"] },
  { id: "ai-data", name: "AI・データ", interestTags: ["data-ai"] },
  { id: "database", name: "データベース", interestTags: ["database"] },
];
