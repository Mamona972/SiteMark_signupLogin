const express =require("express");
const cors =require ("cors");
const mongoose= require("mongoose");
require("dotenv").config();// load .env file 
const authRoutes = require('./routes/authRoutes');
const cookieParser= require("cookie-parser");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const session = require('express-session');
const User= require ('./model/User');

const app=express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials:true,methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie']
}));
app.use(cookieParser());
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET, // Replace with a real secret
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
     try {
      // 1. Check if user exists by Google ID or Email
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        // If not found, check by email (for merging users who signed up via email before)
        user = await User.findOne({ email: profile.emails[0].value });
      }

      if (!user) {
        // 2. Create new user
        user = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          avatar: profile.photos[0].value
        });

        await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Routes
app.get('/auth/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account' // Forces account selection
  })
);

app.get('/auth/google/callback', 
  passport.authenticate('google', { session: false }),
  (req, res) => {
     const token = jwt.sign(
      { userId: req.user._id }, // Use DB ID for future references
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Set cookie with token
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed to 'lax' for OAuth to work properly
      maxAge: 3600000
    });
    
    // Redirect to frontend with success
    res.redirect('http://localhost:3000/auth/success');
  }
);

// Add this endpoint to check auth status
app.get('/auth/status', (req, res) => {
  const token = req.cookies.jwt;
  
  if (!token) {
    return res.status(401).json({ isAuthenticated: false });
  }
  
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ isAuthenticated: true });
  } catch (err) {
    res.status(401).json({ isAuthenticated: false });
  }
});

app.use('/',authRoutes);

//database
mongoose.connect(process.env.MONGODB)
.then(()=>console.log("datbase is successfully connected"))
.catch((err)=> console.log("datbase connection error",err));


const port=6008;
app.listen(port, ()=>{
  console.log(`server is running on the port${port}`);
})