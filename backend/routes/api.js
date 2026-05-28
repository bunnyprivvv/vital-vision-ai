const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const mysql = require('mysql2/promise');
const crypto = require('crypto');

const upload = multer({ dest: 'uploads/' });

function generateWeb3Hash(data) {
  return 'ipfs://' + crypto.createHash('sha256').update(JSON.stringify(data) + Date.now()).digest('hex').substring(0, 32);
}

// Database Connection Pool with fallback Mock
let pool;
// Default to true for demo environment if not explicitly set to false
const isMock = process.env.USE_MOCK_DB !== 'false'; 

if (isMock) {
  console.log("--------------------------------------------------");
  console.log("🚀 ACTIVATING MOCK IN-MEMORY DATABASE MODE");
  console.log("--------------------------------------------------");
  const mockLogs = [];
  let mockId = 1;
  pool = {
    execute: async (query, params) => {
      console.log(`[MOCK DB] Executing: ${query.substring(0, 50)}...`);
      if (query.toUpperCase().startsWith('INSERT')) {
        const [userId, scanType, score, category, findings] = params;
        const log = { LogID: mockId++, UserID: userId, ScanType: scanType, ResultScore: score, RiskCategory: category, Findings: findings, ScanDate: new Date().toISOString() };
        mockLogs.push(log);
        return [{ insertId: log.LogID }];
      } else if (query.startsWith('SELECT')) {
        const userId = params[0];
        return [mockLogs.filter(l => l.UserID === userId).reverse().slice(0, 10)];
      }
    }
  };
} else {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'health_user',
    password: process.env.DB_PASSWORD || 'health_password',
    database: process.env.DB_NAME || 'health_ai',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';

router.post('/hemascan', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    const userId = req.body.userId || 1; // Default to demo user

    if (!file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // Forward image to AI Engine
    const formData = new FormData();
    formData.append('image', fs.createReadStream(file.path), file.originalname);

    const aiRes = await axios.post(`${AI_ENGINE_URL}/analyze/eye`, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });

    const aiResult = aiRes.data; // e.g. { risk_score: 45, category: 'Moderate', details: '...' }
    aiResult.web3Hash = generateWeb3Hash(aiResult);

    // Log to DB
    const [result] = await pool.execute(
      'INSERT INTO HealthLogs (UserID, ScanType, ResultScore, RiskCategory, Findings) VALUES (?, ?, ?, ?, ?)',
      [userId, 'EyeScan', aiResult.score, aiResult.category, JSON.stringify(aiResult)]
    );

    // Clean up temp file
    fs.unlinkSync(file.path);

    res.json({
      success: true,
      logId: result.insertId,
      analysis: aiResult
    });

  } catch (err) {
    console.error('HemaScan Error:', err);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: 'Failed to process HemaScan' });
  }
});

router.post('/audiotriage', upload.single('audio'), async (req, res) => {
  try {
    const file = req.file;
    const userId = req.body.userId || 1;

    if (!file) {
      return res.status(400).json({ error: 'No audio uploaded' });
    }

    // Forward audio to AI Engine
    const formData = new FormData();
    formData.append('audio', fs.createReadStream(file.path), {
      filename: file.originalname,
      contentType: req.file.mimetype || 'audio/webm' // Or other mimetype
    });

    const aiRes = await axios.post(`${AI_ENGINE_URL}/analyze/audio`, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });

    const aiResult = aiRes.data;
    aiResult.web3Hash = generateWeb3Hash(aiResult);

    // Log to DB
    const [result] = await pool.execute(
      'INSERT INTO HealthLogs (UserID, ScanType, ResultScore, RiskCategory, Findings) VALUES (?, ?, ?, ?, ?)',
      [userId, 'CoughAudio', aiResult.score, aiResult.category, JSON.stringify(aiResult)]
    );

    // Clean up temp file
    fs.unlinkSync(file.path);

    res.json({
      success: true,
      logId: result.insertId,
      analysis: aiResult
    });

  } catch (err) {
    console.error('AudioTriage Error:', err);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: 'Failed to process AudioTriage' });
  }
});

router.post('/dermoscan', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    const userId = req.body.userId || 1;

    if (!file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const formData = new FormData();
    formData.append('image', fs.createReadStream(file.path), file.originalname);

    const aiRes = await axios.post(`${AI_ENGINE_URL}/analyze/dermo`, formData, {
      headers: { ...formData.getHeaders() }
    });

    const aiResult = aiRes.data;
    aiResult.web3Hash = generateWeb3Hash(aiResult);

    const [result] = await pool.execute(
      'INSERT INTO HealthLogs (UserID, ScanType, ResultScore, RiskCategory, Findings) VALUES (?, ?, ?, ?, ?)',
      [userId, 'DermoScan', aiResult.score, aiResult.category, JSON.stringify(aiResult)]
    );

    fs.unlinkSync(file.path);

    res.json({
      success: true,
      logId: result.insertId,
      analysis: aiResult
    });
  } catch (err) {
    console.error('DermoScan Error:', err);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: 'Failed to process DermoScan' });
  }
});

router.post('/emotionscan', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    const userId = req.body.userId || 1;

    if (!file) return res.status(400).json({ error: 'No image uploaded' });

    const formData = new FormData();
    formData.append('image', fs.createReadStream(file.path), file.originalname);

    const aiRes = await axios.post(`${AI_ENGINE_URL}/analyze/emotion`, formData, {
      headers: { ...formData.getHeaders() }
    });

    const aiResult = aiRes.data;
    aiResult.web3Hash = generateWeb3Hash(aiResult);

    const [result] = await pool.execute(
      'INSERT INTO HealthLogs (UserID, ScanType, ResultScore, RiskCategory, Findings) VALUES (?, ?, ?, ?, ?)',
      [userId, 'EmotionScan', aiResult.score, aiResult.category, JSON.stringify(aiResult)]
    );

    fs.unlinkSync(file.path);
    res.json({ success: true, logId: result.insertId, analysis: aiResult });
  } catch (err) {
    console.error('EmotionScan Error:', err);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: 'Failed to process EmotionScan' });
  }
});

router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.execute(
      'SELECT * FROM HealthLogs WHERE UserID = ? ORDER BY ScanDate DESC LIMIT 10',
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

router.post('/chat', (req, res) => {
  const { message, currentScore } = req.body;
  const lowerMsg = message.toLowerCase();
  
  setTimeout(() => { // simulate LLM latency
    let reply = "That's an excellent question. Based on your current telemetry, maintaining hydration and resting is key.";
    
    if (lowerMsg.includes('food') || lowerMsg.includes('diet') || lowerMsg.includes('eat')) {
      if (currentScore < 80) {
        reply = "Since your recent Health Score indicates some risk (like pallor), I highly recommend iron-rich foods: spinach, red meat, lentils, and fortified cereals, along with Vitamin C to boost absorption.";
      } else {
        reply = "Your score is fantastic! Maintain a balanced diet of lean proteins, complex carbs, and plenty of leafy greens.";
      }
    } else if (lowerMsg.includes('doctor') || lowerMsg.includes('hospital')) {
      reply = currentScore < 50 
        ? "Your score has dropped significantly. Yes, I strongly advise scheduling an appointment with your primary care physician to review these indicators." 
        : "Your vitals seem stable right now. No immediate hospital visit is necessary based on telemetry, but always trust how your body physically feels.";
    } else if (lowerMsg.includes('cough') || lowerMsg.includes('lung')) {
      reply = "For respiratory irregularities observed in your AudioTriage, humidifiers, warm teas, and avoiding cold/dry air can help. Monitor if a fever develops.";
    } else if (lowerMsg.includes('improve') || lowerMsg.includes('better')) {
      reply = `Your current unified score is ${Math.round(currentScore)}. To bump this up, strive for 8 hours of sleep, elevate your heart rate 30 mins a day, and run another Health AI diagnostic tomorrow to track your trend line!`;
    }

    res.json({ reply });
  }, 1000);
});

module.exports = router;
