import type { Element, ElementContent, Root, RootContent } from "hast";

/*
 * WORK-PAGES §5.2: split a work's Markdown body into one section per `h2`.
 *
 * <section class="work-section" data-media="single" data-side="end" data-reveal>
 *   <div class="work-section__text">…</div>
 *   <div class="work-section__media"><figure><img …></figure></div>
 * </section>
 *
 * Paragraphs that hold only images move to the media column, so images always
 * end up after the text. Runs before Astro's `rehype-images`, which looks for
 * `img` anywhere in the tree, so moved images are still optimized.
 */

type File = { path?: string };
type Group = { text: ElementContent[]; images: Element[] };

const isWhitespace = (node: RootContent | ElementContent) =>
  node.type === "comment" || (node.type === "text" && node.value.trim() === "");

const isElement = (
  node: RootContent | ElementContent,
  tagName?: string,
): node is Element =>
  node.type === "element" && (!tagName || node.tagName === tagName);

/** Images of a paragraph that holds nothing but images, else `null`. */
function imageParagraph(node: RootContent): Element[] | null {
  if (!isElement(node, "p")) return null;
  const content = node.children.filter((child) => !isWhitespace(child));
  if (content.length === 0) return null;
  return content.every((child) => isElement(child, "img"))
    ? (content as Element[])
    : null;
}

function element(
  tagName: string,
  properties: Element["properties"],
  children: ElementContent[],
): Element {
  return { type: "element", tagName, properties, children };
}

/** Fails the build on an `h1` or an image without alternative text. */
function check(node: Root | Element, fail: (message: string) => never) {
  for (const child of node.children) {
    if (!isElement(child)) continue;
    if (child.tagName === "h1") {
      fail("use `##` for headings; the page's h1 is the work's title");
    }
    if (child.tagName === "img" && !String(child.properties.alt ?? "").trim()) {
      fail(`image ${String(child.properties.src)} needs alt text`);
    }
    check(child, fail);
  }
}

export function rehypeWorkSections() {
  return (tree: Root, file: File) => {
    const fail: (message: string) => never = (message) => {
      throw new Error(`${file.path ?? "Markdown"}: ${message}`);
    };
    check(tree, fail);

    const groups: Group[] = [];
    let current: Group | undefined;

    for (const node of tree.children) {
      if (isElement(node, "h2")) {
        current = { text: [node], images: [] };
        groups.push(current);
        continue;
      }
      if (isWhitespace(node) || node.type === "doctype") continue;
      if (!current) fail("the body must start with a `##` heading");
      const images = imageParagraph(node);
      if (images) current.images.push(...images);
      else current.text.push(node as ElementContent);
    }

    let singles = 0;
    tree.children = groups.map(({ text, images }) => {
      const media =
        images.length === 0
          ? "none"
          : images.length === 1
            ? "single"
            : "multiple";
      const properties: Element["properties"] = {
        className: ["work-section"],
        dataMedia: media,
        dataReveal: "",
      };
      // Single images alternate sides, starting on the end side (§5.2).
      if (media === "single") {
        properties.dataSide = singles++ % 2 === 0 ? "end" : "start";
      }
      const children = [
        element("div", { className: ["work-section__text"] }, text),
      ];
      if (images.length > 0) {
        children.push(
          element(
            "div",
            { className: ["work-section__media"] },
            images.map((image) => element("figure", {}, [image])),
          ),
        );
      }
      return element("section", properties, children);
    });
  };
}
