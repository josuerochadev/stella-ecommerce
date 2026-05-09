// server/src/services/emailService.js
// Service de simulation d'emails pour demonstration portfolio

const fs = require("node:fs").promises;
const path = require("node:path");
const logger = require("../utils/logger");
const { createEmailTemplates } = require("./emailTemplates");

class EmailSimulator {
  constructor() {
    this.emailQueue = [];
    this.sentEmails = [];
    this.templates = createEmailTemplates();
    this.isProcessing = false;

    this.config = {
      fromEmail: "noreply@stella.com",
      fromName: "Stella E-commerce",
      simulateDelay: true,
      saveToFile: true,
      logToConsole: true,
    };
  }

  async sendEmail({ to, template, data, priority = "normal" }) {
    const emailData = {
      id: this.generateEmailId(),
      to,
      template,
      data,
      priority,
      createdAt: new Date(),
      status: "queued",
      attempts: 0,
      maxAttempts: 3,
    };

    if (priority === "high") {
      this.emailQueue.unshift(emailData);
    } else {
      this.emailQueue.push(emailData);
    }

    if (!this.isProcessing) {
      this.processQueue();
    }

    return {
      emailId: emailData.id,
      status: "queued",
      message: "Email ajoute a la queue de traitement",
    };
  }

  async processQueue() {
    if (this.isProcessing || this.emailQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.emailQueue.length > 0) {
      const email = this.emailQueue.shift();

      try {
        await this.processEmail(email);
        email.status = "sent";
        email.sentAt = new Date();
        this.sentEmails.push(email);

        if (this.config.logToConsole) {
          logger.info(`Email envoye: ${email.template} -> ${email.to}`);
        }
      } catch (error) {
        email.attempts += 1;
        email.lastError = error.message;

        if (email.attempts < email.maxAttempts) {
          setTimeout(() => {
            this.emailQueue.push(email);
          }, 5000 * email.attempts);
        } else {
          email.status = "failed";
          this.sentEmails.push(email);
          logger.error(`Echec email apres ${email.maxAttempts} tentatives:`, error);
        }
      }

      if (this.config.simulateDelay) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    this.isProcessing = false;
  }

  async processEmail(email) {
    const template = this.templates.get(email.template);
    if (!template) {
      throw new Error(`Template '${email.template}' non trouve`);
    }

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
      data: email.data,
    };

    if (this.config.saveToFile) {
      await this.saveEmailToFile(emailContent);
    }

    return emailContent;
  }

  interpolateTemplate(template, data) {
    let result = template;

    result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? data[key] : match;
    });

    result = result.replace(
      /\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g,
      (_match, arrayKey, itemTemplate) => {
        const array = data[arrayKey];
        if (!Array.isArray(array)) return "";
        return array.map((item) => this.interpolateTemplate(itemTemplate, item)).join("");
      },
    );

    return result;
  }

  async saveEmailToFile(email) {
    try {
      const emailsDir = path.join(__dirname, "../public/demo-emails");

      try {
        await fs.access(emailsDir);
      } catch {
        await fs.mkdir(emailsDir, { recursive: true });
      }

      const filename = `email-${email.id}.html`;
      const filepath = path.join(emailsDir, filename);

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
            <h2 style="margin: 0;">Apercu Email - Stella</h2>
        </div>
        <div class="email-meta">
            <p><strong>A :</strong> ${email.to}</p>
            <p><strong>De :</strong> ${email.from}</p>
            <p><strong>Sujet :</strong> ${email.subject}</p>
            <p><strong>Envoye le :</strong> ${email.sentAt.toLocaleString("fr-FR")}</p>
            <p><strong>Template :</strong> ${email.template}</p>
        </div>
        <div>
            ${email.html}
        </div>
    </div>
</body>
</html>`;

      await fs.writeFile(filepath, previewHtml, "utf8");
      email.previewUrl = `/demo-emails/${filename}`;
    } catch (error) {
      logger.error("Erreur sauvegarde email:", error);
    }
  }

  generateEmailId() {
    return `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Methodes utilitaires pour differents types d'emails

  async sendWelcomeEmail(userEmail, firstName) {
    return this.sendEmail({
      to: userEmail,
      template: "welcome",
      data: { firstName, catalogUrl: "http://localhost:3001/catalog" },
      priority: "high",
    });
  }

  async sendOrderConfirmation(userEmail, orderData) {
    return this.sendEmail({
      to: userEmail,
      template: "orderConfirmation",
      data: {
        firstName: orderData.firstName,
        orderNumber: orderData.orderNumber,
        orderDate: new Date().toLocaleDateString("fr-FR"),
        totalAmount: orderData.totalAmount,
        paymentMethod: orderData.paymentMethod,
        stars: orderData.stars,
      },
      priority: "high",
    });
  }

  async sendPaymentConfirmation(userEmail, paymentData) {
    return this.sendEmail({
      to: userEmail,
      template: "paymentSuccess",
      data: {
        firstName: paymentData.firstName,
        orderNumber: paymentData.orderNumber,
        amount: paymentData.amount,
        transactionId: paymentData.transactionId,
        paymentMethod: paymentData.paymentMethod,
      },
      priority: "high",
    });
  }

  async sendPasswordReset(userEmail, firstName, resetToken) {
    return this.sendEmail({
      to: userEmail,
      template: "passwordReset",
      data: {
        firstName,
        resetUrl: `http://localhost:3001/reset-password?token=${resetToken}`,
      },
      priority: "high",
    });
  }

  async sendNewsletter(userEmail, firstName, newsletterData) {
    return this.sendEmail({
      to: userEmail,
      template: "newsletter",
      data: {
        firstName,
        monthYear: new Date().toLocaleDateString("fr-FR", {
          month: "long",
          year: "numeric",
        }),
        newStarsCount: newsletterData.newStarsCount,
        featuredStar: newsletterData.featuredStar,
        catalogUrl: "http://localhost:3001/catalog",
      },
      priority: "normal",
    });
  }

  getEmailStats() {
    const total = this.sentEmails.length;
    const sent = this.sentEmails.filter((e) => e.status === "sent").length;
    const failed = this.sentEmails.filter((e) => e.status === "failed").length;
    const queued = this.emailQueue.length;

    const templateStats = {};
    for (const email of this.sentEmails) {
      templateStats[email.template] = (templateStats[email.template] || 0) + 1;
    }

    return {
      total,
      sent,
      failed,
      queued,
      successRate: total > 0 ? Math.round((sent / total) * 100) : 0,
      templateStats,
      recentEmails: this.sentEmails.slice(-5).map((email) => ({
        id: email.id,
        to: email.to,
        template: email.template,
        status: email.status,
        sentAt: email.sentAt,
        previewUrl: email.previewUrl,
      })),
    };
  }

  getEmailById(emailId) {
    return this.sentEmails.find((email) => email.id === emailId);
  }

  getEmails(page = 1, limit = 10) {
    const start = (page - 1) * limit;
    const emails = this.sentEmails.slice(start, start + limit);

    return {
      emails: emails.map((email) => ({
        id: email.id,
        to: email.to,
        template: email.template,
        status: email.status,
        createdAt: email.createdAt,
        sentAt: email.sentAt,
        previewUrl: email.previewUrl,
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(this.sentEmails.length / limit),
        total: this.sentEmails.length,
      },
    };
  }
}

// Instance singleton
const emailService = new EmailSimulator();

module.exports = {
  EmailSimulator,
  emailService,
};
