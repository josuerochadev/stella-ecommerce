# Stella Design System

> Adopt a star. Personalise it. Make a piece of the sky your own.

Stella is a **fictional / portfolio e‑commerce app for buying stars**, built as a full‑stack
React + TypeScript + Tailwind front-end with an Express/PostgreSQL back-end. Marketing copy
and the entire UI are written in **French**. The brand voice is warm, romantic, and slightly
poetic — closer to a boutique gift shop than a tech catalogue.

This design system distills the codebase's tokens, type, components, and visual language so
designers and agents can produce on-brand mocks, slides, and prototypes without re-deriving
everything from source.

---

## Sources

- **Codebase:** `stella-ecommerce/` (mounted, read-only) — the React/TS client and the
  Node/Express server. Front-end lives at `stella-ecommerce/client/src`.
- **GitHub:** `josuerochadev/stella-ecommerce`
- **Tailwind theme:** `stella-ecommerce/client/tailwind.config.js`
- **Global CSS:** `stella-ecommerce/client/src/styles/index.css`
- **Screenshots:** `stella-ecommerce/docs/screenshots/` (homepage, catalog, product detail,
  cart, login, profile). Used only as a high-level visual sanity check — not as a source of
  truth.

The product is essentially a single surface: a marketing-flavoured e-commerce website
(no separate mobile app, no docs site). One UI kit covers it.

---

## Index

| File / folder | What it is |
|---|---|
| `README.md` | This file — brand context, content + visual foundations, iconography |
| `SKILL.md` | Agent skill manifest — drop into Claude Code as `~/.claude/skills/stella-design/` |
| `colors_and_type.css` | All color, type, spacing, radius, shadow tokens as CSS vars |
| `assets/` | Hero photography, the astronaut illustration, 18 star photographs |
| `preview/` | Cards displayed in the Design System tab — colors, type, components, etc. |
| `ui_kits/website/` | Pixel-faithful recreation of the Stella website (hero, catalog, detail, cart, login) |

---

## Content fundamentals

**Language.** French throughout. Tone is **vouvoiement** ("vous" not "tu") — polite, warm,
slightly old-world. Romantic without being saccharine.

**Voice.** The brand sells a feeling, not a product. Copy frames stars as gifts, memories,
"un morceau du ciel". Hero phrases rotate: *"Illuminer votre vie."* / *"Parcourir les
constellations et trouver la bonne étoile !"* / *"Adoptez une étoile voisine : votre coin
de ciel personnalisé !"* (all from `useHeroPhrases.ts`).

**Casing.** Sentence case for headings (*"Qui sommes-nous ?"*, *"Le saviez-vous ?"*,
*"Nouveautés"*) — never title case. Exclamation marks are common in CTAs and marketing
sections; commas use the French style with a non-breaking space before `?` `!` `:` `;`.

**Pronouns.** *"Nous"* for the brand; *"vous"* for the visitor. Never *"tu"*.

**Vocabulary.** Specific repeating words: *étoile*, *adopter*, *illuminer*, *constellation*,
*ciel*, *cosmos*, *univers*, *cadeau*, *certificat*. Avoid jargon, avoid English.

**Emoji.** Nearly absent. The README has a single 🌟 in the title, the rest of the product
uses none. **Don't add emoji** to UI copy.

**Microcopy examples (verbatim from the codebase):**
- Hero CTA: *Voir notre catalogue*
- Empty cart: *Votre panier est vide* / *Parcourir le catalogue*
- Auth prompt: *Connectez-vous pour accéder à votre compte.*
- "Did you know" eyebrow: *Le saviez-vous ?*
- Section invite: *Rejoignez-nous*
- Catalog tagline: *Illuminez votre vie* (animate-pulse next to the H1)

---

## Visual foundations

### Palette

A four-token brand palette (see `colors_and_type.css`):

| Token | Hex | Role |
|---|---|---|
| `primary` | `#3D2A54` | Deep cosmic purple. Header gradient start, raised panels, button hover. |
| `secondary` | `#1E1326` | Near-black plum. Cards, footer, deep surfaces. |
| `text` | `#AEC9FF` | Soft periwinkle "starlight". The default foreground on every dark surface. |
| `special` (alias `accent`) | `#FFB347` | Warm amber. CTA fill, focus rings, the eyebrow chip on the home page. |

Neutrals are derived inline (`text/70` for muted, `primary/20` for borders). Status colors
(`green-*`, `red-*`, `yellow-*`, `blue-*`) are pulled straight from Tailwind defaults and
appear only in toasts, error text, and the small red badge on the cart/wishlist icons.

The signature backgrounds are linear gradients:
```
background-default: linear-gradient(90deg, #3D2A54 0%, #1E1326 100%)
background-inverse: linear-gradient(90deg, #1E1326 0%, #3D2A54 100%)
```

Imagery is **deep, cool, slightly magenta-tinted space photography** — nebulae, starfields,
constellations. The `.hero-img-animate` class slowly zooms hero images while applying
`filter: brightness(50%)` so foreground text stays legible.

### Type

Four typefaces, no substitutions:

- **Dela Gothic One** (`font-display`) — heavy, almost stencil-like. Used **only for the
  hero H1 "Stella"** and a handful of section headings (`text-3xl font-display`).
- **Roboto Slab** (`font-serif`) — the marketing voice. Body paragraphs, H2s, hero subline.
- **Roboto** (`font-sans`) — neutral default. Body / form text inherited from `<body>`.
- **Bebas Neue** (`font-action`) — narrow, all-caps. **Buttons only**, with `tracking-wider`.

Type scale follows Tailwind defaults; hero H1 is `text-5xl md:text-6xl`. Body copy is
`text-lg font-serif`. Page titles are typically `text-3xl` or `text-4xl font-display` with
no ornament.

### Spacing & layout

Tailwind defaults (`4px` step). Cards use `p-4` to `p-6`, sections use `py-8`/`my-12`.
Container is `mx-auto px-4`/`px-8` with `pt-12` or `pt-20` to clear the fixed header.
The header is `h-12` and `fixed top-0` with `z-50`. The footer is plain centered text on
`bg-secondary`, `py-6 mt-12`. Cards are usually rounded `rounded-lg` with `shadow-lg`.

### Borders, radii, shadows

- Radii: `rounded-md` (buttons), `rounded-lg` (cards, filter panels), occasional `rounded`
  (small chips). Pills appear only on the cart/wishlist count badge (`rounded-full`).
- Borders: `border-2 border-primary` on catalog inputs; `border border-primary/20` on the
  search dropdown. No double-stroke or ornamental borders.
- Shadows: `shadow-lg` on cards by default, growing to `shadow-xl` on hover.
- A magenta-tinged **soft text glow** (`@keyframes softNeon`) animates the hero H1 on
  hover — captured as `--stl-glow-soft` / `--stl-glow-magenta`.

### Motion

- Default fade in/out: `transition-opacity duration-500 ease-in-out`.
- Card hover: `card-hover-effect` → `transition-all duration-300 ease-out` + `scale(1.02)
  translateY(-4px)` + `shadow-xl`.
- Button hover: `transition-transform duration-500 ease-in-out` → `scale(1.05)` + color
  swap from amber→purple. Press: `active:scale-95`.
- `stagger-children` selector animates first 6 children at 0.1s intervals.
- Hero image: 15s `subtleZoom` infinite (`scale 1 → 1.25 → 1`) with `brightness(50%)`.
- `prefers-reduced-motion` is fully respected (everything drops to 0.01ms).

### States

- **Hover (text/links):** `hover:text-white` lifts the periwinkle to pure white.
- **Hover (CTAs):** background swaps amber→purple; text swaps purple→periwinkle; scale up.
- **Active/press:** `active:scale-95`, sometimes `active:shadow-inner`.
- **Disabled:** `opacity-50 cursor-not-allowed`, no transform.
- **Focus:** `focus:ring-2 focus:ring-accent focus:ring-offset-2` on all interactive
  elements — accessibility is taken seriously (a full `AccessibilityPanel` exists with four
  themes incl. high-contrast).

### Transparency & blur

Used sparingly. Toasts use `backdrop-blur-sm` over `bg-{color}-900/90`. Search-bar borders
use `border-primary/20`. Muted text is `text-text/70`. **No frosted-glass nav, no global
blurred backgrounds.**

### Layout rules

- Header is fixed (`fixed top-0 z-50 h-12`) on a `bg-background-inverse` gradient.
- Pages start at `pt-12` or `pt-20` to clear it.
- Hero is full-viewport (`h-screen`) with the slick-carousel slider behind centered text.
- The catalog uses a centered `max-w-4xl` column.

### Imagery

- Hero photography: deep cool space scenes, dimmed to 50% brightness so the periwinkle text
  reads. Slow scale-zoom keeps them feeling alive.
- Star catalogue: square close-ups of named stars (Sirius, Vega, Betelgeuse, etc).
- One illustrated character: an astronaut PNG (`/assets/astro.png`) used in the
  *"Qui sommes-nous ?"* about block.

---

## Iconography

The codebase uses **react-icons / Font Awesome** (`react-icons/fa`). Icons are wrapped in a
single `utils/icons.tsx` factory so the rest of the code imports `<HomeIcon />`,
`<ShoppingCartIcon />`, etc. The full set in use is:

```
FaHome, FaSearch, FaStore, FaUser, FaShoppingCart, FaHeart,
FaTimes, FaBars, FaArrowLeft, FaArrowUp, FaArrowDown,
FaEye, FaTrash
```

Style: **solid, single-color, 1em-sized**. In headers they sit at `text-xl` (~20px). The
cart/wishlist badge is a small absolute-positioned pill (`-top-2 -right-2`,
`bg-red-600 text-white rounded-full w-5 h-5 text-xs`).

**For the design system,** we substitute **Lucide** via CDN
(`https://unpkg.com/lucide-static@latest/`) where exact Font Awesome glyphs aren't critical.
Lucide is stroked rather than filled, so when matching the website 1:1 use the
**solid-style FA icons** instead — most easily by including
`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css` and writing
`<i class="fas fa-shopping-cart"></i>`.

**No emoji** anywhere in the product. **No unicode glyphs** as icons. No custom illustrated
icon set — only react-icons/FA and the single astronaut PNG.

---

## Logos

The repo ships **without a dedicated logo file** — the brand is rendered as the literal word
*Stella* in Dela Gothic One, periwinkle on the cosmic gradient. The page favicon is the
unmodified Create-React-App default. We treat the **wordmark in Dela Gothic One** as the
canonical logo. See `preview/logo.html`.
