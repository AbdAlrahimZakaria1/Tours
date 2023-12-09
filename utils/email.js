const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) create the transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    logger: true,
    secure: false,
  });
  // 2) define the mail options
  const mailOptions = {
    from: 'lypo@gmail.com',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html
  };

  // 3) send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
