const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); 
const OTP = require('../models/otpModel'); 
const { validationResult } = require('express-validator');

const register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { role,email, password, name,userName,phone, address, conditions } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create and save the new user
        user = new User({role,email, password, name,userName,phone, address, conditions });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        // Generate OTP
        const otp = (100000 + Math.floor(Math.random() * 900000)).toString();
        const newOTP = new OTP({ email, otp });
        await newOTP.save(); // Ensure OTP is saved before proceeding

        // Find the most recent OTP for the email
        const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        
        if (response.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'The OTP is not valid',
            });
        }

        return res.status(201).json({
            success: true,
            message: 'OTP sent successfully',
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


// Login user
const login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{
    const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'This Email does not exist' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch);
        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }
        if (user.verified === false) {
            return res.status(404).json({ error: 'not verified' });
        }
        // Generate JWT token
        const tokenData = { userId: user._id };
        const token = jwt.sign(tokenData,process.env.JWT_SECRET, { expiresIn: '24h' });

        let Role = user.role || "";

        res.status(200).json({ Token: token, Role, message: 'Login successful' });

    } catch (err) {
        console.error('Error logging in:', err);
        next(err);
    }
};

// Forget password
const forgetPassword = async (req, res, next) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: 'Please provide email, OTP, and new password.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const otpRecords = await OTP.findOne({otp }).sort({ createdAt: -1 }).limit(1);
        console.log(otpRecords);
        if (otpRecords === null) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        next(error);
    }
};

// Forget password
const reastPassword = async (req, res, next) => {
    const {newPassword } = req.body;

    if (newPassword) {
        return res.status(400).json({ message: 'Please provide  new password.' });
    }

    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password reast successfully.' });
    } catch (error) {
        next(error);
    }
};

// Refresh token

const refreshToken = async (req, res, next) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ msg: 'No token provided' });
    }

    try {
        // تحقق من التوكين الأصلي
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // تأكد من أن SECRET يتم تحميله من البيئة
        const userId = decoded.userId; // تحقق من أن البيانات التي تحتاجها موجودة في التوكين

        if (!userId) {
            return res.status(401).json({ msg: 'Invalid token data' });
        }

        // قم بإنشاء توكين جديد يتضمن بيانات المستخدم
        const payload = {userId};
        console.log(payload);
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, newToken) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ msg: 'Error signing token' });
            }
            res.status(200).json({ token: newToken });
        });
    } catch (err) {
        console.error(err.message);
        res.status(401).json({ msg: 'Invalid token' });
    }
};
module.exports = {
    register,
    login,
    forgetPassword,
    refreshToken,
    reastPassword
};
