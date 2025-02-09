
const API = process.env.API_KRY;  // your API here
const integrationID = process.env.INTGERATION_ID;

async function processPayment(orderData, user) {
    try {
        // التحقق من أن بيانات المستخدم متوفرة
        if (!user || !user.email || !user.phone) {
            throw new Error("User data is incomplete!");
        }

        // Step 1: Get token
        let tokenResponse = await fetch('https://accept.paymob.com/api/auth/tokens', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "api_key": API })
        });

        let tokenData = await tokenResponse.json();
        let token = tokenData.token;

        // Step 2: Create order
        let orderResponse = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "auth_token": token,
                "delivery_needed": "false",
                "amount_cents": (orderData.totalAmount * 100).toString(),
                "currency": "EGP",
                "items": [],
            })
        });

        let orderDataResponse = await orderResponse.json();
        let orderId = orderDataResponse.id;

        // إعداد بيانات الفاتورة بناءً على بيانات المستخدم
        let billingData = {
            "apartment": user.address?.apartment || "N/A",
            "email": user.email,
            "floor": user.address?.floor || "N/A",
            "first_name": user.firstName || "User",
            "street": user.address?.street || "Unknown Street",
            "building": user.address?.building || "N/A",
            "phone_number":user.phone,
            "shipping_method": "PKG",
            "postal_code": user.address?.postalCode || "00000",
            "city": user.address?.city || "Cairo",
            "country": user.address?.country || "EG",
            "last_name": user.lastName || "Unknown",
            "state": user.address?.state || "N/A"
        };

        // Step 3: Create payment key
        let paymentResponse = await fetch('https://accept.paymob.com/api/acceptance/payment_keys', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "auth_token": token,
                "amount_cents": (orderData.totalAmount * 100).toString(),
                "expiration": 3600,
                "order_id": orderId,
                "billing_data": billingData,
                "currency": "EGP",
                "integration_id": integrationID,
                "redirection_url": "https://codie-mp.vercel.app/"
            })
        });

        let paymentData = await paymentResponse.json();
        return paymentData.token;
    } catch (error) {
        console.error("Error processing payment:", error);
        throw error;
    }
}


module.exports = { processPayment};
