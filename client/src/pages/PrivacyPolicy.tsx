import type React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto pt-20 px-4 max-w-4xl">
      <h1 className="text-4xl font-display mb-6 text-center">Politique de Confidentialité</h1>
      <div className="text-text font-serif space-y-6">
        <p>
          Nous respectons votre vie privée. Cette politique de confidentialité explique comment
          nous collectons, utilisons et protégeons vos informations personnelles.
        </p>
        <h2 className="text-2xl font-bold">Données collectées</h2>
        <p>
          Les données collectées incluent votre nom, adresse e-mail, et informations nécessaires
          pour le traitement des commandes. Nous utilisons ces données uniquement pour améliorer
          votre expérience.
        </p>
        <h2 className="text-2xl font-bold">Vos droits</h2>
        <p>
          Vous avez le droit d'accéder, de rectifier ou de supprimer vos données personnelles. Pour
          exercer ces droits, contactez-nous à : contact@stella.com.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;