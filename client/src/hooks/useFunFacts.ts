// client/src/hooks/useFunFacts.ts

import { useEffect, useState, useMemo, useCallback } from "react";
import { APP_CONSTANTS } from "@/constants/app";

const funFacts = [
  "La plus proche étoile de la Terre, après le Soleil, est Proxima Centauri, située à 4,2 années-lumière.",
  "Il y a plus d'étoiles dans l'univers que de grains de sable sur toutes les plages de la Terre.",
  "Certaines étoiles sont si grandes que si elles remplaçaient notre Soleil, elles engloberaient l'orbite de Jupiter.",
  "Les étoiles ne scintillent pas réellement, c'est l'atmosphère terrestre qui crée cette illusion.",
  "La couleur d'une étoile indique sa température : les étoiles bleues sont les plus chaudes, les rouges les plus froides.",
];

export const useFunFacts = (interval = APP_CONSTANTS.FUN_FACTS_INTERVAL) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentFact = useMemo(() => funFacts[currentIndex], [currentIndex]);

  const updateFact = useCallback(() => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % funFacts.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(updateFact, interval);
    return () => clearInterval(timer);
  }, [interval, updateFact]);

  return currentFact;
};
