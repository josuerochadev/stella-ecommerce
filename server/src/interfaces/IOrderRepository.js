// server/src/interfaces/IOrderRepository.js
// Interface définissant le contrat pour les opérations sur les commandes
// Principe d'inversion de dépendances (SOLID)

/**
 * Interface abstraite pour le repository des commandes
 * Définit les méthodes que toute implémentation doit fournir
 */
class IOrderRepository {
  async findById(id) {
    throw new Error('Method findById() must be implemented');
  }

  async findByIdSimple(id) {
    throw new Error('Method findByIdSimple() must be implemented');
  }

  async findByUserId(userId) {
    throw new Error('Method findByUserId() must be implemented');
  }

  async findAndCountAll(options) {
    throw new Error('Method findAndCountAll() must be implemented');
  }

  async findAll(where, options) {
    throw new Error('Method findAll() must be implemented');
  }

  async create(orderData, transaction) {
    throw new Error('Method create() must be implemented');
  }

  async update(id, updateData, transaction) {
    throw new Error('Method update() must be implemented');
  }

  async updateStatus(id, status) {
    throw new Error('Method updateStatus() must be implemented');
  }

  async delete(id) {
    throw new Error('Method delete() must be implemented');
  }

  async count(where) {
    throw new Error('Method count() must be implemented');
  }

  async searchOrders(searchCriteria) {
    throw new Error('Method searchOrders() must be implemented');
  }

  async belongsToUser(orderId, userId) {
    throw new Error('Method belongsToUser() must be implemented');
  }
}

module.exports = { IOrderRepository };