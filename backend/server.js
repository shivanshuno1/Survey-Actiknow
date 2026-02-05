import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully to Users database'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema matching your collection structure
const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  created_AT: { 
    type: Date, 
    default: Date.now 
  }
});



// Use the exact collection name 'Usernames'
const User = mongoose.model('User', userSchema, 'users');

// 1. Login endpoint - Check credentials from MongoDB
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for email:', email);

    // Check if user exists in MongoDB
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      console.log('User not found:', email);
      return res.status(404).json({ 
        success: false, 
        message: 'User not found. Please check your email.' 
      });
    }

    console.log('User found:', user.email);
    
    // Compare password. Support both bcrypt-hashed passwords and legacy plaintext passwords.
    let isMatch = false;
    if (user.password && user.password.startsWith('$2')) {
      // bcrypt hash detected
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // legacy plaintext (insecure)
      isMatch = user.password === password;
    }

    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Please try again.'
      });
    }

   

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        name: user.name 
      },
      process.env.JWT_SECRET || 'survey-app-secret-key-2024',
      { expiresIn: '7d' }
    );

    console.log('Login successful for:', user.email);

    // Send response
    res.json({
      success: true,
      message: 'Login successful!',
      token: token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        created_AT: user.created_AT,
        role: user.email && user.email.toLowerCase().includes('admin') ? 'Admin' : 'User'
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
});

// 2. Register endpoint - Add new user to MongoDB
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('Registration attempt:', email);

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    // Create new user (password will be hashed)
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      created_AT: new Date()
    });

    await newUser.save();
    console.log('User registered successfully:', newUser.email);

    // Create token
    const token = jwt.sign(
      { 
        userId: newUser._id, 
        email: newUser.email,
        name: newUser.name 
      },
      process.env.JWT_SECRET || 'survey-app-secret-key-2024',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token: token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        created_AT: newUser.created_AT
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed. Please try again.' 
    });
  }
});

// 3. Get all users (for testing)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch users' 
    });
  }
});

// 4. Check MongoDB connection
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState;
    const statusText = dbStatus === 1 ? 'connected' : 'disconnected';
    
    const userCount = await User.countDocuments();
    
    res.json({ 
      success: true, 
      message: 'Backend is running',
      database: {
        status: statusText,
        name: mongoose.connection.name,
        usersCount: userCount
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Health check failed' 
    });
  }
});

// 5. Verify token endpoint
app.get('/api/auth/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'survey-app-secret-key-2024');
    
    // Check if user still exists in DB
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
  console.log(`📊 MongoDB: ${mongoURI}`);
});
