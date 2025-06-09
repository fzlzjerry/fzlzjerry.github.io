import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://moraxcheng.me',
  integrations: [
    tailwind(),
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, {
        macros: {
          "\\eqref": "\\href{###1}{(\\text{#1})}",
        },
        trust: true,
        strict: false,
        output: 'mathml'
      }]]
    }),
    sitemap(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    },
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeKatex, {
      macros: {
        "\\eqref": "\\href{###1}{(\\text{#1})}",
      },
      trust: true,
      strict: false,
      output: 'mathml'
    }]]
  },
  vite: {
    server: {
      allowedHosts: ['code.moraxcheng.me']
    }
  }
});