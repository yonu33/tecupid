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

  // 言語の性質
  { id: "l01", axis: "language", text: "型を書いておけば、実行する前にミスを見つけてくれるのがうれしい", example: "数値を入れるべき場所に文字列を入れた、などのミス", tags: { "static-typing": 1 } },
  { id: "l02", axis: "language", text: "型をいちいち書かずに、思いついたまま書き始めたい", tags: { "static-typing": -1, "fast-feedback": 0.5 } },
  { id: "l03", axis: "language", text: "エディタの補完が効いて、関数の使い方がすぐ分かるのがいい", example: "型の情報があると、エディタが候補を正確に出せる", tags: { "static-typing": 1 } },
  { id: "l04", axis: "language", text: "「この値は空かもしれない」とコンパイラが教えてくれるのがいい", example: "空の値（null）を使ってしまうエラーを、実行前に防げる", tags: { "null-safety": 1, "static-typing": 0.5 } },
  { id: "l05", axis: "language", text: "コンパイラが厳しくても、そのぶん安心して動かせるほうがいい", tags: { "static-typing": 0.5, "null-safety": 0.5, concurrency: 0.5 } },
  { id: "l06", axis: "language", text: "書いたプログラムを 1 つの実行ファイルにして、そのまま配りたい", example: "相手の PC に実行環境を入れてもらわなくても動く", tags: { "native-compile": 1 } },
  { id: "l07", axis: "language", text: "ビルドせずに、ソースコードをそのまま実行できるのが楽", tags: { "native-compile": -1, "fast-feedback": 0.5 } },
  { id: "l08", axis: "language", text: "コンパイルに時間がかかっても、速く動くプログラムを作りたい", tags: { "native-compile": 1, "fast-feedback": -0.5 } },
  { id: "l09", axis: "language", text: "メモリの確保や解放は、言語に任せておきたい", example: "使い終わったメモリを自動で片付けてくれる", tags: { gc: 1 } },
  { id: "l10", axis: "language", text: "メモリの確保と解放を自分で制御して、無駄なく動かしたい", tags: { gc: -1, "native-compile": 0.5, systems: 0.5 } },
  { id: "l11", axis: "language", text: "複数の処理を同時に動かすコードを、安全に書きたい", example: "ダウンロードしながら画面を動かす、など", tags: { concurrency: 1 } },
  { id: "l12", axis: "language", text: "処理どうしがメッセージを送り合って協力する設計に惹かれる", example: "共有した変数を奪い合う代わりに、メッセージでやり取りする", tags: { concurrency: 1 } },
  { id: "l13", axis: "language", text: "データの形に応じて処理を書き分ける「パターンマッチ」を使いたい", example: "「成功ならこう、失敗ならこう」を漏れなく書ける", tags: { functional: 1 } },
  { id: "l14", axis: "language", text: "if や switch が値を返す、式を組み合わせる書き方が好き", example: "const label = if (x > 0) \"正\" else \"負\" のような書き方", tags: { functional: 1 } },
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
  { id: "f09", axis: "framework", text: "ブラウザに送るプログラムは、ビルド時にできるだけ小さくしておきたい", example: "事前に変換しておくことで、表示を速くする", tags: { "compile-time-ui": 1 } },
  { id: "f10", axis: "framework", text: "画面の差分を実行時に計算する「仮想 DOM」の仕組みを学びたい", example: "画面全体を作り直す代わりに、変わった部分だけを書き換える仕組み", tags: { "compile-time-ui": -1 } },

  // 開発環境とエコシステム
  { id: "e01", axis: "ecosystem", text: "1 行書いたら、すぐ結果を確かめながら進めたい", tags: { "fast-feedback": 1 } },
  { id: "e02", axis: "ecosystem", text: "ファイルを保存した瞬間に、変更が画面に反映されてほしい", tags: { "fast-feedback": 1 } },
  { id: "e03", axis: "ecosystem", text: "実行まで少し待つとしても、事前にしっかりチェックされるほうがいい", tags: { "fast-feedback": -1, "static-typing": 0.5 } },
  { id: "e04", axis: "ecosystem", text: "長い歴史があって、仕様が安定している技術がいい", tags: { maturity: 1 } },
  { id: "e05", axis: "ecosystem", text: "何十年も使われてきた技術で、基礎を押さえたい", tags: { maturity: 1 } },
  { id: "e06", axis: "ecosystem", text: "比較的新しく設計された技術で、最近の考え方を学びたい", tags: { maturity: -1 } },
];
