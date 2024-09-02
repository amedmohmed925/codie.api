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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 productId:
 *                   type: string
 *                 name:
 *                   type: string
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
 *                 example: "New Collection"
 *               userId:
 *                 type: string
 *                 example: "60d...abc"
 *               productId:
 *                 type: string
 *                 example: "60d...def"
 *     responses:
 *       201:
 *         description: Collection created successfully.
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
 *                 example: "Updated Collection"
 *     responses:
 *       200:
 *         description: Collection updated successfully.
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
 * /api/collection/allcollections:
 *   get:
 *     summary: Get all collection IDs
 *     tags: [Collection]
 *     description: Retrieve a list of all collection IDs.
 *     responses:
 *       200:
 *         description: A list of collection IDs.
 */
router.get('/allcollections', isAuth, getCollections);

module.exports = router;
