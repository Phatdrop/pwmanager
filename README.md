Password Manager
A simple, secure password manager application that supports user registration, login with two-factor authentication (2FA), and password storage.

Features
User Registration: Register with a username and password, and set up 2FA using a QR code.

User Login: Authenticate with a username, password, and 2FA token.

Password Storage: Store encrypted passwords for different sites.

Password Retrieval: View stored passwords with the ability to toggle their visibility.

Technologies Used
Backend: Node.js, Express.js

Frontend: HTML, CSS, JavaScript

Authentication: bcrypt, speakeasy, JWT

Database: In-memory user storage (can be updated to use MongoDB)

Getting Started
Prerequisites
Node.js installed on your system

Installation
Clone the repository:

git clone https://github.com/your-username/password-manager.git
cd password-manager
Install dependencies:

npm install
Running the Application
Start the backend server:

node index.js
Open index.html in your browser to interact with the application.

Usage
Registration
Enter a username and password on the registration form.

Scan the QR code with your 2FA app to set up 2FA.

Use the generated secret if you can't scan the QR code.

Login
Enter your username and password.

Enter the 2FA token from your 2FA app.

On successful login, you will be redirected to your profile page to manage stored passwords.

Storing Passwords
After logging in, use the password creation form to store passwords for different sites.

Passwords will be displayed in a list, with the option to toggle their visibility.
