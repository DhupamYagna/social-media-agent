const express = require('express');
const router = express.Router();
const { callGranite, buildSystemPrompt } = require('../granite');

const MOCK_RESPONSES = [
  (q) => `Great question about "${q}"! For social media success, consistency is key. Focus on posting at peak engagement times (9-11 AM and 6-8 PM in your target timezone), use a mix of educational and entertaining content (the 80/20 rule), and always respond to comments within 2 hours to boost algorithmic reach.`,
  (q) => `Regarding "${q}": The most effective strategy combines authentic storytelling with data-driven timing. Start by auditing your top 5 performing posts to find patterns in format, length, and hashtag usage. Then replicate those winning elements consistently.`,
  (q) => `For your question on "${q}": Platform algorithms reward content that drives saves and shares over likes. Create "bookmark-worthy" content — infographics, how-to carousels, and checklist posts consistently outperform text-only updates by 3-5x in organic reach.`,
  (q) => `Addressing "${q}": Building a loyal community matters more than chasing follower counts. Prioritize 1:1 engagement in comments and DMs, use interactive features like polls and Q&As, and collaborate with micro-influencers (10K-100K followers) who have genuine niche authority.`,
];

// Ethics guardrail: detect and block harmful inputs
function ethicsFilter(text) {
  const blocked = ['hack', 'spam', 'fake followers', 'buy followers', 'deceive', 'mislead', 'phishing'];
  const lower = text.toLowerCase();
  return blocked.some(w => lower.includes(w));
}

router.post('/query', async (req, res) => {
  const { query, profile = {} } = req.body;

  if (!query || query.trim().length < 3) {
    return res.status(400).json({ error: 'Query too short.' });
  }

  if (ethicsFilter(query)) {
    return res.status(400).json({
      error: 'This request violates our AI ethics guidelines. Please ask about legitimate social media strategies.',
      type: 'ETHICS_BLOCK'
    });
  }

  const systemPrompt = buildSystemPrompt(profile);
  const liveResponse = await callGranite(systemPrompt, query);

  if (liveResponse) {
    return res.json({ answer: liveResponse, source: 'IBM Granite LLM', model: 'granite-3-3-8b-instruct' });
  }

  // Mock fallback
  const mockIdx = Math.floor(Math.random() * MOCK_RESPONSES.length);
  const answer = MOCK_RESPONSES[mockIdx](query);
  res.json({
    answer,
    source: 'Mock Response',
    note: '⚠️ IBM Granite not configured. Add WATSONX_API_KEY and WATSONX_PROJECT_ID to .env for live AI responses.',
  });
});

module.exports = router;
