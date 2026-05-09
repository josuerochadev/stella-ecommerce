// client/src/components/ModalContent.tsx
// Responsabilité unique : Rendu du contenu principal de la modal

import { ARIA_LABELS } from "@/utils/accessibility";
import { ModalStylesService, type ModalType } from "@/utils/modalStyles";
import type React from "react";
import ModalIcon from "./ModalIcon";

interface ModalContentProps {
  type: ModalType;
  title: string;
  message?: string;
  children?: React.ReactNode;
  showCloseButton: boolean;
  onClose: () => void;
}

/**
 * Composant de contenu de modal
 * Responsabilité unique : Affichage du contenu principal
 */
const ModalContent: React.FC<ModalContentProps> = ({
  type,
  title,
  message,
  children,
  showCloseButton,
  onClose,
}) => {
  const typeConfig = ModalStylesService.getTypeConfig(type);

  return (
    <div className="p-6">
      {/* En-tête avec icône et titre */}
      <div className="flex items-start">
        {typeConfig && (
          <div className={`flex-shrink-0 ${typeConfig.iconColor} mr-3`}>
            <ModalIcon type={type} />
          </div>
        )}

        <div className="flex-1">
          <h3 id="modal-title" className="text-lg font-medium text-text mb-2">
            {title}
          </h3>

          {message && <p className="text-sm text-text/70 mb-4">{message}</p>}

          {children && <div className="text-sm text-text">{children}</div>}
        </div>

        {/* Bouton de fermeture */}
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            className="ml-4 bg-secondary rounded-md text-text/50 hover:text-text focus:outline-none focus:ring-2 focus:ring-special"
            aria-label="Fermer la modal"
          >
            <span className="sr-only">Fermer</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ModalContent;
