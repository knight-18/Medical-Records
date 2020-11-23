const mongoose = require('mongoose')

const diseaseSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    duration: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
    },
    hospitalName: {
        type: String,
    },
    images:[{
        type: String
    }],
    refDoctor: {
        type: String,
    },
})

const Disease = mongoose.model('Disease', diseaseSchema)

module.exports = Disease
