import axios from 'axios';

export async function classifyImageWithHuggingFace(imageBuffer) {
  try {
    const response = await axios.post(
  'https://router.huggingface.co/hf-inference/models/microsoft/resnet-50',
      imageBuffer,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/octet-stream',
        },
      }
    );

    const predictions = response.data;

    const categoryMap = {
      pothole: ['pothole', 'road', 'asphalt', 'crack', 'manhole'],
      garbage: ['garbage', 'trash', 'ashcan', 'waste', 'bin', 'dump'],
      streetlight: ['streetlight', 'lamp', 'lantern', 'pole'],
      water_leakage: ['water', 'fountain', 'puddle'],
      graffiti: ['graffiti', 'wall'],
    };

    let bestCategory = 'other';
    let bestConfidence = 0;

    for (const pred of predictions) {
      const desc = pred.label.toLowerCase();
      for (const [category, keywords] of Object.entries(categoryMap)) {
        if (keywords.some((kw) => desc.includes(kw)) && pred.score > bestConfidence) {
          bestCategory = category;
          bestConfidence = pred.score;
        }
      }
    }

    return { category: bestCategory, confidence: bestConfidence };
  } catch (error) {
    console.error('Hugging Face classification error:', error.response?.data || error.message);
    return { category: null, confidence: null };
  }
}