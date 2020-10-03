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
    const user = new User({'email' : email, 'name' : name, 'password' : password, 'phoneNumber' : phoneNumber}); 
    let saveUser = await user.save(); 
    const token = createToken(saveUser._id);
    console.log(token); 
    res.cookie('jwt', token, { httpOnly: true, maxAge : maxAge*1000 });
    console.log(saveUser); 
    req.flash("info", "Thank You for Registering");
    res.redirect("/profile"); 
  }
  catch(err) {
    const errors = handleErrors(err); 
    console.log(errors);
    console.log(err);
    req.flash("warning", "Could not signup");
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
    req.flash("info", "Successfully logged in");
    res.status(200).redirect("/profile");
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
  console.log(email, password);
  res.send('user login');
}



module.exports.profile_get = async (req, res) => {
   res.render("profile"); 
}

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  req.flash("info", "Successfully logged out");
  res.redirect('/login');
}

