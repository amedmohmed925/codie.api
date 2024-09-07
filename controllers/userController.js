 const {ref, uploadBytes, getDownloadURL} = require('firebase/storage');
 const {storage} = require('../utils/firebaseConfig');
 const User = require('../models/userModel');

// Get user details
const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

// Edit company info
const editInfoCompany = async (req, res, next) => {
    try {
        const { companyName,companyUrl} = req.body;
        const user = await User.findByIdAndUpdate(
            req.userId, 
            { companyName,companyUrl }, 
            { new: true, runValidators: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

// Delete user
const deleteUser = async (req, res, next) => {
    try {
        const {userId}=req.params;
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Edit social profile
const editSocialProfile = async (req, res, next) => {
    try {
        const { linkedInUrl,twitterUrl } = req.body;
        const user = await User.findByIdAndUpdate(
            req.userId, 
            { linkedInUrl,twitterUrl }, 
            { new: true, runValidators: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

// Edit user information
const editInfoUser = async (req, res, next) => {
    try {
        const { userName,email } = req.body;
        const user = await User.findByIdAndUpdate(
            req.userId, 
            {userName,email }, 
            { new: true, runValidators: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

// Edit name and location
const editNameAndLocUser = async (req, res, next) => {
    try {
        const { name, address } = req.body;
        const user = await User.findByIdAndUpdate(
            req.userId, 
            { name, address }, 
            { new: true, runValidators: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

const editImgUser = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a storage reference for the image
        const fileName = `profileImages/${user._id}-${Date.now()}`;
        const fileRef = ref(storage, fileName);

        // Upload image to Firebase Storage
        const snapshot = await uploadBytes(fileRef, req.file.buffer);
        
        // Get the image's download URL
        const imageUrl = await getDownloadURL(snapshot.ref);

        // Update user with the new image URL in MongoDB
        user.userImg = imageUrl;
        await user.save();

        res.status(200).json({ message: 'Profile image updated', imageUrl });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUser,
    deleteUser,
    editInfoCompany,
    editSocialProfile,
    editInfoUser,
    editNameAndLocUser,
    editImgUser
};
