// client/src/hooks/useModalBehavior.ts
// Responsabilité unique : Gestion des comportements et événements de modal

import { useEffect, useState, RefObject } from 'react';

interface ModalBehaviorConfig {
  isOpen: boolean;
  onClose: () => void;
  closeOnEscape: boolean;
  modalRef: RefObject<HTMLElement | null>;
}

/**
 * Hook personnalisé pour gérer les comportements de modal
 * Responsabilité unique : Orchestration des événements et états de modal
 */
export const useModalBehavior = ({
  isOpen,
  onClose,
  closeOnEscape,
  modalRef,
}: ModalBehaviorConfig) => {
  const [isVisible, setIsVisible] = useState(false);

  /**
   * Gérer l'état de visibilité et l'accessibilité du body
   * Responsabilité : Synchronisation de l'état visuel et DOM
   */
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Empêcher le scroll du body et marquer comme hidden pour les lecteurs d'écran
      document.body.style.overflow = 'hidden';
      document.body.setAttribute('aria-hidden', 'true');
    } else {
      setIsVisible(false);
      // Restaurer le scroll et l'accessibilité
      document.body.style.overflow = '';
      document.body.removeAttribute('aria-hidden');
    }

    // Cleanup au démontage
    return () => {
      document.body.style.overflow = '';
      document.body.removeAttribute('aria-hidden');
    };
  }, [isOpen]);

  /**
   * Gérer les événements clavier et de fermeture
   * Responsabilité : Écoute et traitement des événements
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleCloseModal = () => {
      if (closeOnEscape) {
        onClose();
      }
    };

    // Écouter les événements personnalisés du focus trap
    const modalElement = modalRef.current;
    if (modalElement) {
      modalElement.addEventListener('close-modal', handleCloseModal);
      modalElement.addEventListener('escape-pressed', handleCloseModal);

      return () => {
        modalElement.removeEventListener('close-modal', handleCloseModal);
        modalElement.removeEventListener('escape-pressed', handleCloseModal);
      };
    }
  }, [isOpen, closeOnEscape, onClose, modalRef]);

  /**
   * Gérer le clic sur l'overlay
   * Responsabilité : Gestion des clics extérieurs
   */
  const handleOverlayClick = (e: React.MouseEvent, closeOnOverlayClick: boolean) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  /**
   * Gérer la confirmation avec fermeture automatique
   * Responsabilité : Orchestration des actions de confirmation
   */
  const handleConfirm = (onConfirm?: () => void) => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return {
    isVisible,
    handleOverlayClick,
    handleConfirm,
  };
};