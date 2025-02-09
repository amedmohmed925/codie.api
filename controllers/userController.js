const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { storage } = require('../utils/firebaseConfig');
const User = require('../models/userModel');
const Developer = require('../models/developerModel');

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

const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId); // ✅ Get user by userId from URL
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
        const { companyName, companyUrl } = req.body;
        const user = await User.findByIdAndUpdate(
            req.userId,
            { companyName, companyUrl },
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
        const { userId } = req.params;
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
        const { linkedInUrl, twitterUrl } = req.body;
        const user = await User.findByIdAndUpdate(
            req.userId,
            { linkedInUrl, twitterUrl },
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
        const { userName, email, jobTitle } = req.body;
        const user = await User.findByIdAndUpdate(
            req.userId,
            { userName, email, jobTitle },
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
// edit user plan
const editUserPlan = async (req, res, next) => {
    try {
        const userId = req.userId;
        const { plan } = req.body;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the plan
        user.plan = plan;
        await user.save();

        // Respond with success
        res.status(200).json({ message: 'User plan updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
// get templete by developerId
const getTempleteByDev = async (req, res, next) => {
    try {
        const { developerId } = req.body;
        const templetes = await User.find({ productCreator: developerId });
        if (!templetes) {
            return res.status(404).json({ message: 'templetes not found' });
        }
        res.status(200).json(templetes);

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

// get developers
const getDevelopers = async (req, res, next) => {
    try {
        // استعلام لجلب جميع المطورين
        const developers = await Developer.find();

        // استعلام لجلب جميع المستخدمين مع الحقول المحددة فقط
        const users = await User.find().select("_id name jobTitle");

        // التحقق من وجود بيانات المطورين
        if (!developers || developers.length === 0) {
            return res.status(404).json({ message: 'No developers found' });
        }

        // التحقق من وجود بيانات المستخدمين
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        // فصل بيانات المطورين عن المستخدمين
        const developersArray = developers.map(developer => {
            return {
                ...developer.toObject() // تحويل الـ Developer إلى كائن عادي
            };
        });

        const usersArray = users.map(user => {
            return {
                _id: user._id,
                name: user.name,
                jobTitle: user.jobTitle
            };
        });

        // إرسال البيانات كاستجابة
        res.status(200).json({
            developers: developersArray,
            users: usersArray
        });
    } catch (error) {
        // تمرير الخطأ إلى الـ Middleware الخاص بالأخطاء
        next(error);
    }
};

// Function to change user role to seller
const updateUserRoleToSeller = async (req, res) => {
    try {
        const userId = req.userId; // استخدم المعرف الخاص بالمستخدم من الطلب
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the role to 'Seller'
        user.role = 'Seller';
        await user.save();

        return res.status(200).json({
            message: 'Role updated successfully to Seller'
        });
    } catch (error) {
        console.error('Error updating user role:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const editAddress = async (req, res) => {
    try {
        const {
            apartment,
            floor,
            street,
            building,
            postalCode,
            city,
            country,
            state,
        } = req.body;

        const userId = req.userId; // نفترض أن userId موجود في الـ req (مثلاً من الـ Middleware للمصادقة)

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        // تحديث العنوان
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    "address.apartment": apartment || " ",
                    "address.floor": floor || " ",
                    "address.street": street,
                    "address.building": building || " ",
                    "address.postalCode": postalCode || " ",
                    "address.city": city,
                    "address.country": country,
                    "address.state": state || " ",
                }
            },
            { new: true } // لإرجاع البيانات المحدثة
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Address updated successfully"
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


module.exports = {
    editAddress,
    getUser,
    deleteUser,
    editInfoCompany,
    updateUserRoleToSeller,
    editSocialProfile,
    editInfoUser,
    editNameAndLocUser,
    editImgUser,
    editUserPlan,
    getTempleteByDev,
    getDevelopers,
    getUserById
};
