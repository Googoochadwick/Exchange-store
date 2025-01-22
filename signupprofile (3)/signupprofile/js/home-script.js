import { auth, db } from './firebase-config.js';
import { doc, setDoc, collection, getDocs, onSnapshot, updateDoc, arrayUnion, getDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

let currentInputType = 'all';

document.addEventListener('DOMContentLoaded', () => {
    // Fetch all user inputs on DOM load
    fetchAllUserInputs();

    // Setup functions and event listeners
    document.getElementById('search-button').addEventListener('click', filterInputs);
    document.getElementById('add-button').addEventListener('click', () => {
        document.getElementById('add-options').classList.toggle('hidden');
    });

    // Define navigation actions for adding skills or items
    document.getElementById('add-skill').addEventListener('click', () => setInputSection('skill'));
    document.getElementById('add-item').addEventListener('click', () => setInputSection('item'));

    // Setup category filters
    document.querySelectorAll('.category-button').forEach(button => {
        button.addEventListener('click', event => {
            currentInputType = event.target.dataset.category;
            filterInputs();
        });
    });

    // Assign close function to modal close button
    const closeBtn = document.querySelector('.modal .close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.getElementById('chat-modal').style.display = 'none';
            document.getElementById('chat-messages').innerHTML = ''; // Clear the chat when closing
        });
    }
});

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

    const userHeading = document.getElementById('user-heading').value.trim();
    const userDescription = document.getElementById('user-description').value.trim();
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
            fetchAllUserInputs();
        } catch (error) {
            console.error("Error writing document: ", error);
            alert("Error submitting data.");
        }
    }

    document.getElementById('user-heading').value = '';
    document.getElementById('user-description').value = '';
    document.getElementById('user-image').value = '';
    document.getElementById('input-section').classList.add('hidden');
});

async function readImageFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function fetchAllUserInputs() {
    const listingContainer = document.getElementById('listing-container');
    listingContainer.innerHTML = '';

    try {
        const usersSnapshot = await getDocs(collection(db, 'users'));

        for (const userDoc of usersSnapshot.docs) {
            const userId = userDoc.id;
            const userData = userDoc.data();
            const userName = userData.name || 'Unknown User';

            const inputsSnapshot = await getDocs(collection(db, `users/${userId}/inputs`));
            inputsSnapshot.forEach((inputDoc) => {
                const inputData = inputDoc.data();
                const inputDiv = document.createElement('div');
                inputDiv.className = 'user-input-display';
                inputDiv.dataset.type = inputData.type;
                inputDiv.innerHTML = `
                    <h4>${userName}: ${inputData.heading}</h4>
                    <p>${inputData.description}</p>
                    ${inputData.image ? `<img src="${inputData.image}" alt="User Image" style="width: 150px; height: auto; float: right; margin-left: 10px;">` : ''}
                    <button class="chat-button" data-user-id="${userId}">Chat</button>
                `;
                listingContainer.appendChild(inputDiv);
            });
        }

        filterInputs(); // Apply initial filter
        initializeChatButtons();
    } catch (error) {
        console.error("Error fetching user inputs: ", error);
    }
}

function initializeChatButtons() {
    const chatButtons = document.querySelectorAll('.chat-button');
    chatButtons.forEach(button => {
        button.addEventListener('click', () => openChat(button.getAttribute('data-user-id')));
    });
}

async function openChat(otherUserId) {
    const currentUser = auth.currentUser;
    if (!currentUser) return alert('You must be logged in to chat');

    const chatModal = document.getElementById('chat-modal');
    chatModal.style.display = 'block';

    const chatId = [currentUser.uid, otherUserId].sort().join('_');
    const chatRef = doc(db, 'chats', chatId);

    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.innerHTML = '';

    onSnapshot(chatRef, (chatDoc) => {
        if (chatDoc.exists()) {
            const chatData = chatDoc.data();
            messagesContainer.innerHTML = chatData.messages.map(msg => 
                `<p><strong>${msg.senderName}:</strong> ${msg.text}</p>`
            ).join('');
        } else {
            // Initialize chat document if it doesn't exist
            setDoc(chatRef, { messages: [] });
        }
    });

    document.getElementById('send-message').onclick = async () => {
        const messageInput = document.getElementById('chat-input');
        const messageText = messageInput.value.trim();
        if (messageText) {
            const currentUserData = await getDoc(doc(db, 'users', currentUser.uid));
            const currentUserName = currentUserData.exists() ? currentUserData.data().name : 'Unknown User';

            const message = {
                text: messageText,
                senderId: currentUser.uid,
                senderName: currentUserName,
                timestamp: new Date().toISOString(),
            };

            try {
                await updateDoc(chatRef, {
                    messages: arrayUnion(message)
                });
                messageInput.value = ''; // Clear the input after sending
            } catch (error) {
                console.error('Error sending message: ', error);
            }
        }
    };
}

function filterInputs() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const userInputs = document.querySelectorAll('.user-input-display');

    userInputs.forEach(input => {
        const heading = input.querySelector('h4').textContent.toLowerCase();
        const description = input.querySelector('p').textContent.toLowerCase();
        const type = input.dataset.type;

        const matchesSearch = heading.includes(query) || description.includes(query);
        const matchesType = currentInputType === 'all' || type === currentInputType;

        if (matchesSearch && matchesType) {
            input.style.display = 'block';
        } else {
            input.style.display = 'none';
        }
    });
}
