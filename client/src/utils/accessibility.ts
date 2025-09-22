// Utilitaires d'accessibilité pour WCAG 2.1 AA
export const ARIA_LABELS = {
  // Navigation
  MAIN_NAVIGATION: 'Navigation principale',
  BREADCRUMB: 'Fil d\'Ariane',
  PAGINATION: 'Navigation des pages',
  SEARCH: 'Recherche',

  // Actions
  ADD_TO_CART: 'Ajouter au panier',
  ADD_TO_WISHLIST: 'Ajouter à la liste de souhaits',
  REMOVE_FROM_CART: 'Retirer du panier',
  REMOVE_FROM_WISHLIST: 'Retirer de la liste de souhaits',

  // States
  LOADING: 'Chargement en cours',
  ERROR: 'Erreur',
  SUCCESS: 'Succès',
  REQUIRED_FIELD: 'Champ requis',

  // UI Elements
  CLOSE_DIALOG: 'Fermer la boîte de dialogue',
  EXPAND_MENU: 'Développer le menu',
  COLLAPSE_MENU: 'Réduire le menu',
  SHOW_PASSWORD: 'Afficher le mot de passe',
  HIDE_PASSWORD: 'Masquer le mot de passe',
  ACCESSIBILITY_SETTINGS: 'Paramètres d\'accessibilité',
} as const;

export const ARIA_DESCRIPTIONS = {
  STAR_RATING: (rating: number) => `Note de ${rating} étoiles sur 5`,
  PRICE: (price: number) => `Prix : ${price} euros`,
  CART_ITEMS: (count: number) => `${count} ${count > 1 ? 'articles' : 'article'} dans le panier`,
  WISHLIST_ITEMS: (count: number) => `${count} ${count > 1 ? 'articles' : 'article'} en favoris`,
  SEARCH_RESULTS: (count: number) => `${count} ${count > 1 ? 'résultats trouvés' : 'résultat trouvé'}`,
  PASSWORD_REQUIREMENTS: 'Minimum 8 caractères, incluant une majuscule, une minuscule et un chiffre',
} as const;

// Hook pour gérer les annonces aux lecteurs d'écran
export const useScreenReaderAnnounce = () => {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;

    document.body.appendChild(announcer);

    // Retirer l'élément après l'annonce
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  };

  return { announce };
};

// Utilitaire pour gérer le focus trap
export class FocusTrap {
  private element: HTMLElement;
  private focusableElements: HTMLElement[];
  private firstFocusable: HTMLElement;
  private lastFocusable: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
    this.focusableElements = this.getFocusableElements();
    this.firstFocusable = this.focusableElements[0];
    this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];
  }

  private getFocusableElements(): HTMLElement[] {
    const focusableSelectors = [
      'button',
      '[href]',
      'input',
      'select',
      'textarea',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    return Array.from(this.element.querySelectorAll(focusableSelectors))
      .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'))
      .filter(el => (el as HTMLElement).offsetParent !== null) as HTMLElement[]; // Visible elements only
  }

  public activate() {
    document.addEventListener('keydown', this.handleKeyDown);

    // Focus sur le premier élément
    if (this.firstFocusable) {
      this.firstFocusable.focus();
    }
  }

  public deactivate() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === this.firstFocusable) {
          e.preventDefault();
          this.lastFocusable.focus();
        }
      } else {
        // Tab
        if (document.activeElement === this.lastFocusable) {
          e.preventDefault();
          this.firstFocusable.focus();
        }
      }
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      // Dispatch custom event pour fermer le modal/dialog
      this.element.dispatchEvent(new CustomEvent('escape-pressed'));
    }
  };
}

// Utilitaire pour vérifier les contrastes de couleur
export const checkColorContrast = (foreground: string, background: string): {
  ratio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
} => {
  // Fonction simplifiée de calcul de contraste
  // En production, utiliser une librairie comme 'color-contrast-checker'
  const getLuminance = (_color: string): number => {
    // Implémentation simplifiée - en réalité plus complexe
    return 0.5; // Placeholder
  };

  const contrast1 = getLuminance(foreground);
  const contrast2 = getLuminance(background);

  const ratio = (Math.max(contrast1, contrast2) + 0.05) / (Math.min(contrast1, contrast2) + 0.05);

  return {
    ratio,
    wcagAA: ratio >= 4.5,
    wcagAAA: ratio >= 7,
  };
};

// Type definitions for accessibility components
export interface StatusMessageProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  id?: string;
}