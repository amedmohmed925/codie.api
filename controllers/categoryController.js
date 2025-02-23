const Category = require('../models/categoryModel');

// Get all categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate('userId', 'name'); // Populate user details if needed
        if (!categories) {
            return res.status(404).json({ message: 'No categories found' });
        }
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get a category by ID
exports.getCategoryById = async (req, res) => {
    const { categoryId } = req.params;
    try {
        const category = await Category.findById(categoryId).populate('userId', 'name');
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Create a new category
exports.createCategory = async (req, res) => {
    const { title, categoryNumber, note,priceRange } = req.body;
    const userId = req.userId; // Assuming the authenticated user's ID is stored in req.user

    try {
        const newCategory = new Category({
            userId,
            title,
            categoryNumber,
            note,
            priceRange
        });

        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a category by ID
exports.updateCategory = async (req, res) => {
    const { categoryId } = req.params;
    const { title, categoryNumber, note ,priceRange} = req.body;

    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { title, categoryNumber, note ,priceRange},
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a category by ID
exports.deleteCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
