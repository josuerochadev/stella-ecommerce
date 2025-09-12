// server/src/services/tokenService.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { RefreshToken } = require('../models');

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '15m', // Short-lived access token
    });
    
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh', {
      expiresIn: '7d', // Long-lived refresh token
    });
    
    return { accessToken, refreshToken };
  }

  async saveRefreshToken(userId, refreshToken) {
    // First, revoke all existing tokens for this user
    await RefreshToken.update(
      { isRevoked: true },
      { where: { userId, isRevoked: false } }
    );

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
          expiresAt: { [require('sequelize').Op.gt]: new Date() }
        },
        include: [{ 
          model: require('../models').User, 
          as: 'user',
          attributes: ['id', 'role'] 
        }]
      });

      if (!tokenRecord) {
        return null;
      }

      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh');
      return { tokenRecord, decoded };
    } catch (error) {
      return null;
    }
  }

  async revokeRefreshToken(token) {
    await RefreshToken.update(
      { isRevoked: true },
      { where: { token } }
    );
  }

  async revokeAllUserTokens(userId) {
    await RefreshToken.update(
      { isRevoked: true },
      { where: { userId, isRevoked: false } }
    );
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  // Clean up expired tokens (should be run periodically)
  async cleanupExpiredTokens() {
    await RefreshToken.destroy({
      where: {
        expiresAt: { [require('sequelize').Op.lt]: new Date() }
      }
    });
  }
}

module.exports = new TokenService();