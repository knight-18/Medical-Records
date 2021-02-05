const express = require('express')
const router = express.Router()


const { requireAuth, redirectIfLoggedIn } = require("../middleware/hospitalAuth")


const hospitalController = require('../controllers/hospitalController')


router.get('/signup',redirectIfLoggedIn, hospitalController.signup_get)
router.post('/signup', hospitalController.signup_post)
router.get('/relation/:shortId',requireAuth,hospitalController.relation_post)
router.get('/login', redirectIfLoggedIn, hospitalController.login_get)
router.get('/verify/:id', hospitalController.emailVerify_get)
router.get('/logout', requireAuth, hospitalController.logout_get)
router.post('/search', requireAuth, hospitalController.patient_search)
router.post('/login', hospitalController.login_post)
router.get('/verifyRelation/:id',hospitalController.relationVerify_get)

router.get('/profile', requireAuth, hospitalController.profile_get)

router.get('/patient',requireAuth,hospitalController.patient_get)

module.exports = router