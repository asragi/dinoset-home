import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { file, glob } from "astro/loaders";

const range = z.object({
  min: z.number().int().positive(),
  max: z.number().int().positive(),
});
const common = {
  order: z.number().int().positive(),
  title: z.string().min(1),
  catchcopy: z.string().min(1),
};

const works = defineCollection({
  loader: glob({ pattern: "*.md", base: "src/content/works" }),
  schema: ({ image }) =>
    z.discriminatedUnion("status", [
      z.object({
        ...common,
        status: z.literal("released"),
        featured: z.boolean().default(false),
        description: z.string().min(1),
        events: z.array(
          z.object({
            name: z.string(),
            booth: z.string(),
            date: z.coerce.date().nullable(),
          }),
        ),
        price: z.number().int().nonnegative(),
        players: range,
        playTime: range,
        age: z.number().int().positive(),
        genres: z.array(z.string()),
        keyImage: image(),
        // Checked against white (4.5:1) when the work pages are built.
        accent: z.string().regex(/^#[0-9a-f]{6}$/i),
        ogImage: image().optional(), // 1200×630; generated when omitted
        links: z.object({ gameMarket: z.url(), shop: z.url().nullable() }),
      }),
      z.object({ ...common, status: z.literal("coming-soon") }),
    ]),
});

const members = defineCollection({
  loader: file("src/data/members.yaml"),
  schema: ({ image }) =>
    z.object({
      order: z.number().int().positive(),
      name: z.string(),
      role: z.string(),
      icon: image(),
      links: z.object({
        x: z.url().optional(),
        instagram: z.url().optional(),
        email: z.email().optional(),
      }),
    }),
});

export const collections = { works, members };
