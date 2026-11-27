import { getCollection, type CollectionEntry } from "astro:content";
import { assertAccentContrast } from "./color";

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

export function isReleased(work: Work): work is ReleasedWork {
  return work.data.status === "released";
}

/**
 * Static paths shared by the work page and its OGP image (WORK-PAGES §6, §8):
 * one per released work, failing the build on a low-contrast accent (§6.6).
 */
export async function getWorkPaths() {
  const released = (await getWorks()).works.filter(isReleased);
  for (const work of released) {
    assertAccentContrast(work.data.accent, `works/${work.id}`);
  }
  return released.map((work) => ({
    params: { id: work.id },
    props: {
      work,
      others: released.filter((other) => other.id !== work.id),
    },
  }));
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

const tokyoLongDate = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  dateStyle: "long",
});

/** "2026-10-17" for `<time datetime>`, in Japan time. */
export function isoDate(date: Date) {
  return tokyoDate.format(date);
}

/** "2026年10月17日", in Japan time. */
export function formatDate(date: Date) {
  return tokyoLongDate.format(date);
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

/** "ゲーム情報" values shared by the heroes, cards and work info. */
export function metaItems(data: ReleasedWork["data"]) {
  return [
    { label: "プレイ人数", value: `${formatRange(data.players)}人` },
    { label: "プレイ時間", value: `${formatRange(data.playTime)}分` },
    { label: "対象年齢", value: `${data.age}歳〜` },
    { label: "価格", value: `¥${data.price.toLocaleString("ja-JP")}` },
  ];
}
