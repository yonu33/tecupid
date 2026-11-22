// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// 本番の URL。SNS のサムネイル（OGP 画像）の URL は絶対 URL で書く必要があるため、
// ビルドするときに環境変数 SITE_URL で指定する。
// 例: SITE_URL=https://tecupid.example.workers.dev npm run deploy
// 未設定のときは、OGP の画像と URL のメタタグを出力しない。
const site = process.env.SITE_URL || undefined;

// https://astro.build/config
export default defineConfig({
  site,
  integrations: [react()]
});
