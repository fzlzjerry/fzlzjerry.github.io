import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),
    authors: z.array(z.string()).optional(),
    professor: z.string().optional(),
    institution: z.string().optional(),
    department: z.string().optional(),
    excerpt: z.string().optional(),
    // Per-post share card built by scripts/build-og.mjs, e.g. /og/<slug>.jpg.
    // Omit to fall back to the site cover plate. Must be 1200x630 PNG/JPEG.
    ogImage: z.string().optional(),
  }),
});

export const collections = {
  blog,
};