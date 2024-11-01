// Create a new tag
const createTag = async (req, res) => {
    const { title } = req.body;

    try {
        const newTag = new Tags({ title });
        await newTag.save();
        res.status(201).json({message:"create tag successfully"});
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
// Update a tag by ID
const updateTag = async (req, res) => {
    const { tagId } = req.params;
    const { title } = req.body;

    try {
        const updatedTag = await Tags.findByIdAndUpdate(
            tagId,
            { title },
            { new: true, runValidators: true }
        );

        if (!updatedTag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        res.status(200).json({message:"update tag successfully"});
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a tag by ID
const deleteTag = async (req, res) => {
    const { tagId } = req.params;

    try {
        const deletedTag = await Tags.findByIdAndDelete(tagId);

        if (!deletedTag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all tags
const getTags = async (req, res) => {
    try {
        const tags = await Tags.find();
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get a tag by ID
const getTag = async (req, res) => {
    const { tagId } = req.params;

    try {
        const tag = await Tags.findById(tagId);

        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        res.status(200).json(tag);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


module.exports = {
    createTag,
    updateTag,
    deleteTag,
    getTags,
    getTag
}