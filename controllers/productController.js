const Product = require('../models/ProductModel');
const User = require('../models/userModel');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
// Multer configuration for file upload
const upload = multer({ 
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    storage: multer.memoryStorage() 
  });
  
  // Cloudinary configuration
  cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });
  
  // Additional method for advanced product filtering
const filterProducts = async (req, res) => {
    const { 
        category, 
        minPrice, 
        maxPrice, 
        tags, 
        sortBy 
    } = req.query;

    try {
        let query = { isVerified: true };

        // Category filter
        if (category) query.categoryId = category;

        // Price range filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Tags filter
        if (tags) {
            query.tags = { $in: tags.split(',') };
        }

        // Sorting options
        const sortOptions = {
            'newest': { createdAt: -1 },
            'oldest': { createdAt: 1 },
            'price-asc': { price: 1 },
            'price-desc': { price: -1 }
        };

        const products = await Product.find(query)
            .populate('categoryId')
            .populate('tags')
            .sort(sortOptions[sortBy] || { createdAt: -1 });

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ 
            message: 'Filter error', 
            error: error.message 
        });
    }
};

// Get all products
const mongoose = require('mongoose');

const getProductsByUser = async (req, res) => {
    try {
        
        const userIdObject = new mongoose.Types.ObjectId(req.userId);

        // البحث عن المنتجات التي أنشأها المستخدم
        const products = await Product.find({
            isVerified: true,
            productCreator: userIdObject
        })
            .populate('categoryId')
            .populate('tags');

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for this user' });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({ isVerified: true })
            .populate('categoryId')
            .populate('tags');
            // .populate('tags');

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all products
const getProductsName = async (req, res) => {
    try {
        const products = await Product.find();
        if (!products) {
            return res.status(404).json({ message: 'No products found' });
        }
        const filterProducts = products.map(product => ({
            id: product._id,
            title: product.title
        }));
        res.status(200).json(filterProducts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get a product by ID
const getProductById = async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await Product.findById(productId).populate('categoryId', 'title');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Create a new product
const createProduct = async (req, res) => {
    const { 
        categoryId, 
        title, 
        description, 
        tags, 
        productCreator, 
        privateURL, 
        privateTemplate, 
        price, 
        uploadVideoUrl
    } = req.body;

    try {
        // Handle image upload to Cloudinary if exists
        let uploadImgUrl = '';
        if (req.file) {
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'products' }, 
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(req.file.buffer);
            });
            uploadImgUrl = uploadResult.secure_url;
        }

        const newProduct = new Product({
            categoryId,
            title,
            description,
            tags,
            productCreator,
            privateURL,
            privateTemplate,
            price: Number(price),
            uploadVideoUrl,
            uploadImgUrl,
            isVerified: false
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

const updateIsVerified = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const isVerified = true;

        const user = await User.findById(userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (typeof isVerified !== 'boolean') {
            return res.status(400).json({ message: 'isVerified must be a boolean value' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, { isVerified });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            message: 'isVerified updated successfully',
            product: updatedProduct,
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a product by ID
const updateProduct = async (req, res) => {
    const { productId } = req.params;
    const {
        categoryId,
        title,
        description,
        tags,
        productCreator,
        privateURL,
        privateTemplate,
        price,
        uploadVideoUrl,  // Updated field name
        uploadImgUrl
    } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                categoryId,
                title,
                description,
                tags,
                productCreator,
                privateURL,
                privateTemplate,
                price,  // Ensure this is passed as a number
                uploadVideoUrl,  // Updated field name
                uploadImgUrl
            },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const searchProduct = async (req, res) => {
    const { searchTerm } = req.query; 

    try {
        const regex = new RegExp(searchTerm, 'i'); // Case-insensitive search

        const products = await Product.find({
            $or: [
                { title: regex },
                { description: regex },
                { price: !isNaN(searchTerm) ? Number(searchTerm) : undefined }, // Allow searching by price
                { productCreator: regex }
            ]
        })
        .populate('tags')
        .populate('categoryId')
        .populate('productCreator');

        if (products.length === 0) {
            return res.status(200).json([]); // Return empty array instead of 404
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};



module.exports = {
    searchProduct,
    deleteProduct,
    updateProduct,
    uploadMiddleware: upload.single('image'),
    createProduct,
    getProductsByUser,
    getProductById,
    getProductsName,
    getProducts,
    updateIsVerified,
    filterProducts
}