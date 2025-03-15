const AffiliateCode = require('../models/AffiliateCode');
const Order = require('../models/orderModel');

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

module.exports = {
    generateAffiliateCode,
    getAffiliateStats
};