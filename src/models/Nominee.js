const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const crypto=require('crypto')
const bcrypt = require('bcryptjs')
const utilities = require('../utilities/Utilities')
const { isEmail, isMobilePhone } = require('validator')
require('dotenv').config()

const nomineeSchema = mongoose.Schema(
    {
        name:{
            type:String,
        },
        phoneNumber: {
            type: String,
            trim: true,
            validate: [utilities.phoneValidator, 'Phone number is invalid']
            
        },
        email:{
            type:String,
        }

    },
    
    {
        timestamps: true,
    },

)




const Nominee = mongoose.model('Nominee', nomineeSchema)

module.exports = Nominee
