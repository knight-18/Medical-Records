const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { signupMail } = require('../config/nodemailer')
const { maxAge, loginError } = require('../config/variables')

require('dotenv').config()


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    })
}

const handleErrors = (err) => {
    let errors = { email: '', password: '', phoneNumber: '' }

    if (err.code === 11000) {
        errors.email = 'that email is already registered'
        return errors
    }
    // validation errors
    if (err.message.includes('User validation failed')) {
        // console.log(err);
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        })
    }


 
 
  // validation errors
  if (err.message.includes('validation failed')) {
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
    res.render('signup')
}

module.exports.login_get = (req, res) => {
    res.render('login')
}

module.exports.signup_post = async (req, res) => {

 
  const { name, email, password, phoneNumber } = req.body; 

  const userExists= await User.findOne({email})
  if(userExists)
    {
      req.flash("success_msg",`${userExists.name}, we have sent you a link to verify your account kindly check your mail`)
      signupMail(userExists,req.hostname,req.protocol)
      res.redirect("/signup")
      return 
    }

  try {
    let existingUser = await User.findOne({ email:email }); 
    if (existingUser)
    {
      if (existingUser.active)
      {
        req.flash("error_msg", "User with given email already exists");
        req.redirect("/login");  
      }
      else
      {
        req.flash("error_msg", "User with given email already exists, but email has not been verified");
        res.redirect("/login"); 
      }
    }
    else {
    const user = new User({email, name, password, phoneNumber}); 
    let saveUser = await user.save(); 
    
    const token = createToken(saveUser._id.toString());
    res.cookie('jwt', token, { httpOnly: false, maxAge : maxAge*1000 });
    //console.log(saveUser); 
    req.flash("success_msg", "Registration Successful now verify your email");
    signupMail(saveUser,req.hostname,req.protocol)
     //res.send(saveUser)
    res.redirect("/"); 
    }
   
  }
  catch(err) {
    const errors = handleErrors(err); 
    console.log(errors);
    //res.json(errors);
    let message = "Could not sign up" +  errors.email + '; ' + errors.password + '; ' + errors.phoneNumber; 
    req.flash("error_msg", message);
    res.status(400).redirect("/signup");
  } 
  
 
}
  module.exports.emailVerify_get = async(req,res)=>{
  if(req.protocol + "://" + req.get("host") == "http://" + req.get("host")){
  const token=req.params.id
  //console.log(token)
  try
  {
  const decoded=jwt.verify(token,process.env.JWT_SECRET,{expiresIn:'3h'})
  
  //console.log(decoded)
  const user=await User.findOne({_id:decoded.id})
  console.log(user)
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
}
module.exports.emailVerify_get = async (req, res) => {
    if (req.protocol + '://' + req.get('host') == 'http://' + req.get('host')) {
        const token = req.params.id
        //console.log(token)
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET, {
                expiresIn: '3h',
            })
            //console.log(decoded)
            const user = await User.findOne({ _id: decoded.id })
            console.log(user)
            if (!user) {
                console.log('user not found')
                res.redirect('/')
            } else {
                const activeUser = await User.findByIdAndUpdate(user._id, {
                    active: true,
                })
                if (!activeUser) {
                    console.log('Error occured while verifying')
                    req.flash('error_msg', 'error occured while verifying')
                    res.redirect('/')
                } else {
                    req.flash('succes_msg', 'User has been verified')
                    console.log('the user has been verified')
                    //console.log(activeUser)
                    res.redirect('/')
                }
            }
        } catch (e) {
            res.status(400).send(e)
        }
    } else {
        console.log('Unverified source')
        res.redirect('/')
    }

  }
  }
  catch(e)
  {
      req.flash("error_msg"," Your verify link has expired, try signing up once again")
      //signupMail(user,req.hostname,req.protocol)
      res.redirect("/signup")
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
    if(!user.active)
    {
      req.flash("error_msg",`${user.name}, You have not verified your account please check your mail to get the verify link`)
      signupMail(user,req.hostname,req.protocol)
      res.redirect("/login")
      return

    }
    const token = createToken(user._id); 
    res.cookie('jwt', token, { httpOnly: true, maxAge : maxAge * 1000});
    //console.log(user); 
    //signupMail(saveUser)
    req.flash("success_msg", "Successfully logged in");
    res.status(200).redirect("/profile");
  } 
  catch (err) {
    req.flash("error_msg", loginError);
    res.redirect("/login");
  }


}

module.exports.profile_get = async (req, res) => {
    res.locals.user = req.user
    res.render('profile')
}

module.exports.logout_get = async (req, res) => {
    // res.cookie('jwt', '', { maxAge: 1 });
    // const cookie = req.cookies.jwt
    res.clearCookie('jwt')
    req.flash('success_msg', 'Successfully logged out')
    res.redirect('/login')
}
