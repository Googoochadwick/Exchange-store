const signUpButton=document.getElementById('signUpButton');
const signInButton=document.getElementById('signInButton');
const signInForm=document.getElementById('signIn');
const signUpForm=document.getElementById('signup');

const mobileInput = document.getElementById('mnum');
const regInput = document.getElementById('reg');


mobileInput.addEventListener('input', function () {
    
    mobileInput.value = mobileInput.value.replace(/\D/g, '').slice(0, 10);
});


regInput.addEventListener('input', function () {
    if (regInput.value.length > 15) {
        regInput.value = regInput.value.slice(0, 15); 
    }
});


signUpButton.addEventListener('click',function(){
    signInForm.style.display="none";
    signUpForm.style.display="block";
})
signInButton.addEventListener('click', function(){
    signInForm.style.display="block";
    signUpForm.style.display="none";
})