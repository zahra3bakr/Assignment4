const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
};

module.exports = {
    generateToken,
    verifyToken
};
