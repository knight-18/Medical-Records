const mongoose = require('mongoose');
const validator=require('validator');
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
        defaultValue: false,
        type:String,
        trim:true,
        required:true,
        minlength:8,
        validate(value)
        {
            var strength=0
            if(value.match(/[a-z]+/)){
                strength+=1;
            }
            if(value.match(/[A-Z]+/)){
                strength+=1;
            }
            if(value.match(/[0-9]+/)){
            strength+=1;}
            if(value.match(/[#$&!@]+/)){
                strength+=1;
            }
            if(strength<4)
            {
                throw new Error('The password must contain a mix of uppercase and lowercase alphabets along with numbers and special chacracters')
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



