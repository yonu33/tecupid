// 利用規約などの最終更新日。
// 規約の類は、文面を変えたときだけ日付を変える（見た目やコードの整理では変えない）ため、日付を手で書く。
// 書き忘れを防ぐため、legal-dates.test.ts が文面のハッシュを確かめる。文面が変わるとテストが失敗するので、
// - 文面を変えたなら、updated を変更した日にして、textHash をテストが示す値にする
// - 見た目やコードの整理だけなら、textHash だけをテストが示す値にする

export type LegalPage = "terms" | "privacy" | "disclaimer";

export const LEGAL_DATES: Record<LegalPage, { updated: string; textHash: string }> = {
  terms: { updated: "2026-11-22", textHash: "591e3c8489ea1c2d" },
  privacy: { updated: "2026-11-22", textHash: "13ce1fd5c952ecf5" },
  disclaimer: { updated: "2026-11-22", textHash: "cc71f78181bd7821" },
};
