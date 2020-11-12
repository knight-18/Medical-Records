const strengthMeter = document.getElementById('strength-meter');
const passwordInput = document.getElementById('password-input');
const reasonsContainer = document.getElementById('reasons');
const reasons = document.getElementsByClassName('reasons');
const passwordRate = document.getElementsByClassName('password-rate')
const terms = document.getElementById("terms")

const confirmpassword = document.getElementById('confirmPwd');

passwordInput.addEventListener('input',updateStrengthMeter);
function updateStrengthMeter(){
    const weaknesses = calculateStrength(passwordInput.value);
    reasonsContainer.style.display = 'none';
    let strength = 100;
	reasonsContainer.innerHTML = '';
	weaknesses.forEach(weakness =>{
		if(weakness == null) return 
		strength -= weakness.deduction;
	});
    strength += -5;
    backgroundSetter(strength)
	strengthMeter.style.setProperty('--strength',strength);
	reasonsContainer.innerHTML = '';

}
confirmpassword.addEventListener('click', () => {
    const weaknesses = calculateStrength(passwordInput.value);
	weaknesses.forEach(weakness =>{
        if(weakness!= null){
                if(weakness.message!= null){
                    reasonsContainer.style.display = 'block'
                    const messageElement = document.createElement('div');
                    messageElement.innerHTML = weakness.message;
                    reasonsContainer.appendChild(messageElement);
                }
            }
        })
    })
function backgroundSetter(strength){
    if(strength < 33){
        document.body.style.setProperty('--newBackground', 'red');
        passwordRate[0].innerHTML = 'Your Password is too weak!'
    }
    else if(strength >= 33 && strength < 69 ){
        document.body.style.setProperty('--newBackground', '#FFC107');
        passwordRate[0].innerHTML = 'Not bad, but you know you can do better!'

    }
    else{
        document.body.style.setProperty('--newBackground', 'green');
        passwordRate[0].innerHTML = 'Good to go!'
    }
}
function calculateStrength(password){
	const weaknesses = []
	weaknesses.push(lengthWeaknesses(password));
	weaknesses.push(lowerCaseWeakness(password));
	weaknesses.push(UpperCaseWeakness(password));
	weaknesses.push(NumberWeakness(password));
	weaknesses.push(SpecialWeakness(password));
	weaknesses.push(RepeatWeakness(password));
	weaknesses.push(emptyPassword(password));
	return weaknesses;
}
function emptyPassword(password){
	if(password == ""){
		return{
			message: 'Password cannot be empty',
			deduction: null
		}
	}
}

function lengthWeaknesses(password){
	const length = password.length;
	if(length <= 5){
		return {
			message:'Your password is too short',
			deduction:40
		}
	}
	if(length <= 10){
		return{
            message:null,
			deduction:30
		}
	}
}

function lowerCaseWeakness(password){
	return characterTypeWeakness(password,/[a-z]/g,'Lowercase characters')
}
function UpperCaseWeakness(password){
	return characterTypeWeakness(password,/[A-Z]/g,'Uppercase characters')
}
function NumberWeakness(password){
	return characterTypeWeakness(password,/[0-9]/g,'Numbers')
}
function SpecialWeakness(password){
	return characterTypeWeakness(password,/[^0-9a-zA-Z\s]/g,'Special characters')
}
function characterTypeWeakness(password,regex,type){
	const matches = password.match(regex) || [];
	if(matches.length === 0){
		return{
			message: `Your password has no ${type}`,
			deduction: 20
		}
	}
}

function RepeatWeakness(password){
	const matches = password.match(/(.)\1/g) || [];
	if(matches.length > 0){
		return{
            // message: `Your password has repeated character`,
            message: null,

			deduction: matches.length * 10
		}
	}
}
function samePassword(password, confirmPassword){
	if(password!= confirmPassword){
		return{
			message: `Your passwords do not match`
		}
	}
}
function checkTerms(value){
	if(value == true){
		return null
	}
	else{
		return{
			message: `Please agree to the terms and conditions`
		}
	}
} 
const register = document.getElementsByClassName("register")[0]
register.addEventListener("click", (e) => {
	weaknesses = []
	weaknesses.push(samePassword(passwordInput.value, confirmpassword.value))
	weaknesses.push(checkTerms(terms.checked))
	weaknesses.push(emptyPassword(passwordInput.value))
	weaknesses.forEach(weakness =>{
        if(weakness!= null){
                if(weakness.message!= null){
                    reasonsContainer.style.display = 'block'
                    const messageElement = document.createElement('div');
                    messageElement.innerHTML = weakness.message;
                    reasonsContainer.appendChild(messageElement);
                }
            }
		})
	if(weaknesses.length ==0){
		document.forms['signUpform'].submit();

	}
	else{
		e.preventDefault();
		e.stopPropagation();
		confirmpassword.addEventListener('input', () => {
			reasonsContainer.style.display = 'none';
		})

	}
})
