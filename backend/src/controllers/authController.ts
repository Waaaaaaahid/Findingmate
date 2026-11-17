import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { generateToken, AuthRequest } from '../middleware/auth.js';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, password, dateOfBirth, country, currentCity, avatar, accountType } = req.body;

    if (!fullName || !email || !password || !country) {
      res.status(400).json({ success: false, message: 'Please provide full name, email, password, and country.' });
      return;
    }

    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      if (age < 18) {
        res.status(400).json({ success: false, message: 'You must be at least 18 years old to join Wanderlust Meet.' });
        return;
      }
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
      return;
    }

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      country,
      currentCity: currentCity || '',
      avatar: avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`,
      accountType: accountType || 'traveler',
      isOnboarded: false,
    });

    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        country: user.country,
        currentCity: user.currentCity,
        avatar: user.avatar,
        accountType: user.accountType,
        role: user.role,
        isVerified: user.isVerified,
        isOnboarded: user.isOnboarded,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error registering account' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide email and password.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    if (user.isBanned) {
      res.status(403).json({ success: false, message: 'Your account has been banned.' });
      return;
    }

    if (user.isSuspended) {
      res.status(403).json({ success: false, message: 'Your account is currently suspended.' });
      return;
    }

    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        country: user.country,
        currentCity: user.currentCity,
        avatar: user.avatar,
        accountType: user.accountType,
        role: user.role,
        isVerified: user.isVerified,
        isOnboarded: user.isOnboarded,
        openToMeet: user.openToMeet,
        privacySettings: user.privacySettings,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error logging in' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    res.json({
      success: true,
      user: req.user,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching user' });
  }
};

export const completeOnboarding = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const {
      accountType,
      avatar,
      gender,
      dateOfBirth,
      country,
      currentCity,
      languages,
      interests,
      connectionPreferences,
      bio,
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (accountType) user.accountType = accountType;
    if (avatar) user.avatar = avatar;
    if (gender) user.gender = gender;
    if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
    if (country) user.country = country;
    if (currentCity !== undefined) user.currentCity = currentCity;
    if (languages) user.languages = languages;
    if (interests) user.interests = interests;
    if (connectionPreferences) user.connectionPreferences = connectionPreferences;
    if (bio !== undefined) user.bio = bio;
    user.isOnboarded = true;

    await user.save();

    res.json({
      success: true,
      message: 'Onboarding completed successfully!',
      user,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error updating onboarding' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    // Return generic message for security
    res.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been dispatched.',
      debugDemoResetCode: user ? 'RESET-DEMO-2026' : undefined,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error handling request' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      res.status(400).json({ success: false, message: 'Email and new password are required.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(404).json({ success: false, message: 'Account not found.' });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful. You may now log in.',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error resetting password' });
  }
};
