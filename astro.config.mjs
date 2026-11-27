import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import { rehypeWorkSections } from "./src/lib/rehype-work-sections";

export default defineConfig({
  site: "https://kyoryuteishoku.ragi.house",
  output: "static",
  // WORK-PAGES §5.2: the default Satteri processor cannot run rehype plugins.
  markdown: {
    processor: unified({ rehypePlugins: [rehypeWorkSections] }),
  },
});
