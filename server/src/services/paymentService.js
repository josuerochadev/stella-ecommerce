// server/src/services/paymentService.js
// Service principal de paiement - orchestrateur suivant principe KISS

const { PaymentValidator } = require('./paymentValidator');
const { PaymentProcessor } = require('./paymentProcessor');
const { PaymentRefundService } = require('./paymentRefundService');

const PAYMENT_METHOD_DISTRIBUTION = {
  credit_card: { percentage: 60, share: 0.6 },
  paypal: { percentage: 25, share: 0.25 },
  bank_transfer: { percentage: 10, share: 0.1 },
  apple_pay: { percentage: 3, share: 0.03 },
  google_pay: { percentage: 2, share: 0.02 },
};

/**
 * Service principal de paiement
 * Responsabilité unique : orchestration des services spécialisés
 */
class PaymentOrchestrator {
  constructor() {
    this.processor = new PaymentProcessor();
  }

  /**
   * Traiter un paiement - délégation au processeur
   * Responsabilité unique : orchestration
   */
  async processPayment(paymentData) {
    return await this.processor.processPayment(paymentData);
  }

  /**
   * Traiter un remboursement - délégation au service de remboursement
   * Responsabilité unique : orchestration
   */
  async processRefund(transactionId, amount, reason) {
    return await PaymentRefundService.processRefund(transactionId, amount, reason);
  }

  /**
   * Valider une carte de crédit - délégation au validateur
   * Responsabilité unique : orchestration
   */
  validateCreditCard(cardData) {
    return PaymentValidator.validateCreditCard(cardData);
  }

  /**
   * Obtenir les méthodes de paiement - délégation au validateur
   * Responsabilité unique : orchestration
   */
  getPaymentMethods() {
    return PaymentValidator.getSupportedPaymentMethods();
  }

  /**
   * Générer un payload webhook - délégation au processeur
   * Responsabilité unique : orchestration
   */
  generateWebhookPayload(transactionData) {
    return this.processor.generateWebhookPayload(transactionData);
  }

  /**
   * Générer un ID de transaction - délégation au processeur
   * Responsabilité unique : orchestration
   */
  generateTransactionId() {
    return this.processor.generateTransactionId();
  }

  /**
   * Calculer les frais de traitement - délégation au processeur
   * Responsabilité unique : orchestration
   */
  calculateProcessingFee(amount, method) {
    return this.processor.calculateProcessingFee(amount, method);
  }

  /**
   * Générer des statistiques de paiement - délégation au service de remboursement
   * Responsabilité unique : orchestration
   */
  generatePaymentStats(days = 30) {
    // Statistiques combinées des paiements et remboursements
    const paymentStats = this.generateBasicPaymentStats(days);
    const refundStats = PaymentRefundService.generateRefundStats(days);

    return {
      ...paymentStats,
      refunds: refundStats
    };
  }

  /**
   * Générer des statistiques basiques de paiement
   * Responsabilité unique : statistiques de base
   */
  generateBasicPaymentStats(days = 30) {
    const totalTransactions = Math.floor(Math.random() * 1000) + 100;
    const totalRevenue = Math.round(Math.random() * 50000 * 100) / 100;

    return {
      period: `${days} days`,
      totalTransactions,
      totalRevenue,
      averageTransactionAmount: Math.round((totalRevenue / totalTransactions) * 100) / 100,
      successRate: Math.round((Math.random() * 10 + 90) * 100) / 100, // 90-100%
      topPaymentMethods: Object.entries(PAYMENT_METHOD_DISTRIBUTION).map(([method, { share, percentage }]) => ({
        method,
        count: Math.floor(totalTransactions * share),
        percentage
      }))
    };
  }
}

// Créer et exporter une instance singleton
const paymentService = new PaymentOrchestrator();

module.exports = { paymentService };