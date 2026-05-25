import type React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type ConsentValue = "accepted" | "refused" | null;

const CookieBanner: React.FC = () => {
  const [isBannerVisible, setIsBannerVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent") as ConsentValue;
    if (!consent) {
      setIsBannerVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsBannerVisible(false);
  };

  const handleRefuse = () => {
    localStorage.setItem("cookie-consent", "refused");
    setIsBannerVisible(false);
  };

  return isBannerVisible ? (
    <div
      className="fixed bottom-0 left-0 right-0 bg-surface-1 text-text p-4 shadow-lg z-50 border-t border-text/10"
      role="dialog"
      aria-label="Gestion des cookies"
    >
      <div className="container mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between">
        <p className="text-sm text-text/80 max-w-2xl">
          Ce site utilise des cookies strictement necessaires au fonctionnement (authentification,
          securite CSRF). Aucun cookie publicitaire ou de tracking n'est utilise.{" "}
          <Link to="/privacy-policy" className="text-special underline hover:text-special/80">
            Politique de confidentialite
          </Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <button type="button" onClick={handleAccept} className="btn text-sm">
            Accepter
          </button>
          <button
            type="button"
            onClick={handleRefuse}
            className="btn-secondary text-sm py-2 px-4 rounded-md"
          >
            Refuser
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default CookieBanner;
