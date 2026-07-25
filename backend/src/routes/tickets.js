import express from 'express';
import upload from '../middleware/upload.js';
import { supabaseAdmin } from '../config/supabaseAdmin.js';
import { classifyImageWithVision } from '../services/visionService.js';
const router = express.Router();

router.post('/', upload.single('media'), async (req, res) => {
  try {
    const { citizen_id, description, lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Location (lat, lng) is required.' });
    }

    let mediaUrl = null;
    let mediaType = null;

    // Upload file to Supabase Storage if provided
    if (req.file) {
      const isVideo = req.file.mimetype.startsWith('video');
      const bucket = isVideo ? 'ticket-videos' : 'ticket-images';
      mediaType = isVideo ? 'video' : 'image';

      const fileName = `${Date.now()}-${req.file.originalname}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from(bucket)
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (uploadError) {
        return res.status(400).json({ error: uploadError.message });
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from(bucket)
        .getPublicUrl(fileName);

      mediaUrl = publicUrlData.publicUrl;
    }
let category = null;
    let ai_confidence = null;

   if (req.file && mediaType === 'image') {
      const result = await classifyImageWithVision(req.file.buffer);
      category = result.category;
      ai_confidence = result.confidence;
    }
    // Create the ticket
    const { data: ticket, error: ticketError } = await supabaseAdmin
      .from('tickets')
      .insert({
        citizen_id: citizen_id || null,
        description,
        image_url: mediaType === 'image' ? mediaUrl : null,
        video_url: mediaType === 'video' ? mediaUrl : null,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        status: 'pending',
        category,
        ai_confidence,
      })
      .select()
      .single();

    if (ticketError) {
      return res.status(400).json({ error: ticketError.message });
    }

    res.status(201).json({ message: 'Ticket created successfully', ticket });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;