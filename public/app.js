// Base URL for API requests
const API_URL = 'http://localhost:3050';

// Login function
async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const token = prompt('Enter your 2FA token'); // Prompt for the TOTP token

  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password, token }) // Use the TOTP token
  });

  if (response.ok) {
    const data = await response.json();
    console.log('Login successful:', data);
    localStorage.setItem('authToken', data.authToken); // Store the auth token
    window.location.href = '/profile.html'; // Redirect to profile page
} else {
    const error = await response.text();
    console.error('Login failed:', error);
    alert('Login failed: ' + error); // Display error message
}
}

async function verifyToken() {
  const username = 'your_username';
  const token = 'your_generated_token'; // Use the manually generated token

  const response = await fetch(`${API_URL}/verifyToken`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, token })
  });

  const data = await response.json();
  console.log('Token verification result:', data);
}

verifyToken();

async function register() {
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      const { qr_code_url, secret } = await response.json();
      
      // Display the QR code and secret
      document.getElementById('qr-code-container').style.display = 'block';
      document.getElementById('qr-code').src = qr_code_url;
      document.getElementById('secret-code').textContent = secret;

      alert('Registration successful. Set up 2FA using the QR code.');
    } else {
      alert('Registration failed: ' + await response.text());
    }
  } catch (error) {
    console.error('Error during registration:', error);
  }
}

// Create password function
async function createPassword() {
  const site = document.getElementById('site').value;
  const newPassword = document.getElementById('new-password').value;

  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert('You must be logged in to create a password.');
      return;
    }

    const response = await fetch(`${API_URL}/createPassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` // Pass the token for authentication
      },
      body: JSON.stringify({ password: newPassword })
    });

    if (response.ok) {
      const { encryptedPassword } = await response.json();
      const passwordItem = `${site}: ${encryptedPassword}`;
      addPasswordToList(passwordItem); // Add the created password to the list
      alert('Password created successfully');
    } else {
      alert('Failed to create password: ' + await response.text());
    }
  } catch (error) {
    console.error('Error during password creation:', error);
  }
}

// Load stored passwords function
async function loadStoredPasswords() {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
      alert('You must be logged in to view your stored passwords.');
      window.location.href = '/index.html'; // Redirect to login page
      return;
  }

  const response = await fetch(`${API_URL}/getPasswords`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
      }
  });

  if (response.ok) {
      const passwords = await response.json();
      const passwordList = document.getElementById('passwords');
      passwordList.innerHTML = ''; // Clear the list before adding new items

      passwords.forEach(passwordItem => {
          const listItem = document.createElement('li');

          const siteSpan = document.createElement('span');
          siteSpan.textContent = `${passwordItem.site}: `;

          const passwordSpan = document.createElement('span');
          passwordSpan.textContent = '********';
          passwordSpan.style.cursor = 'pointer';
          passwordSpan.onclick = () => {
              if (passwordSpan.textContent === '********') {
                  passwordSpan.textContent = passwordItem.password;
              } else {
                  passwordSpan.textContent = '********';
              }
          };

          listItem.appendChild(siteSpan);
          listItem.appendChild(passwordSpan);
          passwordList.appendChild(listItem);
      });
  } else {
      console.error('Failed to load passwords:', await response.text());
  }
}

window.onload = loadStoredPasswords; // Load passwords when the profile page is loaded

// Function to add the password to the list
function addPasswordToList(passwordItem) {
  const passwordList = document.getElementById('passwords');
  const listItem = document.createElement('li');
  listItem.textContent = passwordItem;
  passwordList.appendChild(listItem);

  // Show password list
  document.getElementById('password-list').style.display = 'block';
}