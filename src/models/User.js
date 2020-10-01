const mongoose = require('mongoose');
const validator=require('validator');
const passwordStrength=require('check-password-strength')
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs')
require("dotenv").config();
 

const userSchema = mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true,
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error('Email is invalid')
            }
        }
    },
    passsword:{
        type:String,
        trim:true,
        required:true,
        minlength:8,
        validate(value)
        {
            if(passwordStrength(value).id < 1)
            {
                throw new Error('Password should contain a mix of lowercase,uppercase and special charcaters')
            }

        }
    },
    phoneNumber:{
        type:String,
        trim:true,
        required:true,
        validate(value)
        {
            if(!validator.isMobileNumber(value))
            {
                throw new Error('Invalid Mobile Number')
            }
        }
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }

        }
    ]
},{
    timestamps:true
})

userSchema.methods.generateAuthToken=async function(){
    const user=this
    const token=jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token

}

userSchema.pre('save',async function(next){
    const user=this
    if(user.isModified('password'))
    {
        user.passsword= await bcrypt.hash(user.passsword,8)
    }
    next()
})

const User=mongoose.model('User',userSchema)

module.exports= User



