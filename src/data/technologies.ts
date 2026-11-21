// 技術とタグの重み。元の表と判定のメモは docs/technology-weights.md。
//
// TODO: 重みが 0 でないタグごとの根拠 URL（evidence）は、公式の資料で確かめてから入れる。
//       technology-weights.md で ⚠ を付けた値も、そのときに見直す。
import type { DepartmentId } from "./departments";
import type { Tag, TagWeights } from "./tags";

export type Resource = { title: string; url: string; official: boolean };

type TechnologyBase = {
  id: string;
  name: string;
  summary: string;
  tagWeights: TagWeights;
  evidence?: Partial<Record<Tag, string>>;
  resources: Resource[];
};

export type Language = TechnologyBase & { department: "language" };

export type Framework = TechnologyBase & {
  department: "framework";
  category: "frontend" | "backend" | "mobile";
  /** 使う言語の id */
  languages: string[];
};

/** 言語とフレームワーク以外の部門の技術 */
export type Tool = TechnologyBase & { department: Exclude<DepartmentId, "language" | "framework"> };

export type Technology = Language | Framework | Tool;

const docs = (url: string): Resource[] => [{ title: "公式ドキュメント", url, official: true }];

export const LANGUAGES: Language[] = [
  {
    department: "language", id:"javascript", name: "JavaScript",
    summary: "ブラウザで動く唯一の標準言語。サーバー側でも使える。",
    tagWeights: { "web-frontend": 1, "web-backend": 1, "static-typing": -1, "native-compile": -1, gc: 1, concurrency: 0.5, "fast-feedback": 1, maturity: 1 },
    resources: docs("https://developer.mozilla.org/ja/docs/Web/JavaScript"),
  },
  {
    department: "language", id:"typescript", name: "TypeScript",
    summary: "JavaScript に静的な型を加えた言語。大きな Web アプリの開発で広く使われる。",
    tagWeights: { "web-frontend": 1, "web-backend": 1, "static-typing": 1, "null-safety": 0.5, "native-compile": -1, gc: 1, concurrency: 0.5, functional: 0.5, "simple-syntax": -1, "fast-feedback": 0.5 },
    resources: docs("https://www.typescriptlang.org/docs/"),
  },
  {
    department: "language", id:"python", name: "Python",
    summary: "読みやすい文法の汎用言語。データ分析と機械学習の定番。",
    tagWeights: { "web-backend": 1, "data-ai": 1, "static-typing": -0.5, "native-compile": -1, gc: 1, concurrency: 0.5, functional: 0.5, oop: 1, "simple-syntax": 1, "fast-feedback": 1, maturity: 1 },
    resources: docs("https://docs.python.org/ja/3/"),
  },
  {
    department: "language", id:"java", name: "Java",
    summary: "JVM の上で動く、クラスベースの静的型付け言語。業務システムで長く使われている。",
    tagWeights: { "web-backend": 1, mobile: 0.5, "static-typing": 1, gc: 1, concurrency: 0.5, functional: 1, oop: 1, "fast-feedback": 1, maturity: 1 },
    resources: docs("https://dev.java/learn/"),
  },
  {
    department: "language", id:"csharp", name: "C#",
    summary: ".NET の上で動く静的型付け言語。Web、デスクトップ、モバイルまで幅広く書ける。",
    tagWeights: { "web-frontend": 0.5, "web-backend": 1, mobile: 0.5, "data-ai": 0.5, "cross-platform": 1, "static-typing": 1, "null-safety": 0.5, gc: 1, concurrency: 0.5, functional: 1, oop: 1, "simple-syntax": -1, "fast-feedback": 1, maturity: 1 },
    resources: docs("https://learn.microsoft.com/ja-jp/dotnet/csharp/"),
  },
  {
    department: "language", id:"go", name: "Go",
    summary: "小さな言語仕様と goroutine による並行処理が特徴。サーバーや CLI ツールでよく使われる。",
    tagWeights: { "web-backend": 1, infra: 1, "static-typing": 1, "native-compile": 1, gc: 1, concurrency: 1, oop: -1, "simple-syntax": 1 },
    resources: docs("https://go.dev/doc/"),
  },
  {
    department: "language", id:"rust", name: "Rust",
    summary: "GC を使わずにメモリ安全性をコンパイル時に保証する言語。低レイヤから Web まで使える。",
    tagWeights: { "web-frontend": 0.5, "web-backend": 0.5, systems: 1, "static-typing": 1, "null-safety": 1, "native-compile": 1, gc: -1, concurrency: 1, functional: 1, oop: -1 },
    resources: docs("https://doc.rust-lang.org/book/"),
  },
  {
    department: "language", id:"kotlin", name: "Kotlin",
    summary: "Android の公式言語。null 安全と簡潔な文法が特徴で、サーバーやマルチプラットフォーム開発にも使える。",
    tagWeights: { "web-frontend": 0.5, "web-backend": 1, mobile: 1, "data-ai": 0.5, "cross-platform": 1, "static-typing": 1, "null-safety": 1, gc: 1, concurrency: 0.5, functional: 1, oop: 1, "simple-syntax": -1, "fast-feedback": 1 },
    resources: docs("https://kotlinlang.org/docs/home.html"),
  },
  {
    department: "language", id:"swift", name: "Swift",
    summary: "iPhone や Mac のアプリ開発の標準言語。安全性と速さを両立する。",
    tagWeights: { "web-backend": 0.5, mobile: 1, systems: 0.5, "static-typing": 1, "null-safety": 1, "native-compile": 1, gc: 0.5, concurrency: 1, functional: 1, "simple-syntax": -1, "fast-feedback": 1 },
    resources: docs("https://www.swift.org/documentation/"),
  },
  {
    department: "language", id:"php", name: "PHP",
    summary: "Web サーバー側の処理のために作られた言語。多くの Web サイトや CMS で使われている。",
    tagWeights: { "web-backend": 1, "static-typing": -0.5, "native-compile": -1, gc: 1, functional: 0.5, "simple-syntax": -1, "fast-feedback": 1, maturity: 1 },
    resources: docs("https://www.php.net/manual/ja/"),
  },
  {
    department: "language", id:"ruby", name: "Ruby",
    summary: "書いていて楽しいことを重視した、日本生まれのオブジェクト指向言語。",
    tagWeights: { "web-backend": 1, "static-typing": -0.5, "native-compile": -1, gc: 1, functional: 1, oop: 1, "fast-feedback": 1, maturity: 1 },
    resources: docs("https://docs.ruby-lang.org/ja/"),
  },
  {
    department: "language", id:"cpp", name: "C++",
    summary: "メモリを細かく制御できる、高速なプログラムのための言語。ゲームエンジンや組み込みの定番。",
    tagWeights: { systems: 1, "static-typing": 1, "native-compile": 1, gc: -1, concurrency: 0.5, "simple-syntax": -1, maturity: 1 },
    resources: docs("https://isocpp.org/get-started"),
  },
  {
    department: "language", id:"dart", name: "Dart",
    summary: "Flutter で使われる言語。1 つのコードからモバイル、デスクトップ、Web 向けのアプリを作れる。",
    tagWeights: { "web-frontend": 0.5, "web-backend": 0.5, mobile: 1, "cross-platform": 1, "static-typing": 1, "null-safety": 1, "native-compile": 1, gc: 1, concurrency: 0.5, functional: 1, oop: 1, "fast-feedback": 0.5 },
    resources: docs("https://dart.dev/language"),
  },
];

export const FRAMEWORKS: Framework[] = [
  {
    department: "framework", category:"frontend", id: "react", name: "React", languages: ["javascript", "typescript"],
    summary: "部品（コンポーネント）を組み合わせて画面を作るライブラリ。JSX で画面を書く。",
    tagWeights: { "web-frontend": 1, "batteries-included": -1, "template-syntax": -1, "compile-time-ui": -1, "fast-feedback": 1 },
    resources: docs("https://ja.react.dev/learn"),
  },
  {
    department: "framework", category:"frontend", id: "vue", name: "Vue.js", languages: ["javascript", "typescript"],
    summary: "HTML に近いテンプレートで画面を書けるフレームワーク。小さく始めやすい。",
    tagWeights: { "web-frontend": 1, "batteries-included": -1, "template-syntax": 1, "compile-time-ui": -1, "fast-feedback": 1 },
    resources: docs("https://ja.vuejs.org/guide/introduction"),
  },
  {
    department: "framework", category:"frontend", id: "svelte", name: "Svelte", languages: ["javascript", "typescript"],
    summary: "ビルド時に画面のコードをコンパイルして、ブラウザに送るコードを小さくするフレームワーク。",
    tagWeights: { "web-frontend": 1, "batteries-included": -1, "template-syntax": 1, "compile-time-ui": 1, "fast-feedback": 1 },
    resources: docs("https://svelte.dev/docs"),
  },
  {
    department: "framework", category:"frontend", id: "angular", name: "Angular", languages: ["typescript"],
    summary: "ルーターやテストの仕組みまで揃った、TypeScript 前提のフレームワーク。",
    tagWeights: { "web-frontend": 1, "template-syntax": 1, "compile-time-ui": 1, "fast-feedback": 1 },
    resources: docs("https://angular.dev/overview"),
  },
  {
    department: "framework", category:"frontend", id: "nextjs", name: "Next.js", languages: ["javascript", "typescript"],
    summary: "React をもとに、サーバー側の処理まで 1 つのプロジェクトで書けるフレームワーク。",
    tagWeights: { "web-frontend": 1, "web-backend": 0.5, "full-stack": 1, "template-syntax": -1, "compile-time-ui": -1, "fast-feedback": 1 },
    resources: docs("https://nextjs.org/docs"),
  },
  {
    department: "framework", category:"backend", id: "express", name: "Express", languages: ["javascript", "typescript"],
    summary: "Node.js の最小限の Web フレームワーク。必要な機能を自分で組み合わせる。",
    tagWeights: { "web-backend": 1, "batteries-included": -1, maturity: 1 },
    resources: docs("https://expressjs.com/"),
  },
  {
    department: "framework", category:"backend", id: "django", name: "Django", languages: ["python"],
    summary: "管理画面や認証まで揃った、Python の全部入りの Web フレームワーク。",
    tagWeights: { "web-backend": 1, "full-stack": 1, "batteries-included": 1, "fast-feedback": 1, maturity: 1 },
    resources: docs("https://docs.djangoproject.com/ja/"),
  },
  {
    department: "framework", category:"backend", id: "fastapi", name: "FastAPI", languages: ["python"],
    summary: "Python の型ヒントを活かして、API を素早く作れるフレームワーク。",
    tagWeights: { "web-backend": 1, "fast-feedback": 1 },
    resources: docs("https://fastapi.tiangolo.com/ja/"),
  },
  {
    department: "framework", category:"backend", id: "rails", name: "Ruby on Rails", languages: ["ruby"],
    summary: "「設定より規約」で知られる、Ruby の全部入りの Web フレームワーク。",
    tagWeights: { "web-frontend": 0.5, "web-backend": 1, "full-stack": 1, "batteries-included": 1, "fast-feedback": 1, maturity: 1 },
    resources: docs("https://guides.rubyonrails.org/"),
  },
  {
    department: "framework", category:"backend", id: "spring-boot", name: "Spring Boot", languages: ["java", "kotlin"],
    summary: "Java と Kotlin で Web アプリや API を作るフレームワーク。企業のシステムで広く使われる。",
    tagWeights: { "web-backend": 1, "batteries-included": 1, "fast-feedback": 0.5 },
    resources: docs("https://docs.spring.io/spring-boot/"),
  },
  {
    department: "framework", category:"backend", id: "laravel", name: "Laravel", languages: ["php"],
    summary: "認証や DB アクセスまで揃った、PHP の全部入りの Web フレームワーク。",
    tagWeights: { "web-frontend": 0.5, "web-backend": 1, "full-stack": 1, "batteries-included": 1, "fast-feedback": 1, maturity: 1 },
    resources: docs("https://laravel.com/docs"),
  },
  {
    department: "framework", category:"mobile", id: "flutter", name: "Flutter", languages: ["dart"],
    summary: "1 つのコードから iOS、Android、Web、デスクトップ向けのアプリを作れる UI フレームワーク。",
    tagWeights: { "web-frontend": 0.5, mobile: 1, "cross-platform": 1, "template-syntax": -1, "fast-feedback": 1 },
    resources: docs("https://docs.flutter.dev/"),
  },
  {
    department: "framework", category:"mobile", id: "react-native", name: "React Native", languages: ["javascript", "typescript"],
    summary: "React の書き方で iOS と Android のアプリを作れるフレームワーク。",
    tagWeights: { mobile: 1, "cross-platform": 1, "batteries-included": -1, "template-syntax": -1, "fast-feedback": 1 },
    resources: docs("https://reactnative.dev/docs/getting-started"),
  },
];

export const INFRA: Tool[] = [
  {
    department: "infra", id: "linux", name: "Linux",
    summary: "多くのサーバーで動いている OS。コマンドでサーバーを操作する基本が身につく。",
    tagWeights: { infra: 1, declarative: -1, distributed: -1, maturity: 1 },
    resources: docs("https://docs.kernel.org/admin-guide/"),
  },
  {
    department: "infra", id: "docker", name: "Docker",
    summary: "アプリと実行環境を「コンテナ」にまとめて、どこでも同じように動かすツール。",
    tagWeights: { infra: 1, distributed: -1, containers: 1 },
    resources: docs("https://docs.docker.com/get-started/"),
  },
  {
    department: "infra", id: "kubernetes", name: "Kubernetes",
    summary: "たくさんのコンテナを、複数台のマシンにまたがって自動で管理する仕組み。",
    tagWeights: { infra: 1, declarative: 1, distributed: 1, containers: 1 },
    resources: docs("https://kubernetes.io/ja/docs/tutorials/kubernetes-basics/"),
  },
  {
    department: "infra", id: "terraform", name: "Terraform",
    summary: "クラウドのサーバーやネットワークを、コードで宣言して作るツール。",
    tagWeights: { infra: 1, declarative: 1, distributed: 1, maturity: -1 },
    resources: docs("https://developer.hashicorp.com/terraform/tutorials"),
  },
  {
    department: "infra", id: "github-actions", name: "GitHub Actions",
    summary: "push などをきっかけに、テストやデプロイを自動で実行する CI/CD の仕組み。",
    tagWeights: { infra: 1, declarative: -1, "ci-cd": 1 },
    resources: docs("https://docs.github.com/ja/actions"),
  },
];

export const TECHNOLOGIES: Technology[] = [...LANGUAGES, ...FRAMEWORKS, ...INFRA];
