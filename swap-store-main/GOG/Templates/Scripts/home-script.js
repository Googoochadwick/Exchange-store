let currentInputType = 'all';

document.getElementById('add-button').addEventListener('click', () => {
    document.getElementById('add-options').classList.toggle('hidden');
});

document.getElementById('add-skill').addEventListener('click', () => setInputSection('skill'));
document.getElementById('add-item').addEventListener('click', () => setInputSection('item'));

document.getElementById('community-button').addEventListener('click', () => {
    window.location.href = '/GOG/Community/community-page.html'; // Change to your community page URL
});

function setInputSection(type) {
    document.getElementById('input-section').classList.remove('hidden');
    currentInputType = type;
}

document.getElementById('submit-button').addEventListener('click', () => {
    const userHeading = document.getElementById('user-heading').value;
    const userDescription = document.getElementById('user-description').value;
    const userImage = document.getElementById('user-image').files[0];
    const fullName = "User"; // Placeholder for the user's full name

    if (userHeading && userDescription) {
        const displayDiv = document.createElement('div');
        displayDiv.className = `user-input-display ${currentInputType}`;
        displayDiv.dataset.heading = userHeading.toLowerCase(); // For case-insensitive search

        if (userImage) {
            const reader = new FileReader();
            reader.onload = function (e) {
                displayDiv.innerHTML = `
                    <a href="user-index.php" class="user-profile-link"><h4>${fullName}</h4></a>
                    <h4>${userHeading}</h4>
                    <p>${userDescription}</p>
                    <img src="${e.target.result}" alt="User Image" style="width: 150px; height: auto; float: right; margin-left: 10px;">
                    <button class="chat-button">Chat</button>
                    <button class="remove-button">Remove</button>
                `;
                appendInputDisplay(displayDiv, fullName);
            };
            reader.readAsDataURL(userImage);
        } else {
            displayDiv.innerHTML = `
                <a href="user-index.php" class="user-profile-link"><h4>${fullName}</h4></a>
                <h4>${userHeading}</h4>
                <p>${userDescription}</p>
                <button class="chat-button">Chat</button>
                <button class="remove-button">Remove</button>
            `;
            appendInputDisplay(displayDiv, fullName);
        }

        document.getElementById('user-heading').value = '';
        document.getElementById('user-description').value = '';
        document.getElementById('user-image').value = '';
        document.getElementById('input-section').classList.add('hidden');
    }
});

function appendInputDisplay(displayDiv, fullName) {
    document.getElementById('user-input-container').appendChild(displayDiv);
    document.getElementById('user-input-container').classList.remove('hidden');

    displayDiv.querySelector('.chat-button').addEventListener('click', () => openChatModal(fullName));
    
    displayDiv.querySelector('.remove-button').addEventListener('click', () => {
        removeUserInput(displayDiv);
        // Add your database removal code here, e.g., an AJAX request
    });
}

function removeUserInput(displayDiv) {
    displayDiv.remove();
    // Implement your AJAX call here to remove from the database.
    // Example: Remove from database using an ID associated with this block
}

document.querySelectorAll('.category-button').forEach(button => {
    button.addEventListener('click', () => {
        const category = button.dataset.category;

        document.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        document.querySelectorAll('.user-input-display').forEach(display => {
            if (category === 'all' || display.classList.contains(category)) {
                display.style.display = 'block';
            } else {
                display.style.display = 'none';
            }
        });

        const filteredListings = category === 'all'
            ? listings
            : listings.filter(listing => listing.type === category);

        renderListings(filteredListings);
    });
});

document.getElementById('search-input').addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase().trim();
    document.querySelectorAll('.user-input-display').forEach(display => {
        const heading = display.dataset.heading;
        if (heading.includes(query)) {
            display.style.display = 'block';
        } else {
            display.style.display = 'none';
        }
    });
});

const listings = [
    { id: 1, type: 'item', user: 'Abhijeet Verma', userImg: 'https://via.placeholder.com/30', title: 'Book', description: 'I need chemistry book for 2 days.' },
    { id: 2, type: 'skill', user: 'Aryan Gupta', userImg: 'https://via.placeholder.com/30', title: 'Python', description: 'Want to learn Python' },
    { id: 3, type: 'item', user: 'Vikram Aditya', userImg: 'https://via.placeholder.com/30', title: 'Lab Coat', description: 'Need a lab coat for chemistry practical' },
    { id: 4, type: 'skill', user: 'Nitin Goyal', userImg: 'https://via.placeholder.com/30', title: 'Dance', description: 'Want to learn some dance steps.' },
];

function openChatModal(userName) {
    document.getElementById('chat-user').textContent = userName;
    document.getElementById('chat-modal').style.display = 'block';
}

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('chat-modal').style.display = 'none';
});

document.getElementById('send-message').addEventListener('click', sendMessage);

function sendMessage() {
    const message = document.getElementById('chat-input').value;
    if (message) {
        const messageBox = document.createElement('div');
        messageBox.textContent = message;
        document.getElementById('chat-messages').appendChild(messageBox);
        document.getElementById('chat-input').value = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.chat-button').forEach(button => {
        button.addEventListener('click', () => {
            const userName = button.getAttribute('data-user');
            openChatModal(userName);
        });
    });
});

function createListingBox(listing) {
    return `
        <div class="listing-box ${listing.type}">
            <div class="user-info">
                <img src="${listing.userImg}" alt="${listing.user}">
                <span>${listing.user}</span>
            </div>
            <h3>${listing.title}</h3>
            <p>${listing.description}</p>
            <button class="chat-button" data-user="${listing.user}">Chat</button>
        </div>
    `;
}

function renderListings(listingsToRender) {
    const container = document.getElementById('listing-container');
    container.innerHTML = listingsToRender.map(createListingBox).join('');
}

renderListings(listings);
