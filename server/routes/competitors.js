const express = require('express');
const router = express.Router();
const competitorsData = require('../data/competitors.json');

router.get('/', (req, res) => {
  const { names } = req.query; // comma-separated names to filter
  let result = competitorsData.competitors;
  if (names) {
    const nameList = names.split(',').map(n => n.trim().toLowerCase());
    result = result.filter(c => nameList.includes(c.name.toLowerCase()));
  }
  res.json({ competitors: result, meta: competitorsData.meta });
});

module.exports = router;
