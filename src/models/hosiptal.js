const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const utilities = require('../utilities/Utilities')
const { isEmail, isMobilePhone } = require('validator')
require('dotenv').config()

const hospitalSchema = mongoose.Schema(
    {
        liscenceNumber:{
            type: String,
            trim: true,
        },
        hospitalName: {
            type: String,
            trim: true
        },
        adminName: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            trim: true,
            unique: true,
            validate: [isEmail,'Email is invalid']
        },
        phoneNmber: {
            type: String,
            trim: true,
            validate: [utilities.phoneValidator, 'Phone Number is invalid']
        },
        password: {
            type: String,
            trim: true,
            validate: [
                ( pass ) => {
                    return utilities.checkPasswordStrength( pass ) >= 4
                },
                'The password must contain a mix of uppercase and lowercase alphabets along with numbers and special chacracters'
            ]
        }
    },
    {
        timestamps : true
    }
)