const AffiliateCode = require('../models/AffiliateCode');
const Order = require('../models/orderModel');
const User = require('../models/userModel'); // افترضت إن عندك موديل User

const generateAffiliateCode = async (req, res) => {
    try {
        const advertiserId = req.userId;
        let code;
        let isUnique = false;
        do {
            code = `AFF${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
            const existingCode = await AffiliateCode.findOne({ code });
            isUnique = !existingCode;
        } while (!isUnique);

        const newCode = new AffiliateCode({ code, advertiserId });
        await newCode.save();
        res.json({ code });
    } catch (error) {
        console.error('Generate Code Error:', error);
        res.status(500).json({ 
            message: 'Error generating code', 
            error: error.message || error 
        });
    }
};

const getAffiliateStats = async (req, res) => {
    try {
        const advertiserId = req.userId; 
        const codes = await AffiliateCode.find({ advertiserId });
        const stats = await Promise.all(codes.map(async (c) => {
            const purchases = await Order.countDocuments({ 
                affiliateCode: c.code, 
                orderStatus: 'Paid' 
            });
            return { code: c.code, purchases };
        }));
        res.json(stats);
    } catch (error) {
        console.error('Get Stats Error:', error);
        res.status(500).json({ 
            message: 'Error fetching stats', 
            error: error.message || error 
        });
    }
};

// إند بوينت جديدة للأدمن
const getAllAdvertisersAffiliateStats = async (req, res) => {
    try {
        // التحقق من إن المستخدم أدمن
        const user = await User.findById(req.userId);
        if (!user || user.role !== 'Admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        // جلب كل المعلنين
        const advertisers = await User.find({ role: 'Advertiser' }).select('_id userName email');

        // جلب الإحصائيات لكل معلن
        const stats = await Promise.all(advertisers.map(async (advertiser) => {
            const codes = await AffiliateCode.find({ advertiserId: advertiser._id });
            const codeStats = await Promise.all(codes.map(async (c) => {
                const purchases = await Order.countDocuments({ 
                    affiliateCode: c.code, 
                    orderStatus: 'Paid' 
                });
                return { code: c.code, purchases };
            }));

            const totalPurchases = codeStats.reduce((sum, stat) => sum + stat.purchases, 0);

            return {
                advertiserId: advertiser._id,
                advertiserName: advertiser.userName,
                advertiserEmail: advertiser.email,
                codes: codeStats,
                totalPurchases
            };
        }));

        // إجمالي استخدام كل الأكواد
        const grandTotalPurchases = stats.reduce((sum, advertiser) => sum + advertiser.totalPurchases, 0);

        res.json({
            advertisers: stats,
            grandTotalPurchases
        });
    } catch (error) {
        console.error('Get All Advertisers Stats Error:', error);
        res.status(500).json({ 
            message: 'Error fetching advertisers stats', 
            error: error.message || error 
        });
    }
};


module.exports = {
    generateAffiliateCode,
    getAffiliateStats,
    getAllAdvertisersAffiliateStats
};