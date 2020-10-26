const nodemailer = require("nodemailer");
require("dotenv").config();
const { JsonWebTokenError } = require("jsonwebtoken");
const jwt = require("jsonwebtoken")

const signupMail = (data) => {
  const maxAge = 3 * 60 * 60;
const TOKEN = (data) => {
  return jwt.sign({ data }, process.env.JWT_SECRET, {
    expiresIn: maxAge
  });
};
  const host = req.get("host");
  const PORT= process.env.PORT || 3000;
  const link = `${req.protocol}://${req.hostname}:${PORT}/user/verify/${data._id}?tkn=${TOKEN}`;

  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.NODEMAILER_EMAIL, //email id
      pass: process.env.NODEMAILER_PASSWORD, //my gmail password
    },
  });
  var mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: `${data.email}`,
    subject: "Please confirm your Email account",
    html:
      "Hello,<br> Please here to verify your email.<br><a href=" +
      link +
      ">Click here to verify</a>",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = {
  signupMail,
};