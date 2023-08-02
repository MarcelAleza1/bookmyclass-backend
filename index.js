
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
secretKey=process.env.SECRET
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
// mongoose.connect(db.DATABASE,{ useNewUrlParser: true },function(err){
//     if(err) console.log(err);
//     console.log("database is connected");
// });


app.get('/', function (req, res) {
    res.status(200).send(`Welcome to login , sign-up api`);
});

app.post('/api/register', async (req, res) => {
    // taking a user
    const newuser = new User(req.body);

    if (newuser.password != newuser.password2) {
        return res.status(400).json({ message: "password not match" });
    }

    try {
        // Check if a user with the same email or username already exists
        const existingUser = await User.findOne({email: req.body.email});
    
        if (existingUser) {
          return res.status(409).json({ error: 'User already exists' });
        }
    
        // If user does not exist, create a new user
        const newUser = new User(req.body);
    newUser.save()
        // newUser.save((err, user) => {
        //   if (err) {
        //     console.error('Error saving user:', err);
        //     return res.status(500).json({ error: 'Failed to create user' });
        //   }
    
        //   res.status(201).json(user);
        // });
      } catch (error) {
        console.error('Error checking user existence:', error);
        res.status(500).json({ error: 'Failed to check user existence' });
      }
    // User.findOne({email:newuser.email},function(err,user){
    //     if(user) return res.status(400).json({ auth : false, message :"email exits"});

    //     newuser.save((err,doc)=>{
    //         if(err) {console.log(err);
    //             return res.status(400).json({ success : false});}
    //         res.status(200).json({
    //             succes:true,
    //             user : doc
    //         });
    //     });
    // });
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
      console.error('Error signing in:', error);
      res.status(500).json({ error: 'Failed to sign in' });
    }
  });
  
// get logged in user
app.get('/api/profile', (req, res) => {
    // Check for the token in the Authorization header
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
  
    // Verify the token and extract the userId
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
  
      const userId = decoded.userId;
      
      res.status(200).json({ message: 'Protected route accessed successfully', userId });
    });
  });
    
// app.get('/api/profile', auth, function (req, res) {
//     res.json({
//         isAuth: true,
//         id: req.user._id,
//         email: req.user.email,
//         name: req.user.firstname + req.user.lastname

//     })
// });
//logout user
app.get('/api/logout', function (req, res) {
    req.user.deleteToken(req.token, (err, user) => {
        if (err) return res.status(400).send(err);
        res.sendStatus(200);
    });

});

// listening port
const PORT = process.env.PORT || 5000;
connectDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`app is live at ${PORT}`);
    });
})
