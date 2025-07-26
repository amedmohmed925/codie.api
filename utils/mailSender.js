// utils/mailSender.js
const nodemailer = require('nodemailer');

const mailSender = async (email, title, body) => {
  try {
    // Create a Transporter to send emails
    let transporter = nodemailer.createTransport({
        host: "smtp-relay.sendinblue.com",
        port: 587,
      auth: {
        user: process.env.EMAILTEST,
        pass:process.env.APIKEY,
      },
    });
    // Send emails to users
    let info = await transporter.sendMail({
      from: process.env.EMAILTEST || 'noreply@codie.com', // استخدام EMAILTEST بدلاً من EMAIL
      to: email,
      subject: title,
      html: body,
    });
    return info;
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = mailSender;