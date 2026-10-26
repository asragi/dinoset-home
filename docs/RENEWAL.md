# 恐竜定食 Web サイト リニューアル計画

最終更新: 2026-10-25

既存の Next.js 13 製サイトを全面的に作り直し、Astro と素の CSS で再構築するための仕様書兼チェックリスト。

---

## 1. ゴールとスコープ

- ボードゲーム制作サークル「恐竜定食」の **最新作を一目で伝える** 1 ページサイトにする
- 360〜1440px で崩れないレスポンシブ対応
- **簡潔で洗練された、AI 生成感のないデザイン**（§7）
- 古い技術をすべて最新のものへ置き換え（§4）、作品・メンバーの更新を YAML の編集だけで済むようにする（§6）

スコープ外：作品ごとの個別ページ、ダークモード、多言語対応、CMS。

---

## 2. オーナーとの合意事項

| 項目 | 内容 |
| --- | --- |
| ページ構成 | ヘッダー / アイキャッチ / 作品 / メンバー / お問い合わせ / フッター（§8） |
| ヘッダー | 両端が半円のピル型。左にロゴアイコンと「恐竜定食」。追従し、アンカーリンクと SNS を置く |
| アイキャッチ | 最新作「クラッシュ・コンボ・カンフー！」を 1 画面分の高さで見せる |
| 作品 | 3 点を縦に並べる（3 点目は Coming soon）。クリックで同じページ内にダイアログを開き、通販とゲームマーケットへリンクする |
| メンバー | 現行の 2 名（asRagi / euraru） |
| お問い合わせ | EmailJS のフォームを作り直して残す |
| デザイン | ロゴや「定食」のモチーフは使わない。ロゴの色はアクセントとしてだけ使う。https://vrc-ai.com/ を参考にするが、盗用にならないようにする（§7） |
| アニメーション | スクロールに連動したフェードインを要所にだけ入れる（§7.5） |
| 分担 | AI がデザインまで一通り作り、オーナーが仕上げる |
| 作品情報 | 紹介文と出展情報はゲームマーケットの掲載内容を使う。画像は今ある素材で作り、必要に応じてオーナーが差し替える |
| ホスティング | GitHub Pages を継続し、`kyoryuteishoku.ragi.house` で公開する |

---

## 3. 削除するものと引き継ぐもの

### 削除する

```
src/                      # 丸ごと
next.config.js
next-env.d.ts
.eslintrc.json
tsconfig.json             # Astro 用に作り直す
yarn.lock
yarn-error.log
.next/
.github/workflows/nextjs.yml
CNAME                     # 新ドメインで public/CNAME を作り直す（§10）
public/next.svg
public/vercel.svg
public/top-background.png
public/twitter.svg
public/instagram.svg      # アイコンはインライン SVG で作り直す
public/mail.svg
public/igniter-thumbnail.webp
public/icon/              # src/assets/members/ に移す
```

`.gitignore` は Astro 用（`dist/`、`.astro/`、`node_modules/`、`.env*`、`.DS_Store`、`.idea/`）に作り直す。

### 引き継ぐ

- `public/logo.png`：README から参照するので public にも残す（README の URL は新ドメインに書き換える）。サイト内では `src/assets/logo.png` にコピーして使う
- EmailJS の Service ID、Template ID、Public Key と、テンプレートの変数名（§8.6）

---

## 4. 技術スタック

バージョンは着手時点の最新安定版を入れる。CI は Node 24 を使い、`.nvmrc` は `24`、`engines.node` は `">=24"` とする。ローカルでは Node 26 と Homebrew の pnpm / corepack を使用する。

| 用途 | 旧 | 新 |
| --- | --- | --- |
| フレームワーク | Next.js 13.4 + React 18 | Astro（静的出力、React は使わない） |
| スタイル | Sass（SCSS Modules） | 素の CSS（Astro の scoped `<style>` とグローバルのトークン CSS） |
| クライアント JS | React | 必要な箇所だけ素の TS（`src/scripts/`） |
| スムーススクロール | react-scroll | CSS の `scroll-behavior` と `scroll-margin-top` |
| モバイルメニュー | なし | Popover API |
| モーダル | なし | `<dialog>` |
| 画像 | `next/image`（最適化なし） | `astro:assets`（ビルド時に AVIF / WebP を生成） |
| フォント | `next/font/google`（Inter） | Fontsource でセルフホスト（§7.4） |
| メール送信 | `@emailjs/browser` v3 | `@emailjs/browser` 最新版 |
| データ管理 | コンポーネントに直書き | Content Collections（`file()` loader + YAML + zod） |
| 型チェック | `next build` | `astro check`（`@astrojs/check` と `typescript`） |
| Lint / Format | ESLint 8 + eslint-config-next | ESLint 最新版（flat config）+ `eslint-plugin-astro`、Prettier + `prettier-plugin-astro` |
| パッケージマネージャ | yarn v1 | pnpm（`packageManager` フィールドで固定し、corepack で有効化） |
| Node | 16（CI） | 24（CI・`.nvmrc`）、`engines.node: ">=24"`（ローカルは 26） |
| CI | `actions/*` v2〜v3 | `withastro/action` と `actions/deploy-pages` の最新メジャー |

### 対応ブラウザ

iOS Safari 17.5 以上、Chrome / Edge / Firefox の最新 2 バージョン。CSS ネスト、`:has()`、container query、Popover、`svh`、`@starting-style` を使う前提の下限。

---

## 5. ディレクトリ構成

```
.
├── astro.config.mjs
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml          # onlyBuiltDependencies（sharp / esbuild）
├── tsconfig.json
├── eslint.config.js
├── .prettierrc
├── .nvmrc
├── .github/workflows/deploy.yml
├── docs/RENEWAL.md
├── public/
│   ├── CNAME
│   ├── logo.png
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   └── og.png
└── src/
    ├── assets/
    │   ├── logo.png
    │   ├── works/{作品 id}/      # §6.3
    │   └── members/
    ├── config/site.ts
    ├── lib/works.ts             # 作品の取得・ソート・featured の検証
    ├── content.config.ts
    ├── data/
    │   ├── works.yaml
    │   └── members.yaml
    ├── components/
    │   ├── GlobalHeader.astro
    │   ├── SectionHeading.astro
    │   ├── Hero.astro
    │   ├── Works.astro
    │   ├── WorkCard.astro
    │   ├── ComingSoonCard.astro
    │   ├── WorkDialog.astro
    │   ├── Members.astro
    │   ├── MemberCard.astro
    │   ├── ContactForm.astro
    │   ├── GlobalFooter.astro
    │   └── icons/               # X / Instagram / Mail / Menu / Close のインライン SVG
    ├── layouts/BaseLayout.astro
    ├── pages/index.astro
    ├── scripts/
    │   ├── header.ts            # スクロール時の状態変化
    │   ├── reveal.ts            # フェードイン
    │   ├── work-dialog.ts
    │   └── contact-form.ts
    └── styles/
        ├── tokens.css
        ├── reset.css
        └── global.css           # ボタンなどの共通部品も含む
```

---

## 6. データ設計

### 6.1 `src/config/site.ts`

```ts
export const site = {
  name: "恐竜定食",
  tagline: "ボードゲーム制作サークル",
  description: "ボードゲーム制作サークル「恐竜定食」の公式サイト。最新作『クラッシュ・コンボ・カンフー！』ほか作品情報。",
  url: "https://kyoryuteishoku.ragi.house",
  sns: {
    x: "https://x.com/kyoryuteishoku",
    instagram: "https://www.instagram.com/kyoryuteishoku/",
  },
  emailjs: {
    serviceId: "service_tl2s4dr",
    templateId: "template_90fvelc",
    publicKey: "IHJjlIOiDwkmYdrTk", // 公開前提のキー
  },
  nav: [
    { href: "#works", label: "作品" },
    { href: "#members", label: "メンバー" },
    { href: "#contact", label: "お問い合わせ" },
  ],
} as const;
```

### 6.2 作品（`src/data/works.yaml`）

- 表示順は `order` の昇順で、コンポーネント側でソートする（`getCollection()` の返す順序は保証されないため）
- `featured: true` はちょうど 1 件にする。zod は 1 件ずつしか検証できないので、`src/lib/works.ts`（`getCollection` してソートする関数）で件数を数え、1 件でなければ `throw` してビルドを失敗させる
- 画像パスは **YAML ファイルから見た相対パス**。スキーマでは `image()` で受ける
- スキーマは `status` で分ける判別共用体にする（`coming-soon` で必須なのは `order`・`title`・`catchcopy` だけ）
- `events` は古い順に並べ、`date`（初日、`YYYY-MM-DD`）を持たせる。アイキャッチには最後の要素を出し、`date` がビルド日以降なら「次回出展」、過ぎていれば「頒布」と表示する。`date` がなければ「頒布」とする。`date` のスキーマは `z.coerce.date().nullable()`（YAML は引用符なしの日付を `Date` として読むため）で、比較は日本時間（Asia/Tokyo）の日付で行う。作品カード（§8.3）には最後の要素の `name` だけをラベルなしで出す

```yaml
- id: crash-combo-kungfu
  order: 1
  status: released          # released | coming-soon
  featured: true
  title: クラッシュ・コンボ・カンフー！
  catchcopy: 相手の切り札を見抜き 5カウントの読み合いを制し カードをつなげて華麗なコンボを決め 相手をぶっとばそう！
  description: 刻々と変わる相手の手札を読み合う2人対戦カードゲーム。読み勝ったらカードを次々とつなげてコンボを発動。大きなダメージを狙えますが、つなげるほど手札は減ります。「打撃」「崩し」「カウンター」の3すくみと技の速さで攻防の主導権を奪い合い、相手を打ち倒して勝利を目指します。
  events:
    - { name: ゲームマーケット2026春, booth: P53, date: null }
    - { name: ゲームマーケット2026秋, booth: H069, date: 2026-10-17 }
  price: 2500
  players: { min: 2, max: 2 }
  playTime: { min: 15, max: 20 }
  age: 8
  genres: [対戦, ファンタジー, はったり／ブラフ, 反射神経]
  keyImage: ../assets/works/crash-combo-kungfu/key.png
  gallery:
    - ../assets/works/crash-combo-kungfu/gallery-1.png
    - ../assets/works/crash-combo-kungfu/gallery-2.png
    - ../assets/works/crash-combo-kungfu/playguide-0.png
    - ../assets/works/crash-combo-kungfu/playguide-1.png
  links:
    gameMarket: https://gamemarket.jp/game/189551
    shop: null

- id: igniter
  order: 2
  status: released
  featured: false
  title: IGNITER
  catchcopy: カードを"つなげて"魔法を【発動】！奇跡の魔法を発動して偉大な魔法使いになろう
  description: 最大4人で遊べる対戦ボードゲーム。手札のカードをお互いに交換しながら必要なカードを集め、先に条件を達成したプレイヤーが勝利します。カードをつなげて魔法を発動すると、相手の手札を封じたり自分のデッキを強化したりと、多彩な効果を場に及ぼせます。54枚すべてのカードに魔法の世界をモチーフにしたイラストを描いています。
  events:
    - { name: ゲームマーケット2024秋, booth: B03, date: null }
  price: 2500
  players: { min: 2, max: 4 }
  playTime: { min: 25, max: 45 }
  age: 8
  genres: [対戦, ファンタジー]
  keyImage: ../assets/works/igniter/key.png
  gallery:
    - ../assets/works/igniter/gallery-1.png
    - ../assets/works/igniter/gallery-2.jpg
  links:
    gameMarket: https://gamemarket.jp/game/184475
    shop: null

- id: coming-soon-1
  order: 3
  status: coming-soon
  title: 新作
  catchcopy: 制作中
```

### 6.3 取り込む作品画像

| 保存先（`src/assets/works/`） | 取得元 | 用途 |
| --- | --- | --- |
| `crash-combo-kungfu/key.png` | https://img.gamemarket.jp/20260505_002108_key.png | キービジュアル |
| `crash-combo-kungfu/sns.png` | https://img.gamemarket.jp/20260505_002108_sns-1.png | OGP 画像の元（§9.1） |
| `crash-combo-kungfu/gallery-1.png` | https://i.gyazo.com/b9478ebceb054904b11f1e44cac62929.png | ギャラリー |
| `crash-combo-kungfu/gallery-2.png` | https://i.gyazo.com/2b0def56c8c9d11b29694c93a6c720c0.png | ギャラリー |
| `crash-combo-kungfu/playguide-0.png` | https://img.gamemarket.jp/20260517_165431_playguide00.png | ギャラリー |
| `crash-combo-kungfu/playguide-1.png` | https://img.gamemarket.jp/20260517_165428_playguide01.png | ギャラリー |
| `igniter/key.png` | https://i.gyazo.com/aace94a99ee11268d24cf16cbb436340.png | キービジュアル |
| `igniter/gallery-1.png` | https://i.gyazo.com/a63e4f3287b5e34859ce407dd6eacf42.png | ギャラリー |
| `igniter/gallery-2.jpg` | https://i.gyazo.com/9e890532bfad512013ad4165365e9ad3.jpg | ギャラリー |

取り込んだら実物を見て、キービジュアルにする画像を入れ替える場合は YAML も直す。

### 6.4 メンバー（`src/data/members.yaml`）

並び順は作品と同じく `order` でソートする。

```yaml
- id: asragi
  order: 1
  name: asRagi
  role: ゲームデザイナー
  icon: ../assets/members/asragi.jpg
  links:
    x: https://x.com/asRagi

- id: euraru
  order: 2
  name: euraru
  role: イラストレーター
  icon: ../assets/members/euraru.png
  links:
    x: https://x.com/euraru
    instagram: https://www.instagram.com/euraru_insta/
    email: info@euraru.net
```

旧サイトでは本人がスパム対策で `info&&euraru.net` と崩して表記していたので、その意図を引き継ぐ。HTML にはアドレスをそのまま書かず、ユーザー名とドメインを `data-user` / `data-domain` に分けて出力し、JS で `mailto:` リンクを組み立てる。JS が無効な環境では `<noscript>` で「info [at] euraru.net」と表示する。

---

## 7. デザイン

### 7.1 コンセプト

白を基調にしたミニマルな構成にし、主役は作品のキービジュアル。サイト自体はそれを引き立てる額縁に徹する。情報量を絞り、大きな余白と文字の強弱で整理する。ロゴや「定食」からモチーフは取らない（お品書き風、食券風、和柄、版画風はやらない）。

### 7.2 参考サイト（https://vrc-ai.com/）の扱い

| 取り入れる考え方 | 持ち込まないもの |
| --- | --- |
| 白地に濃色の文字、アクセントは少数という色数の絞り方 | 形が変わり続ける blob や浮遊する球体の背景装飾 |
| 和文・英字とも 1 つのフォントファミリーで統一する | 巨大な漢字を背景に敷いたトップ画面 |
| 本文を小さめにして行間を広く取り、セクション間の余白を大きくする | 傾けて浮かせた写真のコラージュ |
| 下から少し浮かび上がるフェードイン | 横に流れ続けるマーキー |
| JS が無効でも主要な情報と導線が読める作り | 番号付きの目次（01 / 02 / …）、鮮やかな青とミントの配色、LINE Seed JP |
| | スクロールで縮んで影が付くヘッダー、ヘッダー右端の塗りつぶしの CTA ボタン |
| | 参考サイトの CSS の値（色・easing・影）と id / class 名の流用 |

ピル型ヘッダーはオーナーの指定によるもの。挙動の差別化は §8.1。

### 7.3 デザインルール

使わないもの：

- グラデーション、blob、光彩、ノイズテクスチャ、すりガラス（`backdrop-filter`）
- 絵文字や汎用アイコンを並べた特徴カード
- ハードシャドウ、太い枠線、傾けたレイアウト
- ループし続けるアニメーション、1 画面に複数の強い動き

ルール：

- セクションの境界は余白か 1px の罫線（`--color-line`）で示す
- 階層は文字の強弱で作る。和文の大きな見出しに、アクセント色の小さな英字ラベルを添える
- 角丸：ヘッダー・ボタン・タグは `--radius-pill`、画像・カード・ダイアログは `--radius-m`、入力欄は `--radius-s`
- 影はホバー時、スクロール時のヘッダー、ダイアログにだけ使う
- 青（`--color-accent`）の用途：リンク、主ボタン、英字ラベル、フォーカスリング
- オレンジ（`--color-accent-2`）の用途：New / Coming soon のバッジの地、英字ラベル横の小さなドット。文字色には使わず、バッジの文字は `--color-ink` にする
- トークン以外の場所に色や数値を直書きしない

共通部品（`global.css`）：

| クラス | 見た目 |
| --- | --- |
| `.button-primary` | `--color-accent` の地、白文字、`--radius-pill` |
| `.button-secondary` | 白地、1px の `--color-line-strong` の枠、`--color-ink` の文字、`--radius-pill` |
| `.badge` | `--color-accent-2` の地、`--color-ink` の文字、`--radius-pill`、caption サイズ |
| `.visually-hidden` | 画面には出さず、読み上げだけされる |

### 7.4 デザイントークン（`src/styles/tokens.css`）

無彩色はロゴの青（色相およそ 216°）を少し混ぜた青みのグレーにし、アクセントと馴染ませる。

```css
:root {
  /* Color */
  --color-bg: #ffffff;
  --color-surface: #f3f5f9;
  --color-ink: #14213d;
  --color-muted: #5b6b85;
  --color-line: #dde3ec;         /* 装飾の罫線 */
  --color-line-strong: #7d8aa0;  /* 入力欄・副ボタンの枠（白地で 3:1 以上） */
  --color-accent: #2459a8;       /* ロゴの青 */
  --color-accent-hover: #1c4787;
  --color-accent-2: #f29b38;     /* ロゴのオレンジ */
  --color-error: #c43d32;

  /* Typography */
  --font-sans: "M PLUS 2 Variable", system-ui, sans-serif;
  --text-caption: 0.8125rem;
  --text-body: 0.9375rem;
  --text-lead: clamp(1rem, 0.95rem + 0.3vw, 1.125rem);
  --text-h3: clamp(1.125rem, 1rem + 0.6vw, 1.5rem);
  --text-h2: clamp(1.625rem, 1.3rem + 1.4vw, 2.5rem);
  --text-hero: clamp(2.25rem, 1.4rem + 4vw, 4.5rem);
  --leading-body: 1.8;
  --leading-heading: 1.3;
  --tracking-body: 0.02em;
  --tracking-label: 0.12em;

  /* Space */
  --space-2xs: 0.25rem;
  --space-xs: 0.5rem;
  --space-s: 1rem;
  --space-m: 1.5rem;
  --space-l: clamp(2rem, 1.5rem + 2vw, 3.5rem);
  --space-section: clamp(5rem, 3.5rem + 6vw, 10rem);
  --gutter: clamp(1rem, 0.4rem + 3vw, 2.5rem);
  --content-max: 1120px;

  /* Shape */
  --radius-pill: 9999px;
  --radius-m: 16px;
  --radius-s: 10px;
  --shadow-raised: 0 1px 2px rgb(20 33 61 / 0.06), 0 6px 16px rgb(20 33 61 / 0.08);
  --shadow-overlay: 0 2px 6px rgb(20 33 61 / 0.08), 0 24px 48px rgb(20 33 61 / 0.16);

  /* Motion */
  --ease-out: cubic-bezier(0.25, 0.8, 0.25, 1);
  --duration-fast: 0.2s;
  --duration-reveal: 0.7s;

  /* Layout */
  --header-height: 64px;
  --header-offset: 16px;
  --header-block: calc(var(--header-height) + var(--header-offset) * 2); /* ヘッダーが文書内で取る高さ */
}
```

- フォント：`@fontsource-variable/m-plus-2` を `BaseLayout.astro` で import する。ファミリー名は `"M PLUS 2 Variable"`。ウェイトは 400（本文）、500（UI）、700（見出し）の 3 段階に絞り、数字には `font-variant-numeric: tabular-nums` を付ける
- 白地とのコントラスト比（計算値）：ink 15:1 以上、muted 約 5.4:1、accent 約 6.8:1、line-strong 約 3.5:1、accent-2 約 2.2:1（文字には使わない）

### 7.5 スクロール連動のフェードイン

- 対象：セクション見出し、作品の各行、メンバーカード、お問い合わせフォーム
- 動き：`opacity: 0 → 1` と `translateY(16px) → 0`。時間は `--duration-reveal`、easing は `--ease-out`。1 回表示したら戻さない
- 同じグループ内（作品の各行、メンバーカード）は 80ms ずつずらす（`data-reveal-delay`）
- アイキャッチだけは読み込み時に 1 回、テキスト → 画像の順で出す（CSS アニメーション）
- 実装（`src/scripts/reveal.ts`）
  - `<head>` のインラインスクリプトで `<html>` に `js` クラスを付け、非表示の初期状態は `.js [data-reveal]` にだけ当てる。JS が動かない環境では最初から表示され、描画後に一瞬消えるちらつきも防げる
  - IntersectionObserver（`rootMargin: "0px 0px -10% 0px"`）で画面に入った要素に `is-revealed` を付ける

### 7.6 レスポンシブ

- モバイルファーストで書く。ブレークポイントは `48rem`（768px）と `64rem`（1024px）の 2 つだけ
- カード内部のレイアウトは container query で切り替える
- 横スクロールを出さない。`overflow-x: hidden` で隠さず、原因を潰す

---

## 8. ページ仕様

```html
<body>
  <header id="global-header">…</header>
  <main id="main">
    <section id="hero">…</section>
    <section id="works">…</section>
    <section id="members">…</section>
    <section id="contact">…</section>
  </main>
  <footer id="global-footer">…</footer>
  <dialog id="work-dialog">…</dialog>
</body>
```

- id は固定する（アンカーリンクの飛び先であり、オーナーがスタイルを直すときの起点にもなる）
- 各セクションに `scroll-margin-top: var(--header-block)` を設定する
- 見出しの階層：`h1` は 1 つだけで、`.visually-hidden` の「恐竜定食 ボードゲーム制作サークル」を `#hero` の先頭に置く。アイキャッチの作品タイトルと各セクションの見出しは `h2`、作品・メンバー名は `h3`

セクション見出しは `SectionHeading.astro` で共通化する（英字ラベル + `h2` + リード文。ラベルの左にオレンジのドット）。

| id | ラベル | h2 | リード |
| --- | --- | --- | --- |
| `#works` | Works | 作品 | なし |
| `#members` | Members | メンバー | なし |
| `#contact` | Contact | お問い合わせ | 作品やイベントに関するご質問はこちらから。 |

### 8.1 ヘッダー `#global-header`

- `position: sticky; top: var(--header-offset)`、`margin-block: var(--header-offset)`。幅は `min(var(--content-max), 100% - var(--gutter) * 2)` で中央に置く
- 白地、`--radius-pill`、1px の `--color-line` の枠
- スクロールすると（`src/scripts/header.ts` が `data-scrolled` を付ける）、枠が消えて `--shadow-raised` が付く。大きさと位置は変えない
- 左：ロゴアイコン（円形、36px）と「恐竜定食」（700）。`href="#top"` でページ先頭へ戻る
- 右（768px 以上）：ナビ（`site.nav` の 3 項目、テキストリンク）と X・Instagram のアイコン
- 右（768px 未満）：メニューボタン（`aria-label="メニュー"`、`popovertarget="mobile-menu"`）
- `#mobile-menu`（`popover`）
  - 中身：ナビ 3 項目と SNS アイコン
  - 位置：既定では画面中央に出るので、`position: fixed; inset: auto; top: calc(var(--header-offset) + var(--header-height) + var(--space-xs)); left: var(--gutter); right: var(--gutter)` で上書きする
  - リンクを押したら `hidePopover()` で閉じる
- スキップリンク「本文へスキップ」（`href="#main"`）を `#global-header` の先頭、`.header-pill` の外に置く。普段は隠し、フォーカス時だけ画面左上に出す

### 8.2 アイキャッチ `#hero`

- 高さ：`margin-top: calc(var(--header-block) * -1)` でヘッダーの裏まで広げ、`min-height: 100svh` にする。上下に同じ `padding-block: calc(var(--header-block) + var(--space-l))` を取り、中身を画面全体の高さに対して中央に揃える。背景は `--color-bg`
- 中身は `featured: true` の作品
- デスクトップは 2 カラム（テキスト 5 : 画像 7）、モバイルは画像を上にして縦に積む
- テキスト側
  - `.badge`「New Release」と、出展ラベル（§6.2 の規則。例：「頒布 ゲームマーケット2026秋 H069」）
  - タイトル（`h2`、`--text-hero`）
  - キャッチコピー（`--text-lead`、`--color-muted`）
  - メタ情報：人数・時間・年齢・価格を横に並べ、1px の縦罫線で区切る
  - ボタン：`.button-primary`「くわしく見る」（`data-work-id` でダイアログを開く）、`.button-secondary`「ゲームマーケットで見る」。`links.shop` があれば「通販で購入」を primary にし、「くわしく見る」を secondary にする
- 画像側：キービジュアルを `--radius-m` で大きく見せる。装飾はしない。`loading="eager"` と `fetchpriority="high"` を付ける

### 8.3 作品一覧 `#works`

- 背景は `--color-surface`。画像枠の地は `--color-bg` にして背景から浮かせる
- `order` 順に 1 列で並べる。行の間は `--space-l` の余白と 1px の罫線で区切る
- WorkCard（`status: released`）のマークアップ

```html
<article class="work-card">
  <div class="work-card__media"><Image … /></div>
  <div class="work-card__body">
    <p class="work-card__event">ゲームマーケット2026秋</p>
    <h3><button class="work-card__trigger" data-work-id="crash-combo-kungfu">クラッシュ・コンボ・カンフー！</button></h3>
    <p class="work-card__catch">…</p>
    <ul class="work-card__meta">…</ul>
    <span class="work-card__more" aria-hidden="true">詳細を見る →</span>
    <a class="work-card__external" href="https://gamemarket.jp/game/189551">ゲームマーケットで見る</a>
  </div>
</article>
```

- クリックできる範囲は、`.work-card { position: relative }` と `.work-card__trigger::after { content: ""; position: absolute; inset: 0 }` で行全体に広げる（`<button>` の中には見出しや画像を入れられないため）。`.work-card__external` は広げた範囲より手前に出すため `position: relative; z-index: 1` にする。このリンクがあるので、JS が動かなくてもゲームマーケットへ移動できる
- レイアウト：デスクトップは左に画像（16:10）、右にテキスト。モバイルは画像を上にして縦に積む
- ホバー：画像を `scale(1.03)` にし（親の `overflow: hidden` で切り抜く）、「詳細を見る」の矢印を右へ 4px 動かす
- ComingSoonCard（`status: coming-soon`）：画像の位置に `--color-bg` のプレースホルダを置き、中央に `.badge`「Coming soon」を表示する。`title` と `catchcopy` を出す。クリックはできない

### 8.4 作品ダイアログ `#work-dialog`

- 開く：`[data-work-id]` のボタン（WorkCard とアイキャッチの両方）を押すと、`<template id="work-{id}">`（ビルド時に作品ごとに出力）の中身をダイアログに複製して `showModal()` する。JS は `src/scripts/work-dialog.ts` だけ
- 閉じる：閉じるボタン、Esc キー、背景クリック。背景クリックは、中身を `.work-dialog__inner` で包んで dialog 自体の padding を 0 にし、`event.target === dialog` で判定する。閉じるとフォーカスは開いたボタンに戻る（`showModal()` の標準の挙動）
- URL ハッシュ：開いたときに `#work=igniter` を付け、閉じたら消す。どちらも `history.replaceState()` で行う（`location.hash` を使うと、消したときに先頭へスクロールし、履歴も積み上がるため）。読み込み時にハッシュがあればその作品を開く
- 背景のスクロールは `html:has(dialog[open]) { overflow: hidden }` で止める
- 開閉のトランジション：`opacity` と `translateY(12px)` を `--duration-fast` で動かす。`@starting-style` と `transition-behavior: allow-discrete`（`display`、`overlay`）を使う
- 見た目：白地、`--radius-m`、`--shadow-overlay`。暗幕（`::backdrop`）は `rgb(20 33 61 / 0.5)`。モバイルは下から出るシート風（幅いっぱい、上だけ角丸）、デスクトップは中央に最大幅 760px
- 中身：ギャラリー（`keyImage` と `gallery`。横スクロール + `scroll-snap`）、タイトル、紹介文、メタ情報（`<dl>`）、ジャンル（`--color-surface` 地のピル）、出展イベント、リンクボタン
- `links.shop` が `null` のときは「通販準備中」を無効状態のボタンとして表示する

### 8.5 メンバー `#members`

- MemberCard：円形アイコン（88px）、名前（`h3`）、役割（`--color-muted`）、SNS とメールのアイコンリンク（ホバーで `--color-accent`）
- カードは `--color-surface` の地、`--radius-m`、影なし
- 768px 以上は `grid-template-columns: repeat(2, minmax(0, 1fr))` で 2 列、未満は 1 列

### 8.6 お問い合わせ `#contact`

- フォームは最大幅 640px で中央に置く
- 項目：お名前（必須、最大 50 文字）、メールアドレス（必須、`type="email"`）、本文（必須、最大 2000 文字）。送信ボタンは `.button-primary`
- 入力欄：白地、1px の `--color-line-strong` の枠、`--radius-s`。フォーカス時は枠を `--color-accent` にし、外側に薄いリングを付ける
- ハニーポット（画面に出さない入力欄。値が入っていたら送信しない）でスパムを防ぐ
- バリデーションはブラウザ標準の Constraint Validation API を使う。エラーは各項目の下に出して `aria-describedby` で紐づけ、送信時に最初のエラー項目へフォーカスする
- 送信中はボタンを無効にして「送信中…」と表示する。成功したらフォームを完了メッセージに置き換える。失敗したらエラーを表示し、再送できる状態に戻す
- 送信（`src/scripts/contact-form.ts`）

```ts
import { send } from "@emailjs/browser";

await send(site.emailjs.serviceId, site.emailjs.templateId, {
  from_name: name,   // テンプレート側の変数名なので変えない
  email,
  message,
}, { publicKey: site.emailjs.publicKey });
```

- EmailJS のダッシュボードで許可ドメインを制限する（Phase 6）

### 8.7 フッター `#global-footer`

- 上に 1px の罫線。背景は白
- 左：ロゴアイコン、「恐竜定食」、`site.tagline`
- 右：ナビと SNS のアイコン
- 最下段：`© 2023–{ビルド時の年} 恐竜定食`（caption、`--color-muted`）
- モバイルは縦に積む

---

## 9. 共通要件

### 9.1 メタ情報

- `<html lang="ja">`
- `title`：`恐竜定食 | ボードゲーム制作サークル`。`description`：`site.description`
- canonical：Astro は自動で出力しないので、`BaseLayout.astro` に `new URL(Astro.url.pathname, Astro.site)` で書く。`astro.config.mjs` に `site: "https://kyoryuteishoku.ragi.house"` を設定する
- OGP：`og:image` は絶対 URL で出す。画像は `crash-combo-kungfu/sns.png` を 1200×630 に加工して `public/og.png` にする。`twitter:card` は `summary_large_image`
- ファビコン：`logo.png` から `favicon.ico`（32px）と `apple-touch-icon.png`（180px）を作る。ベクター版のロゴは無いので SVG のファビコンは作らない
- sitemap は入れない（1 ページだけのため）

### 9.2 アクセシビリティ

- コントラスト比：文字は 4.5:1 以上、入力欄の枠などの UI 部品は 3:1 以上
- 画像にはすべて `alt` を付け、装飾画像は `alt=""` にする
- フォーカスリングを消さない。`:focus-visible` で `--color-accent` の 2px アウトラインを `outline-offset: 2px` で付ける（主ボタンの地と同化しないように）
- `prefers-reduced-motion: reduce` のときは、フェードイン、アイキャッチのアニメーション、ホバーの動き、ダイアログとヘッダーのトランジション、スムーススクロールをすべて止める
- キーボードだけですべての操作ができること

### 9.3 パフォーマンス

- Lighthouse（モバイル）の目標：Performance 95 以上、Accessibility 100、Best Practices 100、SEO 100
- 初回表示の JS は数 KB 程度に収める
- 画像はすべて `astro:assets` で読み込み、サイズを指定して CLS を防ぐ

---

## 10. CI / デプロイ

- `.github/workflows/deploy.yml`
  - トリガー：`main` への push、`workflow_dispatch`、`schedule`（`cron: "0 15 * * *"`、日本時間 0 時に毎日。イベントが終わったら出展ラベルが自動で切り替わるようにするため）。公開リポジトリでは 60 日間動きがないと `schedule` が自動で無効になるので、無効化の通知が届いたら Actions 画面で再び有効にする
  - `permissions`：`contents: read`、`pages: write`、`id-token: write`
  - build ジョブ：`withastro/action`（`node-version: 24` を明示的に渡す。pnpm は自動で検出される）
  - deploy ジョブ：`actions/deploy-pages`
- ドメインは `kyoryuteishoku.ragi.house`（旧ドメイン `kyoryuteishoku.com` は手放した。リダイレクトは用意しない）
- 独自ドメインは、リポジトリの Settings → Pages の Custom domain で管理する。Actions でデプロイする場合、CNAME ファイルは使われない。`public/CNAME`（中身は `kyoryuteishoku.ragi.house`）は手動デプロイなどに備えて置いておくだけ
- 切り替え手順（オーナー作業）
  1. ragi.house の DNS に `kyoryuteishoku` の CNAME レコードを追加し、`asragi.github.io` に向ける
  2. GitHub のアカウント設定 → Pages で `ragi.house` をドメイン検証する（他人にサブドメインを乗っ取られるのを防ぐため。未検証なら推奨）
  3. リポジトリの Settings → Pages の Custom domain を `kyoryuteishoku.ragi.house` に変更し、DNS チェックが通ったら Enforce HTTPS を有効にする
- PR で `pnpm astro check`、`pnpm lint`、`pnpm build` を実行するワークフローを追加する

---

## 11. 作業手順

`renewal` ブランチで作業し、完成したら `main` にマージする。

### Phase 0：準備

- [ ] 未コミットの変更（`src/components/oneLineNews.tsx`、`src/utils/sendMail.ts`）をコミットするか破棄するかを決める
- [ ] `renewal` ブランチを作る

### Phase 1：土台

- [ ] §3 の削除対象を消し、`.gitignore` を作り直す
- [ ] 一時ディレクトリで `pnpm create astro@latest`（minimal、TypeScript strict）を実行し、出来たファイルをリポジトリに移す（空でないディレクトリには展開できないため）
- [ ] `packageManager`、`engines`、`.nvmrc` を設定する。`pnpm-workspace.yaml` の `onlyBuiltDependencies` で sharp と esbuild のビルドを許可する
- [ ] `@astrojs/check`、`typescript`、ESLint、Prettier を設定する（§4）
- [ ] `astro.config.mjs` に `site` を設定する
- [ ] `pnpm dev` と `pnpm build` が通ることを確認する

### Phase 2：データとアセット

- [ ] §6.3 の画像と、ロゴ・メンバーのアイコンを `src/assets/` に置く
- [ ] `site.ts`、`content.config.ts`、`works.yaml`、`members.yaml` を作る（§6）
- [ ] `featured` が 1 件でないとビルドが失敗することを確認する
- [ ] `astro check` と `astro build` が通ることを確認する

### Phase 3：マークアップ

- [ ] `BaseLayout.astro`（§9.1、フォント、`js` クラスを付けるインラインスクリプト）
- [ ] §8 の各コンポーネントを、スタイルなしのマークアップで作る
- [ ] オーナーに構造と id / class 名を確認してもらう

### Phase 4：スタイル

- [ ] `tokens.css`、`reset.css`、`global.css`（§7.3、§7.4）
- [ ] §8.1〜§8.7 の各セクション
- [ ] §7.6 のブレークポイントと 360 / 390 / 768 / 1024 / 1280 / 1440px で崩れがないか確認する

### Phase 5：インタラクション

- [ ] ヘッダーのスクロール時の変化とモバイルメニュー（§8.1）
- [ ] 作品ダイアログ（§8.4）
- [ ] お問い合わせフォーム（§8.6）
- [ ] フェードイン（§7.5）
- [ ] `prefers-reduced-motion` への対応（§9.2）

### Phase 6：仕上げと公開

- [ ] OGP 画像とファビコンを作る（§9.1）
- [ ] §10 のワークフローを作る
- [ ] README を更新する（開発手順、作品・メンバーの更新方法、`schedule` が無効になったときの再有効化の手順）
- [ ] 実機（iOS Safari / Android Chrome）で確認する
- [ ] §12 をすべて確認してから `main` にマージする
- [ ] EmailJS の許可ドメインを `kyoryuteishoku.ragi.house` と `localhost` に設定する（オーナー）
- [ ] §10 のドメイン切り替え手順を行う（オーナー）
- [ ] 本番でフォーム送信と、`https://kyoryuteishoku.ragi.house` で表示されることを確認する

### Phase 7：オーナーによるデザイン調整

- [ ] トークンと各セクションの細部を調整する

---

## 12. 受け入れ基準

- [ ] §8 の順にセクションが並び、ヘッダーはピル型で、左にロゴと「恐竜定食」があり、スクロールしても追従する
- [ ] モバイルメニューが開閉でき、リンクを押すと閉じて該当セクションへ移動する
- [ ] アイキャッチが 1 画面分の高さで、`featured` の作品を表示している
- [ ] 作品が `order` 順に 3 点並び、3 点目は Coming soon になっている
- [ ] 作品カードとアイキャッチのボタンからダイアログが開く。Esc キー・背景クリック・閉じるボタンで閉じ、`#work={id}` の URL で直接開ける
- [ ] お問い合わせフォームから送信すると、名前・メールアドレス・本文が入ったメールが EmailJS 経由で届く
- [ ] YAML に作品やメンバーを追加・変更すると、ビルド後の表示に反映される
- [ ] 360〜1440px で横スクロールやレイアウト崩れがない
- [ ] JS を無効にしても全セクションと、各作品の基本情報・ゲームマーケットへのリンクが表示される（ダイアログとフォーム送信は JS が必要）
- [ ] キーボードだけで全操作でき、`prefers-reduced-motion` で動きが止まる
- [ ] Lighthouse の目標（§9.3）を満たす
- [ ] `main` への push で `kyoryuteishoku.ragi.house` にデプロイされる
- [ ] Next.js / React / Sass / react-scroll / yarn への依存が残っていない

---

## 13. 未確定事項

| # | 内容 | 状態 |
| --- | --- | --- |
| 1 | 通販ページの URL | 準備中。決まるまでは `links.shop: null` のままにし、「通販準備中」と表示する |
| 2 | 制作中の新作の情報 | 公開しない。§6.2 の Coming soon のまま表示する |
