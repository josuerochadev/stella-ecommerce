import type React from "react";
import FadeInSection from "../components/FadeInSection";

const Legal: React.FC = () => {
  return (
    <div className="container mx-auto pt-20 px-4 max-w-4xl">
      <h1 className="text-4xl font-display mb-6 text-center">Mentions Légales</h1>
      <FadeInSection>
        <div className="space-y-6 text-text font-serif">
          <p>
            <strong>Nom de l'entreprise :</strong> Stella Ecommerce
          </p>
          <p>
            <strong>Adresse :</strong> 123 Rue des Étoiles, 75000 Paris, France
          </p>
          <p>
            <strong>Email :</strong> contact@stella.com
          </p>
          <p>
            <strong>Téléphone :</strong> +33 1 23 45 67 89
          </p>
          <p>
            <strong>SIRET :</strong> 123 456 789 00000
          </p>
          <p>
            <strong>Directeur de la publication :</strong> Josué Xavier Rocha
          </p>
          <p>
            <strong>Hébergeur :</strong> OVH, 2 Rue Kellermann, 59100 Roubaix, France
          </p>
          <p>
            Ce site respecte les droits des utilisateurs et les normes en matière de protection des
            données personnelles.
          </p>
        </div>
      </FadeInSection>
    </div>
  );
};

export default Legal;