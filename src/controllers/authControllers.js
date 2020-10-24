const User = require("../models/User");
const jwt = require('jsonwebtoken');

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
    const token = createToken(saveUser._id);
    //console.log(token); 
    res.cookie('jwt', token, { httpOnly: false, maxAge : maxAge*1000 });
    console.log(saveUser); 
    req.flash("success_msg", "Registration Successful");
    res.redirect("/profile"); 
  }
  catch(err) {
    const errors = handleErrors(err); 
    console.log(errors);
    //res.json(errors);
    req.flash("error_msg", "Could not signup");
    res.status(400).redirect("/signup");
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
 // console.log(email, password);

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

