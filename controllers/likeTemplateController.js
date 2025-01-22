const LikeTemplate = require('../models/likeTemplateModel');

// Create a new like template
const createLikeTemplate = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Create a new LikeTemplate instance
    const newLikeTemplate = new LikeTemplate({ userId, productId });

    // Save the instance to the database
    const savedLikeTemplate = await newLikeTemplate.save();

    res.status(201).json(savedLikeTemplate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all like templates for a user
const getLikeTemplates = async (req, res) => {
  try {
    const userId = req.userId;

    // Find all LikeTemplates for a specific user
    const templates = await LikeTemplate.find({ userId });

    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a like template by ID
const deleteLikeTemplate = async (req, res) => {
  try {
    const templateId = req.params.id;

    // Find and delete the LikeTemplate by ID
    const deletedTemplate = await LikeTemplate.findByIdAndDelete(templateId);

    if (!deletedTemplate) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.status(200).json({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createLikeTemplate,
  getLikeTemplates,
  deleteLikeTemplate
};
