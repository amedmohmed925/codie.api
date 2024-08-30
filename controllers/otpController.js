// controllers/otpController.js
const otpGenerator = require('otp-generator');
const OTP = require('../models/otpModel');
const User = require('../models/userModel');

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp: otp  });
    }
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      otp,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const existingOTP = await OTP.findOneAndDelete({ email, otp });
    if (existingOTP) {
      const user = await User.findOne({ email });
      console.log(user);
      if (user) {
        user.verified = true;
        await user.save();
        console.log("user", user);
        // OTP is valid
        res.status(200).json({ success: true, message: 'OTP verification successful' });
      } else {
        res.status(404).json({ success: false, error: 'User not found' });
      }
    } else {
      // OTP is invalid
      res.status(400).json({ success: false, error: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
module.exports = {
  verifyOTP,
  sendOTP
}