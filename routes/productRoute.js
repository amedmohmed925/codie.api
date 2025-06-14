const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const isAuth = require('../middleware/isAuth');
const { 
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsName,
    updateIsVerified,
    uploadMiddleware,
    filterProducts,
    getProductsByUser,
    getCountPayProduct,
    getUnverifiedProducts,
} = require('../controllers/productController');

// إعداد مكان حفظ الملفات
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// 🔹 السماح فقط بملفات الصور والملفات المضغوطة
const fileFilter = (req, file, cb) => {
    const allowedImageTypes = ['.png', '.jpg', '.jpeg', '.gif'];
    const allowedCompressedTypes = ['.zip', '.rar'];

    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedImageTypes.includes(ext) || allowedCompressedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (PNG, JPG, JPEG, GIF) or compressed files (ZIP, RAR) are allowed!'), false);
    }
};

const upload = multer({ storage, fileFilter });

/**
 * @swagger
 * /api/product/products/filter:
 *   get:
 *     summary: Advanced product filtering
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Comma-separated tag IDs
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: ['newest', 'oldest', 'price-asc', 'price-desc']
 *         description: Sorting option
 *     responses:
 *       200:
 *         description: Filtered and sorted products
 *       500:
 *         description: Server error
 */

router.get('/products/filter', filterProducts);  // New route for advanced filtering

// /**
//  * @swagger
//  * /api/products/unverified:
//  *   get:
//  *     summary: Get all unverified products
//  *     description: Retrieve a list of all products that are not verified (isVerified: false).
//  *     tags: [Product]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: A list of unverified products.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/Product'
//  *       404:
//  *         description: No unverified products found.
//  *       500:
//  *         description: Server error.
//  */
router.get('/products/unverified',  getUnverifiedProducts); 
/**
 * @swagger
 * /api/products/unverified:
 *   get:
 *     summary: Get all unverified products
 *     description: Retrieve a list of all products that are not verified (isVerified: false).
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of unverified products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: No unverified products found.
 *       500:
 *         description: Server error.
 */
router.get('/products/unverified',  getUnverifiedProducts); 
/**
 * @swagger
 * /api/product/products:
 *   get:
 *     tags: [Product]
 *     security: []
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: Successfully retrieved all products
 *       404:
 *         description: Products not found
 *       500:
 *         description: Server error
 */
router.get('/products', getProducts);

router.get('/saller/products', isAuth,getProductsByUser);

/**
 * @swagger
 * /api/product/productsName:
 *   get:
 *     tags: [Product]
 *     security: []
 *     summary: Get all products {id,name}
 *     responses:
 *       200:
 *         description: Successfully retrieved all products
 *       404:
 *         description: Products not found
 *       500:
 *         description: Server error
 */
router.get('/productsName', getProductsName);

/**
 * @swagger
 * /api/product/{productId}:
 *   get:
 *     tags: [Product]
 *     security: []
 *     summary: Get product by ID
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: ID of the product to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved product
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get('/:productId', getProductById);

/**
 * @swagger
 * /api/product:
 *   post:
 *     tags: [Product]
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - tags
 *               - productCreator
 *             properties:
 *               title:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               productCreator:
 *                 type: string
 *               privateURL:
 *                 type: string
 *               privateTemplate:
 *                 type: string
 *               price:
 *                 type: string
 *               uploadVideoUrl:
 *                 type: string
 *               uploadImgUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/', 
    // isAuth,
    // uploadMiddleware, // Multer middleware for file upload
    upload.fields([
        { name: 'uploadImg', maxCount: 1 },         // صورة المنتج
        { name: 'compressedFile', maxCount: 1 }     // الملف المضغوط
    ]),
    createProduct
);

/**
 * @swagger
 * /api/product/isVerify/{id}:
 *   get:
 *     tags: [Product]
 *     security: []
 *     summary: Get product by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the product to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully Verify product
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.post('/isVerify/:id', isAuth, updateIsVerified);

/**
 * @swagger
 * /api/product/{productId}:
 *   put:
 *     tags: [Product]
 *     summary: Update a product by ID
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: ID of the product to update
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
 *               categoryId:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               productCreator:
 *                 type: string
 *               privateURL:
 *                 type: string
 *               privateTemplate:
 *                 type: string
 *               price:
 *                 type: number
 *               uploadVideoUrl:
 *                 type: string
 *               uploadImgUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.put('/:productId', isAuth, updateProduct);

/**
 * @swagger
 * /api/product/{productId}:
 *   delete:
 *     tags: [Product]
 *     summary: Delete a product by ID
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: ID of the product to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.delete('/:productId', isAuth, deleteProduct);

router.get("product-pay/:productId",isAuth,getCountPayProduct)

// /**
//  * @swagger
//  * /api/product/search:
//  *   get:
//  *     summary: Search for products by title, tag, or productCreator
//  *     tags: [Product]
//  *     parameters:
//  *       - in: query
//  *         name: searchTerm
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The search term (can be part of a tag, title, or productCreator)
//  *     responses:
//  *       200:
//  *         description: List of matching products
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/Product'
//  *       404:
//  *         description: No matching products found
//  *       500:
//  *         description: Server error
//  */
// router.get('/search', searchProduct);
module.exports = router;
