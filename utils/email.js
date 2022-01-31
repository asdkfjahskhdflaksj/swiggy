const nodemailer = require("nodemailer");

const Email = class {
  constructor(user) {
    this.to = user.email;
    this.from = "sachinkshetty41@gmail.com";
  }
  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(subject) {
    const mailOption = {
      to: this.to,
      from: this.from,
      subject,
    };
    await this.newTransport().sendMail(mailOption);
  }

  async sendWelcome() {
    await this.send("welcome to swiggy");
  }
};

module.exports = Email;
