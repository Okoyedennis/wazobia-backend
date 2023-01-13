const sgMail = require("@sendgrid/mail");
const bcrypt = require("bcryptjs");

const sendgridAPIKey = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(sendgridAPIKey);

const sendConfirmationEmail = (email, url) => {
  sgMail
    .send({
      to: email,
      from: "okoyedennis7@gmail.com",
      subject: "Mail confirmation",
      html: `<p>Verify your email address</p> <p>This link <b>expires in 1 day</b>.</p><p> click <a href=${url}>here</a> to proceed.</p>`,
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  sendConfirmationEmail,
};
