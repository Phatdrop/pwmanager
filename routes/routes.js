const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const users = [];

// Registration Router
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const secret = speakeasy.generateSecret({ name: `PasswordManager (${username})` });
  users.push({ username, password: hashedPassword, secret: secret.base32 });

  console.log('Generated secret during registration:', secret.base32); // Log the generated secret

  qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
    if (err) {
      return res.status(500).json({ error: 'Error generating QR code' });
    }
    res.status(201).json({
      message: 'User registered successfully',
      qr_code_url: data_url,
      secret: secret.base32
    });
    console.log('User registered:', { username, secret: secret.base32 });
  });
});

// Login Router
router.post('/login', async (req, res) => {
  const { username, password, token } = req.body;
  if (!username || !password || !token) {
    return res.status(400).send('Missing username, password, or token');
  }
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(400).send('User not found');
  }

  console.log('Stored secret for user:', user.secret); // Log the stored secret
  console.log('Provided token:', token); // Log the provided token

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(400).send('Invalid password');
  }
  const verified = speakeasy.totp.verify({
    secret: user.secret,
    encoding: 'base32',
    token: token
  });

  console.log('Verification result:', verified); // Log the verification result

  if (!verified) {
    return res.status(400).send('Invalid 2FA Token');
  }
  const authToken = jwt.sign({ username }, 'your_jwt_secret');
  res.json({ authToken });
});

// Middleware for JWT Authentication
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).send('Access Denied');
  try {
    const verified = jwt.verify(token, 'your_jwt_secret');
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send('Invalid Token');
    console.log('Invalid Token:', token);
  }
};

// Placeholder encryption function
const encryptPassword = (password) => {
  return password; // Implement your password encryption logic here
};

// Route to create an encrypted password
router.post('/createPassword', authenticate, (req, res) => {
  console.log('createPassword route hit');
  const { password } = req.body;
  if (!password) return res.status(400).send('Password is required');
  const encryptedPassword = encryptPassword(password);
  res.json({ encryptedPassword });
  console.log('Encrypted password created for user:', req.user.username);
});

module.exports = router;