import { useEffect, useRef, useCallback } from 'react';
import { FocusTrap } from "@/utils/accessibility";

// Hook pour gérer le focus lors de l'ouverture/fermeture de modals
export const useFocusTrap = (isOpen: boolean) => {
  const elementRef = useRef<HTMLElement>(null);
  const focusTrapRef = useRef<FocusTrap | null>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen && elementRef.current) {
      // Sauvegarder l'élément actuellement focusé
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Créer et activer le focus trap
      focusTrapRef.current = new FocusTrap(elementRef.current);
      focusTrapRef.current.activate();

      // Écouter l'événement Escape pour fermer
      const handleEscape = () => {
        // Dispatch event pour notifier le composant parent
        elementRef.current?.dispatchEvent(new CustomEvent('close-modal'));
      };

      elementRef.current.addEventListener('escape-pressed', handleEscape);

      return () => {
        // Désactiver le focus trap
        if (focusTrapRef.current) {
          focusTrapRef.current.deactivate();
        }

        // Restaurer le focus sur l'élément précédent
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }

        elementRef.current?.removeEventListener('escape-pressed', handleEscape);
      };
    }
  }, [isOpen]);

  return elementRef;
};

// Hook pour gérer le focus sur les éléments dynamiques (listes, résultats de recherche)
export const useFocusOnChange = <T,>(
  data: T[],
  shouldFocus: boolean = false
) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (shouldFocus && data.length > 0 && containerRef.current) {
      // Annoncer les changements aux lecteurs d'écran
      const announcement = `${data.length} résultat${data.length > 1 ? 's' : ''} trouvé${data.length > 1 ? 's' : ''}`;

      // Créer une annonce temporaire
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      announcer.textContent = announcement;

      document.body.appendChild(announcer);

      // Focus sur le premier élément focusable du container
      setTimeout(() => {
        const firstFocusable = containerRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement;

        if (firstFocusable) {
          firstFocusable.focus();
        }

        // Nettoyer l'annonce
        document.body.removeChild(announcer);
      }, 100);
    }
  }, [data, shouldFocus]);

  return containerRef;
};

// Hook pour la navigation au clavier (ex: dans une liste de suggestions)
export const useKeyboardNavigation = (
  items: unknown[],
  onSelect: (index: number) => void,
  isOpen: boolean = false
) => {
  const activeIndexRef = useRef(-1);
  const containerRef = useRef<HTMLElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen || items.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          activeIndexRef.current = Math.min(activeIndexRef.current + 1, items.length - 1);
          updateFocus();
          break;

        case 'ArrowUp':
          e.preventDefault();
          activeIndexRef.current = Math.max(activeIndexRef.current - 1, -1);
          updateFocus();
          break;

        case 'Enter':
          e.preventDefault();
          if (activeIndexRef.current >= 0) {
            onSelect(activeIndexRef.current);
          }
          break;

        case 'Escape':
          e.preventDefault();
          activeIndexRef.current = -1;
          // Dispatch event pour fermer la liste
          containerRef.current?.dispatchEvent(new CustomEvent('close-list'));
          break;

        case 'Home':
          e.preventDefault();
          activeIndexRef.current = 0;
          updateFocus();
          break;

        case 'End':
          e.preventDefault();
          activeIndexRef.current = items.length - 1;
          updateFocus();
          break;
      }
    },
    [items, onSelect, isOpen]
  );

  const updateFocus = () => {
    if (!containerRef.current) return;

    const items = containerRef.current.querySelectorAll('[role="option"]');

    // Retirer l'état actif de tous les éléments
    items.forEach((item, index) => {
      item.setAttribute('aria-selected', index === activeIndexRef.current ? 'true' : 'false');
    });

    // Focuser l'élément actif
    if (activeIndexRef.current >= 0 && items[activeIndexRef.current]) {
      (items[activeIndexRef.current] as HTMLElement).focus();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      activeIndexRef.current = -1; // Reset à l'ouverture
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  // Reset quand les items changent
  useEffect(() => {
    activeIndexRef.current = -1;
  }, [items]);

  return {
    containerRef,
    activeIndex: activeIndexRef.current,
  };
};

// Hook pour gérer les messages d'erreur de formulaire
export const useFormAnnouncements = () => {
  const announcerRef = useRef<HTMLDivElement>(null);

  const announceError = useCallback((fieldName: string, errorMessage: string) => {
    if (announcerRef.current) {
      announcerRef.current.textContent = `Erreur dans le champ ${fieldName}: ${errorMessage}`;
    }
  }, []);

  const announceSuccess = useCallback((message: string) => {
    if (announcerRef.current) {
      announcerRef.current.textContent = message;
    }
  }, []);

  const createAnnouncer = () => (
    <div
      ref={announcerRef}
      aria-live="assertive"
      aria-atomic="true"
      className="sr-only"
    />
  );

  return {
    announceError,
    announceSuccess,
    Announcer: createAnnouncer,
  };
};