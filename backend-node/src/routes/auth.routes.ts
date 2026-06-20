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

router.post('/login/google', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_token } = req.body;
    if (!id_token) {
      res.status(400).json({ detail: 'id_token is required' });
      return;
    }

    let decodedToken;
    try {
      decodedToken = await firebaseAuth().verifyIdToken(id_token);
    } catch (err) {
      logger.error(`Error verifying Firebase ID token: ${err}`);
      res.status(401).json({ detail: 'Invalid ID token' });
      return;
    }

    const { email, name, picture, uid } = decodedToken;
    if (!email) {
      res.status(400).json({ detail: 'Email not provided in token' });
      return;
    }

    let user = await User.findOne({ email });
    if (!user) {
      // Create a new user
      user = new User({
        email,
        name: name || email.split('@')[0],
        imageUrl: picture || null,
        auth_provider: 'google',
        firebase_uid: uid,
      });
      await user.save();
      logger.info(`Created new user ${user.email} via Google login`);
    } else {
      // Update firebase_uid and imageUrl if not set
      let updated = false;
      if (!user.firebase_uid) {
        user.firebase_uid = uid;
        updated = true;
      }
      if (!user.imageUrl && picture) {
        user.imageUrl = picture;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    }

    const access_token = jwt.sign({ sub: user._id }, config.secretKey, { expiresIn: '1h' });
    const refresh_token = 'dummy-refresh-token';

    res.json({
      access_token,
      refresh_token,
      user
    });
  } catch (error) {
    logger.error(`Error in /login/google: ${error}`);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

export default router;
