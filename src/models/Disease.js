const mongoose = require('mongoose')
const User = require('../models/User')


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
    owner:{
        type: mongoose.Schema.Types.ObjectId ,
        ref:'User'
    },
    refDoctor: {
        type: String,
    }
})

/*diseaseSchema.virtual('owner',{
    ref:'User',
    localField:'_id',
    foreignField:'disease'
})*/

const Disease = mongoose.model('Disease', diseaseSchema)

module.exports = Disease
