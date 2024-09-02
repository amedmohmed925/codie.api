const Business = require('../models/businessModel');

// Get all businesses
exports.getBusinesses = async (req, res) => {
    try {
        const businesses = await Business.find().populate('userId', 'name');
        if (!businesses) {
            return res.status(404).json({ message: 'No businesses found' });
        }
        res.status(200).json(businesses);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get a business by ID
exports.getBusinessById = async (req, res) => {
    const { businessId } = req.params;
    try {
        const business = await Business.findById(businessId).populate('userId', 'name');
        if (!business) {
            return res.status(404).json({ message: 'Business not found' });
        }
        res.status(200).json(business);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Create a new business
exports.createBusiness = async (req, res) => {
    const { title, description, URL } = req.body;
    const userId = req.user._id;

    try {
        const newBusiness = new Business({
            userId,
            title,
            description,
            URL
        });

        const savedBusiness = await newBusiness.save();
        res.status(201).json(savedBusiness);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a business by ID
exports.updateBusiness = async (req, res) => {
    const { businessId } = req.params;
    const { title, description, URL } = req.body;

    try {
        const updatedBusiness = await Business.findByIdAndUpdate(
            businessId,
            { title, description, URL },
            { new: true, runValidators: true }
        );

        if (!updatedBusiness) {
            return res.status(404).json({ message: 'Business not found' });
        }

        res.status(200).json(updatedBusiness);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a business by ID
exports.deleteBusiness = async (req, res) => {
    const { businessId } = req.params;

    try {
        const deletedBusiness = await Business.findByIdAndDelete(businessId);

        if (!deletedBusiness) {
            return res.status(404).json({ message: 'Business not found' });
        }

        res.status(200).json({ message: 'Business deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
