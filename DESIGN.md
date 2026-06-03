# DESIGN.md — "Gallery" design system

The single source of truth for this site's visual language. The homepage (`src/pages/index.astro`) is the canonical exemplar; this file documents the shared API every other page must use so the site stays coherent. When in doubt, match the homepage.

## The register & POV

Personal portfolio for **Morax Cheng** — a high-school student developer and economics enthusiast who also photographs (Paris, skiing). This is a **brand** surface: the design *is* the product.

**Aesthetic lane (named reference):** a printed *museum / exhibition catalogue* meets Swiss editorial — warm paper stock, a strict visible grid, oversized characterful grotesk display, hairline rules as structure, mono "wall-label" captions on photography, one restrained ochre. Think art-book monograph, not SaaS landing page.

**Anti-references (do not drift here):**
- Editorial-serif magazine clichés (display serif + italic + drop caps). We use a *grotesk* display, never a serif headline.
- Stripe/Linear minimal SaaS (stark white, purple gradients, hero-metric template).
- Glassy dark dashboards, glassmorphism, neon.

**Slop test:** if it could be guessed from "student portfolio" alone, push further. Distinctiveness comes from the catalogue framing (index numbers, plate captions, wall labels), the photography, and Bricolage Grotesque's character.

## Color (light, warm paper)

Defined as CSS custom properties in `Layout.astro :root`, also wired into Tailwind tokens. **Always use the tokens / Tailwind classes, never hardcode hex.** OKLCH, warm-tinted neutrals, never pure `#fff`/`#000`.

| Token | Tailwind | Role |
|---|---|---|
| `--paper` | `bg-paper`, `bg-bg-primary` | page background (warm ivory) |
| `--paper-sink` / `--panel` | `bg-bg-secondary`, `bg-surface-glass` | recessed panel / card hover |
| `--paper-edge` | `bg-bg-tertiary` | deepest fill / media placeholder |
| `--ink` | `text-ink`, `text-text-primary` | primary text |
| `--ink-soft` | `text-ink-soft`, `text-text-secondary` | body / secondary |
| `--ink-faint` | `text-ink-faint`, `text-text-tertiary` | metadata / labels |
| `--ink-ghost` | `text-ink-ghost`, `text-text-quaternary` | faintest |
| `--ochre` | `text-accent`, `bg-accent` | the one accent, used sparingly (≤10%) |
| `--ochre-deep` | `text-accent-muted` | accent hover |
| `--line` | `border-border-subtle`/`-default` | hairline border |
| `--line-strong` | `border-border-strong` | stronger hairline |

Ochre is for: active nav, index numbers/plate labels, link hover, the period in the wordmark, key marks. Never flood it. The warmth of the paper carries the brand.

## Typography

Three families, loaded via Google Fonts in `Layout.astro`:

- **Bricolage Grotesque** — display. Headings, the wordmark, large numerals. `font-display` / `font-grotesk` / `font-serif` all map here. Weight 400–500, tight tracking (`-0.02em`+). Set via `h1..h6` automatically.
- **Hanken Grotesk** — body & UI. `font-sans` (the default). Weights 300–700.
- **Spline Sans Mono** — labels, figures, captions, code. `font-mono` / `.mono`. Used for the catalogue texture: index numbers, wall labels, tech tags, dates, metadata.

Fluid scale tokens (use these for headings; `>=1.25` ratio): `--step--1` … `--step-6`. Body steps: `--step-0` (body), `--step-1` (lead). Hero display = `--step-6`; page titles = `--step-5`; section titles = `--step-3`.

Rules: body line-length ≤ ~68ch (`.container-text`, prose `max-width:68ch`). Light text needs air: body `line-height:1.6`. No all-caps body. Mono labels are uppercase + tracked (`.label`).

## Layout

- `--container: 84rem`, fluid `--gutter`. Wrap page content in `.container`.
- Strict, sometimes-visible grid. Hairline `.rule`s separate movements. Left-aligned, asymmetric; avoid centered-stack-everything.
- Catalogue numbering: sections carry an `.index-num` (`01`…`06`); photos carry plate labels (`Pl. 01`).
- Radius is minimal (`--radius: 0.125rem`); this is paper, not rounded cards. No nested cards. No side-stripe accent borders. No gradient text. No glassmorphism.

## Global CSS API (defined in `Layout.astro`, available everywhere)

**Structure:** `.container`, `.container-text`, `.gallery-main` (auto-applied to non-fullWidth `<main>`), `.rule` / `.rule-strong`, `.section` / `.section-sm`, `.section-head` / `.section-head--split`, `.section-title`, `.section-link`.

**Sub-page intro:** `.page-head`, `.page-title`, `.page-lead`.

**Atoms:** `.btn` (+`.btn-primary`, `.btn-ghost`), `.label` (mono uppercase kicker), `.index-num` (ochre mono index), `.link-underline` (animated underline), `.link-ochre`, `.tag` + `.tag-list` (pills), `.card` (bordered surface w/ hover), `.media-frame` (clips media; hosts parallax/zoom), `.wall-label` (+`.wall-label--hover` reveals on `.media-frame:hover`), `.mono` / `.font-display` / `.font-mono`.

**Do NOT** redefine these in a page's scoped `<style>`. Page-*unique* layout (grids specific to one page) may live in that page's scoped `<style>`, named distinctly.

### Skeleton for a new sub-page

```astro
---
import Layout from '../layouts/Layout.astro';
---
<Layout title="… — Morax Cheng" description="…">
  <header class="page-head">
    <span class="label">Kicker</span>
    <h1 class="page-title" data-reveal-lines>Page title</h1>
    <p class="page-lead" data-reveal>One-line lead.</p>
  </header>

  <section class="section">
    <div class="section-head section-head--split">
      <div><span class="index-num">01</span><h2 class="section-title" data-reveal-lines>Movement</h2></div>
      <a class="section-link link-underline" href="/x">All → </a>
    </div>
    <div data-stagger> … repeating items, each animates in … </div>
  </section>
</Layout>
```

(Full-bleed/hero pages pass `fullWidth={true}` and wrap their own `.container`s, like the homepage.)

## Motion — GSAP, declarative via data-attributes

GSAP (core + ScrollTrigger + SplitText + ScrambleText) is registered and driven **once, globally** in `Layout.astro`. **Pages must NOT import GSAP or write their own animation scripts.** You animate by adding data-attributes; the Layout wires them on `astro:page-load` and tears everything down on `astro:before-swap` (ClientRouter-safe). Everything is guarded by `prefers-reduced-motion` (reduced → content shown statically, counters jump to final).

| Attribute | Effect |
|---|---|
| `data-reveal` | fade + rise in as it scrolls into view (batched, lightly staggered) |
| `data-reveal-lines` | heading split into lines, mask-reveal upward on scroll. Put on `h*`. |
| `data-stagger` | container; its **direct children** rise + fade in sequence when it enters |
| `data-parallax="N"` | image inside `.media-frame` drifts ±N% on scroll (default 7) |
| `data-count="123"` | number counts up from 0 on enter (text content = final value as fallback) |
| `data-zoom` | media inside `.media-frame` scales subtly on hover (fine pointers) |
| `data-magnetic="0.3"` | element pulls toward the cursor (fine pointers); good for CTAs |
| `data-marquee="36"` | seamless scrolling track; **its content must be duplicated 2×** for the −50% loop |
| Hero: `data-hero` (container) + `data-hero-headline` (the h1, SplitText) + `data-hero-media` (clip-reveal) + `data-hero-item` (load-staggered) | first-load choreography |

**Showpiece flourishes (fine pointers only; never run under reduced-motion):**

| Attribute | Effect |
|---|---|
| `data-flux` (add to a heading that also has `data-reveal-lines` or `data-hero-headline`) | kinetic variable type: each glyph's `wght` eases toward the cursor (Bricolage is variable), plus a faint scroll-velocity breath. Resting weight 500 = unchanged; chars are only split when fine-pointer. |
| `data-halftone` (on `[data-hero-media]`) | WebGL "developing plate": the photo loads as an ochre+ink halftone screen and resolves to full colour on the hero timeline, with a faint living grain. The cursor stirs it into a fluid ink wake (recent-sample displacement field) that warps the image into dense halftone dots and settles back. Falls back to the clip-path reveal if WebGL is unavailable. |
| `data-image-trail` + `data-trail-images='[…json…]'` | gallery prints flick out along the cursor while it sweeps the element (recycled 12-node pool). Prints spawn only *outside* the `[data-hero-media]` photo, which is the halftone fluid zone. |
| `data-pin-section` + `data-pin-track` (inner) | pinned horizontal filmstrip (ScrollTrigger pin + scrub) on desktop via `gsap.matchMedia` (`min-width:1024px` + no-reduced adds `.is-pinned`); below that / reduced-motion it's a plain CSS swipe strip (`overflow-x:auto`). |
| `data-work-list` (on the Selected-work `<ol>`; each `.work-row` carries a `.work-row__ghost` index numeral) | "developing plate" hover on the work rows: the oversized index numeral (the projects have no photograph, so the *number* is the plate) fades + scales in and drifts with the cursor for parallax depth, while an ochre rule draws across the row and it warms (the draw + wash are pure CSS). The catalogue answer to a sparse list: each project gets a full plate. Fine pointers only. |
| `data-scramble` (on a mono catalogue mark: a section index number, a kicker `.label`, a census/ledger numeral) | the mark decodes from scrambled glyphs to its final value as it scrolls in (ScrambleText), like a wall-label being set in the printshop. Monospace marks only, so there is no reflow; numeric marks scramble through digits, text through A-Z. Runs once per mark; reduced-motion keeps the final text. |
| `data-draw-rule` (on an element with a structural top hairline) | the hairline strokes itself left-to-right (a CSS `::before` `scaleX(0→1)`) as the element enters. JS adds `.rule-armed` (hides) then `.is-drawn` (draws); **without JS or under reduced-motion the `::before` stays at its default `scaleX(1)`, statically visible** (so no separator ever vanishes). Used on the work list, the census + ledger, and the feature-post plate. |
| `data-velocity-skew` (on small, non-animated elements: the marquee words, the filmstrip plates) | scroll-velocity skew: the element leans up to ±9° with scroll speed and springs back upright. A single global `ScrollTrigger.onUpdate` reads `getVelocity()`, clamps it, and drives `skewX` on every tagged element via one `quickSetter`. Put it on elements **inside** a GSAP-driven track, never on the track itself (its transform is already owned by a tween). |
| `data-movement="Name"` (on each of the six `<section>`s) + `data-movement-index` (the fixed HUD markup) | catalogue movement indicator: a fixed bottom-left paper tab reads `0X / 06 · Name` with a 6-tick rail, tracking which movement is centred (one `ScrollTrigger` per section + a visibility trigger spanning 01→06). Homepage only (no-ops without the HUD); desktop + motion only (CSS hides it `<900px`; never built under reduced-motion). The paper backing keeps it legible over the full-bleed filmstrip. |

Notes: `data-reveal-lines`/`data-hero-headline` get `text-wrap: wrap` (never `balance`). Don't nest `data-reveal` inside a `data-stagger` (double-hide). After adding/removing many images, the Layout calls `ScrollTrigger.refresh()` on fonts-ready automatically.

## Copy voice

Precise, warm, understated. Every word earns its place; no restated headings. **No em dashes** (use commas, colons, periods, parentheses; `,` not `—`). Lowercase-friendly labels. Alt text is part of the voice ("The Eiffel Tower at dusk over the Seine", not "image").

## Content fidelity (when redesigning pages)

Preserve all real data verbatim: names, the email `james20081204@gmail.com`, GitHub `fzlzjerry` (+ `tjy-gitnub` for Windows 12 Web), LinkedIn URL, award details, certificate paths (`/certificates/*`), the 29 gallery photos in `/gallery/*.webp`, blog frontmatter. Project images `/projects/*.png` do **not** exist on disk — prefer typographic project treatments over `<img>` for them. Portrait is `/Morax.JPG`. 404 video is `/404.webm`.

## Stack notes

Astro 5 + Tailwind 3 + View Transitions (`<ClientRouter />`). GSAP 3.15 is an npm dep. Shiki code theme is `github-dark` (code blocks render dark on paper — intentional, `--code-bg`). Font Awesome + KaTeX load via CDN in `Layout.astro`.
