const axios = require('axios');

const getMethods= async (req, res) => {
    try {
        const response = await axios.get(process.env.FAWATERAK_API_URL, {
            headers: {
                'content-type': 'application/json',
                Authorization: `Bearer ${process.env.FAWATERAK_API_KEY}`,
            },
        });
        
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error retrieving payment methods:', error);
        res.status(500).json({ error: 'Failed to retrieve payment methods' });
    }
}

const invoiceInit= async (req, res) => {
    const data = {
        payment_method_id: req.body.payment_method_id,
        cartTotal: req.body.cartTotal,
        currency: req.body.currency,
        customer: req.body.customer,
        redirectionUrls: req.body.redirectionUrls,
        cartItems: req.body.cartItems,
    };

    try {
        const response = await axios.post(process.env.FAWATERAK_INVOICE_API_URL, data, {
            headers: {
                Authorization: `Bearer ${process.env.FAWATERAK_API_INVOICE_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error initializing invoice:', error);
        res.status(500).json({ error: 'Failed to initialize invoice' ,mag:error.message});
    }
}

module.exports = {
    getMethods,
    invoiceInit
  }