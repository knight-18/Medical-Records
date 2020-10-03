const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req,res,next)=>{
try {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({
        _id:decoded._id
    });
    if(!user){
        res.redirect('/login')
    }
    req.token = token;//token
    req.user = user;
}catch(e){
    res.status(401).send({error: 'Please authenticate.'});
}
};
module.exports = auth;//auth to be exported