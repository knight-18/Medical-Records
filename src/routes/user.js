const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
// const mkdirp=require('mkdirp')
//const upload= require('../controllers/authControllers')

//uploading files with multer
const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userEmail = req.user.email
        const dir = `./uploads/${userEmail}/`
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }, (err) => {
                if (err) console.log('error')
            })
        }
        cb(null, dir)
    },
    filename: (req, file, cb) => {
        const userId = req.user._id
        cb(null, `File-${Date.now()}.png`)
    },
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    },
})

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|pdf/
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    )
    const mimetype = filetypes.test(file.mimetype)
    if (mimetype && extname) {
        return cb(null, true)
    } else {
        cb('Error')
    }
}

//uploading finishes
const authController = require('../controllers/authControllers')
const { requireAuth, redirectIfLoggedIn } = require('../middleware/auth')
router.get('/verify/:id', authController.emailVerify_get)
router.get('/signup',redirectIfLoggedIn, authController.signup_get)
router.post('/signup', authController.signup_post)
router.get('/login', redirectIfLoggedIn, authController.login_get)
router.post('/login', authController.login_post)
router.get('/logout', requireAuth, authController.logout_get)
router.get('/profile', requireAuth, authController.profile_get)
// router.get('/user/upload',requireAuth,authController.upload_get)
router.post(
    '/user/upload',
    requireAuth,
    upload.single('upload'),
    authController.upload_post
)

module.exports = router