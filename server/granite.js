const axios = require('axios');

const WATSONX_URL = process.env.WATSONX_URL || 'https://us-south.ml.cloud.ibm.com';
const MODEL_ID = 'ibm/granite-3-3-8b-instruct';

let cachedToken = null;
let tokenExpiry = null;

async function getIAMToken() {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) return cachedToken;
  const resp = await axios.post(
    'https://iam.cloud.ibm.com/identity/token',
    new URLSearchParams({ grant_type: 'urn:ibm:params:oauth:grant-type:apikey', apikey: process.env.WATSONX_API_KEY }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  cachedToken = resp.data.access_token;
  tokenExpiry = Date.now() + (resp.data.expires_in - 60) * 1000;
  return cachedToken;
}

async function callGranite(systemPrompt, userMessage) {
  if (!process.env.WATSONX_API_KEY || !process.env.WATSONX_PROJECT_ID) {
    return null; // signal to use mock
  }
  try {
    const token = await getIAMToken();
    const response = await axios.post(
      `${WATSONX_URL}/ml/v1/text/chat?version=2024-05-31`,
      {
        model_id: MODEL_ID,
        project_id: process.env.WATSONX_PROJECT_ID,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        parameters: {
          max_new_tokens: 600,
          temperature: 0.7,
          top_p: 0.9,
        }
      },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );
    return response.data.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.error('Granite API error:', err.response?.data || err.message);
    return null;
  }
}

function buildSystemPrompt(profile) {
  return `You are Granite Social Coach, an expert social media strategist powered by IBM Granite LLM.
You are assisting ${profile.brandName || 'a brand'} in the ${profile.industry || 'general'} industry.
Target audience: ${profile.audience || 'general public'}.
Preferred platforms: ${(profile.platforms || []).join(', ') || 'all platforms'}.
Campaign goals: ${profile.goals || 'increase brand awareness'}.

Always be Helpful, Accurate, and Mindful (HAM tone).
Never fabricate statistics or data. If you cite a number, note it is an estimate.
Never recommend illegal, discriminatory, harmful, or misleading content.
Keep responses concise, actionable, and professional.
If you are uncertain, say so clearly rather than guessing.
All insights based on sample data are illustrative only.`;
}

module.exports = { callGranite, buildSystemPrompt };
