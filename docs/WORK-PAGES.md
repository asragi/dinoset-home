# 作品ページ追加 仕様書

最終更新: 2026-11-20

作品ダイアログ（`docs/RENEWAL.md` §8.4）をやめ、作品ごとに個別ページ `/works/{id}/` を作るための仕様書兼チェックリスト。`docs/RENEWAL.md` は書き換えない。食い違う箇所はこの文書を優先する（§13）。

---

## 1. 目的

- 作品の魅力を、ダイアログの幅と高さに縛られずに伝える。主役はキービジュアルで、説明文と画像を交互に読み進められる縦長のページにする
- 作品ごとの URL を持たせ、SNS でシェアしたときに作品の OGP 画像が出るようにする
- 画像は後から足せるようにする。画像のないセクションは文章だけで成立させる

---

## 2. オーナーとの合意事項

| 項目 | 内容 |
| --- | --- |
| ページ | 公開済みの作品ごとに `/works/{id}/` を作る。Coming soon の作品にはページを作らない |
| ダイアログ | 廃止する。トップの「くわしく見る」と作品カードは個別ページへの通常のリンクにする |
| データ | `src/data/works.yaml` をやめ、作品ごとの Markdown（`src/content/works/{id}.md`）にする。今の YAML の項目は frontmatter、魅力・遊び方は本文に書く |
| 1 画面目 | PC は左にキービジュアル（画面の高さいっぱい）、右にタイトル・メタ情報・ボタン。トップのアイキャッチとは左右が逆 |
| 本文の画像 | `##` 見出しごとに 1 セクション。画像の枚数でレイアウトを自動で切り替える（§5.2） |
| 色 | 作品ごとにアクセント色を 1 つ指定できる。地は白のまま |
| OGP | 作品ごとの OGP 画像をビルド時に自動で作る。frontmatter で専用の画像を指定したら、そちらを優先する |
| 画面遷移 | CSS の View Transitions で、ページ全体をクロスフェードで切り替える。画像をつなぐ演出はしない。非対応ブラウザでは普通のページ移動になる |
| 本文の初期内容 | AI が仮で書く。今の `description` と画像に書かれている内容だけを使い、事実は足さない。公開前にオーナーが直す |

---

## 3. 変更するファイル

```
追加
  docs/WORK-PAGES.md                        # この文書
  src/content/works/crash-combo-kungfu.md
  src/content/works/igniter.md
  src/content/works/coming-soon-1.md
  src/pages/works/[id]/index.astro          # 作品ページ（§6）
  src/pages/works/[id]/og.png.ts            # OGP 画像（§8）
  src/components/WorkHero.astro             # 作品ページの 1 画面目
  src/components/WorkInfo.astro             # ゲーム情報と出展イベント
  src/components/OtherWorks.astro           # ほかの作品
  src/lib/rehype-work-sections.ts           # 本文をセクションに分ける（§5.2）
  src/lib/color.ts                          # アクセント色のコントラスト検証（§6.6）

変更
  package.json                              # @astrojs/markdown-remark と sharp を dependencies に足す（§5.2、§8）
  astro.config.mjs                          # Markdown 処理系を unified に切り替え、rehype プラグインを登録（§5.2）
  src/content.config.ts                     # glob loader とスキーマ（§4）
  src/lib/works.ts                          # ページ用の関数を足す
  src/config/site.ts                        # nav の href を "/#works" 形式に（§7.3）
  src/layouts/BaseLayout.astro              # title / description / OGP / アクセント色を props で受ける
  src/components/Brand.astro                # ロゴのリンク先を "/#top" に（§7.3）
  src/components/Hero.astro                 # 「くわしく見る」をリンクに
  src/components/WorkCard.astro             # トリガーをボタンからリンクに
  src/pages/index.astro                     # ダイアログを外し、旧 URL を転送（§10）
  src/styles/global.css                     # dialog 用のスタイルを消し、@view-transition を足す
  src/styles/tokens.css                     # dialog・gallery 用のトークンを消し、作品ページ用を足す
  README.md                                 # 「作品の更新」の節を書き換える

削除
  src/data/works.yaml
  src/components/WorkDialog.astro
  src/components/icons/Close.astro          # WorkDialog でしか使っていない
  src/scripts/work-dialog.ts
```

---

## 4. データ

### 4.1 コレクション

- `glob({ pattern: "*.md", base: "src/content/works" })` で読む。`id` はファイル名（拡張子なし）
- スキーマは今と同じく `status` の判別共用体にする。`released` から `gallery` を消し、`accent` と `ogImage` を足す
- 画像パスは **Markdown ファイルから見た相対パス**（例：`../../assets/works/igniter/key.jpg`）
- `order` のソートと `featured` がちょうど 1 件であることの検証は、今どおり `src/lib/works.ts` で行う

```ts
z.object({
  ...common,
  status: z.literal("released"),
  featured: z.boolean().default(false),
  description: z.string().min(1),       // リード文、meta description、作品カードには出さない
  events: …,                            // 今と同じ
  price: …, players: …, playTime: …, age: …, genres: …,
  keyImage: image(),
  accent: z.string().regex(/^#[0-9a-f]{6}$/i),
  ogImage: image().optional(),          // 1200×630 の専用画像。なければ自動生成（§8）
  links: …,                             // 今と同じ
})
```

- `coming-soon` は今と同じ（`order`・`title`・`catchcopy` だけ）。本文は書かない

### 4.2 ファイルの例

```md
---
order: 1
status: released
featured: true
title: クラッシュ・コンボ・カンフー！
catchcopy: 相手の切り札を見抜き 5カウントの読み合いを制し カードをつなげて華麗なコンボを決め 相手をぶっとばそう！
description: 刻々と変わる相手の手札を読み合う2人対戦カードゲーム。…
events:
  - { name: ゲームマーケット2026春, booth: P53, date: null }
  - { name: ゲームマーケット2026秋, booth: H069, date: 2026-10-17 }
price: 2500
players: { min: 2, max: 2 }
playTime: { min: 15, max: 20 }
age: 8
genres: [対戦, ファンタジー, はったり／ブラフ, 反射神経]
keyImage: ../../assets/works/crash-combo-kungfu/key.png
accent: "#……"
links:
  gameMarket: https://gamemarket.jp/game/189551
  shop: null
---

## 5カウントの読み合いを制して、コンボをつなげる

刻々と変わる相手の手札を読み合い、…

![5カウントの読み合いとコンボの流れを示した紹介画像](../../assets/works/crash-combo-kungfu/sns.png)

## 遊び方

![説明書 1ページ目](../../assets/works/crash-combo-kungfu/playguide-0.png)
![説明書 2ページ目](../../assets/works/crash-combo-kungfu/playguide-1.png)
```

### 4.3 今ある画像の割り当て（仮）

見出しの文言は仮。アクセント色はキービジュアルから選び、§6.6 の検証を通す値にする。

| 作品 | セクション | 画像 |
| --- | --- | --- |
| クラッシュ・コンボ・カンフー！ | 読み合いとコンボ | `sns.png`（1 枚） |
| | 「打撃」「崩し」「カウンター」の 3 すくみ | なし |
| | 極奥義 | `gallery-1.png`、`gallery-2.png`（2 枚） |
| | 遊び方 | `playguide-0.png`、`playguide-1.png`（2 枚） |
| IGNITER | カードを交換して集め、つなげて魔法を発動する | `gallery-2.jpg`（1 枚） |
| | 54 枚すべてにイラスト | `gallery-1.png`（1 枚） |

`crash-combo-kungfu/sns.png` は `public/og.png`（サイト共通の OGP）の元画像としても使い続ける。

---

## 5. 本文の書き方と変換

### 5.1 書き方（README にも書く）

- 本文は `##` から始める。`#` は使わない（ページの `h1` は作品名）。`###` はセクション内の小見出しとして使ってよい
- 画像は、1 行に 1 枚ずつ、前後を空けずに並べた段落にする。`alt` は必須
- 本文が空でもよい。その場合はリード文の次にゲーム情報が来る

### 5.2 `src/lib/rehype-work-sections.ts`

rehype プラグイン。Astro 7 の標準の Markdown 処理系（Satteri）は rehype プラグインを動かせないので、`@astrojs/markdown-remark` を `dependencies` に足し、処理系を unified に切り替えて登録する。Markdown を使うのは作品コレクションだけなので、全体に登録してよい。

```js
import { unified } from "@astrojs/markdown-remark";
import { rehypeWorkSections } from "./src/lib/rehype-work-sections";

export default defineConfig({
  // …
  markdown: {
    processor: unified({ rehypePlugins: [rehypeWorkSections] }),
  },
});
```

1. `h2` から次の `h2` の直前までを `<section class="work-section">` で包む
2. セクション内で、画像だけからなる段落を `<div class="work-section__media">` に移し、画像を 1 枚ずつ `<figure>` で包む。それ以外は `<div class="work-section__text">` に入れる。画像は本文中の位置に関係なくセクションの末尾にまとまる
3. 画像の枚数で `data-media` を付ける：`none`（0 枚）、`single`（1 枚）、`multiple`（2 枚以上）
4. `data-media="single"` のセクションに、出てきた順で `data-side="end"`、`"start"`、`"end"`、… を交互に付ける（画像を置く側）
5. 各セクションに `data-reveal` を付ける（§7.5 のフェードイン）
6. 次の場合はビルドを失敗させる：最初の `h2` より前に内容がある、`h1` がある、`alt` が空の画像がある

unified の処理系では、利用者の rehype プラグインが Astro の画像最適化（`rehype-images`）より前に動き、`rehype-images` はツリー全体の `img` を探して差し替える。そのため、このプラグインで `img` ノードを別の要素の中へ移しても最適化は効く。`img` に付けた `loading` などの属性も引き継がれる。

---

## 6. 作品ページ `/works/{id}/`

### 6.1 構成

```html
<body>
  <header id="global-header">…</header>
  <main id="main">
    <section id="work-hero">…</section>     <!-- §6.2 -->
    <section id="work-intro">…</section>    <!-- §6.3 リード文 -->
    <div id="work-body">…</div>             <!-- §6.4 本文のセクション -->
    <section id="work-info">…</section>     <!-- §6.5 ゲーム情報・出展イベント -->
    <section id="other-works">…</section>   <!-- §6.7 -->
  </main>
  <footer id="global-footer">…</footer>
</body>
```

- 見出し：作品名が `h1`。本文の `##`、「ゲーム情報」「ほかの作品」が `h2`
- `getStaticPaths` は `status: "released"` の作品だけを返す

### 6.2 1 画面目 `#work-hero`（`WorkHero.astro`）

- 高さと位置はトップのアイキャッチ（RENEWAL §8.2）と同じ：`margin-top: calc(var(--header-block) * -1)`、`min-height: 100svh`、上下に `calc(var(--header-block) + var(--space-l))` の padding
- PC（48rem 以上）：2 カラム（キービジュアル 7 : テキスト 5）。左にキービジュアル、右にテキスト。キービジュアルは `max-height: var(--work-hero-art-height)`（`calc(100svh - var(--header-block) * 2 - var(--space-l) * 2)`）と `max-width: 100%`（左カラムの幅）の両方に収まるよう、縦横比を保って縮める。縦長の画面ではカラムの幅で決まり、画面の高さいっぱいにはならない
- モバイル：キービジュアルを上にして縦に積む。幅はコンテナいっぱい、高さの上限は `80svh`
- テキスト側（上から）
  - 出展ラベル（トップのアイキャッチと同じ規則。例：「頒布 ゲームマーケット2026秋 H069」）
  - 作品名（`h1`、`--text-hero`）
  - キャッチコピー（`--text-lead`、`--color-muted`）
  - メタ情報（`.game-meta`）
  - ボタン：`links.shop` があれば `.button-primary`「通販で購入」と `.button-secondary`「ゲームマーケットで見る」。なければ「ゲームマーケットで見る」を primary にする
- キービジュアルは `--radius-m`、装飾なし。`loading="eager"`、`fetchpriority="high"`
- `New Release` のバッジは出さない

### 6.3 リード文 `#work-intro`

- `description` を `--text-lead` で出す。最大幅は `--work-text-width`（40em）で左寄せ

### 6.4 本文 `#work-body`

§5.2 で組んだセクションを `render()` の `<Content />` で出す。スタイルは `src/pages/works/[id]/index.astro` の `:global()` で当てる。

| `data-media` | PC（48rem 以上） | モバイル |
| --- | --- | --- |
| `none` | 文章だけ。最大幅 `--work-text-width` | 同左 |
| `single` | 文章と画像を 5 : 7 の 2 カラム。`data-side` が `end` なら画像を右、`start` なら左 | 文章 → 画像の順に縦に積む |
| `multiple` | 文章の下に画像を縦に並べる。画像の幅は最大 `--work-media-max`（880px） | 同左（幅いっぱい） |

- セクション間は `--space-section`、セクション内の文章と画像の間は `--space-l`
- 本文の `h2` は `--text-h2`。英字ラベルは付けない
- 画像は `--radius-m`、影なし。`loading="lazy"`
- 画像は Astro 標準の Markdown 画像の最適化（WebP、1 サイズ）を使う。重くなりすぎないよう、本文用の画像は長辺 2400px 以下で置く（README に書く）

### 6.5 ゲーム情報 `#work-info`（`WorkInfo.astro`）

- `SectionHeading`（ラベル `Info`、`h2`「ゲーム情報」）
- メタ情報を `<dl>` で（`metaItems()`）。続けてジャンルのピル
- 出展イベント（`h3`）：新しい順に「イベント名 ブース番号」。日付があれば併記
- リンク：「ゲームマーケットで見る」。`links.shop` があれば「通販で購入」、`null` なら無効状態の「通販準備中」
- ダイアログにあった中身（RENEWAL §8.4 の「中身」）のうち、ギャラリー以外をここに移す形になる

### 6.6 アクセント色

- `BaseLayout` の `accent` prop で受け、`<html>` の `style` に `--color-accent: {accent}` と `--color-accent-hover: color-mix(in oklab, {accent}, black 18%)` を出す。ヘッダーやフッターのリンク、フォーカスリングもその色になる
- トップページでは渡さない（サイト共通の青のまま）
- `src/lib/color.ts` で白地とのコントラスト比を計算し、4.5:1 未満なら `getStaticPaths` でビルドを失敗させる（主ボタンの白文字と、本文中のリンクの両方に使うため）
- オレンジ（`--color-accent-2`）は作品ごとに変えない

### 6.7 ほかの作品 `#other-works`（`OtherWorks.astro`）

- `SectionHeading`（ラベル `More works`、`h2`「ほかの作品」）
- 自分以外の公開済み作品を `order` 順に、小さなカード（キービジュアルの縮小 + 作品名 + キャッチコピー）で並べる。カード全体が `/works/{id}/` へのリンク
- 該当する作品がなければセクションごと出さない
- 最後に「作品一覧へ戻る」（`/#works`）のテキストリンク

### 6.8 メタ情報

| 項目 | 値 |
| --- | --- |
| `title` | `{作品名} | 恐竜定食` |
| `description` | `description` |
| canonical | `https://kyoryuteishoku.ragi.house/works/{id}/` |
| `og:title` | `title` と同じ |
| `og:image` | `/works/{id}/og.png`（§8）の絶対 URL。1200×630 |
| `og:image:alt` | 作品名 |

`BaseLayout` の props を `title`・`description`・`ogImage`・`ogImageAlt`・`accent`（省略可）にし、トップページは今の値を渡す。

---

## 7. トップページの変更

### 7.1 アイキャッチ（`Hero.astro`）

- 「くわしく見る」を `<a href="/works/{id}/">` にする。`js-only` を外す。並び順と primary / secondary の規則は今のまま
- リンク名が「くわしく見る」だけにならないよう、`.visually-hidden` で作品名を足す

### 7.2 作品カード（`WorkCard.astro`）

- `h3` の中の `<button class="work-card__trigger" data-work-id>` を `<a class="work-card__link" href="/works/{id}/">` に変える。`::after` で行全体をクリック範囲にする仕組みは今のまま
- 「詳細を見る →」の `js-only` を外す。JS なしでの見た目を変えていた `html:not(.js) .work-card__trigger` のルールを消す

### 7.3 ヘッダー・フッター

作品ページでも同じヘッダーとフッターを使うため、リンクをトップページ基準の絶対パスにする。

- `site.nav` の `href` を `/#works`、`/#members`、`/#contact` にする。トップページではページ内の移動になる
- ロゴのリンクを `/#top` にする

### 7.4 ダイアログの撤去

- `index.astro` から `<WorkDialog>` を外し、§3 の削除対象を消す
- `global.css` の `html:has(dialog[open])`、`tokens.css` の `--dialog-width`・`--dialog-max-height`・`--dialog-distance`・`--gallery-height` を消す

### 7.5 フェードイン

`reveal.ts` を作品ページでも読み込む（`BaseLayout` で読んでいるので変更なし）。対象は本文の各セクション、`#work-info`、`#other-works` の各カード（80ms ずつずらす）。`#work-hero` はトップのアイキャッチと同じく、読み込み時に 1 回だけ テキスト → 画像 の順で出す。

---

## 8. OGP 画像

- `src/pages/works/[id]/og.png.ts`：静的エンドポイント。`getStaticPaths` は作品ページと同じ
- `ogImage` があれば、それを 1200×630 の PNG にして返す（`fit: "cover"`）
- なければ sharp で合成する：1200×630 の `--color-surface`（`#f3f5f9`）の地の中央に、キービジュアルを高さ 630px に合わせて置く
- 元画像の読み方：`ImageMetadata` の `src` は配信用の URL で、ファイルパスは公開 API から取れない。そこで `import.meta.glob("/src/assets/works/**/*.{png,jpg,jpeg,webp}", { eager: true, import: "default" })` でファイルパスと `ImageMetadata` の対応表を作り、`src` が一致するファイルを `fs.readFile` で読む。glob のキー（`/src/assets/works/…`）はプロジェクトルートからのパスなので、先頭の `/` を外して `process.cwd()`（ビルド時のプロジェクトルート）から絶対パスに解決してから渡す。見つからなければビルドを失敗させる
- そのため、`keyImage` と `ogImage` は `src/assets/works/` の下に置く（README に書く）
- `sharp` は Astro が依存として持っているが、直接 import するので `dependencies` に足す

---

## 9. 画面遷移（View Transitions）

`global.css` に次を足す。ページを移るときに、ブラウザ標準のクロスフェードで切り替わる。JS は使わない。

```css
@media (prefers-reduced-motion: no-preference) {
  @view-transition {
    navigation: auto;
  }
}
```

- 要素に `view-transition-name` は付けない（作品カードの画像をキービジュアルへつなぐ演出はしない）
- `prefers-reduced-motion: reduce` では遷移しない
- 非対応のブラウザでは普通のページ移動になる

---

## 10. 旧 URL（`/#work={id}`）の転送

README で `/#work=igniter` を共有用に案内していたので、転送を残す。

- `index.astro` の `<head>`（`BaseLayout` に `head` スロットを足す）に `is:inline` のスクリプトを置く
- `location.hash` が `#work={id}` で、`id` が公開済み作品の id なら、`location.replace("/works/{id}/")` する。id の一覧はビルド時に埋め込む（`define:vars`）
- デコードに失敗したときや、知らない id のときは何もしない
- JS が無効な環境では転送されない（トップページが表示される）

---

## 11. 共通要件への影響

- JS が無効でも、作品ページへの移動と作品ページの全情報が見られる（ダイアログがなくなるため、RENEWAL §12 の「ダイアログは JS が必要」の例外は不要になる）
- アクセシビリティ・パフォーマンスの目標は RENEWAL §9.2・§9.3 と同じ。作品ページも Lighthouse の目標を満たす
- 作品ページの初回表示の JS は、ヘッダーとフェードインのスクリプトだけ
- レスポンシブの確認幅は RENEWAL §7.6 と同じ（360 / 390 / 768 / 1024 / 1280 / 1440px）

---

## 12. 作業手順

`work-pages` ブランチで作業し、PR で `main` にマージする。

### Step 1：データの移行

- [ ] `src/content/works/*.md` を作り、`works.yaml` の内容を frontmatter に移す（画像パスを書き換える）。ダイアログが Step 3 まで残るので、`gallery` はこの時点では残す
- [ ] `content.config.ts` を glob loader に変え、`accent` と `ogImage` を足す（`gallery` はまだ消さない）
- [ ] `works.yaml` を消す
- [ ] `astro check` と `astro build` が通り、トップページの表示が変わらないことを確認する

### Step 2：作品ページ

- [ ] `@astrojs/markdown-remark` を足し、処理系を unified に切り替える（§5.2）
- [ ] `rehype-work-sections.ts`（§5.2）。失敗させる条件 3 つでビルドが失敗することを確認する
- [ ] `BaseLayout` の props と `head` スロット（§6.8、§10）
- [ ] `src/pages/works/[id]/index.astro`、`WorkHero`、`WorkInfo`、`OtherWorks`（§6）
- [ ] アクセント色と、コントラストの検証（§6.6）
- [ ] 本文の初期内容を書く（§4.3。事実を足さない）

### Step 3：トップページとダイアログの撤去

- [ ] `Hero`・`WorkCard`・`site.nav`・`Brand` の変更（§7.1〜§7.3）
- [ ] ダイアログ関連を消す（§7.4）。あわせてスキーマと frontmatter から `gallery` を消す
- [ ] 旧 URL の転送（§10）

### Step 4：OGP と画面遷移

- [ ] OGP 画像のエンドポイント（§8）。`ogImage` あり・なしの両方で、`astro build` の出力に 1200×630 の PNG ができることを確認する
- [ ] View Transitions（§9）。Chrome と Safari でページがクロスフェードで切り替わり、`prefers-reduced-motion: reduce` では切り替わりの動きがないことを確認する

### Step 5：仕上げ

- [ ] README の「作品の更新」を書き換える（Markdown の置き場所、本文の書き方 §5.1、画像の大きさ、アクセント色、共有 URL が `/works/{id}/` になったこと、OGP が自動で作られること）
- [ ] §14 をすべて確認する

---

## 13. `docs/RENEWAL.md` との差分

RENEWAL.md は書き換えず、次の箇所はこの文書で置き換える。

| RENEWAL.md | 置き換え先 |
| --- | --- |
| §1 スコープ外「作品ごとの個別ページ」 | スコープに入る |
| §2 作品「クリックで同じページ内にダイアログを開き」 | 個別ページへ移動する（§2） |
| §5 ディレクトリ構成の `data/works.yaml`、`WorkDialog.astro`、`work-dialog.ts` | §3 |
| §6.2 作品（`works.yaml`） | §4 |
| §8 ページ仕様の `<dialog id="work-dialog">` | なくなる |
| §8.1 ナビとロゴのリンク先 | §7.3 |
| §8.2 「くわしく見る」（`data-work-id` でダイアログ） | §7.1 |
| §8.3 WorkCard のマークアップ（`button`） | §7.2 |
| §8.4 作品ダイアログ | 廃止。中身は §6.5 へ |
| §9.1 sitemap は入れない（1 ページだけのため） | 今回も入れない（§15） |
| §12 ダイアログの受け入れ基準 | §14 |

---

## 14. 受け入れ基準

- [ ] 公開済みの作品ごとに `/works/{id}/` が生成され、Coming soon の作品のページはない
- [ ] トップのアイキャッチの「くわしく見る」と作品カードから作品ページへ移動できる（JS 無効でも）
- [ ] 作品ページの 1 画面目が、PC では左にキービジュアル・右にテキスト、モバイルではキービジュアルが上になっている
- [ ] 本文のセクションが、画像 0 枚・1 枚・2 枚以上でそれぞれ §6.4 のレイアウトになり、1 枚のセクションは左右が交互になる
- [ ] Markdown に画像を 1 行足すだけで、ビルド後のレイアウトに反映される
- [ ] 作品ごとのアクセント色がボタン・リンクに使われ、コントラストが 4.5:1 未満の色を指定するとビルドが失敗する
- [ ] 作品ページの URL を X に貼ると、その作品の OGP 画像とタイトルが出る
- [ ] `/#work=igniter` を開くと `/works/igniter/` に移動する
- [ ] 対応ブラウザでは、ページ移動がクロスフェードになる。`prefers-reduced-motion: reduce` では切り替えの動きがない
- [ ] ヘッダー・フッターのナビが、作品ページからトップの各セクションへ移動できる
- [ ] ダイアログ関連のファイル・スタイル・トークンが残っていない
- [ ] 作品ページも 360〜1440px で崩れがなく、キーボードだけで操作でき、Lighthouse の目標（RENEWAL §9.3）を満たす
- [ ] `pnpm astro check`、`pnpm lint`、`pnpm build` が通る

---

## 15. スコープ外・未確定事項

| # | 内容 | 状態 |
| --- | --- | --- |
| 1 | クラッシュ・コンボ・カンフー！のキービジュアルの高解像度版 | 今の `key.png` は 633×839px で、作品ページで大きく出すと粗い。長辺 2000px 以上の版をオーナーが用意したら差し替える。それまでは今の画像のまま |
| 2 | 本文用の追加画像（カードのアップ、プレイ中の写真など） | オーナーが用意したら Markdown に足す |
| 3 | 本文の文章 | AI の仮の文章をオーナーが直してから公開する |
| 4 | 画像の拡大表示（ライトボックス） | 入れない。説明書の画像はモバイルではピンチで拡大して読む |
| 5 | sitemap、構造化データ（JSON-LD） | 入れない。作品が増えたら再検討する |
| 6 | 通販ページの URL | RENEWAL §13 #1 のまま |
