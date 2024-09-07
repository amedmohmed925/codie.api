const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/isAuth');
const { 
    getUser, 
    editImgUser, 
    editInfoCompany, 
    deleteUser, 
    editSocialProfile, 
    editInfoUser, 
    editNameAndLocUser 
} = require('../controllers/userController');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });


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

/**
 * @swagger
 * /api/user/edit-profile-image:
 *   put:
 *     summary: Edit user profile image
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userImg:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: No image file provided
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

router.put('/edit-profile-image', upload.single('userImg'), isAuth, editImgUser);

/**
 * @swagger
 * /api/user/edit-info-company:
 *   put:
 *     summary: Edit company information for the user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               companyUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Company information updated
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put('/edit-info-company', isAuth, editInfoCompany);

/**
 * @swagger
 * /api/user/{userId}:
 *   delete:
 *     summary: Delete the authenticated user's account
 *     tags: [User]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the category to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete('/:userId', isAuth, deleteUser);

/**
 * @swagger
 * /api/user/edit-social-profile:
 *   put:
 *     summary: Edit the social profile links for the user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               linkedInUrl:
 *                 type: string
 *               twitterUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Social profile updated
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put('/edit-social-profile', isAuth, editSocialProfile);

/**
 * @swagger
 * /api/user/edit-info-user:
 *   put:
 *     summary: Edit the general user information
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User information updated
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put('/edit-info-user', isAuth, editInfoUser);

/**
 * @swagger
 * /api/user/edit-name-loc-User:
 *   put:
 *     summary: Edit the name and location for the user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Name and location updated
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put('/edit-name-loc-User', isAuth, editNameAndLocUser);

module.exports = router;
