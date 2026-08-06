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
  { id: "linkedin", name: "LinkedIn Summary", icon: "Linkedin", desc: "First-person magnetic summary", score: 0, weight: "Action" },
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
  name: "Aarav Mehta",
  title: "Senior Data Analyst",
  email: "aarav.mehta@email.com",
  location: "Bengaluru, IN · Remote",
  skills: ["SQL (PostgreSQL, Snowflake)", "Python (Pandas, NumPy, Scikit-learn)", "Tableau", "Power BI", "dbt", "Statistical Modeling", "A/B Testing", "Excel / VBA", "Data Warehousing", "ETL Pipelines"],
  experience: [
    { role: "Senior Data Analyst", company: "DataPulse Analytics", period: "2022 — Present",
      bullets: [
        "Engineered automated dbt & SQL data pipelines on 80M+ Snowflake records, accelerating executive reporting speed by 4x.",
        "Designed & evaluated 25+ product A/B experiments, driving +14% checkout conversion & $1.8M incremental ARR.",
        "Built executive Tableau & Power BI dashboards tracking retention cohorts, reducing customer churn by 18%.",
      ] },
    { role: "Data Analyst", company: "Northwind Insights", period: "2019 — 2022",
      bullets: [
        "Optimized complex PostgreSQL queries & indexing, cutting data warehouse cloud compute costs by $140K/year.",
        "Developed predictive customer lifetime value (LTV) models in Python (Pandas/Scikit-learn) with 89% precision.",
      ] },
  ],
  education: [{ school: "BITS Pilani", degree: "B.E. Computer Science & Data Analytics", year: "2019" }],
  projects: [{ name: "ChurnSense AI", desc: "Open-source Python customer churn & segmentation library · 1.8k GitHub stars" }],
  certifications: ["Google Data Analytics Professional", "Snowflake SnowPro Core Certified", "dbt Certified Developer"],
};

export const rewriteImprovements = [
  { type: "Quantify", before: "Analyzed customer data", after: "Segmented 500k+ customer profiles via K-Means clustering in Python, unlocking $320k upsell pipeline" },
  { type: "Power verb", before: "Made reports for management", after: "Spearheaded C-suite executive Tableau dashboards tracking $42M ARR across 12 product lines" },
  { type: "Keyword", before: "Ran database queries", after: "Optimized complex SQL window functions on 50M+ Snowflake records, cutting query cost 45%" },
  { type: "Scope", before: "Helped team with analytics", after: "Led cross-functional analytics squad of 6 supporting Product, Growth, and Finance stakeholders" },
];