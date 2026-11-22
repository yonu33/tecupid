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
```

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
| `src/pages/` | トップ、利用規約、免責事項、プライバシーポリシー、tecupid について、404 |
| `wrangler.jsonc` | Cloudflare Workers の設定（静的アセットだけを配信） |
| `docs/` | 要件定義書と、データのレビュー用の表 |

## クレジット

- フォント: [DotGothic16](https://fonts.google.com/specimen/DotGothic16)（Copyright 2020 The DotGothic16 Project Authors）。[SIL Open Font License 1.1](https://openfontlicense.org/)
- ドット絵: tecupid のオリジナル

## ドキュメント

- [要件定義書](docs/requirements.md)
- [技術ごとのタグの重み](docs/technology-weights.md)
- [特徴カード](docs/feature-cards.md)
