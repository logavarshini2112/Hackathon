import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Generate JWT Authentication Token
 * @param {number|string} userId - User's database primary key ID
 * @param {string} role - User role (e.g., 'Visitor', 'Staff', 'Administrator')
 * @returns {string} JWT Token
 */
export default function generateToken(userId, role) {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'fallback_secret_key',
    { expiresIn: '7d' }
  );
}
