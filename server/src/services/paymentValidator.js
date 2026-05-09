// server/src/services/paymentValidator.js
// Service de validation des paiements - principe KISS

const _crypto = require("node:crypto");

/**
 * Service dédié à la validation des données de paiement
 * Responsabilité unique : validation et détection de marques
 */
class PaymentValidator {
  /**
   * Valider les données de carte de crédit
   * Responsabilité unique : validation des cartes
   */
  static validateCreditCard(cardData) {
    const { number } = cardData;

    // Cartes de test pour démonstration
    const testCards = {
      4111111111111111: { brand: "Visa", success: true },
      5555555555554444: { brand: "MasterCard", success: true },
      4000000000000002: { brand: "Visa", success: false, error: "Card declined" },
      4000000000009995: { brand: "Visa", success: false, error: "Insufficient funds" },
    };

    const cardInfo = testCards[number] || {
      brand: PaymentValidator.detectCardBrand(number),
      success: Math.random() > 0.1, // 90% success rate par défaut
    };

    return {
      isValid: cardInfo.success,
      brand: cardInfo.brand,
      last4: number.slice(-4),
      error: cardInfo.error || null,
    };
  }

  /**
   * Détecter la marque de carte de crédit
   * Responsabilité unique : identification de marque
   */
  static detectCardBrand(number) {
    if (number.startsWith("4")) return "Visa";
    if (number.startsWith("5")) return "MasterCard";
    if (number.startsWith("3")) return "American Express";
    return "Unknown";
  }

  /**
   * Valider les données de base d'un paiement
   * Responsabilité unique : validation structure
   */
  static validatePaymentData(paymentData) {
    const { amount, currency = "EUR", method, orderId } = paymentData;

    const errors = [];

    // Validation du montant
    if (!amount || amount <= 0) {
      errors.push("Invalid amount");
    }

    // Validation de la devise
    const supportedCurrencies = ["EUR", "USD", "GBP"];
    if (!supportedCurrencies.includes(currency)) {
      errors.push("Unsupported currency");
    }

    // Validation de la méthode
    const supportedMethods = ["credit_card", "paypal", "bank_transfer", "apple_pay", "google_pay"];
    if (!supportedMethods.includes(method)) {
      errors.push("Unsupported payment method");
    }

    // Validation de l'ID commande
    if (!orderId) {
      errors.push("Order ID is required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Obtenir les méthodes de paiement supportées
   * Responsabilité unique : configuration des méthodes
   */
  static getSupportedPaymentMethods() {
    return [
      {
        id: "credit_card",
        name: "Carte de crédit",
        description: "Visa, MasterCard, American Express",
        processingFee: 0.029, // 2.9%
      },
      {
        id: "paypal",
        name: "PayPal",
        description: "Paiement sécurisé via PayPal",
        processingFee: 0.034, // 3.4%
      },
      {
        id: "bank_transfer",
        name: "Virement bancaire",
        description: "Transfert direct depuis votre banque",
        processingFee: 0.01, // 1%
      },
      {
        id: "apple_pay",
        name: "Apple Pay",
        description: "Paiement rapide avec Touch ID/Face ID",
        processingFee: 0.029, // 2.9%
      },
      {
        id: "google_pay",
        name: "Google Pay",
        description: "Paiement sécurisé avec Google",
        processingFee: 0.029, // 2.9%
      },
    ];
  }

  /**
   * Obtenir les devises supportées
   * Responsabilité unique : configuration des devises
   */
  static getSupportedCurrencies() {
    return ["EUR", "USD", "GBP"];
  }
}

module.exports = { PaymentValidator };
