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
  title: "Senior Software Engineer",
  email: "aarav.mehta@email.com",
  location: "Bengaluru, IN · Remote",
  skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "AWS", "Kubernetes", "GraphQL", "Redis", "Python", "Terraform"],
  experience: [
    { role: "Senior SWE", company: "Lumen Labs", period: "2022 — Present",
      bullets: [
        "Led migration of legacy monolith to microservices, cutting p95 latency 38%.",
        "Built design-system used by 14 product teams; adoption reached 92% in 6 months.",
        "Mentored 5 engineers; 3 promoted within a year.",
      ] },
    { role: "Software Engineer", company: "Northwind", period: "2019 — 2022",
      bullets: [
        "Owned billing platform processing $42M ARR with 99.99% uptime.",
        "Reduced infra spend by $310K/yr via rightsizing and spot fleets.",
      ] },
  ],
  education: [{ school: "BITS Pilani", degree: "B.E. Computer Science", year: "2019" }],
  projects: [{ name: "OpenLatency", desc: "OSS p99 monitor · 2.4k GitHub stars" }],
  certifications: ["AWS Solutions Architect — Pro", "CKAD"],
};

export const rewriteImprovements = [
  { type: "Power verb", before: "Helped migrate", after: "Spearheaded migration of" },
  { type: "Quantify", before: "Improved performance", after: "Cut p95 latency by 38% (820ms → 510ms)" },
  { type: "Keyword", before: "Worked with cloud", after: "Architected on AWS (EKS, Lambda, RDS)" },
  { type: "Scope", before: "Managed team", after: "Led cross-functional team of 9 across 3 timezones" },
];