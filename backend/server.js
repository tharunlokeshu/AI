import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import fetch from 'node-fetch';
import { Translate } from '@google-cloud/translate/build/src/v2/index.js';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { scrapeAgriVendors } from './scrape_agri_vendors_improved.js';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5002;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
const GOOGLE_TRANSLATE_API_URL = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;

const translate = new Translate({key: GOOGLE_TRANSLATE_API_KEY});

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
    const parsed = JSON.parse(content);
    // Validate that parsed content has the expected structure for investment data
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed;
    } else {
      throw new Error('Parsed content is not an object');
    }
  } catch (err) {
    console.warn('Failed to parse AI response as JSON:', err.message);
    console.warn('Raw content:', content.substring(0, 200) + '...');

    // If not JSON or not an object, return a default object structure
    return {
      investment: '8,000 - 12,000',
      profit: '20,000 - 30,000',
      reasoning: 'Default values used due to AI response parsing error'
    };
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

  try {
    const [translation] = await translate.translate(text, {from: sourceLanguage, to: targetLanguage});
    return translation;
  } catch (error) {
    console.warn('Translation failed, returning original text', error);
    return text;
  }
}

// -------------------------
// Vendor Data Fetching Function using Overpass API and fallback scraping
// -------------------------
async function fetchAgriculturalVendors(location, search_radius_meters = 2000, max_results = 200) {
  const overpassUrl = 'https://overpass-api.de/api/interpreter';

  // Helper to build Overpass QL query for agricultural vendors
  const buildOverpassQuery = (lat, lon, radius) => {
    return `
      [out:json][timeout:25];
      (
        node["shop"="fertilizer"](around:${radius},${lat},${lon});
        node["shop"="seed"](around:${radius},${lat},${lon});
        node["shop"="pesticide"](around:${radius},${lat},${lon});
        node["shop"="agricultural_machinery"](around:${radius},${lat},${lon});
        node["shop"="irrigation"](around:${radius},${lat},${lon});
        node["shop"="agri_input"](around:${radius},${lat},${lon});
      );
      out body ${max_results};
    `;
  };

  // Helper to parse lat, lon from location string if possible
  const parseLatLon = (loc) => {
    const parts = loc.split(',').map(s => s.trim());
    if (parts.length === 2) {
      const lat = parseFloat(parts[0]);
      const lon = parseFloat(parts[1]);
      if (!isNaN(lat) && !isNaN(lon)) {
        return { lat, lon };
      }
    }
    return null;
  };

  // Convert latlon to plain text table string
  const formatVendorsTable = (vendors, location) => {
    let table = `Agricultural Vendors in ${location}\n\n`;
    table += '| ID | Name | Type | Latitude | Longitude | Address | Phone | Website |\n';
    table += '|----|------|------|----------|-----------|---------|-------|---------|\n';
    vendors.forEach((v, idx) => {
      table += `| ${idx + 1} | ${v.name || ''} | ${v.type || ''} | ${v.lat || ''} | ${v.lon || ''} | ${v.address || ''} | ${v.phone || ''} | ${v.website || ''} |\n`;
    });
    table += `\n✅ ${vendors.length} agricultural vendors found in ${location}.\n`;
    return table;
  };

  try {
    const latlon = parseLatLon(location);
    if (!latlon) {
      throw new Error('Invalid location format. Provide "lat,lon" or city,state.');
    }

    const query = buildOverpassQuery(latlon.lat, latlon.lon, search_radius_meters);
    const response = await fetch(overpassUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.statusText}`);
    }

    const data = await response.json();
    const elements = data.elements || [];

    // Map Overpass elements to vendor objects
    const vendors = elements.map(el => ({
      id: el.id,
      name: el.tags && el.tags.name ? el.tags.name : 'Unknown',
      type: el.tags && el.tags.shop ? el.tags.shop : '',
      lat: el.lat,
      lon: el.lon,
      address: el.tags && el.tags['addr:full'] ? el.tags['addr:full'] : (el.tags && el.tags['addr:street'] ? el.tags['addr:street'] : ''),
      phone: el.tags && el.tags.phone ? el.tags.phone : '',
      website: el.tags && el.tags.website ? el.tags.website : '',
      source_url: `https://www.openstreetmap.org/node/${el.id}`
    }));

    // Deduplicate by name + address
    const uniqueVendors = vendors.filter((v, i, arr) =>
      i === arr.findIndex(t => t.name === v.name && t.address === v.address)
    ).slice(0, max_results);

    // Format as plain text table
    const tableText = formatVendorsTable(uniqueVendors, location);
    return tableText;

  } catch (error) {
    console.error('Overpass API fetch error:', error.message);
    // Fallback to scraping existing scrapeVendors function and format as plain text table

    const scrapedVendors = await scrapeAgriVendors(location);
    if (scrapedVendors.length === 0) {
      return `No agricultural vendors found in ${location}.`;
    }

    // Format scraped vendors as plain text table
    let table = `Agricultural Vendors in ${location}\n\n`;
    table += '| ID | Name | Type | Latitude | Longitude | Address | Phone | Website |\n';
    table += '|----|------|------|----------|-----------|---------|-------|---------|\n';
    scrapedVendors.forEach((v, idx) => {
      table += `| ${idx + 1} | ${v.name || ''} | Unknown | N/A | N/A | ${v.address || ''} | ${v.contact || ''} | N/A |\n`;
    });
    table += `\n✅ ${scrapedVendors.length} agricultural vendors found in ${location}.\n`;
    return table;
  }
}

// -------------------------
// Web Scraping Function for Government Organizations
// -------------------------
async function scrapeGovernmentOrgs(location) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    const searchQueries = [
      `government agricultural offices in ${location}`,
      `agricultural department ${location}`,
      `ministry of agriculture ${location}`,
      `agriculture office ${location} government`,
      `agriculture board ${location}`,
      `farmers welfare department ${location}`,
      `agriculture authority ${location}`,
      `agriculture extension services ${location}`,
      `agriculture research institutes ${location}`,
      `government agriculture schemes ${location}`,
      `agricultural organizations ${location}`,
      `farm subsidies ${location}`,
      `agriculture cooperatives ${location}`,
      `government farming support ${location}`,
      `agriculture development office ${location}`,
      `farmers helpline ${location}`,
      `agriculture helpline ${location}`,
      `government schemes helpline ${location}`,
      `farm support contact ${location}`,
      `agriculture department contact ${location}`
    ];

    const allOrgs = [];

    for (const searchQuery of searchQueries) {
      if (allOrgs.length >= 10) break; // Stop if we have enough results

      console.log(`Searching for government orgs: ${searchQuery}`);

      const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}+contact+phone+address`;
      console.log(`Google Search URL: ${googleSearchUrl}`);
      await page.goto(googleSearchUrl, { waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Get the HTML content
      const html = await page.content();
      const $ = cheerio.load(html);

      // Extract organic search results
      $('.g, .result, [data-ved]').each((index, element) => {
        if (index >= 15) return; // Limit to 15 results per query

        const title = $(element).find('h3, .LC20lb').first().text().trim();
        const snippet = $(element).find('.VwiC3b, .aCOpRe, span').first().text().trim();
        const contact = $(element).find('a[href^="tel:"], a[href^="mailto:"], .LrzXr').first().text().trim();
        const address = $(element).find('.rllt__details div:nth-child(2)').first().text().trim() || snippet;

        // Function to extract phone numbers from text
        const extractPhoneNumbers = (text) => {
          const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\d{10}|\d{4}[-.\s]\d{6}|\d{3}[-.\s]\d{7}|\d{5}[-.\s]\d{5}|\d{4}[-.\s]\d{3}[-.\s]\d{3}|\d{3}[-.\s]\d{3}[-.\s]\d{4}|\d{2}[-.\s]\d{8}|\d{1}[-.\s]\d{9}|\d{10,12}|\d{4}[-.\s]\d{6}|\d{3}[-.\s]\d{7}|\d{5}[-.\s]\d{5}|\d{4}[-.\s]\d{3}[-.\s]\d{3}|\d{3}[-.\s]\d{3}[-.\s]\d{4}|\d{2}[-.\s]\d{8}|\d{1}[-.\s]\d{9}|\d{10,12}/g;
          const matches = text.match(phoneRegex);
          return matches ? matches.join(', ') : '';
        };

        // Extract phone numbers from snippet and title
        const phoneFromSnippet = extractPhoneNumbers(snippet);
        const phoneFromTitle = extractPhoneNumbers(title);
        const phoneFromContact = contact ? extractPhoneNumbers(contact) : '';

        const combinedContact = [phoneFromContact, phoneFromSnippet, phoneFromTitle].filter(p => p).join(', ') || 'Contact for details';

        // Filter for government agricultural offices
        if (title && title.length > 3 && (
          title.toLowerCase().includes('agriculture') ||
          title.toLowerCase().includes('farm') ||
          title.toLowerCase().includes('department') ||
          title.toLowerCase().includes('government') ||
          title.toLowerCase().includes('ministry') ||
          title.toLowerCase().includes('office') ||
          title.toLowerCase().includes('board') ||
          title.toLowerCase().includes('authority') ||
          title.toLowerCase().includes('welfare') ||
          title.toLowerCase().includes('extension') ||
          title.toLowerCase().includes('research') ||
          title.toLowerCase().includes('schemes') ||
          title.toLowerCase().includes('helpline') ||
          title.toLowerCase().includes('support')
        )) {
          allOrgs.push({
            name: title,
            address: address.substring(0, 100) || `${location} area`,
            contact: combinedContact
          });
        }
      });

      console.log(`Query "${searchQuery}" extracted ${allOrgs.length} organizations so far`);
    }

    // Remove duplicates and limit to 10 organizations
    const uniqueOrgs = allOrgs.filter((org, index, self) =>
      index === self.findIndex(o => o.name === org.name)
    ).slice(0, 10);

    console.log(`Final unique organizations:`, uniqueOrgs.length);
    return uniqueOrgs;

  } catch (error) {
    console.error('Government orgs scraping error:', error.message);
    return [];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// -------------------------
// Routes
// -------------------------

// New API endpoint for scraping agricultural vendors
app.post('/api/scrape-agri-vendors', async (req, res) => {
  const { location, search_radius_meters, max_results } = req.body;
  if (!location) {
    return res.status(400).json({ error: 'Location is required' });
  }
  try {
    const radius = search_radius_meters ? parseInt(search_radius_meters, 10) : 2000;
    const maxRes = max_results ? parseInt(max_results, 10) : 200;
    const resultTable = await scrapeAgriVendors(location, radius, maxRes);
    if (!resultTable) {
      return res.status(500).json({ error: 'Failed to scrape agricultural vendors' });
    }

    // Generate PDF with vendor data
    const doc = new PDFDocument();
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="agri_vendors_${location.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`);
      res.send(pdfBuffer);
    });

    // Add title
    doc.fontSize(18).text(`Agricultural Vendors in ${location}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`);
    doc.moveDown();

    // Parse the result table to extract vendor data
    const lines = resultTable.split('\n');
    const vendors = [];

    // Skip header lines and extract vendor data
    for (let i = 3; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.startsWith('✅') && !line.startsWith('---')) {
        // Parse table row: | ID | Name | Type | Lat | Lon | Address | Phone | Website | GST/ID | Source URL |
        const parts = line.split('|').map(p => p.trim());
        if (parts.length >= 11) {
          const vendor = {
            id: parts[1],
            name: parts[2],
            type: parts[3],
            lat: parts[4],
            lon: parts[5],
            address: parts[6],
            phone: parts[7],
            website: parts[8],
            gst_id: parts[9],
            source_url: parts[10]
          };

          // Skip vendors with empty or invalid data
          if (vendor.name && vendor.name !== 'Unknown' &&
              vendor.address && vendor.address !== 'N/A' &&
              (vendor.phone || vendor.website)) {
            vendors.push(vendor);
          }
        }
      }
    }

    // Add vendor details to PDF
    vendors.forEach((vendor, index) => {
      doc.moveDown();
      doc.fontSize(14).text(`${index + 1}. ${vendor.name}`, { underline: true });
      doc.moveDown(0.5);

      doc.fontSize(10);
      if (vendor.type && vendor.type !== 'Agricultural Vendor') {
        doc.text(`Type: ${vendor.type}`);
      }
      if (vendor.address && vendor.address !== 'N/A') {
        doc.text(`Address: ${vendor.address}`);
      }
      if (vendor.phone && vendor.phone !== '') {
        doc.text(`Phone: ${vendor.phone}`);
      }
      if (vendor.website && vendor.website !== '') {
        doc.text(`Website: ${vendor.website}`);
      }
      if (vendor.lat && vendor.lon && vendor.lat !== '' && vendor.lon !== '') {
        doc.text(`Coordinates: ${vendor.lat}, ${vendor.lon}`);
      }
      if (vendor.gst_id && vendor.gst_id !== '') {
        doc.text(`GST/ID: ${vendor.gst_id}`);
      }
      if (vendor.source_url && vendor.source_url !== '') {
        doc.text('View Location', { link: vendor.source_url });
      }
      doc.moveDown();
    });

    // Add summary
    doc.moveDown();
    doc.fontSize(12).text(`Total Vendors Found: ${vendors.length}`, { align: 'center' });

    doc.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

// Crop Analysis (Recommended Crops) - PDF Version
app.post('/api/crop-analysis', async (req, res) => {
  const { location, landSize, landType, landHealth, season, waterFacility, duration, language, crops } = req.body;
  if (!location || !landSize || !landType || !season || !waterFacility || !duration) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // If crops are provided in the request, use them for the report
  let reportContent = '';

  if (crops && crops.length > 0) {
    // Generate detailed report with investment and profit information
    reportContent = `Farm Advisory Report - Based on Your Specific Recommendations

Location: ${location}
Land Size: ${landSize}
Land Type: ${landType}
Land Health: ${landHealth}
Season: ${season}
Water Facility: ${waterFacility}
Duration: ${duration}

RECOMMENDED CROPS:
`;

    // Generate investment and profit data for each crop using AI
    for (let i = 0; i < crops.length; i++) {
      const crop = crops[i];

      try {
        const investmentPrompt = `You are an agricultural finance expert. Based on these farming conditions:
- Location: ${location}
- Land Type: ${landType}
- Land Health: ${landHealth}
- Season: ${season}
- Water Facility: ${waterFacility}
- Duration: ${duration}

For ${crop.name}, provide realistic investment and profit estimates in Indian Rupees per acre.

CRITICAL: Return ONLY valid JSON with this exact structure:
{
  "investment": "X,XXX - Y,YYY (including seeds, fertilizers, pesticides, and labor)",
  "profit": "A,AAA - B,BBB",
  "reasoning": "Brief explanation considering local conditions"
}

IMPORTANT RULES:
- Return ONLY the JSON object, no other text
- Do not include any explanations outside the JSON
- Do not use markdown formatting
- Do not include any prefixes or suffixes
- The investment and profit must be realistic ranges for ${location} conditions
- Reasoning should be brief and specific to the crop and conditions`;

        const investmentData = await callGeminiAPI(investmentPrompt);

        reportContent += `${i + 1}. ${crop.name}
   Required Investment (₹/acre): ${investmentData.investment || '8,000 - 12,000'}
   Expected Profit (₹/acre): ${investmentData.profit || '20,000 - 30,000'}
   Reasoning: ${investmentData.reasoning || crop.reason || 'Suitable for local conditions'}

`;
      } catch (error) {
        console.error(`Error generating investment data for ${crop.name}:`, error.message);
        // Fallback to default values
        reportContent += `${i + 1}. ${crop.name}
   Required Investment (₹/acre): 8,000 - 12,000 (including seeds, fertilizers, pesticides, and labor)
   Expected Profit (₹/acre): 20,000 - 30,000
   Reasoning: ${crop.reason || 'Suitable for local conditions'}

`;
      }
    }

    reportContent += `
ADDITIONAL RECOMMENDATIONS:

• Review each recommended crop carefully based on your local market conditions
• Consider consulting local agricultural experts for implementation
• Monitor weather patterns and adjust planting schedules accordingly
• Regular soil testing is recommended for optimal results
• Consider crop rotation for sustainable farming practices

NEXT STEPS:

1. Select crops that match your experience and resources
2. Plan your planting schedule based on seasonal conditions
3. Arrange for necessary inputs (seeds, fertilizers, equipment)
4. Consider market demand and pricing before final selection
5. Start with smaller plots for new crops to test suitability

For detailed farming plans for any of these crops, please visit the Crop Planning section of your application.

Generated on: ${new Date().toLocaleString()}
`;
  } else {
    // Fallback to AI-generated content if no crops provided
    const prompt = `You are a 40+ year experienced farmer. Based on these inputs:
Location: ${location}, Land Size: ${landSize}, Land Type: ${landType}, Land Health: ${landHealth}, Season: ${season}, Water Facility: ${waterFacility}, Duration: ${duration}

Generate a detailed farm advisory report recommending 3-5 crops suitable for these conditions.
Include for each crop:
- Crop name
- Required investment (₹/acre)
- Expected profit (₹/acre)
- Reasoning

Return ONLY plain text, not JSON. Structure the report as a professional text document with sections for each crop.
`;

    try {
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
      reportContent = data.candidates[0].content.parts[0].text.trim();
      reportContent = reportContent.replace(/```json\s*([\s\S]*?)```/g, '$1').replace(/```/g, '').trim();
    } catch (error) {
      reportContent = 'Error generating AI recommendations. Please try again later.';
    }
  }

  // Always generate PDF
  const doc = new PDFDocument();
  const buffers = [];

  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {
    const pdfBuffer = Buffer.concat(buffers);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="crop_advisory_report.pdf"');
    res.send(pdfBuffer);
  });

  doc.fontSize(16).text('Farm Advisory Report', { align: 'center' });
  doc.moveDown();

  // Treat content as text
  doc.fontSize(12).text(reportContent || 'No recommendations available.');

  doc.end();
});

// Recommended Crops - JSON Version
app.post('/api/recommended-crops', async (req, res) => {
  const { location, landSize, landType, landHealth, season, waterFacility, duration } = req.body;
  if (!location || !landSize || !landType || !season || !waterFacility || !duration) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const prompt = `You are a 40+ year experienced farmer. Based on these inputs:
Location: ${location}, Land Size: ${landSize}, Land Type: ${landType}, Land Health: ${landHealth}, Season: ${season}, Water Facility: ${waterFacility}, Duration: ${duration}

Recommend exactly 5 crops that are most suitable for these conditions.
Return ONLY a JSON array with this exact structure:
[
  {"name": "Crop Name 1", "reason": "Brief reason for recommendation"},
  {"name": "Crop Name 2", "reason": "Brief reason for recommendation"},
  {"name": "Crop Name 3", "reason": "Brief reason for recommendation"},
  {"name": "Crop Name 4", "reason": "Brief reason for recommendation"},
  {"name": "Crop Name 5", "reason": "Brief reason for recommendation"}
]

Do not include any additional text, explanations, or markdown formatting. Return only the JSON array.
`;

  try {
    const result = await callGeminiAPI(prompt);

    // Ensure we have exactly 5 crops
    let crops = Array.isArray(result) ? result : [];
    if (crops.length < 5) {
      // Add default crops if API returns fewer than 5
      const defaultCrops = [
        { name: "Wheat", reason: "Suitable for most regions and seasons" },
        { name: "Rice", reason: "Good for areas with water availability" },
        { name: "Cotton", reason: "Profitable cash crop for many regions" },
        { name: "Sugarcane", reason: "High value crop with good returns" },
        { name: "Maize", reason: "Versatile crop with multiple uses" }
      ];

      // Fill up to 5 crops with defaults
      while (crops.length < 5) {
        crops.push(defaultCrops[crops.length]);
      }
    }

    // Take only first 5 crops if more are returned
    crops = crops.slice(0, 5);

    res.json({ crops });
  } catch (error) {
    console.error('Error fetching recommended crops:', error.message);
    // Return default crops as fallback
    const defaultCrops = [
      { name: "Wheat", reason: "Suitable for most regions and seasons" },
      { name: "Rice", reason: "Good for areas with water availability" },
      { name: "Cotton", reason: "Profitable cash crop for many regions" },
      { name: "Sugarcane", reason: "High value crop with good returns" },
      { name: "Maize", reason: "Versatile crop with multiple uses" }
    ];
    res.json({ crops: defaultCrops });
  }
});

// Detailed Crop Plan
app.post('/api/crop-plan', async (req, res) => {
  const { cropName, location, landSize, landType, season, language } = req.body;
  if (!cropName) return res.status(400).json({ error: 'Crop name is required' });

  const prompt = `You are an expert agricultural consultant. Create a detailed farming plan for ${cropName}:
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

  const prompt = `You are an expert plant pathologist. Analyze this crop image for diseases. Crop type: ${cropType || 'Unknown'}
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
app.post('/api/local-market', async (req, res) => {
  const { location, crop } = req.body;
  if (!location) return res.status(400).json({ error: 'Missing location' });

  try {
    const vendors = await scrapeAgriVendors(location, crop);

    // If no vendors found from scraping, return mock data for demo
    if (vendors.length === 0) {
      const mockVendors = [
        {
          name: `${crop || 'Agricultural'} Supply Store - ${location}`,
          address: `${location} Main Road, Near Market Area`,
          contact: '+91-9876543210'
        },
        {
          name: `${location} Farmers Cooperative`,
          address: `${location} Agriculture Complex`,
          contact: '+91-9876543211'
        },
        {
          name: `${crop || 'Crop'} Dealers Hub`,
          address: `${location} Industrial Area`,
          contact: '+91-9876543212'
        }
      ];
      console.log('Returning mock vendors as scraping found no results');
      res.json({ vendors: mockVendors });
    } else {
      res.json({ vendors });
    }
  } catch (error) {
    console.error('Error fetching vendors:', error.message);
    res.json({ vendors: [] });
  }
});



// Bank Loans API endpoint updated to serve scraped data
app.post('/api/bank-loans', async (req, res) => {
  const { location, crop, landSize, landType } = req.body;
  const { format } = req.query;
  if (!location || !crop) return res.status(400).json({ error: 'Missing location or crop' });

  // Construct Gemini prompt for bank loan schemes
  const prompt = `You are an expert agricultural finance advisor. Based on the following details:
Location: ${location}
Crop: ${crop}
Land Size: ${landSize} acres
Land Type: ${landType}

Provide 4-6 relevant bank loan schemes or government subsidy programs available in this region for the crop and land type specified.
For each scheme, provide the following details in JSON format:
- scheme: Name of the bank or scheme
- description: What they offer in the region
- interestRate: Interest rate(s) and conditions
- loanAmount: Typical loan amount available
- apply: How to apply
- source: Source or bank name

Return ONLY a JSON array of these scheme objects without any additional text or explanation.
`;

  try {
    const schemes = await callGeminiAPI(prompt);

    if (format === 'pdf') {
      // Generate PDF
      const doc = new PDFDocument();
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="bank_loans_report_${location.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`);
        res.send(pdfBuffer);
      });

      doc.fontSize(16).text('Agricultural Finance Report', { align: 'center' });
      doc.moveDown();

      doc.fontSize(12).text(`Location: ${location}`);
      doc.text(`Land Size: ${landSize} acres`);
      doc.text(`Land Type: ${landType}`);
      doc.moveDown();

      doc.fontSize(14).text('Local Bank / RRB / State-Bank Interest Rate Info', { underline: true });
      doc.moveDown();

      schemes.forEach((scheme, idx) => {
        doc.fontSize(12).text(`${idx + 1}. ${scheme.scheme}`);
        doc.text(`   What they offer: ${scheme.description}`);
        doc.text(`   Interest Rate: ${scheme.interestRate}`);
        doc.text(`   How it applies: Applicable for ${landSize} acres of ${landType} land; ${scheme.loanAmount} available.`);
        doc.moveDown();
      });

      doc.fontSize(14).text('What This Means for You', { underline: true });
      doc.moveDown();
      doc.fontSize(12).text('- Short-term crop loans: Options like Kisan Credit Card are ideal for immediate needs.');
      doc.text('- Term loans: Schemes like AIF provide long-term financing.');
      doc.text('- Government subsidies: KCC, AIF, PM-KISAN.');
      doc.text('- Risks: Late repayment penalties, collateral requirements.');

      doc.end();
    } else {
      res.json({ schemes });
    }
  } catch (error) {
    console.error('Gemini API error:', error.message);
    res.status(500).json({ error: 'Failed to generate bank loan schemes' });
  }
});

// -------------------------
// Government Organizations API Endpoint (Dataset-based)
// -------------------------
app.get('/api/government-organizations', (req, res) => {
  try {
    const { location, district } = req.query;

    if (!location && !district) {
      return res.status(400).json({
        error: 'Location or district parameter is required',
        usage: 'Use ?location=Amritsar or ?district=Amritsar'
      });
    }

    const punjabData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'punjab_agriculture_data.json'), 'utf8'));

    // Find district (try both location and district parameters)
    const searchDistrict = (district || location).toLowerCase();
    const districtData = punjabData.districts.find(d =>
      d.district.toLowerCase() === searchDistrict ||
      d.district.toLowerCase().includes(searchDistrict) ||
      searchDistrict.includes(d.district.toLowerCase())
    );

    if (!districtData) {
      return res.status(404).json({
        error: 'District not found',
        availableDistricts: punjabData.districts.map(d => d.district),
        searchedFor: district || location
      });
    }

    // Structure the response with all government organizations
    const governmentOrganizations = {
      district: districtData.district,
      soilTestingLaboratories: districtData.soilTestingLaboratories.filter(lab =>
       lab.laboratoryName !== 'Data not available'
      ),
      agricultureOfficers: districtData.agricultureOfficers.filter(officer =>
        officer.officerName !== 'Data not available'
      ),
      farmerSupportHelplines: districtData.farmerSupportHelplines,
      tipsNotes: districtData.tipsNotes,
      metadata: {
        dataSource: 'Punjab Agriculture Department Dataset',
        lastUpdated: punjabData.metadata.lastUpdated,
        searchQuery: district || location
      }
    };

    res.json(governmentOrganizations);
  } catch (error) {
    console.error('Error fetching government organizations:', error.message);
    res.status(500).json({
      error: 'Failed to fetch government organizations',
      details: error.message
    });
  }
});

// Search government organizations across all districts
app.get('/api/government-organizations/search', (req, res) => {
  try {
    const { q, type } = req.query;

    if (!q) {
      return res.status(400).json({
        error: 'Search query is required',
        usage: 'Use ?q=amritsar or ?q=lab&type=soil'
      });
    }

    const punjabData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'punjab_agriculture_data.json'), 'utf8'));

    const results = [];

    punjabData.districts.forEach(district => {
      // Search in soil testing laboratories
      if (!type || type === 'soil' || type === 'lab') {
        district.soilTestingLaboratories.forEach(lab => {
          if (lab.laboratoryName.toLowerCase().includes(q.toLowerCase()) ||
              lab.location.toLowerCase().includes(q.toLowerCase())) {
            results.push({
              district: district.district,
              type: 'Soil Testing Laboratory',
              name: lab.laboratoryName,
              location: lab.location,
              contact: lab.contact,
              services: lab.services
            });
          }
        });
      }

      // Search in agriculture officers
      if (!type || type === 'officer') {
        district.agricultureOfficers.forEach(officer => {
          if (officer.officerName.toLowerCase().includes(q.toLowerCase()) ||
              officer.role.toLowerCase().includes(q.toLowerCase())) {
            results.push({
              district: district.district,
              type: 'Agriculture Officer',
              name: officer.officerName,
              role: officer.role,
              contact: officer.contact,
              description: officer.description
            });
          }
        });
      }

      // Search in helplines
      if (!type || type === 'helpline') {
        district.farmerSupportHelplines.forEach(helpline => {
          if (helpline.contact.toLowerCase().includes(q.toLowerCase()) ||
              helpline.details.toLowerCase().includes(q.toLowerCase())) {
            results.push({
              district: district.district,
              type: 'Farmer Support Helpline',
              contact: helpline.contact,
              details: helpline.details
            });
          }
        });
      }
    });

    res.json({
      query: q,
      type: type || 'all',
      results: results,
      count: results.length
    });
  } catch (error) {
    console.error('Error searching government organizations:', error.message);
    res.status(500).json({
      error: 'Failed to search government organizations',
      details: error.message
    });
  }
});

// -------------------------
// Punjab Agriculture Data API Endpoints
// -------------------------

// Get all Punjab districts data
app.get('/api/punjab-agriculture', (req, res) => {
  try {
    const punjabData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'punjab_agriculture_data.json'), 'utf8'));
    res.json(punjabData);
  } catch (error) {
    console.error('Error reading Punjab agriculture data:', error.message);
    res.status(500).json({ error: 'Failed to load Punjab agriculture data' });
  }
});

// Get specific district data
app.get('/api/punjab-agriculture/district/:districtName', (req, res) => {
  try {
    const districtName = req.params.districtName;
    const punjabData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'punjab_agriculture_data.json'), 'utf8'));

    const district = punjabData.districts.find(d =>
      d.district.toLowerCase() === districtName.toLowerCase()
    );

    if (!district) {
      return res.status(404).json({ error: 'District not found' });
    }

    res.json(district);
  } catch (error) {
    console.error('Error fetching district data:', error.message);
    res.status(500).json({ error: 'Failed to fetch district data' });
  }
});

// Get soil testing laboratories for a district
app.get('/api/punjab-agriculture/district/:districtName/soil-labs', (req, res) => {
  try {
    const districtName = req.params.districtName;
    const punjabData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'punjab_agriculture_data.json'), 'utf8'));

    const district = punjabData.districts.find(d =>
      d.district.toLowerCase() === districtName.toLowerCase()
    );

    if (!district) {
      return res.status(404).json({ error: 'District not found' });
    }

    res.json({
      district: district.district,
      soilTestingLaboratories: district.soilTestingLaboratories
    });
  } catch (error) {
    console.error('Error fetching soil labs data:', error.message);
    res.status(500).json({ error: 'Failed to fetch soil labs data' });
  }
});

// Get agriculture officers for a district
app.get('/api/punjab-agriculture/district/:districtName/officers', (req, res) => {
  try {
    const districtName = req.params.districtName;
    const punjabData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'punjab_agriculture_data.json'), 'utf8'));

    const district = punjabData.districts.find(d =>
      d.district.toLowerCase() === districtName.toLowerCase()
    );

    if (!district) {
      return res.status(404).json({ error: 'District not found' });
    }

    res.json({
      district: district.district,
      agricultureOfficers: district.agricultureOfficers
    });
  } catch (error) {
    console.error('Error fetching officers data:', error.message);
    res.status(500).json({ error: 'Failed to fetch officers data' });
  }
});

// Get farmer support helplines for a district
app.get('/api/punjab-agriculture/district/:districtName/helplines', (req, res) => {
  try {
    const districtName = req.params.districtName;
    const punjabData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'punjab_agriculture_data.json'), 'utf8'));

    const district = punjabData.districts.find(d =>
      d.district.toLowerCase() === districtName.toLowerCase()
    );

    if (!district) {
      return res.status(404).json({ error: 'District not found' });
    }

    res.json({
      district: district.district,
      farmerSupportHelplines: district.farmerSupportHelplines
    });
  } catch (error) {
    console.error('Error fetching helplines data:', error.message);
    res.status(500).json({ error: 'Failed to fetch helplines data' });
  }
});

// Get tips and notes for a district
app.get('/api/punjab-agriculture/district/:districtName/tips', (req, res) => {
  try {
    const districtName = req.params.districtName;
    const punjabData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'punjab_agriculture_data.json'), 'utf8'));

    const district = punjabData.districts.find(d =>
      d.district.toLowerCase() === districtName.toLowerCase()
    );

    if (!district) {
      return res.status(404).json({ error: 'District not found' });
    }

    res.json({
      district: district.district,
      tipsNotes: district.tipsNotes
    });
  } catch (error) {
    console.error('Error fetching tips data:', error.message);
    res.status(500).json({ error: 'Failed to fetch tips data' });
  }
});

// Get all districts list
app.get('/api/punjab-agriculture/districts', (req, res) => {
  try {
    const punjabData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'punjab_agriculture_data.json'), 'utf8'));

    const districts = punjabData.districts.map(d => ({
      name: d.district,
      hasData: d.soilTestingLaboratories[0].laboratoryName !== 'Data not available'
    }));

    res.json({
      districts: districts,
      total: districts.length,
      metadata: punjabData.metadata
    });
  } catch (error) {
    console.error('Error fetching districts list:', error.message);
    res.status(500).json({ error: 'Failed to fetch districts list' });
  }
});

// Search districts by name
app.get('/api/punjab-agriculture/search', (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const punjabData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'punjab_agriculture_data.json'), 'utf8'));

    const matchingDistricts = punjabData.districts.filter(d =>
      d.district.toLowerCase().includes(q.toLowerCase())
    );

    res.json({
      query: q,
      results: matchingDistricts,
      count: matchingDistricts.length
    });
  } catch (error) {
    console.error('Error searching districts:', error.message);
    res.status(500).json({ error: 'Failed to search districts' });
  }
});

// Get complete district summary
app.get('/api/punjab-agriculture/district/:districtName/summary', (req, res) => {
  try {
    const districtName = req.params.districtName;
    const punjabData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'punjab_agriculture_data.json'), 'utf8'));

    const district = punjabData.districts.find(d =>
      d.district.toLowerCase() === districtName.toLowerCase()
    );

    if (!district) {
      return res.status(404).json({ error: 'District not found' });
    }

    // Create a summary with key information
    const summary = {
      district: district.district,
      overview: {
        soilLabsCount: district.soilTestingLaboratories.length,
        officersCount: district.agricultureOfficers.length,
        helplinesCount: district.farmerSupportHelplines.length,
        tipsCount: district.tipsNotes.length
      },
      keyContacts: {
        primaryOfficer: district.agricultureOfficers[0]?.officerName || 'Data not available',
        primaryContact: district.agricultureOfficers[0]?.contact || 'Data not available',
        mainHelpline: district.farmerSupportHelplines[0]?.contact || 'Data not available'
      },
      services: {
        soilTesting: district.soilTestingLaboratories[0]?.services || 'Data not available',
        officerDescription: district.agricultureOfficers[0]?.description || 'Data not available'
      },
      topTips: district.tipsNotes.slice(0, 2) // First 2 tips
    };

    res.json(summary);
  } catch (error) {
    console.error('Error fetching district summary:', error.message);
    res.status(500).json({ error: 'Failed to fetch district summary' });
  }
});

// -------------------------
// Start Server
// -------------------------
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});