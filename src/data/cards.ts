// 特徴カード。元の表は docs/feature-cards.md。
import type { DepartmentId } from "./departments";
import type { Axis, TagWeights } from "./tags";

export type FeatureCard = {
  id: string;
  text: string;
  example?: string;
  axis: Axis;
  /** axis が department のとき、どの部門の専用カードか */
  department?: DepartmentId;
  /** 専門用語が多いカード。経験レベルが低い人には出さない（lib/deck.ts の cardsForLevel） */
  advanced?: boolean;
  tags: TagWeights;
};

export const CARDS: FeatureCard[] = [
  // 分野
  { id: "d01", axis: "domain", text: "ブラウザで動く画面を作って、すぐ人に見せたい", example: "ポートフォリオサイトや Web アプリの見た目の部分", tags: { "web-frontend": 1 } },
  { id: "d02", axis: "domain", text: "画面の裏で動く、API やデータ処理の仕組みを作りたい", example: "ログイン、決済、データの保存など", tags: { "web-backend": 1 } },
  { id: "d03", axis: "domain", text: "スマホのホーム画面に置けるアプリを作りたい", tags: { mobile: 1 } },
  { id: "d04", axis: "domain", text: "App Store や Google Play にアプリを公開してみたい", tags: { mobile: 1 } },
  { id: "d05", axis: "domain", text: "1 つのコードで、iPhone と Android の両方に対応したい", tags: { "cross-platform": 1, mobile: 0.5 } },
  { id: "d06", axis: "domain", text: "1 つのコードで、スマホ、PC、Web 向けのアプリをまとめて作りたい", tags: { "cross-platform": 1 } },
  { id: "d07", axis: "domain", text: "画面もサーバーも、1 つのプロジェクトでまとめて作りたい", example: "1 人で Web サービスを丸ごと作るイメージ", tags: { "full-stack": 1, "web-frontend": 0.5, "web-backend": 0.5 } },
  { id: "d08", axis: "domain", text: "見た目のデザインより、裏側の仕組みづくりに興味がある", tags: { "web-backend": 0.5, systems: 0.5, "web-frontend": -0.5 } },
  { id: "d09", axis: "domain", text: "OS やハードウェアに近い、低いレイヤーを触ってみたい", example: "OS、デバイスドライバー、ゲームエンジンなど", tags: { systems: 1 } },
  { id: "d10", axis: "domain", text: "マイコンや IoT 機器を動かすプログラムを書いてみたい", example: "小さな電子工作やセンサーの制御など", tags: { systems: 1 } },
  { id: "d11", axis: "domain", text: "たくさんのアクセスをさばく Web サービスの仕組みを作りたい", tags: { "web-backend": 1, concurrency: 0.5 } },
  { id: "d12", axis: "domain", text: "データを分析したり、機械学習のモデルを動かしたりしたい", tags: { "data-ai": 1 } },
  { id: "d13", axis: "domain", text: "グラフや統計を使って、データから何かを見つけるのが好き", tags: { "data-ai": 1 } },
  { id: "d14", axis: "domain", text: "サーバーやクラウドの基盤を作って、サービスを安定して動かしたい", example: "アクセスが増えても落ちない仕組みや、障害からの復旧など", tags: { infra: 1 } },
  { id: "d15", axis: "domain", text: "開発環境づくりやデプロイの作業を、自動化するのが好き", tags: { infra: 1, "ci-cd": 0.5 } },
  { id: "d16", axis: "domain", text: "たくさんのデータを、速く安全に保存して取り出す仕組みに興味がある", tags: { database: 1 } },
  { id: "d17", axis: "domain", text: "SQL を書いて、データを自由に検索したり集計したりしてみたい", example: "「先月いちばん売れた商品は？」を一瞬で調べるなど", tags: { database: 1, relational: 0.5 } },
  { id: "d18", axis: "domain", text: "自分でゲームを作ってみたい", example: "2D のアクションゲームや、3D の世界を歩き回るゲームなど", tags: { game: 1 } },
  { id: "d19", axis: "domain", text: "パズルのような問題を、速く解ける手順を考えるのが好き", example: "競技プログラミングのような問題", tags: { algorithm: 1 } },
  { id: "d20", axis: "domain", text: "数式を使って、ものごとの仕組みを説明するのが好き", tags: { math: 1 } },
  { id: "d21", axis: "domain", text: "システムを攻撃から守る仕組みや、弱点の見つけ方に興味がある", tags: { security: 1 } },

  // 部門の専用カード: インフラ・DevOps
  { id: "i01", axis: "department", department: "infra", text: "サーバーの設定を、手順ではなく「あるべき状態」としてファイルに書きたい", example: "「Web サーバーを 3 台」と書けば、足りない分を自動で作ってくれる", tags: { declarative: 1 } },
  { id: "i02", axis: "department", department: "infra", text: "コマンドを 1 つずつ打って、サーバーが変わっていく様子を確かめたい", tags: { declarative: -1 } },
  { id: "i03", axis: "department", department: "infra", text: "何十台ものサーバーを、まとめて自動で管理したい", tags: { distributed: 1 } },
  { id: "i04", axis: "department", department: "infra", text: "まずは自分の PC 1 台の中で、環境づくりを極めたい", tags: { distributed: -1 } },
  { id: "i05", axis: "department", department: "infra", text: "アプリを「コンテナ」に詰めて、どこでも同じように動かしたい", example: "「自分の PC では動くのに、サーバーでは動かない」を防ぐ", tags: { containers: 1 } },
  { id: "i06", axis: "department", department: "infra", text: "コードを push したら、テストやデプロイが自動で走る仕組みを作りたい", tags: { "ci-cd": 1 } },

  // 部門の専用カード: AI・データ
  { id: "a01", axis: "department", department: "ai-data", text: "画像や文章を理解するニューラルネットワークを、自分で作ってみたい", example: "画像の分類や、文章の生成など", tags: { "deep-learning": 1 } },
  { id: "a02", axis: "department", department: "ai-data", text: "まずは決定木や回帰など、仕組みを説明しやすい機械学習から始めたい", example: "「なぜその予測になったか」を説明しやすい", tags: { "deep-learning": -1 } },
  { id: "a03", axis: "department", department: "ai-data", text: "数行のコードで、モデルの学習から評価まで済ませたい", tags: { "high-level-api": 1 } },
  { id: "a04", axis: "department", department: "ai-data", text: "学習の 1 ステップずつを自分で書いて、中で何が起きているかを理解したい", tags: { "high-level-api": -1 } },
  { id: "a05", axis: "department", department: "ai-data", text: "Excel のような表のデータを、コードで集計したり加工したりしたい", example: "売上データの月別の集計や、抜けている値の処理など", tags: { dataframe: 1 } },
  { id: "a06", axis: "department", department: "ai-data", text: "モデルを作るより、データを整えて傾向を見つけるほうが楽しそう", tags: { dataframe: 1, "deep-learning": -0.5 } },

  // 部門の専用カード: データベース
  { id: "b01", axis: "department", department: "database", text: "表（テーブル）どうしを結び付けて、SQL でデータを取り出したい", example: "「注文」と「商品」の表をつないで、売上を計算するなど", tags: { relational: 1 } },
  { id: "b02", axis: "department", department: "database", text: "決まった形にとらわれず、JSON のようなデータをそのまま保存したい", tags: { relational: -1 } },
  { id: "b03", axis: "department", department: "database", text: "サーバーを立てずに、ファイル 1 つでデータベースを使いたい", example: "スマホアプリや小さなツールの中にデータを持たせるなど", tags: { embedded: 1 } },
  { id: "b04", axis: "department", department: "database", text: "たくさんのアプリから同時に使われる、データベースのサーバーを運用したい", tags: { embedded: -1 } },
  { id: "b05", axis: "department", department: "database", text: "データをメモリに置いて、とにかく速く読み書きしたい", example: "ランキングや、ログイン状態の一時的な保存など", tags: { "in-memory": 1 } },
  { id: "b06", axis: "department", department: "database", text: "電源が切れても消えないよう、データを確実にディスクに残したい", tags: { "in-memory": -1 } },

  // 部門の専用カード: ゲーム開発
  { id: "g01", axis: "department", department: "game", text: "無料で、中身のソースコードまで公開されているツールを使いたい", tags: { "open-source": 1 } },
  { id: "g02", axis: "department", department: "game", text: "ノードを線でつないで、コードを書かずにキャラクターの動きを作りたい", tags: { "visual-scripting": 1 } },
  { id: "g03", axis: "department", department: "game", text: "ゲームの動きは、すべてコードで書きたい", tags: { "visual-scripting": -1 } },
  { id: "g04", axis: "department", department: "game", text: "長く使われている、定番のゲームエンジンで学びたい", tags: { maturity: 1 } },

  // 部門の専用カード: アルゴリズム
  { id: "r01", axis: "department", department: "algorithm", text: "データをどう並べてしまっておけば、速く取り出せるかを考えたい", example: "辞書の引き方や、順番待ちの列の作り方を工夫するなど", tags: { "data-structures": 1 } },
  { id: "r02", axis: "department", department: "algorithm", text: "大量のデータを、速く並べ替えたり探したりする方法を知りたい", tags: { "sort-search": 1 } },
  { id: "r03", axis: "department", department: "algorithm", text: "大きな問題を小さな問題に分けて、途中の答えを使い回す考え方に惹かれる", example: "同じ計算を何度もしないための工夫", tags: { "dynamic-programming": 1 } },
  { id: "r04", axis: "department", department: "algorithm", text: "地図の最短ルートや、人と人のつながりを計算する方法を知りたい", tags: { "graph-algorithms": 1 } },

  // 部門の専用カード: 数学
  { id: "m01", axis: "department", department: "math", text: "3D の物体を回転させたり、画像を変形させたりする計算を知りたい", tags: { "linear-algebra": 1 } },
  { id: "m02", axis: "department", department: "math", text: "データのばらつきや、確率で未来を予測する話に興味がある", tags: { probability: 1 } },
  { id: "m03", axis: "department", department: "math", text: "論理パズルや、「必ずこうなる」と証明するのが好き", tags: { "discrete-math": 1 } },
  { id: "m04", axis: "department", department: "math", text: "変化の速さや、いちばん良い値を求める計算に興味がある", example: "AI の学習で、誤差を少しずつ小さくしていく計算など", tags: { calculus: 1 } },

  // 部門の専用カード: セキュリティ・暗号
  { id: "s01", axis: "department", department: "security", text: "Web サイトへのよくある攻撃と、その防ぎ方を知りたい", example: "なりすましや、データベースを不正に操作される攻撃など", tags: { "web-security": 1 } },
  { id: "s02", axis: "department", department: "security", text: "ネットワークを流れる通信を、のぞき見や改ざんから守りたい", tags: { "network-security": 1 } },
  { id: "s03", axis: "department", department: "security", text: "パスワードやメッセージを、数学の力で安全に守る仕組みを知りたい", tags: { cryptography: 1 } },
  { id: "s04", axis: "department", department: "security", text: "練習用に用意された問題で、攻撃と防御を実際に試してみたい", example: "CTF という、セキュリティの技術を競う大会の問題など", tags: { ctf: 1 } },

  // 言語の性質
  { id: "l01", axis: "language", text: "型を書いておけば、実行する前にミスを見つけてくれるのがうれしい", example: "数値を入れるべき場所に文字列を入れた、などのミス", tags: { "static-typing": 1 } },
  { id: "l02", axis: "language", text: "型をいちいち書かずに、思いついたまま書き始めたい", tags: { "static-typing": -1, "fast-feedback": 0.5 } },
  { id: "l03", axis: "language", text: "エディタの補完が効いて、関数の使い方がすぐ分かるのがいい", example: "型の情報があると、エディタが候補を正確に出せる", tags: { "static-typing": 1 } },
  { id: "l04", axis: "language", advanced: true, text: "「この値は空かもしれない」とコンパイラが教えてくれるのがいい", example: "空の値（null）を使ってしまうエラーを、実行前に防げる", tags: { "null-safety": 1, "static-typing": 0.5 } },
  { id: "l05", axis: "language", advanced: true, text: "コンパイラが厳しくても、そのぶん安心して動かせるほうがいい", tags: { "static-typing": 0.5, "null-safety": 0.5, concurrency: 0.5 } },
  { id: "l06", axis: "language", text: "書いたプログラムを 1 つの実行ファイルにして、そのまま配りたい", example: "相手の PC に実行環境を入れてもらわなくても動く", tags: { "native-compile": 1 } },
  { id: "l07", axis: "language", text: "ビルドせずに、ソースコードをそのまま実行できるのが楽", tags: { "native-compile": -1, "fast-feedback": 0.5 } },
  { id: "l08", axis: "language", text: "コンパイルに時間がかかっても、速く動くプログラムを作りたい", tags: { "native-compile": 1, "fast-feedback": -0.5 } },
  { id: "l09", axis: "language", text: "メモリの確保や解放は、言語に任せておきたい", example: "使い終わったメモリを自動で片付けてくれる", tags: { gc: 1 } },
  { id: "l10", axis: "language", advanced: true, text: "メモリの確保と解放を自分で制御して、無駄なく動かしたい", tags: { gc: -1, "native-compile": 0.5, systems: 0.5 } },
  { id: "l11", axis: "language", text: "複数の処理を同時に動かすコードを、安全に書きたい", example: "ダウンロードしながら画面を動かす、など", tags: { concurrency: 1 } },
  { id: "l12", axis: "language", advanced: true, text: "処理どうしがメッセージを送り合って協力する設計に惹かれる", example: "共有した変数を奪い合う代わりに、メッセージでやり取りする", tags: { concurrency: 1 } },
  { id: "l13", axis: "language", advanced: true, text: "データの形に応じて処理を書き分ける「パターンマッチ」を使いたい", example: "「成功ならこう、失敗ならこう」を漏れなく書ける", tags: { functional: 1 } },
  { id: "l14", axis: "language", advanced: true, text: "if や switch が値を返す、式を組み合わせる書き方が好き", example: "const label = if (x > 0) \"正\" else \"負\" のような書き方", tags: { functional: 1 } },
  { id: "l15", axis: "language", text: "手順を上から順に書いていく、素直なスタイルが好き", tags: { functional: -0.5, "simple-syntax": 0.5 } },
  { id: "l16", axis: "language", text: "現実のものを「クラス」として表して設計するのが好き", example: "「ユーザー」や「商品」をクラスにして、データと操作をまとめる", tags: { oop: 1 } },
  { id: "l17", axis: "language", text: "クラスや継承を使わずに、データと関数を分けて書きたい", tags: { oop: -1, functional: 0.5 } },
  { id: "l18", axis: "language", text: "言語の文法は少ないほうがいい。覚えることが少ないから", tags: { "simple-syntax": 1 } },
  { id: "l19", axis: "language", text: "誰が書いても似たようなコードになる言語がいい", example: "書き方の選択肢が少なく、他人のコードも読みやすい", tags: { "simple-syntax": 1 } },
  { id: "l20", axis: "language", text: "構文や機能が多くても、使い分けて短く書けるほうがいい", tags: { "simple-syntax": -1 } },

  // フレームワークの性質
  { id: "f01", axis: "framework", text: "必要な機能がひととおり揃っていて、すぐ作り始められるのがいい", example: "ログイン、データベース、テストの仕組みが最初から入っている", tags: { "batteries-included": 1 } },
  { id: "f02", axis: "framework", text: "決められたお作法に従えば迷わず作れる、というほうが楽", tags: { "batteries-included": 1 } },
  { id: "f03", axis: "framework", text: "コマンド 1 つで、ひな形のコードを自動で作ってほしい", tags: { "batteries-included": 0.5 } },
  { id: "f04", axis: "framework", text: "道具は自分で選んで、必要なものだけを組み合わせたい", tags: { "batteries-included": -1 } },
  { id: "f05", axis: "framework", text: "小さく始めて、あとから必要なライブラリを足していきたい", tags: { "batteries-included": -1 } },
  { id: "f06", axis: "framework", text: "画面は、HTML に近いテンプレートで書きたい", example: "HTML の中に、データを差し込む印を書いていく", tags: { "template-syntax": 1 } },
  { id: "f07", axis: "framework", text: "HTML と CSS の知識を、そのまま活かして画面を作りたい", tags: { "template-syntax": 1, "web-frontend": 0.5 } },
  { id: "f08", axis: "framework", text: "画面の部品も、普段のプログラムと同じようにコードの中で組み立てたい", tags: { "template-syntax": -1 } },
  { id: "f09", axis: "framework", advanced: true, text: "ブラウザに送るプログラムは、ビルド時にできるだけ小さくしておきたい", example: "事前に変換しておくことで、表示を速くする", tags: { "compile-time-ui": 1 } },
  { id: "f10", axis: "framework", advanced: true, text: "画面の差分を実行時に計算する「仮想 DOM」の仕組みを学びたい", example: "画面全体を作り直す代わりに、変わった部分だけを書き換える仕組み", tags: { "compile-time-ui": -1 } },

  // 開発環境とエコシステム
  { id: "e01", axis: "ecosystem", text: "1 行書いたら、すぐ結果を確かめながら進めたい", tags: { "fast-feedback": 1 } },
  { id: "e02", axis: "ecosystem", text: "ファイルを保存した瞬間に、変更が画面に反映されてほしい", tags: { "fast-feedback": 1 } },
  { id: "e03", axis: "ecosystem", text: "実行まで少し待つとしても、事前にしっかりチェックされるほうがいい", tags: { "fast-feedback": -1, "static-typing": 0.5 } },
  { id: "e04", axis: "ecosystem", text: "長い歴史があって、仕様が安定している技術がいい", tags: { maturity: 1 } },
  { id: "e05", axis: "ecosystem", text: "何十年も使われてきた技術で、基礎を押さえたい", tags: { maturity: 1 } },
  { id: "e06", axis: "ecosystem", text: "比較的新しく設計された技術で、最近の考え方を学びたい", tags: { maturity: -1 } },
];
