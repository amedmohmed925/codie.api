const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/isAuth');
const {
    getCollection,
    addCollection,
    updateCollection,
    deleteCollection,
    getCollections
} = require('../controllers/collectionController');

/**
 * @swagger
 * /api/collection/{collectionId}:
 *   get:
 *     summary: Get a collection by ID
 *     tags: [Collection]
 *     description: Retrieve a collection by its ID.
 *     parameters:
 *       - in: path
 *         name: collectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the collection to retrieve.
 *     responses:
 *       200:
 *         description: The requested collection.
 */
router.get('/:collectionId', isAuth, getCollection);

/**
 * @swagger
 * /api/collection/add-collection:
 *   post:
 *     summary: Add a new collection
 *     tags: [Collection]
 *     description: Create a new collection in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the new collection.
 *                 example: "New Collection"
 *               userId:
 *                 type: string
 *                 description: The ID of the user who owns the collection.
 *                 example: "60d...abc"
 *               productId:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Array of product IDs to associate with the collection.
 *                 example: ["60d...123", "60d...456"]
 *     responses:
 *       201:
 *         description: Collection created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the created collection.
 *                 name:
 *                   type: string
 *                   description: The name of the created collection.
 *                 userId:
 *                   type: string
 *                   description: The ID of the user who created the collection.
 *                 productId:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Array of product IDs associated with the collection.
 *       400:
 *         description: Bad request. Invalid input data.
 *       500:
 *         description: Internal server error.
 */
router.post('/add-collection', isAuth, addCollection);

/**
 * @swagger
 * /api/collection/{collectionId}:
 *   put:
 *     summary: Update a collection
 *     tags: [Collection]
 *     description: Update the details of a collection by its ID.
 *     parameters:
 *       - in: path
 *         name: collectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the collection to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the collection.
 *                 example: "Updated Collection"
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of product IDs to associate with the collection.
 *                 example: ["60d...abc", "60d...def"]
 *     responses:
 *       200:
 *         description: Collection updated successfully.
 *       400:
 *         description: Bad request. Missing required fields.
 *       404:
 *         description: Collection not found.
 *       500:
 *         description: Internal server error.
 */

router.put('/:collectionId', isAuth, updateCollection);

/**
 * @swagger
 * /api/collection/{collectionId}:
 *   delete:
 *     summary: Delete a collection
 *     tags: [Collection]
 *     description: Remove a collection by its ID.
 *     parameters:
 *       - in: path
 *         name: collectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the collection to delete.
 *     responses:
 *       200:
 *         description: Collection deleted successfully.
 */
router.delete('/:collectionId', isAuth, deleteCollection);

/**
 * @swagger
 * /api/collection/allcollections/{userId}:
 *   get:
 *     summary: Get all collection IDs
 *     tags: [Collection]
 *     description: Retrieve a list of all collection IDs.
 *     responses:
 *       200:
 *         description: A list of collection IDs.
 */
router.get('/allcollections/:userId', isAuth, getCollections);

module.exports = router;
