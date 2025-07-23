const express = require('express');
const app = express();
const connectDB = require('./config/db');
const swaggerSpec = require('./swagger/swaggerConfig');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = require('./Socket/socket').io;
const allowedOrigins = [process.env.PORT2, process.env.PORT3];

// const corsOptions = {
//     origin: (origin, callback) => {
//         if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     optionsSuccessStatus: 200,
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     allowedHeaders: ['Content-Type', 'Authorization'],
// };
require('dotenv').config();
app.use(express.json());
app.use(cors());
// Connect Database
connectDB();

// Middleware
app.use(express.json({ extended: false }));

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.get('/', (req, res) => {
    res.send('Server is running');
});
app.use('/api/auth',require('./routes/authRoute'));
app.use('/api/user', require('./routes/userRoute'));
app.use('/api/collection', require('./routes/collectionRoute'));
app.use('/api/category', require('./routes/categoryRoute'));
app.use('/api/product', require('./routes/productRoute'));
app.use('/api/business', require('./routes/businessRoute'));
app.use('/api/subscriptions', require('./routes/subscriptionRoute'));
app.use('/api/saveTemplates', require('./routes/saveTemplateRoute'));
app.use('/api/likeTemplate', require('./routes/likeTemplateRoute'));
app.use('/api/order', require('./routes/orderRoute'));
app.use('/api/dashboard', require('./routes/dashboardRoute'));
app.use('/api/tag', require('./routes/tagRoute'));
app.use('/api/cart', require('./routes/cartRoute'));
app.use('/api/payment', require('./routes/paymentRoute'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/affiliate', require('./routes/affiliate'));
app.use('/api/wallet', require('./routes/walletRoute'));
app.use('/api/chatbot', require('./routes/chatbotRoute'));

const notificationRoutes = require('./routes/notificationsRoute');
app.use('/api/notifications', notificationRoutes);
const PORT = process.env.PORT || 6000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));