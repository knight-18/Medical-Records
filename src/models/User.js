const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const utilities = require('./Utilities');
const {isEmail, isMobilePhone } = require('validator'); 
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
        validate: [isEmail, "Email is Invalid"]
    },
    password:{
        type:String,
        trim:true,
        required:true,
        minlength:8,
        validate:[(val) => {
            var strength = utilities.checkPasswordStrength(val); 
            return strength >= 4; 
        }, "The password must contain a mix of uppercase and lowercase alphabets along with numbers and special chacracters"],  
             
    },
    phoneNumber:{
        type:String,
        trim:true,
        required:true,
        validate:[isMobilePhone, "Phone Number is Invalid"], 
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
