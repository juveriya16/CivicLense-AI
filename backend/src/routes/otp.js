import express from 'express';
import { supabaseAdmin } from '../config/supabaseAdmin.js';

const router = express.Router();

// Send OTP to user's email
router.post('/send', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  const { error } = await supabaseAdmin.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false, // user already exists from Google sign-in
    },
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({ message: 'OTP sent to email.' });
});

// Verify OTP and mark profile as verified
router.post('/verify', async (req, res) => {
  const { email, token } = req.body;

  if (!email || !token) {
    return res.status(400).json({ error: 'Email and OTP token are required.' });
  }

  const { data, error } = await supabaseAdmin.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({ is_verified: true })
    .eq('id', data.user.id);

  if (updateError) {
    return res.status(400).json({ error: updateError.message });
  }

  res.status(200).json({ message: 'OTP verified successfully.', user: data.user });
});
export default router;