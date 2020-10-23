const validator = require('validator');




const passwordStrength = (value) => 
{
    var strength=0
    if(value.match(/[a-z]+/)){
        strength+=1;
    }
    if(value.match(/[A-Z]+/)){
        strength+=1;
    }
    if(value.match(/[0-9]+/)){

    strength+=1;
    }
    if(value.match(/[#$&!@]+/)){
        strength+=1;
    }
    return strength; 
}; 



module.exports = {
    checkPasswordStrength : passwordStrength, 
}; 