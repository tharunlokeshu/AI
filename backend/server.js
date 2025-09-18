require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const port = 5001;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
const GOOGLE_TRANSLATE_API_URL = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;

// -------------------------
// Initialize SQLite Database
// -------------------------
const db = new sqlite3.Database('./agri_ai.db', (err) => {
  if (err) return console.error('DB Error:', err.message);
  console.log('Connected to SQLite database.');
  db.run(`CREATE TABLE IF NOT EXISTS user_inputs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    location TEXT,
    land_size TEXT,
    land_type TEXT,
    land_health TEXT,
    season TEXT,
    water_facility TEXT,
    duration TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// -------------------------
// Middlewares
// -------------------------
app.use(cors());
app.use(bodyParser.json());

// -------------------------
// Helper function for Gemini API call
// -------------------------
async function callGeminiAPI(prompt) {
  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${errorText}`);
  }

  const data = await response.json();
  let content = data.candidates[0].content.parts[0].text.trim();
  content = content.replace(/```json\s*([\s\S]*?)```/g, '$1').replace(/```/g, '').trim();

  try {
    return JSON.parse(content);
  } catch (err) {
    throw new Error(`Failed to parse Gemini JSON response: ${content}`);
  }
}

// -------------------------
// Helper function for Google Translate API call
// -------------------------
async function translateText(text, targetLanguage, sourceLanguage = 'en') {
  if (!GOOGLE_TRANSLATE_API_KEY) {
    console.warn('Google Translate API key not found, returning original text');
    return text;
  }

  const params = new URLSearchParams();
  params.append('target', targetLanguage);
  params.append('source', sourceLanguage);
  params.append('key', GOOGLE_TRANSLATE_API_KEY);
  params.append('q', text);

  const response = await fetch(`${GOOGLE_TRANSLATE_API_URL}&${params}`, {
    method: 'POST',
  });

  if (!response.ok) {
    console.warn('Translation failed, returning original text');
    return text;
  }

  const data = await response.json();
  return data.data.translations[0].translatedText;
}

// -------------------------
// Routes
// -------------------------

// Save user input
app.post('/api/user-inputs', (req, res) => {
  const { userId, location, landSize, landType, landHealth, season, waterFacility, duration } = req.body;
  if (!location || !landSize || !landType || !season || !waterFacility || !duration) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = `INSERT INTO user_inputs (user_id, location, land_size, land_type, land_health, season, water_facility, duration)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [userId || 'anonymous', location, landSize, landType, landHealth || '', season, waterFacility, duration];

  db.run(sql, values, function(err) {
    if (err) return res.status(500).json({ error: 'Failed to save user input', details: err.message });
    res.json({ success: true, id: this.lastID });
  });
});

// Get user input history
app.get('/api/user-inputs/:userId', (req, res) => {
  const { userId } = req.params;
  const sql = `SELECT * FROM user_inputs WHERE user_id = ? ORDER BY created_at DESC`;
  db.all(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch user inputs', details: err.message });
    res.json(rows);
  });
});

// Crop Analysis (Recommended Crops)
app.post('/api/crop-analysis', async (req, res) => {
  const { location, landSize, landType, landHealth, season, waterFacility, duration, language } = req.body;
  if (!location || !landSize || !landType || !season || !waterFacility || !duration) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const prompt = `
You are a 40+ year experienced farmer. Based on these inputs:
Location: ${location}, Land Size: ${landSize}, Land Type: ${landType}, Land Health: ${landHealth}, Season: ${season}, Water Facility: ${waterFacility}, Duration: ${duration}

Generate 3-5 recommended crops suitable for these conditions.
For each crop, include:
- cropName
- requiredInvestment (₹/acre)
- expectedProfit (₹/acre)
- reasoning

Return ONLY JSON with this structure:
{ "recommendedCrops": [ { "cropName":"", "requiredInvestment":"", "expectedProfit":"", "reasoning":"" } ] }
`;

  try {
    const result = await callGeminiAPI(prompt);

    // Translate reasoning if language is not English
    if (language && language !== 'en') {
      for (let crop of result.recommendedCrops) {
        if (crop.reasoning) {
          crop.reasoning = await translateText(crop.reasoning, language);
        }
      }
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Detailed Crop Plan
app.post('/api/crop-plan', async (req, res) => {
  const { cropName, location, landSize, landType, season, language } = req.body;
  if (!cropName) return res.status(400).json({ error: 'Crop name is required' });

  const prompt = `
You are an expert agricultural consultant. Create a detailed farming plan for ${cropName}:
- Include daily/weekly tasks
- Include fertilizers, pesticides, and their doses
- Include milestones
- Include general tips and warnings

Use JSON ONLY with this structure:
{
  "cropName": "${cropName}",
  "totalDuration": "string",
  "phases": [
    {
      "phaseName":"string",
      "weekRange":"string",
      "tasks":[
        { "task":"string", "description":"string", "importance":"High/Medium/Low" }
      ],
      "milestones":["string"]
    }
  ],
  "generalTips":["string"],
  "warnings":["string"]
}
`;

  try {
    const result = await callGeminiAPI(prompt);

    // Translate all string fields if language is not English
    if (language && language !== 'en') {
      if (result.phases) {
        for (const phase of result.phases) {
          if (phase.phaseName) {
            phase.phaseName = await translateText(phase.phaseName, language);
          }
          if (phase.weekRange) {
            phase.weekRange = await translateText(phase.weekRange, language);
          }
          if (phase.tasks) {
            for (const task of phase.tasks) {
              if (task.task) {
                task.task = await translateText(task.task, language);
              }
              if (task.description) {
                task.description = await translateText(task.description, language);
              }
              if (task.importance) {
                task.importance = await translateText(task.importance, language);
              }
            }
          }
          if (phase.milestones) {
            for (let i = 0; i < phase.milestones.length; i++) {
              phase.milestones[i] = await translateText(phase.milestones[i], language);
            }
          }
        }
      }
      if (result.generalTips) {
        for (let i = 0; i < result.generalTips.length; i++) {
          result.generalTips[i] = await translateText(result.generalTips[i], language);
        }
      }
      if (result.warnings) {
        for (let i = 0; i < result.warnings.length; i++) {
          result.warnings[i] = await translateText(result.warnings[i], language);
        }
      }
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Disease Detection
app.post('/api/disease-detection', async (req, res) => {
  const { imageBase64, cropType } = req.body;
  if (!imageBase64) return res.status(400).json({ error: 'Image is required' });

  const prompt = `
You are an expert plant pathologist. Analyze this crop image for diseases. Crop type: ${cropType || 'Unknown'}
Image data (truncated): ${imageBase64.substring(0, 1000)}...

Return ONLY JSON:
{
  "disease":"string",
  "confidence":"string",
  "severity":"string",
  "description":"string",
  "symptoms":["string"],
  "causes":["string"],
  "treatment":{
    "immediate":["string"],
    "chemical":["string"],
    "preventive":["string"]
  },
  "timeline":"string",
  "recommendations":["string"]
}
`;

  try {
    const result = await callGeminiAPI(prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Local Market Info
app.post('/api/local-market', (req, res) => {
  const { location, crop } = req.body;
  if (!location || !crop) return res.status(400).json({ error: 'Missing location or crop' });

  const vendors = [
    { name: 'Mandi A', address: `${location} Market Area`, contact: '123-456-7890' },
    { name: 'Mandi B', address: `${location} Central Market`, contact: '987-654-3210' },
  ];
  res.json({ vendors });
});

// Government Organizations
app.post('/api/government-organizations', (req, res) => {
  const { location } = req.body;
  if (!location) return res.status(400).json({ error: 'Missing location' });

  const organizations = [
    { name: 'Rythu Bharosa', address: `${location} Office`, contact: '111-222-3333' },
    { name: 'Agriculture Dept', address: `${location} Agriculture Building`, contact: '444-555-6666' },
  ];
  res.json({ organizations });
});

// Bank Loans
app.post('/api/bank-loans', (req, res) => {
  const { location, crop } = req.body;
  if (!location || !crop) return res.status(400).json({ error: 'Missing location or crop' });

  const schemes = [
    { scheme: 'Crop Loan Scheme A', loanAmount: '₹1,00,000', interestRate: '7%', apply: 'Local Bank Branch' },
    { name: 'Agriculture Loan B', loanAmount: '₹2,00,000', interestRate: '6.5%', apply: 'Online Application' },
  ];
  res.json({ schemes });
});

// -------------------------
// Start Server
// -------------------------
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
