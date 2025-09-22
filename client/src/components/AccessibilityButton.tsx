import { useState } from 'react';
import AccessibilityPanel from './AccessibilityPanel';
import { ARIA_LABELS } from '../utils/accessibility';

const AccessibilityButton: React.FC = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const openPanel = () => setIsPanelOpen(true);
  const closePanel = () => setIsPanelOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={openPanel}
        className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent hover:text-accent transition-colors"
        aria-label={ARIA_LABELS.ACCESSIBILITY_SETTINGS}
        title="Paramètres d'accessibilité"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 9l4-4 4 4m0 6l-4 4-4-4"
          />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>

      <AccessibilityPanel
        isOpen={isPanelOpen}
        onClose={closePanel}
      />
    </>
  );
};

export default AccessibilityButton;