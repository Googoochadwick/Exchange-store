// /js/profile-script.js

import { auth, db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Listen for authentication state changes
onAuthStateChanged(auth, async user => {
    if (user) {
        try {
            const userDoc = doc(db, "users", user.uid);
            const docSnapshot = await getDoc(userDoc);

            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                document.getElementById('profile-name').textContent = data.name || 'No Name';
                document.getElementById('profile-regNumber').textContent = data.regNumber || 'N/A';
                document.getElementById('profile-mobile').textContent = data.mobile || 'N/A';
                document.getElementById('profile-accommodation').textContent = data.accommodation || 'N/A';
                document.getElementById('profile-email').textContent = data.email || 'N/A';
                document.getElementById('profile-major').textContent = data.major || 'N/A';
                document.getElementById('profile-year').textContent = data.year || 'N/A';
            } else {
                alert('Profile data not found');
                window.location.href = 'login-index.html'; // Redirect if no profile data
            }
        } catch (error) {
            console.error("Error fetching user data: ", error);
            alert('Could not load profile data!');
        }
    } else {
        alert("No user is logged in");
        window.location.href = 'login-index.html'; // Redirect if not logged in
    }
});

document.getElementById('editProfileBtn').addEventListener('click', function() {
    alert('Edit profile functionality would be implemented here.');
});
