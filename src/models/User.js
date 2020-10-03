const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config()


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
    password:{
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
            if(!validator.isMobilePhone(value))
            {
                throw new Error('Invalid Mobile Number')
            }
        }
    }
    /*tokens:[
        {
            token:{
                type:String,
                required:true
            }

        }
    ]*/
}
/*{
    timestamps:true
}*/);



// static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error('Invalid Credentials');

    }
    throw Error('Invalid Credentials');
  };


userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });

const User = mongoose.model('User', userSchema)


module.exports = User
