import { getCollection, type CollectionEntry } from "astro:content";

export type Work = CollectionEntry<"works">;
export type ReleasedWork = Work & {
  data: Extract<Work["data"], { status: "released" }>;
};

export async function getWorks() {
  const works = (await getCollection("works")).sort(
    (a, b) => a.data.order - b.data.order,
  );
  const featured = works.filter(
    (work): work is ReleasedWork =>
      work.data.status === "released" && work.data.featured,
  );
  if (featured.length !== 1) {
    throw new Error(
      `Exactly one released work must be featured; found ${featured.length}.`,
    );
  }
  return { works, featured: featured[0]! };
}

export function formatRange(range: { min: number; max: number }) {
  return range.min === range.max ? `${range.min}` : `${range.min}–${range.max}`;
}

const tokyoDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function tokyoYear(now = new Date()) {
  return tokyoDate.format(now).slice(0, 4);
}

export function eventLabel(date: Date | null, now = new Date()) {
  return date && tokyoDate.format(date) >= tokyoDate.format(now)
    ? "次回出展"
    : "頒布";
}

/** Candidate widths for responsive images, capped at the source width. */
export function imageWidths(
  image: { width: number },
  candidates: number[] = [320, 480, 640, 960, 1280],
) {
  return [...candidates.filter((w) => w < image.width), image.width];
}

/** "ゲーム情報" values shared by the hero, cards and dialog. */
export function metaItems(data: ReleasedWork["data"]) {
  return [
    { label: "プレイ人数", value: `${formatRange(data.players)}人` },
    { label: "プレイ時間", value: `${formatRange(data.playTime)}分` },
    { label: "対象年齢", value: `${data.age}歳〜` },
    { label: "価格", value: `¥${data.price.toLocaleString("ja-JP")}` },
  ];
}
