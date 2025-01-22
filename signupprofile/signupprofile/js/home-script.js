// /js/home-script.js

import { db, auth } from './firebase-config.js';
import { doc, setDoc, collection, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

let currentInputType = 'all';

document.getElementById('add-button').addEventListener('click', () => {
    document.getElementById('add-options').classList.toggle('hidden');
});

document.getElementById('add-skill').addEventListener('click', () => setInputSection('skill'));
document.getElementById('add-item').addEventListener('click', () => setInputSection('item'));

function setInputSection(type) {
    document.getElementById('input-section').classList.remove('hidden');
    currentInputType = type;
}

document.getElementById('submit-button').addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) {
        alert("Please log in before submitting data");
        return;
    }

    showLoadingSpinner(); // Show spinner before submission

    const userHeading = document.getElementById('user-heading').value;
    const userDescription = document.getElementById('user-description').value;
    const userImageFile = document.getElementById('user-image').files[0];

    if (userHeading && userDescription) {
        const userId = user.uid;
        const userInputDoc = doc(collection(db, `users/${userId}/inputs`));

        try {
            const inputData = {
                heading: userHeading,
                description: userDescription,
                image: userImageFile ? await readImageFile(userImageFile) : null,
                type: currentInputType,
                timestamp: new Date().toISOString(),
            };

            await setDoc(userInputDoc, inputData);

            alert("Data submitted successfully!");
            renderUserInputs();
        } catch (error) {
            console.error("Error writing document: ", error);
            alert("Error submitting data.");
        } finally {
            hideLoadingSpinner(); // Hide spinner after saving process
        }

        document.getElementById('user-heading').value = '';
        document.getElementById('user-description').value = '';
        document.getElementById('user-image').value = '';
        document.getElementById('input-section').classList.add('hidden');
    }
});

async function readImageFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function showLoadingSpinner() {
    document.getElementById('loading-spinner').classList.remove('hidden');
    document.getElementById('loading-spinner').classList.add('visible');
}

function hideLoadingSpinner() {
    document.getElementById('loading-spinner').classList.remove('visible');
    document.getElementById('loading-spinner').classList.add('hidden');
}

async function renderUserInputs() {
    showLoadingSpinner(); // Show spinner when fetching data
    const user = auth.currentUser;
    if (!user) return;

    const container = document.getElementById('user-input-container');
    container.innerHTML = ''; // Clear existing content

    try {
        const querySnapshot = await getDocs(collection(db, `users/${user.uid}/inputs`));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const inputDiv = document.createElement('div');
            inputDiv.className = `user-input-display ${data.type}`;
            inputDiv.innerHTML = `
                <h4>${data.heading}</h4>
                <p>${data.description}</p>
                ${data.image ? `<img src="${data.image}" alt="User Image" style="width: 150px; height: auto; float: right; margin-left: 10px;">` : ''}
                <button class="chat-button">Chat</button>
                <button class="remove-button" data-doc-id="${doc.id}">Remove</button>
            `;
            inputDiv.querySelector('.remove-button').addEventListener('click', () => removeUserInput(doc.id));
            container.appendChild(inputDiv);
        });
        container.classList.remove('hidden');
    } catch (error) {
        console.error("Error retrieving documents: ", error);
    } finally {
        hideLoadingSpinner(); // Hide spinner after data is loaded
    }
}

async function removeUserInput(docId) {
    const user = auth.currentUser;
    if (!user) return;
    showLoadingSpinner(); // Optional: Show spinner when removing data

    try {
        await deleteDoc(doc(db, `users/${user.uid}/inputs`, docId));
        alert("Input removed successfully!");
        renderUserInputs(); // Refresh the UI
    } catch (error) {
        console.error("Error removing document: ", error);
    } finally {
        hideLoadingSpinner();
    }
}

document.addEventListener('DOMContentLoaded', renderUserInputs);
