const User = require("../models/User");
const jwt = require('jsonwebtoken');
//const {signupMail}=require('../config/nodemailer')

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

// controller actions
module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  
  res.render('login');
}

module.exports.signup_post = async (req, res) => {
 
  const { name, email, password, phoneNumber } = req.body; 

 

  try {
    const user = new User({email, name, password, phoneNumber}); 
    let saveUser = await user.save(); 
    const token = createToken(saveUser._id.toString());
    //signupMail(saveUser)
    res.cookie('jwt', token, { httpOnly: false, maxAge : maxAge*1000 });
    console.log(saveUser); 
    req.flash("success_msg", "Registration Successful now verify your email");
    res.redirect("/"); 
  }
  catch(err) {
    const errors = handleErrors(err); 
    console.log(errors);
    //res.json(errors);
    req.flash("error_msg", "Could not signup");
    res.status(400).redirect("/signup");
  } 
  
 
}
module.exports.emailVerify_get=async(req,res)=>{
  if(req.protocol + "://" + req.get("host") == "http://" + req.get("host")){
  const token=req.params.id
  const decoded=jwt.verify(token,process.env.JWT_SECRET)
  const user=await User.findOne({phoneNumber:decoded.phoneNumber})
  if(!user)
  {
      console.log("user not found")
      res.redirect("/")
  }
  else{
    const activeUser=await User.findByIdAndUpdate(user._id,{active:true})
    if(!activeUser)
    {
      console.log("Error occured while verifying")
      req.flash("error_msg","error occured while verifying")
      res.redirect("/")
    }
    else{
      req.flash("succes_msg","User has been verified")
      console.log("the user has been verified")
    }
  }
  }
  else
  {
    console.log("Unverified source")
    res.redirect("/")
  }

}


module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id); 
    res.cookie('jwt', token, { httpOnly: true, maxAge : maxAge * 1000});
    console.log(user); 
    req.flash("success_msg", "Successfully logged in");
    res.status(200).redirect("/profile");
  } 
  catch (err) {
    req.flash("error_msg", "Invalid Credentials"); 

    res.redirect("/login");
  }

}



module.exports.profile_get = async (req, res) => {
   res.locals.user = req.user; 
   res.render("profile"); 
}

module.exports.logout_get = async (req, res) => {
  // res.cookie('jwt', '', { maxAge: 1 });
  res.clearCookie("jwt");
  req.flash("success_msg", "Successfully logged out");
  res.redirect('/login');
}
