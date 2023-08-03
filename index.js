
const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config()
const app = express();
// app use
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cookieParser());
const User = require('./models/user');
const { auth } = require('./middlewares/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
secretKey = process.env.SECRET
// database connection
mongoose.set('strictQuery', false);
const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(process.env.DATABASE);
    console.log(`MongoDb connected: ${connection.connection.host}`);
  }
  catch (error) {
    console.log("Error: ", error);
  }
}

app.get('/', (req, res) => {
  res.status(200).send(`Welcome to login , sign-up api`);
});

app.post('/api/register', async (req, res) => {
  // taking a user
  const newUser = new User(req.body);

  if (newUser.password != newUser.confirmpassword) {
    return res.status(400).json({ message: "password not match" });
  }

  try {
    // Check if a user with the same email or username already exists
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const createdUser = newUser.save();
    if (createdUser) {
      return res.status(201).json({ message: 'User registered successfully' });
    }
  } catch (error) {
    console.error('Error checking user existence:', error);
    res.status(500).json({ error: 'Failed to register user' });

  }
});

// login user
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    //console.error('Error signing in:', error);
    res.status(500).json({ error: 'Failed to sign in' });
  }
});

// get logged in user
app.get('/api/profile', (req, res) => {
  // Check for the token in the Authorization header

  const token = req.headers.token;
  //console.log(token);
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Verify the token and extract the userId
  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    const userId = decoded.userId;
    const user = await User.findOne({ "_id": userId });
    const userProfile = {
      'firstName': user.firstname,
      'lastName': user.lastname,
      'email': user.email
    }
    res.status(200).json({ userProfile });
  });
});

app.post('/api/logout', async (req, res) => {
  const { token } = req.headers.token;

  try {
    // Find the user with the active token
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.token = undefined; // Clear the active token field
    await user.save();
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ error: 'Failed to log out' });
  }
});

// listening port
const PORT = process.env.PORT || 5000;
connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`app is live at ${PORT}`);
  });
})
