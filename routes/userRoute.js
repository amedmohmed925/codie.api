const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/isAuth');
const { getUser} = require('../controllers/userController');

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get the authenticated user's details
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/', isAuth, getUser);

module.exports = router;
