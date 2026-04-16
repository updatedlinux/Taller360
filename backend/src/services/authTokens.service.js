const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

/**
 * @param {{ sub: string }} payload
 */
function signAccessToken(payload) {
  if (!env.jwtSecret || env.jwtSecret.length < 16) {
    throw new Error('JWT_SECRET no configurado');
  }
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

/**
 * @param {string} token
 */
function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

module.exports = { signAccessToken, verifyAccessToken };
