const nodemailer = require('nodemailer')
require('dotenv').config()

//const { JsonWebTokenError } = require("jsonwebtoken");
const jwt = require('jsonwebtoken')
const { getMaxListeners } = require('../models/User')
//const { getMaxListeners } = require("../models/User");
//const { getMaxListeners } = require("../models/User");

const signupMail = (data, host, protocol) => {
    const maxAge = 3 * 60 * 60

    const TOKEN = jwt.sign({ id: data._id }, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    })
    //console.log(TOKEN)
    //console.log(data)
    const PORT = process.env.PORT || 3000
    const link = `${protocol}://${host}:${PORT}/verify/${data._id}?tkn=${TOKEN}`

    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.NODEMAILER_EMAIL, //email id

            pass: process.env.NODEMAILER_PASSWORD, // gmail password
        },
    })
    var mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: `${data.email}`,
        subject: 'Please confirm your Email account',
        html:
            'Hello,<br> Please here to verify your email.<br><a href=' +
            link +
            '>Click here to verify</a>',
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error', error)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })
}

module.exports = {
    signupMail,
}
