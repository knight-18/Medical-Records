const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { signupMail } = require('../config/nodemailer')
const { maxAge, loginError } = require('../config/variables')

require('dotenv').config()


// const createToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: maxAge,
//     })
// }

const handleErrors = (err) => {
    let errors = { email: '', password: '', phoneNumber: '' }


 
 
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



module.exports.signup_post = async (req, res) => 
{
  const { email } = req.body; 
  const doesUserExist = await User.findOne({ email: email });
  try 
  {
      if (doesUserExist)
      {
        req.flash("error_msg", "User with same email already exists, kindly login"); 
        res.redirect("/login"); 
      }
      else
      {
        const { name, email, phoneNumber, password } = req.body; 
        const newUser = await User.create({ name, email, phoneNumber, password }); 

        try {
          const token = newUser.createUserToken();  
        res.cookie("jwt", token, { httpOnly:true, maxAge:maxAge*1000 }); 
        req.flash("success_msg", "Successfully registered"); 

        res.redirect("/profile"); 
        }

        catch (err) //if I could not sign up 
        {
          const errors = handleErrors(err); 
          //     console.log(errors);
          //     //res.json(errors);
              req.flash("error_msg", "Could not register" + ';' + errors.email + '; ' + errors.password + ': ' + errors.phoneNumber);
              res.status(400).redirect("/signup");
        }
        
      }
  } 
  catch (err) 
  {
    throw err; 
  }
}

module.exports.send_email = async(req, res) => 
{
  await signupMail(req.user,req.hostname,req.protocol); 
  req.flash("success_msg", "Sent a verification email. Kindly check your inbox"); 
  res.redirect("/profile"); 
}


// module.exports.signup_post = async (req, res) => {

 
//   const { name, email, password, phoneNumber } = req.body; 

//   const userExists= await User.findOne({email})
//  /* if(userExists)
//     {
//       req.flash("success_msg",`${userExists.name}, we have sent you a link to verify your account kindly check your mail`)
//       signupMail(userExists,req.hostname,req.protocol)
//       res.redirect("/signup")
//       return 
//     */

//   try {
//     const user = new User({email, name, password, phoneNumber}); 
//     let saveUser = await user.save(); 
    
//     const token = createToken(saveUser._id.toString());
//     res.cookie('jwt', token, { httpOnly: false, maxAge : maxAge*1000 });
//     //console.log(saveUser); 
//     req.flash("success_msg", "Registration Successful now verify your email");
//     signupMail(saveUser,req.hostname,req.protocol)
//      //res.send(saveUser)
//     res.redirect("/"); 
//   }
//   catch(err) {
//     const errors = handleErrors(err); 
//     console.log(errors);
//     //res.json(errors);
//     req.flash("error_msg", "Could not signup");
//     res.status(400).redirect("/signup");
//   } 
  
 
// }
module.exports.emailVerify_get = async(req,res)=>{
  
  
  const token=req.query.tkn;

  try
  {
  const decoded=jwt.verify(token, process.env.JWT_SECRET); 
  
  console.log(decoded)

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
  }
 catch(e)
  {
      req.flash("error_msg","Verification link expired. Try again")
      //signupMail(user,req.hostname,req.protocol)
      res.redirect("/profile")
  }
   req.flash("success_msg", "Successfully verified your account"); 
   res.redirect("/profile");

  }
  
    


module.exports.login_post = async (req, res) => {

  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
  
    const token = user.createUserToken();  
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

module.exports.delete_db = async (req, res) => {
  await User.deleteMany({}); 
  req.flash("error_msg", "Deleted everything");
  res.redirect("/login");
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
