import jwt from 'jsonwebtoken';

export function generateAccessToken(user) {
    return jwt.sign({ id: user._id, username: user.username}, 'kitri_secret', { expiresIn : '15s'})
}

export function generateRefreshToken(user) {
    return jwt.sign({ id: user._id, username : user.username}, 'kitri_secret2', { expiresIn : '1h'})
}