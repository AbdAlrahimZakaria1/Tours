const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const pug = require('pug');

module.exports = class Email {
  constructor(user, url) {
    (this.to = user.email),
      (this.url = url),
      (this.firstName = user.name.split(' ')[0]),
      (this.from = 'lypo@gmail.com');
  }

  newTransporter() {
    if (process.env.NODE_ENV === 'production') {
      // Will not implement it
      return 0;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      logger: true,
      secure: false,
    });
  }

  async send(template, subject) {
    // 1) create the template file
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      },
    );

    // 2) define the mail options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: htmlToText.convert(html),
      html,
    };

    await this.newTransporter().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('Welcome', 'Welcome to the Natours!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Password reset token! (Valid for 10 minutes only)',
    );
  }
};
