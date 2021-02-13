const User= require('../models/User')
const Hospital=require('../models/Hospitals')
const Relations=require('../models/Relations')
const jwt = require('jsonwebtoken')
//const { isPermittedMail } = require('../config/nodemailer')

module.exports.relation_post=async (req,res)=>{
    
    try{
    const{email}=req.body
    const user=await User.findOne({email})
    if(!user)
    {
        console.log('user not found')
        return
    }
    console.log('user',user)

    }
    catch(e)
    {
        console.log(e)
    }

}