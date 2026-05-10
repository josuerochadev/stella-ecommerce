import { ARIA_LABELS } from "@/utils/accessibility";
import { ACCESSIBILITY_THEMES, useAccessibilitySettings } from "@/utils/accessibilityThemes";
import { useState } from "react";
import AccessibleModal from "./AccessibleModal";

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, resetSettings, themes, currentTheme } =
    useAccessibilitySettings();

  const handleThemeChange = (theme: keyof typeof ACCESSIBILITY_THEMES) => {
    updateSettings({ theme });
  };

  const handleToggleReducedMotion = () => {
    updateSettings({ reducedMotion: !settings.reducedMotion });
  };

  const handleToggleHighContrastImages = () => {
    updateSettings({ highContrastImages: !settings.highContrastImages });
  };

  const handleToggleScreenReaderOptimized = () => {
    updateSettings({ screenReaderOptimized: !settings.screenReaderOptimized });
  };

  return (
    <AccessibleModal isOpen={isOpen} onClose={onClose} title="Paramètres d'accessibilité" size="lg">
      <div className="space-y-6">
        {/* Theme Selection */}
        <fieldset className="space-y-3">
          <legend className="text-lg font-medium text-text mb-3">Thème d'affichage</legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {themes.map((themeKey) => {
              const theme = ACCESSIBILITY_THEMES[themeKey];
              const isSelected = settings.theme === themeKey;

              return (
                <label
                  key={themeKey}
                  className={`
                    relative flex items-center p-4 border-2 rounded-lg cursor-pointer
                    transition-all duration-200
                    ${
                      isSelected
                        ? "border-accent bg-accent/10"
                        : "border-primary/20 hover:border-accent/50"
                    }
                    focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2
                  `}
                >
                  <input
                    type="radio"
                    name="accessibility-theme"
                    value={themeKey}
                    checked={isSelected}
                    onChange={() => handleThemeChange(themeKey)}
                    className="sr-only"
                    aria-describedby={`theme-${themeKey}-description`}
                  />

                  <div className="flex-1">
                    <div className="font-medium text-text">{theme.name}</div>
                    <div id={`theme-${themeKey}-description`} className="text-sm text-text/70 mt-1">
                      Police : {theme.fontSize.base}
                      {themeKey === "highContrast" && " • Contraste élevé"}
                      {themeKey === "lowVision" && " • Adapté malvoyants"}
                      {themeKey === "largeText" && " • Texte agrandi"}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="ml-3 text-accent" aria-hidden="true">
                      ✓
                    </div>
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Other Accessibility Options */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-medium text-text mb-3">Options d'accessibilité</legend>

          {/* Reduced Motion */}
          <label className="flex items-center justify-between p-3 border border-primary/20 rounded-lg">
            <div className="flex-1">
              <div className="font-medium text-text">Réduire les animations</div>
              <div className="text-sm text-text/70">
                Désactive ou réduit les animations et transitions
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={handleToggleReducedMotion}
              className="ml-3 h-5 w-5 text-accent focus:ring-2 focus:ring-accent rounded"
              aria-describedby="reduced-motion-description"
            />
          </label>

          {/* High Contrast Images */}
          <label className="flex items-center justify-between p-3 border border-primary/20 rounded-lg">
            <div className="flex-1">
              <div className="font-medium text-text">Images haute contraste</div>
              <div className="text-sm text-text/70">Améliore le contraste des images</div>
            </div>
            <input
              type="checkbox"
              checked={settings.highContrastImages}
              onChange={handleToggleHighContrastImages}
              className="ml-3 h-5 w-5 text-accent focus:ring-2 focus:ring-accent rounded"
              aria-describedby="high-contrast-images-description"
            />
          </label>

          {/* Screen Reader Optimized */}
          <label className="flex items-center justify-between p-3 border border-primary/20 rounded-lg">
            <div className="flex-1">
              <div className="font-medium text-text">Mode lecteur d'écran</div>
              <div className="text-sm text-text/70">
                Optimise l'interface pour les lecteurs d'écran
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.screenReaderOptimized}
              onChange={handleToggleScreenReaderOptimized}
              className="ml-3 h-5 w-5 text-accent focus:ring-2 focus:ring-accent rounded"
              aria-describedby="screen-reader-optimized-description"
            />
          </label>
        </fieldset>

        {/* Current Theme Info */}
        <div className="p-4 bg-background-inverse/5 rounded-lg border border-primary/10">
          <h3 className="font-medium text-text mb-2">Thème actuel : {currentTheme.name}</h3>
          <div className="text-sm text-text/70 space-y-1">
            <div>Taille de police : {currentTheme.fontSize.base}</div>
            <div>Couleur de fond : {currentTheme.colors.background}</div>
            <div>Couleur du texte : {currentTheme.colors.text}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t border-primary/10">
          <button
            type="button"
            onClick={resetSettings}
            className="px-4 py-2 text-text/70 hover:text-text focus:outline-none focus:ring-2 focus:ring-accent rounded transition-colors"
            aria-label="Remettre à zéro tous les paramètres d'accessibilité"
          >
            Réinitialiser
          </button>

          <button
            type="button"
            onClick={onClose}
            className="btn"
            aria-label={ARIA_LABELS.CLOSE_DIALOG}
          >
            Fermer
          </button>
        </div>

        {/* Instructions for screen readers */}
        <div className="sr-only" aria-live="polite">
          Panel de paramètres d'accessibilité. Utilisez les contrôles ci-dessus pour personnaliser
          votre expérience. Appuyez sur Échap ou cliquez sur Fermer pour quitter.
        </div>
      </div>
    </AccessibleModal>
  );
};

export default AccessibilityPanel;
