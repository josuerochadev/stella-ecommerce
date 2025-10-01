// server/src/interfaces/IStarRepository.js
// Interface définissant le contrat pour les opérations sur les étoiles
// Principe d'inversion de dépendances (SOLID)

/**
 * Interface abstraite pour le repository des étoiles
 * Définit les méthodes que toute implémentation doit fournir
 */
class IStarRepository {
  async findById(id) {
    throw new Error('Method findById() must be implemented');
  }

  async findAndCountAll(options) {
    throw new Error('Method findAndCountAll() must be implemented');
  }

  async findAll(where, options) {
    throw new Error('Method findAll() must be implemented');
  }

  async create(starData) {
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

  async searchStars(searchCriteria) {
    throw new Error('Method searchStars() must be implemented');
  }

  async getUniqueConstellations() {
    throw new Error('Method getUniqueConstellations() must be implemented');
  }

  async exists(id) {
    throw new Error('Method exists() must be implemented');
  }
}

module.exports = { IStarRepository };