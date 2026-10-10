# Social Media Agentic AI Application — Project Plan

> **IBM Granite LLM · Agentic AI SDLC · Web-Based Dashboard**

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Agentic AI SDLC Phases](#2-agentic-ai-sdlc-phases)
3. [System Architecture](#3-system-architecture)
4. [Agent Design](#4-agent-design)
5. [Technology Stack](#5-technology-stack)
6. [Data Strategy](#6-data-strategy)
7. [AI Ethics & Guardrails](#7-ai-ethics--guardrails)
8. [Development Roadmap](#8-development-roadmap)
9. [Testing Strategy](#9-testing-strategy)
10. [Deployment & Operations](#10-deployment--operations)
11. [Disclaimer](#11-disclaimer)

---

## 1. Project Overview

### Purpose
Build a **web-based Social Media Agentic AI Application** powered by IBM Granite LLM that helps brands plan, analyze, and execute social media campaigns autonomously.

### Key Capabilities
| Capability | Description |
|---|---|
| **User Onboarding** | Collect brand name, industry, target audience, platforms, goals, competitor names |
| **Trend Analysis** | Detect rising topics, hashtags, and content formats per platform |
| **Sentiment Analysis** | Score audience sentiment from comments and engagement data |
| **Competitor Intelligence** | Monitor competitor posting frequency, tone, and engagement |
| **Content Generation** | Produce captions, hashtags, campaign briefs via IBM Granite |
| **Agentic Query Resolution** | Answer free-form social media strategy questions autonomously |

### Success Criteria
- Agent resolves ≥ 90% of common social media queries without human escalation
- Content suggestions rated relevant by users ≥ 80% of the time
- Dashboard loads within 2 seconds on standard hardware
- All outputs comply with defined AI ethics guardrails

---

## 2. Agentic AI SDLC Phases

### Phase 1 — Problem Definition & Goal Setting
**Objective:** Establish what the agent must do, who it serves, and how success is measured.

- Define agent persona: *Granite Social Coach* — helpful, respectful, brand-aware
- Identify primary users: Social media managers, brand teams, solo entrepreneurs
- Map user journeys: onboarding → analysis → content generation → publish planning
- Define guardrails: no hallucinated statistics, no biased platform recommendations, no PII storage
- Deliverable: Requirements specification and ethics charter

### Phase 2 — Data Strategy & Collection
**Objective:** Identify, procure, and prepare data sources.

- **Live data** (when API keys provided): Twitter/X API v2, Reddit API, LinkedIn API, Instagram Graph API
- **Sample data** (default): Pre-built JSON datasets of simulated trends, sentiments, and competitor posts
- Data labels: All sample data is clearly marked `[SAMPLE DATA]` in UI and API responses
- Privacy: No PII collected; brand data stored only in session/local state
- Deliverable: `data/` directory with sample datasets and data loader module

### Phase 3 — Agent Architecture Design
**Objective:** Design the multi-step reasoning and tool-use pipeline.

```
User Input → Intent Classifier → Router
                                   ├── Trend Analysis Tool
                                   ├── Sentiment Analysis Tool
                                   ├── Competitor Intelligence Tool
                                   ├── Content Generation Tool (Granite LLM)
                                   └── General QA Tool (Granite LLM)
                                 ↓
                           Response Formatter → Ethics Filter → UI
```

- **Planner:** IBM Granite LLM decides which tool(s) to invoke
- **Tools:** Modular functions with defined input/output schemas
- **Memory:** Short-term session context (brand profile); no persistent PII
- **Guardrails:** Input sanitization, output toxicity filter, factual confidence threshold
- Deliverable: Agent architecture diagram and API contract

### Phase 4 — Development
**Objective:** Build the full application.

#### 4.1 Backend (Node.js / Express)
- `/api/agent/query` — general Q&A via Granite
- `/api/trends` — trend analysis per platform
- `/api/sentiment` — sentiment scoring
- `/api/competitors` — competitor insights
- `/api/content/generate` — AI content generation
- `/api/profile` — save/load brand profile (session only)

#### 4.2 Frontend (React + Vite)
- **Onboarding Wizard** — multi-step form to collect brand profile
- **Dashboard** — summary widgets: sentiment score, top trends, competitor activity
- **Trend Analysis Page** — trend charts, hashtag clouds
- **Sentiment Analysis Page** — sentiment timeline, emotion breakdown
- **Competitor Insights Page** — competitor comparison table
- **Content Generator Page** — AI-powered caption/hashtag generator
- **Chat Agent Panel** — free-form agent query interface

#### 4.3 IBM Granite Integration
- Model: `ibm/granite-3-3-8b-instruct` via IBM watsonx.ai REST API
- Authentication: IBM Cloud API key + Project ID
- Prompt engineering: System prompt encodes brand context, ethics rules, and HAM tone
- Fallback: If Granite API unavailable, use intelligent mock responses

### Phase 5 — Testing & Validation
**Objective:** Ensure correctness, safety, and quality.

- Unit tests: Agent tool functions, data parsers, API endpoints
- Integration tests: Full agent pipeline end-to-end
- Ethics tests: Adversarial prompts, bias detection, hallucination checks
- UX tests: Usability with 3 persona types (brand manager, entrepreneur, student)
- Deliverable: Test report with pass/fail metrics

### Phase 6 — Deployment & Monitoring
**Objective:** Launch and maintain the application.

- Local: `setup.bat` for Windows one-click install and launch
- Production: Docker + IBM Cloud Code Engine (optional)
- Monitoring: Agent decision logs, error rates, user satisfaction ratings
- Feedback loop: User thumbs up/down on AI responses feeds improvement backlog

### Phase 7 — Continuous Improvement
**Objective:** Evolve the agent over time.

- Monthly review of agent accuracy and bias metrics
- Update sample datasets quarterly
- Re-prompt-engineer based on user feedback
- Version all prompt templates in `/prompts/` directory

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                  │
│  [Onboarding] [Dashboard] [Trends] [Sentiment]           │
│  [Competitors] [Content Gen] [Agent Chat]                │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP/REST
┌───────────────────────▼─────────────────────────────────┐
│               Node.js / Express Backend                   │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ Agent Router│  │ Data Service │  │  Ethics Filter │  │
│  └──────┬──────┘  └──────┬───────┘  └───────┬────────┘  │
│         │                │                   │            │
│  ┌──────▼──────────────────────────────────▼──────────┐  │
│  │              IBM Granite LLM (watsonx.ai)           │  │
│  │        granite-3-3-8b-instruct via REST API         │  │
│  └────────────────────────────────────────────────────┘  │
│         │                │                                │
│  ┌──────▼──────┐  ┌──────▼───────┐                       │
│  │ Sample Data │  │ Live APIs    │                       │
│  │ (JSON files)│  │ (optional)   │                       │
│  └─────────────┘  └──────────────┘                       │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Agent Design

### Agent Identity
- **Name:** Granite Social Coach
- **Persona:** Professional, encouraging, data-driven, brand-aware
- **Tone:** HAM (Helpful, Accurate, Mindful)
- **Language:** Clear, jargon-free, actionable

### Tool Definitions
| Tool | Input | Output |
|---|---|---|
| `analyzeTrends` | platform, industry, date_range | trending topics, hashtags, growth % |
| `analyzeSentiment` | text[], brand_name | sentiment score, emotions, sample quotes |
| `analyzeCompetitors` | competitor_names[], platform | posting frequency, engagement rate, top content |
| `generateContent` | brief, tone, platform, brand_profile | captions, hashtags, campaign ideas |
| `answerQuery` | question, brand_context | text answer with sources cited |

### Prompt Template (System)
```
You are Granite Social Coach, an expert social media strategist powered by IBM Granite.
You are assisting {brand_name} in the {industry} industry targeting {audience}.
Always be helpful, accurate, and mindful (HAM). Never fabricate statistics.
Never recommend illegal, discriminatory, or harmful content.
If unsure, say so clearly rather than guessing.
All sample data is clearly marked. Treat it as illustrative only.
```

---

## 5. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, CSS Modules |
| Charts | Recharts |
| Backend | Node.js 18+, Express 4 |
| AI Model | IBM Granite 3.3 8B Instruct (watsonx.ai) |
| HTTP Client | Axios |
| State Management | React Context API |
| Styling | CSS Variables + CSS Modules |
| Package Manager | npm |
| OS Support | Windows (setup.bat), macOS/Linux (npm scripts) |

---

## 6. Data Strategy

### Sample Datasets (Default)
All sample data is stored in `server/data/` and clearly labeled `[SAMPLE DATA]`.

| Dataset | Description |
|---|---|
| `trends.json` | Simulated trending hashtags and topics per platform |
| `sentiment.json` | Simulated audience sentiment scores and comments |
| `competitors.json` | Simulated competitor posting and engagement data |
| `content_examples.json` | Example captions and campaign structures |

### Live Data Integration (Optional)
Set API keys in `.env` to enable live data:
- `TWITTER_BEARER_TOKEN` — Twitter/X Trends API
- `REDDIT_CLIENT_ID` / `REDDIT_CLIENT_SECRET` — Reddit API
- `INSTAGRAM_ACCESS_TOKEN` — Instagram Graph API

---

## 7. AI Ethics & Guardrails

### Principles
1. **Transparency:** All AI-generated content is clearly labeled "AI Generated"
2. **Privacy:** No personal data stored beyond the current session
3. **Fairness:** Agent avoids favoring any platform, brand, or demographic without data basis
4. **Accuracy:** Agent cites data source (sample vs live) for every statistic
5. **Safety:** Output toxicity check before display; refuse harmful requests

### Guardrail Implementation
- Input filter: Sanitize user input; block prompt injection attempts
- Output filter: Check for hate speech, misinformation markers, PII leakage
- Confidence gating: If model confidence < 0.7, append "I'm not fully certain — verify this"
- Refusal protocol: Graceful decline with explanation for out-of-scope or harmful requests

### HAM Tone Checklist
- ✅ Helpful: Every response includes a next-step action
- ✅ Accurate: Statistics include source and date
- ✅ Mindful: Avoids stereotypes, respects all industries and cultures

---

## 8. Development Roadmap

| Sprint | Duration | Deliverables |
|---|---|---|
| Sprint 1 | Week 1 | Project setup, backend scaffolding, Granite API integration |
| Sprint 2 | Week 2 | Onboarding flow, Dashboard, sample data loader |
| Sprint 3 | Week 3 | Trend & Sentiment analysis pages |
| Sprint 4 | Week 4 | Competitor insights, Content generator |
| Sprint 5 | Week 5 | Agent chat panel, ethics filter, guardrails |
| Sprint 6 | Week 6 | Testing, UX polish, setup.bat, documentation |

---

## 9. Testing Strategy

| Test Type | Tool | Coverage Target |
|---|---|---|
| Unit | Jest | 80% of backend functions |
| API Integration | Supertest | All endpoints |
| Frontend | React Testing Library | Core components |
| Ethics/Safety | Manual adversarial prompts | 20 test cases |
| Performance | Lighthouse | Score ≥ 85 |

---

## 10. Deployment & Operations

### Local (Windows)
```
Double-click setup.bat
→ Installs Node.js dependencies
→ Creates .env template
→ Starts backend on port 3001
→ Starts frontend on port 5173
→ Opens browser automatically
```

### Environment Variables Required
```
WATSONX_API_KEY=your_ibm_cloud_api_key
WATSONX_PROJECT_ID=your_watsonx_project_id
WATSONX_URL=https://us-south.ml.cloud.ibm.com
PORT=3001
```

---

## 11. Disclaimer

> **AI-Generated Content Disclaimer**
> This application is powered by IBM Granite LLM and produces AI-generated recommendations.
> All trend data, sentiment scores, and competitor insights marked `[SAMPLE DATA]` are simulated
> and intended for demonstration purposes only. They do not represent real-world data.
> AI-generated content should be reviewed by a qualified human before publication.
> This application does not store personal data beyond your current session.
> IBM Granite is a trademark of IBM Corporation. This project is for educational and
> demonstration purposes and is not affiliated with or endorsed by any social media platform.
