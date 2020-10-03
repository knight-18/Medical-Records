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
submit.addEventListener('click', function(){
    const passwordVal=password.value;
    const confirmPasswordVal=confirmPassword.value;
    if (passwordVal != confirmPasswordVal) {
        alert("Passwords do not match.");
        return false;
    }
    return true;
})
