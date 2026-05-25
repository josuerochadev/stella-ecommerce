// server/src/controllers/profileController.js
// Responsabilité unique : Gestion des profils utilisateur

const { User, Order, Review, Cart, CartItem, Wishlist } = require("../models");
const { AppError } = require("../middlewares/errorHandler");
const tokenService = require("../services/tokenService");
const bcrypt = require("bcrypt");
const { fn, col } = require("sequelize");

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
      const { password } = req.body;
      if (!password) {
        return next(new AppError("Password confirmation is required to delete your account", 400));
      }

      const user = await User.findByPk(req.user.userId);
      if (!user) {
        return next(new AppError("User not found", 404));
      }

      // Vérification du mot de passe avant suppression
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return next(new AppError("Incorrect password", 401));
      }

      // Révocation de tous les tokens avant suppression
      await tokenService.revokeAllUserTokens(req.user.userId);

      // Suppression de l'utilisateur (cascade vers données liées)
      await user.destroy();

      // Suppression du cookie de refresh token
      res.clearCookie("refreshToken");

      res.status(200).json({
        success: true,
        message: "Account deleted successfully",
      });
    } catch (error) {
      next(new AppError(`Error deleting user: ${error.message}`, 500));
    }
  }

  /**
   * Changer le mot de passe
   */
  static async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return next(new AppError("Current and new passwords are required", 400));
      }

      if (newPassword.length < 8) {
        return next(new AppError("New password must be at least 8 characters", 400));
      }

      const user = await User.findByPk(req.user.userId);
      if (!user) {
        return next(new AppError("User not found", 404));
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return next(new AppError("Current password is incorrect", 401));
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      next(new AppError(`Error changing password: ${error.message}`, 500));
    }
  }

  /**
   * Obtenir les statistiques du profil utilisateur
   * Responsabilité : Calcul et présentation des métriques de profil
   */
  static async getProfileStats(req, res, next) {
    try {
      const userId = req.user.userId;

      const [totalOrders, completedOrders, reviewStats, cartItemCount, wishlistItems] =
        await Promise.all([
          Order.count({ where: { userId } }),
          Order.count({ where: { userId, status: "delivered" } }),
          Review.findOne({
            where: { userId },
            attributes: [
              [fn("COUNT", col("id")), "totalReviews"],
              [fn("COALESCE", fn("AVG", col("rating")), 0), "averageRating"],
            ],
            raw: true,
          }),
          Cart.findOne({ where: { userId } }).then((cart) =>
            cart ? CartItem.count({ where: { cartId: cart.id } }) : 0,
          ),
          Wishlist.count({ where: { userId } }),
        ]);

      const stats = {
        totalOrders,
        completedOrders,
        totalReviews: Number(reviewStats?.totalReviews) || 0,
        averageRating: Number(Number(reviewStats?.averageRating || 0).toFixed(1)),
        cartItems: cartItemCount,
        wishlistItems,
      };

      res.json({
        success: true,
        stats,
      });
    } catch (error) {
      next(new AppError(`Error fetching profile stats: ${error.message}`, 500));
    }
  }

  /**
   * Exporter toutes les données personnelles (RGPD art. 20 — portabilité)
   */
  static async exportData(req, res, next) {
    try {
      const user = await User.findByPk(req.user.userId, {
        attributes: { exclude: ["password"] },
        include: [
          {
            association: "Orders",
            include: [{ association: "Stars", attributes: ["starid", "name", "price"] }],
          },
          {
            association: "Reviews",
            attributes: ["id", "starId", "rating", "comment", "createdAt"],
          },
          {
            association: "Wishlists",
            attributes: ["id", "starId", "createdAt"],
          },
        ],
      });

      if (!user) {
        return next(new AppError("User not found", 404));
      }

      const exportData = {
        exportDate: new Date().toISOString(),
        profile: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        orders: user.Orders || [],
        reviews: user.Reviews || [],
        wishlist: user.Wishlists || [],
      };

      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="stella-data-export-${Date.now()}.json"`,
      );

      res.json({
        success: true,
        data: exportData,
      });
    } catch (error) {
      next(new AppError(`Error exporting user data: ${error.message}`, 500));
    }
  }
}

// Exports des méthodes statiques pour compatibilité
module.exports = {
  ProfileController,
  getUserProfile: ProfileController.getUserProfile,
  updateProfile: ProfileController.updateProfile,
  changePassword: ProfileController.changePassword,
  deleteAccount: ProfileController.deleteAccount,
  getProfileStats: ProfileController.getProfileStats,
  exportData: ProfileController.exportData,
};
