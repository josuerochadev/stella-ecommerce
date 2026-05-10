// Thèmes d'accessibilité pour améliorer le contraste et la lisibilité
export const ACCESSIBILITY_THEMES = {
  // Thème par défaut (existant)
  default: {
    name: "Thème par défaut",
    colors: {
      background: "var(--color-background-default)",
      text: "var(--color-text)",
      primary: "var(--color-primary)",
      secondary: "var(--color-secondary)",
      accent: "var(--color-special)",
    },
    fontSize: {
      base: "16px",
      small: "14px",
      large: "18px",
    },
  },

  // Thème haut contraste
  highContrast: {
    name: "Contraste élevé",
    colors: {
      background: "#000000",
      text: "#ffffff",
      primary: "#ffffff",
      secondary: "#1a1a1a",
      accent: "#ffff00",
    },
    fontSize: {
      base: "18px",
      small: "16px",
      large: "20px",
    },
  },

  // Thème pour malvoyants (couleurs et contrastes adaptés)
  lowVision: {
    name: "Vision adaptée",
    colors: {
      background: "#1a1a2e",
      text: "#ffffff",
      primary: "#eee2df",
      secondary: "#16213e",
      accent: "#ffd700",
    },
    fontSize: {
      base: "20px",
      small: "18px",
      large: "24px",
    },
  },

  // Thème agrandi (texte plus gros)
  largeText: {
    name: "Texte agrandi",
    colors: {
      background: "var(--color-background-default)",
      text: "var(--color-text)",
      primary: "var(--color-primary)",
      secondary: "var(--color-secondary)",
      accent: "var(--color-special)",
    },
    fontSize: {
      base: "22px",
      small: "20px",
      large: "28px",
    },
  },
} as const;

export type AccessibilityTheme = keyof typeof ACCESSIBILITY_THEMES;

// Hook pour gérer les préférences d'accessibilité
import { useEffect, useState } from "react";

interface AccessibilitySettings {
  theme: AccessibilityTheme;
  reducedMotion: boolean;
  highContrastImages: boolean;
  screenReaderOptimized: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  theme: "default",
  reducedMotion: false,
  highContrastImages: false,
  screenReaderOptimized: false,
};

export const useAccessibilitySettings = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // Récupérer les préférences sauvegardées
    const saved = localStorage.getItem("accessibility-settings");
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }

    // Détecter les préférences système (sans forcer automatiquement le thème)
    const systemPreferences: Partial<AccessibilitySettings> = {};

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      systemPreferences.reducedMotion = true;
    }

    // Ne pas forcer automatiquement le contraste élevé - laisser l'utilisateur choisir
    // if (window.matchMedia('(prefers-contrast: high)').matches) {
    //   systemPreferences.theme = 'highContrast';
    // }

    return { ...DEFAULT_SETTINGS, ...systemPreferences };
  });

  // Appliquer les changements de thème
  useEffect(() => {
    const theme = ACCESSIBILITY_THEMES[settings.theme];
    const root = document.documentElement;
    const body = document.body;

    // Appliquer les couleurs seulement si ce n'est pas le thème par défaut
    if (settings.theme !== "default") {
      for (const [key, value] of Object.entries(theme.colors)) {
        root.style.setProperty(`--accessibility-${key}`, value);
      }
      body.classList.add("accessibility-theme-active");
    } else {
      // Retirer les propriétés CSS personnalisées pour revenir aux couleurs par défaut
      body.classList.remove("accessibility-theme-active");
      for (const key of Object.keys(theme.colors)) {
        root.style.removeProperty(`--accessibility-${key}`);
      }
    }

    // Appliquer les tailles de police
    for (const [key, value] of Object.entries(theme.fontSize)) {
      root.style.setProperty(`--accessibility-font-${key}`, value);
    }

    // Appliquer les préférences de mouvement
    if (settings.reducedMotion) {
      root.style.setProperty("--animation-duration", "0s");
      root.style.setProperty("--transition-duration", "0s");
    } else {
      root.style.removeProperty("--animation-duration");
      root.style.removeProperty("--transition-duration");
    }

    // Gestion du mode contraste élevé
    if (settings.theme === "highContrast") {
      body.classList.add("high-contrast-mode");
    } else {
      body.classList.remove("high-contrast-mode");
    }

    // Classes CSS pour les images haute contraste
    if (settings.highContrastImages) {
      body.classList.add("high-contrast-images");
    } else {
      body.classList.remove("high-contrast-images");
    }

    // Mode optimisé lecteur d'écran
    if (settings.screenReaderOptimized) {
      body.classList.add("screen-reader-optimized");
    } else {
      body.classList.remove("screen-reader-optimized");
    }

    // Sauvegarder les préférences
    localStorage.setItem("accessibility-settings", JSON.stringify(settings));

    // Annoncer le changement
    const announcer = document.createElement("div");
    announcer.setAttribute("aria-live", "polite");
    announcer.setAttribute("aria-atomic", "true");
    announcer.className = "sr-only";
    announcer.textContent = `Thème changé vers : ${theme.name}`;

    document.body.appendChild(announcer);

    setTimeout(() => {
      if (document.body.contains(announcer)) {
        document.body.removeChild(announcer);
      }
    }, 2000);
  }, [settings]);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem("accessibility-settings");
  };

  return {
    settings,
    updateSettings,
    resetSettings,
    themes: Object.keys(ACCESSIBILITY_THEMES) as AccessibilityTheme[],
    currentTheme: ACCESSIBILITY_THEMES[settings.theme],
  };
};

// Fonction pour calculer le contraste entre deux couleurs
export const getContrastRatio = (color1: string, color2: string): number => {
  // Implémentation simplifiée - en production utiliser une librairie dédiée
  const getLuminance = (color: string): number => {
    // Conversion hex vers luminance relative (simplifiée)
    if (color.startsWith("#")) {
      const hex = color.slice(1);
      const r = Number.parseInt(hex.substr(0, 2), 16) / 255;
      const g = Number.parseInt(hex.substr(2, 2), 16) / 255;
      const b = Number.parseInt(hex.substr(4, 2), 16) / 255;

      // Formule de luminance relative
      const getRGB = (c: number) => {
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      };

      return 0.2126 * getRGB(r) + 0.7152 * getRGB(g) + 0.0722 * getRGB(b);
    }

    return 0.5; // Valeur par défaut
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
};

// Fonction pour vérifier la conformité WCAG
export const checkWCAGCompliance = (ratio: number) => {
  return {
    AA_normal: ratio >= 4.5,
    AA_large: ratio >= 3,
    AAA_normal: ratio >= 7,
    AAA_large: ratio >= 4.5,
    ratio,
  };
};
