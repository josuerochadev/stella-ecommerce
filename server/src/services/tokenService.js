// server/src/services/tokenService.js
const jwt = require("jsonwebtoken");
const _crypto = require("node:crypto");
const { RefreshToken } = require("../models");
const logger = require("../utils/logger");

const REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ||
  (() => {
    logger.warn(
      "JWT_REFRESH_SECRET not set, falling back to derived secret. Set it in production!",
    );
    return `${process.env.JWT_SECRET}_refresh`;
  })();

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15m", // Short-lived access token
    });

    const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
      expiresIn: "7d", // Long-lived refresh token
    });

    return { accessToken, refreshToken };
  }

  async saveRefreshToken(userId, refreshToken) {
    // First, revoke all existing tokens for this user
    await RefreshToken.update({ isRevoked: true }, { where: { userId, isRevoked: false } });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    return await RefreshToken.create({
      token: refreshToken,
      userId,
      expiresAt,
    });
  }

  async validateRefreshToken(token) {
    try {
      const tokenRecord = await RefreshToken.findOne({
        where: {
          token,
          isRevoked: false,
          expiresAt: { [require("sequelize").Op.gt]: new Date() },
        },
        include: [
          {
            model: require("../models").User,
            as: "user",
            attributes: ["id", "role"],
          },
        ],
      });

      if (!tokenRecord) {
        return null;
      }

      const decoded = jwt.verify(token, REFRESH_SECRET);
      return { tokenRecord, decoded };
    } catch (_error) {
      return null;
    }
  }

  async revokeRefreshToken(token) {
    await RefreshToken.update({ isRevoked: true }, { where: { token } });
  }

  async revokeAllUserTokens(userId) {
    await RefreshToken.update({ isRevoked: true }, { where: { userId, isRevoked: false } });
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (_error) {
      return null;
    }
  }

  // Clean up expired tokens (should be run periodically)
  async cleanupExpiredTokens() {
    await RefreshToken.destroy({
      where: {
        expiresAt: { [require("sequelize").Op.lt]: new Date() },
      },
    });
  }
}

module.exports = new TokenService();
