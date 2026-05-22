// client/src/components/ModalActions.tsx
// Responsabilité unique : Boutons d'action de la modal

import { ModalStylesService, type ModalType } from "@/utils/modalStyles";
import type React from "react";

interface ModalActionsProps {
  type: ModalType;
  onConfirm?: () => void;
  onCancel: () => void;
  confirmText: string;
  cancelText: string;
  showActions: boolean;
}

/**
 * Composant des actions de modal
 * Responsabilité unique : Rendu des boutons d'action
 */
const ModalActions: React.FC<ModalActionsProps> = ({
  type,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  showActions,
}) => {
  if (!showActions) {
    return null;
  }

  const typeConfig = ModalStylesService.getTypeConfig(type);
  const confirmButtonClass = typeConfig
    ? typeConfig.confirmButton
    : "bg-blue-600 hover:bg-blue-700 text-white";

  return (
    <div className="px-6 py-4 bg-surface-1 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
      {/* Bouton Annuler */}
      <button
        type="button"
        onClick={onCancel}
        className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-text bg-secondary border border-primary rounded-md hover:bg-primary focus:outline-none focus:ring-2 focus:ring-special focus:ring-offset-2"
      >
        {cancelText}
      </button>

      {/* Bouton Confirmer (si action de confirmation fournie) */}
      {onConfirm && (
        <button
          type="button"
          onClick={onConfirm}
          className={`w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmButtonClass}`}
        >
          {confirmText}
        </button>
      )}
    </div>
  );
};

export default ModalActions;
