// server/src/interfaces/ICartRepository.js
// Interface définissant le contrat pour les opérations sur les paniers
// Principe d'inversion de dépendances (SOLID)

/**
 * Interface abstraite pour le repository des paniers
 * Définit les méthodes que toute implémentation doit fournir
 */
class ICartRepository {
  async findByUserId(_userId, _transaction) {
    throw new Error("Method findByUserId() must be implemented");
  }

  async findById(_id) {
    throw new Error("Method findById() must be implemented");
  }

  async create(_cartData, _transaction) {
    throw new Error("Method create() must be implemented");
  }

  async delete(_id) {
    throw new Error("Method delete() must be implemented");
  }

  async deleteByUserId(_userId) {
    throw new Error("Method deleteByUserId() must be implemented");
  }

  async findCartItem(_cartId, _starId) {
    throw new Error("Method findCartItem() must be implemented");
  }

  async addCartItem(_cartItemData, _transaction) {
    throw new Error("Method addCartItem() must be implemented");
  }

  async updateCartItemQuantity(_cartItemId, _quantity, _transaction) {
    throw new Error("Method updateCartItemQuantity() must be implemented");
  }

  async removeCartItem(_cartItemId, _transaction) {
    throw new Error("Method removeCartItem() must be implemented");
  }

  async clearCart(_cartId, _transaction) {
    throw new Error("Method clearCart() must be implemented");
  }

  async countCartItems(_cartId) {
    throw new Error("Method countCartItems() must be implemented");
  }

  async exists(_userId) {
    throw new Error("Method exists() must be implemented");
  }
}

module.exports = { ICartRepository };
