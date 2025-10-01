// server/src/interfaces/IReviewRepository.js
// Interface définissant le contrat pour les opérations sur les avis
// Principe d'inversion de dépendances (SOLID)

/**
 * Interface abstraite pour le repository des avis
 * Définit les méthodes que toute implémentation doit fournir
 */
class IReviewRepository {
  async findById(id) {
    throw new Error('Method findById() must be implemented');
  }

  async findByStarId(starId) {
    throw new Error('Method findByStarId() must be implemented');
  }

  async findByUserId(userId) {
    throw new Error('Method findByUserId() must be implemented');
  }

  async findAll(where, options) {
    throw new Error('Method findAll() must be implemented');
  }

  async create(reviewData) {
    throw new Error('Method create() must be implemented');
  }

  async update(id, updateData) {
    throw new Error('Method update() must be implemented');
  }

  async delete(id) {
    throw new Error('Method delete() must be implemented');
  }

  async count(where) {
    throw new Error('Method count() must be implemented');
  }

  async getAverageRating(starId) {
    throw new Error('Method getAverageRating() must be implemented');
  }

  async hasUserReviewedStar(userId, starId) {
    throw new Error('Method hasUserReviewedStar() must be implemented');
  }

  async findUserReviewForStar(userId, starId) {
    throw new Error('Method findUserReviewForStar() must be implemented');
  }

  async searchReviews(searchCriteria) {
    throw new Error('Method searchReviews() must be implemented');
  }
}

module.exports = { IReviewRepository };