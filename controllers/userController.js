const User = require('../models/userModel');

/**
 * Get current user info
 */
const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};



module.exports = {
    getUser
};
