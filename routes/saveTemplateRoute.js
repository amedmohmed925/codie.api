const express = require('express');
const router = express.Router();
const saveTemplateController = require('../controllers/saveTemplateController');
const isAuth = require('../middleware/isAuth');

/**
 * @swagger
 * tags:
 *   name: SaveTemplate
 *   description: API endpoints for managing save templates
 */

/**
 * @swagger
 * /api/saveTemplate:
 *   post:
 *     summary: Create a new save template
 *     tags: [SaveTemplate]
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
router.post('/',isAuth, saveTemplateController.createSaveTemplate);

/**
 * @swagger
 * /api/saveTemplate/{userId}:
 *   get:
 *     summary: Get all save templates for a user
 *     tags: [SaveTemplate]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the user
 *     responses:
 *       200:
 *         description: List of save templates
 *       500:
 *         description: Server error
 */
router.get('/:userId',isAuth, saveTemplateController.getSaveTemplates);

/**
 * @swagger
 * /api/saveTemplate/{id}:
 *   delete:
 *     summary: Delete a save template by ID
 *     tags: [SaveTemplate]
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
router.delete('/:id',isAuth, saveTemplateController.deleteSaveTemplate);

module.exports = router;
