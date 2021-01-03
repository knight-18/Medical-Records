const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const utilities = require('../utilities/Utilities')
const { isEmail, isMobilePhone } = require('validator')
require('dotenv').config()

const hospitalSchema = mongoose.Schema(
    {
        licenseNumber:{
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
        phoneNumber: {
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

// Creating token for hospital
hospitalSchema.methods.generateAuthToken = function generateAuthToken(maxAge){
    let id = this._id
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    })
}

//deleting the passsword before sending
hospitalSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    return userObject
}

//To hash the password
hospitalSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

const Hospital = monogose.model('Hospital', hospitalSchema)
module.exports = Hospital; 