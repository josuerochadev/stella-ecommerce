import SEO from "@/components/SEO";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
    <SEO
      title="Page introuvable"
      description="La page que vous cherchez n'existe pas."
      path="/404"
    />

    <p className="text-8xl mb-6" aria-hidden="true">
      ✦
    </p>
    <h1 className="text-6xl font-display text-special mb-4">404</h1>
    <p className="text-xl font-serif text-text mb-2">Cette page n'existe pas.</p>
    <p className="text-text/60 mb-10">L'URL que vous cherchez est introuvable ou a été déplacée.</p>

    <div className="flex flex-col sm:flex-row gap-4">
      <Link to="/catalog" className="btn">
        Parcourir le catalogue
      </Link>
      <Link to="/" className="btn-secondary">
        Retour à l'accueil
      </Link>
    </div>
  </div>
);

export default NotFound;
