
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers'); 
const requireAuth = require('../middleware/auth'); 
router.get("/verify/:id",authController.emailVerify_get);
router.get("/signup", authController.signup_get); 
router.post("/signup", authController.signup_post ); 
router.get("/login", authController.login_get); 
router.post("/login",authController.login_post ); 
router.get("/logout",requireAuth, authController.logout_get); 
router.get("/profile", requireAuth, authController.profile_get); 


module.exports = router; 


