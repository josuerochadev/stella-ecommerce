// client/src/hooks/useHeroPhrases.ts

import { APP_CONSTANTS } from "@/constants/app";
import { useCallback, useEffect, useMemo, useState } from "react";

const heroPhrases = [
  "Illuminer votre vie.",
  "Parcourir les constellations et trouver la bonne étoile !",
  "Découvrez les plus éclatants : la splendeur à portée de clic !",
  "Adoptez une étoile voisine : votre coin de ciel personnalisé !",
];

export const useHeroPhrases = (interval = APP_CONSTANTS.HERO_PHRASES_INTERVAL) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const currentPhrase = useMemo(() => heroPhrases[currentIndex], [currentIndex]);

  const updatePhrase = useCallback(() => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroPhrases.length);
      setFade(true);
    }, APP_CONSTANTS.DEBOUNCE_DELAY);
  }, []);

  useEffect(() => {
    const timer = setInterval(updatePhrase, interval);
    return () => clearInterval(timer);
  }, [interval, updatePhrase]);

  return { currentPhrase, fade };
};
