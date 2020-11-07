const express = require('express')
const router = express.Router()
const fs= require('fs')
const path=require('path')
const mkdirp=require('mkdirp')
//const upload= require('../controllers/authControllers')

//uploading files with multer
const multer = require('multer')
const storage = multer.diskStorage({
destination: (req, file, cb) => {
  const  userId = req.user._id
  const dir =`./uploads/${userId}/`
  if(!fs.existsSync(dir))
  {
      fs.mkdirSync(dir,{recursive:true},(err)=>{
          if(err) console.log("error")
      })
  }
  cb(null,dir)
},
filename: (req, file, cb) => {
    const  userId = req.user._id
  cb(null, `UserId-${userId}-File-${Date.now()}.png`)
}
})

const upload = multer({ storage })

//uploading finishes
const authController = require('../controllers/authControllers')
const requireAuth = require('../middleware/auth')
router.get('/verify/:id', authController.emailVerify_get)
router.get('/signup', authController.signup_get)
router.post('/signup', authController.signup_post)
router.get('/login', authController.login_get)
router.post('/login', authController.login_post)
router.get('/logout', requireAuth, authController.logout_get)
router.get('/profile', requireAuth, authController.profile_get)
router.post('/user/upload',requireAuth,upload.single('upload'),authController.upload_post)

module.exports = router
