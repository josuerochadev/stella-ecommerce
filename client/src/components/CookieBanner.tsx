import type React from "react";
import { useState, useEffect } from "react";

const CookieBanner: React.FC = () => {
  const [isBannerVisible, setIsBannerVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setIsBannerVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "true");
    setIsBannerVisible(false);
  };

  return isBannerVisible ? (
    <div className="fixed bottom-0 left-0 right-0 bg-primary text-text p-4 shadow-lg z-50">
      <div className="container mx-auto flex justify-between items-center">
        <p>
          Nous utilisons des cookies pour améliorer votre expérience. En continuant à utiliser ce
          site, vous acceptez notre utilisation des cookies.
        </p>
        <button
          type="button"
          onClick={handleAccept}
          className="ml-4 px-4 py-2 bg-secondary text-white rounded hover:bg-secondary-dark"
        >
          Accepter
        </button>
        <button
          type="button"
          onClick={handleAccept}
          className="ml-4 px-4 py-2 bg-secondary text-white rounded hover:bg-secondary-dark"
        >
          Refuser
        </button>
      </div>
    </div>
  ) : null;
};

export default CookieBanner;
