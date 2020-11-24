const validator = require('validator')

const passwordStrength = (value) => {
    var strength = 0
    if (value.match(/[a-z]+/)) {
        strength += 1
    }
    if (value.match(/[A-Z]+/)) {
        strength += 1
    }
    if (value.match(/[0-9]+/)) {
        strength += 1
    }
    if (value.match(/[#$&!@]+/)) {
        strength += 1
    }
    return strength
}



const phoneValidator = (value) => 
{
    var regx = /^[6-9]\d{9}$/; 
    return regx.test(value)
    
}
module.exports = {
    checkPasswordStrength: passwordStrength,
    phoneValidator : phoneValidator, 
}
