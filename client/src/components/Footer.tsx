// client/src/components/Footer.tsx
import type React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-text/[0.06] mt-20">
      <div className="max-w-[1100px] mx-auto px-10 py-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-end">
          <div>
            <span className="font-display text-xl text-text/70">Stella</span>
            <p className="text-xs text-text/35 max-w-[320px] leading-relaxed mt-3 font-sans">
              Adoptez une etoile. Personnalisez-la. Faites-en un cadeau inoubliable.
            </p>
          </div>
          <div className="flex gap-6">
            <Link
              to="/faq"
              className="text-xs text-text/40 hover:text-text transition-colors tracking-wide font-sans"
            >
              FAQ
            </Link>
            <Link
              to="/contact"
              className="text-xs text-text/40 hover:text-text transition-colors tracking-wide font-sans"
            >
              Contact
            </Link>
            <Link
              to="/about"
              className="text-xs text-text/40 hover:text-text transition-colors tracking-wide font-sans"
            >
              A propos
            </Link>
            <Link
              to="/legal"
              className="text-xs text-text/40 hover:text-text transition-colors tracking-wide font-sans"
            >
              Mentions Legales
            </Link>
            <Link
              to="/privacy-policy"
              className="text-xs text-text/40 hover:text-text transition-colors tracking-wide font-sans"
            >
              Politique de Confidentialite
            </Link>
          </div>
        </div>
        <div className="border-t border-text/[0.04] mt-6 pt-5">
          <p className="text-[11px] text-text/20 tracking-wide font-sans">
            &copy; {new Date().getFullYear()} Stella — Tous droits reserves
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
