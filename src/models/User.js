const mongoose = require('mongoose')
const validator = require('validator')
//const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const utilities = require('../utilities/Utilities')
const { isEmail, isMobilePhone } = require('validator')
const { loginError } = require('../config/variables')
require('dotenv').config()

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            validate: [isEmail, 'Email is Invalid'],
        },
        active: {
            type: Boolean,
            default: false,
        },
        password: {
            type: String,
            trim: true,
            required: true,
            minlength: 8,
            validate: [
                (val) => {
                    var strength = utilities.checkPasswordStrength(val)
                    return strength >= 4
                },
                'The password must contain a mix of uppercase and lowercase alphabets along with numbers and special chacracters',
            ],
        },
        phoneNumber: {
            type: String,
            trim: true,
            required: true,
            validate: [isMobilePhone, 'Phone Number is Invalid'],
        },
    },
    {
        timestamps: true,
    }
)

// static method to login user
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email })
    if (user) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
            return user
        }
        throw Error(loginError)
    }
    throw Error(loginError)
}

//deleting the passsword before sending
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    return userObject
}

//To hash the password
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
