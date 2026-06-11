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

GSAP (core + ScrollTrigger + SplitText + ScrambleText + DrawSVG) is registered and driven **once, globally** in `Layout.astro`. **Pages must NOT import GSAP or write their own animation scripts.** You animate by adding data-attributes; the Layout wires them on `astro:page-load` and tears everything down on `astro:before-swap` (ClientRouter-safe). Everything is guarded by `prefers-reduced-motion` (reduced → content shown statically, counters jump to final).

| Attribute | Effect |
|---|---|
| `data-reveal` | fade + rise in as it scrolls into view (batched, lightly staggered) |
| `data-reveal-lines` | heading split into lines, mask-reveal upward on scroll. Put on `h*`. |
| `data-reveal-clip` | media in a `.media-frame` is uncovered top-to-bottom by a `clip-path` wipe as it enters (a plate drawn from a sleeve). Put it on the frame itself, not a wrapper; composes with `data-zoom` / `data-tilt` (those own `transform`, this owns `clip-path`). Works on touch. Used on the gallery wall, the About portrait, certificate thumbs, and the 404 plate. Don't also put `data-reveal` on the same element (double-hide). |
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
| `data-pin-section` + `data-pin-track` (inner) | pinned horizontal filmstrip (ScrollTrigger pin + scrub) on desktop via `gsap.matchMedia` (`min-width:1024px` + no-reduced adds `.is-pinned`); below that / reduced-motion it's a plain CSS swipe strip (`overflow-x:auto`). The pin snaps to whole plates (`snapTo: 1/(N-1)`, directional), aligned with the HUD's `setCurrent` rounding, so a flick always settles with one frame centred and its own number showing.When pinned, the strip is a **3D gallery corridor**: the section carries `perspective: 1400px` and the track/plates keep `preserve-3d`, and each plate's `.filmstrip__card[data-strip-card]` wrapper owns the walk-driven `rotationY` (±32°, face-on at the current step) + `z` (+40px lifted at the current step → −260px receding), written by `quickSetter`s from the pin TWEEN's `onUpdate` (not the trigger's — scrub + snap keep moving the track after the trigger goes quiet). Angles map from WALK-INDEX space (`tween.progress() * (N-1)`, the same canonical mapping as `setCurrent` and the snap points, falloff 1.5 plates) — NOT from physical viewport centring, whose drift (snap step < plate pitch) would leave the lit plate visibly turned at the ends of the walk; index space keeps every snapped stop's lit plate exactly face-on, with zero per-frame layout reads. The lit/dim states (`opacity`, `saturate`) live on the CARD, never the `li`: grouping properties (opacity/filter/clip-path/mask) on the plate would force `transform-style: flat` and silently kill the corridor. The strip still hangs like a real wall: plates alternate ±1.25rem of vertical offset (`position: relative; top`, a paint-time channel no tween owns) and carry a near-wall `--shadow-2` at rest; the current plate is the lit print (`opacity 1`, `--shadow-4`) while neighbours recede to `opacity 0.6` + `saturate(0.55)`. Channel ledger: `li` = skewX (velocity) + paint `top`; card = corridor rotationY/z + CSS opacity/filter; `.media-frame` = tilt rotationX/Y + `--develop` clip + shadow; `img` = zoom scale; track = pin x. |
| `data-work-list` (on the Selected-work `<ol>`; each `.work-row` carries a `.work-row__ghost` index numeral) | "developing plate" hover on the work rows: the oversized index numeral (the projects have no photograph, so the *number* is the plate) fades + scales in and drifts with the cursor for parallax depth, while an ochre rule draws across the row and it warms (the draw + wash are pure CSS). The catalogue answer to a sparse list: each project gets a full plate. Fine pointers only.At rest the numeral keeps a faint print-through (`autoAlpha 0.22, scale 0.95`): a back sheet showing through the paper that hover pulls forward. |
| `data-scramble` (on a mono catalogue mark: a section index number, a kicker `.label`, a census/ledger numeral) | the mark decodes from scrambled glyphs to its final value as it scrolls in (ScrambleText), like a wall-label being set in the printshop. Monospace marks only, so there is no reflow; numeric marks scramble through digits, text through A-Z. Runs once per mark; reduced-motion keeps the final text. |
| `data-draw-rule` (on an element with a structural top hairline) | the hairline strokes itself left-to-right (a CSS `::before` `scaleX(0→1)`) as the element enters. JS adds `.rule-armed` (hides) then `.is-drawn` (draws); **without JS or under reduced-motion the `::before` stays at its default `scaleX(1)`, statically visible** (so no separator ever vanishes). Used on the work list, the census + ledger, and the feature-post plate. |
| `data-velocity-skew` (on small, non-animated elements: the marquee words, the filmstrip plates) | scroll-velocity skew: the element leans up to ±9° with scroll speed and springs back upright. A single global `ScrollTrigger.onUpdate` reads `getVelocity()`, clamps it, and drives `skewX` on every tagged element via one `quickSetter`. The same reader also surges every `data-marquee` track's `timeScale` (up to 3.5x, magnitude-only) so fast scrolling spins the press; both settle on one shared decay tween, and a hovered marquee stays at reading speed. Put it on elements **inside** a GSAP-driven track, never on the track itself (its transform is already owned by a tween). |
| `data-movement="Name"` (on each of the six `<section>`s) + `data-movement-index` (the fixed HUD markup) | catalogue movement indicator: a fixed bottom-left paper tab reads `0X / 06 · Name` with a 6-tick rail, tracking which movement is centred (one `ScrollTrigger` per section + a visibility trigger spanning 01→06). Homepage only (no-ops without the HUD); desktop + motion only (CSS hides it `<900px`; never built under reduced-motion). The paper backing keeps it legible over the full-bleed filmstrip. |
| `data-tilt="N"` (on media-frame plates: the homepage filmstrip, gallery cells, the About portrait) | 3D pointer tilt: the element rotates up to ±N° toward the cursor in perspective (`perspective` on the parent, `quickTo` on rotationX/Y). Pair it with a deepening `box-shadow` on `:hover` so the plate reads as lifting off the wall. Composes with velocity-skew, image zoom, and `data-reveal-clip` as separate transform / clip owners. Pointer-driven, so it does not jitter during a pin. Fine pointers only. |
| `data-draw-svg` (on an inline SVG `<path>`) | the stroke draws itself on scroll-enter (DrawSVGPlugin; JS arms it to `0%` then draws to `100%`; no-JS / reduced-motion keep it full). Used for the hand-drawn ochre underline-swoosh under the contact finale title. Give the path `vector-effect: non-scaling-stroke` if the SVG uses `preserveAspectRatio="none"`. |
| `data-chapter` (on an `aria-hidden` interstitial band before a movement) | between-movements chapter divider with a choreographed entrance on scroll-in: the giant ghost numeral scales + slides + fades in **and folds in from a 26° `rotationY` turn** (JS sets `perspective: 800` on the band). The entrance animates `.chapter__ghost-inner`, NOT the outer `.chapter__ghost`: the outer is a `data-depth` sheet and arming transforms there gets wiped at refresh (see the data-depth row). The timeline owns the inner's whole transform and lands it at identity so the stroked text ends crisp. Then the kicker (`.chapter__kicker`) rises, and the title (`.chapter__title`) mask-reveals line by line, the ochre plate landing a hair out of register and snapping in as the lines settle (`--misreg` 1→0 maps to a `text-shadow` offset on the runtime `.split-line`s; the CSS default 0 keeps perfect register without JS / under reduced-motion). SplitText + the whole entrance are built in `buildLineMotion` (so line breaks use final font metrics) via one timeline per band. Placed before movements 04 and 06. |
| `data-press-finale` + `data-press-src="/path.webp"` (on the homepage contact `<section>`) | the press finale: the cover photograph, sampled into ~16k of its halftone dots (same ochre+ink screen law as the hero, plus a print-contrast curve so the skyline carves out of the paper), hangs loose in 3D space over the closing plate and settles into register as the finale scrolls in (ScrollTrigger scrub on one `uProgress` uniform, per-dot seeded stagger). The pointer stirs the loose ink via the hero's decaying ring-buffer wake, **and parallaxes the camera**: the camera's x/y lerp toward the pointer as a pure TRUCK — position only, **never `lookAt`** (aiming at the plate projects it to the screen centre and tears it out of the designed right-of-centre, clear-of-the-email framing). With the axis fixed, near/far dots shift differentially while loose (scatter ≈ z −2..+1.6 world), which is the volumetric read. The sway amplitude is scaled by looseness (`× (1−progress)`, the same law as the cloud's slight `rotation.y` turn): loose ink floats with the hand, but the plate in REGISTER is printed — zero sway, exact authored framing, and its bottom edge stays clear of the email mark no matter where the pointer rests (the ring-buffer wake still stirs the printed dots locally). Camera glide lives inside the parked/woken `frame()` (the park condition waits for the glide to settle; `pointerleave` re-centres). three.js (`THREE.Points` + ShaderMaterial) ships as its own lazy chunk (`src/scripts/press-finale.ts`), fetched only when the finale approaches; desktop fine-pointer + `min-width:1024px` + motion + WebGL only, and the section's `.container` carries `z-index:1` so type always sits above the ink. Everyone else gets the section exactly as authored. Loupe-style park/wake (ticker + IntersectionObserver + self-park), full dispose on swap (tween + ST + geometry + renderer `forceContextLoss`). |
| `data-depth="r"` (unitless rate; on background marks and floating sheets page-wide: the hero cover plate 0.97, profile facts 0.97, the marquee band 0.94, the record folio ghost 0.94, both chapter ghosts 0.96, the proof contact-sheet 1.04, the feature-post rail 0.95, the contact regmark sheet 0.97 and title+swoosh 1.02) | scroll-rate paper sheets: the element traverses the viewport at rate `r` instead of 1 (r<1 = a farther sheet that lags; r>1 = a nearer one that leads), so the page reads as layered paper at different distances. One scrubbed tween per element over its scope's transit (scope = closest `figure`/`aside`/`.strip`/`section`; siblings sharing a scope drift as one rigid sheet); y is exactly 0 when the scope's centre crosses the viewport centre, so layout is true while you look at it. Owns ONLY the `y` px channel: composes with scale (hero settle), clip-path, `xPercent`/`yPercent` (img parallax, split lines), `skewX`, tilt rotation, CSS vars and textContent. Never put it on a node whose `y` a tween owns (`data-reveal`, stagger children, `data-hero-item`) and never inside `[data-pin-section]` (guarded). The inverse also holds: never ARM other transform channels (a `gsap.set` of scale/rotation/xPercent waiting for an entrance) on a depth-tagged node — the depth tween's `invalidateOnRefresh` wipes them from the transform cache at the next `ScrollTrigger.refresh()`, silently reducing the entrance to its non-transform channels. Give the entrance an inner wrapper instead (see the chapter ghosts' `.chapter__ghost-inner`). Continuously re-written channels (the hero scene's pointer z, the settle scrub's scale) are fine: they re-assert every frame. Built AFTER the filmstrip pin (triggers below a pin only see its spacer if the pin exists first). Desktop `min-width:1024px` + motion only via `gsap.matchMedia`; below that / reduced-motion: zero transforms, page as authored. |
| `data-scene-3d="1300"` (on the hero `.container`; value = perspective px) + `data-scene-layer="z"` (on its direct children: hero top labels 18, rule 12, the title 55, the lead row 30, the cover figure −55) | hero 3D paper stack: at REST every sheet sits at z:0 / rotation 0 (pixel-identical page, crisp type, the measured fold untouched). On fine pointers, entering the hero eases each layer apart to its z depth while the whole stack tilts ±2.2° toward the cursor (`quickTo` rotationX/Y on the scene, one z `quickTo` per layer); leaving settles back to exact identity. The differential motion between sheets is the 3D. `z` is each layer's NEW exclusive channel (the figure keeps scale = hero settle, y = data-depth; GSAP composes channels per element) — never `clearProps` a layer (it wipes the whole inline transform); teardown kills the z tweens and sets z:0. The image-trail prints mount on the section, outside the scene, and stay at the screen plane on purpose. |

Notes: `data-reveal-lines`/`data-hero-headline` get `text-wrap: wrap` (never `balance`). Don't nest `data-reveal` inside a `data-stagger` (double-hide). After adding/removing many images, the Layout calls `ScrollTrigger.refresh()` on fonts-ready automatically.

## Copy voice

Precise, warm, understated. Every word earns its place; no restated headings. **No em dashes** (use commas, colons, periods, parentheses; `,` not `—`). Lowercase-friendly labels. Alt text is part of the voice ("The Eiffel Tower at dusk over the Seine", not "image").

## Content fidelity (when redesigning pages)

Preserve all real data verbatim: names, the email `james20081204@gmail.com`, GitHub `fzlzjerry` (+ `tjy-gitnub` for Windows 12 Web), LinkedIn URL, award details, certificate paths (`/certificates/*`), the 29 gallery photos in `/gallery/*.webp`, blog frontmatter. Project images `/projects/*.png` do **not** exist on disk — prefer typographic project treatments over `<img>` for them. Portrait is `/Morax.JPG`. 404 video is `/404.webm`.

## Stack notes

Astro 5 + Tailwind 3 + View Transitions (`<ClientRouter />`). The sticky `<header>` is `transition:persist`, so it stays a fixed masthead while page content cross-fades beneath it (a running-header page-turn). Because a persisted node keeps its server-rendered active state, `Layout.astro` re-applies `is-active`/`aria-current` to the nav on `astro:after-swap` (`updateActiveNav`). Do NOT add a `transition:name` to the wordmark as well: persisting the whole header already keeps it in place, and a duplicate transition name would abort the swap. GSAP 3.15 is an npm dep. Shiki code theme is `github-dark` (code blocks render dark on paper — intentional, `--code-bg`). Font Awesome + KaTeX load via CDN in `Layout.astro`.
