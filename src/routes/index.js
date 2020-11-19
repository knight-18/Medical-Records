const express = require('express')
const router = express.Router()

//Route for homepage
router.get('/', (req, res) => {
    res.render('index')
});

module.exports = router
