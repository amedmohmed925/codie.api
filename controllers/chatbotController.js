const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product = require('../models/ProductModel');
require('dotenv').config();


function extractKeywords(text) {
  if (!text) return [];
  return text
    .replace(/[\n\r]/g, ',')
    .split(',')
    .map(k => k.trim())
    .filter(Boolean);
}

exports.chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;
    const genAI = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(
      `المستخدم قال: "${message}". استخرج لي فقط الكلمات المفتاحية أو الاهتمامات أو نوع الموقع المطلوب (مثال: متجر إلكتروني، مدونة، تعليمي، عقارات، إلخ). أرسلها مفصولة بفواصل.`
    );
    const text = await result.response.text();
    const keywords = extractKeywords(text);
    if (!keywords.length) return res.json({ reply: 'لم أستطع تحديد اهتماماتك بدقة. يرجى التوضيح أكثر.' });

    const templates = await Product.find({
      $or: [
        { category: { $in: keywords } },
        { title: { $regex: keywords.join('|'), $options: 'i' } },
        { description: { $regex: keywords.join('|'), $options: 'i' } }
      ]
    }).limit(5);

    res.json({
      reply: `بناءً على كلامك، هذه بعض القوالب المناسبة:`,
      templates
    });
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ في الشات بوت', error: err.message });
  }
};
