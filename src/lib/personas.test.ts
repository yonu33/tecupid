// 典型的なユーザー像（ペルソナ）で推薦結果を確かめる回帰テスト。
// データや重みを調整したときに、直感に反する結果になっていないかを検出する。
// 順位が僅差で入れ替わりうるものは、「上位 N 件に入る」の形で確かめる。
import { describe, expect, it } from "vitest";
import { CARDS } from "../data/cards";
import { TECHNOLOGIES } from "../data/technologies";
import { recommend, type Answer } from "./scoring";

function answers(like: string[], nope: string[]): Answer[] {
  return [
    ...like.map((cardId) => ({ cardId, liked: true })),
    ...nope.map((cardId) => ({ cardId, liked: false })),
  ];
}

const top = (list: { tech: { id: string } }[], n: number) => list.slice(0, n).map((r) => r.tech.id);

describe("ペルソナ", () => {
  it("Web 全般が好きで型も好き → TypeScript", () => {
    const r = recommend(answers(["d01", "d02", "d07", "l01", "l03", "l09"], ["d09", "d10"]), CARDS, TECHNOLOGIES);
    expect(top(r.languages, 1)).toEqual(["typescript"]);
  });

  it("画面を HTML テンプレートで書きたい → Svelte、Angular、Vue.js が上位", () => {
    const r = recommend(answers(["d01", "f06", "f07", "f09", "e02", "l02", "l07"], ["d08", "d09", "l10", "f08"]), CARDS, TECHNOLOGIES);
    expect(top(r.languages, 2)).toContain("javascript");
    expect(top(r.frameworks, 3).sort()).toEqual(["angular", "svelte", "vue"]);
  });

  it("画面をコードで組み立てたい（JSX）、型も好き → TypeScript ＋ React", () => {
    const r = recommend(answers(["d01", "f08", "f10", "l01", "l03", "e02"], ["f06", "d09"]), CARDS, TECHNOLOGIES);
    expect(r.combination?.language.tech.id).toBe("typescript");
    expect(r.combination?.framework.tech.id).toBe("react");
  });

  it("1 つのコードで iPhone と Android → Dart ＋ Flutter", () => {
    const r = recommend(answers(["d03", "d04", "d05", "d06", "l01", "l04", "e02"], ["d09", "d02"]), CARDS, TECHNOLOGIES);
    expect(top(r.frameworks, 2).sort()).toEqual(["flutter", "react-native"]);
    expect(r.combination?.language.tech.id).toBe("dart");
  });

  it("iPhone アプリを安全に作りたい → Swift。合うフレームワークがないので組み合わせは出さない", () => {
    const r = recommend(answers(["d03", "d04", "l04", "l05", "l06", "l11"], ["d05", "d06", "l07"]), CARDS, TECHNOLOGIES);
    expect(top(r.languages, 1)).toEqual(["swift"]);
    expect(r.combination).toBeNull();
  });

  it("データ分析と機械学習 → Python", () => {
    const r = recommend(answers(["d12", "d13", "l02", "l07", "e01", "l18"], ["d09", "l10", "l01"]), CARDS, TECHNOLOGIES);
    expect(top(r.languages, 1)).toEqual(["python"]);
  });

  it("低レイヤでメモリを制御したい → C++ と Rust。組み合わせは出さない", () => {
    const r = recommend(answers(["d09", "d10", "l10", "l08", "l06", "l05", "l13"], ["l09", "l07", "d01"]), CARDS, TECHNOLOGIES);
    expect(top(r.languages, 2).sort()).toEqual(["cpp", "rust"]);
    expect(r.combination).toBeNull();
  });

  it("サーバーの並行処理をシンプルに書きたい → Go", () => {
    const r = recommend(answers(["d02", "d11", "l12", "l18", "l19", "l06", "f04"], ["l16", "l20", "d01"]), CARDS, TECHNOLOGIES);
    expect(top(r.languages, 1)).toEqual(["go"]);
  });

  it("1 人で Web サービスを全部入りで作りたい → Rails、Laravel、Django が上位", () => {
    const r = recommend(answers(["d07", "d02", "f01", "f02", "f03", "e04", "e01"], ["f04", "f05", "e06"]), CARDS, TECHNOLOGIES);
    expect(top(r.frameworks, 3).sort()).toEqual(["django", "laravel", "rails"]);
  });

  it("Web に関心があり、インフラに関心がない → インフラ部門は関心ありにならない", () => {
    const r = recommend(answers(["d01", "d02", "l01"], ["d14"]), CARDS, TECHNOLOGIES);
    const ids = r.departments.map((d) => d.department.id);
    expect(ids[0]).toBe("language");
    expect(r.departments.find((d) => d.department.id === "framework")?.featured).toBe(true);
    expect(r.departments.find((d) => d.department.id === "infra")?.featured).toBe(false);
    expect(ids.indexOf("framework")).toBeLessThan(ids.indexOf("infra"));
  });

  it("インフラにだけ関心がある → インフラ部門がフレームワーク部門より上", () => {
    const r = recommend(answers(["d14", "d15"], ["d01", "d03"]), CARDS, TECHNOLOGIES);
    expect(r.departments.map((d) => d.department.id)).toEqual(["language", "infra", "framework"]);
    expect(top(r.languages, 1)).toEqual(["go"]);
  });

  const infraTop = (like: string[], nope: string[]) => {
    const r = recommend(answers(like, nope), CARDS, TECHNOLOGIES);
    return r.departments.find((d) => d.department.id === "infra")!.ranked[0].tech.id;
  };

  it("インフラ: 宣言的に、複数台を、コンテナで → Kubernetes", () => {
    expect(infraTop(["d14", "i01", "i03", "i05"], ["i02", "i04"])).toBe("kubernetes");
  });

  it("インフラ: 宣言的に複数台、コンテナは不要、新しめ → Terraform", () => {
    expect(infraTop(["d14", "i01", "i03", "e06"], ["i05"])).toBe("terraform");
  });

  it("インフラ: 自分の PC 1 台でコンテナ → Docker", () => {
    expect(infraTop(["d14", "i04", "i05"], ["i03"])).toBe("docker");
  });

  it("インフラ: コマンドを打って 1 台を、基礎から → Linux", () => {
    expect(infraTop(["d14", "i02", "i04", "e05"], ["i05"])).toBe("linux");
  });

  it("インフラ: テストやデプロイの自動化 → GitHub Actions", () => {
    expect(infraTop(["d15", "i06"], ["i01"])).toBe("github-actions");
  });

  it("クラス設計と型が好きな業務系 → Java ＋ Spring Boot", () => {
    const r = recommend(answers(["d02", "l16", "l01", "l03", "f01", "e04", "e05"], ["l17", "e06", "l02"]), CARDS, TECHNOLOGIES);
    expect(top(r.languages, 1)).toEqual(["java"]);
    expect(r.combination?.framework.tech.id).toBe("spring-boot");
  });
});
