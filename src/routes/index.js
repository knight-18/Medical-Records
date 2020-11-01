const express = require('express')
const router = express.Router()

//Route for homepage
router.get('/', async (req, res) => {
    res.render('index')
})

const userRoutes = require("./user.js"); 
router.use(userRoutes); 

module.exports = router
