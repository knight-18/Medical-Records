const Hospital = require('../models/Hospital'); 
const User=require('../models/User')
const Relations=require('../models/Relations')


const jwt = require('jsonwebtoken')
const { hospitalSignupMail,relationMail } = require('../config/nodemailer')
const path = require('path')

const { handleErrors } = require('../utilities/Utilities'); 
require('dotenv').config()

const maxAge = 30 * 24 * 60 * 60


module.exports.signup_get = (req, res) => {
    res.render("./hospitalViews/signup")

}

module.exports.profile_get = async (req, res) => {
    res.render("./hospitalViews/profile")
}


module.exports.emailVerify_get = async (req, res) => {
    try {
        const userID = req.params.id
        const expiredTokenUser = await Hospital.findOne({ _id: userID })
        const token = req.query.tkn
        //console.log(token)
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                req.flash(
                    'error_msg',
                    ' Your verify link had expired. We have sent you another verification link'
                )
                hospitalSignupMail(expiredTokenUser, req.hostname, req.protocol)
                return res.redirect('/hospital/login')
            }
            const user = await Hospital.findOne({ _id: decoded.id })
            if (!user) {
                //console.log('user not found')
                res.redirect('/hospital/login')
            } else {
                const activeUser = await Hospital.findByIdAndUpdate(user._id, {
                    active: true,
                })
                if (!activeUser) {
                    // console.log('Error occured while verifying')
                    req.flash('error_msg', 'Error occured while verifying')
                    res.redirect('/hospital/login')
                } else {
                    req.flash(
                        'success_msg',
                        'User has been verified and can login now'
                    )
                    //console.log('The user has been verified.')
                    //console.log('active', activeUser)
                    res.redirect('/hospital/login')
                }
            }
        })
    } catch (e) {
        console.log(e)
        //signupMail(user,req.hostname,req.protocol)
        res.redirect('/hospital/login')
    }
}

module.exports.signup_post = async (req, res) => {
    const { licenseNumber,  hospitalName, email, phoneNumber,password, confirmPwd  } = req.body
    //console.log("in sign up route",req.body);
    if (!(!password || !confirmPwd) && (password != confirmPwd)) {
        req.flash('error_msg', 'Passwords do not match. Try again')
        res.status(400).redirect('/hospital/login')
        return;
    }

    try {
        const hospitalExists = await Hospital.findOne({ email })
        //console.log('userexists', userExists)
        /*if(userExists && userExists.active== false)
    {
      req.flash("success_msg",`${userExists.name}, we have sent you a link to verify your account kindly check your mail`)

      signupMail(userExists,req.hostname,req.protocol)
      return res.redirect("/signup")
    }*/
        if (hospitalExists) {
            req.flash(
                'success_msg',
                'This email is already registered. Try logging in'
            )
            return res.redirect('/hospital/login')
        }

        const hospital = new Hospital({ licenseNumber,  hospitalName, email, phoneNumber,password  })
        let saveUser = await hospital.save()
        //console.log(saveUser);
        req.flash(
            'success_msg',
            'Registration successful. Check your inbox to verify your email'
        )
        hospitalSignupMail(saveUser, req.hostname, req.protocol)
        //res.send(saveUser)
        res.redirect('/hospital/login')
    } catch (err) {
        const errors = handleErrors(err)
        console.log(errors)

        var message = 'Could not signup. '.concat((errors['email'] || ""), (errors['password'] || ""), (errors['phoneNumber'] || ""), (errors["licenseNumber"] || ""),  (errors["hospitalName"] || ""),)
        //res.json(errors);
        req.flash(
            'error_msg',
            message
        )
        res.status(400).redirect('/hospital/signup')
    }
}
module.exports.login_get = (req, res) => {
    res.render("./hospitalViews/login")
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body
    // console.log('in Login route')
    // console.log('req.body',req.body)
    try {

        const hospital = await Hospital.login(email, password)

        const userExists = await Hospital.findOne({ email })
        

        if (!userExists.active) {
            const currDate = new Date();
            const initialUpdatedAt = userExists.updatedAt;
            const timeDiff = Math.abs(currDate.getTime() - initialUpdatedAt.getTime());
            if(timeDiff<=10800000)
            {
                console.log("Email already sent check it")
                req.flash(
                    'error_msg',
                    `${userExists.hospitalName}, we have already sent you a verify link please check your email`)
                res.redirect('/hospital/login')
                return
            }
            req.flash(
                'success_msg',
                `${userExists.hospitalName}, your verify link has expired we have sent you another email please check you mailbox`
            )
            hospitalSignupMail(userExists, req.hostname, req.protocol)
            await Hospital.findByIdAndUpdate(userExists._id, { updatedAt: new Date() });
            //console.log('userExists',userExists)
            res.redirect('/hospital/login')
            return
        }
       
        const token = hospital.generateAuthToken(maxAge)

        res.cookie('hospital', token, { httpOnly: true, maxAge: maxAge * 1000 })
        //console.log(user);
        //signupMail(saveUser)
        req.flash('success_msg', 'Successfully logged in')
        res.status(200).redirect('/hospital/profile')
    } catch (err) {
        req.flash('error_msg', 'Invalid Credentials')
        //console.log(err)
        res.redirect('/hospital/login')
    }
}


module.exports.logout_get = async (req, res) => {
    
    res.clearCookie('hospital')
    req.flash('success_msg', 'Successfully logged out')
    res.redirect('/hospital/login')
}

module.exports.relation_post=async (req,res)=>{
    
    try{
    const{email}=req.body
    const user=await User.findOne({email})
    if(!user)
    {
        console.log('user not found')
        return
    }
    //console.log('user',user)
    const hospitalId=req.hospital._id
    const userId=user._id

    const existRelation=await Relations.findOne({userId,hospitalId})
    console.log('existRelation',existRelation)
    if(existRelation) 
    {
        console.log('relation already exists')
        if(existRelation.isPermitted)
        {
            console.log('show your documents',existRelation)
            res.redirect('/hospital/profile')
        }
        else{
            console.log('the user has not given access')
            res.redirect('/hospital/profile')
            //relationMail(existRelation,user,req.hostname,req.protocol)
        }
    }
    else{
    //console.log('hospital',hospital)
    let relation = await new Relations({
        hospitalId,
        userId
    }).save()
    if(!relation)
    {
        console.log('unable to create link')
        return res.redirect('hospital/profile')
    }
    relationMail(relation,user,req.hostname,req.protocol)
    req.flash('succes_msg','Wait till the user gives access to view their document. A mail has been sent to them')
    return res.redirect('hospital/profile')
    //console.log('relation',relation)

    }
    }
    catch(e)
    {
        console.log(e)
    }

}

module.exports.relationVerify_get = async (req, res) => {
    try {
        const relationID = req.params.id
        console.log('relation',relationID)
        const expiredTokenUser = await Relations.findOne({ _id: relationID })
        const token = req.query.tkn
        //console.log(token)
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                req.flash(
                    'error_msg',
                    ' Your verify link had expired. We have sent you another verification link'
                )
                relationMail(expiredTokenUser, req.hostname, req.protocol)
                return res.redirect('/user/profile')
            }
            const relation = await Relations.findOne({ _id: decoded.id })
            if (!relation) {
                //console.log('user not found')
                res.redirect('/user/profile')
            } else {
                const activeRelation = await Relations.findByIdAndUpdate(relation._id, {
                    isPermitted: true,
                })
                if (!activeRelation) {
                    // console.log('Error occured while verifying')
                    req.flash('error_msg', 'Error occured while verifying')
                    res.redirect('/user/profile')
                } else {
                    req.flash(
                        'success_msg',
                        'User has given you the permission to view their doccuments'
                    )
                    //console.log('The user has been verified.')
                    //console.log('active', activeUser)
                    res.redirect('/hospital/profile')
                }
            }
        })
    } catch (e) {
        console.log(e)
        //signupMail(user,req.hostname,req.protocol)
        res.redirect('/hospital/profile')
    }
}