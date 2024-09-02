const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/isAuth');
const { 
    getBusinesses,
    getBusinessById,
    createBusiness,
    updateBusiness,
    deleteBusiness
} = require('../controllers/businessController');

/**
 * @swagger
 * /api/businesses:
 *   get:
 *     tags: [Business]
 *     summary: Get all businesses
 *     responses:
 *       200:
 *         description: Successfully retrieved all businesses
 *       404:
 *         description: Businesses not found
 *       500:
 *         description: Server error
 */
router.get('/', isAuth, getBusinesses);

/**
 * @swagger
 * /api/business/{businessId}:
 *   get:
 *     tags: [Business]
 *     summary: Get business by ID
 *     parameters:
 *       - name: businessId
 *         in: path
 *         required: true
 *         description: ID of the business to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved business
 *       404:
 *         description: Business not found
 *       500:
 *         description: Server error
 */
router.get('/:businessId', isAuth, getBusinessById);

/**
 * @swagger
 * /api/business:
 *   post:
 *     tags: [Business]
 *     summary: Create a new business
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - URL
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               URL:
 *                 type: string
 *     responses:
 *       201:
 *         description: Business created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/', isAuth, createBusiness);

/**
 * @swagger
 * /api/business/{businessId}:
 *   put:
 *     tags: [Business]
 *     summary: Update a business by ID
 *     parameters:
 *       - name: businessId
 *         in: path
 *         required: true
 *         description: ID of the business to update
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
 *               description:
 *                 type: string
 *               URL:
 *                 type: string
 *     responses:
 *       200:
 *         description: Business updated successfully
 *       404:
 *         description: Business not found
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.put('/:businessId', isAuth, updateBusiness);

/**
 * @swagger
 * /api/business/{businessId}:
 *   delete:
 *     tags: [Business]
 *     summary: Delete a business by ID
 *     parameters:
 *       - name: businessId
 *         in: path
 *         required: true
 *         description: ID of the business to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Business deleted successfully
 *       404:
 *         description: Business not found
 *       500:
 *         description: Server error
 */
router.delete('/:businessId', isAuth, deleteBusiness);

module.exports = router;
