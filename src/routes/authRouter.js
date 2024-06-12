import { Router } from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import { users } from '../users.js';

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
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: 'User already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({
    id: users[users.length - 1].id + 1,
    username,
    age,
    password: hashedPassword
  });
  res.status(201).json({ message: 'User joined successfully' });
});

router.put('/change-password', (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = users.find(user => user.id === req.session.passport.user);
  if (!user || !bcrypt.compareSync(oldPassword, user.password)) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
  user.password = bcrypt.hashSync(newPassword, 10);
  res.status(200).json({ message: 'Password changed successfully' });
});

router.delete('/delete-account', (req, res) => {
  const index = users.findIndex(user => user.id === req.session.passport.user);
  if (index === -1) {
    return res.status(404).json({ message: 'Account not found' });
  }
  users.splice(index, 1);
  req.logout();
  res.status(200).json({ message: 'Account deleted successfully' });
});

export default router;
