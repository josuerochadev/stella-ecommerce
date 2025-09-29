// server/src/controllers/authController.js
// Responsabilité unique : Authentification des utilisateurs

const { User } = require("../models");
const bcrypt = require("bcrypt");
const { AppError } = require("../middlewares/errorHandler");
const tokenService = require("../services/tokenService");

/**
 * Contrôleur d'authentification
 * Responsabilité unique : Gestion des sessions et tokens utilisateur
 */
class AuthController {
  /**
   * Inscription d'un nouvel utilisateur
   * Responsabilité : Création de compte et session initiale
   */
  static async register(req, res, next) {
    try {
      const { firstName, lastName, email, password } = req.body;

      // Vérification de l'existence de l'utilisateur
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return next(new AppError("Email already in use", 400));
      }

      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      const { accessToken, refreshToken } = tokenService.generateTokens({
        userId: newUser.id,
        role: newUser.role
      });

      await tokenService.saveRefreshToken(newUser.id, refreshToken);

      // Configuration du cookie de refresh token
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
      });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        userId: newUser.id,
        accessToken,
      });
    } catch (error) {
      next(new AppError(`Error registering user: ${error.message}`, 400));
    }
  }

  /**
   * Connexion d'un utilisateur
   * Responsabilité : Authentification et génération de session
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return next(new AppError("Invalid email or password", 401));
      }

      // Vérification du mot de passe
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return next(new AppError("Invalid email or password", 401));
      }

      const { accessToken, refreshToken } = tokenService.generateTokens({
        userId: user.id,
        role: user.role
      });

      await tokenService.saveRefreshToken(user.id, refreshToken);

      // Configuration du cookie de refresh token
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
      });

      res.json({
        success: true,
        message: "Login successful",
        accessToken,
        userId: user.id,
        role: user.role,
      });
    } catch (error) {
      next(new AppError(`Error logging in: ${error.message}`, 500));
    }
  }

  /**
   * Déconnexion d'un utilisateur
   * Responsabilité : Invalidation des tokens et session
   */
  static async logout(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (refreshToken) {
        await tokenService.revokeRefreshToken(refreshToken);
      }

      // Révocation de tous les tokens si utilisateur authentifié
      if (req.user) {
        await tokenService.revokeAllUserTokens(req.user.userId);
      }

      // Suppression du cookie de refresh token
      res.clearCookie('refreshToken');

      res.status(200).json({
        success: true,
        message: "Logout successful"
      });
    } catch (error) {
      next(new AppError(`Error during logout: ${error.message}`, 500));
    }
  }

  /**
   * Renouvellement du token d'accès
   * Responsabilité : Rotation des tokens de session
   */
  static async refreshToken(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return next(new AppError("Refresh token not provided", 401));
      }

      const validationResult = await tokenService.validateRefreshToken(refreshToken);

      if (!validationResult) {
        return next(new AppError("Invalid or expired refresh token", 401));
      }

      const { decoded } = validationResult;

      // Génération de nouveaux tokens
      const { accessToken, refreshToken: newRefreshToken } = tokenService.generateTokens({
        userId: decoded.userId,
        role: decoded.role
      });

      // Remplacement de l'ancien refresh token
      await tokenService.revokeRefreshToken(refreshToken);
      await tokenService.saveRefreshToken(decoded.userId, newRefreshToken);

      // Configuration du nouveau cookie de refresh token
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
      });

      res.json({
        success: true,
        accessToken,
      });
    } catch (error) {
      next(new AppError(`Error refreshing token: ${error.message}`, 500));
    }
  }
}

// Exports des méthodes statiques pour compatibilité
module.exports = {
  AuthController,
  register: AuthController.register,
  login: AuthController.login,
  logout: AuthController.logout,
  refreshToken: AuthController.refreshToken,
};