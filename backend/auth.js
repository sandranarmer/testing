const jwt = require('jsonwebtoken');

const KEY = '123456'

// declarative
module.exports.generateToken = (payload) => {
    return jwt.sign(
        payload,
        KEY,
        { expiresIn: '1h' }
    );
}

// imperative
module.exports.auth = (requiredRole) => {
    return (req, res, next) => {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        try {
            const decoded = jwt.verify(token, KEY);
            req.user = decoded;

            if (requiredRole && decoded.role !== requiredRole) {
                return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
            }

            next();
        } catch (error) {
            res.status(403).json({ message: 'Invalid or expired token.' });
        }
    };
};

// declarative
module.exports.decryptToken = (token) => {
    return jwt.verify(token, key);
}