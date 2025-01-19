document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Here you would typically send the login data to a server for authentication
    console.log('Login attempt:', { username, password });
    
    // For demo purposes, let's just log a success message
    alert('Login successful!');
});