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

作品ごとに `src/content/works/{id}.md` を 1 つ置きます。ファイル名（拡張子なし）が `id` で、公開済みの作品は `/works/{id}/` のページになります。仕様は [docs/WORK-PAGES.md](docs/WORK-PAGES.md) を参照してください。

画像は `src/assets/works/{id}/` に追加し、Markdown ファイルからの相対パス（例：`../../assets/works/igniter/key.jpg`）で指定します。ビルド時に AVIF / WebP が生成されます。

### frontmatter

- `order` は表示順です。
- `status: released` はタイトル、キャッチコピー、紹介文（`description`。作品ページのリード文と meta description に使います）、キービジュアル、人数・時間・年齢・価格、ジャンル、イベント、リンク、アクセント色を既存のファイルに沿って設定します。
- `featured: true` は公開済み作品の **ちょうど 1 件**に指定します。0 件・複数件はビルドエラーです。トップのアイキャッチに表示されます。
- `events` は古い順に並べます。最後のイベントがアイキャッチ・作品カード・作品ページの 1 画面目に表示されます。`date` は初日の `YYYY-MM-DD`、未設定は `null`。日本時間のビルド日以降なら「次回出展」、過去・未設定なら「頒布」です。
- 通販 URL が未定なら `links.shop: null`。作品ページには「通販準備中」を表示します。
- `accent` は作品ページのボタン・リンク・フォーカスリングの色です（`"#b8262c"` のように引用符で囲んだ 6 桁の 16 進数）。白地とのコントラスト比が 4.5:1 未満の色はビルドエラーになります。
- `keyImage` と `ogImage` は `src/assets/works/` の下に置きます。
- 制作中は `status: coming-soon` と `order`、`title`、`catchcopy` だけを設定し、本文は書きません。作品ページは作られません。

### 本文

frontmatter の後に、作品の魅力や遊び方を Markdown で書きます。本文がなくてもかまいません。

- `##` の見出しごとに 1 つのセクションになります。本文は `##` から始め、`#` は使いません（ページの見出しは作品名です）。`###` はセクション内の小見出しに使えます。
- 画像は 1 行に 1 枚ずつ、前後に空行を入れずに並べます。`alt`（`![ここ](…)`）は必須です。
- 画像はセクションの文章の後にまとまり、枚数でレイアウトが変わります。0 枚は文章だけ、1 枚は文章と横並び（セクションごとに左右が入れ替わります）、2 枚以上は文章の下に縦に並びます。
- 本文の画像は長辺 2400px 以下で置いてください（WebP に変換されますが、縮小はされません）。

`#` の見出し、最初の `##` より前の文章、`alt` のない画像はビルドエラーになります。

```md
## 遊び方

文章……

![説明書 1ページ目](../../assets/works/crash-combo-kungfu/playguide-0.png)
![説明書 2ページ目](../../assets/works/crash-combo-kungfu/playguide-1.png)
```

### 共有と OGP

作品の共有 URL は `/works/{id}/`（例：<https://kyoryuteishoku.ragi.house/works/igniter/>）です。以前の `/#work=igniter` は作品ページに転送します。

作品ページの OGP 画像（`/works/{id}/og.png`、1200×630）はビルド時にキービジュアルから自動で作ります。専用の画像を使う場合は、frontmatter の `ogImage` に 1200×630 の画像を指定します。

トップの作品を変更する際は、SNS 用画像から `public/og.png`（1200×630、トップページの OGP）も更新してください。

## メンバーの更新

`src/data/members.yaml` を編集し、アイコンを `src/assets/members/` に追加します。`order`、`name`、`role`、`icon` と必要な `links.x` / `links.instagram` / `links.email` を設定します。メールは YAML に通常の形式で記載できます。出力 HTML ではユーザー名とドメインに分割し、ブラウザ上でリンクを組み立てます。JavaScript が無効な場合は `[at]` 表記になります。

サイト名・SNS・ナビ・EmailJS の公開設定は `src/config/site.ts`、色・余白・文字サイズなどは `src/styles/tokens.css` に集約しています。EmailJS テンプレートの変数名 `from_name` / `email` / `message` は変更しないでください。

## デプロイと日次更新

`main` への push、Actions の手動実行、毎日日本時間 0 時のスケジュールで GitHub Pages にデプロイします。CI は Node 24 です。PR では型・Lint・整形・ビルドを確認します。

公開リポジトリが 60 日間更新されないと、GitHub がスケジュールを無効化することがあります。通知を受け取ったら、リポジトリの **Actions → Deploy Astro site to Pages → Enable workflow** で再び有効にしてください。必要なら **Run workflow** で直ちに再ビルドできます。日次ビルドにより出展ラベルの日付が切り替わります。

独自ドメインは GitHub の **Settings → Pages → Custom domain** で `kyoryuteishoku.ragi.house` を設定します。`public/CNAME` は手動デプロイ用の控えです。DNS・HTTPS・EmailJS の許可ドメイン設定はオーナーが行います。旧ドメインへのリダイレクトはありません。
