# tecupid

エンジニアのための技術マッチングアプリ。

技術の特徴が書かれたカードに「すき」か「パス」で答えると、あなたにぴったりの技術を部門ごとに推薦します。最初に経験レベル（0〜10）を選ぶと、初心者には専門用語の少ないカードを出し、学び始めやすい技術を少し優先します。

> This is a web application that supports you in selecting a new technology to learn.

## 開発

Node.js 22.23.4 以上が必要です。

```sh
npm install
npm run dev        # 開発サーバー（http://localhost:4321）
npm test           # 単体テスト、データの整合性チェック、ペルソナの回帰テスト
npm run check      # 型チェック
npm run build      # dist/ に静的ビルド
npm run preview    # ビルドして Cloudflare Workers のローカル環境で確認
npm run deploy     # ビルドして Cloudflare Workers にデプロイ
npm run og         # SNS 用のサムネイル画像（public/og/）を作り直す
npm run simulate   # 「結果を見る」までの最低枚数を決めるシミュレーション
```

### 本番の URL

SNS のサムネイル（OGP 画像）の URL は絶対 URL で書く必要があるため、ビルドするときに環境変数 `SITE_URL` で本番の URL を指定します。未指定のときは、OGP の画像と URL のメタタグを出力しません。

```sh
SITE_URL=https://tecupid.example.workers.dev npm run deploy
```

### サムネイル画像

結果ごとのサムネイルは `npm run og` で `public/og/` に作り、コミットします。技術を追加したり名前を変えたりしたら作り直してください（画像が足りないとテストが失敗します）。手元の Edge（Windows）か Chrome を使います。ブラウザは `OG_BROWSER=chrome` のように変えられます。

## 構成

| パス | 内容 |
|---|---|
| `src/data/tags.ts` | タグの定義 |
| `src/data/departments.ts` | 結果画面の部門 |
| `src/data/cards.ts` | 特徴カード |
| `src/data/technologies.ts` | 技術とタグの重み |
| `src/lib/scoring.ts` | 推薦のスコアリング |
| `src/lib/deck.ts` | 1 回のセッションで出すカードの選び方 |
| `src/components/TecupidApp.tsx` | スタート、カード、結果の画面 |
| `src/components/sprites.ts` | ドット絵のスプライト |
| `src/pages/` | トップ、シェア用のページ（`m/`）、利用規約、免責事項、プライバシーポリシー、tecupid について、404 |
| `src/lib/share.ts` | シェア用の URL、OGP 画像のパス、X の投稿画面の URL |
| `scripts/generate-og.ts` | SNS 用のサムネイル画像を作るスクリプト |
| `scripts/simulate-min-answers.ts` | 途中で結果を見たときに、1 位がどれだけ変わるかを測るシミュレーション |
| `wrangler.jsonc` | Cloudflare Workers の設定（静的アセットだけを配信） |
| `docs/` | 要件定義書と、データのレビュー用の表 |

## クレジット

- フォント: [DotGothic16](https://fonts.google.com/specimen/DotGothic16)（Copyright 2020 The DotGothic16 Project Authors）。[SIL Open Font License 1.1](https://openfontlicense.org/)
- ドット絵: tecupid のオリジナル

## ドキュメント

- [要件定義書](docs/requirements.md)
- [技術ごとのタグの重み](docs/technology-weights.md)
- [特徴カード](docs/feature-cards.md)
