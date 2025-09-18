// server/src/services/emailService.js
// Service de simulation d'emails pour démonstration portfolio

const fs = require('fs').promises;
const path = require('path');

class EmailSimulator {
  constructor() {
    this.emailQueue = [];
    this.sentEmails = [];
    this.templates = new Map();
    this.isProcessing = false;

    // Configuration pour simulation
    this.config = {
      fromEmail: 'noreply@stella.com',
      fromName: 'Stella E-commerce',
      simulateDelay: true,
      saveToFile: true,
      logToConsole: true
    };

    // Initialiser les templates d'email
    this.initializeTemplates();
  }

  // Initialiser les templates d'email
  initializeTemplates() {
    // Template de bienvenue
    this.templates.set('welcome', {
      subject: '🌟 Bienvenue chez Stella !',
      template: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3D2A54 0%, #1E1326 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 2.5rem;">🌟 Stella</h1>
            <p style="margin: 10px 0 0 0; font-size: 1.1rem;">Votre boutique d'étoiles</p>
          </div>
          <div style="padding: 30px; background: white;">
            <h2 style="color: #3D2A54;">Bienvenue {{firstName}} !</h2>
            <p>Nous sommes ravis de vous accueillir dans la communauté Stella.</p>
            <p>Chez nous, chaque étoile a une histoire à raconter, et nous sommes là pour vous aider à trouver la vôtre.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{catalogUrl}}" style="background: #FFB347; color: #3D2A54; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Découvrir notre catalogue</a>
            </div>
            <p style="color: #666; font-size: 0.9rem;">Si vous avez des questions, n'hésitez pas à nous contacter.</p>
          </div>
          <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666;">
            <p>© 2024 Stella E-commerce. Tous droits réservés.</p>
          </div>
        </div>
      `
    });

    // Template de confirmation de commande
    this.templates.set('orderConfirmation', {
      subject: '✅ Confirmation de votre commande #{{orderNumber}}',
      template: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3D2A54 0%, #1E1326 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 2.5rem;">🌟 Stella</h1>
            <p style="margin: 10px 0 0 0;">Confirmation de commande</p>
          </div>
          <div style="padding: 30px; background: white;">
            <h2 style="color: #3D2A54;">Merci pour votre commande !</h2>
            <p>Bonjour {{firstName}},</p>
            <p>Votre commande <strong>#{{orderNumber}}</strong> a été confirmée et sera traitée sous peu.</p>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #3D2A54;">Détails de la commande</h3>
              <p><strong>Numéro :</strong> {{orderNumber}}</p>
              <p><strong>Date :</strong> {{orderDate}}</p>
              <p><strong>Montant total :</strong> {{totalAmount}}€</p>
              <p><strong>Méthode de paiement :</strong> {{paymentMethod}}</p>
            </div>

            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0;">🌟 Vos étoiles</h4>
              {{#stars}}
              <p>• {{name}} ({{constellation}}) - {{quantity}}x {{price}}€</p>
              {{/stars}}
            </div>

            <p>Vous recevrez bientôt un email avec les certificats personnalisés de vos étoiles.</p>
          </div>
          <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666;">
            <p>© 2024 Stella E-commerce. Tous droits réservés.</p>
          </div>
        </div>
      `
    });

    // Template de notification de paiement
    this.templates.set('paymentSuccess', {
      subject: '💳 Paiement confirmé pour votre commande #{{orderNumber}}',
      template: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 2rem;">✅ Paiement confirmé</h1>
          </div>
          <div style="padding: 30px; background: white;">
            <h2 style="color: #28a745;">Paiement reçu avec succès !</h2>
            <p>Bonjour {{firstName}},</p>
            <p>Nous avons bien reçu votre paiement de <strong>{{amount}}€</strong> pour la commande #{{orderNumber}}.</p>
            <p>Votre commande est maintenant en cours de préparation.</p>

            <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
              <p><strong>ID Transaction :</strong> {{transactionId}}</p>
              <p><strong>Méthode :</strong> {{paymentMethod}}</p>
            </div>
          </div>
        </div>
      `
    });

    // Template de reset de mot de passe
    this.templates.set('passwordReset', {
      subject: '🔐 Réinitialisation de votre mot de passe Stella',
      template: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 2rem;">🔐 Réinitialisation</h1>
          </div>
          <div style="padding: 30px; background: white;">
            <h2 style="color: #dc3545;">Réinitialisation de mot de passe</h2>
            <p>Bonjour {{firstName}},</p>
            <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="{{resetUrl}}" style="background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Réinitialiser mon mot de passe</a>
            </div>

            <p style="color: #666; font-size: 0.9rem;">Ce lien expire dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
          </div>
        </div>
      `
    });

    // Template de newsletter
    this.templates.set('newsletter', {
      subject: '🌟 Nouvelles étoiles découvertes chez Stella !',
      template: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3D2A54 0%, #1E1326 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 2.5rem;">🌟 Stella Newsletter</h1>
            <p style="margin: 10px 0 0 0;">{{monthYear}}</p>
          </div>
          <div style="padding: 30px; background: white;">
            <h2 style="color: #3D2A54;">Nouvelles découvertes stellaires</h2>
            <p>Bonjour {{firstName}},</p>
            <p>Ce mois-ci, nous avons ajouté {{newStarsCount}} nouvelles étoiles à notre catalogue !</p>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">⭐ Étoile du mois</h3>
              <p><strong>{{featuredStar.name}}</strong> dans la constellation {{featuredStar.constellation}}</p>
              <p>{{featuredStar.description}}</p>
              <p><strong>Prix spécial :</strong> {{featuredStar.price}}€</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="{{catalogUrl}}" style="background: #FFB347; color: #3D2A54; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Voir les nouveautés</a>
            </div>
          </div>
        </div>
      `
    });
  }

  // Créer et envoyer un email
  async sendEmail({ to, template, data, priority = 'normal' }) {
    const emailData = {
      id: this.generateEmailId(),
      to,
      template,
      data,
      priority,
      createdAt: new Date(),
      status: 'queued',
      attempts: 0,
      maxAttempts: 3
    };

    // Ajouter à la queue
    if (priority === 'high') {
      this.emailQueue.unshift(emailData);
    } else {
      this.emailQueue.push(emailData);
    }

    // Démarrer le traitement si pas déjà en cours
    if (!this.isProcessing) {
      this.processQueue();
    }

    return {
      emailId: emailData.id,
      status: 'queued',
      message: 'Email ajouté à la queue de traitement'
    };
  }

  // Traiter la queue d'emails
  async processQueue() {
    if (this.isProcessing || this.emailQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.emailQueue.length > 0) {
      const email = this.emailQueue.shift();

      try {
        await this.processEmail(email);
        email.status = 'sent';
        email.sentAt = new Date();
        this.sentEmails.push(email);

        if (this.config.logToConsole) {
          console.log(`📧 Email envoyé: ${email.template} → ${email.to}`);
        }

      } catch (error) {
        email.attempts += 1;
        email.lastError = error.message;

        if (email.attempts < email.maxAttempts) {
          // Remettre en queue avec délai
          setTimeout(() => {
            this.emailQueue.push(email);
          }, 5000 * email.attempts); // Délai croissant
        } else {
          email.status = 'failed';
          this.sentEmails.push(email);
          console.error(`❌ Échec email après ${email.maxAttempts} tentatives:`, error);
        }
      }

      // Délai entre emails pour simulation réaliste
      if (this.config.simulateDelay) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    this.isProcessing = false;
  }

  // Traiter un email individuel
  async processEmail(email) {
    const template = this.templates.get(email.template);
    if (!template) {
      throw new Error(`Template '${email.template}' non trouvé`);
    }

    // Interpoler les données dans le template
    const htmlContent = this.interpolateTemplate(template.template, email.data);
    const subject = this.interpolateTemplate(template.subject, email.data);

    const emailContent = {
      id: email.id,
      from: `${this.config.fromName} <${this.config.fromEmail}>`,
      to: email.to,
      subject: subject,
      html: htmlContent,
      sentAt: new Date(),
      template: email.template,
      data: email.data
    };

    // Sauvegarder l'email pour la démo
    if (this.config.saveToFile) {
      await this.saveEmailToFile(emailContent);
    }

    return emailContent;
  }

  // Interpoler les variables dans un template
  interpolateTemplate(template, data) {
    let result = template;

    // Remplacer les variables simples {{variable}}
    result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? data[key] : match;
    });

    // Traiter les boucles {{#array}}...{{/array}}
    result = result.replace(/\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (match, arrayKey, itemTemplate) => {
      const array = data[arrayKey];
      if (!Array.isArray(array)) return '';

      return array.map(item => {
        return this.interpolateTemplate(itemTemplate, item);
      }).join('');
    });

    return result;
  }

  // Sauvegarder l'email dans un fichier pour démo
  async saveEmailToFile(email) {
    try {
      const emailsDir = path.join(__dirname, '../public/demo-emails');

      // Créer le dossier s'il n'existe pas
      try {
        await fs.access(emailsDir);
      } catch {
        await fs.mkdir(emailsDir, { recursive: true });
      }

      const filename = `email-${email.id}.html`;
      const filepath = path.join(emailsDir, filename);

      // Template HTML complet pour la prévisualisation
      const previewHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${email.subject}</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .email-preview { background: white; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .email-header { background: #3D2A54; color: white; padding: 15px; }
        .email-meta { background: #f8f9fa; padding: 10px; border-bottom: 1px solid #e9ecef; font-size: 0.9rem; }
    </style>
</head>
<body>
    <div class="email-preview">
        <div class="email-header">
            <h2 style="margin: 0;">📧 Aperçu Email - Stella</h2>
        </div>
        <div class="email-meta">
            <p><strong>À :</strong> ${email.to}</p>
            <p><strong>De :</strong> ${email.from}</p>
            <p><strong>Sujet :</strong> ${email.subject}</p>
            <p><strong>Envoyé le :</strong> ${email.sentAt.toLocaleString('fr-FR')}</p>
            <p><strong>Template :</strong> ${email.template}</p>
        </div>
        <div>
            ${email.html}
        </div>
    </div>
</body>
</html>`;

      await fs.writeFile(filepath, previewHtml, 'utf8');
      email.previewUrl = `/demo-emails/${filename}`;

    } catch (error) {
      console.error('Erreur sauvegarde email:', error);
    }
  }

  // Générer un ID unique pour l'email
  generateEmailId() {
    return `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Méthodes utilitaires pour différents types d'emails

  async sendWelcomeEmail(userEmail, firstName) {
    return this.sendEmail({
      to: userEmail,
      template: 'welcome',
      data: {
        firstName,
        catalogUrl: 'http://localhost:3001/catalog'
      },
      priority: 'high'
    });
  }

  async sendOrderConfirmation(userEmail, orderData) {
    return this.sendEmail({
      to: userEmail,
      template: 'orderConfirmation',
      data: {
        firstName: orderData.firstName,
        orderNumber: orderData.orderNumber,
        orderDate: new Date().toLocaleDateString('fr-FR'),
        totalAmount: orderData.totalAmount,
        paymentMethod: orderData.paymentMethod,
        stars: orderData.stars
      },
      priority: 'high'
    });
  }

  async sendPaymentConfirmation(userEmail, paymentData) {
    return this.sendEmail({
      to: userEmail,
      template: 'paymentSuccess',
      data: {
        firstName: paymentData.firstName,
        orderNumber: paymentData.orderNumber,
        amount: paymentData.amount,
        transactionId: paymentData.transactionId,
        paymentMethod: paymentData.paymentMethod
      },
      priority: 'high'
    });
  }

  async sendPasswordReset(userEmail, firstName, resetToken) {
    return this.sendEmail({
      to: userEmail,
      template: 'passwordReset',
      data: {
        firstName,
        resetUrl: `http://localhost:3001/reset-password?token=${resetToken}`
      },
      priority: 'high'
    });
  }

  async sendNewsletter(userEmail, firstName, newsletterData) {
    return this.sendEmail({
      to: userEmail,
      template: 'newsletter',
      data: {
        firstName,
        monthYear: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
        newStarsCount: newsletterData.newStarsCount,
        featuredStar: newsletterData.featuredStar,
        catalogUrl: 'http://localhost:3001/catalog'
      },
      priority: 'normal'
    });
  }

  // Obtenir les statistiques d'emails
  getEmailStats() {
    const total = this.sentEmails.length;
    const sent = this.sentEmails.filter(e => e.status === 'sent').length;
    const failed = this.sentEmails.filter(e => e.status === 'failed').length;
    const queued = this.emailQueue.length;

    const templateStats = {};
    this.sentEmails.forEach(email => {
      templateStats[email.template] = (templateStats[email.template] || 0) + 1;
    });

    return {
      total,
      sent,
      failed,
      queued,
      successRate: total > 0 ? Math.round((sent / total) * 100) : 0,
      templateStats,
      recentEmails: this.sentEmails.slice(-5).map(email => ({
        id: email.id,
        to: email.to,
        template: email.template,
        status: email.status,
        sentAt: email.sentAt,
        previewUrl: email.previewUrl
      }))
    };
  }

  // Obtenir un email par ID
  getEmailById(emailId) {
    return this.sentEmails.find(email => email.id === emailId);
  }

  // Lister tous les emails avec pagination
  getEmails(page = 1, limit = 10) {
    const start = (page - 1) * limit;
    const emails = this.sentEmails.slice(start, start + limit);

    return {
      emails: emails.map(email => ({
        id: email.id,
        to: email.to,
        template: email.template,
        status: email.status,
        createdAt: email.createdAt,
        sentAt: email.sentAt,
        previewUrl: email.previewUrl
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(this.sentEmails.length / limit),
        total: this.sentEmails.length
      }
    };
  }
}

// Instance singleton
const emailService = new EmailSimulator();

module.exports = {
  EmailSimulator,
  emailService
};