const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();


const JWT_SECRET = '8dfW@4^0YbWvX|X9jZ0s7&mkHbG5NsKlfqTdZvJ^!bQ1Qz8bE6K@PhM9$QzT!4L';

// Register (Sign-up)
router.post('/register', async (req, res) => {
  try {
      const { userId, name, photo, role, emailId, password, phone, address } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ emailId });
      if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = new User({
          userId,
          name,
          photo,
          role,
          emailId,
          password: hashedPassword,
          phone,
          address
      });

      await newUser.save();

      res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
      const { emailId, password } = req.body;

      // Find user by email
      const user = await User.findOne({ emailId });
      if (!user) {
          return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Generate JWT
      const token = jwt.sign(
          { userId: user._id, role: user.role },
          JWT_SECRET,
          { expiresIn: '30s' }
      );

      res.json({ token });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
});

// Get user by ID
router.get('/user/:id', async (req, res) => {
  try {
      const user = await User.findById(req.params.id).populate('role');
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
});

// Update user by ID
router.put('/user/:id', async (req, res) => {
  try {
      const { name, photo, role, phone, address, isActive } = req.body;

      // Find and update user
      const user = await User.findByIdAndUpdate(
          req.params.id,
          { name, photo, role, phone, address, isActive, updatedAt: Date.now() },
          { new: true }
      );

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User updated successfully', user });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
});

// Delete user by ID
router.delete('/user/:id', async (req, res) => {
  try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
