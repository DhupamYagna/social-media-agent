const express = require('express');
const router = express.Router();
const trendsData = require('../data/trends.json');

router.get('/', (req, res) => {
  const { platform = 'instagram' } = req.query;
  const data = trendsData.trends[platform] || trendsData.trends.instagram;
  res.json({
    platform,
    trends: data,
    meta: trendsData.meta,
  });
});

router.get('/all', (req, res) => {
  res.json({ trends: trendsData.trends, meta: trendsData.meta });
});

module.exports = router;
