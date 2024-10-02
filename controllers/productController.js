const Product = require('../models/ProductModel');

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('categoryId', 'title');
        if (!products) {
            return res.status(404).json({ message: 'No products found' });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all products
exports.getProductsName = async (req, res) => {
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
exports.getProductById = async (req, res) => {
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
exports.createProduct = async (req, res) => {
    const { 
        categoryId, 
        title, 
        Category_name, 
        description, 
        tags, 
        productCreator, 
        creatorJobTitle, 
        privateURL, 
        privateTemplate, 
        price, 
        uploadVidieUrl, 
        uploadImgUrl 
    } = req.body;

    try {
        const newProduct = new Product({
            categoryId,
            title,
            Category_name,
            description,
            tags,
            productCreator,
            creatorJobTitle,
            privateURL,
            privateTemplate,
            price,
            uploadVidieUrl,
            uploadImgUrl
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
    const { productId } = req.params;
    const {
        categoryId,
        title,
        Category_name,
        description,
        tags,
        productCreator,
        creatorJobTitle,
        privateURL,
        privateTemplate,
        price,
        uploadVidieUrl,
        uploadImgUrl
    } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                categoryId,
                title,
                Category_name,
                description,
                tags,
                productCreator,
                creatorJobTitle,
                privateURL,
                privateTemplate,
                price,
                uploadVidieUrl,
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
exports.deleteProduct = async (req, res) => {
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
