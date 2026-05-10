// server/src/interfaces/IStarRepository.js
// Interface définissant le contrat pour les opérations sur les étoiles
// Principe d'inversion de dépendances (SOLID)

/**
 * Interface abstraite pour le repository des étoiles
 * Définit les méthodes que toute implémentation doit fournir
 */
class IStarRepository {
  async findById(_id) {
    throw new Error("Method findById() must be implemented");
  }

  async findAndCountAll(_options) {
    throw new Error("Method findAndCountAll() must be implemented");
  }

  async findAll(_where, _options) {
    throw new Error("Method findAll() must be implemented");
  }

  async create(_starData) {
    throw new Error("Method create() must be implemented");
  }

  async update(_id, _updateData) {
    throw new Error("Method update() must be implemented");
  }

  async delete(_id) {
    throw new Error("Method delete() must be implemented");
  }

  async count(_where) {
    throw new Error("Method count() must be implemented");
  }

  async searchStars(_searchCriteria) {
    throw new Error("Method searchStars() must be implemented");
  }

  async getUniqueConstellations() {
    throw new Error("Method getUniqueConstellations() must be implemented");
  }

  async exists(_id) {
    throw new Error("Method exists() must be implemented");
  }
}

module.exports = { IStarRepository };
