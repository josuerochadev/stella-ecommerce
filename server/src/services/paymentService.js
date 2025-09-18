// server/src/services/paymentService.js
// Service de simulation de paiement pour démonstration portfolio

const crypto = require('crypto');

class PaymentSimulator {
  constructor() {
    // Configurations pour différents scénarios de démonstration
    this.paymentMethods = ['credit_card', 'paypal', 'bank_transfer', 'apple_pay', 'google_pay'];
    this.currencies = ['EUR', 'USD', 'GBP'];

    // Simulation de taux de succès (configurable pour démo)
    this.successRate = 0.9; // 90% de succès par défaut
    this.processingTime = {
      min: 1000, // 1 seconde minimum
      max: 3000  // 3 secondes maximum
    };
  }

  // Générer un ID de transaction réaliste
  generateTransactionId() {
    const timestamp = Date.now().toString();
    const random = crypto.randomBytes(8).toString('hex');
    return `demo_${timestamp}_${random}`;
  }

  // Simuler une validation de carte de crédit
  validateCreditCard(cardData) {
    const { number, expiry, cvv, name } = cardData;

    // Cartes de test pour démonstration
    const testCards = {
      '4111111111111111': { brand: 'Visa', success: true },
      '5555555555554444': { brand: 'MasterCard', success: true },
      '4000000000000002': { brand: 'Visa', success: false, error: 'Card declined' },
      '4000000000009995': { brand: 'Visa', success: false, error: 'Insufficient funds' }
    };

    const cardInfo = testCards[number] || {
      brand: this.detectCardBrand(number),
      success: Math.random() > (1 - this.successRate)
    };

    return {
      isValid: cardInfo.success,
      brand: cardInfo.brand,
      last4: number.slice(-4),
      error: cardInfo.error || null
    };
  }

  // Détecter la marque de carte
  detectCardBrand(number) {
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5')) return 'MasterCard';
    if (number.startsWith('3')) return 'American Express';
    return 'Unknown';
  }

  // Simulation de processus de paiement principal
  async processPayment(paymentData) {
    const { amount, currency = 'EUR', method, orderId, customerData, cardData } = paymentData;

    // Délai de traitement réaliste
    const processingDelay = Math.random() *
      (this.processingTime.max - this.processingTime.min) +
      this.processingTime.min;

    await new Promise(resolve => setTimeout(resolve, processingDelay));

    // Génération des données de transaction
    const transactionId = this.generateTransactionId();
    const processingFee = this.calculateProcessingFee(amount, method);

    let result = {
      transactionId,
      status: 'pending',
      amount: parseFloat(amount),
      currency,
      method,
      orderId,
      processingFee,
      timestamp: new Date().toISOString(),
      processingTime: Math.round(processingDelay)
    };

    // Logique spécifique selon la méthode de paiement
    switch (method) {
      case 'credit_card':
        result = await this.processCreditCard(result, cardData);
        break;
      case 'paypal':
        result = await this.processPayPal(result, customerData);
        break;
      case 'bank_transfer':
        result = await this.processBankTransfer(result, customerData);
        break;
      case 'apple_pay':
      case 'google_pay':
        result = await this.processDigitalWallet(result, method);
        break;
      default:
        result.status = 'failed';
        result.error = 'Unsupported payment method';
    }

    // Log pour démonstration
    console.log(`💳 Payment ${result.status.toUpperCase()}: ${result.transactionId}`);

    return result;
  }

  // Traitement carte de crédit
  async processCreditCard(result, cardData) {
    if (!cardData) {
      result.status = 'failed';
      result.error = 'Card data required';
      return result;
    }

    const cardValidation = this.validateCreditCard(cardData);

    if (!cardValidation.isValid) {
      result.status = 'failed';
      result.error = cardValidation.error || 'Card validation failed';
      result.cardInfo = {
        brand: cardValidation.brand,
        last4: cardValidation.last4
      };
      return result;
    }

    // Simulation de succès/échec
    const isSuccessful = Math.random() > (1 - this.successRate);

    result.status = isSuccessful ? 'completed' : 'failed';
    result.cardInfo = {
      brand: cardValidation.brand,
      last4: cardValidation.last4
    };

    if (!isSuccessful) {
      const errors = [
        'Transaction declined by bank',
        'Insufficient funds',
        'Card expired',
        'Security check failed'
      ];
      result.error = errors[Math.floor(Math.random() * errors.length)];
    }

    return result;
  }

  // Traitement PayPal
  async processPayPal(result, customerData) {
    // PayPal a généralement un taux de succès plus élevé
    const isSuccessful = Math.random() > 0.05; // 95% succès

    result.status = isSuccessful ? 'completed' : 'failed';
    result.paypalInfo = {
      payerId: `PAYER_${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
      email: customerData?.email || 'demo@paypal.com'
    };

    if (!isSuccessful) {
      result.error = 'PayPal transaction declined';
    }

    return result;
  }

  // Traitement virement bancaire
  async processBankTransfer(result, customerData) {
    // Virement toujours en pending initialement
    result.status = 'pending';
    result.bankInfo = {
      reference: `BT_${Date.now()}`,
      estimatedCompletion: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      instructions: 'Transfer will be processed within 1-2 business days'
    };

    return result;
  }

  // Traitement portefeuille numérique
  async processDigitalWallet(result, method) {
    const isSuccessful = Math.random() > 0.1; // 90% succès

    result.status = isSuccessful ? 'completed' : 'failed';
    result.walletInfo = {
      provider: method,
      deviceId: `${method.toUpperCase()}_${crypto.randomBytes(4).toString('hex')}`
    };

    if (!isSuccessful) {
      result.error = `${method} authentication failed`;
    }

    return result;
  }

  // Calcul des frais de traitement
  calculateProcessingFee(amount, method) {
    const fees = {
      credit_card: 0.029, // 2.9%
      paypal: 0.034,      // 3.4%
      bank_transfer: 0.01, // 1%
      apple_pay: 0.025,   // 2.5%
      google_pay: 0.025   // 2.5%
    };

    const rate = fees[method] || 0.03;
    return Math.round(amount * rate * 100) / 100;
  }

  // Remboursement simulation
  async processRefund(transactionId, amount, reason) {
    const refundId = `refund_${this.generateTransactionId()}`;

    // Simulation de délai de remboursement
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      refundId,
      originalTransactionId: transactionId,
      amount,
      reason,
      status: 'completed',
      estimatedArrival: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      timestamp: new Date().toISOString()
    };
  }

  // Webhook simulation pour notifications
  generateWebhookPayload(transactionData) {
    return {
      event: 'payment.completed',
      data: transactionData,
      timestamp: new Date().toISOString(),
      signature: crypto
        .createHmac('sha256', 'demo_webhook_secret')
        .update(JSON.stringify(transactionData))
        .digest('hex')
    };
  }

  // Méthodes utilitaires pour démo
  getPaymentMethods() {
    return this.paymentMethods.map(method => ({
      id: method,
      name: method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      fees: this.calculateProcessingFee(100, method), // Frais pour 100€
      processingTime: method === 'bank_transfer' ? '1-2 days' : 'Instant'
    }));
  }

  // Statistiques pour panel admin
  generatePaymentStats(days = 30) {
    const stats = {
      totalTransactions: Math.floor(Math.random() * 1000) + 500,
      successfulTransactions: 0,
      totalAmount: 0,
      averageAmount: 0,
      topMethods: []
    };

    stats.successfulTransactions = Math.floor(stats.totalTransactions * this.successRate);
    stats.totalAmount = Math.floor(Math.random() * 50000) + 25000;
    stats.averageAmount = Math.round(stats.totalAmount / stats.totalTransactions * 100) / 100;

    stats.topMethods = this.paymentMethods.map(method => ({
      method,
      count: Math.floor(Math.random() * 200) + 50,
      amount: Math.floor(Math.random() * 10000) + 5000
    })).sort((a, b) => b.count - a.count);

    return stats;
  }
}

// Instance singleton
const paymentService = new PaymentSimulator();

module.exports = {
  PaymentSimulator,
  paymentService
};