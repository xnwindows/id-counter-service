import express from 'express';
import Redis from 'ioredis';

const app = express();
app.set('trust proxy', true);

const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null
});

const generateId = async (prefix, key) => {
  const count = await redis.incr(key);
  const padded = String(count).padStart(4, '0');
  return `${prefix}-${padded}`;
};

app.get('/init', async (req, res) => {
  try {
    await redis.set('eq_counter', 4000);
    await redis.set('qt_counter', 4000);
    await redis.set('jb_counter', 4000);
    res.send('All counters set to 4000.');
  } catch (err) {
    res.status(500).json({ error: 'Failed to initialize counters', details: err.message });
  }
});

app.get('/eq', async (req, res) => {
  try {
    const id = await generateId('EQ', 'eq_counter');
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate EQ ID', details: err.message });
  }
});

app.get('/qt', async (req, res) => {
  try {
    const id = await generateId('QT', 'qt_counter');
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QT ID', details: err.message });
  }
});

app.get('/jb', async (req, res) => {
  try {
    const id = await generateId('JB', 'jb_counter');
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate JB ID', details: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Counter microservice running on port ${PORT}`);
});
