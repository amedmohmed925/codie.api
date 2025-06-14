const Product = require('../models/ProductModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Developer = require('../models/developerModel')
const Tags = require('../models/tagsModel')
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const eventService = require('../services/eventService');
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
// const filterProducts = async (req, res) => {
//     const { 
//         category, 
//         minPrice, 
//         maxPrice, 
//         tags, 
//         sortBy 
//     } = req.query;

//     try {
//         let query = { isVerified: true };

//         // Category filter
//         if (category) query.categoryId = category;

//         // Price range filter
//         if (minPrice || maxPrice) {
//             query.price = {};
//             if (minPrice) query.price.$gte = Number(minPrice);
//             if (maxPrice) query.price.$lte = Number(maxPrice);
//         }

//         // Tags filter
//         if (tags) {
//             query.tags = { $in: tags.split(',') };
//         }

//         // Sorting options
//         const sortOptions = {
//             'newest': { createdAt: -1 },
//             'oldest': { createdAt: 1 },
//             'price-asc': { price: 1 },
//             'price-desc': { price: -1 }
//         };

//         const products = await Product.find(query)
//             .populate('categoryId')
//             .populate('tags')
//             .sort(sortOptions[sortBy] || { createdAt: -1 });

//         res.status(200).json(products);
//     } catch (error) {
//         res.status(500).json({ 
//             message: 'Filter error', 
//             error: error.message 
//         });
//     }
// };



// Get all products
const mongoose = require('mongoose');

const filterProducts = async (req, res) => {
    const { category, minPrice, maxPrice, tags, sortBy, searchTerm } = req.query;

    try {
        let query = { isVerified: true };

        if (category) query.categoryId = category;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (tags) query.tags = { $in: tags.split(',') };

        // **Search Functionality**
        if (searchTerm) {
            const regex = new RegExp(searchTerm, 'i');
            const matchingTags = await Tags.find({ title: regex }).select('_id');
            const matchingUsers = await User.find({ name: regex }).select('_id');
            const matchingDevelopers = await Developer.find({
                $or: [{ firstName: regex }, { lastName: regex }]
            }).select('_id');

            query.$or = [
                { title: regex },
                { description: regex },
                { productCreator: { $in: [...matchingUsers.map(user => user._id), ...matchingDevelopers.map(dev => dev._id)] } },
                { tags: { $in: matchingTags.map(tag => tag._id) } }
            ];
        }

        const sortOptions = {
            'newest': { createdAt: -1 },
            'oldest': { createdAt: 1 },
            'price-asc': { price: 1 },
            'price-desc': { price: -1 }
        };

        const products = await Product.find(query)
            .populate('categoryId', 'title')
            .populate('tags', 'title')
            .sort(sortOptions[sortBy] || { createdAt: -1 });

        // **Manually Populate productCreator**
        const updatedProducts = await Promise.all(products.map(async (product) => {
            let creator = null;

            if (mongoose.Types.ObjectId.isValid(product.productCreator)) {
                creator = await User.findById(product.productCreator).select('name email userName jobTitle');
                if (!creator) {
                    creator = await Developer.findById(product.productCreator).select('firstName lastName jobTitle');
                }
            }

            return {
                ...product.toObject(),
                productCreator: creator || null
            };
        }));

        res.status(200).json(updatedProducts);
    } catch (error) {
        console.error("❌ Filter Products Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

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
            .populate('categoryId', 'title') // Populate category
            .populate('tags', 'title'); // Populate tags

        // **Manually Populate productCreator**
        const updatedProducts = await Promise.all(products.map(async (product) => {
            let creator = null;

            if (mongoose.Types.ObjectId.isValid(product.productCreator)) {
                creator = await User.findById(product.productCreator).select('name email userName jobTitle');
                if (!creator) {
                    creator = await Developer.findById(product.productCreator).select('firstName lastName jobTitle');
                }
            }

            return {
                ...product.toObject(),
                productCreator: creator || null // Ensures productCreator is never empty
            };
        }));

        if (updatedProducts.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }

        res.status(200).json(updatedProducts);
    } catch (error) {
        console.error("❌ Get Products Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const getUnverifiedProducts = async (req, res) => {
    try {

        const products = await Product.find({ isVerified: false })
            .populate('categoryId', 'title') 
            .populate('tags', 'title'); 


            const updatedProducts = await Promise.all(products.map(async (product) => {
            let creator = null;

            if (mongoose.Types.ObjectId.isValid(product.productCreator)) {
                creator = await User.findById(product.productCreator).select('name email userName jobTitle');
                if (!creator) {
                    creator = await Developer.findById(product.productCreator).select('firstName lastName jobTitle');
                }
            }

            return {
                ...product.toObject(),
                productCreator: creator || null
            };
        }));

        if (updatedProducts.length === 0) {
            return res.status(404).json({ message: 'No unverified products found' });
        }

        res.status(200).json(updatedProducts);
    } catch (error) {
        console.error("❌ Get Unverified Products Error:", error);
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
        commercialPrice, 
        regularPrice, 
        uploadVideoUrl, 
        livePreviewUrl, 
        allowEditing 
    } = req.body;

    try {
        let uploadImgUrl = '';
        let compressedFileUrl = '';
        // ✅ رفع صورة المنتج إلى Cloudinary إذا كانت موجودة
        if (req.files && req.files.uploadImg) {
            // const uploadResult = await new Promise((resolve, reject) => {
            //     const uploadStream = cloudinary.uploader.upload_stream(
            //         { folder: 'products' }, 
            //         (error, result) => {
            //             if (error) reject(error);
            //             else resolve(result);
            //         }
            //     );
            //     uploadStream.end(req.files.uploadImg[0].buffer);
            // });
            // console.log(uploadResult.secure_url);
            uploadImgUrl = `/uploads/${req.files.uploadImg[0].filename}`; // حفظ مسار الملف المضغوط
        }

        // ✅ رفع الملف المضغوط إذا كان موجودًا
        if (req.files && req.files.compressedFile) {
            compressedFileUrl = `/uploads/${req.files.compressedFile[0].filename}`; // حفظ مسار الملف المضغوط
        }

        // ✅ إنشاء المنتج الجديد
        const newProduct = new Product({
            categoryId,
            title,
            description,
            tags,
            productCreator,
            privateURL,
            privateTemplate,
            commercialPrice: Number(commercialPrice),
            regularPrice: Number(regularPrice),
            uploadVideoUrl,
            uploadImgUrl,
            compressedFileUrl,
            livePreviewUrl,
            allowEditing: allowEditing === 'true', // تحويل `string` إلى `Boolean`
            isVerified: false
        });
        console.log(newProduct);
        
        const savedProduct = await newProduct.save();
        // Trigger project_added event for notifications
        eventService.triggerProjectAdded({
            projectId: savedProduct._id,
            userIds: [], // Optionally, pass specific userIds or leave empty for all
            title: 'New Project Added',
            description: `A new project "${savedProduct.title}" has been added!`,
            link: `/project/${savedProduct._id}`
        });
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

const getCountPayProduct =async (req,res)=>{
    try {
        const { productId } = req.params; // استلام productId من الـ URL

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const result = await Order.aggregate([
            { $match: { orderStatus: "completed" } }, // تصفية الطلبات المكتملة فقط
            { $unwind: "$cartItems" }, // تفكيك مصفوفة cartItems
            { $match: { "cartItems.productId": productId } }, // تصفية المنتج المطلوب
            { $group: { _id: "$cartItems.productId", count: { $sum: 1 } } } // حساب عدد مرات ظهور المنتج
        ]);

        const count = result.length > 0 ? result[0].count : 0;
        return res.status(200).json({ productId, salesCount: count });

    } catch (error) {
        console.error("Error fetching product sales count:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const updateIsVerified = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const isVerified = true;
        console.log("User ID:", userId);
        const user = await User.findById(userId);
        console.log("User Role:", user?.role); // طباعة دور المستخدم

        if (!user || user.role !== 'Admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (typeof isVerified !== 'boolean') {
            return res.status(400).json({ message: 'isVerified must be a boolean value' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, { isVerified });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Trigger status_changed event for notifications
        eventService.triggerStatusChanged({
            projectId: updatedProduct._id,
            sellerId: updatedProduct.productCreator,
            status: 'APPROVED',
            title: 'Project Approved',
            description: `Your project "${updatedProduct.title}" was approved!`,
            link: `/project/${updatedProduct._id}`
        });
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


// const searchProduct = async (req, res) => {
//     const { searchTerm } = req.query;

//     try {
//         if (!searchTerm) {
//             return res.status(400).json({ message: "Search term is required" });
//         }

//         console.log("Received Search Query:", searchTerm); // Debugging
//         const regex = new RegExp(searchTerm, 'i'); // Case-insensitive search

//         // Step 1: Find matching user IDs (for productCreator field)
//         let matchingUserIds = [];
//         try {
//             const matchingUsers = await User.find({ name: regex }).select('_id');
//             matchingUserIds = matchingUsers.map(user => user._id);
//         } catch (userError) {
//             console.error("Error Fetching Users:", userError);
//         }

//         // Step 2: Find matching tag IDs (for tags field)
//         let matchingTagIds = [];
//         try {
//             const matchingTags = await Tags.find({ title: regex }).select('_id');
//             matchingTagIds = matchingTags.map(tag => tag._id);
//         } catch (tagError) {
//             console.error("Error Fetching Tags:", tagError);
//         }

//         // Step 3: Build search conditions while ensuring ObjectId fields are only queried with valid ObjectIds
//         let queryConditions = [];

//         if (searchTerm) {
//             queryConditions.push({ title: regex });
//             queryConditions.push({ description: regex });
//         }

//         if (matchingUserIds.length > 0) {
//             queryConditions.push({ productCreator: { $in: matchingUserIds } });
//         }

//         if (matchingTagIds.length > 0) {
//             queryConditions.push({ tags: { $in: matchingTagIds } });
//         }

//         console.log("Final Query Conditions:", JSON.stringify(queryConditions, null, 2));

//         // Step 4: Execute Search Query Safely
//         const products = await Product.find(queryConditions.length > 0 ? { $or: queryConditions } : {})
//             .populate('tags', 'title')
//             .populate('categoryId', 'title')
//             .populate('productCreator', 'name email');

//         console.log("Products Found:", products.length);
//         res.status(200).json(products);
//     } catch (error) {
//         console.error("Search API Error:", error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };




module.exports = {
    // searchProduct,
    deleteProduct,
    updateProduct,
    uploadMiddleware: upload.single('image'),
    createProduct,
    getProductsByUser,
    getProductById,
    getProductsName,
    getProducts,
    updateIsVerified,
    filterProducts,
    getCountPayProduct,
    getUnverifiedProducts
}