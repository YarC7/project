const nodemailer = require("nodemailer");
const MyConstants = require("./MyConstants");
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secureConnection: false,
  auth: {
    user: MyConstants.EMAIL_USER,
    pass: MyConstants.EMAIL_PASS,
  },
});
const EmailUtil = {
  send(email, id, token) {
    const text =
      "Thanks for signing up, please input these informations to activate your account:\n\t .id: " +
      id +
      "\n\t .token: " +
      token;
    return new Promise(function (resolve, reject) {
      const mailOptions = {
        from: MyConstants.EMAIL_USER,
        to: email,
        subject: "Signup | Verification",
        text: text,
      };
      transporter.sendMail(mailOptions, function (err, result) {
        if (err) reject(err);
        resolve(true);
      });
    });
  },
  reset(email, resetLink) {
    return new Promise(function (resolve, reject) {
      const resetOptions = {
        from: MyConstants.EMAIL_USER,
        to: email,
        subject: "Reset Password Link",
        html: `<p>You requested for reset password kindly use this <a href="${resetLink}">${resetLink}</a></p>`,
      };
      transporter.sendMail(resetOptions, function (err, result) {
        if (err) {
          reject(err); // If there's an error, reject the promise with the error.
        } else {
          resolve(true); // If the email is sent successfully, resolve the promise with 'true'.
        }
      });
    });
  },
};
module.exports = EmailUtil;
