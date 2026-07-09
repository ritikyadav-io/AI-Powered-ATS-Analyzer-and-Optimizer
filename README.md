# 🚀 ElevateCv — AI Resume Intelligence Platform

> Build ATS-optimized resumes, analyze job compatibility, identify keyword gaps, and generate recruiter-ready documents with AI.

ElevateCv is a modern AI-powered Resume Intelligence Platform that helps job seekers improve their resumes, increase ATS compatibility, and maximize interview opportunities at startups, Fortune 500 companies, and FAANG organizations.

Unlike traditional resume checkers, ElevateCv uses a parallel AI analysis pipeline that evaluates multiple aspects of a resume simultaneously, delivering detailed insights, keyword optimization, recruiter outreach templates, ATS scoring, and tailored career documents in seconds.

---

# ✨ Key Features

### 🧠 Parallel Resume Analysis Engine

Analyze resumes through multiple independent AI pipelines running simultaneously, including:

- ATS Compatibility Analysis
- Keyword Gap Detection
- Resume Match Score
- STAR Achievement Analysis
- Power Verb Optimization
- Resume Formatting Audit
- Skills Gap Detection
- Experience Evaluation
- Resume Red Flags
- Grammar & Readability
- Industry-Specific Suggestions
- Career Progression Analysis
- Recruiter Perspective Review
- Interview Readiness Score
- Final AI Recommendation

---

### 📊 Premium Analytics Dashboard

Modern analytics dashboard inspired by:

- Stripe
- Linear
- Vercel
- Notion AI

Features include:

- ATS Score
- Resume Match Score
- Visual Progress Indicators
- Keyword Match Analysis
- Resume Health Metrics
- Interactive Insights
- Improvement Recommendations
- Score History

---

### 🎯 Job Description Matching

Upload a Job Description and instantly receive:

- ATS Match Percentage
- Missing Keywords
- Required Skills Comparison
- Strength Analysis
- Weakness Analysis
- Recruiter Match Score
- Personalized Resume Suggestions

---

### 🤖 AI Resume Rewriter

Generate optimized resumes with:

- ATS-Friendly Formatting
- Improved Bullet Points
- Strong Action Verbs
- Quantified Achievements
- Better Professional Summary
- Skills Optimization
- Section Improvements

---

### 📧 AI Outreach Generator

Generate professional outreach content including:

- Cold Emails
- LinkedIn Connection Requests
- Recruiter Messages
- Follow-up Emails
- Hiring Manager Outreach
- Referral Request Templates

---

### 📄 ATS-Safe PDF Export

Export professionally formatted documents:

- Resume
- Cover Letter
- ATS Report
- Recruiter Report

Generated using custom PDF templates while maintaining ATS compatibility.

---

### 🕒 Resume Version History

Track previous resume analyses with:

- Score History
- Previous Reports
- Resume Comparison
- Cached Analysis Results

---

### ⚡ AI Provider Fallback

Built with automatic provider failover for improved reliability.

Supports:

- Gemini
- OpenRouter

If one provider becomes unavailable, requests automatically switch to the next available provider.

---

# 🏗 Tech Stack

## Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Shadcn UI
- Radix UI

---

## Backend

- Supabase
- Supabase Edge Functions
- PostgreSQL

---

## AI Layer

- Gemini API
- OpenRouter API

---

## State Management

- TanStack Query (React Query)

---

## Authentication

- Supabase Auth

---

## Database

- Supabase PostgreSQL

---

## PDF Generation

- jsPDF
- html2canvas

---

## Testing

- Vitest
- React Testing Library
- JSDOM

---

# 📁 Project Structure

```text
ElevateCv/
│
├── public/
│   ├── icons/
│   ├── images/
│   └── assets/
│
├── src/
│   ├── components/
│   │   ├── analyzer/
│   │   ├── dashboard/
│   │   ├── site/
│   │   └── ui/
│   │
│   ├── hooks/
│   ├── integrations/
│   ├── lib/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── types/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── supabase/
│   └── functions/
│       └── analyze-resume/
│
├── package.json
├── vite.config.ts
└── README.md
```

---

# ⚙️ Environment Variables

Create a `.env` file in the project root.

```env
VITE_SUPABASE_URL=https://your-project.supabase.co

VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key

VITE_SUPABASE_PROJECT_ID=your_project_id
```

---

# 🚀 Installation

Clone the repository.

```bash
git clone https://github.com/ritikyadav-io/ElevateCv.git
```

Navigate to the project.

```bash
cd ElevateCv
```

Install dependencies.

```bash
npm install
```

Start the development server.

```bash
npm run dev
```

Build for production.

```bash
npm run build
```

Preview production build.

```bash
npm run preview
```

---

# 🚀 Core Workflow

```text
Upload Resume
        │
        ▼
Upload Job Description
        │
        ▼
Parallel AI Analysis Engine
        │
        ▼
ATS Score Generation
        │
        ▼
Keyword Gap Analysis
        │
        ▼
Resume Intelligence Dashboard
        │
        ▼
Resume Rewrite Suggestions
        │
        ▼
Cover Letter Generation
        │
        ▼
Recruiter Outreach Templates
        │
        ▼
Export PDF Report
```

---

# 🎯 Future Roadmap

- Resume Builder
- LinkedIn Profile Optimizer
- Portfolio Generator
- Interview Preparation
- AI Career Coach
- Salary Insights
- Chrome Extension
- Recruiter Dashboard
- Team Workspaces
- Resume API
- Multi-language Support

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Ritik Yadav**

Building AI-powered SaaS products focused on career growth, productivity, and intelligent automation.

GitHub: https://github.com/ritikyadav-io
