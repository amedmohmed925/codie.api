const express = require('express');
const router = express.Router();
const { createTag, updateTag, deleteTag, getTags, getTag } = require('../controllers/tagsController');
const isAuth = require('../middleware/isAuth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Tag:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           description: Tag title
 */

/**
 * @swagger
 * /api/tag/:
 *   post:
 *     summary: Create a new tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tag'
 *     responses:
 *       201:
 *         description: The tag was successfully created
 *       500:
 *         description: Server error
 */
router.post('/', isAuth, createTag);

/**
 * @swagger
 * /api/tag/{tagId}:
 *   put:
 *     summary: Update a tag by ID
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tagId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the tag to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tag'
 *     responses:
 *       200:
 *         description: The tag was successfully updated
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Server error
 */
router.put('/:tagId', isAuth, updateTag);

/**
 * @swagger
 * /api/tag/{tagId}:
 *   delete:
 *     summary: Delete a tag by ID
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tagId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the tag to delete
 *     responses:
 *       200:
 *         description: Tag deleted successfully
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Server error
 */
router.delete('/:tagId', isAuth, deleteTag);

/**
 * @swagger
 * /api/tag/:
 *   get:
 *     summary: Get all tags
 *     tags: [Tags]
 *     security: []
 *     responses:
 *       200:
 *         description: List of all tags
 *       500:
 *         description: Server error
 */
router.get('/', getTags);

/**
 * @swagger
 * /api/tag/{tagId}:
 *   get:
 *     summary: Get a tag by ID
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tagId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the tag to retrieve
 *     responses:
 *       200:
 *         description: The tag was successfully retrieved
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Server error
 */
router.get('/:tagId', isAuth, getTag);

module.exports = router;
