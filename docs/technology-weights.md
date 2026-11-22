# 技術ごとのタグの重み（ドラフト）

- 版: 0.1
- 作成日: 2026-11-22
- 判定基準: [requirements.md の 6.5](requirements.md#65-タグ)

この表は、実装用のデータファイルを作る前のレビュー用である。データファイルにするときに、重みが 0 でないタグごとに根拠の URL（`evidence`）を確かめて入れる。

記号の意味:

- 空欄: 0
- ⚠: 判定に使った数や事実が未確認。データ化するときに公式の資料で確かめる

## 1. 言語（13 件）

| 言語 | web-frontend | web-backend | mobile | systems | data-ai | cross-platform | static-typing | null-safety | native-compile | gc | concurrency | functional | oop | simple-syntax | fast-feedback | maturity |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| JavaScript | 1 | 1 | | | | | −1 | | −1 | 1 | 0.5 | | | | 1 | 1 |
| TypeScript | 1 | 1 | | | | | 1 | 0.5 | −1 | 1 | 0.5 | 0.5 | | −1 ⚠ | 0.5 | |
| Python | | 1 | | | 1 | | −0.5 | | −1 | 1 | 0.5 | 0.5 | 1 | 1 | 1 | 1 |
| Java | | 1 | 0.5 | | | | 1 | | | 1 | 0.5 | 1 | 1 | | 1 | 1 |
| C# | 0.5 | 1 | 0.5 | | 0.5 | 1 | 1 | 0.5 | | 1 | 0.5 | 1 ⚠ | 1 | −1 | 1 | 1 |
| Go | | 1 | | | | | 1 | | 1 | 1 | 1 | | −1 | 1 | | |
| Rust | 0.5 | 0.5 | | 1 | | | 1 | 1 | 1 | −1 | 1 | 1 | −1 | | | |
| Kotlin | 0.5 | 1 | 1 | | 0.5 | 1 | 1 | 1 | | 1 | 0.5 | 1 | 1 | −1 | 1 | |
| Swift | | 0.5 | 1 | 0.5 | | | 1 | 1 | 1 | 0.5 | 1 | 1 | | −1 | 1 | |
| PHP | | 1 | | | | | −0.5 | | −1 | 1 | | 0.5 | | −1 ⚠ | 1 | 1 |
| Ruby | | 1 | | | | | −0.5 | | −1 | 1 | | 1 | 1 | | 1 | 1 |
| C++ | | | | 1 | | | 1 | | 1 | −1 | 0.5 | | | −1 | | 1 |
| Dart | 0.5 | 0.5 | 1 | | | 1 | 1 | 1 | 1 | 1 | 0.5 | 1 | 1 | ⚠ | 0.5 | |

### 1.1 判定のメモ

**分野**

- JavaScript と TypeScript の web-backend は、Node.js などのランタイムを前提にしている。
- C# は、Blazor（Web）、.NET MAUI（モバイルとデスクトップ）、ML.NET（機械学習）がいずれも Microsoft の公式である。そのため、web-frontend、mobile、data-ai が 0.5、cross-platform が 1 になる。
- Rust は、公式サイトの用途の例に WebAssembly、ネットワーク、組み込みが挙がっている。そのため、web-frontend と web-backend が 0.5、systems が 1 になる。
- Kotlin は、Android の公式言語なので mobile が 1。Kotlin Multiplatform があるので cross-platform が 1。Kotlin/JS や Kotlin/Wasm があるので web-frontend が 0.5。
- Swift は、Swift on Server と Embedded Swift が公式のプロジェクトにある。そのため、web-backend と systems が 0.5 になる。
- Java の mobile は、Android で使えるが公式の推奨が Kotlin なので 0.5 にした。
- Dart は、Flutter を通じてモバイル、デスクトップ、Web 向けに書ける。そのため、mobile と cross-platform が 1 になる。

**言語の性質**

- native-compile: Dart は、アプリのリリース時に機械語へ事前コンパイル（AOT）するのが標準なので 1。Kotlin は JVM で動かすのが標準なので 0（Kotlin/Native は考えない）。
- gc: Python と PHP は参照カウントが中心だが、循環参照の回収も標準で行う。そのため 1 になる。Swift は参照カウント（ARC）だけなので 0.5。
- concurrency: Go（チャネル）、Rust（Send と Sync によるデータ競合の防止）、Swift（actor）が 1。Java は `synchronized`、Kotlin は `suspend`、C++ は `co_await` があるので 0.5。PHP と Ruby は、並行処理用の構文がなく、Fiber や Ractor はクラスとして提供されるので 0。
- functional（パターンマッチ、直和型、式指向の 3 つのうち、言語仕様にある数で判定）:
  - Java: 3 つともある（パターンマッチの switch、sealed と record、switch 式）ので 1
  - C#: パターンマッチと switch 式があるので 1。直和型は導入が検討されている ⚠
  - TypeScript: 直和型（ユニオン型）だけなので 0.5
  - Python: パターンマッチ（match 文）だけなので 0.5
  - PHP: 値を返す match 式だけなので 0.5
  - Ruby: パターンマッチ（case/in）があり、すべてが式なので 1
- oop: Python、Ruby、Kotlin、Dart、C# は「すべての値がオブジェクト」に当たるので 1。Java は「すべてのコードをクラスの中に書く」に当たるので 1。Go と Rust はクラスも継承もないので −1。
- simple-syntax（キーワード数の概数。データ化するときに公式の一覧で数え直す）:
  - 40 個以下: Go 約 25、Python 約 39（ソフトキーワードを含む）
  - 中間: Ruby 約 41、JavaScript 約 50、Rust 約 57、Java 約 68
  - 70 個以上: C#、C++、Kotlin、Swift
  - 境界に近くて確認が必要: TypeScript、PHP（約 70）、Dart（約 70）⚠

**開発環境とエコシステム**

- fast-feedback:
  - 公式の REPL があるので 1: Node.js、Python、Java（jshell）、Kotlin、Swift、PHP、Ruby
  - 公式のホットリロードがあるので 1: C#（dotnet watch）
  - 0.5: TypeScript（公式の REPL がない）、Dart（ホットリロードは主に Flutter から使う）
- maturity（1.0 の年）:
  - 2011 年以前で 1: JavaScript 1995、Python 1994、Java 1996、C# 2002、PHP 1995、Ruby 1996、C++ 1985
  - その間で 0: TypeScript 2014、Go 2012、Rust 2015、Kotlin 2016、Swift 2014、Dart 2013

## 2. フレームワーク（13 件）

| フレームワーク | 言語 | web-frontend | web-backend | mobile | cross-platform | full-stack | batteries-included | template-syntax | compile-time-ui | fast-feedback | maturity |
|---|---|---|---|---|---|---|---|---|---|---|---|
| React | JS, TS | 1 | | | | | −1 | −1 | −1 | 1 | |
| Vue.js | JS, TS | 1 | | | | | −1 | 1 | −1 | 1 | |
| Svelte | JS, TS | 1 | | | | | −1 | 1 | 1 | 1 | |
| Angular | TS | 1 | | | | | 0 | 1 | 1 | 1 | |
| Next.js | JS, TS | 1 | 0.5 | | | 1 | 0 | −1 | −1 | 1 | |
| Express | JS, TS | | 1 | | | | −1 | | | | 1 |
| Django | Python | | 1 | | | 1 | 1 | | | 1 | 1 |
| FastAPI | Python | | 1 | | | | 0 | | | 1 | |
| Ruby on Rails | Ruby | 0.5 | 1 | | | 1 | 1 | | | 1 | 1 |
| Spring Boot | Java, Kotlin | | 1 | | | | 1 | | | 0.5 | |
| Laravel | PHP | 0.5 | 1 | | | 1 | 1 | | | 1 | 1 |
| Flutter | Dart | 0.5 | | 1 | 1 | | 0 | −1 | | 1 | |
| React Native | JS, TS | | | 1 | 1 | | −1 | −1 | | 1 | |
| Gin | Go | | 1 | | | | −1 | | | | |
| SwiftUI | Swift | | | 1 | | | −1 | −1 | | 1 | |
| Jetpack Compose | Kotlin | | | 1 | | | −1 | −1 | | 1 | −1 |

### 2.1 判定のメモ

- batteries-included（ルーティング、DB アクセス、認証、テスト支援、コード生成 CLI のうち、本体と同じリポジトリで配布されている数）:
  - 4 つ以上で 1: Django、Rails、Spring Boot、Laravel（5 つとも）
  - 2〜3 個で 0: Angular（ルーター、テスト、CLI）、Next.js（ルーティング、create-next-app）、FastAPI（ルーティング、TestClient）、Flutter（Navigator、flutter_test、CLI）
  - 1 つ以下で −1: React、Vue.js、Svelte（ルーターなどは別のリポジトリ）、Express（ルーティングだけ）、React Native
- template-syntax: Vue.js（SFC のテンプレート）、Svelte、Angular は HTML ベースのテンプレートなので 1。React と Next.js（JSX）、Flutter（Dart のウィジェット）、React Native（JSX）はコードの中で画面を組み立てるので −1。
- compile-time-ui: Svelte と Angular は仮想 DOM を使わずテンプレートをコンパイルするので 1。React、Next.js、Vue.js は仮想 DOM を使うので −1。Vue.js の Vapor Mode が標準になったら見直す ⚠。Flutter と React Native は DOM を使わないので 0。
- full-stack: 公式ドキュメントが、画面とサーバー処理を 1 つのプロジェクトで作ることを主な用途として掲げているもの（Next.js、Django、Rails、Laravel）を 1 にした。
- web-frontend の 0.5: Rails（Hotwire）と Laravel（Livewire）は公式の仕組みで画面側も書ける。Flutter は Web にも出力できる。
- fast-feedback: Spring Boot は DevTools を追加すると自動再起動するので 0.5。Express は自前の仕組みがないので 0。
- maturity: FastAPI と React Native は 1.0 が出ていないため、最初の公開年（2018 年と 2015 年）で判定した ⚠

## 3. インフラ・DevOps（5 件）

Go の言語のタグに `infra: 1` を追加した（公式サイトの用途の例に DevOps と SRE が挙がっているため）。

| 技術 | infra | declarative | distributed | containers | ci-cd | maturity |
|---|---|---|---|---|---|---|
| Linux | 1 | −1 | −1 | | | 1 |
| Docker | 1 | | −1 | 1 | | |
| Kubernetes | 1 | 1 | 1 | 1 | | |
| Terraform | 1 | 1 | 1 | | | |
| GitHub Actions | 1 | −1 | | | 1 | |

### 3.1 判定のメモ

- declarative:
  - Kubernetes（マニフェスト）と Terraform（HCL）は、「あるべき状態」を書くので 1。
  - Linux（シェルのコマンド）と GitHub Actions（ワークフローの steps）は、手順を書くので −1。
  - Docker は、Dockerfile（手順）と Compose（宣言）の両方が主要な機能なので 0。
- distributed: Kubernetes と Terraform は複数台やクラウド全体を対象にするので 1。Linux と Docker は 1 台のマシンを対象にするので −1。GitHub Actions はどちらでもないので 0。
- maturity: Linux は 1.0 が 1994 年なので 1。Terraform は 1.0 が 2021 年だが、2014 年から公開されていたので例外として 0。Docker（2014 年）、Kubernetes（2015 年）、GitHub Actions（2019 年に一般提供）は 0。

## 3.5 AI・データ（4 件）

| 技術 | data-ai | deep-learning | high-level-api | dataframe |
|---|---|---|---|---|
| PyTorch | 1 | 1 | −1 | |
| TensorFlow | 1 | 1 | 1 | |
| scikit-learn | 1 | −1 | 1 | |
| pandas | 1 | | | 1 |

### 3.5.1 判定のメモ

- deep-learning: scikit-learn は、公式の FAQ でディープラーニングを対象外としているので −1 ⚠
- high-level-api:
  - TensorFlow は、Keras の `fit` で学習するのが公式チュートリアルの標準なので 1。
  - scikit-learn は、`fit` と `predict` が標準なので 1。
  - PyTorch は、学習ループを自分で書くのが公式チュートリアルの標準なので −1。
- pandas は、モデルの学習を扱わないので、deep-learning と high-level-api は 0。

## 3.6 データベース（4 件）

| 技術 | database | relational | embedded | in-memory | maturity |
|---|---|---|---|---|---|
| PostgreSQL | 1 | 1 | −1 | −1 | 1 |
| SQLite | 1 | 1 | 1 | −1 | 1 |
| MongoDB | 1 | −1 | −1 | −1 | 1 |
| Redis | 1 | −1 | −1 | 1 | 1 |

### 3.6.1 判定のメモ

- relational: PostgreSQL と SQLite はリレーショナルなので 1。MongoDB（ドキュメント型）と Redis（キーバリュー型）は −1。
- embedded: SQLite はアプリのライブラリとして動くのが標準なので 1。ほかはサーバーとして動かすのが標準なので −1。
- in-memory: Redis はデータを主にメモリに置くので 1。ほかはディスクに置くので −1。
- maturity: 1.0 は PostgreSQL（前身の Postgres95 を経て 1997 年に 6.0）、SQLite（2000 年）、MongoDB（2009 年）、Redis（2009 年）で、すべて 2011 年以前なので 1。部門の中では差がつかない。
- MySQL を載せていない理由: relational 1、embedded −1、in-memory −1、maturity 1 で、PostgreSQL と重みがまったく同じになり、推薦で区別できない。2 つを区別する客観的なタグ（例: 開発の主体が企業かコミュニティか）を決めたら追加する。

## 3.7 ゲーム開発（3 件）

C# の言語のタグに `game: 0.5` を追加した（Microsoft の .NET 公式サイトに、ゲーム開発のページがあるため）。

| 技術 | game | open-source | visual-scripting | maturity |
|---|---|---|---|---|
| Unity | 1 | −1 | 0.5 | 1 |
| Unreal Engine | 1 | | 1 | 1 |
| Godot | 1 | 1 | −1 | |

### 3.7.1 判定のメモ

- open-source: Godot は MIT ライセンスなので 1。Unity はソースコードが公開されていないので −1。Unreal Engine はソースコードを公開しているが、オープンソースのライセンスではないので 0。
- visual-scripting: Unreal Engine は Blueprint が標準の作り方なので 1。Unity は公式の Visual Scripting があるが、標準は C# のスクリプトなので 0.5。Godot は 4.0 でビジュアルスクリプトを廃止したので −1。
- maturity: Unity（1.0 は 2005 年）と Unreal Engine（1998 年）は 1。Godot（1.0 は 2014 年）は 0。

## 3.8 知識の分野（アルゴリズム、数学、セキュリティ・暗号。12 件）

各トピックは、その部門の分野のタグ（`algorithm`、`math`、`security`）と内容のタグを 1 ずつ持ち、関係する分野のタグを持つ（requirements.md の 6.5）。

| トピック | 内容のタグ | 関係する分野 |
|---|---|---|
| データ構造 | `data-structures` | database 0.5（データベースの索引） |
| ソートと探索 | `sort-search` | |
| 動的計画法 | `dynamic-programming` | |
| グラフアルゴリズム | `graph-algorithms` | game 0.5（道探し）、infra 0.5（ネットワークの経路） |
| 線形代数 | `linear-algebra` | data-ai 1、game 1（3D の表示） |
| 確率・統計 | `probability` | data-ai 1 |
| 離散数学 | `discrete-math` | algorithm 1 |
| 微分積分 | `calculus` | data-ai 0.5（最適化）、game 0.5（物理の計算） |
| Web セキュリティ | `web-security` | web-backend 1、web-frontend 0.5 |
| ネットワークセキュリティ | `network-security` | infra 1 |
| 暗号 | `cryptography` | math 0.5（整数論） |
| CTF | `ctf` | systems 0.5 |

## 4. 見つかった課題

### 4.1 React、Vue.js、Svelte の重みが同じ（対応済み）

当初のタグでは、この 3 つの重みがまったく同じで、推薦で区別できなかった。そこで `template-syntax` と `compile-time-ui` を追加し、React、Vue.js、Svelte、Angular の 4 つがすべて異なる重みになるようにした。

Rails、Laravel、Django はほぼ同じ重みのままだが、使う言語が違うので、組み合わせのスコアで差が出る。

### 4.2 maturity で −1 になる技術が少ない

2021 年以降に 1.0 が出た技術は、今のところ Terraform だけである。言語とフレームワークでは、`maturity` は「古いか、そうでないか」しか表していない。新しい技術を追加するまでは、このままでよいと考える。

### 4.3 フレームワークがない言語がある（シミュレーションで判明。対応済み）

Go、Rust、Swift、C++、Kotlin を単独で使うフレームワークが一覧にない。そのため、たとえば「サーバーの並行処理をシンプルに書きたい」人は言語の 1 位が Go なのに、組み合わせは「Python ＋ FastAPI」になる。

対策の案: Go の Web フレームワーク（Gin など）、Swift の SwiftUI、Kotlin の Jetpack Compose などを追加する。

対応: Gin（Go）、SwiftUI（Swift）、Jetpack Compose（Kotlin）を追加した。判定のメモは次のとおり。

- Gin: 本体はルーティングだけなので batteries-included は −1。1.0 は 2015 年なので maturity は 0。
- SwiftUI: iOS と macOS など Apple の OS だけに対応するので、cross-platform は 0（異なる会社の OS の両方ではない）。公式のプレビューで画面をすぐ確かめられるので fast-feedback は 1。1.0 は 2019 年なので maturity は 0。
- Jetpack Compose: 1.0 が 2021 年なので maturity は −1。そのほかは SwiftUI と同じ。
- これで、組み合わせのフレームワークがない言語は C#、Rust、C++ の 3 つになった。この 3 つが 1 位のときは、ほかのフレームワークとの組み合わせが出る。C# には ASP.NET Core や .NET MAUI を追加する余地がある（未対応）。

### 4.4 タグの少ないフレームワークが上位に来やすい

コサイン類似度では、タグが少ない技術ほど、一致したタグ 1 つの影響が大きくなる。たとえば「クラス設計と型が好きな業務系」の人で、Express（タグ 3 個）がフレームワークの 1 位になった。組み合わせは Java ＋ Spring Boot になるので、MVP ではこのままにしておく。

### 4.5 maturity の基準が実態と逆になる技術がある（対応済み）

`maturity` は 1.0 のリリース年で判定している。しかし、scikit-learn は 2007 年から公開されて広く使われているのに、1.0 は 2021 年なので「新しい技術」（−1）になってしまう。

対応: 「1.0 より前に 5 年以上公開されていた技術は 0 とする」例外を基準に加えた（requirements.md の 6.5）。この例外で、scikit-learn と pandas は 0 になり、Terraform（2014 年公開、1.0 は 2021 年）も −1 から 0 に変わった。

検討した案は次の 2 つで、2 つ目を採った。

- 「最初の公開年」で判定する。ただし、Go（2009 年公開、2012 年に 1.0）や Rust（2010 年公開、2015 年に 1.0）なども判定が変わる可能性があるので、全体を見直す必要がある。
- 1.0 の年で判定したまま、1.0 より前に何年も公開されていた技術にだけ `maturity` を付けない、という例外を基準に書く。

