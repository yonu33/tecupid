// デプロイの前に、本番の URL（SITE_URL）が指定されているかを確かめる。
// 指定し忘れると、SNS のサムネイル（OGP 画像）のメタタグが出力されないまま公開されてしまうため。
const site = process.env.SITE_URL;

if (!site) {
  console.error(
    [
      "SITE_URL が指定されていません。本番の URL を指定してからデプロイしてください。",
      "  bash:       SITE_URL=https://tecupid.example.workers.dev npm run deploy",
      '  PowerShell: $env:SITE_URL="https://tecupid.example.workers.dev"; npm run deploy',
    ].join("\n"),
  );
  process.exit(1);
}

let url;
try {
  url = new URL(site);
} catch {
  console.error(`SITE_URL が URL の形になっていません: ${site}`);
  process.exit(1);
}
if (url.protocol !== "https:") {
  console.error(`SITE_URL は https で始めてください: ${site}`);
  process.exit(1);
}
console.log(`SITE_URL: ${url.origin}`);
