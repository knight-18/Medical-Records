const togglePassword = document.querySelector('#togglePassword');
const password = document.querySelector('#password');
const confirmPassword= document.querySelector('#confirmPassword');
const submit = document.querySelector('#submit');
togglePassword.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    // toggle the eye slash icon
    this.classList.toggle('fa-eye-slash');
});
submit.addEventListener('click', function(e){
    const passwordVal=password.value;
    const confirmPasswordVal=confirmPassword.value;
    if (passwordVal != confirmPasswordVal) {
      e.preventDefault();
        alert("Passwords do not match.");
        confirmPassword.value="";
        confirmPassword.focus();
        return false;
    }
    return true;
});
const loginHere = document.getElementsByClassName("login-link")
const signupForm = document.getElementsByClassName("signup-form")
const signupHere = document.getElementsByClassName("signup-link")
const loginForm = document.getElementsByClassName("login-form")
loginHere[0].addEventListener('click', () => {
    signupForm[0].style.animation = "down 1.01s linear";
    loginForm[0].style.animation = "left 0.5s linear";

    setTimeout(function(){
        signupForm[0].style.display = "none";
        loginForm[0].style.display = "block"
        signupForm[0].style.animation = " ";
        loginForm[0].style.animation = " ";


}, 1000);
});

signupHere[0].addEventListener('click', () => {
    loginForm[0].style.animation = "right 1.01s linear";
    signupForm[0].style.animation = "up 0.5s linear";


    setTimeout(function(){
        loginForm[0].style.display = "none";
        signupForm[0].style.display = "block"
        logiForm[0].style.animation = " ";
        signupForm[0].style.animation = " ";

}, 800);
});
