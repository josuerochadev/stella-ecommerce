# Audit UX & Experience Produit — Stella E-Commerce

**Date** : 2026-05-09
**Scope** : client/ (frontend complet)
**Note globale** : 4.5/10

---

## Resume

L'application possede des fondations solides — composant `FormInput` accessible, systeme de toasts complet, JSON-LD sur les pages produit, images WebP avec lazy loading — mais souffre de defauts architecturaux majeurs : les animations ne respectent pas `prefers-reduced-motion` malgre une infrastructure partiellement en place, deux composants cles (navigation mobile, skip links) ne sont jamais montes dans l'app, et le formulaire de contact est non fonctionnel. La conformite WCAG 2.1 AA reste partielle : les interactions au clavier sur les overlays mobiles sont bloquantes, et les filtres catalogue non persistes dans l'URL degradent l'UX partageable.

---

## Tableau de synthese

| Categorie                        | Critique | Important | Mineur |
| -------------------------------- | -------- | --------- | ------ |
| Animations / reduced-motion      | 7        | 3         | 3      |
| Formulaires / Feedback           | 2        | 5         | 0      |
| Navigation / Routing             | 3        | 6         | 1      |
| Accessibilite / Semantique HTML  | 1        | 5         | 2      |
| **Total**                        | **13**   | **19**    | **6**  |

---

## Critique — a corriger maintenant

### A1. Slider hero en autoplay sans prefers-reduced-motion

- **Fichier** : `client/src/components/HeroSection.tsx:16-17`
- **Probleme** : `autoplay: true` et `autoplaySpeed: 5000` sur le slider `react-slick` sans aucune condition `prefers-reduced-motion`. Le carrousel defile automatiquement pour tous les utilisateurs.
- **Impact** : violation WCAG 2.3.3. Peut provoquer des vertiges ou des crises chez les utilisateurs sensibles au mouvement.

### A2. Hero image animation infinie non protegee

- **Fichier** : `client/src/styles/index.css:406-421`
- **Probleme** : `.hero-img-animate { animation: subtleZoom 15s ease-in-out infinite }` sans `@media (prefers-reduced-motion: reduce)`. S'applique a toutes les images du slider. Combinee avec A1, c'est une double source de mouvement non controle.

### A3. FadeInSection non protege

- **Fichier** : `client/src/components/FadeInSection.tsx:25-27`
- **Probleme** : Animations d'apparition au scroll (opacity + translateY via `react-intersection-observer`) sans detection de `prefers-reduced-motion`. Utilise sur Home et Catalog pour animer tous les blocs de contenu.

### A4. Animations infinies CSS sans protection

- **Fichier** : `client/src/styles/index.css:264-328`
- **Probleme** : Trois keyframes infinies sans `@media (prefers-reduced-motion: reduce)` : `shimmer` (1.5s, classe `.skeleton-shimmer`), `smooth-bounce` (2s, classe `.smooth-bounce`), `pulse-glow` (2s, classe `.animate-pulse-glow`).

### A5. H1 neon hover — animation infinie au survol

- **Fichier** : `client/src/styles/index.css:390-403`
- **Probleme** : `.h1-neon:hover { animation: softNeon 2s ease-in-out infinite alternate }` sans protection. Utilise sur le H1 "Stella" de `Home.tsx:33`.

### A6. animate-pulse non conditionnel sur Catalog

- **Fichier** : `client/src/pages/Catalog.tsx:125`
- **Probleme** : `animate-pulse` Tailwind sur un `<span>` de texte sans variante `motion-safe:`.

### A7. Aucun variant motion-safe / motion-reduce Tailwind configure

- **Fichier** : `client/tailwind.config.js`
- **Probleme** : Aucun variant `motion-safe:` / `motion-reduce:` active. La media query globale dans `index.css:102-107` existe mais toutes les animations individuelles ignorent les variables CSS `--animation-duration` et `--transition-duration` declarees dans le meme fichier.

### B1. Formulaire de contact = stub sans API

- **Fichier** : `client/src/pages/Contact.tsx:14-17`
- **Probleme** : `handleSubmit` ne fait que `setSubmitted(true)`. Aucun appel API. L'utilisateur croit envoyer un message — rien ne se passe cote serveur.
- **Impact** : fonctionnalite completement non fonctionnelle.

### B2. Suppression panier sans confirmation

- **Fichier** : `client/src/components/CartStarCard.tsx:75-78`
- **Probleme** : Le bouton de suppression appelle directement `onRemove` sans dialog de confirmation. Le store `useNotificationStore.ts:124` possede un `showConfirm` pret a l'emploi mais non utilise.
- **Impact** : action irreversible sans filet de securite.

### C1. MobileNavigation et SkipLinks jamais montes

- **Fichiers** : `client/src/components/MobileNavigation.tsx`, `client/src/components/SkipLinks.tsx`
- **Probleme** : Ces deux composants ne sont jamais importes ni montes dans l'application (`App.tsx`, `Header.tsx`). Consequence directe : pas de barre de navigation mobile, pas de skip links WCAG accessibles en pratique.
- **Impact** : navigation mobile limitee aux seules icones du header. Skip to main inexistant.

### C2. Pas de page 404

- **Fichier** : `client/src/App.tsx:143`
- **Probleme** : `<Route path="*" element={<Navigate to="/" />} />` redirige silencieusement vers l'accueil sans message d'erreur.
- **Impact** : UX degrades, pas de signal clair a l'utilisateur en cas d'URL invalide.

### C3. Filtres catalogue non persistes dans l'URL

- **Fichier** : `client/src/pages/Catalog.tsx:53-55`
- **Probleme** : Seule la query de recherche est synchronisee dans l'URL. Prix, magnitude, constellation et tri vivent uniquement dans le store Zustand. Un refresh ou un lien partage perd tous les filtres.

### D1. Overlay mobile non accessible au clavier

- **Fichier** : `client/src/components/MobileMenuOverlay.tsx:20`
- **Probleme** : L'overlay de fermeture est un `<div onClick={onClose}>` sans `role="button"`, `tabIndex`, ni `aria-label`. Non atteignable ni activable au clavier.

---

## Important — a planifier

### A8. CatalogStarCard zoom 600ms non protege

- **Fichier** : `client/src/components/CatalogStarCard.tsx:41`
- **Probleme** : `transition-transform duration-[600ms] hover:scale-105` — 600 ms est au-dessus du seuil perceptible, aucune variante `motion-safe:`.

### A9. 7 occurrences d'animate-spin sans motion-safe

- **Fichiers** : `FormContainer.tsx:56`, `Login.tsx:114`, `Register.tsx:144`, `Button.tsx:81`, `CollectionButton.tsx:150`, `SearchBar.tsx:102`, `SearchInputField.tsx:81`
- **Probleme** : Spinners de chargement sans variante `motion-safe:`. Tailwind desactiverait leur animation avec `motion-reduce:` mais aucune alternative statique n'est prevue.

### A10. .stagger-children sans protection

- **Fichier** : `client/src/styles/index.css:219-240`
- **Probleme** : `.stagger-children > *` applique `fade-slide-in` avec des delais jusqu'a 0.6 s sans `@media (prefers-reduced-motion: reduce)`.

### B3. Validation formulaires uniquement au submit

- **Fichiers** : `Login.tsx`, `Register.tsx`, `Checkout.tsx`, `Contact.tsx`
- **Probleme** : Pas de validation temps reel. Sur des formulaires longs (Checkout), l'utilisateur decouvre toutes les erreurs en une seule fois au submit.

### B4. aria-live manquant sur ChangePasswordForm

- **Fichier** : `client/src/components/ChangePasswordForm.tsx:69-70`
- **Probleme** : Messages de succes et d'erreur sans `role="alert"` ni `aria-live`. Les lecteurs d'ecran ne les annoncent pas.

### B5. Cibles tactiles trop petites sur la quantite panier

- **Fichier** : `client/src/components/CartStarCard.tsx:50,59`
- **Probleme** : Boutons `+` / `-` en `w-8 h-8` (32 px). Recommandation WCAG 2.5.5 : 44 x 44 px minimum.

### B6. Pas de toast pour ajout au panier / wishlist

- **Fichiers** : `AddToCartButton.tsx`, `AddToWishlistButton.tsx`
- **Probleme** : Le store `useNotificationStore.ts` est complet mais non appele apres ces actions. L'utilisateur n'a pas de confirmation claire de l'ajout.

### B7. Empty state manquant pour la wishlist vide

- **Probleme** : Le composant `CartEmptyState.tsx` existe pour le panier mais n'est pas adapte ni utilise pour la wishlist vide.

### C4. Routes /settings et /search cassees

- **Fichiers** : `MobileMenuOverlay.tsx:62`, `MobileNavigation.tsx:26`
- **Probleme** : Liens vers `/settings` et `/search` sans route correspondante dans `App.tsx`. Destination : redirect silencieux vers home.

### C5. Footer non responsive sur mobile

- **Fichier** : `client/src/components/Footer.tsx:9`
- **Probleme** : `flex justify-between flex-wrap` sans passage en `flex-col` sur mobile. Sur ecrans < 600 px les liens s'empilent de facon non controlee.

### C6. Toast width fixe sur tres petit mobile

- **Fichier** : `client/src/components/Toast.tsx:45`
- **Probleme** : `min-w-[320px]` fixe. Sur iPhone SE (375 px) avec padding, les toasts depassent le viewport.

### C7. Sticky Checkout non-responsive

- **Fichier** : `client/src/pages/Checkout.tsx:168`
- **Probleme** : `sticky top-24` actif sur toutes les tailles d'ecran. Sur mobile (1 colonne), le resume reste sticky et peut chevaucher le formulaire.

### C8. Pas de breadcrumb

- **Pages** : `ProductDetail`, `Catalog`
- **Probleme** : Aucun composant Breadcrumb. L'utilisateur ne peut pas identifier sa position dans la hierarchie du site.

### C9. Pas d'aria-current sur les liens de navigation

- **Probleme** : Aucun `aria-current="page"` ni active state visuel sur les liens de la navigation principale.

### D2. Composant SEO manquant sur plusieurs pages

- **Fichiers** : `pages/Checkout.tsx`, `pages/FAQ.tsx`, `pages/Orders.tsx`, `pages/OrderConfirmation.tsx`
- **Probleme** : Ces pages heritent du `<title>` generique de `index.html` au lieu d'avoir un titre specifique via le composant `<SEO>`.

### D3. Donnees structurees JSON-LD manquantes

- **Probleme** : JSON-LD present uniquement sur `App.tsx` (Organization) et `ProductDetail.tsx` (Product). Absent sur `/catalog` (CollectionPage), `/contact` (ContactPage), `/faq` (FAQPage).

### D4. autoFocus inconditionnelle dans AccessibleSearchBox

- **Fichier** : `client/src/components/AccessibleSearchBox.tsx:117`
- **Probleme** : `autoFocus={true}` fixe dans le composant. Sur mobile et avec certains lecteurs d'ecran, provoque un scroll inattendu et peut perturber la navigation.

### D5. Table Admin sans caption

- **Fichier** : `client/src/pages/Admin.tsx:195-199`
- **Probleme** : `<table>` de la liste des utilisateurs sans `<caption>`. Les lecteurs d'ecran ne peuvent pas identifier le contenu du tableau.

### D6. Contraste des textes en opacite reduite non verifie

- **Probleme** : `text-text/40`, `text-text/50`, `text-text/70` utilises frequemment pour sous-titres et descriptions. Ces valeurs n'ont pas ete testees contre le ratio WCAG AA (4.5:1) sur les fonds concernes.

---

## Mineur — nice to have

### E1. URLs produit sans slug textuel

- **Fichier** : `client/src/App.tsx:88`
- **Probleme** : `/star/123` au lieu de `/star/123-polaris`. Sous-optimal pour le SEO et la lisibilite.

### E2. Lien home icon-only sans aria-label

- **Fichier** : `client/src/components/Navigation.tsx:13`
- **Probleme** : Lien vers home avec icone SVG uniquement, sans `aria-label`.

### E3. Variables CSS --animation-duration non consommees

- **Fichier** : `client/src/styles/index.css:22-23`
- **Probleme** : `--animation-duration` et `--transition-duration` sont gerees par `accessibilityThemes.ts` mais aucune animation ou transition dans le codebase ne les utilise reellement.

### E4. .screen-reader-optimized jamais appliquee

- **Fichier** : `client/src/styles/index.css:96-98`
- **Probleme** : La classe desactive toutes les animations mais n'est appliquee sur aucun element dans le DOM.

### E5. FAQ accordion — preferer details/summary HTML natif

- **Fichier** : `client/src/components/FAQ.tsx:50-60`
- **Probleme** : Accordion implemente avec `<div>` + `<button>`. L'element `<details>/<summary>` fournirait le comportement et l'accessibilite sans JavaScript supplementaire.

### E6. Variants motion-safe / motion-reduce pas dans tailwind.config.js

- **Fichier** : `client/tailwind.config.js`
- **Probleme** : Les variantes Tailwind specifiques au mouvement ne sont pas configurees, rendant impossible l'usage de `motion-safe:` / `motion-reduce:` sur les classes utilitaires.

---

## Plan de correction par phases

### Phase 1 — prefers-reduced-motion (WCAG prioritaire)

| #  | Action                                                              | Cible                                    | Ref |
| -- | ------------------------------------------------------------------- | ---------------------------------------- | --- |
| 1  | Activer variants `motion-safe` / `motion-reduce` dans Tailwind      | `tailwind.config.js`                     | A7  |
| 2  | Conditionner le `autoplay` du slider a `prefers-reduced-motion`     | `HeroSection.tsx`                        | A1  |
| 3  | Ajouter `@media (prefers-reduced-motion)` sur `.hero-img-animate`   | `index.css:406-421`                      | A2  |
| 4  | Proteger `FadeInSection` avec `useReducedMotion`                    | `FadeInSection.tsx`                      | A3  |
| 5  | Ajouter protection sur les keyframes infinies (shimmer, bounce, glow)| `index.css:264-328`                     | A4  |
| 6  | Proteger `.h1-neon:hover` et `.stagger-children`                    | `index.css:390-403`, `index.css:219-240` | A5, A10 |
| 7  | Remplacer `animate-pulse` par `motion-safe:animate-pulse`           | `Catalog.tsx:125`                        | A6  |
| 8  | Ajouter `motion-safe:` sur `animate-spin` (7 fichiers)              | Composants loaders                       | A9  |
| 9  | Reduire `duration-[600ms]` et ajouter `motion-safe:`               | `CatalogStarCard.tsx:41`                 | A8  |

### Phase 2 — Navigation & Routing

| #  | Action                                                              | Cible                                    | Ref |
| -- | ------------------------------------------------------------------- | ---------------------------------------- | --- |
| 10 | Creer la page `NotFound.tsx` et l'ajouter comme route 404          | `App.tsx:143`, nouveau composant         | C2  |
| 11 | Monter `SkipLinks` dans `App.tsx` (avant le header)                | `App.tsx`, `SkipLinks.tsx`               | C1  |
| 12 | Monter `MobileNavigation` dans `App.tsx`                           | `App.tsx`, `MobileNavigation.tsx`        | C1  |
| 13 | Fixer `role="button"` + `tabIndex` sur overlay `MobileMenuOverlay` | `MobileMenuOverlay.tsx:20`               | D1  |
| 14 | Supprimer ou corriger les routes `/settings` et `/search`          | `MobileMenuOverlay.tsx:62`               | C4  |
| 15 | Persister les filtres catalogue dans l'URL (query params)          | `Catalog.tsx`, `useCatalogSearch.ts`     | C3  |

### Phase 3 — Formulaires & Feedback

| #  | Action                                                              | Cible                                    | Ref |
| -- | ------------------------------------------------------------------- | ---------------------------------------- | --- |
| 16 | Implanter l'appel API dans le formulaire Contact                   | `Contact.tsx:14-17`                      | B1  |
| 17 | Ajouter `showConfirm` avant suppression dans CartStarCard          | `CartStarCard.tsx:75-78`                 | B2  |
| 18 | Ajouter toast de confirmation ajout panier / wishlist              | `AddToCartButton.tsx`, `AddToWishlistButton.tsx` | B6 |
| 19 | Ajouter `role="alert"` sur messages erreur/succes ChangePassword   | `ChangePasswordForm.tsx:69-70`           | B4  |
| 20 | Augmenter cibles tactiles +/- a 44px                              | `CartStarCard.tsx:50,59`                 | B5  |
| 21 | Creer empty state pour wishlist vide                               | `Wishlist.tsx`                           | B7  |

### Phase 4 — Accessibilite & Semantique

| #  | Action                                                              | Cible                                    | Ref |
| -- | ------------------------------------------------------------------- | ---------------------------------------- | --- |
| 22 | Ajouter `<SEO>` sur Checkout, FAQ, Orders, OrderConfirmation       | 4 pages                                  | D2  |
| 23 | Ajouter JSON-LD CollectionPage sur Catalog                         | `Catalog.tsx`                            | D3  |
| 24 | Ajouter JSON-LD ContactPage sur Contact                            | `Contact.tsx`                            | D3  |
| 25 | Ajouter JSON-LD FAQPage sur FAQ                                    | `FAQ.tsx`                                | D3  |
| 26 | Ajouter `aria-current="page"` sur liens nav actifs                 | `Navigation.tsx`, `MobileNavigation.tsx` | C9  |
| 27 | Ajouter `<caption>` a la table Admin                               | `Admin.tsx:195-199`                      | D5  |
| 28 | Rendre `autoFocus` optionnel dans AccessibleSearchBox              | `AccessibleSearchBox.tsx:117`            | D4  |

### Phase 5 — Responsive & Polish

| #  | Action                                                              | Cible                                    | Ref |
| -- | ------------------------------------------------------------------- | ---------------------------------------- | --- |
| 29 | Rendre le Footer responsive (`flex-col md:flex-row`)               | `Footer.tsx:9`                           | C5  |
| 30 | Corriger Toast width sur XS (`min-w-[min(320px,100vw-2rem)]`)      | `Toast.tsx:45`                           | C6  |
| 31 | Desactiver sticky Checkout sur mobile (`md:sticky`)                | `Checkout.tsx:168`                       | C7  |
| 32 | Ajouter `aria-label` sur le lien home icon-only                    | `Navigation.tsx:13`                      | E2  |
| 33 | Migrer FAQ accordion vers `<details>/<summary>`                    | `FAQ.tsx`                                | E5  |
| 34 | Lier `--animation-duration` aux transitions CSS existantes          | `index.css`                              | E3  |

---

## Points positifs a conserver

- **FormInput** : labels, aria-required, aria-invalid, aria-describedby, messages d'erreur situes pres du champ
- **Systeme Toast** : complet (success, error, warning, info, confirm), portal rendering, auto-close, aria-label
- **JSON-LD** : Organization sur App.tsx et Product sur ProductDetail.tsx
- **Images** : balises `<picture>` WebP, lazy loading, width/height pour prevenir CLS
- **FocusTrap** : bien implemente dans AccessibleModal
- **Autocomplete** : attributs corrects (given-name, family-name, email, current-password, new-password)
- **Media query globale** : `@media (prefers-reduced-motion: reduce)` presente dans index.css (a completer)
- **Panel d'accessibilite** : permet a l'utilisateur de controler les animations via `reducedMotion`
- **Skip links** : composant existe, a activer (Phase 2)
- **SEO component** : centralise les meta, og:, canonical — bien structure

---

## Statut des phases

| Phase | Titre                            | Statut      |
| ----- | -------------------------------- | ----------- |
| 1     | prefers-reduced-motion           | ✅ Complete  |
| 2     | Navigation & Routing             | ✅ Complete  |
| 3     | Formulaires & Feedback           | ✅ Complete  |
| 4     | Accessibilite & Semantique       | ✅ Complete  |
| 5     | Responsive & Polish              | ⬜ A faire   |

## Journal des corrections

### Phase 1 — prefers-reduced-motion (2026-05-09)

- **Nouveau hook** `useReducedMotion.ts` : detecte `prefers-reduced-motion` avec listener dynamique
- `HeroSection.tsx` : autoplay et fade conditionnes au hook ; slider s'arrete pour les utilisateurs sensibles
- `FadeInSection.tsx` : court-circuite completement l'animation au scroll si reduced-motion
- `index.css` : 6 blocs `@media (prefers-reduced-motion: reduce)` ajoutes pour :
  - `.skeleton-shimmer::before` (shimmer infini)
  - `.smooth-bounce`, `.fade-slide-in`, `.stagger-children > *`
  - `.animate-shimmer`, `.animate-smooth-bounce`, `.animate-fade-slide-in`, `.animate-pulse-glow`
  - `.h1-neon:hover` (softNeon infini)
  - `.hero-img-animate` (subtleZoom 15s)
  - `.star-card-img` (transition + hover scale) + duree reduite 0.6s → 0.3s
- `Catalog.tsx:125` : `animate-pulse` → `motion-safe:animate-pulse`
- `CatalogStarCard.tsx` : transition carte et image protegees avec `motion-safe:` ; duree image 600ms → 300ms
- 8 spinners (`Button`, `FormContainer`, `Login`, `Register`, `CollectionButton`, `SearchBar`, `SearchInputField`, `AccessiblePageLayout`) : `animate-spin` → `motion-safe:animate-spin`

### Phase 4 — Accessibilite & Semantique (2026-05-09)

- `Checkout.tsx`, `Orders.tsx`, `OrderConfirmation.tsx` : ajout du composant `<SEO>` avec title, description, path
- `FAQ.tsx` : ajout `<SEO>` + JSON-LD `FAQPage` genere depuis le tableau `faqItems` (5 Q&A)
- `Catalog.tsx` : ajout JSON-LD `CollectionPage` via `<Helmet>` (complementaire au `<SEO>` existant)
- `Contact.tsx` : ajout JSON-LD `ContactPage` via `<Helmet>` (complementaire au `<SEO>` existant)
- `Navigation.tsx` : ajout `useLocation`, `aria-label="Accueil"` et `aria-current="page"` sur le lien home
- `MobileNavigation.tsx` : ajout `aria-current={isActive(item.path) ? "page" : undefined}` et `aria-label` sur chaque lien
- `Admin.tsx` : ajout `<caption className="sr-only">` sur la table `UsersView`
- `AccessibleSearchBox.tsx` : `autoFocus={true}` → `autoFocus={isVisible}` (focus conditionnel a l'ouverture du panneau)
