
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Check API key
if (!process.env.GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY is missing from .env');
  process.exit(1);
}

// Initialize Gemma API
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Screenshot upload configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only PNG and JPEG images are allowed.'));
    }
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'ErrorLens AI backend is running!'
  });
});

// Gemma screenshot analysis
app.post('/api/analyze', upload.single('screenshot'), async (req, res) => {
  console.log('\nNew analysis request received.');

  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'Please upload a screenshot.'
      });
    }

    console.log('Screenshot received:', req.file.originalname);
    console.log('Sending screenshot to Gemma 4...');

    const prompt = `
You are ErrorLens AI, a friendly programming tutor
who helps beginner students understand coding errors.

Analyze the uploaded programming error screenshot.

Provide your answer using these sections:

1. ERROR IDENTIFIED
Identify the error visible in the screenshot.

2. WHY IT HAPPENED
Explain the likely cause in simple English.

3. HOW TO FIX IT
Give clear steps to solve the problem.

4. CORRECTED CODE
Provide corrected code if enough information is visible.

5. WHAT YOU SHOULD LEARN
Explain the programming concept behind the error.

6. NEXT DEBUGGING STEP
Tell the student what to check next.

Use simple language suitable for a beginner.
Do not invent missing code.
If the screenshot is unclear, mention the uncertainty.
If it is not a programming error, explain that politely.
`;

    const response = await ai.models.generateContent({
      model: 'gemma-4-26b-a4b-it',
      contents: [
        {
          text: prompt
        },
        {
          inlineData: {
            mimeType: req.file.mimetype,
            data: req.file.buffer.toString('base64')
          }
        }
      ]
    });

    console.log('Gemma response received successfully!');

    const analysis = response.text;

    if (!analysis) {
      throw new Error('Gemma returned an empty response.');
    }

    res.json({
      status: 'success',
      analysis: analysis
    });

  } catch (error) {
    console.error('\nGEMMA API ERROR:');
    console.error(error);

    res.status(500).json({
      status: 'error',
      error: error.message || 'Gemma analysis failed.'
    });
  }
});

// Handle upload errors
app.use((err, req, res, next) => {
  console.error('Upload error:', err.message);

  res.status(400).json({
    error: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`ErrorLens AI server running on http://localhost:${PORT}`);
  console.log('Gemma integration initialized.');
});