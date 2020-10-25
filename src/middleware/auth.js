
const jwt = require('jsonwebtoken')
const User = require('../models/User')


require('dotenv').config();

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  //console.log(token);
  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        
        res.redirect('/login');
      } else {
        let user = await User.findById(decodedToken.id);
        req.user = user;
        req.token=token 
        
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};



module.exports =  requireAuth ;

