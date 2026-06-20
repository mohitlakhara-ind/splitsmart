import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config, logger } from '../config';
import { firebaseAuth } from '../firebase';

const router = Router();

router.post('/signup/email', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ detail: 'User with this email already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      hashed_password,
      name,
      auth_provider: 'email'
    });

    await user.save();

    const access_token = jwt.sign({ sub: user._id }, config.secretKey, { expiresIn: '1h' });
    const refresh_token = 'dummy-refresh-token'; // Simplified for this milestone

    res.json({
      access_token,
      refresh_token,
      user
    });
  } catch (error) {
    logger.error(`Error in /signup/email: ${error}`);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

router.post('/login/email', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !user.hashed_password) {
      res.status(401).json({ detail: 'Incorrect email or password' });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.hashed_password);
    if (!validPassword) {
      res.status(401).json({ detail: 'Incorrect email or password' });
      return;
    }

    const access_token = jwt.sign({ sub: user._id }, config.secretKey, { expiresIn: '1h' });
    const refresh_token = 'dummy-refresh-token';

    res.json({
      access_token,
      refresh_token,
      user
    });
  } catch (error) {
    logger.error(`Error in /login/email: ${error}`);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

export default router;
