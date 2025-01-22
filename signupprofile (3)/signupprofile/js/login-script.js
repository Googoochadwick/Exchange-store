// /js/login-script.js

import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Login successful:', userCredential.user);
        window.location.href = 'home-index.html'; // Redirect to home page

    } catch (error) {
        console.error("Error logging in: ", error);
        alert('Login failed: ' + error.message);
    }
});
