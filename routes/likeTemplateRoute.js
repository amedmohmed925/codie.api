const express = require('express');
const router = express.Router();
const likeTemplateController = require('../controllers/likeTemplateController');
const isAuth = require('../middleware/isAuth');

/**
 * @swagger
 * tags:
 *   name: LikeTemplate
 *   description: API endpoints for managing like templates
 */

/**
 * @swagger
 * /api/likeTemplate:
 *   post:
 *     summary: Create a new like template
 *     tags: [LikeTemplate]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user
 *               productId:
 *                 type: string
 *                 description: The ID of the product
 *     responses:
 *       201:
 *         description: Template created successfully
 *       500:
 *         description: Server error
 */
router.post('/', isAuth,likeTemplateController.createLikeTemplate);

/**
 * @swagger
 * /api/likeTemplate:
 *   get:
 *     summary: Get all like templates for a user
 *     tags: [LikeTemplate]
 *     responses:
 *       200:
 *         description: List of like templates
 *       500:
 *         description: Server error
 */
router.get('/', isAuth,likeTemplateController.getLikeTemplates);

/**
 * @swagger
 * /api/likeTemplate/{id}:
 *   delete:
 *     summary: Delete a like template by ID
 *     tags: [LikeTemplate]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the template
 *     responses:
 *       200:
 *         description: Template deleted successfully
 *       404:
 *         description: Template not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', isAuth,likeTemplateController.deleteLikeTemplate);

module.exports = router;
