import express from 'express';
import Redis from 'ioredis';

const app = express();
app.set('trust proxy', true); // Ensures correct IP handling behind Railway proxy

// ✅ Redis client
const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null
});

// ✅ Shared ID generator
const generateId = async (prefix, key) => {
  const count = await redis.incr(key);
  const padded = String(count).padStart(4, '0');
  return `${prefix}-${padded}`;
};

// ✅ /eq — Enquiry Quote ID
app.get('/eq', async (req, res) => {
  try {
    const id = await generateId('EQ', 'eq_counter');
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate EQ ID', details: err.message });
  }
});

// ✅ /qt — Formal Quote ID
app.get('/qt', async (req, res) => {
  try {
    const id = await generateId('QT', 'qt_counter');
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QT ID', details: err.message });
  }
});

// ✅ /jb — Job ID
app.get('/jb', async (req, res) => {
  try {
    const id = await generateId('JB', 'jb_counter');
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate JB ID', details: err.message });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Counter microservice running on port ${PORT}`);
});
