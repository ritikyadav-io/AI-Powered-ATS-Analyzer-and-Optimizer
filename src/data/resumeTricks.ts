export type ResumeTrick = {
  id: number;
  category: "ATS Optimization" | "STAR Bullet Engineering" | "Recruiter Psychology" | "Skill Grouping" | "Format Safety" | "Executive Outreach";
  title: string;
  description: string;
  actionableTip: string;
  formula?: string;
};

export const RESUME_TRICKS: ResumeTrick[] = [
  // Category 1: ATS Optimization & Keyword Mastery (1-10)
  {
    id: 1,
    category: "ATS Optimization",
    title: "Exact Keyword Matching for Dual Parsing Safety",
    description: "Legacy ATS parsers search exact text tokens. Modern semantic ATS engines look for contextual domain terms. Supply both standard acronyms and full names.",
    actionableTip: "Write out both full titles and common abbreviations (e.g. 'Kubernetes (K8s)', 'Amazon Web Services (AWS)', 'Continuous Integration / Continuous Deployment (CI/CD)').",
    formula: "<Full Skill Name> (<Acronym>)"
  },
  {
    id: 2,
    category: "ATS Optimization",
    title: "The Top-30% Real Estate Hierarchy Rule",
    description: "ATS algorithms assign up to 60% higher weight to keywords occurring in the first third of your document.",
    actionableTip: "Place your target job title, core technical stack, and top 6 hard skills inside your Professional Header and Technical Skills grid at the top.",
    formula: "Title -> Summary (3 lines) -> Core Competencies Grid"
  },
  {
    id: 3,
    category: "ATS Optimization",
    title: "Standardized Section Header Naming",
    description: "Unusual header labels like 'Where I Have Built Things' or 'My Odyssey' break ATS section parsers completely.",
    actionableTip: "Use standard industry headings: 'Professional Experience', 'Technical Skills', 'Education', 'Projects', and 'Certifications'.",
  },
  {
    id: 4,
    category: "ATS Optimization",
    title: "Contextual Keyword Weaving over Keyword Stuffing",
    description: "Repeated keyword spamming lowers ATS relevance scores. Parsers analyze verb-object relationships around keywords.",
    actionableTip: "Pair every key technology with an action verb and business metric (e.g. 'Optimized SQL query performance, reducing DB latency by 45%').",
    formula: "[Action Verb] + [Target Keyword] + [Context/Project] + [Quantified Result]"
  },
  {
    id: 5,
    category: "ATS Optimization",
    title: "Target JD Frequency Match (80% Rule)",
    description: "Top ATS engines score candidates by checking how many core skills from the JD are present in your resume.",
    actionableTip: "Scan target JD for repeated technical nouns (e.g., REST API, PyTorch, Docker, SLOs) and weave at least 80% into your bullet points.",
  },
  {
    id: 6,
    category: "ATS Optimization",
    title: "Bypassing Parsing Errors with Standard Bullet Symbols",
    description: "Custom graphic icons, arrows, or wingding bullets get parsed as corrupt unicode or weird characters by Workday.",
    actionableTip: "Use clean standard bullet characters ('•' or '-') for 100% parse accuracy across Greenhouse, Lever, and Taleo.",
  },
  {
    id: 7,
    category: "ATS Optimization",
    title: "File Format Choice: PDF vs DOCX Safety",
    description: "While DOCX was historically preferred, modern ATS software parses vector-based PDF files created directly from Word or TeX cleanly.",
    actionableTip: "Save your resume as a standard text-searchable PDF (never an image scan or flattened canvas PDF). Test selecting text with cursor.",
  },
  {
    id: 8,
    category: "ATS Optimization",
    title: "Eliminate Hard Skill Omissions in Current Experience",
    description: "ATS screeners filter by recent usage (e.g. 'Python used within last 2 years').",
    actionableTip: "Ensure your most recent job role contains your primary target technologies in its first two bullet points.",
  },
  {
    id: 9,
    category: "ATS Optimization",
    title: "Clean Date Formatting Syntax",
    description: "Inconsistent month-year formats cause ATS date parsers to miscalculate total years of experience.",
    actionableTip: "Use consistent date formats throughout: 'May 2024 — Present' or '05/2024 — 08/2024'. Avoid mixing 'Jan 24' with '2024'.",
    formula: "MMM YYYY — MMM YYYY"
  },
  {
    id: 10,
    category: "ATS Optimization",
    title: "Target Title Mirroring in Header",
    description: "Recruiters and ATS filters match your resume header title directly against the target job posting.",
    actionableTip: "Adjust your candidate header title to match the exact target posting (e.g. 'Senior Data Engineer' or 'AWS Cloud Developer').",
  },

  // Category 2: STAR Bullet Engineering & Metrics (11-20)
  {
    id: 11,
    category: "STAR Bullet Engineering",
    title: "The Google XYZ Formula for High-Impact Bullets",
    description: "Laszlo Bock (Former SVP of People Operations at Google) introduced the gold-standard bullet structure.",
    actionableTip: "Structure every bullet as: Accomplished [X], as measured by [Y], by doing [Z].",
    formula: "[Accomplished X] + [Measured by Y] + [By doing Z]"
  },
  {
    id: 12,
    category: "STAR Bullet Engineering",
    title: "Power Action Verbs First Rule",
    description: "Weak openers like 'Responsible for', 'Worked on', or 'Helped to' signal passive execution rather than leadership.",
    actionableTip: "Replace passive openers with high-impact verbs: 'Architected', 'Engineered', 'Spearheaded', 'Automated', 'Orchestrated'.",
  },
  {
    id: 13,
    category: "STAR Bullet Engineering",
    title: "Quantifying Scale, Speed, and Financial Impact",
    description: "Bullets containing concrete numbers increase recruiter evaluation ratings by over 3.5x.",
    actionableTip: "Include at least 2 metrics per role: scale (e.g., 500K+ requests/sec), speed (e.g., 40% faster build time), or revenue (e.g., $1.2M ARR).",
  },
  {
    id: 14,
    category: "STAR Bullet Engineering",
    title: "The 1.5 to 2 Line Conciseness Rule",
    description: "Bullets longer than 2.5 lines decrease readability during 6-second recruiter scans.",
    actionableTip: "Keep bullets tight: between 25 and 45 words per bullet point. Eliminate fluff and filler adjectives.",
  },
  {
    id: 15,
    category: "STAR Bullet Engineering",
    title: "Eliminating Vague Claims with Empirical Proof",
    description: "Stating 'improved database performance' is weak. Stating 'optimized SQL queries reducing p99 latency from 450ms to 85ms' is bulletproof.",
    actionableTip: "State the baseline metric alongside the final result to prove magnitude of impact.",
    formula: "Reduced [Metric] from [Before] to [After] using [Technology]"
  },
  {
    id: 16,
    category: "STAR Bullet Engineering",
    title: "Automation & Infrastructure Efficiency Metrics",
    description: "Engineering managers prioritize candidates who eliminate manual toil and reduce operational costs.",
    actionableTip: "Highlight manual hours saved (e.g., 'Automated deployment pipelines, saving 15 engineering hours weekly').",
  },
  {
    id: 17,
    category: "STAR Bullet Engineering",
    title: "Cross-Functional Collaboration Signals",
    description: "Senior roles require proving team influence and cross-functional leadership.",
    actionableTip: "Mention team scale and partners: 'Partnered with product managers, QA, and security leads to launch 4 core microservices'.",
  },
  {
    id: 18,
    category: "STAR Bullet Engineering",
    title: "Problem-Solution-Outcome Framework",
    description: "Demonstrates high technical problem-solving maturity to senior interviewers.",
    actionableTip: "Start with the business bottleneck solved, the tool used, and the measurable end result.",
  },
  {
    id: 19,
    category: "STAR Bullet Engineering",
    title: "The '3 to 5 Bullets' Per Experience Entry Sweet Spot",
    description: "Too few bullets look thin; too many bullets create wall-of-text fatigue.",
    actionableTip: "Use 4 to 5 high-impact bullets for your primary/current role, and 2 to 3 bullets for previous roles.",
  },
  {
    id: 20,
    category: "STAR Bullet Engineering",
    title: "Eliminating First-Person Pronouns ('I', 'My', 'We')",
    description: "Executive resumes use implicit third-person action style for maximum professionalism.",
    actionableTip: "Never write 'I engineered' or 'My team built'. Start directly with the action verb: 'Engineered...', 'Built...'.",
  },

  // Category 3: Recruiter Psychology & 6-Second Scan (21-30)
  {
    id: 21,
    category: "Recruiter Psychology",
    title: "F-Pattern Eye Movement Alignment",
    description: "Eye-tracking studies prove recruiters read in an 'F' shape: top across, down left margin.",
    actionableTip: "Put your most important keywords and high metrics on the left side of your bullet points.",
  },
  {
    id: 22,
    category: "Recruiter Psychology",
    title: "Visual Hierarchy & Margin Whitespace Balance",
    description: "Crammed text with 0.2-inch margins overwhelms human screeners and causes immediate fatigue.",
    actionableTip: "Use 0.5-inch to 0.75-inch margins with clean line spacing (1.15x) for an effortless visual scan.",
  },
  {
    id: 23,
    category: "Recruiter Psychology",
    title: "Executive Summary: 3 Lines of High-Density Impact",
    description: "Generic objective statements ('Seeking a challenging role...') are discarded. A sharp executive summary hooks attention.",
    actionableTip: "Write a 3-line summary containing: years of experience, core specialization, primary tech stack, and key career accomplishment.",
  },
  {
    id: 24,
    category: "Recruiter Psychology",
    title: "Avoiding Corporate Jargon & Cliché Buzzwords",
    description: "Words like 'synergy', 'thought leader', 'dynamic', and 'self-starter' signal fluff to veteran screeners.",
    actionableTip: "Replace buzzwords with concrete technical achievements and hard tools.",
  },
  {
    id: 25,
    category: "Recruiter Psychology",
    title: "Clear Career Trajectory Progression",
    description: "Hiring managers look for signals of internal promotion, increasing scope, and rising ownership.",
    actionableTip: "Highlight title promotions clearly (e.g. 'Software Engineer → Senior Engineer') under the same company heading.",
  },
  {
    id: 26,
    category: "Recruiter Psychology",
    title: "Addressing Employment Gaps Productively",
    description: "Unexplained gaps trigger hesitation in fast-paced hiring syncs.",
    actionableTip: "List freelance projects, open-source contributions, or continuous learning certifications during transition periods.",
  },
  {
    id: 27,
    category: "Recruiter Psychology",
    title: "Project Section Dominance for Students & Transitioners",
    description: "If you lack extensive formal work history, high-quality technical projects equal formal experience.",
    actionableTip: "Give production-grade projects equal visual weight with architecture, live links, and GitHub repositories.",
  },
  {
    id: 28,
    category: "Recruiter Psychology",
    title: "Single-Page vs Two-Page Threshold",
    description: "0 to 5 years of experience belongs on 1 page; 7+ years of executive experience fits cleanly on 2 pages.",
    actionableTip: "Never create a 1.2-page resume. Edit content to fit 1 full page or 2 full pages cleanly.",
  },
  {
    id: 29,
    category: "Recruiter Psychology",
    title: "Removing Obsolete & Outdated Tech Stacks",
    description: "Listing ancient or legacy tools (e.g. Flash, Fortran) signals outdated skills unless specifically required.",
    actionableTip: "Remove obsolete skills to free up prime space for modern cloud & AI engineering frameworks.",
  },
  {
    id: 30,
    category: "Recruiter Psychology",
    title: "Hyperlink Integrity & Clean URLs",
    description: "Long messy URLs like 'https://linkedin.com/in/user-name-98234792348-abc' look untidy.",
    actionableTip: "Clean your links: 'linkedin.com/in/yourname' and 'github.com/yourusername'. Make them clickable hyperlinks.",
  },

  // Category 4: Technical Skill Categorization (31-40)
  {
    id: 31,
    category: "Skill Grouping",
    title: "Categorized Skills Matrix Grid",
    description: "Unstructured skill lists (e.g. 30 words in one line) are impossible for screeners to digest quickly.",
    actionableTip: "Group skills into clear categories: 'Programming Languages', 'Frameworks & Libraries', 'Databases & Cloud', 'DevOps & Tools'.",
  },
  {
    id: 32,
    category: "Skill Grouping",
    title: "Ordering Skills by Job Description Priority",
    description: "Put the skills most prominently requested in the job description at the beginning of each category list.",
    actionableTip: "If the JD emphasizes Python and PostgreSQL, list them first: 'Languages: Python, SQL, C++'.",
  },
  {
    id: 33,
    category: "Skill Grouping",
    title: "Distinguishing Hard Technical Skills from Soft Skills",
    description: "Mixing 'Communication' with 'Kubernetes' in the same list dilutes technical authority.",
    actionableTip: "Keep Technical Skills strictly for hard tools, languages, databases, and frameworks.",
  },
  {
    id: 34,
    category: "Skill Grouping",
    title: "Certifications with Issuing Body & Year",
    description: "Certifications without credential details look unverified.",
    actionableTip: "Format as: Certification Name → Issuing Organization (Year) (e.g., 'AWS Certified Solutions Architect → Amazon Web Services (2025)').",
  },
  {
    id: 35,
    category: "Skill Grouping",
    title: "Including Domain Specific Engineering Practices",
    description: "Recruiters search for methodologies as well as languages.",
    actionableTip: "Include practices like 'Microservices Architecture', 'CI/CD Pipelines', 'RESTful API Design', and 'Agile/Scrum'.",
  },
  {
    id: 36,
    category: "Skill Grouping",
    title: "Honest Skill Level Categorization",
    description: "Avoid arbitrary percentage progress bars (e.g. 'Python 90%') which ATS parsers cannot interpret.",
    actionableTip: "Categorize skills by experience depth ('Proficient: ...' | 'Working Knowledge: ...').",
  },
  {
    id: 37,
    category: "Skill Grouping",
    title: "Relevant Coursework Integration for Students",
    description: "Helps entry-level candidates match ATS course keyword filters.",
    actionableTip: "Add a concise 'Relevant Coursework' line under Education (e.g., 'DSA, Operating Systems, DBMS, Machine Learning').",
  },
  {
    id: 38,
    category: "Skill Grouping",
    title: "Cloud Infrastructure Tool Specifics",
    description: "Listing just 'AWS' is generic. Specifying exact services boosts keyword alignment dramatically.",
    actionableTip: "Detail exact cloud services: 'AWS (S3, Lambda, Redshift, Glue, Athena, EC2, RDS)'.",
  },
  {
    id: 39,
    category: "Skill Grouping",
    title: "AI & Data Pipeline Tooling Exposure",
    description: "Modern tech companies value AI tooling and automated developer workflow familiarity.",
    actionableTip: "Include modern developer workflow tools: 'Cursor, Lovable, Claude, ChatGPT API, PyTorch, LangChain'.",
  },
  {
    id: 40,
    category: "Skill Grouping",
    title: "Database Architecture Nuance",
    description: "Showing experience across both relational (SQL) and NoSQL databases shows architectural versatility.",
    actionableTip: "Specify database types: 'Relational: PostgreSQL, MySQL | NoSQL & Vector: MongoDB, Redis, Pinecone'.",
  },

  // Category 5: Format & Typography Safety (41-47)
  {
    id: 41,
    category: "Format Safety",
    title: "Single-Column Standard Layout",
    description: "Multi-column resume layouts confuse 80% of legacy ATS parsers, reading left-to-right across columns.",
    actionableTip: "Use a clean, single-column layout for 100% parse readiness across all enterprise ATS platforms.",
  },
  {
    id: 42,
    category: "Format Safety",
    title: "No Headers, Footers, or Text Boxes",
    description: "Workday and Taleo strip out text placed inside header/footer boxes or floating text fields.",
    actionableTip: "Place all contact details and candidate headers directly inside the main document body.",
  },
  {
    id: 43,
    category: "Format Safety",
    title: "Standard ATS-Safe Typography",
    description: "Unusual custom web fonts cause rendering corruption and font replacement errors.",
    actionableTip: "Use system-standard typography: Inter, Arial, Calibri, Helvetica, or Times New Roman.",
  },
  {
    id: 44,
    category: "Format Safety",
    title: "No Embedded Tables, Images, or Logos",
    description: "Images, skill progress bars, and complex tables get converted to empty space by parsers.",
    actionableTip: "Represent all data as plain formatted text with bolding and clean inline delimiters ('|' or '•').",
  },
  {
    id: 45,
    category: "Format Safety",
    title: "High-Contrast Monochrome Color Scheme",
    description: "Light gray text or pastel colors render illegibly when printed or viewed on mobile HR screens.",
    actionableTip: "Use high-contrast dark text (#111827) on pure white backgrounds for maximum legibility.",
  },
  {
    id: 46,
    category: "Format Safety",
    title: "Consistent Spacing & Margin Hygiene",
    description: "Irregular paragraph spacing looks unprofessional to hiring managers.",
    actionableTip: "Maintain strict 6pt-8pt spacing between sections and 2pt-4pt spacing between bullet items.",
  },
  {
    id: 47,
    category: "Format Safety",
    title: "Print & Export Validation Test",
    description: "Export bugs can cause text overlaps or missing lines on candidate review portals.",
    actionableTip: "Always print your PDF preview and highlight text to verify zero overlapping lines before applying.",
  },

  // Category 6: Executive Outreach, Cold Email & Cover Letters (48-55)
  {
    id: 48,
    category: "Executive Outreach",
    title: "The 120-Word Ultra-Concise Cover Letter",
    description: "Long 2-page cover letters are ignored. A 120-word targeted note gets read in 15 seconds.",
    actionableTip: "Write 3 short paragraphs: 1) Why this company & role, 2) Top 2 relevant achievements, 3) Call to action.",
  },
  {
    id: 49,
    category: "Executive Outreach",
    title: "Direct Recruiter LinkedIn DM Blueprint",
    description: "Reaching out directly to technical recruiters on LinkedIn increases response rates by 4x.",
    actionableTip: "Send a 2-sentence DM: 'Hi [Name], I just applied for [Role]. With background in [Core Skill 1] & [Core Skill 2], I recently [Key Achievement]. Would love to connect!'",
  },
  {
    id: 50,
    category: "Executive Outreach",
    title: "Cold Emailing Engineering Hiring Managers",
    description: "Targeting engineering leads directly bypasses general HR application queues.",
    actionableTip: "Subject line format: 'Engineer Application: [Your Name] — [Role] ([Key Metric/Skill])'.",
  },
  {
    id: 51,
    category: "Executive Outreach",
    title: "AI Prompt Engineering Strategy for Resume Tuning",
    description: "Using AI to tailor your resume for specific job descriptions speeds up applications by 10x.",
    actionableTip: "Copy your resume + target JD into ElevateCv or ChatGPT with: 'Rewrite my resume bullets using STAR + metrics to match this JD without inventing facts.'",
  },
  {
    id: 52,
    category: "Executive Outreach",
    title: "Following Up After 48 Hours",
    description: "Polite follow-ups demonstrate persistence and genuine interest in the team.",
    actionableTip: "Send a brief follow-up note 3-4 days after applying highlighting a recent company project or engineering news.",
  },
  {
    id: 53,
    category: "Executive Outreach",
    title: "Personalized Portfolio & GitHub Links",
    description: "Hiring managers for engineering roles want to see real code, commit history, and live demos.",
    actionableTip: "Place clickable links to live deployed projects and your GitHub profile in your resume header.",
  },
  {
    id: 54,
    category: "Executive Outreach",
    title: "Referral Request Strategy",
    description: "Applications with an internal employee referral are 9x more likely to result in a hire.",
    actionableTip: "Find alumni from your university working at the target company and send a warm message asking for a 10-minute chat.",
  },
  {
    id: 55,
    category: "Executive Outreach",
    title: "ElevateCv 15-Node Audit Pre-Submission Ritual",
    description: "Submitting without auditing leads to silent rejections.",
    actionableTip: "Run your resume through ElevateCv's 15-node audit pipeline before every application to guarantee a 90+ ATS interview advantage.",
  }
];
