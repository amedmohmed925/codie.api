const CustomizeRequest = require('../models/customizeModel');
const Product = require('../models/ProductModel');
const User = require('../models/userModel');
const mailSender = require('../utils/mailSender');

// إرسال طلب تخصيص
const createCustomizeRequest = async (req, res) => {
    try {
        const { productId, customerName, customerEmail, customerPhone, subject, description } = req.body;
        const userId = req.userId; // من middleware الـ authentication

        // التحقق من وجود جميع البيانات المطلوبة
        if (!productId || !customerName || !customerEmail || !customerPhone || !subject || !description) {
            return res.status(400).json({ 
                message: 'جميع الحقول مطلوبة (productId, customerName, customerEmail, customerPhone, subject, description)' 
            });
        }

        // التحقق من وجود المنتج
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'المنتج غير موجود' });
        }

        // التحقق من وجود المستخدم
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'المستخدم غير موجود' });
        }

        // إنشاء طلب التخصيص
        const customizeRequest = new CustomizeRequest({
            userId,
            productId,
            customerName,
            customerEmail,
            customerPhone,
            subject,
            description
        });

        await customizeRequest.save();

        // إرسال إيميل للإدارة
        const emailSubject = `طلب تخصيص جديد - ${subject}`;
        const emailBody = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">طلب تخصيص جديد</h2>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #007bff; margin-top: 0;">معلومات العميل</h3>
                    <p><strong>الاسم:</strong> ${customerName}</p>
                    <p><strong>البريد الإلكتروني:</strong> ${customerEmail}</p>
                    <p><strong>رقم الهاتف:</strong> ${customerPhone}</p>
                </div>

                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #007bff; margin-top: 0;">معلومات المنتج</h3>
                    <p><strong>اسم المنتج:</strong> ${product.title}</p>
                    <p><strong>معرف المنتج:</strong> ${productId}</p>
                </div>

                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #007bff; margin-top: 0;">تفاصيل الطلب</h3>
                    <p><strong>الموضوع:</strong> ${subject}</p>
                    <p><strong>الوصف:</strong></p>
                    <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #007bff;">
                        ${description.replace(/\n/g, '<br>')}
                    </div>
                </div>

                <div style="background: #e9ecef; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; font-size: 12px; color: #666;">
                        تاريخ الطلب: ${new Date().toLocaleString('ar-EG')}
                    </p>
                </div>
            </div>
        `;

        // إرسال الإيميل لعدة عناوين (الإدارة)
        const adminEmails = [
            process.env.ADMIN_EMAIL || 'admin@example.com',
            process.env.ADMIN_EMAIL_2 || 'support@example.com'
        ];

        // إرسال إيميل لكل عنوان إدارة
        let emailsSent = 0;
        for (const adminEmail of adminEmails) {
            try {
                await mailSender(adminEmail, emailSubject, emailBody);
                emailsSent++;
                console.log(`تم إرسال الإيميل بنجاح لـ ${adminEmail}`);
            } catch (emailError) {
                console.error(`خطأ في إرسال الإيميل لـ ${adminEmail}:`, emailError.message);
            }
        }

        // إرسال إيميل تأكيد للعميل
        let customerEmailSent = false;
        const confirmationEmailBody = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #28a745;">تم استلام طلبك بنجاح!</h2>
                
                <p>عزيزي/عزيزتي ${customerName}،</p>
                
                <p>شكراً لك على تواصلك معنا. تم استلام طلب التخصيص الخاص بك وسيتم مراجعته من قبل فريقنا.</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #007bff; margin-top: 0;">ملخص طلبك</h3>
                    <p><strong>المنتج:</strong> ${product.title}</p>
                    <p><strong>الموضوع:</strong> ${subject}</p>
                    <p><strong>تاريخ الطلب:</strong> ${new Date().toLocaleString('ar-EG')}</p>
                </div>
                
                <p>سيقوم فريقنا بالتواصل معك خلال 24-48 ساعة للمتابعة.</p>
                
                <p>مع تحياتنا،<br>فريق الدعم</p>
            </div>
        `;

        try {
            await mailSender(customerEmail, 'تأكيد استلام طلب التخصيص', confirmationEmailBody);
        } catch (emailError) {
            console.error('خطأ في إرسال إيميل التأكيد للعميل:', emailError);
        }

        res.status(201).json({
            message: 'تم إرسال طلب التخصيص بنجاح',
            requestId: customizeRequest._id,
            data: customizeRequest
        });

    } catch (error) {
        console.error('خطأ في إرسال طلب التخصيص:', error);
        res.status(500).json({ 
            message: 'حدث خطأ في السيرفر', 
            error: error.message 
        });
    }
};

// جلب طلبات التخصيص للمستخدم
const getUserCustomizeRequests = async (req, res) => {
    try {
        const userId = req.userId;

        const requests = await CustomizeRequest.find({ userId })
            .populate('productId', 'title uploadImgUrl')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: 'تم جلب طلبات التخصيص بنجاح',
            requests
        });

    } catch (error) {
        console.error('خطأ في جلب طلبات التخصيص:', error);
        res.status(500).json({ 
            message: 'حدث خطأ في السيرفر', 
            error: error.message 
        });
    }
};

// جلب جميع طلبات التخصيص (للإدارة)
const getAllCustomizeRequests = async (req, res) => {
    try {
        const userId = req.userId;
        
        // التحقق من أن المستخدم إدارة
        const user = await User.findById(userId);
        if (!user || user.role !== 'Admin') {
            return res.status(403).json({ message: 'غير مسموح - إدارة فقط' });
        }

        const requests = await CustomizeRequest.find()
            .populate('userId', 'name email')
            .populate('productId', 'title uploadImgUrl')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: 'تم جلب جميع طلبات التخصيص بنجاح',
            requests
        });

    } catch (error) {
        console.error('خطأ في جلب طلبات التخصيص:', error);
        res.status(500).json({ 
            message: 'حدث خطأ في السيرفر', 
            error: error.message 
        });
    }
};

// تحديث حالة طلب التخصيص (للإدارة)
const updateCustomizeRequestStatus = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body;
        const userId = req.userId;

        // التحقق من أن المستخدم إدارة
        const user = await User.findById(userId);
        if (!user || user.role !== 'Admin') {
            return res.status(403).json({ message: 'غير مسموح - إدارة فقط' });
        }

        // التحقق من صحة الحالة
        const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                message: 'حالة غير صحيحة. الحالات المتاحة: pending, in-progress, completed, cancelled' 
            });
        }

        // العثور على الطلب وتحديثه
        const customizeRequest = await CustomizeRequest.findByIdAndUpdate(
            requestId,
            { status },
            { new: true }
        ).populate('userId', 'name email')
         .populate('productId', 'title uploadImgUrl');

        if (!customizeRequest) {
            return res.status(404).json({ message: 'طلب التخصيص غير موجود' });
        }

        // إرسال إيميل للعميل بتحديث الحالة
        const statusMessages = {
            'pending': 'في انتظار المراجعة',
            'in-progress': 'قيد التنفيذ',
            'completed': 'مكتمل',
            'cancelled': 'ملغي'
        };

        const statusColors = {
            'pending': '#ffc107',
            'in-progress': '#007bff',
            'completed': '#28a745',
            'cancelled': '#dc3545'
        };

        const statusEmailBody = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">تحديث حالة طلب التخصيص</h2>
                
                <p>عزيزي/عزيزتي ${customizeRequest.customerName}،</p>
                
                <p>تم تحديث حالة طلب التخصيص الخاص بك.</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #007bff; margin-top: 0;">معلومات الطلب</h3>
                    <p><strong>المنتج:</strong> ${customizeRequest.productId.title}</p>
                    <p><strong>الموضوع:</strong> ${customizeRequest.subject}</p>
                    <p><strong>الحالة الجديدة:</strong> 
                        <span style="background: ${statusColors[status]}; color: white; padding: 5px 10px; border-radius: 4px;">
                            ${statusMessages[status]}
                        </span>
                    </p>
                </div>
                
                <p>شكراً لك على ثقتك بنا.</p>
                
                <p>مع تحياتنا،<br>فريق الدعم</p>
            </div>
        `;

        try {
            await mailSender(
                customizeRequest.customerEmail, 
                `تحديث حالة طلب التخصيص - ${statusMessages[status]}`, 
                statusEmailBody
            );
        } catch (emailError) {
            console.error('خطأ في إرسال إيميل تحديث الحالة:', emailError);
        }

        res.status(200).json({
            message: 'تم تحديث حالة الطلب بنجاح',
            request: customizeRequest
        });

    } catch (error) {
        console.error('خطأ في تحديث حالة طلب التخصيص:', error);
        res.status(500).json({ 
            message: 'حدث خطأ في السيرفر', 
            error: error.message 
        });
    }
};

module.exports = {
    createCustomizeRequest,
    getUserCustomizeRequests,
    getAllCustomizeRequests,
    updateCustomizeRequestStatus
};
