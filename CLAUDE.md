# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website (moraxcheng.me) built with Astro 5.x, Tailwind CSS, and TypeScript. Static site showcasing projects, blog posts, and awards, deployed to GitHub Pages.

## Commands

```bash
# Install dependencies (80-90 seconds - do not cancel)
pnpm install --no-frozen-lockfile

# Development server (localhost:4321, <1s startup)
npm run dev

# Production build (~5 seconds, outputs to ./dist/)
npm run build

# Preview production build
npm run preview
```

**Package manager**: pnpm preferred. `pnpm-lock.yaml` is authoritative; other lockfiles exist for compatibility but may be outdated.

## Architecture

### Content System
- **Blog posts**: MDX files in `src/content/blog/` with Zod-validated frontmatter
- **Content schema**: `src/content/config.ts` defines required fields (`title`, `date`) and optional fields (`tags`, `category`, `authors`, `professor`, `institution`, `department`, `excerpt`)

### Routing
Astro file-based routing in `src/pages/`:
- Dynamic blog posts: `blog/[slug].astro`
- Category/tag filtering: `blog/category/[category].astro`, `blog/tag/[tag].astro`

### Key Components
- `src/layouts/Layout.astro` - Base template with global styles, fonts, animations, and view transitions
- `src/components/Header.astro` - Navigation with mobile menu
- `src/components/CommandPalette.astro` - Cmd+K search palette with fuzzy matching

### Styling
- Tailwind CSS with custom config in `tailwind.config.mjs`
- Font stack: Inter (sans), Playfair Display (serif/headings), JetBrains Mono (code)
- Dark mode: class-based

### Math Rendering
KaTeX support via remark-math and rehype-katex. Configuration in `astro.config.mjs` includes custom `\eqref` macro.

## Validation Checklist

No lint/test scripts exist. Always validate manually:
1. `npm run build` - verify no build errors
2. `npm run dev` - test locally
3. Test navigation: `/`, `/projects`, `/blog`, `/blog/[slug]`, `/awards`, `/about`
4. Verify MDX renders correctly with math support
5. Check mobile navigation menu

## Deployment

Automatic via GitHub Actions on push to `main` branch. Workflow: `.github/workflows/astro.yml`. Custom domain handled by CNAME file.

## Content Locations

| Content Type | Location |
|-------------|----------|
| Blog posts | `src/content/blog/*.mdx` |
| Projects | `src/pages/projects.astro` (inline data) |
| About | `src/pages/about.astro` |
| Awards | `src/pages/awards.astro` (inline data) |
| Static assets | `public/` |
