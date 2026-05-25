import type React from "react";

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-3">
    <h2 className="text-2xl font-display text-periwinkle-100">{title}</h2>
    {children}
  </section>
);

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto pt-20 pb-16 px-4 max-w-4xl">
      <h1 className="text-4xl font-display mb-2 text-center">Politique de Confidentialite</h1>
      <p className="text-center text-text/50 text-sm mb-10">Derniere mise a jour : mai 2026</p>

      <div className="text-text font-serif space-y-8 leading-relaxed">
        <Section title="1. Responsable du traitement">
          <p>
            Stella SAS, dont le siege social est situe a Paris, France, est responsable du
            traitement de vos donnees personnelles dans le cadre de l'utilisation du site
            stella-ecommerce.
          </p>
          <p>Contact : contact@stella.com</p>
        </Section>

        <Section title="2. Donnees collectees">
          <p>Nous collectons uniquement les donnees strictement necessaires :</p>
          <ul className="list-disc list-inside space-y-1 text-text/80">
            <li>
              <strong>Identite :</strong> prenom, nom
            </li>
            <li>
              <strong>Contact :</strong> adresse e-mail
            </li>
            <li>
              <strong>Securite :</strong> mot de passe (stocke sous forme hachee, jamais en clair)
            </li>
            <li>
              <strong>Commandes :</strong> historique d'achats, liste de souhaits, avis deposes
            </li>
          </ul>
          <p className="text-text/60 text-sm">
            Aucune donnee de paiement n'est stockee sur nos serveurs.
          </p>
        </Section>

        <Section title="3. Base legale du traitement">
          <ul className="list-disc list-inside space-y-1 text-text/80">
            <li>
              <strong>Execution du contrat :</strong> gestion de votre compte, traitement des
              commandes, liste de souhaits
            </li>
            <li>
              <strong>Interet legitime :</strong> securite du site (CSRF, rate limiting),
              amelioration du service
            </li>
            <li>
              <strong>Obligation legale :</strong> conservation des donnees de transaction
              (obligations comptables)
            </li>
          </ul>
        </Section>

        <Section title="4. Duree de conservation">
          <ul className="list-disc list-inside space-y-1 text-text/80">
            <li>
              <strong>Donnees du compte :</strong> conservees tant que votre compte est actif, puis
              supprimees sous 30 jours apres demande de suppression
            </li>
            <li>
              <strong>Donnees de commande :</strong> conservees 5 ans apres la derniere transaction
              (obligation comptable legale)
            </li>
            <li>
              <strong>Tokens d'authentification :</strong> access token 15 minutes, refresh token 7
              jours, nettoyage automatique quotidien
            </li>
          </ul>
        </Section>

        <Section title="5. Cookies">
          <p>Nous utilisons uniquement des cookies techniques necessaires au fonctionnement :</p>
          <ul className="list-disc list-inside space-y-1 text-text/80">
            <li>
              <strong>refreshToken :</strong> cookie httpOnly pour l'authentification (7 jours)
            </li>
            <li>
              <strong>CSRF token :</strong> protection contre les attaques CSRF (session)
            </li>
          </ul>
          <p className="text-text/60 text-sm">
            Aucun cookie publicitaire, analytique ou de tracking n'est utilise.
          </p>
        </Section>

        <Section title="6. Services tiers">
          <ul className="list-disc list-inside space-y-1 text-text/80">
            <li>
              <strong>Sentry :</strong> suivi des erreurs techniques (active uniquement en
              production). Peut recevoir des traces d'erreur anonymisees. Transfert vers les
              serveurs Sentry encadre par des clauses contractuelles types (CCT).
            </li>
          </ul>
          <p className="text-text/60 text-sm">
            Les polices de caracteres sont hebergees localement. Aucune requete n'est envoyee vers
            Google Fonts ou tout autre CDN externe.
          </p>
        </Section>

        <Section title="7. Vos droits (RGPD)">
          <p>Conformement au Reglement General sur la Protection des Donnees, vous disposez de :</p>
          <ul className="list-disc list-inside space-y-1 text-text/80">
            <li>
              <strong>Droit d'acces :</strong> obtenir une copie de vos donnees personnelles
            </li>
            <li>
              <strong>Droit de rectification :</strong> corriger vos informations depuis votre
              profil
            </li>
            <li>
              <strong>Droit a l'effacement :</strong> supprimer votre compte et toutes vos donnees
              depuis votre profil
            </li>
            <li>
              <strong>Droit a la portabilite :</strong> exporter vos donnees dans un format
              structure (JSON)
            </li>
            <li>
              <strong>Droit a la limitation :</strong> demander la restriction du traitement de vos
              donnees
            </li>
            <li>
              <strong>Droit d'opposition :</strong> vous opposer au traitement de vos donnees
            </li>
          </ul>
        </Section>

        <Section title="8. Exercer vos droits">
          <p>
            Vous pouvez exercer la plupart de vos droits directement depuis votre espace personnel
            (modification du profil, suppression du compte, export des donnees).
          </p>
          <p>
            Pour toute autre demande, contactez-nous a{" "}
            <a href="mailto:contact@stella.com" className="text-special underline">
              contact@stella.com
            </a>
            . Nous repondrons dans un delai maximum de 30 jours.
          </p>
          <p>
            Si vous estimez que vos droits ne sont pas respectes, vous pouvez introduire une
            reclamation aupres de la{" "}
            <a
              href="https://www.cnil.fr/fr/plaintes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-special underline"
            >
              CNIL
            </a>{" "}
            (Commission Nationale de l'Informatique et des Libertes).
          </p>
        </Section>

        <Section title="9. Securite">
          <p>Nous mettons en oeuvre les mesures de securite suivantes :</p>
          <ul className="list-disc list-inside space-y-1 text-text/80">
            <li>Hachage des mots de passe (bcrypt)</li>
            <li>Protection CSRF sur toutes les mutations</li>
            <li>Cookies httpOnly et Secure en production</li>
            <li>Headers de securite (Helmet, CSP, X-Frame-Options)</li>
            <li>Limitation du debit des requetes (rate limiting)</li>
            <li>Assainissement des entrees utilisateur (DOMPurify)</li>
            <li>Connexion chiffree a la base de donnees (SSL)</li>
          </ul>
        </Section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
