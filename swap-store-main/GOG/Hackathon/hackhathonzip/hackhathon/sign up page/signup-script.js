document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');
    
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const regNumber = document.getElementById('reg-number').value;
        const mobile = document.getElementById('mobile').value;
        const accommodation = document.getElementById('accommodation').value;
        const email = document.getElementById('email').value;
        const major = document.getElementById('major').value;
        const year = document.getElementById('year').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Basic validation
        if (password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        
        // Here you would typically send the data to a server for processing
        console.log('Sign up data:', { name, regNumber, mobile, accommodation, email, major, year, password });
        
        // For demo purposes, let's just log a success message
        alert('Sign up successful!');
        
        // Clear the form
        signupForm.reset();
    });
});


