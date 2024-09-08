const SaveTemplate = require('../models/saveTemplateModel');

// Create a new save template
const createSaveTemplate = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Create a new SaveTemplate instance
    const newSaveTemplate = new SaveTemplate({ userId, productId });

    // Save the instance to the database
    const savedTemplate = await newSaveTemplate.save();

    res.status(201).json(savedTemplate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all save templates for a user
const getSaveTemplates = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find all SaveTemplates for a specific user
    const templates = await SaveTemplate.find({ userId });

    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a save template by ID
const deleteSaveTemplate = async (req, res) => {
  try {
    const templateId = req.params.id;

    // Find and delete the SaveTemplate by ID
    const deletedTemplate = await SaveTemplate.findByIdAndDelete(templateId);

    if (!deletedTemplate) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.status(200).json({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSaveTemplate,
  getSaveTemplates,
  deleteSaveTemplate
};
