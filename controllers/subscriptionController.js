const Subscription = require('../models/subscriptionModel');

// Get all subscriptions
exports.getSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find().populate('categoryId', 'title');
        if (!subscriptions) {
            return res.status(404).json({ message: 'No subscriptions found' });
        }
        res.status(200).json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get a subscription by ID
exports.getSubscriptionById = async (req, res) => {
    const { subscriptionId } = req.params;
    try {
        const subscription = await Subscription.findById(subscriptionId).populate('categoryId', 'title');
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.status(200).json(subscription);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Create a new subscription
exports.createSubscription = async (req, res) => {
    const { categoryId, title, categoryName, URL, amount, features } = req.body;

    try {
        const newSubscription = new Subscription({
            categoryId,
            title,
            categoryName,
            URL,
            amount,
            features
        });

        const savedSubscription = await newSubscription.save();
        res.status(201).json(savedSubscription);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a subscription by ID
exports.updateSubscription = async (req, res) => {
    const { subscriptionId } = req.params;
    const { title, categoryName, URL, amount, features } = req.body;

    try {
        const updatedSubscription = await Subscription.findByIdAndUpdate(
            subscriptionId,
            {
                title,
                categoryName,
                URL,
                amount,
                features
            },
            { new: true, runValidators: true }
        );

        if (!updatedSubscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        res.status(200).json(updatedSubscription);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a subscription by ID
exports.deleteSubscription = async (req, res) => {
    const { subscriptionId } = req.params;

    try {
        const deletedSubscription = await Subscription.findByIdAndDelete(subscriptionId);

        if (!deletedSubscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        res.status(200).json({ message: 'Subscription deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
