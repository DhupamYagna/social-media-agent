const express = require('express');
const router = express.Router();
const sentimentData = require('../data/sentiment.json');

router.get('/', (req, res) => {
  const { platform = 'instagram' } = req.query;
  const entry = sentimentData.sentiment_samples.find(s => s.platform === platform)
    || sentimentData.sentiment_samples[0];
  res.json({ sentiment: entry, meta: sentimentData.meta });
});

router.get('/all', (req, res) => {
  res.json({ sentiments: sentimentData.sentiment_samples, meta: sentimentData.meta });
});

module.exports = router;
