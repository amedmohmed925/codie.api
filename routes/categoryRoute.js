const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/isAuth');
const { 
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags: [Category]
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: Successfully retrieved all categories
 *       404:
 *         description: Categories not found
 *       500:
 *         description: Server error
 */
router.get('/', isAuth, getCategories);

/**
 * @swagger
 * /api/category/{categoryId}:
 *   get:
 *     tags: [Category]
 *     summary: Get category by ID
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         required: true
 *         description: ID of the category to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved category
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.get('/:categoryId', isAuth, getCategoryById);

/**
 * @swagger
 * /api/category:
 *   post:
 *     tags: [Category]
 *     summary: Create a new category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - categoryNumber
 *               - note
 *             properties:
 *               title:
 *                 type: string
 *               categoryNumber:
 *                 type: string
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/', isAuth, createCategory);

/**
 * @swagger
 * /api/category/{categoryId}:
 *   put:
 *     tags: [Category]
 *     summary: Update a category by ID
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         required: true
 *         description: ID of the category to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               categoryNumber:
 *                 type: string
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.put('/:categoryId', isAuth, updateCategory);

/**
 * @swagger
 * /api/category/{categoryId}:
 *   delete:
 *     tags: [Category]
 *     summary: Delete a category by ID
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         required: true
 *         description: ID of the category to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.delete('/:categoryId', isAuth, deleteCategory);

module.exports = router;
