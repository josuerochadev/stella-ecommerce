// client/src/components/Footer.tsx
import type React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-text py-6 mt-12">
      <div className="container mx-auto text-center">
        <div className="font-serif">
          <Link to="/faq" className="mx-2 hover:text-white">
            FAQ
          </Link>
          <Link to="/contact" className="mx-2 hover:text-white">
            Contact
          </Link>
          <Link to="/about" className="mx-2 hover:text-white">
            À propos
          </Link>
          <Link to="/legal" className="mx-2 hover:text-white">
            Mentions Légales
          </Link>
          <Link to="/privacy-policy" className="mx-2 hover:text-white">
            Politique de Confidentialité
          </Link>
        </div>
        <p>&copy; {new Date().getFullYear()} Stella. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
