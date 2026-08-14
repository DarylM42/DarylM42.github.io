const jwt = require('jsonwebtoken');

/**
 * Validate a Bearer token and attach the decoded user payload to the request.
 */
module.exports = function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        return res.status(500).json({ message: 'JWT secret is not configured' });
    }

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is required' });
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Authorization header must use the Bearer scheme' });
    }

    if (!/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(token)) {
        return res.status(401).json({ message: 'Token format is invalid' });
    }

    try {
        req.user = jwt.verify(token, secret);
        return next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }

        return res.status(401).json({ message: 'Token is invalid' });
    }
};