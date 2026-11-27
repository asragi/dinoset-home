import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type {
  APIRoute,
  GetStaticPaths,
  ImageMetadata,
  InferGetStaticPropsType,
} from "astro";
import sharp from "sharp";
import { getWorkPaths } from "../../../lib/works";

// WORK-PAGES §8: one 1200×630 OGP image per work page.
const WIDTH = 1200;
const HEIGHT = 630;
const SURFACE = "#f3f5f9"; // --color-surface

export const getStaticPaths = (() => getWorkPaths()) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

// `ImageMetadata.src` is a served URL, so map it back to the source file.
// Keys are project-root paths ("/src/assets/works/…").
const assets = import.meta.glob<ImageMetadata>(
  "/src/assets/works/**/*.{png,jpg,jpeg,webp}",
  { eager: true, import: "default" },
);

function readSource(image: ImageMetadata) {
  const key = Object.keys(assets).find(
    (path) => assets[path]!.src === image.src,
  );
  if (!key) {
    throw new Error(
      `OGP: ${image.src} is not under src/assets/works/; keyImage and ogImage must live there.`,
    );
  }
  return readFile(resolve(process.cwd(), key.slice(1)));
}

async function render({ keyImage, ogImage }: Props["work"]["data"]) {
  if (ogImage) {
    return sharp(await readSource(ogImage))
      .resize(WIDTH, HEIGHT, { fit: "cover" })
      .png()
      .toBuffer();
  }
  // The key visual at full height, centered on the surface color.
  const art = await sharp(await readSource(keyImage))
    .resize(WIDTH, HEIGHT, { fit: "inside" })
    .toBuffer();
  return sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 3, background: SURFACE },
  })
    .composite([{ input: art, gravity: "center" }])
    .png()
    .toBuffer();
}

export const GET: APIRoute<Props> = async ({ props }) => {
  const png = await render(props.work.data);
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
