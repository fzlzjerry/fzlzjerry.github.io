# CLAUDE.md - AI Assistant Guide for Morax Cheng's Personal Website

This document provides comprehensive guidance for AI assistants working with this codebase. It explains the project structure, development workflows, conventions, and best practices to follow.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Codebase Structure](#codebase-structure)
- [Development Workflow](#development-workflow)
- [Key Conventions](#key-conventions)
- [Component Patterns](#component-patterns)
- [Content Management](#content-management)
- [Styling System](#styling-system)
- [Build & Deployment](#build--deployment)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)

---

## Project Overview

**Project Name:** Morax Cheng's Personal Website
**URL:** https://moraxcheng.me
**Purpose:** Personal portfolio and blog showcasing projects, awards, blog posts, and iGEM work
**Framework:** Astro 5.1.8 (Static Site Generator)
**Deployment:** GitHub Pages (automatic on push to main)

### Key Features
- **Blog System:** MDX-based content with math rendering (KaTeX)
- **Dynamic Routing:** Category/tag filtering, dynamic blog post pages
- **Command Palette:** Advanced cmd-k search with keyboard navigation
- **Responsive Design:** Mobile-first with Tailwind CSS
- **View Transitions:** SPA-like navigation without page reloads
- **iGEM Section:** Dedicated section for competition work with assignments and reports

---

## Technology Stack

### Core Technologies
- **Framework:** Astro 5.1.8 - Partial hydration, static site generation
- **Styling:** Tailwind CSS 3.4.1 - Utility-first CSS with typography plugin
- **Content:** MDX 4.0.7 - Markdown with embedded JSX components
- **Language:** TypeScript - Type-safe development
- **Package Manager:** pnpm 10 (primary), with npm/yarn compatibility

### Key Dependencies
```json
{
  "astro": "^5.1.8",
  "@astrojs/mdx": "^4.0.7",
  "@astrojs/tailwind": "^5.1.5",
  "@astrojs/sitemap": "^3.3.0",
  "tailwindcss": "^3.4.1",
  "@tailwindcss/typography": "^0.5.10",
  "katex": "^0.16.9",
  "remark-math": "^6.0.0",
  "rehype-katex": "^7.0.0",
  "astro-icon": "^1.1.5"
}
```

### External Resources (CDN)
- **KaTeX CSS:** Math formula styling (loaded via CDN)
- **Font Awesome 6.5.1:** Icons for UI and social links

---

## Codebase Structure

```
/home/user/fzlzjerry.github.io/
├── .github/
│   ├── copilot-instructions.md       # AI assistant instructions
│   └── workflows/
│       └── astro.yml                 # GitHub Actions CI/CD pipeline
├── public/                           # Static assets (directly accessible)
│   ├── favicon.svg
│   ├── Morax.JPG                     # Profile photo
│   ├── certificates/                 # Award certificates
│   ├── projects/                     # Project images
│   └── robots.txt
├── src/
│   ├── components/                   # Reusable UI components (5 files)
│   │   ├── Card.astro                # Reusable card with hover effects
│   │   ├── CommandPalette.astro      # Cmd-k search (391 LOC, complex)
│   │   ├── Footer.astro              # Site footer with links
│   │   ├── Header.astro              # Navigation with mobile menu
│   │   └── ImageModal.astro          # Image viewer modal
│   ├── content/
│   │   ├── config.ts                 # Content collection schemas
│   │   └── blog/                     # MDX blog posts
│   │       ├── machine-learning-solution-global-multi-port-commodities.mdx
│   │       └── the-price-of-time.mdx
│   ├── data/                         # TypeScript data files
│   │   ├── assignments.ts            # iGEM assignment data
│   │   └── reports.ts                # iGEM weekly reports
│   ├── layouts/
│   │   └── Layout.astro              # Master layout (~270 LOC)
│   └── pages/                        # File-based routing
│       ├── index.astro               # Home page
│       ├── about.astro               # Profile page
│       ├── projects.astro            # Projects showcase
│       ├── awards.astro              # Awards and certificates
│       ├── 404.astro                 # Custom 404 page
│       ├── blog/
│       │   ├── index.astro           # Blog listing
│       │   ├── [slug].astro          # Dynamic blog post pages
│       │   ├── category/[category].astro  # Category filtering
│       │   └── tag/[tag].astro       # Tag filtering
│       └── igem/                     # iGEM competition section
│           ├── index.astro
│           ├── assignments/
│           │   ├── index.astro
│           │   └── [id].astro
│           └── weekly-reports/
│               ├── index.astro
│               └── [date].astro
├── dist/                             # Build output (generated)
├── astro.config.mjs                  # Astro configuration
├── tailwind.config.mjs               # Tailwind CSS config
├── tsconfig.json                     # TypeScript config
├── package.json                      # Dependencies and scripts
├── pnpm-lock.yaml                    # Primary lockfile (maintained)
├── package-lock.json                 # Legacy compatibility (not maintained)
└── yarn.lock                         # Legacy compatibility (not maintained)
```

### Directory Purposes

| Directory | Purpose | Notes |
|-----------|---------|-------|
| `src/components/` | Reusable Astro components | 5 files, 1,418 LOC total |
| `src/content/blog/` | MDX blog posts | Content collections with schema validation |
| `src/data/` | Static data files | TypeScript files for structured data |
| `src/layouts/` | Page layouts | Master layout with global styles |
| `src/pages/` | Routes and pages | File-based routing (Astro convention) |
| `public/` | Static assets | Directly accessible via root URL |
| `dist/` | Build output | Generated by `astro build` |

---

## Development Workflow

### Environment Setup

1. **Prerequisites:**
   - Node.js 20+ (LTS recommended)
   - pnpm 10 (install globally: `npm install -g pnpm`)

2. **Install Dependencies:**
   ```bash
   pnpm install --no-frozen-lockfile
   ```
   - **Timing:** Takes 80-90 seconds
   - **CRITICAL:** Never cancel during installation
   - **CI/CD:** Set timeout to 120-150 seconds minimum

3. **Available Commands:**
   ```bash
   pnpm dev      # Start dev server (http://localhost:4321)
   pnpm build    # Build for production (~5 seconds)
   pnpm preview  # Preview production build locally
   pnpm astro    # Run Astro CLI commands
   ```

### Package Manager Notes

- **Primary:** pnpm (only `pnpm-lock.yaml` is actively maintained)
- **Legacy:** `yarn.lock` and `package-lock.json` exist for compatibility but may be outdated
- **Contributors:** Always use pnpm unless you have a specific reason not to
- **Frozen Lockfile Error:** Use `pnpm install --no-frozen-lockfile`

### Making Changes

**Standard Workflow:**
1. Edit source files in `src/`
2. Run `pnpm dev` to test locally (starts in <1 second)
3. Run `pnpm build` to verify production build (~5 seconds)
4. **CRITICAL:** Always manually test navigation between pages
5. Commit changes with clear messages
6. Push to feature branch (starts with `claude/`)

**Required Testing Paths:**
- Home page (/)
- Projects (/projects)
- Blog (/blog)
- Individual blog posts (/blog/[slug])
- Awards (/awards)
- iGEM section (/igem)
- About (/about)
- Command Palette (Cmd/Ctrl+K)
- Mobile navigation menu

### Validation Requirements

**CRITICAL - No Automated Testing:**
- This repository has **NO** lint, format, or test scripts
- Do **NOT** add linting tools unless specifically requested
- Do **NOT** create test files unless specifically requested
- Manual validation is the only verification method

**Manual Validation Checklist:**
1. Build succeeds without errors (`pnpm build`)
2. All pages load correctly in dev mode (`pnpm dev`)
3. Navigation works between all major sections
4. MDX blog posts render with KaTeX math support
5. Mobile menu functions correctly
6. Command palette search works (Cmd/Ctrl+K)
7. Images and static assets load properly

---

## Key Conventions

### File Naming
- **Pages:** `kebab-case.astro` (e.g., `weekly-reports.astro`)
- **Components:** `PascalCase.astro` (e.g., `CommandPalette.astro`)
- **Data Files:** `camelCase.ts` (e.g., `assignments.ts`)
- **Blog Posts:** `kebab-case.mdx` (e.g., `machine-learning-solution.mdx`)
- **Dynamic Routes:** `[param].astro` (e.g., `[slug].astro`, `[id].astro`)

### Code Style
- **TypeScript:** Use type annotations where beneficial
- **Astro Components:** Frontmatter section followed by HTML template
- **Tailwind Classes:** Utility-first approach, group related utilities
- **Imports:** Use TypeScript path aliases where configured
- **Line Length:** No strict limit, but keep readable in editors

### Component Structure
```astro
---
// Frontmatter: TypeScript/JavaScript logic
import Component from './Component.astro';

interface Props {
  title: string;
  optional?: boolean;
}

const { title, optional = false } = Astro.props;
---

<!-- Template: HTML with Astro syntax -->
<div class="container">
  <h1>{title}</h1>
  {optional && <p>Optional content</p>}
</div>

<!-- Scoped Styles (use sparingly, prefer Tailwind) -->
<style>
  .container {
    /* ... */
  }
</style>

<!-- Client-side Scripts (use sparingly) -->
<script>
  // Client-side JavaScript
</script>
```

### Content Collections Schema

**Blog Post Frontmatter (src/content/config.ts):**
```typescript
{
  title: string;              // Required
  date: string;               // Required (YYYY-MM-DD format)
  tags: string[];             // Optional (default: [])
  category?: string;          // Optional
  authors?: string[];         // Optional
  professor?: string;         // Optional
  institution?: string;       // Optional
  department?: string;        // Optional
  excerpt?: string;           // Optional
}
```

### Routing Conventions

**Static Routes:**
- `src/pages/about.astro` → `/about`
- `src/pages/blog/index.astro` → `/blog`
- `src/pages/igem/assignments/index.astro` → `/igem/assignments`

**Dynamic Routes:**
- `src/pages/blog/[slug].astro` → `/blog/machine-learning-solution`
- `src/pages/blog/tag/[tag].astro` → `/blog/tag/optimization`
- `src/pages/igem/assignments/[id].astro` → `/igem/assignments/1`

**Pre-rendering:**
- All routes use `getStaticPaths()` for static generation
- No server-side rendering (SSR) - fully static site

---

## Component Patterns

### Layout.astro (Master Layout)

**Purpose:** Wraps all pages with common structure
**Location:** `src/layouts/Layout.astro`
**Size:** ~270 LOC

**Key Features:**
- Sets up HTML structure, meta tags, fonts
- Includes Header, Footer, CommandPalette
- Defines CSS custom properties (design tokens)
- Implements view transitions with `<ClientRouter>`
- Contains inline scripts for:
  - Mobile menu toggle
  - Intersection Observer-based fade-in animations
  - Copy button for code blocks
  - Page transition lifecycle hooks

**Fonts Loaded:**
- Inter (sans-serif) - Body text
- Playfair Display (serif) - Headings
- JetBrains Mono (monospace) - Code

**Usage:**
```astro
---
import Layout from '../layouts/Layout.astro';
---
<Layout title="Page Title">
  <!-- Page content here -->
</Layout>
```

### Header.astro (Navigation)

**Features:**
- Sticky navigation bar
- Active link detection
- Mobile hamburger menu
- Responsive breakpoints (hidden on mobile, flex on md+)

**Navigation Items:**
- Home, Projects, Blog, Awards, iGEM, About

### CommandPalette.astro (Search)

**Purpose:** Advanced cmd-k search functionality
**Size:** 391 LOC (most complex component)

**Features:**
- Keyboard shortcuts: Cmd/Ctrl+K (open), Escape (close)
- Arrow key navigation (up/down)
- Enter to navigate to selected item
- Fuzzy search across pages and blog posts
- Real-time filtering
- Automatic scroll to selected item
- View transitions support with cleanup

**Implementation:**
- Server-side: Builds search index at build time via `define:vars`
- Client-side: JavaScript handles interaction, filtering, navigation
- Indexes: All pages (6) + blog posts (10 max shown)

**Usage:** Automatically included in Layout.astro

### Card.astro (Reusable Component)

**Purpose:** Consistent card styling with hover effects

**Features:**
- Border, shadow, hover lift effect
- Supports slots for flexible content
- Rounded corners with Tailwind utilities

**Usage:**
```astro
<Card>
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

### ImageModal.astro (Image Viewer)

**Features:**
- Modal dialog for viewing enlarged images
- Focus trap for accessibility
- Keyboard support (Escape to close)
- Smooth fade-in/out animations
- ARIA attributes for screen readers

### Footer.astro

**Features:**
- Basic footer with links
- Social media icons (if configured)
- Copyright information

---

## Content Management

### Adding Blog Posts

**Location:** `src/content/blog/`
**Format:** `.mdx` (Markdown with JSX)

**Steps:**
1. Create new `.mdx` file in `src/content/blog/`
2. Add required frontmatter:
   ```mdx
   ---
   title: "Your Post Title"
   date: "2026-01-18"
   tags: ["tag1", "tag2"]
   category: "Category Name"
   excerpt: "Brief description"
   ---

   ## Your Content Here

   Regular markdown content with **formatting**.

   Math equations using KaTeX:
   $$
   E = mc^2
   $$
   ```
3. Build and test: `pnpm build && pnpm dev`
4. Verify post appears in `/blog` listing
5. Test dynamic routes: `/blog/your-post-slug`, `/blog/tag/tag1`

**Math Support (KaTeX):**
- Inline math: `$E = mc^2$`
- Block math: `$$\int_0^\infty e^{-x} dx = 1$$`
- Custom macros: `\eqref{label}` for equation references
- Configuration in `astro.config.mjs` (trust: true, strict: false)

### Editing Projects

**Location:** `src/pages/projects.astro`
**Format:** Hardcoded data in component

**Structure:**
```typescript
const projects = [
  {
    title: "Project Name",
    description: "Project description",
    image: "/projects/project-image.jpg",
    link: "/projects/project-slug",
    featured: true, // Show in featured section
    tags: ["tag1", "tag2"]
  },
  // ...
];
```

### Managing iGEM Content

**Assignments:**
- **Data:** `src/data/assignments.ts`
- **Pages:** `src/pages/igem/assignments/index.astro`, `src/pages/igem/assignments/[id].astro`
- **Structure:** TypeScript array of objects with id, title, sections

**Weekly Reports:**
- **Data:** `src/data/reports.ts`
- **Pages:** `src/pages/igem/weekly-reports/index.astro`, `src/pages/igem/weekly-reports/[date].astro`
- **Structure:** TypeScript array with date, achievements, goals

### Static Assets

**Adding Images/Files:**
1. Place files in `public/` directory
2. Reference from root URL (e.g., `/projects/image.jpg`)
3. Organize in subdirectories: `public/certificates/`, `public/projects/`

**Best Practices:**
- Optimize images before uploading (compress, resize)
- Use descriptive filenames (kebab-case)
- Include alt text for accessibility

---

## Styling System

### Design System: "Refined Academic Minimalist"

**Philosophy:**
- Clean, minimal aesthetic
- Serif headings, sans body text
- Subtle animations and transitions
- Focus on content readability

### CSS Custom Properties (Design Tokens)

**Defined in:** `src/layouts/Layout.astro`

**Color Palette (Zinc-based):**
```css
--bg-body: #ffffff;            /* Main background */
--bg-subtle: #fafafa;          /* Subtle background (zinc-50) */
--text-main: #18181b;          /* Primary text (zinc-900) */
--text-secondary: #52525b;     /* Secondary text (zinc-600) */
--text-muted: #a1a1aa;         /* Muted text (zinc-400) */
--border-light: #e4e4e7;       /* Light borders (zinc-200) */
--border-medium: #d4d4d8;      /* Medium borders (zinc-300) */
--accent: #2563eb;             /* Accent color (blue-600) */
```

**Transitions:**
```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
```

**Shadows:**
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
```

### Typography

**Font Stack:**
```css
--font-sans: 'Inter', system-ui, sans-serif;
--font-serif: 'Playfair Display', Georgia, serif;
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
```

**Heading Styles:**
- Font family: Playfair Display (serif)
- Letter spacing: Reduced (-0.02em for elegance)
- Sizes: h1 2.5rem (desktop), h2 2rem, h3 1.5rem
- Line height: Tight (1.2 for headings)

**Body Text:**
- Font family: Inter (sans-serif)
- Line height: 1.75 (optimal readability)
- Font size: 1rem base
- Color: zinc-900 (#18181b)

### Tailwind Configuration

**Custom Theme (tailwind.config.mjs):**
```javascript
{
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            fontFamily: 'var(--font-serif)',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
```

### Common Patterns

**Card with Hover Effect:**
```html
<div class="border border-zinc-200 rounded-2xl p-6 hover:shadow-lg
            hover:-translate-y-1 transition-all duration-200">
  <!-- Content -->
</div>
```

**Button:**
```html
<button class="bg-blue-600 text-white px-4 py-2 rounded-lg
               hover:bg-blue-700 transition-colors">
  Click me
</button>
```

**Prose Content:**
```html
<article class="prose prose-zinc max-w-none">
  <!-- MDX content renders here with typography plugin styles -->
</article>
```

**Responsive Grid:**
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Items -->
</div>
```

### Animations & Effects

**Fade-in on Scroll (Intersection Observer):**
- Implemented in Layout.astro
- Automatically applied to elements with `.fade-in` class
- Triggers when element enters viewport

**View Transitions:**
- Astro's built-in view transitions enabled
- SPA-like navigation without full page reload
- Cleanup handlers for event listeners

**Code Block Copy Button:**
- Automatically added to all code blocks
- Appears on hover
- Copies code to clipboard with visual feedback

**Reading Progress Bar:**
- Shown on blog post pages
- Fixed at top of viewport
- Updates as user scrolls

---

## Build & Deployment

### Local Build

**Build Command:**
```bash
pnpm build
```

**Output:**
- Directory: `./dist/`
- Timing: ~5 seconds (very fast)
- Contents: Fully static HTML, CSS, JS files

**Verification:**
After building, verify these key files exist in `dist/`:
- `index.html` (home page)
- `blog/index.html` (blog listing)
- `projects/index.html` (projects page)
- `about/index.html` (about page)
- Blog post pages: `blog/[slug]/index.html`
- Sitemap: `sitemap-*.xml`
- Static assets from `public/`

### GitHub Actions Deployment

**Workflow File:** `.github/workflows/astro.yml`

**Triggers:**
- Push to `main` branch
- Manual workflow dispatch

**Steps:**
1. Checkout code
2. Auto-detect package manager (pnpm/yarn/npm)
3. Setup pnpm v10
4. Install dependencies (with cache)
5. Build with `astro build`
6. Upload `dist/` artifacts
7. Deploy to GitHub Pages

**Node Version:** v20
**Concurrency:** Single concurrent deployment
**Permissions:** read:contents, write:pages, id-token:write

**Domain:**
- Custom domain: moraxcheng.me
- Configured via CNAME file in repository settings

### Deployment Workflow

**Automatic Deployment:**
1. Make changes in feature branch (starts with `claude/`)
2. Commit with clear message
3. Push to feature branch
4. Create pull request to `main`
5. Review and merge PR
6. GitHub Actions automatically builds and deploys
7. Live site updates at https://moraxcheng.me

**Manual Verification:**
1. Build locally: `pnpm build`
2. Preview locally: `pnpm preview`
3. Test at `http://localhost:4321`
4. Verify all pages load correctly
5. Push to trigger deployment

---

## Common Tasks

### Task: Add New Navigation Link

**Files to Edit:**
1. `src/components/Header.astro`

**Steps:**
1. Add new link to navigation array:
   ```astro
   const navItems = [
     { name: 'Home', href: '/' },
     { name: 'New Page', href: '/new-page' },
     // ...
   ];
   ```
2. Create corresponding page in `src/pages/new-page.astro`
3. Test navigation works
4. Verify active link detection

### Task: Update Personal Information

**Files to Edit:**
1. `src/pages/about.astro` - Main profile content
2. `public/Morax.JPG` - Profile photo (if replacing)
3. `src/components/Footer.astro` - Contact links (if needed)

### Task: Change Color Scheme

**Files to Edit:**
1. `src/layouts/Layout.astro` - CSS custom properties
2. `tailwind.config.mjs` - Tailwind theme extension (if needed)

**Steps:**
1. Update CSS custom properties in Layout.astro:
   ```css
   :root {
     --bg-body: #new-color;
     --text-main: #new-color;
     /* ... */
   }
   ```
2. Test across all pages for contrast and readability
3. Verify dark mode compatibility (if implemented)

### Task: Add External Script/Library

**Method 1: Add to Layout.astro**
```astro
<head>
  <script src="https://cdn.example.com/library.js"></script>
</head>
```

**Method 2: Install via pnpm**
```bash
pnpm add library-name
```
Then import in components as needed.

### Task: Modify Command Palette Search Index

**File:** `src/components/CommandPalette.astro`

**Steps:**
1. Locate `allPages` array (server-side frontmatter)
2. Add/remove pages from the array
3. Adjust `allPosts` query if needed (currently limits to 10)
4. Test search functionality with cmd-k

### Task: Customize Code Block Theme

**File:** `astro.config.mjs`

**Steps:**
1. Change `shikiConfig.theme` value:
   ```javascript
   shikiConfig: {
     theme: 'github-light', // or 'dracula', 'nord', etc.
     wrap: true
   }
   ```
2. Browse available themes: https://shiki.style/themes
3. Build and verify syntax highlighting

### Task: Add New iGEM Assignment

**Files to Edit:**
1. `src/data/assignments.ts`

**Steps:**
1. Add new assignment object to array:
   ```typescript
   {
     id: 4,
     title: "New Assignment",
     sections: [
       { heading: "Section 1", content: "Content here..." },
     ]
   }
   ```
2. Build site to generate static route
3. Access at `/igem/assignments/4`

---

## Troubleshooting

### Common Issues

**Issue: pnpm frozen lockfile error**
```
ERR_PNPM_OUTDATED_LOCKFILE
```

**Solution:**
```bash
pnpm install --no-frozen-lockfile
```

---

**Issue: Build failures with TypeScript errors**

**Solution:**
1. Check for type errors in `.astro` files
2. Verify content collection frontmatter matches schema
3. Run `pnpm astro check` (requires installing `@astrojs/check`)
4. Review recent changes for type mismatches

---

**Issue: Math rendering not working**

**Causes:**
- Invalid KaTeX syntax in MDX
- Missing KaTeX CSS import
- Incorrect remark/rehype plugin configuration

**Solution:**
1. Verify KaTeX syntax is valid
2. Check astro.config.mjs has remark-math and rehype-katex
3. Ensure KaTeX CSS is loaded in Layout.astro
4. Test with simple equation: `$E = mc^2$`

---

**Issue: Missing pages after build**

**Causes:**
- File naming doesn't follow Astro conventions
- `getStaticPaths()` not implemented for dynamic routes
- TypeScript errors preventing build

**Solution:**
1. Check file is in `src/pages/` directory
2. Verify `.astro` or `.mdx` extension
3. For dynamic routes, ensure `getStaticPaths()` is exported
4. Review build output for errors

---

**Issue: Command Palette not opening**

**Causes:**
- JavaScript error in component
- Event listener conflict with view transitions
- Browser compatibility issue

**Solution:**
1. Open browser console for errors
2. Verify cmd-k/ctrl-k keyboard shortcut works
3. Check for JavaScript errors in CommandPalette.astro
4. Test in different browser

---

**Issue: Styles not applying**

**Causes:**
- Tailwind class not in content paths
- Scoped styles conflicting
- CSS specificity issues

**Solution:**
1. Verify Tailwind classes are spelled correctly
2. Check `tailwind.config.mjs` content paths include your file
3. Rebuild with `pnpm build` to regenerate CSS
4. Use browser DevTools to inspect applied styles

---

**Issue: Images not loading**

**Causes:**
- Incorrect path to `public/` directory
- Missing image file
- Case sensitivity in filename

**Solution:**
1. Verify image exists in `public/` directory
2. Use absolute path from root: `/projects/image.jpg` (not `./projects/...`)
3. Check filename case matches exactly (Linux is case-sensitive)
4. Verify file extension is correct

---

**Issue: View transitions breaking component functionality**

**Causes:**
- Event listeners not cleaned up on navigation
- State not reset between page changes

**Solution:**
1. Add cleanup in `astro:before-swap` event:
   ```javascript
   document.addEventListener('astro:before-swap', () => {
     // Clean up event listeners
   });
   ```
2. Re-initialize components on `astro:page-load`
3. See CommandPalette.astro for reference implementation

---

### Performance Notes

**Build Performance:**
- Very fast (~5 seconds) due to static site generation
- No server runtime overhead
- Minimal dependencies reduce build time

**Runtime Performance:**
- Static HTML served directly (no SSR delay)
- Partial hydration (JavaScript only where needed)
- View transitions reduce full page reloads
- Images should be optimized before uploading

**Optimization Tips:**
- Compress images before adding to `public/`
- Minimize client-side JavaScript
- Use Astro components (non-interactive) when possible
- Leverage static generation for all routes

---

## Best Practices for AI Assistants

### When Making Changes

1. **Read Before Modifying:** Always read the file before making changes
2. **Preserve Existing Patterns:** Follow established code style and conventions
3. **Test Thoroughly:** Build and manually test all changed pages
4. **No Over-Engineering:** Keep solutions simple, avoid unnecessary abstractions
5. **Security First:** Watch for XSS, injection vulnerabilities in user content
6. **Mobile-First:** Ensure changes work on all screen sizes
7. **Accessibility:** Maintain ARIA labels, semantic HTML, keyboard navigation

### What NOT to Do

- **Never** add linting/testing tools unless explicitly requested
- **Never** create documentation files unless asked
- **Never** use emojis unless user requests them
- **Never** add comments to code you didn't change
- **Never** add error handling for scenarios that can't happen
- **Never** create abstractions for one-time operations
- **Never** push to `main` branch (use feature branches starting with `claude/`)
- **Never** skip manual validation after changes

### Communication Style

- Use concise, technical language
- Focus on facts and problem-solving
- Provide file paths with line numbers: `file.astro:123`
- Explain "why" not just "what" in commit messages
- Ask questions when requirements are unclear

### Git Workflow

**Branch Naming:**
- Feature branches must start with `claude/`
- Example: `claude/add-new-feature-Ual1o`
- Include session ID at the end

**Commits:**
- Write clear, descriptive commit messages
- Focus on "why" rather than "what"
- Follow existing commit style (check `git log`)
- Use imperative mood: "Add feature" not "Added feature"

**Pushing:**
- Always use `git push -u origin <branch-name>`
- Retry on network failures (up to 4 times with exponential backoff: 2s, 4s, 8s, 16s)
- Never force push to main/master
- Verify branch name starts with `claude/` before pushing

---

## External Resources

### Documentation
- Astro: https://docs.astro.build
- Tailwind CSS: https://tailwindcss.com/docs
- MDX: https://mdxjs.com
- KaTeX: https://katex.org/docs/supported.html

### CDN Resources Used
- KaTeX CSS: https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css
- Font Awesome 6.5.1: For icons (loaded via CDN)

### File Structure Reference
See `.github/copilot-instructions.md` for additional workflow guidance specific to development tools.

---

## Summary

This codebase is a well-structured, modern static site built with Astro that prioritizes:
- **Simplicity:** Minimal dependencies, clear structure
- **Performance:** Static generation, partial hydration
- **Content Focus:** MDX-based blog with math support
- **Developer Experience:** Fast builds, hot reload, TypeScript
- **User Experience:** Responsive design, smooth transitions, accessible

When working with this codebase, prioritize manual testing, follow existing conventions, and keep solutions simple. The architecture is deliberately straightforward to maintain and extend.

---

**Last Updated:** 2026-01-18
**Astro Version:** 5.1.8
**Node Version:** 20+
**Package Manager:** pnpm 10
