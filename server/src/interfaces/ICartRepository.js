// server/src/interfaces/ICartRepository.js
// Interface définissant le contrat pour les opérations sur les paniers
// Principe d'inversion de dépendances (SOLID)

/**
 * Interface abstraite pour le repository des paniers
 * Définit les méthodes que toute implémentation doit fournir
 */
class ICartRepository {
  async findByUserId(userId) {
    throw new Error('Method findByUserId() must be implemented');
  }

  async findById(id) {
    throw new Error('Method findById() must be implemented');
  }

  async create(cartData, transaction) {
    throw new Error('Method create() must be implemented');
  }

  async delete(id) {
    throw new Error('Method delete() must be implemented');
  }

  async deleteByUserId(userId) {
    throw new Error('Method deleteByUserId() must be implemented');
  }

  async findCartItem(cartId, starId) {
    throw new Error('Method findCartItem() must be implemented');
  }

  async addCartItem(cartItemData, transaction) {
    throw new Error('Method addCartItem() must be implemented');
  }

  async updateCartItemQuantity(cartItemId, quantity, transaction) {
    throw new Error('Method updateCartItemQuantity() must be implemented');
  }

  async removeCartItem(cartItemId, transaction) {
    throw new Error('Method removeCartItem() must be implemented');
  }

  async clearCart(cartId, transaction) {
    throw new Error('Method clearCart() must be implemented');
  }

  async countCartItems(cartId) {
    throw new Error('Method countCartItems() must be implemented');
  }

  async exists(userId) {
    throw new Error('Method exists() must be implemented');
  }
}

module.exports = { ICartRepository };