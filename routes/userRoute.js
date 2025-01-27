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
    editNameAndLocUser, 
    editUserPlan,
    getTempleteByDev,
    getDevelopers,
    updateUserRoleToSeller
} = require('../controllers/userController');
const multer = require('multer');
const { registerDev } = require('../controllers/authController');
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
 * /api/user/:id:
 *   get:
 *     summary: Get a user's details by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to fetch
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userImg:
 *                   type: string
 *                   description: The URL of the user's profile image.
 *                 userName:
 *                   type: string
 *                   description: The name of the user.
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getUserById);


/**
 * @swagger
 * /api/user/role-to-seller:
 *   patch:
 *     summary: change user role to seller
 *     tags: [User]
 *     responses:
 *       200:
 *         description: change user role to seller
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.patch('/role-to-seller', isAuth,updateUserRoleToSeller);
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
 *               jobTitle:
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

/**
 * @swagger
 * /api/user/plan:
 *   put:
 *     summary: Edit user plan
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plan:
 *                 type: string
 *                 description: The new plan for the user
 *     responses:
 *       200:
 *         description: User plan updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put('/plan',isAuth, editUserPlan);

/**
 * @swagger
 * /api/user/templetes:
 *   get:
 *     summary: Get templates by developer ID
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               developerId:
 *                 type: string
 *                 description: ID of the developer
 *     responses:
 *       200:
 *         description: List of templates by developer
 *       404:
 *         description: Templates not found
 *       500:
 *         description: Server error
 */
router.get('/templetes',isAuth, getTempleteByDev);

/**
 * @swagger
 * /api/user/developers:
 *   get:
 *     summary: Get all developers
 *     tags: [User]
 *     security: []
 *     responses:
 *       200:
 *         description: List of all developers
 *       404:
 *         description: Developers not found
 *       500:
 *         description: Server error
 */
router.get('/developers', getDevelopers);

/**
 * @swagger
 * /api/user/create-dev:
 *   post:
 *     summary: Register a new developer
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: First name of the developer
 *                 example: John
 *               lastName:
 *                 type: string
 *                 description: Last name of the developer
 *                 example: Doe
 *               jobTitle:
 *                 type: string
 *                 description: The job title of the developer
 *                 example: Full-Stack Developer
 *     responses:
 *       201:
 *         description: Developer registered successfully
 *       400:
 *         description: Developer already exists
 *       500:
 *         description: Server error
 */
router.post('/create-dev',isAuth, registerDev);

module.exports = router;
