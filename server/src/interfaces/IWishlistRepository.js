// server/src/interfaces/IWishlistRepository.js
// Interface définissant le contrat pour les opérations sur les listes d'envies
// Principe d'inversion de dépendances (SOLID)

/**
 * Interface abstraite pour le repository des listes d'envies
 * Définit les méthodes que toute implémentation doit fournir
 */
class IWishlistRepository {
  async findByUserId(_userId) {
    throw new Error("Method findByUserId() must be implemented");
  }

  async findItem(_userId, _starId) {
    throw new Error("Method findItem() must be implemented");
  }

  async addItem(_wishlistData) {
    throw new Error("Method addItem() must be implemented");
  }

  async removeItem(_userId, _starId) {
    throw new Error("Method removeItem() must be implemented");
  }

  async clearWishlist(_userId) {
    throw new Error("Method clearWishlist() must be implemented");
  }

  async exists(_userId, _starId) {
    throw new Error("Method exists() must be implemented");
  }

  async count(_userId) {
    throw new Error("Method count() must be implemented");
  }

  async findById(_id) {
    throw new Error("Method findById() must be implemented");
  }

  async deleteById(_id) {
    throw new Error("Method deleteById() must be implemented");
  }
}

module.exports = { IWishlistRepository };
