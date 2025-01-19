// scripts.js

// Function to redirect to the login page
function openLoginPage() {
    // Replace 'login.html' with the actual URL you want to open
    window.location.href = '/Templates/LoginPage.html';
}

// Add event listener to the LoginBtn once the document is fully loaded
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('LoginBtn').addEventListener('click', openLoginPage);
});