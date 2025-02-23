const Order = require('../models/orderModel');
const Review = require('../models/reviewModel');

exports.addProductReview = async (req, res) => {
    try {
        const { userId, productId, rating, comment } = req.body;

        if (!userId || !productId || !rating) {
            return res.status(400).json({ message: "جميع الحقول مطلوبة (userId, productId, rating)" });
        }

        // التحقق مما إذا كان المستخدم قد اشترى المنتج
        const hasPurchased = await Order.findOne({
            userId,
            orderStatus: "completed",
            "cartItems.productId": productId
        });

        if (!hasPurchased) {
            return res.status(403).json({ message: "لا يمكنك تقييم المنتج لأنك لم تقم بشرائه." });
        }

        // إنشاء التقييم
        const newReview = new Review({
            userId,
            productId,
            rating,
            comment
        });

        await newReview.save();
        return res.status(201).json({ message: "تم إضافة التقييم بنجاح", review: newReview });

    } catch (error) {
        console.error("Error adding review:", error);
        return res.status(500).json({ message: "حدث خطأ داخلي في السيرفر" });
    }
};


// 🔹 عرض جميع التقييمات الخاصة بمنتج معين
exports.getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const reviews = await Review.find({ productId }).populate('userId', 'name'); // جلب التقييمات مع اسم المستخدم
        return res.status(200).json(reviews);

    } catch (error) {
        console.error("Error fetching reviews:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// 🔹 حساب متوسط التقييمات (إجمالي التقييم) لمنتج معين
exports.getProductAverageRating = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const result = await Review.aggregate([
            { $match: { productId } }, // تصفية المنتج المطلوب
            { $group: { 
                _id: "$productId", 
                averageRating: { $avg: "$rating" }, // حساب المتوسط
                totalReviews: { $sum: 1 } // حساب عدد التقييمات
            } }
        ]);

        if (result.length === 0) {
            return res.status(200).json({ productId, averageRating: 0, totalReviews: 0 });
        }

        return res.status(200).json(result[0]);

    } catch (error) {
        console.error("Error fetching average rating:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};