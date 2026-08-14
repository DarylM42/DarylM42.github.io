/**
 * Restrict route access to users with one of the required roles.
 */
module.exports = function requireRole(...allowedRoles) {
    return function roleGuard(req, res, next) {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'User role is required' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'You do not have permission to perform this action' });
        }

        return next();
    };
};