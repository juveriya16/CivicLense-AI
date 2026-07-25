import express from 'express';
import { supabaseAdmin } from '../config/supabaseAdmin.js';

const router = express.Router();

router.post('/signup/citizen', async (req, res) => {
  const { email, password, name, phone } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required.' });
  }

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // marks email as already confirmed
  });

  if (authError) {
    return res.status(400).json({ error: authError.message });
  }

  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert({
      id: authData.user.id,
      name,
      phone,
      role: 'citizen',
    });

  if (profileError) {
    return res.status(400).json({ error: profileError.message });
  }

  res.status(201).json({ message: 'Citizen account created successfully', user: authData.user });
});

export default router;