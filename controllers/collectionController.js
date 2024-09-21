// Assuming you have a Collection model

const Collection = require('../models/collectionModel');

const getCollection = async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.collectionId)
            .populate('userId')
            .populate('productIds'); // تعديل هنا
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }
        res.status(200).json(collection);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
const addCollection = async (req, res) => {
    const { userId, productIds, name } = req.body;
    try {
        const newCollection = new Collection({ userId, productIds, name });
        const savedCollection = await newCollection.save();
        res.status(201).json(savedCollection);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

const updateCollection = async (req, res) => {
    const { name, productIds } = req.body;
    try {
        const updatedCollection = await Collection.findByIdAndUpdate(
            req.params.collectionId,
            { name, productIds },
            { new: true }
        ).populate('userId').populate('productIds');
        if (!updatedCollection) {
            return res.status(404).json({ message: 'Collection not found' });
        }
        res.status(200).json(updatedCollection);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
const deleteCollection = async (req, res) => {
  try {
      const deletedCollection = await Collection.findByIdAndDelete(req.params.collectionId);
      if (!deletedCollection) {
          return res.status(404).json({ message: 'Collection not found' });
      }
      res.status(200).json({ message: 'Collection deleted successfully' });
  } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getCollections = async (req, res) => {
  try {
      const collections = await Collection.find({userId:req.params.userId})
          .populate('userId')
          .populate('productId');
      res.status(200).json(collections);
  } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
  }
};
module.exports = {
    getCollections,
    deleteCollection,
    updateCollection,
    addCollection,
    getCollection,
};
