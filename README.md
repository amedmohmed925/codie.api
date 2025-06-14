# 📢 نظام الإشعارات المتكامل (Notification System)

نظام إشعارات متكامل يدعم الإشعارات اللحظية (Real-time) والتخزين في قاعدة بيانات MongoDB، مع واجهات برمجية (API) كاملة لإدارة الإشعارات وتخصيصها.

---

## ⚡️ المميزات الرئيسية
- استقبال إشعارات لحظية عبر Socket.IO
- تخزين جميع الإشعارات في MongoDB
- جلب سجل الإشعارات مع دعم التصفح (Pagination)
- تعليم الإشعار كمقروء
- تخصيص تفضيلات الإشعارات
- إرسال إشعارات يدوية (Admin فقط)
- حماية كاملة عبر JWT
- دعم Rate Limiting للأمان
- دعم FCM لإشعارات Push للأجهزة غير المتصلة

---

## 🔗 **Endpoints & الاستخدام**

### 1. **جلب سجل الإشعارات (Notification History)**
- **GET** `/api/notifications?page=1&limit=20`
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
- **الاستجابة:**
```json
{
  "notifications": [
    {
      "_id": "665f2e2b1c2a4e3b2c1d4f5a",
      "userId": "...",
      "type": "PROJECT_ADDED",
      "title": "عنوان",
      "description": "نص الإشعار",
      "link": "/project/123",
      "isRead": false,
      "createdAt": "2025-06-15T12:00:00.000Z"
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 20
}
```

---

### 2. **تعليم إشعار كمقروء (Mark as Read)**
- **PATCH** `/api/notifications/:id`
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
- **الاستجابة:**
```json
{
  "message": "Notification marked as read",
  "notification": { ... }
}
```

---

### 3. **تحديث تفضيلات الإشعارات (Preferences)**
- **PUT** `/api/notifications/preferences`
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
- **Body:**
```json
{
  "PROJECT_ADDED": true,
  "PRODUCT_SOLD": false,
  "AFFILIATE_PURCHASE": true,
  "STATUS_CHANGED": true,
  "MANUAL": true
}
```
- **الاستجابة:**
```json
{
  "message": "Preferences updated",
  "preferences": { ... }
}
```

---

### 4. **استقبال إشعارات لحظية (Real-time via Socket.IO)**
- **Socket URL:** `ws://localhost:3000`
- **الاتصال:**
```js
import { io } from "socket.io-client";
const socket = io("http://localhost:3000", {
  auth: { token: "<JWT_TOKEN>" }
});
```
- **الاستماع:**
```js
socket.on("notification", (notif) => {
  // notif: {title, description, ...}
});
```
- **الاستخدام:**
  - عند استقبال إشعار جديد، أضفه مباشرة لقائمة الإشعارات مع صوت أو Badge.
  - تحديث عداد الإشعارات غير المقروءة تلقائياً.

---

### 5. **إرسال إشعار يدوي (Admin فقط)**
- **POST** `/api/notifications`
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
- **Body:**
```json
{
  "userType": "Seller", // أو User أو Advertiser أو Affiliate
  "title": "تنبيه جديد",
  "description": "تمت إضافة مشروع جديد!",
  "link": "/project/123"
}
```
أو:
```json
{
  "userIds": ["665f2e2b1c2a4e3b2c1d4f5a"],
  "title": "تنبيه خاص",
  "description": "رسالة خاصة",
  "link": "/project/123"
}
```
- **الاستجابة:**
```json
{
  "message": "Notifications sent",
  "count": 1
}
```

---

## 🛡️ **الأمان**
- جميع الـ endpoints تتطلب JWT في الهيدر.
- حماية من السبام عبر Rate Limiting على إرسال الإشعارات اليدوية.
- Sanitization للمدخلات لمنع XSS.

---

## 🗄️ **التخزين**
- جميع الإشعارات تُخزن في MongoDB في Collection باسم notifications.
- كل إشعار يحتوي على userId, type, title, description, link, isRead, createdAt.

---

## ⚙️ **التكامل مع الفرونت (React)**
- استخدم axios أو fetch للنداءات العادية.
- استخدم socket.io-client لاستقبال الإشعارات اللحظية.
- عند استقبال إشعار جديد عبر Socket.IO، أضفه مباشرة للـ state.
- عند فتح صفحة الإشعارات، اجلبها من `/api/notifications`.
- عند الضغط على إشعار، أرسل PATCH لتعليم كمقروء.
- يمكنك عمل صفحة إعدادات لتفضيلات الإشعارات (PUT).

---

## 🧪 **اختبار النظام**
- يمكنك اختبار كل endpoint عبر Postman أو أي أداة HTTP.
- تأكد من إرسال JWT صحيح في الهيدر.
- استخدم ObjectId حقيقي للمستخدمين عند الإرسال.

---

## 📝 **ملاحظات إضافية**
- النظام يدعم التوسع الأفقي عبر Redis Pub/Sub.
- يدعم FCM لإشعارات Push للأجهزة غير المتصلة.
- جميع الأكواد مشروحة في الملفات:
  - controllers/notificationsController.js
  - routes/notificationsRoute.js
  - models/NotificationModel.js
  - utils/pushNotification.js
  - services/eventService.js
  - Socket/socket.js

---

**لأي استفسار أو مثال عملي إضافي، راجع الكود أو تواصل مع المطور.**