const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authorization = require("../middleware/auth");
const uuid = require("uuid");
const fs = require("fs");
const path = require("path");
const async = require("async");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');
const { check, validationResult } = require('express-validator');
const flash = require('connect-flash');
const session = require("express-session");
const nodemailer = require('nodemailer');
const cryptoRandomString = require('crypto-random-string');
require('dotenv').config();

const maxAge = 30 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge
  });
};

const handleErrors = (err) => {
  
  let errors = { email: '', password: '', phoneNumber:'' };


 
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }
  // validation errors
  if (err.message.includes('User validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors; 
 
}

//nodemailer methods

var transporter = nodemailer.createTransport({
  host:'smtp.gmail.com',
  port:465,
  secure:true,
  auth: {
    user: process.env.NODEMAILER_EMAIL,           //email id
    pass: process.env.NODEMAILER_PASSWORD       //my gmail password
  }
});


var rand,mailOptions,host,link;
/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/


module.exports.verify = (req, res) =>{
// console.log(req.protocol+":/"+req.get('host'));

  if((req.protocol+"://"+req.get('host'))==("http://"+host))
  {
      console.log("Domain is matched. Information is from Authentic email");

      User.findById(req.params.id,function(err,user){
          if(err)
              console.log(err);
          else
          {
              date2 = new Date();
              date1 = user.created_at;
              var timeDiff = Math.abs(date2.getTime() - date1.getTime());
              var diffhrs = Math.ceil(timeDiff / (1000 * 60));
              console.log(diffhrs);

              if(diffhrs <= 3)
              {
                  User.findByIdAndUpdate(user._id,{active:true},function(err,user){
                      if(err)
                          console.log(err);
                      else
                      {
                          console.log("email is verified");
                          // res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
                          res.render("verify");
                      }
                        
                  });

              }
              else
              {
                  User.findByIdAndUpdate(user._id,{created_at: new Date()},function(err,user){
                      if(err)
                          console.log(err);   
                  });
                  console.log("Link has expired try logging in to get a new link");
                  // res.end("<h1>Link has expired try logging in to get a new link</h1>");
                  res.render("notverified");
              }
          }
      });
  }
  else
  {
      res.end("<h1>Request is from unknown source");
  }
};

//==============================


// controller actions
module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  
  res.render('login');
}

module.exports.signup_post = async (req, res) => {
 
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
      return res.status(422).jsonp(errors.array());
  }
  else {
      bcrypt.hash(req.body.password, 10).then((hash) => {
          const user = new User({
              name: req.body.name,
              email: req.body.email,
              password: hash
          });
          user.save().then((response) => {

              //nodemailer
              rand=cryptoRandomString({length: 100, type: 'url-safe'});
              host=req.get('host');
              link="http://"+req.get('host')+"/dsc/user/verify/"+user._id+"?tkn="+rand;
              mailOptions={ 
                  from: process.env.NODEMAILER_EMAIL,
                  to: user.email,
                  subject : "Please confirm your Email account",
                  html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
              }
              // console.log(mailOptions);
              transporter.sendMail(mailOptions, function(error, response){
               if(error){
                      console.log(error);
                  res.end("error");
               }else{
                      console.log("Message sent: " + response.message);
                   }
              });
          //nodemailer ends
              res.locals.flashMessages = req.flash("success", user.name + " Email has been sent to you for verification");
              res.redirect("/dsc/");
          }).catch(error => {
              // res.status(500).json({
              //     error: error
              // });
              // console.log(error);
              res.locals.flashMessages = req.flash("error", "Email already in use try logging in");
              res.redirect("/dsc/");
          });
      });
  }

 
}

module.exports.login_post = async (req, res) => {
  let getUser;
  User.findOne({
      email: req.body.email
  }).then(user => {
      if (!user) {
          req.flash("error","User not found try creating a new account");
          res.redirect("/dsc/");
      }
      getUser = user;
      return bcrypt.compare(req.body.password, user.password);
  }).then(response => {
      if (!response) {
          req.flash("error","You have entered wrong password");
          res.redirect("/dsc/");
      }
      if(getUser.active)
      {
          var token = jwt.sign({
              name: getUser.name,
              email: getUser.email,
              userId: getUser._id
          },process.env.JWT_SECRET, {
              expiresIn: "1d"
          });
          res.cookie( 'authorization', token,{ maxAge: 24*60*60*1000, httpOnly: false });
      }
      if(getUser.active)
      {
          req.flash("success",getUser.name + " you are logged in");
          res.redirect("/");
      }
      else
      {
          rand=cryptoRandomString({length: 100, type: 'url-safe'});
              host=req.get('host');
              link="http://"+req.get('host')+"/dsc/user/verify/"+getUser._id+"?tkn="+rand;
              mailOptions={ 
                  from: process.env.NODEMAILER_EMAIL,
                  to: getUser.email,
                  subject : "Please confirm your Email account",
                  html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
              }
              // console.log(mailOptions);
              transporter.sendMail(mailOptions, function(error, response){
               if(error){
                      console.log(error);
                  res.end("error");
               }else{
                      console.log("Message sent: " + response.message);
                   }
              });
          req.flash("error",getUser.name + " your email is not verified we have sent you an email");
          res.redirect("/dsc/");
      }
      
  }).catch(err => {
      req.flash("error",err);
      res.redirect("/dsc/");
  });
}




module.exports.profile_get = async (req, res) => {
   res.locals.user = req.user; 
   res.render("profile"); 
}

module.exports.logout_get = async (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  req.flash("success_msg", "Successfully logged out");
  res.redirect('/login');
}

