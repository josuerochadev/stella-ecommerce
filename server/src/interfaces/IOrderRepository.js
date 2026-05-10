// server/src/interfaces/IOrderRepository.js
// Interface définissant le contrat pour les opérations sur les commandes
// Principe d'inversion de dépendances (SOLID)

/**
 * Interface abstraite pour le repository des commandes
 * Définit les méthodes que toute implémentation doit fournir
 */
class IOrderRepository {
  async findById(_id) {
    throw new Error("Method findById() must be implemented");
  }

  async findByIdSimple(_id) {
    throw new Error("Method findByIdSimple() must be implemented");
  }

  async findByUserId(_userId) {
    throw new Error("Method findByUserId() must be implemented");
  }

  async findAndCountAll(_options) {
    throw new Error("Method findAndCountAll() must be implemented");
  }

  async findAll(_where, _options) {
    throw new Error("Method findAll() must be implemented");
  }

  async create(_orderData, _transaction) {
    throw new Error("Method create() must be implemented");
  }

  async update(_id, _updateData, _transaction) {
    throw new Error("Method update() must be implemented");
  }

  async updateStatus(_id, _status) {
    throw new Error("Method updateStatus() must be implemented");
  }

  async delete(_id) {
    throw new Error("Method delete() must be implemented");
  }

  async count(_where) {
    throw new Error("Method count() must be implemented");
  }

  async searchOrders(_searchCriteria) {
    throw new Error("Method searchOrders() must be implemented");
  }

  async belongsToUser(_orderId, _userId) {
    throw new Error("Method belongsToUser() must be implemented");
  }
}

module.exports = { IOrderRepository };
