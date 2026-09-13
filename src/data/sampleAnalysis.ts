export const moduleDefs = [
  { id: "ats", name: "ATS Compliance Checker", icon: "ShieldCheck", desc: "Parse-readiness, structure, font safety", score: 92, weight: "Critical" },
  { id: "verbs", name: "Power Verb Enhancer", icon: "Zap", desc: "Replaces weak verbs with high-impact alternatives", score: 78, weight: "High" },
  { id: "quant", name: "Quantification Analyzer", icon: "BarChart3", desc: "Detects bullets missing measurable impact", score: 64, weight: "Critical" },
  { id: "recruiter", name: "Recruiter Impression Scan", icon: "Eye", desc: "6-second scan simulation across hierarchy", score: 81, weight: "High" },
  { id: "keywords", name: "Industry Keyword Gap", icon: "Search", desc: "Missing skills vs target JD", score: 58, weight: "Critical" },
  { id: "format", name: "Formatting Auditor", icon: "LayoutGrid", desc: "Tables, columns, icons that break parsers", score: 88, weight: "High" },
  { id: "projects", name: "Project Impact Enhancer", icon: "Rocket", desc: "Strengthens scope, role, and outcome", score: 72, weight: "Medium" },
  { id: "grammar", name: "Grammar & Clarity", icon: "SpellCheck", desc: "Tense consistency, conciseness, voice", score: 95, weight: "Medium" },
  { id: "skills", name: "Skills Match Analyzer", icon: "Target", desc: "Hard + soft skills aligned to JD", score: 67, weight: "Critical" },
  { id: "leadership", name: "Leadership & Ownership", icon: "Crown", desc: "Signals of initiative and seniority", score: 74, weight: "Medium" },
  { id: "achievement", name: "Achievement Strength", icon: "Trophy", desc: "STAR-method completeness", score: 70, weight: "High" },
  { id: "redflags", name: "Red Flags Detector", icon: "AlertTriangle", desc: "Gaps, hops, vague claims", score: 86, weight: "Medium" },
  { id: "rewrite", name: "Experience Rewriter", icon: "Wand2", desc: "Bullet-by-bullet AI rewrite", score: 0, weight: "Action" },
  { id: "mitReview", name: "MIT Executive Review", icon: "GraduationCap", desc: "100-year senior MIT professor & FAANG hiring manager final audit node", score: 98, weight: "Master" },
  { id: "cover", name: "Cover Letter Generator", icon: "Mail", desc: "Tailored to JD + company tone", score: 0, weight: "Action" },
] as const;

export const categoryScores = [
  { name: "Keyword Match", score: 67, color: "hsl(var(--warning))" },
  { name: "Formatting", score: 88, color: "hsl(var(--success))" },
  { name: "Impact", score: 64, color: "hsl(var(--warning))" },
  { name: "Readability", score: 91, color: "hsl(var(--success))" },
  { name: "Skills Coverage", score: 58, color: "hsl(var(--destructive))" },
  { name: "Recruiter Appeal", score: 81, color: "hsl(var(--success))" },
];

export const sampleResume = {
  name: "Ritik Yadav",
  title: "B.Tech Artificial Intelligence and Data Science Student",
  email: "yadavritik2027@gmail.com",
  phone: "+91-8824318839",
  location: "Jaipur, 302039",
  linkedin: "linkedin.com/in/ritikyadav18",
  github: "github.com/ritikyadav-io",
  skills: ["Python", "SQL", "HTML/CSS", "REST API", "AWS (S3, Lambda, Redshift, Glue, QuickSight)", "Power BI", "MySQL", "Amazon RDS", "Supabase", "Machine Learning"],
  experience: [
    {
      role: "AWS Data Engineer Intern",
      company: "Graas Solutions",
      period: "May 2026 — Jul 2026",
      location: "Jaipur, India",
      bullets: [
        "Architected automated reporting dashboards using SQL, Python, and AWS Lambda, transitioning manual reports to real-time BI analytics and reducing reporting prep by 35%.",
        "Optimized complex SQL queries and ETL pipelines using AWS Glue and Redshift, accelerating data compilation speed by 25% and ensuring 99.9% data reliability.",
        "Automated multi-source data ingestion pipelines using AWS Lambda and S3, processing 500GB+ of raw data monthly into clean, structured schemas for downstream analytics."
      ]
    },
    {
      role: "Full Stack Developer Intern",
      company: "Groot Software",
      period: "May 2025 — Jul 2025",
      location: "Jaipur, India",
      bullets: [
        "Built and deployed responsive web applications using HTML, CSS, JavaScript, and REST APIs, improving page load speed by 20% across desktop and mobile.",
        "Engineered full-stack features, debugged complex component layouts, and collaborated with senior developers using Git version control in an agile workflow."
      ]
    }
  ],
  education: [
    {
      school: "Arya College of Engineering and IT (RTU Affiliated), Jaipur",
      degree: "B.Tech – Artificial Intelligence and Data Science",
      year: "2023 — 2027",
      coursework: "Data Structures and Algorithms (DSA), Operating Systems (OS), Database Management Systems (DBMS), Machine Learning (ML), Cloud Computing (CC)"
    }
  ],
  projects: [
    {
      name: "Trail – Job Platforms Pipeline | Graas Solutions (P) Ltd",
      desc: "Built a full-stack job pipeline platform aggregating listings from multiple job portals onto a single dashboard. Used AI to generate per-listing JD summaries, cold emails, and direct apply filters."
    },
    {
      name: "ElevateCv – ATS Tracking & Resume Audit Tool",
      desc: "Built an AI-powered ATS tracking tool with a 15-node evaluation pipeline checking power verbs, keyword density, and formatting to deliver actionable score reports."
    }
  ],
  certifications: [
    "Java Programming Professional Certification → IIT Bombay (2024)",
    "HubSpot Data Integration Certificate → HubSpot Academy (2025)",
    "Technical Automation Proficiency → Cursor, Lovable, Claude, ChatGPT for Data Pipeline Development"
  ]
};

export const rewriteImprovements = [
  { type: "Power verb", before: "Helped migrate", after: "Spearheaded migration of" },
  { type: "Quantify", before: "Improved performance", after: "Cut p95 latency by 38% (820ms → 510ms)" },
  { type: "Keyword", before: "Worked with cloud", after: "Architected on AWS (EKS, Lambda, RDS)" },
  { type: "Scope", before: "Managed team", after: "Led cross-functional team of 9 across 3 timezones" },
];