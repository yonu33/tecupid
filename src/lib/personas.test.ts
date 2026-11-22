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

  it("iPhone アプリを安全に作りたい → Swift ＋ SwiftUI", () => {
    const r = recommend(answers(["d03", "d04", "l04", "l05", "l06", "l11"], ["d05", "d06", "l07"]), CARDS, TECHNOLOGIES);
    expect(top(r.languages, 1)).toEqual(["swift"]);
    expect(r.combination?.framework.tech.id).toBe("swiftui");
  });

  // iOS と Android を区別するカードはまだないので、Kotlin らしい言語の性質（GC、クラス設計）で答える
  it("スマホアプリを、GC がありクラスで設計する言語と、新しめの仕組みで作りたい → Kotlin ＋ Jetpack Compose", () => {
    const r = recommend(answers(["d03", "d04", "l16", "l09", "e06"], ["l06"]), CARDS, TECHNOLOGIES);
    expect(r.combination?.language.tech.id).toBe("kotlin");
    expect(r.combination?.framework.tech.id).toBe("jetpack-compose");
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
    expect(r.combination?.framework.tech.id).toBe("gin");
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
    const ids = r.departments.map((d) => d.department.id);
    expect(ids.slice(0, 2)).toEqual(["language", "infra"]);
    expect(ids.indexOf("infra")).toBeLessThan(ids.indexOf("framework"));
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

  const aiTop = (like: string[], nope: string[]) => {
    const r = recommend(answers(like, nope), CARDS, TECHNOLOGIES);
    return r.departments.find((d) => d.department.id === "ai-data")!.ranked[0].tech.id;
  };

  it("AI・データに関心がある → AI・データ部門が関心ありになり、言語は Python", () => {
    const r = recommend(answers(["d12", "a01"], ["d01", "d14"]), CARDS, TECHNOLOGIES);
    expect(r.departments[1].department.id).toBe("ai-data");
    expect(r.departments[1].featured).toBe(true);
    expect(top(r.languages, 1)).toEqual(["python"]);
  });

  it("AI: ニューラルネットワークを、学習の処理から自分で書きたい → PyTorch", () => {
    expect(aiTop(["d12", "a01", "a04"], ["a03"])).toBe("pytorch");
  });

  it("AI: ニューラルネットワークを、少ないコードで → TensorFlow", () => {
    expect(aiTop(["d12", "a01", "a03"], ["a04"])).toBe("tensorflow");
  });

  it("AI: 説明しやすい機械学習を、手軽に → scikit-learn", () => {
    expect(aiTop(["d12", "a02", "a03"], ["a01"])).toBe("scikit-learn");
  });

  it("AI: 表のデータを集計して傾向を見つけたい → pandas", () => {
    expect(aiTop(["d13", "a05", "a06"], ["a01"])).toBe("pandas");
  });

  const dbTop = (like: string[], nope: string[]) => {
    const r = recommend(answers(like, nope), CARDS, TECHNOLOGIES);
    return r.departments.find((d) => d.department.id === "database")!.ranked[0].tech.id;
  };

  it("データベースに関心がある → データベース部門が関心ありになる", () => {
    const r = recommend(answers(["d16", "d17"], ["d01", "d14"]), CARDS, TECHNOLOGIES);
    expect(r.departments[1].department.id).toBe("database");
    expect(r.departments[1].featured).toBe(true);
  });

  it("DB: SQL で、サーバーとして運用し、ディスクに確実に残す → PostgreSQL", () => {
    expect(dbTop(["d16", "b01", "b04", "b06"], ["b02"])).toBe("postgresql");
  });

  it("DB: SQL で、サーバーなしでファイル 1 つ → SQLite", () => {
    expect(dbTop(["d16", "b01", "b03"], ["b04"])).toBe("sqlite");
  });

  it("DB: JSON のようなデータをそのまま、ディスクに残す → MongoDB", () => {
    expect(dbTop(["d16", "b02", "b06"], ["b01"])).toBe("mongodb");
  });

  it("DB: メモリに置いて、とにかく速く → Redis", () => {
    expect(dbTop(["d16", "b05"], ["b06"])).toBe("redis");
  });

  it("iPhone 向けのアプリを作りたい → Swift ＋ SwiftUI", () => {
    const r = recommend(answers(["d03", "d04", "p01"], []), CARDS, TECHNOLOGIES);
    expect(r.combination?.language.tech.id).toBe("swift");
    expect(r.combination?.framework.tech.id).toBe("swiftui");
  });

  it("Android 向けのアプリを作りたい → Kotlin ＋ Jetpack Compose", () => {
    const r = recommend(answers(["d03", "d04", "p02"], []), CARDS, TECHNOLOGIES);
    expect(r.combination?.language.tech.id).toBe("kotlin");
    expect(r.combination?.framework.tech.id).toBe("jetpack-compose");
  });

  it("iPhone と Android の両方に、1 つのコードで → Flutter か React Native", () => {
    const r = recommend(answers(["d03", "d05", "p01", "p02"], []), CARDS, TECHNOLOGIES);
    expect(["flutter", "react-native"]).toContain(r.combination?.framework.tech.id);
  });

  const gameTop = (like: string[], nope: string[]) => {
    const r = recommend(answers(like, nope), CARDS, TECHNOLOGIES);
    return r.departments.find((d) => d.department.id === "game")!.ranked[0].tech.id;
  };

  it("ゲームを作りたい → ゲーム開発部門が関心ありになり、言語は C# が上位", () => {
    const r = recommend(answers(["d18"], []), CARDS, TECHNOLOGIES);
    expect(r.departments[1].department.id).toBe("game");
    expect(top(r.languages, 1)).toEqual(["csharp"]);
  });

  it("ゲーム: オープンソースで、動きはすべてコードで書きたい → Godot", () => {
    expect(gameTop(["d18", "g01", "g03"], ["g02"])).toBe("godot");
  });

  it("ゲーム: ノードをつないで、コードを書かずに作りたい → Unreal Engine", () => {
    expect(gameTop(["d18", "g02"], ["g03"])).toBe("unreal-engine");
  });

  it("ゲーム: 長く使われている定番で、オープンソースにはこだわらない → Unity", () => {
    expect(gameTop(["d18", "g04"], ["g01"])).toBe("unity");
  });

  const deptTop = (dept: string, like: string[], nope: string[] = []) => {
    const r = recommend(answers(like, nope), CARDS, TECHNOLOGIES);
    return r.departments.find((d) => d.department.id === dept)!.ranked[0].tech.id;
  };

  it("知識の分野: 各トピックの内容のカードに「すき」と答えると、そのトピックが 1 位", () => {
    const cases: [string, string, string, string][] = [
      ["algorithm", "d19", "r01", "data-structures"],
      ["algorithm", "d19", "r02", "sort-search"],
      ["algorithm", "d19", "r03", "dynamic-programming"],
      ["algorithm", "d19", "r04", "graph-algorithms"],
      ["math", "d20", "m01", "linear-algebra"],
      ["math", "d20", "m02", "probability-statistics"],
      ["math", "d20", "m03", "discrete-math"],
      ["math", "d20", "m04", "calculus"],
      ["security", "d21", "s01", "web-security"],
      ["security", "d21", "s02", "network-security"],
      ["security", "d21", "s03", "cryptography"],
      ["security", "d21", "s04", "ctf"],
    ];
    for (const [dept, interest, card, expected] of cases) {
      expect(deptTop(dept, [interest, card]), `${dept} / ${card}`).toBe(expected);
    }
  });

  it("知識の分野: ほかの分野への関心ともつながる（AI → 線形代数か確率・統計、Web → Web セキュリティ、インフラ → ネットワークセキュリティ）", () => {
    expect(["linear-algebra", "probability-statistics"]).toContain(deptTop("math", ["d12", "d20"]));
    expect(deptTop("security", ["d02", "d21"])).toBe("web-security");
    expect(deptTop("security", ["d14", "d21"])).toBe("network-security");
  });

  it("セキュリティ部門には、不正アクセス禁止法についての注意書きがある", () => {
    const r = recommend(answers(["d21"], []), CARDS, TECHNOLOGIES);
    expect(r.departments.find((d) => d.department.id === "security")?.department.note).toContain("不正アクセス禁止法");
  });

  it("経験レベル: LV.10 は、レベルを指定しないときと同じ結果", () => {
    const a = answers(["d01", "d02", "l01"], ["d09"]);
    const ids = (r: ReturnType<typeof recommend>) => r.departments.flatMap((d) => d.ranked.map((x) => x.tech.id));
    expect(ids(recommend(a, CARDS, TECHNOLOGIES, { level: 10 }))).toEqual(ids(recommend(a, CARDS, TECHNOLOGIES)));
  });

  it("経験レベル: まったくの初心者（LV.0）で、まだ何も答えていない → Python", () => {
    const r = recommend([], CARDS, TECHNOLOGIES, { level: 0 });
    expect(top(r.languages, 1)).toEqual(["python"]);
  });

  it("経験レベル: 初心者が Web の画面を作りたい → TypeScript より JavaScript が上", () => {
    const r = recommend(answers(["d01"], []), CARDS, TECHNOLOGIES, { level: 0 });
    const ids = r.languages.map((x) => x.tech.id);
    expect(ids.indexOf("javascript")).toBeLessThan(ids.indexOf("typescript"));
  });

  it("クラス設計と型が好きな業務系 → Java ＋ Spring Boot", () => {
    const r = recommend(answers(["d02", "l16", "l01", "l03", "f01", "e04", "e05"], ["l17", "e06", "l02"]), CARDS, TECHNOLOGIES);
    expect(top(r.languages, 1)).toEqual(["java"]);
    expect(r.combination?.framework.tech.id).toBe("spring-boot");
  });
});
