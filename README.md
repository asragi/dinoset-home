# 恐竜定食

<img src="https://kyoryuteishoku.ragi.house/logo.png" alt="恐竜定食のロゴ" width="120" />

ボードゲーム制作サークル「恐竜定食」の公式サイト。

公開先：<https://kyoryuteishoku.ragi.house>

Astro の静的サイト。React や CSS フレームワークは使っていません。仕様は [docs/RENEWAL.md](docs/RENEWAL.md) を参照してください。

## 開発

CI と `.nvmrc` は Node 24、対応エンジンは Node 24 以上です。ローカルでは Node 26 も使えます。pnpm のバージョンは `package.json` の `packageManager` に固定しています。Node 25 以降では pnpm / corepack を別途用意してください（macOS では Homebrew で導入できます）。

```sh
corepack enable
pnpm install
pnpm dev
```

開発サーバーは <http://localhost:4321> です。

```sh
pnpm astro check
pnpm lint
pnpm format:check
pnpm build
pnpm preview
```

整形する場合は `pnpm format`。ビルド結果は `dist/` に出力されます。

## 作品の更新

`src/data/works.yaml` を編集します。画像は `src/assets/works/{id}/` に追加し、YAML からの相対パス（例：`../assets/works/igniter/key.jpg`）で指定します。ビルド時に AVIF / WebP が生成されます。

- `id` は一意の英数字・ハイフン、`order` は表示順です。
- `status: released` はタイトル、紹介文、画像、人数・時間・年齢・価格、ジャンル、イベント、リンクを既存データに沿って設定します。
- `featured: true` は公開済み作品の **ちょうど 1 件**に指定します。0 件・複数件はビルドエラーです。アイキャッチと作品一覧は同じデータを使います。
- `events` は古い順に並べます。最後のイベントがアイキャッチと作品カードに表示されます。`date` は初日の `YYYY-MM-DD`、未設定は `null`。日本時間のビルド日以降なら「次回出展」、過去・未設定なら「頒布」です。
- 通販 URL が未定なら `links.shop: null`。ダイアログには「通販準備中」を表示します。
- 制作中は `status: coming-soon` と `id`、`order`、`title`、`catchcopy` だけを設定できます。

トップの作品を変更する際は、SNS 用画像から `public/og.png`（1200×630）も更新してください。リンク共有は `/#work=igniter` のように作品ダイアログへ直接開けます。

## メンバーの更新

`src/data/members.yaml` を編集し、アイコンを `src/assets/members/` に追加します。`order`、`name`、`role`、`icon` と必要な `links.x` / `links.instagram` / `links.email` を設定します。メールは YAML に通常の形式で記載できます。出力 HTML ではユーザー名とドメインに分割し、ブラウザ上でリンクを組み立てます。JavaScript が無効な場合は `[at]` 表記になります。

サイト名・SNS・ナビ・EmailJS の公開設定は `src/config/site.ts`、色・余白・文字サイズなどは `src/styles/tokens.css` に集約しています。EmailJS テンプレートの変数名 `from_name` / `email` / `message` は変更しないでください。

## デプロイと日次更新

`main` への push、Actions の手動実行、毎日日本時間 0 時のスケジュールで GitHub Pages にデプロイします。CI は Node 24 です。PR では型・Lint・整形・ビルドを確認します。

公開リポジトリが 60 日間更新されないと、GitHub がスケジュールを無効化することがあります。通知を受け取ったら、リポジトリの **Actions → Deploy Astro site to Pages → Enable workflow** で再び有効にしてください。必要なら **Run workflow** で直ちに再ビルドできます。日次ビルドにより出展ラベルの日付が切り替わります。

独自ドメインは GitHub の **Settings → Pages → Custom domain** で `kyoryuteishoku.ragi.house` を設定します。`public/CNAME` は手動デプロイ用の控えです。DNS・HTTPS・EmailJS の許可ドメイン設定はオーナーが行います。旧ドメインへのリダイレクトはありません。
