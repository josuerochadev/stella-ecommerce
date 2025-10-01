// server/src/controllers/profileController.js
// Responsabilité unique : Gestion des profils utilisateur

const { User } = require("../models");
const { AppError } = require("../middlewares/errorHandler");
const tokenService = require("../services/tokenService");

/**
 * Contrôleur de gestion des profils
 * Responsabilité unique : CRUD des données de profil utilisateur
 */
class ProfileController {
  /**
   * Récupérer le profil utilisateur
   * Responsabilité : Lecture des données de profil
   */
  static async getUserProfile(req, res, next) {
    try {
      const user = await User.findByPk(req.user.userId, {
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        return next(new AppError("User not found", 404));
      }

      res.json(user);
    } catch (error) {
      next(new AppError(`Error fetching user profile: ${error.message}`, 500));
    }
  }

  /**
   * Mettre à jour le profil utilisateur
   * Responsabilité : Modification des données de profil
   */
  static async updateProfile(req, res, next) {
    try {
      const { firstName, lastName, email } = req.body;
      const user = await User.findByPk(req.user.userId);

      if (!user) {
        return next(new AppError("User not found", 404));
      }

      // Vérification de l'unicité de l'email si modifié
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return next(new AppError("Email already in use", 400));
        }
      }

      // Mise à jour des champs
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.email = email || user.email;

      await user.save();

      res.json({
        message: "Profile updated successfully",
        data: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      next(new AppError(`Error updating user profile: ${error.message}`, 500));
    }
  }

  /**
   * Supprimer le compte utilisateur
   * Responsabilité : Suppression complète du profil et données associées
   */
  static async deleteAccount(req, res, next) {
    try {
      const user = await User.findByPk(req.user.userId);
      if (!user) {
        return next(new AppError("User not found", 404));
      }

      // Révocation de tous les tokens avant suppression
      await tokenService.revokeAllUserTokens(req.user.userId);

      // Suppression de l'utilisateur (cascade vers données liées)
      await user.destroy();

      // Suppression du cookie de refresh token
      res.clearCookie('refreshToken');

      res.status(200).json({
        success: true,
        message: "Account deleted successfully"
      });
    } catch (error) {
      next(new AppError(`Error deleting user: ${error.message}`, 500));
    }
  }

  /**
   * Obtenir les statistiques du profil utilisateur
   * Responsabilité : Calcul et présentation des métriques de profil
   */
  static async getProfileStats(req, res, next) {
    try {
      const user = await User.findByPk(req.user.userId, {
        include: [
          { association: 'orders', attributes: ['id', 'status'] },
          { association: 'reviews', attributes: ['id', 'rating'] },
          { association: 'cart', attributes: ['id'] },
          { association: 'wishlist', attributes: ['id'] },
        ],
      });

      if (!user) {
        return next(new AppError("User not found", 404));
      }

      const stats = {
        totalOrders: user.orders?.length || 0,
        completedOrders: user.orders?.filter(order => order.status === 'delivered')?.length || 0,
        totalReviews: user.reviews?.length || 0,
        averageRating: user.reviews?.length > 0
          ? (user.reviews.reduce((sum, review) => sum + review.rating, 0) / user.reviews.length).toFixed(1)
          : 0,
        cartItems: user.cart?.length || 0,
        wishlistItems: user.wishlist?.length || 0,
      };

      res.json({
        success: true,
        stats,
      });
    } catch (error) {
      next(new AppError(`Error fetching profile stats: ${error.message}`, 500));
    }
  }
}

// Exports des méthodes statiques pour compatibilité
module.exports = {
  ProfileController,
  getUserProfile: ProfileController.getUserProfile,
  updateProfile: ProfileController.updateProfile,
  deleteAccount: ProfileController.deleteAccount,
  getProfileStats: ProfileController.getProfileStats,
};