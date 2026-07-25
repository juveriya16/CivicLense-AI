import express from 'express';
import { supabaseAdmin } from '../config/supabaseAdmin.js';

const router = express.Router();

// Called by frontend right after Google OAuth redirect completes
router.post('/resolve-role', async (req, res) => {
  const { access_token } = req.body;

  if (!access_token) {
    return res.status(400).json({ error: 'Access token is required.' });
  }

  // Verify the token and get the Google-authenticated user
  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(access_token);

  if (userError || !userData?.user) {
    return res.status(401).json({ error: 'Invalid or expired session.' });
  }

  const { id, email } = userData.user;

  // Check if profile already exists
  const { data: existingProfile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (existingProfile) {
    return res.status(200).json({ message: 'Existing user', profile: existingProfile });
  }

  // Determine role
  let role = 'citizen';
  let assigned_zone = null;

  if (email === process.env.ADMIN_EMAIL) {
    role = 'admin';
  } else {
    const { data: whitelistEntry } = await supabaseAdmin
      .from('officer_whitelist')
      .select('*')
      .eq('email', email)
      .single();

    if (whitelistEntry) {
      role = 'officer';
      assigned_zone = whitelistEntry.assigned_zone;
    }
  }

  // Create profile
  const { data: newProfile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert({
      id,
      name: userData.user.user_metadata?.full_name || email.split('@')[0],
      role,
      assigned_zone,
      is_verified: false, // OTP step comes next
    })
    .select()
    .single();

  if (profileError) {
    return res.status(400).json({ error: profileError.message });
  }

  res.status(201).json({ message: 'New profile created', profile: newProfile });
});

export default router;