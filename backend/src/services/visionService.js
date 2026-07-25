import axios from 'axios';

export async function classifyImageWithVision(imageBuffer) {
  const base64Image = imageBuffer.toString('base64');

  try {
    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
      {
        requests: [
          {
            image: { content: base64Image },
            features: [{ type: 'LABEL_DETECTION', maxResults: 10 }],
          },
        ],
      }
    );

    const labels = response.data.responses[0]?.labelAnnotations || [];

    // Simple keyword-based mapping from Vision's labels to your categories
    const categoryMap = {
      pothole: ['pothole', 'road', 'asphalt', 'crack'],
      garbage: ['garbage', 'trash', 'waste', 'litter', 'rubbish'],
      streetlight: ['streetlight', 'lamp', 'light fixture', 'pole'],
      water_leakage: ['water', 'leak', 'puddle', 'flood'],
      graffiti: ['graffiti', 'vandalism', 'spray paint'],
    };

    let bestCategory = 'other';
    let bestConfidence = 0;

    for (const label of labels) {
      const desc = label.description.toLowerCase();
      for (const [category, keywords] of Object.entries(categoryMap)) {
        if (keywords.some((kw) => desc.includes(kw)) && label.score > bestConfidence) {
          bestCategory = category;
          bestConfidence = label.score;
        }
      }
    }

    return { category: bestCategory, confidence: bestConfidence };
  } catch (error) {
    console.error('Vision classification error:', error.response?.data || error.message);
    return { category: null, confidence: null };
  }
}