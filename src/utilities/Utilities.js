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


const handleErrors = (err) => {
    let errors = { email: "", password: "" }

    // validation errors
    if (err.message.includes('validation failed')) {
        // console.log(err);
        Object.values(err.errors).forEach(({ properties }) => {
            // console.log(val);
            // console.log(properties);
            errors[properties.path] = properties.message.concat('. '); 
        })
    }

    return errors
}

module.exports = {
    checkPasswordStrength: passwordStrength,
    phoneValidator : phoneValidator, 
    handleErrors:handleErrors, 
}
