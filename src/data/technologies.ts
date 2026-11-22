// 技術とタグの重み。元の表と判定のメモは docs/technology-weights.md。
//
// TODO: 重みが 0 でないタグごとの根拠 URL（evidence）は、公式の資料で確かめてから入れる。
//       technology-weights.md で ⚠ を付けた値も、そのときに見直す。
import type { DepartmentId } from "./departments";
import type { Tag, TagWeights } from "./tags";

/** 技術の情報（概要、タグの重み）を最後に見直した日。結果画面と「tecupid について」に表示する */
export const DATA_UPDATED = "2026-11-22";

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
    tagWeights: { "web-frontend": 0.5, "web-backend": 1, mobile: 0.5, "data-ai": 0.5, "cross-platform": 1, game: 0.5, "static-typing": 1, "null-safety": 0.5, gc: 1, concurrency: 0.5, functional: 1, oop: 1, "simple-syntax": -1, "fast-feedback": 1, maturity: 1 },
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
  {
    department: "framework", category: "backend", id: "gin", name: "Gin", languages: ["go"],
    summary: "Go の軽量な Web フレームワーク。シンプルな書き方で、速い API サーバーを作れる。",
    tagWeights: { "web-backend": 1, "batteries-included": -1 },
    resources: docs("https://gin-gonic.com/ja/docs/"),
  },
  {
    department: "framework", category: "mobile", id: "swiftui", name: "SwiftUI", languages: ["swift"],
    summary: "Apple の UI フレームワーク。Swift のコードで、iPhone や Mac のアプリの画面を組み立てる。",
    tagWeights: { mobile: 1, "batteries-included": -1, "template-syntax": -1, "fast-feedback": 1 },
    resources: docs("https://developer.apple.com/jp/swiftui/"),
  },
  {
    department: "framework", category: "mobile", id: "jetpack-compose", name: "Jetpack Compose", languages: ["kotlin"],
    summary: "Android の UI フレームワーク。Kotlin のコードで画面を組み立てる、比較的新しい仕組み。",
    tagWeights: { mobile: 1, "batteries-included": -1, "template-syntax": -1, "fast-feedback": 1, maturity: -1 },
    resources: docs("https://developer.android.com/develop/ui/compose/documentation?hl=ja"),
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
    tagWeights: { infra: 1, declarative: 1, distributed: 1 },
    resources: docs("https://developer.hashicorp.com/terraform/tutorials"),
  },
  {
    department: "infra", id: "github-actions", name: "GitHub Actions",
    summary: "push などをきっかけに、テストやデプロイを自動で実行する CI/CD の仕組み。",
    tagWeights: { infra: 1, declarative: -1, "ci-cd": 1 },
    resources: docs("https://docs.github.com/ja/actions"),
  },
];

// maturity はどれも 0。1.0 が 2017 年以降か、1.0 より前に 5 年以上公開されていた（scikit-learn、pandas）ため
// （requirements.md の 6.5 の maturity の基準）。
export const AI_DATA: Tool[] = [
  {
    department: "ai-data", id: "pytorch", name: "PyTorch",
    summary: "ディープラーニングのライブラリ。学習の処理を自分で書きながら、仕組みを理解しやすい。",
    tagWeights: { "data-ai": 1, "deep-learning": 1, "high-level-api": -1 },
    resources: docs("https://docs.pytorch.org/tutorials/beginner/basics/intro.html"),
  },
  {
    department: "ai-data", id: "tensorflow", name: "TensorFlow",
    summary: "ディープラーニングのライブラリ。Keras を使うと、少ないコードでモデルを作って学習できる。",
    tagWeights: { "data-ai": 1, "deep-learning": 1, "high-level-api": 1 },
    resources: docs("https://www.tensorflow.org/tutorials?hl=ja"),
  },
  {
    department: "ai-data", id: "scikit-learn", name: "scikit-learn",
    summary: "決定木や回帰などの、ディープラーニング以外の機械学習を手軽に使えるライブラリ。",
    tagWeights: { "data-ai": 1, "deep-learning": -1, "high-level-api": 1 },
    resources: docs("https://scikit-learn.org/stable/getting_started.html"),
  },
  {
    department: "ai-data", id: "pandas", name: "pandas",
    summary: "表形式のデータを読み込んで、集計や加工をするためのライブラリ。データ分析の土台になる。",
    tagWeights: { "data-ai": 1, dataframe: 1 },
    resources: docs("https://pandas.pydata.org/docs/getting_started/index.html"),
  },
];

// MySQL は、今のタグでは PostgreSQL と重みがまったく同じになり区別できないため、まだ載せていない
// （technology-weights.md の 3.6）。
export const DATABASES: Tool[] = [
  {
    department: "database", id: "postgresql", name: "PostgreSQL",
    summary: "機能が豊富なリレーショナルデータベース。SQL の標準にしっかり沿っていて、Web サービスで広く使われる。",
    tagWeights: { database: 1, relational: 1, embedded: -1, "in-memory": -1, maturity: 1 },
    resources: [
      { title: "公式ドキュメント", url: "https://www.postgresql.org/docs/current/tutorial.html", official: true },
      { title: "日本語訳（日本 PostgreSQL ユーザ会）", url: "https://www.postgresql.jp/document/current/html/tutorial.html", official: false },
    ],
  },
  {
    department: "database", id: "sqlite", name: "SQLite",
    summary: "サーバーを立てずに、ファイル 1 つで使えるリレーショナルデータベース。スマホアプリなどに組み込まれている。",
    tagWeights: { database: 1, relational: 1, embedded: 1, "in-memory": -1, maturity: 1 },
    resources: docs("https://www.sqlite.org/quickstart.html"),
  },
  {
    department: "database", id: "mongodb", name: "MongoDB",
    summary: "JSON のような形のデータ（ドキュメント）を、そのまま保存できるデータベース。",
    tagWeights: { database: 1, relational: -1, embedded: -1, "in-memory": -1, maturity: 1 },
    resources: docs("https://www.mongodb.com/ja-jp/docs/manual/"),
  },
  {
    department: "database", id: "redis", name: "Redis",
    summary: "データをメモリに置いて、とても速く読み書きできるデータベース。キャッシュやランキングなどに使われる。",
    tagWeights: { database: 1, relational: -1, embedded: -1, "in-memory": 1, maturity: 1 },
    resources: docs("https://redis.io/docs/latest/develop/get-started/"),
  },
];

export const GAME_ENGINES: Tool[] = [
  {
    department: "game", id: "unity", name: "Unity",
    summary: "C# でスクリプトを書く、2D と 3D の両方に使えるゲームエンジン。スマホゲームでも広く使われる。",
    tagWeights: { game: 1, "open-source": -1, "visual-scripting": 0.5, maturity: 1 },
    resources: [{ title: "公式の学習サイト", url: "https://learn.unity.com/", official: true }],
  },
  {
    department: "game", id: "unreal-engine", name: "Unreal Engine",
    summary: "高品質な 3D のゲームに強いゲームエンジン。ノードをつなぐ Blueprint で、コードを書かずに動きを作れる。",
    tagWeights: { game: 1, "visual-scripting": 1, maturity: 1 },
    resources: docs("https://dev.epicgames.com/documentation/ja-jp/unreal-engine"),
  },
  {
    department: "game", id: "godot", name: "Godot",
    summary: "オープンソースで無料のゲームエンジン。軽くて 2D のゲームを作りやすく、専用の言語 GDScript で書く。",
    tagWeights: { game: 1, "open-source": 1, "visual-scripting": -1 },
    resources: docs("https://docs.godotengine.org/ja/4.x/"),
  },
];

// 知識の分野（アルゴリズム、数学、セキュリティ）のトピック。
// 内容のタグ（何についての知識か）と、関係する分野のタグ（どの分野で使われるか）で表す。
// 学習リソースは公式のドキュメントがないため、公的機関や大学、よく知られた練習サイトのものを載せる。
const link = (title: string, url: string): Resource => ({ title, url, official: false });

export const ALGORITHMS: Tool[] = [
  {
    department: "algorithm", id: "data-structures", name: "データ構造",
    summary: "データを効率よくしまって取り出すための形（配列、リスト、木、ハッシュなど）。データベースの索引にも使われる。",
    tagWeights: { algorithm: 1, "data-structures": 1, database: 0.5 },
    resources: [link("Open Data Structures（日本語訳）", "https://sites.google.com/view/open-data-structures-ja/home")],
  },
  {
    department: "algorithm", id: "sort-search", name: "ソートと探索",
    summary: "データを並べ替えたり、目的のデータを探したりする基本の手順。計算量の考え方を学ぶ入り口になる。",
    tagWeights: { algorithm: 1, "sort-search": 1 },
    resources: [link("AtCoder「アルゴリズムと数学 演習問題集」", "https://atcoder.jp/contests/math-and-algorithm")],
  },
  {
    department: "algorithm", id: "dynamic-programming", name: "動的計画法",
    summary: "大きな問題を小さな問題に分け、途中の答えを使い回して効率よく解く考え方。",
    tagWeights: { algorithm: 1, "dynamic-programming": 1 },
    resources: [link("AtCoder「Educational DP Contest」", "https://atcoder.jp/contests/dp")],
  },
  {
    department: "algorithm", id: "graph-algorithms", name: "グラフアルゴリズム",
    summary: "点と線のつながり（グラフ）を扱うアルゴリズム。地図の最短経路や、ネットワークの経路、ゲームの道探しに使われる。",
    tagWeights: { algorithm: 1, "graph-algorithms": 1, game: 0.5, infra: 0.5 },
    resources: [link("AtCoder「典型アルゴリズム問題集」", "https://atcoder.jp/contests/typical-algorithm")],
  },
];

export const MATH_TOPICS: Tool[] = [
  {
    department: "math", id: "linear-algebra", name: "線形代数",
    summary: "ベクトルと行列の数学。3D の表示や画像の処理、機械学習の計算の土台になる。",
    tagWeights: { math: 1, "linear-algebra": 1, "data-ai": 1, game: 1 },
    resources: [link("MIT OpenCourseWare「18.06 Linear Algebra」（英語）", "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/")],
  },
  {
    department: "math", id: "probability-statistics", name: "確率・統計",
    summary: "ばらつきのあるデータから、傾向を読み取ったり予測したりする数学。データ分析や機械学習に欠かせない。",
    tagWeights: { math: 1, probability: 1, "data-ai": 1 },
    resources: [
      link("総務省統計局「なるほど統計学園」", "https://www.stat.go.jp/naruhodo/"),
      link("MIT OpenCourseWare「18.05 Probability and Statistics」（英語）", "https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/"),
    ],
  },
  {
    department: "math", id: "discrete-math", name: "離散数学",
    summary: "論理、集合、グラフ、整数などを扱う数学。アルゴリズムや暗号を理解する土台になる。",
    tagWeights: { math: 1, "discrete-math": 1, algorithm: 1 },
    resources: [link("MIT OpenCourseWare「6.042J Mathematics for Computer Science」（英語）", "https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/")],
  },
  {
    department: "math", id: "calculus", name: "微分積分",
    summary: "変化の割合や、積み重ねを扱う数学。機械学習の最適化や、ゲームの物理の計算に使われる。",
    tagWeights: { math: 1, calculus: 1, "data-ai": 0.5, game: 0.5 },
    resources: [link("MIT OpenCourseWare「18.01SC Single Variable Calculus」（英語）", "https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/")],
  },
];

export const SECURITY_TOPICS: Tool[] = [
  {
    department: "security", id: "web-security", name: "Web セキュリティ",
    summary: "Web サイトへのよくある攻撃（なりすまし、SQL インジェクションなど）と、その防ぎ方。",
    tagWeights: { security: 1, "web-security": 1, "web-backend": 1, "web-frontend": 0.5 },
    resources: [
      link("IPA「安全なウェブサイトの作り方」", "https://www.ipa.go.jp/security/vuln/websecurity/about.html"),
      link("OWASP Top 10（英語）", "https://owasp.org/Top10/"),
    ],
  },
  {
    department: "security", id: "network-security", name: "ネットワークセキュリティ",
    summary: "通信ののぞき見や改ざん、不正な侵入から、ネットワークを守る技術。",
    tagWeights: { security: 1, "network-security": 1, infra: 1 },
    resources: [link("総務省「国民のためのサイバーセキュリティサイト」", "https://www.soumu.go.jp/main_sosiki/cybersecurity/kokumin/")],
  },
  {
    department: "security", id: "cryptography", name: "暗号",
    summary: "データを数学で守る技術。パスワードの保存や、HTTPS の通信の安全を支えている。",
    tagWeights: { security: 1, cryptography: 1, math: 0.5 },
    resources: [link("CRYPTREC（暗号技術評価プロジェクト）", "https://www.cryptrec.go.jp/")],
  },
  {
    department: "security", id: "ctf", name: "CTF",
    summary: "練習用に用意された問題で、攻撃と防御の技術を競う大会。許可された環境で、安全に実践を学べる。",
    tagWeights: { security: 1, ctf: 1, systems: 0.5 },
    resources: [link("picoCTF（英語。練習用の CTF）", "https://picoctf.org/")],
  },
];

export const TECHNOLOGIES: Technology[] = [
  ...LANGUAGES,
  ...FRAMEWORKS,
  ...INFRA,
  ...AI_DATA,
  ...DATABASES,
  ...GAME_ENGINES,
  ...ALGORITHMS,
  ...MATH_TOPICS,
  ...SECURITY_TOPICS,
];
