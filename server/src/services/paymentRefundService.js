// server/src/services/paymentRefundService.js
// Service de remboursement des paiements - principe KISS

const crypto = require("node:crypto");

/**
 * Service dédié aux remboursements
 * Responsabilité unique : gestion complète des remboursements
 */
class PaymentRefundService {
  /**
   * Traiter un remboursement complet
   * Responsabilité unique : orchestration remboursement
   */
  static async processRefund(transactionId, amount, reason = "Customer request") {
    // Validation des paramètres
    const validation = PaymentRefundService.validateRefundRequest(transactionId, amount, reason);
    if (!validation.isValid) {
      throw new Error(`Refund validation failed: ${validation.errors.join(", ")}`);
    }

    // Génération des données de remboursement
    const refundId = PaymentRefundService.generateRefundId();

    // Simulation de délai de traitement
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulation de succès/échec
    const isSuccessful = Math.random() > 0.05; // 95% de succès

    if (!isSuccessful) {
      return {
        refundId,
        originalTransactionId: transactionId,
        amount,
        reason,
        status: "failed",
        error: "Refund processing failed - please contact support",
        timestamp: new Date().toISOString(),
      };
    }

    return {
      refundId,
      originalTransactionId: transactionId,
      amount: Number.parseFloat(amount),
      reason,
      status: "completed",
      estimatedArrival: PaymentRefundService.calculateRefundArrivalDate(),
      processingFee: PaymentRefundService.calculateRefundFee(amount),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Traiter un remboursement partiel
   * Responsabilité unique : remboursements partiels
   */
  static async processPartialRefund(
    transactionId,
    originalAmount,
    refundAmount,
    reason = "Partial refund",
  ) {
    // Validation spécifique aux remboursements partiels
    if (refundAmount > originalAmount) {
      throw new Error("Refund amount cannot exceed original transaction amount");
    }

    return await PaymentRefundService.processRefund(transactionId, refundAmount, reason);
  }

  /**
   * Obtenir le statut d'un remboursement
   * Responsabilité unique : consultation statut
   */
  static async getRefundStatus(refundId) {
    // Simulation de consultation d'une base de données
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Simulation de statuts possibles
    const statuses = ["completed", "processing", "pending", "failed"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      refundId,
      status: randomStatus,
      lastUpdated: new Date().toISOString(),
      estimatedCompletion:
        randomStatus === "processing"
          ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
          : null,
    };
  }

  /**
   * Lister les remboursements d'une transaction
   * Responsabilité unique : historique remboursements
   */
  static async getRefundsForTransaction(transactionId) {
    // Simulation de récupération d'historique
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Génération d'un historique fictif
    const refundCount = Math.floor(Math.random() * 3); // 0-2 remboursements
    const refunds = [];

    for (let i = 0; i < refundCount; i++) {
      refunds.push({
        refundId: PaymentRefundService.generateRefundId(),
        originalTransactionId: transactionId,
        amount: Math.round(Math.random() * 100 * 100) / 100,
        reason: "Customer request",
        status: "completed",
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    return refunds;
  }

  /**
   * Valider une demande de remboursement
   * Responsabilité unique : validation données
   */
  static validateRefundRequest(transactionId, amount, reason) {
    const errors = [];

    // Validation ID transaction
    if (!transactionId || typeof transactionId !== "string") {
      errors.push("Valid transaction ID is required");
    }

    // Validation montant
    if (!amount || amount <= 0) {
      errors.push("Refund amount must be positive");
    }

    // Validation raison
    if (!reason || typeof reason !== "string" || reason.trim().length === 0) {
      errors.push("Refund reason is required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Générer un ID de remboursement unique
   * Responsabilité unique : génération identifiants
   */
  static generateRefundId() {
    const timestamp = Date.now().toString();
    const random = crypto.randomBytes(6).toString("hex");
    return `refund_${timestamp}_${random}`;
  }

  /**
   * Calculer les frais de remboursement
   * Responsabilité unique : calcul frais
   */
  static calculateRefundFee(amount) {
    // Frais fixe de remboursement : 0.5% avec minimum 0.50€
    const feeRate = 0.005; // 0.5%
    const minimumFee = 0.5;

    const calculatedFee = amount * feeRate;
    return Math.max(calculatedFee, minimumFee);
  }

  /**
   * Calculer la date d'arrivée estimée du remboursement
   * Responsabilité unique : calcul délais
   */
  static calculateRefundArrivalDate() {
    // Remboursement estimé entre 3 et 7 jours ouvrables
    const businessDays = Math.floor(Math.random() * 5) + 3; // 3-7 jours
    const arrivalDate = new Date();

    // Ajouter seulement les jours ouvrables
    let addedDays = 0;
    while (addedDays < businessDays) {
      arrivalDate.setDate(arrivalDate.getDate() + 1);
      // Ignorer weekends (0 = Dimanche, 6 = Samedi)
      if (arrivalDate.getDay() !== 0 && arrivalDate.getDay() !== 6) {
        addedDays++;
      }
    }

    return arrivalDate.toISOString();
  }

  /**
   * Générer des statistiques de remboursement
   * Responsabilité unique : analytics remboursements
   */
  static generateRefundStats(days = 30) {
    const totalRefunds = Math.floor(Math.random() * 50) + 10; // 10-60 remboursements
    const totalAmount = Math.round(Math.random() * 5000 * 100) / 100; // 0-5000€

    return {
      period: `${days} days`,
      totalRefunds,
      totalAmount,
      averageRefundAmount: Math.round((totalAmount / totalRefunds) * 100) / 100,
      refundRate: Math.round(Math.random() * 10 * 100) / 100, // 0-10%
      topReasons: [
        { reason: "Customer request", count: Math.floor(totalRefunds * 0.4) },
        { reason: "Product defect", count: Math.floor(totalRefunds * 0.3) },
        { reason: "Billing error", count: Math.floor(totalRefunds * 0.2) },
        { reason: "Duplicate charge", count: Math.floor(totalRefunds * 0.1) },
      ],
    };
  }
}

module.exports = { PaymentRefundService };
