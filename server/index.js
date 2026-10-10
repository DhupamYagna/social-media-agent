require('dotenv').config();
const express = require('express');
const cors = require('cors');

const agentRoutes = require('./routes/agent');
const trendsRoutes = require('./routes/trends');
const sentimentRoutes = require('./routes/sentiment');
const competitorsRoutes = require('./routes/competitors');
const contentRoutes = require('./routes/content');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Routes
app.use('/api/agent', agentRoutes);
app.use('/api/trends', trendsRoutes);
app.use('/api/sentiment', sentimentRoutes);
app.use('/api/competitors', competitorsRoutes);
app.use('/api/content', contentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    granite_configured: !!(process.env.WATSONX_API_KEY && process.env.WATSONX_PROJECT_ID),
    mode: (process.env.WATSONX_API_KEY && process.env.WATSONX_PROJECT_ID) ? 'live' : 'mock',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Social Media Agent Server running on http://localhost:${PORT}`);
  const hasGranite = process.env.WATSONX_API_KEY && process.env.WATSONX_PROJECT_ID;
  console.log(`🤖 IBM Granite: ${hasGranite ? '✅ Configured (live mode)' : '⚠️  Not configured (using mock responses)'}`);
  console.log(`📊 Sample data: social-media-agent/server/data/\n`);
});
