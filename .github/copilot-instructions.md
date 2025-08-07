# Morax Cheng Personal Website

Morax Cheng's personal website (moraxcheng.me) built with Astro 5.x, Tailwind CSS, and TypeScript. This is a static site generator that showcases projects, blog posts, awards, and iGEM work, automatically deployed to GitHub Pages.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Dependencies
- Install Node.js 20+ or latest LTS version
- **CRITICAL**: Install pnpm globally first: `npm install -g pnpm`
- Install dependencies using your preferred package manager:
  - `pnpm install --no-frozen-lockfile` (recommended, takes 80-90 seconds)
  - `npm install` (alternative, takes ~80 seconds) 
  - `yarn install` (also works)
- **NEVER CANCEL**: Dependency installation takes 80-90 seconds. Allow sufficient time for this process to complete, especially in CI or automated environments where timeouts may occur (recommend at least 180 seconds).

### Build and Development
- Build the site: `npm run build` or `pnpm run build`
  - **TIMING**: Build takes ~5 seconds. Very fast, no timeout concerns.
  - Outputs to `./dist/` directory
  - Generates multiple static pages including blog posts and dynamic routes
- Start development server: `npm run dev` or `pnpm run dev`
  - **TIMING**: Starts in <1 second
  - Runs on `http://localhost:4321/`
  - Auto-reloads on file changes
- Preview production build: `npm run preview` or `pnpm run preview`
  - **TIMING**: Starts in <1 second  
  - Runs on `http://localhost:4321/`
  - Serves the built static files from `./dist/`

### Package Manager Notes
- **Preferred Package Manager:** This repository uses `pnpm` as the official and supported package manager for all workflows. The `pnpm-lock.yaml` file is always kept up-to-date and should be used for installing dependencies and running scripts.
- **Why Multiple Lockfiles Exist:** `yarn.lock` and `package-lock.json` are included for compatibility with legacy tooling and contributors who may use alternative package managers. However, these lockfiles are not actively maintained and may become outdated. Only `pnpm-lock.yaml` is guaranteed to reflect the current dependency tree.
- **Contributor Guidance:** Always use `pnpm` for installing dependencies and running scripts unless you have a specific reason to use another package manager. Using `npm` or `yarn` may result in dependency drift or unexpected issues. If you encounter a frozen lockfile error with pnpm, use `pnpm install --no-frozen-lockfile`.

## Validation

### Manual Validation Requirements
- **CRITICAL**: Always manually validate changes by running through complete user scenarios
- **ALWAYS** test the full development workflow after making changes:
  1. `npm run build` - ensure no build errors
  2. `npm run dev` - start dev server and test locally
  3. `npm run preview` - test production build
- **NAVIGATION TESTING**: Always test navigation between key pages:
  - Home page (/)
  - Projects (/projects) 
  - Blog (/blog)
  - Individual blog posts (/blog/[slug])
  - Awards (/awards)
  - iGEM section (/igem)
  - About (/about)
- **CONTENT VALIDATION**: Verify MDX blog posts render correctly with KaTeX math support
- **RESPONSIVE TESTING**: Check mobile navigation menu functionality

### No Linting/Testing Infrastructure
- **IMPORTANT**: This repository has NO existing lint, format, or test scripts
- Do not add linting tools unless specifically requested
- No test files exist - do not create tests unless specifically requested
- Astro check is available but requires installing `@astrojs/check` package

## Common Tasks

### Content Management
- **Blog Posts**: Edit or create `.mdx` files in `src/content/blog/`
- **Projects**: Modify `src/pages/projects.astro`
- **Personal Info**: Update `src/pages/about.astro`
- **iGEM Content**: Edit files in `src/pages/igem/` directory
- **Navigation**: Modify `src/components/Header.astro`

### Development Workflow
- **Making Changes**: 
  1. Edit source files
  2. `npm run dev` to test locally
  3. `npm run build` to verify production build
  4. Always test key navigation paths manually
- **Content Collections**: Blog posts use Astro content collections with schema in `src/content/config.ts`
- **Styling**: Uses Tailwind CSS with custom configuration in `tailwind.config.mjs`
- **Math Rendering**: Blog posts support KaTeX for mathematical expressions

### Static Assets
- **Images/Files**: Place in `public/` directory (accessible from root URL)
- **Certificates**: Store in `public/certificates/`
- **Profile Image**: `public/Morax.JPG`

## Repository Structure

### Key Directories
```
src/
├── components/     # Reusable Astro components (.astro)
├── content/        # Content collections (blog posts in .mdx)
│   └── blog/       # MDX blog posts with frontmatter
├── data/           # Structured data (assignments.ts, reports.ts)
├── layouts/        # Base page layouts (.astro)
└── pages/          # Site pages and routes (.astro, .mdx)
    ├── blog/       # Blog-related pages and dynamic routes
    └── igem/       # iGEM project pages

public/             # Static assets (images, certificates, etc.)
dist/              # Built site output (generated by build)
```

### Configuration Files
- `astro.config.mjs` - Astro configuration with Tailwind, MDX, math support
- `tailwind.config.mjs` - Tailwind CSS configuration  
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies and scripts
- `.github/workflows/astro.yml` - GitHub Pages deployment

### Build Output Verification
After building, verify these key files exist in `dist/`:
- `index.html` (home page)
- `blog/index.html` (blog listing)
- `projects/index.html` (projects page)
- Static assets copied from `public/`
- Generated sitemap files

## Deployment

### GitHub Pages (Automatic)
- **AUTOMATIC**: Pushes to `main` branch trigger auto-deployment via GitHub Actions
- **WORKFLOW**: `.github/workflows/astro.yml` handles build and deployment
- **DOMAIN**: Custom domain configured via `CNAME` file (moraxcheng.me)
- **NO MANUAL DEPLOYMENT NEEDED**: Just push to main branch

### Local Preview of Production
- Run `npm run build && npm run preview` to test production build locally
- Verify all pages load correctly at `http://localhost:4321/`

## Troubleshooting

### Common Issues
- **pnpm frozen lockfile error**: Use `pnpm install --no-frozen-lockfile`
- **Build failures**: Check for TypeScript errors or invalid MDX frontmatter
- **Math rendering issues**: Verify KaTeX syntax in MDX files
- **Missing pages**: Ensure file naming follows Astro conventions

### Performance Notes  
- Build is very fast (~5 seconds) due to static site generation
- Dev server starts instantly with hot reload
- No heavy dependencies or complex build processes

## External Dependencies
- **CDN Resources**: Site loads KaTeX CSS and Font Awesome from CDN
- **Math Support**: Uses remark-math and rehype-katex for LaTeX math rendering
- **Icons**: Font Awesome icons via CDN for social links and UI elements

Always run the complete validation workflow when making changes to ensure the site builds and functions correctly across all pages and features.