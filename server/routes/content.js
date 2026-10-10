const express = require('express');
const router = express.Router();
const { callGranite, buildSystemPrompt } = require('../granite');

const CAPTION_TEMPLATES = {
  instagram: [
    (brand, topic) => `✨ ${topic} — and we're here for it. At ${brand}, we believe every step forward matters. Drop a 🙌 if you agree! #${topic.replace(/\s+/g,'')} #BrandStory`,
    (brand, topic) => `The secret to ${topic}? It starts with intention. Here's what we've learned at ${brand} 👇 [SWIPE FOR TIPS] #GrowthMindset #${brand.replace(/\s+/g,'')}`,
    (brand, topic) => `📢 Big things are happening around ${topic}! Stay tuned as ${brand} brings you something special. Save this post to stay updated 🔖 #ComingSoon`,
  ],
  twitter: [
    (brand, topic) => `Thread on ${topic} 🧵 Here's what ${brand} learned after 6 months of testing. Read on 👇`,
    (brand, topic) => `Hot take: ${topic} is underrated in 2025. Here's why ${brand} is doubling down on it 👇`,
    (brand, topic) => `We asked our community about ${topic}. The results surprised us. What's your take? @${brand.replace(/\s+/g,'')}`,
  ],
  linkedin: [
    (brand, topic) => `At ${brand}, we've been thinking deeply about ${topic}.\n\nHere's what the data shows — and why it matters for your strategy in 2025:\n\n[1/5 key insight]\n\n#${topic.replace(/\s+/g,'')} #ThoughtLeadership #Innovation`,
    (brand, topic) => `${topic} isn't just a trend — it's a fundamental shift.\n\n${brand}'s team shares 3 lessons from the front lines:\n\n💡 Insight 1: ...\n💡 Insight 2: ...\n💡 Insight 3: ...\n\nWhat are you seeing in your industry? #Leadership #B2B`,
  ],
  facebook: [
    (brand, topic) => `We'd love your input! 🙋‍♀️ ${brand} is exploring ${topic} and we want to hear from our community. What matters most to you? Drop your thoughts below! 👇`,
    (brand, topic) => `📖 The story of ${topic} at ${brand} — from idea to reality. Read our latest blog post and let us know what you think! 💬 Link in comments.`,
  ],
};

function getMockContent(profile, topic, platform, contentType) {
  const brand = profile.brandName || 'Your Brand';
  const plat = platform || 'instagram';
  const templates = CAPTION_TEMPLATES[plat] || CAPTION_TEMPLATES.instagram;
  const caption = templates[Math.floor(Math.random() * templates.length)](brand, topic || 'our latest update');

  const hashtags = [
    `#${brand.replace(/\s+/g, '')}`,
    `#${(profile.industry || 'Business').replace(/\s+/g, '')}`,
    '#ContentStrategy',
    '#SocialMediaMarketing',
    '#BrandAwareness',
    '#GrowthHacking',
    '#DigitalMarketing',
    '#Engagement',
  ];

  const ideas = [
    `📸 Behind-the-scenes look at how ${brand} approaches ${topic}`,
    `🎥 Short-form video: "5 things we wish we knew about ${topic}"`,
    `📊 Infographic: Key stats about ${topic} in the ${profile.industry || 'industry'}`,
    `🤝 User-generated content campaign: Ask your audience to share their ${topic} story`,
    `🎙️ Live Q&A session on ${plat}: Answer top questions about ${topic}`,
    `📝 Thought leadership article: "${brand}'s take on the future of ${topic}"`,
  ];

  return { caption, hashtags, ideas, platform: plat };
}

router.post('/generate', async (req, res) => {
  const { profile = {}, topic, platform, contentType } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required.' });
  }

  const systemPrompt = buildSystemPrompt(profile);
  const userMsg = `Generate social media content for the topic: "${topic}" on platform: ${platform || 'Instagram'}.
Include:
1. A compelling caption (platform-appropriate length and tone)
2. 8 relevant hashtags
3. 5 creative campaign/content ideas
Brand: ${profile.brandName || 'our brand'}, Industry: ${profile.industry || 'general'}, Audience: ${profile.audience || 'general public'}.
Format the response as JSON with keys: caption, hashtags (array), ideas (array).`;

  const liveResponse = await callGranite(systemPrompt, userMsg);

  if (liveResponse) {
    let parsed;
    try {
      // Try to extract JSON from Granite's response
      const jsonMatch = liveResponse.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      parsed = null;
    }

    if (parsed && parsed.caption) {
      return res.json({ ...parsed, platform, source: 'IBM Granite LLM', model: 'granite-3-3-8b-instruct' });
    }
    // If not JSON parseable, return as plain caption
    return res.json({ caption: liveResponse, hashtags: [], ideas: [], platform, source: 'IBM Granite LLM' });
  }

  // Mock fallback
  const mock = getMockContent(profile, topic, platform, contentType);
  res.json({
    ...mock,
    source: 'Mock Response',
    note: '⚠️ IBM Granite not configured. Add WATSONX_API_KEY and WATSONX_PROJECT_ID to .env for live AI generation.',
  });
});

module.exports = router;
