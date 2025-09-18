// src/controllers/userController.js

const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { AppError } = require("../middlewares/errorHandler");
const tokenService = require("../services/tokenService");

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next(new AppError("Email already in use", 400));
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword, // Save the hashed password
    });

    const { accessToken, refreshToken } = tokenService.generateTokens({ 
      userId: newUser.id, 
      role: newUser.role 
    });

    await tokenService.saveRefreshToken(newUser.id, refreshToken);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
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
};

/**
 * Log in a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(new AppError("Invalid email or password", 401));
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new AppError("Invalid email or password", 401));
    }

    const { accessToken, refreshToken } = tokenService.generateTokens({ 
      userId: user.id, 
      role: user.role 
    });

    await tokenService.saveRefreshToken(user.id, refreshToken);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
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
};

/**
 * Get user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getUserProfile = async (req, res, next) => {
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
};

/**
 * Update user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, email } = req.body;
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Update fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(new AppError(`Error updating user profile: ${error.message}`, 500));
  }
};

/**
 * Log out a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
      await tokenService.revokeRefreshToken(refreshToken);
    }
    
    // Also revoke all tokens for this user if authenticated
    if (req.user) {
      await tokenService.revokeAllUserTokens(req.user.userId);
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken');
    
    res.status(200).json({ 
      success: true, 
      message: "Logout successful" 
    });
  } catch (error) {
    next(new AppError(`Error during logout: ${error.message}`, 500));
  }
};

/**
 * Refresh access token using refresh token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.refreshToken = async (req, res, next) => {
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
    
    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = tokenService.generateTokens({
      userId: decoded.userId,
      role: decoded.role
    });

    // Save new refresh token and revoke the old one
    await tokenService.revokeRefreshToken(refreshToken);
    await tokenService.saveRefreshToken(decoded.userId, newRefreshToken);

    // Set new refresh token cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      accessToken,
    });
  } catch (error) {
    next(new AppError(`Error refreshing token: ${error.message}`, 500));
  }
};

/**
 * Delete user account
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Revoke all refresh tokens before deleting user
    await tokenService.revokeAllUserTokens(req.user.userId);

    await user.destroy(); // Delete the user

    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    res.status(200).json({ 
      success: true, 
      message: "Account deleted successfully" 
    });
  } catch (error) {
    next(new AppError(`Error deleting user: ${error.message}`, 500));
  }
};

module.exports = exports;
