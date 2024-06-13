import { Router } from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import { users } from '../users.js';
import User from '../models/User.js';

const router = Router();

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({ message: 'Logged in successfully', user });
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

router.post('/join', async (req, res) => {
  const { username, age, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      return res.status(409).json({ message: 'User already exists' });
    }  
    const newUser = new User({ username, age, password});
    const savedUser = await newUser.save();

    if (!savedUser) {
      throw new Error('User save operation failed');
    }
    res.status(201).json({ message: 'User joined successfully' });
  } catch (err) {    
    res.status(500).send('Internal server error');
  }
});

router.put('/change-password', async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  
  try {
    const user = await User.findOne({ username : req.user.username })
    
    if (!user || ( oldPassword != user.password) ) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
  
    user.password = newPassword;
    const savedUser = await user.save();
  
    if (!savedUser) {
      throw new Error('User save operation failed');
    }
    res.status(200).json({ message: 'Password changed successfully' });
  } catch(err) {
    res.status(500).send('Internal server error');
  }
});

router.delete('/delete-account', async (req, res) => {  
  try {
    const user = await User.findOne({ username : req.user.username })
    
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    } 
    await User.deleteOne({ username : req.user.username })

    // 세션 지우기
    req.logOut((err) => {
      if (err) {
        console.error('Error logging out:', err);
        return res.status(500).json({ message: 'Error logging out' });
      }
      res.status(200).json({ message: 'User deleted and logged out successfully' });
    });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch(err) {
    res.status(500).send('Internal server error');
  }
});

export default router;
