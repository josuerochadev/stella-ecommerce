// src/controllers/userController.js

const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { AppError } = require("../middlewares/errorHandler");

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

    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser.id,
      token,
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

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      token,
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
exports.logout = (_req, res, _next) => {
  res.status(200).json({ message: "Logout successful" });
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

    await user.destroy(); // Delete the user

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    next(new AppError(`Error deleting user: ${error.message}`, 500));
  }
};

module.exports = exports;
