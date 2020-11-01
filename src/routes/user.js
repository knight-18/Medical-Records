const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers'); 
const { isLoggedIn } = require('../middleware/auth');
const { requireAuth  } = require('../middleware/auth'); 
router.get("/verify/:id",authController.emailVerify_get);
router.get("/signup", isLoggedIn,  authController.signup_get); 
router.post("/signup", authController.signup_post ); 
router.get("/login", isLoggedIn, authController.login_get); 
router.post("/login",authController.login_post ); 
router.get("/logout", authController.logout_get); 
router.get("/profile", requireAuth, authController.profile_get); 


module.exports = router; 