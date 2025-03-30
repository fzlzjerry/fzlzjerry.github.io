# Morax Cheng's Personal Website ✨

This is the repository for my personal website ([moraxcheng.me](https://moraxcheng.me/)), built with [Astro](https://astro.build/) and styled with [Tailwind CSS](https://tailwindcss.com/). It showcases my profile, projects, blog posts, awards, and iGEM related work.

## 🚀 Project Structure

The project follows a standard Astro project layout:

```text
/
├── public/             # Static assets (images, fonts, certificates, etc.)
│   └── favicon.svg
│   └── Morax.JPG
│   └── certificates/
│   └── ...
├── src/
│   ├── components/     # Reusable Astro components (.astro)
│   ├── content/        # Content collections (e.g., blog posts in .mdx)
│   │   └── blog/
│   ├── data/           # Data files (e.g., assignments.ts, reports.ts)
│   ├── layouts/        # Base page layouts (.astro)
│   └── pages/          # Site pages and routes (.astro, .mdx)
│       ├── about.astro
│       ├── projects.astro
│       ├── awards.astro
│       ├── blog/
│       └── igem/       # iGEM specific pages
├── astro.config.mjs    # Astro configuration
├── tailwind.config.mjs # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Project dependencies and scripts
```

-   **`src/pages/`**: Contains all the pages for the site. Each `.astro` or `.mdx` file becomes a page route.
-   **`src/components/`**: Reusable UI components used across different pages.
-   **`src/layouts/`**: Defines the basic HTML structure and layout for pages.
-   **`src/content/`**: Manages content collections, like blog posts written in MDX.
-   **`src/data/`**: Stores structured data used within the site (e.g., for iGEM assignments/reports).
-   **`public/`**: Stores static assets like images, favicons, certificates etc., directly accessible via the root URL.

## 🧞 Commands

All commands should be run from the root of the project in your terminal:

| Command           | Action                                         |
| :---------------- | :--------------------------------------------- |
| `npm install`     | Installs project dependencies (use `pnpm install` if you prefer pnpm) |
| `npm run dev`     | Starts the local development server (`localhost:4321` by default) |
| `npm run build`   | Builds the production-ready site to `./dist/`  |
| `npm run preview` | Serves the production build locally for preview |

## ✨ Tech Stack

-   Framework: [Astro](https://astro.build/)
-   Styling: [Tailwind CSS](https://tailwindcss.com/)
-   Content: [MDX](https://mdxjs.com/)
-   Language: [TypeScript](https://www.typescriptlang.org/)
-   Package Manager: npm (or pnpm as indicated by `pnpm-lock.yaml`)

## 👀 Want to learn more about Astro?

Check out the [Astro documentation](https://docs.astro.build) or join the [Astro Discord community](https://astro.build/chat).
