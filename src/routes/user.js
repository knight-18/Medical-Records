
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers'); 
const { isLoggedIn } = require('../middleware/auth');
const { requireAuth  } = require('../middleware/auth'); 
router.get("/verify/", authController.emailVerify_get);
router.get("/signup",   isLoggedIn, authController.signup_get); 
router.post("/signup", authController.signup_post ); 
router.get("/login", isLoggedIn,  authController.login_get); 
router.post("/login",authController.login_post ); 
router.get("/logout", requireAuth, authController.logout_get); 
router.get("/profile", requireAuth, authController.profile_get); 
router.get("/delete", authController.delete_db); 
router.get("/email", requireAuth, authController.send_email);

module.exports = router
