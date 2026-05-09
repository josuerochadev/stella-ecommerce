// server/src/services/emailTemplates.js
// Templates d'email HTML pour le service de simulation

const HEADER_STELLA = `
  <div style="background: linear-gradient(135deg, #3D2A54 0%, #1E1326 100%); color: white; padding: 30px; text-align: center;">
    <h1 style="margin: 0; font-size: 2.5rem;">&#x1F31F; Stella</h1>
    <p style="margin: 10px 0 0 0; font-size: 1.1rem;">{{subtitle}}</p>
  </div>`;

const FOOTER = `
  <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666;">
    <p>&copy; 2024 Stella E-commerce. Tous droits r&eacute;serv&eacute;s.</p>
  </div>`;

function wrap(header, body) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      ${header}
      <div style="padding: 30px; background: white;">
        ${body}
      </div>
      ${FOOTER}
    </div>`;
}

function stellaHeader(subtitle = "Votre boutique d'&eacute;toiles") {
  return HEADER_STELLA.replace("{{subtitle}}", subtitle);
}

function colorHeader(gradient, title) {
  return `
  <div style="background: linear-gradient(135deg, ${gradient}); color: white; padding: 30px; text-align: center;">
    <h1 style="margin: 0; font-size: 2rem;">${title}</h1>
  </div>`;
}

/**
 * Initialise et retourne la Map de templates d'email
 */
function createEmailTemplates() {
  const templates = new Map();

  templates.set("welcome", {
    subject: "\u{1F31F} Bienvenue chez Stella !",
    template: wrap(
      stellaHeader(),
      `<h2 style="color: #3D2A54;">Bienvenue {{firstName}} !</h2>
       <p>Nous sommes ravis de vous accueillir dans la communaut&eacute; Stella.</p>
       <p>Chez nous, chaque &eacute;toile a une histoire &agrave; raconter, et nous sommes l&agrave; pour vous aider &agrave; trouver la v&ocirc;tre.</p>
       <div style="text-align: center; margin: 30px 0;">
         <a href="{{catalogUrl}}" style="background: #FFB347; color: #3D2A54; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">D&eacute;couvrir notre catalogue</a>
       </div>
       <p style="color: #666; font-size: 0.9rem;">Si vous avez des questions, n'h&eacute;sitez pas &agrave; nous contacter.</p>`,
    ),
  });

  templates.set("orderConfirmation", {
    subject: "\u2705 Confirmation de votre commande #{{orderNumber}}",
    template: wrap(
      stellaHeader("Confirmation de commande"),
      `<h2 style="color: #3D2A54;">Merci pour votre commande !</h2>
       <p>Bonjour {{firstName}},</p>
       <p>Votre commande <strong>#{{orderNumber}}</strong> a &eacute;t&eacute; confirm&eacute;e et sera trait&eacute;e sous peu.</p>
       <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
         <h3 style="margin-top: 0; color: #3D2A54;">D&eacute;tails de la commande</h3>
         <p><strong>Num&eacute;ro :</strong> {{orderNumber}}</p>
         <p><strong>Date :</strong> {{orderDate}}</p>
         <p><strong>Montant total :</strong> {{totalAmount}}&euro;</p>
         <p><strong>M&eacute;thode de paiement :</strong> {{paymentMethod}}</p>
       </div>
       <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
         <h4 style="margin-top: 0;">\u{1F31F} Vos &eacute;toiles</h4>
         {{#stars}}
         <p>&bull; {{name}} ({{constellation}}) - {{quantity}}x {{price}}&euro;</p>
         {{/stars}}
       </div>
       <p>Vous recevrez bient&ocirc;t un email avec les certificats personnalis&eacute;s de vos &eacute;toiles.</p>`,
    ),
  });

  templates.set("paymentSuccess", {
    subject: "\u{1F4B3} Paiement confirm\u00e9 pour votre commande #{{orderNumber}}",
    template: wrap(
      colorHeader("#28a745 0%, #20c997 100%", "\u2705 Paiement confirm\u00e9"),
      `<h2 style="color: #28a745;">Paiement re&ccedil;u avec succ&egrave;s !</h2>
       <p>Bonjour {{firstName}},</p>
       <p>Nous avons bien re&ccedil;u votre paiement de <strong>{{amount}}&euro;</strong> pour la commande #{{orderNumber}}.</p>
       <p>Votre commande est maintenant en cours de pr&eacute;paration.</p>
       <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
         <p><strong>ID Transaction :</strong> {{transactionId}}</p>
         <p><strong>M&eacute;thode :</strong> {{paymentMethod}}</p>
       </div>`,
    ),
  });

  templates.set("passwordReset", {
    subject: "\u{1F510} R\u00e9initialisation de votre mot de passe Stella",
    template: wrap(
      colorHeader("#dc3545 0%, #fd7e14 100%", "\u{1F510} R\u00e9initialisation"),
      `<h2 style="color: #dc3545;">R&eacute;initialisation de mot de passe</h2>
       <p>Bonjour {{firstName}},</p>
       <p>Vous avez demand&eacute; la r&eacute;initialisation de votre mot de passe.</p>
       <div style="text-align: center; margin: 30px 0;">
         <a href="{{resetUrl}}" style="background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">R&eacute;initialiser mon mot de passe</a>
       </div>
       <p style="color: #666; font-size: 0.9rem;">Ce lien expire dans 1 heure. Si vous n'avez pas demand&eacute; cette r&eacute;initialisation, ignorez cet email.</p>`,
    ),
  });

  templates.set("newsletter", {
    subject: "\u{1F31F} Nouvelles \u00e9toiles d\u00e9couvertes chez Stella !",
    template: wrap(
      stellaHeader("{{monthYear}}"),
      `<h2 style="color: #3D2A54;">Nouvelles d&eacute;couvertes stellaires</h2>
       <p>Bonjour {{firstName}},</p>
       <p>Ce mois-ci, nous avons ajout&eacute; {{newStarsCount}} nouvelles &eacute;toiles &agrave; notre catalogue !</p>
       <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
         <h3 style="margin-top: 0;">\u2B50 &Eacute;toile du mois</h3>
         <p><strong>{{featuredStar.name}}</strong> dans la constellation {{featuredStar.constellation}}</p>
         <p>{{featuredStar.description}}</p>
         <p><strong>Prix sp&eacute;cial :</strong> {{featuredStar.price}}&euro;</p>
       </div>
       <div style="text-align: center; margin: 30px 0;">
         <a href="{{catalogUrl}}" style="background: #FFB347; color: #3D2A54; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Voir les nouveaut&eacute;s</a>
       </div>`,
    ),
  });

  return templates;
}

module.exports = { createEmailTemplates };
