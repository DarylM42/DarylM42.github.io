const jwt = require('jsonwebtoken');
const User = require('../models/user');

const getJwtSecret = () => process.env.JWT_SECRET;

/**
 * Authenticate a user and return a signed JWT for the admin API.
 */
module.exports.login = async function (req, res, next) {
    const { username, password } = req.body;

    try {
        const secret = getJwtSecret();

        if (!secret) {
            const error = new Error('JWT secret is not configured');
            error.status = 500;
            throw error;
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const valid = await user.validatePassword(password);
        if (!valid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            secret,
            { expiresIn: '1h' }
        );

        return res.status(200).json({ token });
    } catch (err) {
        return next(err);
    }
};