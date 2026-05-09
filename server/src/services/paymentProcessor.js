// server/src/services/paymentProcessor.js
// Service de traitement des paiements - principe KISS

const crypto = require("node:crypto");
const { PaymentValidator } = require("./paymentValidator");

/**
 * Service dédié au traitement des paiements
 * Responsabilité unique : orchestration des différents processeurs de paiement
 */
class PaymentProcessor {
  constructor() {
    this.successRate = 0.9; // 90% de succès par défaut
    this.processingTime = {
      min: 1000, // 1 seconde minimum
      max: 3000, // 3 secondes maximum
    };
  }

  /**
   * Traiter un paiement selon la méthode choisie
   * Responsabilité unique : orchestration du processus
   */
  async processPayment(paymentData) {
    const { amount, currency = "EUR", method, orderId, customerData, cardData } = paymentData;

    // Validation préalable
    const validation = PaymentValidator.validatePaymentData(paymentData);
    if (!validation.isValid) {
      return {
        status: "failed",
        error: `Validation error: ${validation.errors.join(", ")}`,
        transactionId: null,
      };
    }

    // Délai de traitement réaliste
    const processingDelay =
      Math.random() * (this.processingTime.max - this.processingTime.min) + this.processingTime.min;

    await new Promise((resolve) => setTimeout(resolve, processingDelay));

    // Génération des données de base
    const result = {
      transactionId: this.generateTransactionId(),
      status: "pending",
      amount: Number.parseFloat(amount),
      currency,
      method,
      orderId,
      createdAt: new Date().toISOString(),
      processingFee: this.calculateProcessingFee(amount, method),
    };

    // Traitement selon la méthode
    switch (method) {
      case "credit_card":
        return await this.processCreditCard(result, cardData);
      case "paypal":
        return await this.processPayPal(result, customerData);
      case "bank_transfer":
        return await this.processBankTransfer(result, customerData);
      case "apple_pay":
      case "google_pay":
        return await this.processDigitalWallet(result, method);
      default:
        result.status = "failed";
        result.error = `Unsupported payment method: ${method}`;
        return result;
    }
  }

  /**
   * Traiter un paiement par carte de crédit
   * Responsabilité unique : logique carte de crédit
   */
  async processCreditCard(result, cardData) {
    if (!cardData) {
      result.status = "failed";
      result.error = "Card data required";
      return result;
    }

    const cardValidation = PaymentValidator.validateCreditCard(cardData);

    if (!cardValidation.isValid) {
      result.status = "failed";
      result.error = cardValidation.error || "Card validation failed";
      result.cardInfo = {
        brand: cardValidation.brand,
        last4: cardValidation.last4,
      };
      return result;
    }

    // Simulation de succès/échec
    const isSuccessful = Math.random() > 1 - this.successRate;

    result.status = isSuccessful ? "completed" : "failed";
    result.cardInfo = {
      brand: cardValidation.brand,
      last4: cardValidation.last4,
    };

    if (!isSuccessful) {
      const errors = [
        "Transaction declined by bank",
        "Insufficient funds",
        "Card expired",
        "Security check failed",
      ];
      result.error = errors[Math.floor(Math.random() * errors.length)];
    }

    return result;
  }

  /**
   * Traiter un paiement PayPal
   * Responsabilité unique : logique PayPal
   */
  async processPayPal(result, customerData) {
    // PayPal a généralement un taux de succès plus élevé
    const isSuccessful = Math.random() > 0.05; // 95% succès

    result.status = isSuccessful ? "completed" : "failed";
    result.paypalInfo = {
      payerId: `PAYER_${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
      email: customerData?.email || "demo@paypal.com",
    };

    if (!isSuccessful) {
      result.error = "PayPal transaction declined";
    }

    return result;
  }

  /**
   * Traiter un virement bancaire
   * Responsabilité unique : logique virement
   */
  async processBankTransfer(result, _customerData) {
    // Virement toujours en pending initialement
    result.status = "pending";
    result.bankInfo = {
      reference: `BT_${Date.now()}`,
      estimatedCompletion: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      instructions: "Transfer will be processed within 1-2 business days",
    };

    return result;
  }

  /**
   * Traiter un paiement par portefeuille numérique
   * Responsabilité unique : logique portefeuilles digitaux
   */
  async processDigitalWallet(result, method) {
    const isSuccessful = Math.random() > 0.1; // 90% succès

    result.status = isSuccessful ? "completed" : "failed";
    result.walletInfo = {
      walletType: method,
      deviceId: `DEVICE_${crypto.randomBytes(6).toString("hex")}`,
      biometricUsed: Math.random() > 0.3, // 70% chance d'utilisation biométrique
    };

    if (!isSuccessful) {
      result.error = `${method} transaction failed`;
    }

    return result;
  }

  /**
   * Générer un ID de transaction unique
   * Responsabilité unique : génération d'identifiants
   */
  generateTransactionId() {
    const timestamp = Date.now().toString();
    const random = crypto.randomBytes(8).toString("hex");
    return `demo_${timestamp}_${random}`;
  }

  /**
   * Calculer les frais de traitement
   * Responsabilité unique : calcul des frais
   */
  calculateProcessingFee(amount, method) {
    const fees = {
      credit_card: 0.029, // 2.9%
      paypal: 0.034, // 3.4%
      bank_transfer: 0.01, // 1%
      apple_pay: 0.029, // 2.9%
      google_pay: 0.029, // 2.9%
    };

    const feeRate = fees[method] || 0.03;
    return Math.round(amount * feeRate * 100) / 100;
  }

  /**
   * Générer payload webhook pour notifications
   * Responsabilité unique : génération webhooks
   */
  generateWebhookPayload(transactionData) {
    return {
      event: "payment.processed",
      timestamp: new Date().toISOString(),
      data: {
        transactionId: transactionData.transactionId,
        status: transactionData.status,
        amount: transactionData.amount,
        currency: transactionData.currency,
        orderId: transactionData.orderId,
      },
      signature: crypto
        .createHmac("sha256", "demo_webhook_secret")
        .update(JSON.stringify(transactionData))
        .digest("hex"),
    };
  }
}

module.exports = { PaymentProcessor };
