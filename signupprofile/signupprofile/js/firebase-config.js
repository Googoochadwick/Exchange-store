// /js/firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyDjiScKP5HN6t69spV6rYjoGsg31_kXRdc",
  authDomain: "database-a26f8.firebaseapp.com",
  databaseURL: "https://database-a26f8-default-rtdb.firebaseio.com",
  projectId: "database-a26f8",
  storageBucket: "database-a26f8.appspot.com",
  messagingSenderId: "942665096312",
  appId: "1:942665096312:web:500bba3c41b6dee579e18d",
  measurementId: "G-6MYG5JGTS4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db };
