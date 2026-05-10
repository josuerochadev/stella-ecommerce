# Stella Website — UI Kit

Pixel-faithful recreation of the Stella e-commerce website. Open `index.html` to see a
click-through prototype that walks: **Home → Catalog → Product detail → Cart → Login**.

## Components

- `Chrome.jsx` — fixed header (gradient, FA icons, cart/wishlist badges) + footer + page shell.
- `Hero.jsx` — full-bleed hero with rotating tagline + amber CTA.
- `Buttons.jsx` — primary, ghost, filter chips matching `.btn` and `.btn-filter` from `index.css`.
- `StarCard.jsx` — catalog/wishlist star card (image + body + CTAs).
- `Sections.jsx` — "Qui sommes-nous", "Nouveautés", "Le saviez-vous", "Rejoignez-nous".

All components consume `colors_and_type.css` (loaded by `index.html`).
