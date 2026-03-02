import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// https://astro.build/config
export default defineConfig({
  devToolbar: { enabled: false },
  site: 'https://example.com',
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: 'github-light', // Use a high-contrast light theme
      wrap: true,
    },
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [
      rehypeKatex,
      rehypeSlug,
      [rehypeAutolinkHeadings, {
        behavior: 'append',
        content: {
          type: 'text',

        }
      }]
    ],
    extendDefaultPlugins: true
  }
});
