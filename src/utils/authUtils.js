import jwt from 'jsonwebtoken';

export function generateAccessToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '10s' });
}

export function generateRefreshToken(user) {
  return jwt.sign({ id: user._id }, 'your_refresh_secret', { expiresIn: '7d' });
}
