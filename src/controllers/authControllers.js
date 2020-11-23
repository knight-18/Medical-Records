const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { signupMail } = require('../config/nodemailer')
const path = require('path')
const Disease = require('../models/Disease')

require('dotenv').config()

const maxAge = 30 * 24 * 60 * 60

const handleErrors = (err) => {
    let errors = { email: '', password: '' }

    // validation errors
    if (err.message.includes('validation failed')) {
        // console.log(err);
        Object.values(err.errors).forEach(({ properties }) => {
            // console.log(val);
            // console.log(properties);
            errors[properties.path] = properties.message
        })
    }

    return errors
}

// controller actions
module.exports.signup_get = (req, res) => {
    res.render('signup')
}

module.exports.login_get = (req, res) => {
    res.render('login')
}

module.exports.signup_post = async (req, res) => {
    const { name, email, password, confirmPwd, phoneNumber } = req.body
    //console.log("in sign up route",req.body);
    if (password != confirmPwd) {
        req.flash('error_msg', 'Passwords do not match. Try again')
        res.status(400).redirect('/user/login')
        return
    }

    try {
        const userExists = await User.findOne({ email })
        //console.log('userexists', userExists)
        /*if(userExists && userExists.active== false)
    {
      req.flash("success_msg",`${userExists.name}, we have sent you a link to verify your account kindly check your mail`)

      signupMail(userExists,req.hostname,req.protocol)
      return res.redirect("/signup")
    }*/
        if (userExists) {
            req.flash(
                'success_msg',
                'This email is already registered. Try logging in'
            )
            return res.redirect('/user/login')
        }

        const user = new User({ email, name, password, phoneNumber })
        let saveUser = await user.save()
        //console.log(saveUser);
        req.flash(
            'success_msg',
            'Registration successful. Check your inbox to verify your email'
        )
        signupMail(saveUser, req.hostname, req.protocol)
        //res.send(saveUser)
        res.redirect('/user/login')
    } catch (err) {
        const errors = handleErrors(err)
        console.log(errors)
        //res.json(errors);
        req.flash(
            'error_msg',
            'Could not signup.' +
                ' ' +
                errors['email'] +
                ' ' +
                errors['password'] +
                ' ' +
                errors['phoneNumber']
        )
        res.status(400).redirect('/user/signup')
    }
}
module.exports.emailVerify_get = async (req, res) => {
    try {
        const userID = req.params.id
        const expiredTokenUser = await User.findOne({ _id: userID })
        const token = req.query.tkn
        //console.log(token)
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                req.flash(
                    'error_msg',
                    ' Your verify link had expired. We have sent you another verification link'
                )
                signupMail(expiredTokenUser, req.hostname, req.protocol)
                return res.redirect('/login')
            }
            const user = await User.findOne({ _id: decoded.id })
            if (!user) {
                //console.log('user not found')
                res.redirect('/')
            } else {
                const activeUser = await User.findByIdAndUpdate(user._id, {
                    active: true,
                })
                if (!activeUser) {
                    // console.log('Error occured while verifying')
                    req.flash('error_msg', 'Error occured while verifying')
                    res.redirect('/')
                } else {
                    req.flash(
                        'success_msg',
                        'User has been verified and can login now'
                    )
                    //console.log('The user has been verified.')
                    //console.log('active', activeUser)
                    res.redirect('/user/login')
                }
            }
        })
    } catch (e) {
        console.log(e)
        //signupMail(user,req.hostname,req.protocol)
        res.redirect('/user/login')
    }
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.login(email, password)
        if (!user.active) {
            req.flash(
                'error_msg',
                `${user.name}, You have not verified your account please check your mail to get the verify link`
            )
            signupMail(user, req.hostname, req.protocol)
            res.redirect('/login')
            return
        }
        const token = user.generateAuthToken(maxAge)

        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        //console.log(user);
        //signupMail(saveUser)
        req.flash('success_msg', 'Successfully logged in')
        res.status(200).redirect('/user/profile')
    } catch (err) {
        req.flash('error_msg', 'Invalid Credentials')
        //console.log(err)
        res.redirect('/user/login')
    }
}

module.exports.upload_post = async (req, res) => {
    try {
        let { name, duration, refDoctor, hospitalName, description } = req.body
        const files = req.files
        let images = files.map((file) => {
            return `/uploads/${req.user.email}/${file.filename}`
        })
        let newDisease = await new Disease({
            name,
            images,
            duration,
            refDoctor,
            hospitalName,
            description,
        }).save()
        if (!newDisease) {
            req.flash('error_msg', 'Unable to save the disease details')
            return res.redirect('/user/profile')
        }
        req.user.disease.push(newDisease)
        await req.user.save()

        console.log(newDisease)
        req.flash('success_msg', 'Sucessfully uploaded disease details.')
        return res.redirect('/user/profile')
    } catch (err) {
        console.error(err)
        req.flash('error_msg', 'Something went wrong')
        return res.redirect('/user/profile')
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
    res.redirect('/user/login')
}

// module.exports.upload_get =async (req, res) => {
//   res.render("multer")
// }
