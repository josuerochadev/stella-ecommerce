// server/src/controllers/authController.js
// Responsabilité unique : Authentification des utilisateurs
// Utilise l'injection de dépendances pour respecter le principe DIP

const { AppError } = require("../middlewares/errorHandler");
const { getService } = require("../container/containerConfig");
const { REFRESH_TOKEN_COOKIE_OPTIONS } = require("../config/cookieConfig");
const logger = require("../utils/logger");

/**
 * Contrôleur d'authentification avec injection de dépendances
 * Responsabilité unique : Orchestration des services d'authentification
 */
class AuthController {
  constructor(hashingService, userRepository, tokenService) {
    this.hashingService = hashingService;
    this.userRepository = userRepository;
    this.tokenService = tokenService;
  }
  /**
   * Inscription d'un nouvel utilisateur
   * Responsabilité : Orchestration de la création de compte via les services
   */
  async register(req, res, next) {
    try {
      const { firstName, lastName, email, password } = req.body;

      // Validation de la force du mot de passe
      const passwordValidation = await this.hashingService.validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        return next(new AppError(`Weak password: ${passwordValidation.errors.join(', ')}`, 400));
      }

      // Vérification de l'existence de l'utilisateur via le repository
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        return next(new AppError("Email already in use", 400));
      }

      // Hachage du mot de passe via le service
      const hashedPassword = await this.hashingService.hash(password);

      // Création de l'utilisateur via le repository
      const newUser = await this.userRepository.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      // Génération des tokens via le service
      const { accessToken, refreshToken } = this.tokenService.generateTokens({
        userId: newUser.id,
        role: newUser.role
      });

      await this.tokenService.saveRefreshToken(newUser.id, refreshToken);

      // Configuration du cookie de refresh token
      res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

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
   * Responsabilité : Orchestration de l'authentification via les services
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Recherche de l'utilisateur via le repository
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        return next(new AppError("Invalid email or password", 401));
      }

      // Vérification du mot de passe via le service de hachage
      const isMatch = await this.hashingService.compare(password, user.password);
      if (!isMatch) {
        return next(new AppError("Invalid email or password", 401));
      }

      // Vérification si le mot de passe nécessite un re-hachage
      if (this.hashingService.needsRehash && this.hashingService.needsRehash(user.password)) {
        // Re-hacher et mettre à jour en arrière-plan (sans bloquer la connexion)
        this.updatePasswordHashInBackground(user.id, password).catch(error => {
          logger.error('Failed to update password hash:', error);
        });
      }

      // Génération des tokens via le service
      const { accessToken, refreshToken } = this.tokenService.generateTokens({
        userId: user.id,
        role: user.role
      });

      await this.tokenService.saveRefreshToken(user.id, refreshToken);

      // Configuration du cookie de refresh token
      res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

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
   * Responsabilité : Orchestration de l'invalidation des tokens
   */
  async logout(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (refreshToken) {
        await this.tokenService.revokeRefreshToken(refreshToken);
      }

      // Révocation de tous les tokens si utilisateur authentifié
      if (req.user) {
        await this.tokenService.revokeAllUserTokens(req.user.userId);
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
   * Responsabilité : Orchestration de la rotation des tokens
   */
  async refreshToken(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return next(new AppError("Refresh token not provided", 401));
      }

      // Validation via le service de tokens
      const validationResult = await this.tokenService.validateRefreshToken(refreshToken);
      if (!validationResult) {
        return next(new AppError("Invalid or expired refresh token", 401));
      }

      const { decoded } = validationResult;

      // Génération de nouveaux tokens
      const { accessToken, refreshToken: newRefreshToken } = this.tokenService.generateTokens({
        userId: decoded.userId,
        role: decoded.role
      });

      // Remplacement de l'ancien refresh token
      await this.tokenService.revokeRefreshToken(refreshToken);
      await this.tokenService.saveRefreshToken(decoded.userId, newRefreshToken);

      // Configuration du nouveau cookie de refresh token
      res.cookie('refreshToken', newRefreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

      res.json({
        success: true,
        accessToken,
      });
    } catch (error) {
      next(new AppError(`Error refreshing token: ${error.message}`, 500));
    }
  }

  /**
   * Met à jour le hachage du mot de passe en arrière-plan
   * @param {number} userId - ID de l'utilisateur
   * @param {string} plainPassword - Mot de passe en clair
   * @private
   */
  async updatePasswordHashInBackground(userId, plainPassword) {
    try {
      const newHash = await this.hashingService.hash(plainPassword);
      await this.userRepository.update(userId, { password: newHash });
    } catch (error) {
      // Erreur silencieuse pour ne pas affecter l'expérience utilisateur
      logger.error(`Failed to update password hash for user ${userId}:`, error);
    }
  }
}

// Factory function pour créer une instance du contrôleur avec injection de dépendances
function createAuthController() {
  const hashingService = getService('hashingService');
  const userRepository = getService('userRepository');
  const tokenService = getService('tokenService');

  return new AuthController(hashingService, userRepository, tokenService);
}

// Instance globale pour compatibilité
const authControllerInstance = createAuthController();

// Exports des méthodes pour compatibilité avec les routes existantes
module.exports = {
  AuthController,
  createAuthController,
  register: authControllerInstance.register.bind(authControllerInstance),
  login: authControllerInstance.login.bind(authControllerInstance),
  logout: authControllerInstance.logout.bind(authControllerInstance),
  refreshToken: authControllerInstance.refreshToken.bind(authControllerInstance),
};