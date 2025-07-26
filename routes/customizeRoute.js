const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/isAuth');
const {
    createCustomizeRequest,
    getUserCustomizeRequests,
    getAllCustomizeRequests,
    updateCustomizeRequestStatus
} = require('../controllers/customizeController');

/**
 * @swagger
 * /api/customize:
 *   post:
 *     tags: [Customize]
 *     summary: إرسال طلب تخصيص جديد
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - customerName
 *               - customerEmail
 *               - customerPhone
 *               - subject
 *               - description
 *             properties:
 *               productId:
 *                 type: string
 *                 description: معرف المنتج
 *               customerName:
 *                 type: string
 *                 description: اسم العميل
 *               customerEmail:
 *                 type: string
 *                 description: بريد العميل الإلكتروني
 *               customerPhone:
 *                 type: string
 *                 description: رقم هاتف العميل
 *               subject:
 *                 type: string
 *                 description: موضوع الطلب
 *               description:
 *                 type: string
 *                 description: وصف مفصل للطلب
 *     responses:
 *       201:
 *         description: تم إرسال الطلب بنجاح
 *       400:
 *         description: بيانات غير صحيحة
 *       404:
 *         description: المنتج أو المستخدم غير موجود
 *       500:
 *         description: خطأ في السيرفر
 */
router.post('/', isAuth, createCustomizeRequest);

/**
 * @swagger
 * /api/customize/my-requests:
 *   get:
 *     tags: [Customize]
 *     summary: جلب طلبات التخصيص الخاصة بالمستخدم
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: تم جلب الطلبات بنجاح
 *       500:
 *         description: خطأ في السيرفر
 */
router.get('/my-requests', isAuth, getUserCustomizeRequests);

/**
 * @swagger
 * /api/customize/admin/all:
 *   get:
 *     tags: [Customize]
 *     summary: جلب جميع طلبات التخصيص (للإدارة)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: تم جلب الطلبات بنجاح
 *       403:
 *         description: غير مسموح - إدارة فقط
 *       500:
 *         description: خطأ في السيرفر
 */
router.get('/admin/all', isAuth, getAllCustomizeRequests);

/**
 * @swagger
 * /api/customize/admin/update-status/{requestId}:
 *   put:
 *     tags: [Customize]
 *     summary: تحديث حالة طلب التخصيص (للإدارة)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: معرف طلب التخصيص
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed, cancelled]
 *                 description: الحالة الجديدة للطلب
 *     responses:
 *       200:
 *         description: تم تحديث الحالة بنجاح
 *       400:
 *         description: حالة غير صحيحة
 *       403:
 *         description: غير مسموح - إدارة فقط
 *       404:
 *         description: طلب التخصيص غير موجود
 *       500:
 *         description: خطأ في السيرفر
 */
router.put('/admin/update-status/:requestId', isAuth, updateCustomizeRequestStatus);

module.exports = router;
