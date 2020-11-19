const express = require('express')
const router = express.Router()
const userRoutes = require("./user.js")
router.use(userRoutes)
//Route for homepage
router.get('/', (req, res) => {
    res.render('index')
});


module.exports = router
