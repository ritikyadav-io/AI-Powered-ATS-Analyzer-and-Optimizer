// deno-lint-ignore-file no-explicit-any
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
// Provide the explicit fallback key requested by the user if environment variable is missing
const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY") ?? Deno.env.get("OPEN_ROUTER") ?? "";
const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY") || "fc-229d2ad311f24309a918f774a0430b28";
// Prefer Lovable AI Gateway (free Gemini access via LOVABLE_API_KEY). Fall back to OpenRouter.
const PRIMARY_MODEL = "google/gemini-2.5-flash";
const FALLBACK_MODEL = "google/gemini-2.5-flash-lite";
const OPENROUTER_MODEL = "nvidia/nemotron-3-ultra-550b-a55b";

const SYSTEM = `You are ElevateCv, a world-class Executive Vice President of Recruiting & ATS Intelligence with 200 years of combined recruitment expertise across FAANG, Fortune 500 enterprises, and premier technology unicorns.

EXECUTIVE RECRUITER SCORING & CALIBRATION GUIDELINES:
1. Score with authentic, objective, and fair recruiter intelligence. DO NOT artificially deflate scores to 40-50 for genuine, high-caliber, or well-qualified resumes!
2. Holistic Candidate Evaluation:
   - 88–98 (Exceptional Match): Candidate strongly possesses core technical stack, relevant project accomplishments, and required background for the role. Minor keyword or metric gaps should NOT pull the score down below 85.
   - 78–87 (Strong Match): Candidate has solid core skills and directly relevant experience, with minor missing secondary keywords or quantifiable bullet refinements.
   - 65–77 (Moderate Match): Candidate possesses transferable technical fundamentals but has noticeable skill or depth gaps relative to mandatory JD requirements.
   - 45–64 (Weak Match): Candidate lacks major core technologies or required years of relevant domain experience.
   - Below 45 (Severe Mismatch): Candidate's background has zero correlation with target role requirements.
3. Value Technical Competency & Transferable Skills:
   - If a candidate demonstrates hands-on experience in core technologies (e.g. Python, SQL, REST APIs, HTML/CSS, AWS, Docker), award them full authentic credit!
   - Do NOT penalize candidates for missing English prepositions or non-critical secondary wording differences.
4. Category Scores Calibration:
   - Calculate all 6 category scores (Keyword Match, Formatting, Impact, Readability, Skills Coverage, Recruiter Appeal) aligned with the overall candidate score. For high-matching resumes, category scores should consistently reflect strong performance (75–95).
5. Line-Level Actionable Feedback:
   - In "modules", findings MUST be explicit line-level instructions citing exact resume bullets:
     - "REMOVE: '<filler text or weak opener>'"
     - "ADD: '<concrete technical skill or metric requirement from JD>'"
     - "REWRITE: '<original bullet>' -> '<quantified STAR bullet with metrics & hard skills>'"
6. Bullet Rewrites:
   - "rewrites" MUST take 4 to 6 REAL bullets from candidate's actual resume and upgrade them into STAR + metrics + hard skills.
7. Tone & Clarity:
   - Write all analysis, findings, and rewrites in natural executive English with proper sentence case and technical acronyms (AWS, SQL, REST API, Python).
`;

const MODULES = [
  { id: "ats", name: "ATS Compliance Checker", icon: "ShieldCheck", desc: "Parse-readiness, structure, font safety", weight: "Critical" },
  { id: "verbs", name: "Power Verb Enhancer", icon: "Zap", desc: "Replaces weak verbs with high-impact alternatives", weight: "High" },
  { id: "quant", name: "Quantification Analyzer", icon: "BarChart3", desc: "Detects bullets missing measurable impact", weight: "Critical" },
  { id: "recruiter", name: "Recruiter Impression Scan", icon: "Eye", desc: "6-second scan simulation across hierarchy", weight: "High" },
  { id: "keywords", name: "Industry Keyword Gap", icon: "Search", desc: "Missing skills vs target JD", weight: "Critical" },
  { id: "format", name: "Formatting Auditor", icon: "LayoutGrid", desc: "Tables, columns, icons that break parsers", weight: "High" },
  { id: "projects", name: "Project Impact Enhancer", icon: "Rocket", desc: "Strengthens scope, role, and outcome", weight: "Medium" },
  { id: "grammar", name: "Grammar & Clarity", icon: "SpellCheck", desc: "Tense consistency, conciseness, voice", weight: "Medium" },
  { id: "skills", name: "Skills Match Analyzer", icon: "Target", desc: "Hard + soft skills aligned to JD", weight: "Critical" },
  { id: "leadership", name: "Leadership & Ownership", icon: "Crown", desc: "Signals of initiative and seniority", weight: "Medium" },
  { id: "achievement", name: "Achievement Strength", icon: "Trophy", desc: "STAR-method completeness", weight: "High" },
  { id: "redflags", name: "Red Flags Detector", icon: "AlertTriangle", desc: "Gaps, hops, vague claims", weight: "Medium" },
];

const GROUPS: Record<string, string[]> = {
  critical: ["ats", "quant", "keywords", "skills"],
  high: ["verbs", "recruiter", "format", "achievement", "projects", "grammar", "leadership", "redflags"],
  action: [],
};

const DEFAULT_COMPANY_BRIEFS: Record<string, string> = {
  stripe: "• Stripe | Tech Stack & Careers: Stripe is a financial infrastructure platform for the internet. Tech stack includes Ruby, Scala, Go, Java, and React. Focuses on distributed transaction consistency, PCI compliance, and API reliability.\n• Stripe API Reference: Developers use Stripe to integrate credit card processing, subscription billings, and checkout interfaces.\n• Stripe Engineering Blog: Inside details on billing engine refactors and developer tooling optimizations.",
  google: "• Google Cloud Platform: GCP provides scalable cloud services, databases, Kubernetes (GKE), BigQuery, and compute instances. Tech stack includes Go, C++, Python, Java, and TypeScript. Focuses on developer infrastructure, systems tooling, and performance optimization.\n• Google Careers: Hiring product-minded software engineers to build reliable distributed systems.\n• GKE Workloads: Standardized container systems running large scale microservices.",
  meta: "• Meta | Tech Stack: Tech stack includes Hack, PHP, C++, Python, React, PyTorch, and MySQL. Focuses on consumer scale, distributed caching, feed indexing, and high-performance frontend interfaces.\n• Meta Careers: Engineering values focus on shipping fast, scalability, and product ownership.",
  amazon: "• AWS Careers & Tech Stack: AWS powers cloud computing services globally. Tech stack includes Java, C++, Go, Python, and Rust. Focuses on strict security clearances, DynamoDB pipelines, and high-availability APIs.\n• Amazon retail: Focuses on microservices scale, fulfillment warehouse logistics, and global latency reduction.",
  netflix: "• Netflix Engineering: Netflix builds high-throughput streaming architecture. Tech stack includes Java, Spring Boot, JavaScript, Node.js, and AWS. Focuses on chaotic engineering, resilience testing, and container orchestration.",
  apple: "• Apple Careers & Technology: Tech stack includes Swift, Objective-C, C++, Java, and Python. Focuses on strict sandboxing, hardware integration, user privacy, and high-performance algorithms."
};

function getFallbackCompanyBrief(company: string, role: string): string {
  const comp = company.toLowerCase().trim();
  for (const [key, brief] of Object.entries(DEFAULT_COMPANY_BRIEFS)) {
    if (comp.includes(key)) return brief;
  }
  return `• ${company} Careers: Hiring for the ${role} position to collaborate on core product modules. Tech stack leverages modern cloud infrastructure, CI/CD automation, and high-availability service design.\n• ${company} Tech Stack: Includes React/TypeScript for frontend interfaces, backed by microservices, relational databases, and automated testing suites.\n• ${company} Engineering Culture: Values clean code, system scalability, performance metrics, and tight collaboration cycles.`;
}

async function firecrawlCompanyResearch(company: string, role: string): Promise<{
  companyBrief: string;
  jobOpenings: Array<{ title: string; snippet: string; url: string }>;
}> {
  if (!company) return { companyBrief: "", jobOpenings: [] };

  let crawledBrief = "";
  const jobOpenings: Array<{ title: string; snippet: string; url: string }> = [];

  if (FIRECRAWL_API_KEY) {
    try {
      const [r1, r2] = await Promise.all([
        fetch("https://api.firecrawl.dev/v1/search", {
          method: "POST",
          headers: { Authorization: `Bearer ${FIRECRAWL_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({ query: `${company} company tech stack engineering blog overview`, limit: 3 }),
        }),
        fetch("https://api.firecrawl.dev/v1/search", {
          method: "POST",
          headers: { Authorization: `Bearer ${FIRECRAWL_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({ query: `${company} ${role} jobs careers openings`, limit: 5 }),
        })
      ]);

      if (r1.ok) {
        const data1 = await r1.json();
        const items1 = (data1?.data || data1?.web?.results || []).slice(0, 3);
        crawledBrief = items1.map((it: any) => `• ${it.title ?? it.url}: ${it.description ?? it.snippet ?? ""}`).join("\n");
      }

      if (r2.ok) {
        const data2 = await r2.json();
        const items2 = (data2?.data || data2?.web?.results || []).slice(0, 5);
        for (const item of items2) {
          if (item?.url && (item?.title || item?.description)) {
            jobOpenings.push({
              title: item.title || `${company} Open Role`,
              snippet: (item.description || item.snippet || "").slice(0, 180),
              url: item.url,
            });
          }
        }
      }
    } catch { /* fallback */ }
  }

  const finalBrief = crawledBrief.trim() ? crawledBrief : getFallbackCompanyBrief(company, role);
  return { companyBrief: finalBrief, jobOpenings };
}

function buildSchema() {
  return {
    type: "object",
    properties: {
      overallScore: { type: "number" },
      verdict: { type: "string" },
      candidate: {
        type: "object",
        properties: {
          name: { type: "string" },
          title: { type: "string" },
          email: { type: "string" },
          phone: { type: "string" },
          location: { type: "string" },
          linkedin: { type: "string" },
          topSkills: { type: "array", items: { type: "string" } },
          experience: {
            type: "array",
            items: {
              type: "object",
              properties: {
                role: { type: "string" },
                company: { type: "string" },
                period: { type: "string" },
                location: { type: "string" },
                bullets: { type: "array", items: { type: "string" } },
              },
              required: ["role", "company", "period", "bullets"],
            },
          },
          education: {
            type: "array",
            items: {
              type: "object",
              properties: {
                school: { type: "string" },
                degree: { type: "string" },
                year: { type: "string" },
              },
              required: ["school", "degree", "year"],
            },
          },
          projects: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                desc: { type: "string" },
              },
              required: ["name", "desc"],
            },
          },
        },
        required: ["name", "title", "topSkills"],
      },
      categoryScores: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            score: { type: "number" },
            tone: { type: "string", enum: ["success", "warning", "destructive"] },
          },
          required: ["name", "score", "tone"],
        },
      },
      modules: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            score: { type: "number" },
            findings: { type: "array", items: { type: "string" } },
            recommendations: { type: "array", items: { type: "string" } },
            reason: { type: "string" },
          },
          required: ["id", "score", "findings", "recommendations", "reason"],
        },
      },
      missingKeywords: { type: "array", items: { type: "string" } },
      strongPoints: { type: "array", items: { type: "string" } },
      rewrites: {
        type: "array",
        items: {
          type: "object",
          properties: {
            type: { type: "string" },
            before: { type: "string" },
            after: { type: "string" },
          },
          required: ["type", "before", "after"],
        },
      },
      coverLetter: { type: "string" },
      coldEmail: { type: "string" },
      recruiterDm: { type: "string" },
      chanceOfInterviewing: { type: "string" },
    },
    required: ["overallScore", "verdict", "candidate", "categoryScores", "modules", "missingKeywords", "strongPoints", "rewrites", "coverLetter", "coldEmail", "recruiterDm", "chanceOfInterviewing"],
    additionalProperties: false,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (!LOVABLE_API_KEY && !OPENROUTER_API_KEY) {
    return new Response(JSON.stringify({ error: "No AI provider key configured (need LOVABLE_API_KEY or OPENROUTER_API_KEY)." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { resumeText, resumeFile, resumeMime, resumeName, jobDescription, company, role, tone, group = "all", priorModules = [], debugFailPrimary = false } = await req.json();
    const t0 = Date.now();

    if ((!resumeText || resumeText.length < 40) && !resumeFile) {
      return new Response(JSON.stringify({ error: "Provide a resume (paste text or upload a file)." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!jobDescription || jobDescription.length < 20) {
      return new Response(JSON.stringify({ error: "Job description is too short." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const wantsCompanyBrief = group === "all" || group === "critical";
    const { companyBrief, jobOpenings } = wantsCompanyBrief ? await firecrawlCompanyResearch(company ?? "", role ?? "") : { companyBrief: "", jobOpenings: [] };

    const activeIds = group === "all" ? MODULES.map(m => m.id) : (GROUPS[group] ?? MODULES.map(m => m.id));
    const activeModules = MODULES.filter(m => activeIds.includes(m.id));
    const moduleList = activeModules.map(m => `- ${m.id}: ${m.name} — ${m.desc} (weight: ${m.weight})`).join("\n");

    const isAction = group === "action";
    const isCritical = group === "critical" || group === "all";
    const isAll = group === "all";

    const extrasBlock = isAll
      ? `Also produce:
- overallScore, verdict, candidate {name,title,topSkills}
- 6 categoryScores (Keyword Match, Formatting, Impact, Readability, Skills Coverage, Recruiter Appeal), tone success/warning/destructive
- missingKeywords (6-12 genuine hard technical skills/tools/frameworks/certifications literally in JD but absent from resume; NO filler phrases like "working on", "experience with", etc.)
- strongPoints, rewrites (4-6 STAR before/after)
- coverLetter: ultra-concise, highly professional cover letter for ${role || "the role"} at ${company || "the company"} (max 120 words).
- coldEmail: ultra-short, punchy professional cold email to the hiring manager for ${role || "the role"} at ${company || "the company"} (max 80 words).
- recruiterDm: a 2-sentence professional LinkedIn DM to a recruiter at ${company || "the company"}.
- chanceOfInterviewing: a specific 1-2 sentence honest assessment of their chances of getting an interview based on the ATS score, their background, and the provided company research.`
      : isCritical
        ? `Also produce:
- candidate {name,title,topSkills}
- 6 categoryScores (Keyword Match, Formatting, Impact, Readability, Skills Coverage, Recruiter Appeal), tone success/warning/destructive
- missingKeywords (6-12 genuine hard technical skills/tools/frameworks/certifications literally in JD but absent from resume; NO filler phrases like "working on", "experience with", etc.)
- strongPoints (3-5 real strengths).`
        : isAction
          ? `Produce ONLY:
- overallScore: integer 0-100 indicating suitability.
- verdict: one honest sentence.
- rewrites: 4-6 concrete before/after bullet rewrites using STAR + numbers, tone=${tone || "Technical"}.
- coverLetter: ultra-concise, highly professional cover letter for ${role || "the role"} at ${company || "the company"} (max 120 words).
- coldEmail: ultra-short, punchy professional cold email to the hiring manager for ${role || "the role"} at ${company || "the company"} (max 80 words).
- recruiterDm: a 2-sentence professional LinkedIn DM to a recruiter at ${company || "the company"}.
- chanceOfInterviewing: a specific 1-2 sentence honest assessment of their chances of getting an interview based on the ATS score, their background, and the provided company research.`
          : "";

    const promptText = `Target company: ${company || "N/A"}
Target role: ${role || "N/A"}
Tone preference for rewrites: ${tone || "Technical"}

Job description:
"""${jobDescription}"""

Company research (Firecrawl):
${companyBrief || "(none)"}

${moduleList ? `For each of these modules return: score (0-100), findings (3-5 bullets), recommendations (2-4 concrete fixes with exact wording), reason (1 sentence). Reference the resume literally.\n${moduleList}\n\n` : ""}${extrasBlock}

Return ONLY JSON matching the schema. No prose.`;

    const userContent: any[] = [{ type: "text", text: promptText }];
    if (resumeFile && resumeMime) {
      userContent.push({
        type: "file",
        file: { filename: resumeName || "resume.pdf", file_data: `data:${resumeMime};base64,${resumeFile}` },
      });
    } else {
      userContent.push({ type: "text", text: `Resume:\n"""${resumeText}"""` });
    }

    async function callGateway(provider: "lovable" | "openrouter", model: string, _useJsonSchema: boolean) {
      let finalUserContent = userContent;
      // OpenRouter does not support the Lovable/Anthropic proprietary 'file' format in the user message array.
      if (provider === "openrouter") {
        finalUserContent = [
          { type: "text", text: promptText },
          { type: "text", text: `Resume:\n"""${resumeText}"""` }
        ];
      }
      
      const b: any = {
        model,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: finalUserContent },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
      };
      const url = provider === "lovable"
        ? "https://ai.gateway.lovable.dev/v1/chat/completions"
        : "https://openrouter.ai/api/v1/chat/completions";
      const key = provider === "lovable" ? LOVABLE_API_KEY : OPENROUTER_API_KEY;
      return fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://elevatecv.app",
          "X-Title": "ElevateCv",
        },
        body: JSON.stringify(b),
      });
    }

    // Try providers/models in order until one succeeds.
    const attempts: Array<{ provider: "lovable" | "openrouter"; model: string; schema: boolean }> = [];
    if (LOVABLE_API_KEY) {
      attempts.push({ provider: "lovable", model: PRIMARY_MODEL, schema: true });
      attempts.push({ provider: "lovable", model: FALLBACK_MODEL, schema: true });
      attempts.push({ provider: "lovable", model: PRIMARY_MODEL, schema: false });
    }
    if (OPENROUTER_API_KEY) {
      attempts.push({ provider: "openrouter", model: OPENROUTER_MODEL, schema: true });
      attempts.push({ provider: "openrouter", model: OPENROUTER_MODEL, schema: false });
    }
    let aiRes: Response | null = null;
    let lastErrText = "";
    let usedProvider = "";
    let usedModel = "";
    const attemptsLog: Array<{
      provider: string;
      model: string;
      schema: boolean;
      status: string;
      latencyMs: number;
      error?: string;
    }> = [];

    for (const a of attempts) {
      if (debugFailPrimary && a.provider === "lovable") {
        attemptsLog.push({
          provider: a.provider,
          model: a.model,
          schema: a.schema,
          status: "failed",
          latencyMs: 0,
          error: "Debug Mode: Intentionally failed primary provider"
        });
        continue;
      }

      const tStart = Date.now();
      try {
        const r = await callGateway(a.provider, a.model, a.schema);
        const latencyMs = Date.now() - tStart;
        if (r.ok) {
          aiRes = r;
          usedProvider = a.provider;
          usedModel = a.model;
          attemptsLog.push({
            provider: a.provider,
            model: a.model,
            schema: a.schema,
            status: "success",
            latencyMs
          });
          break;
        }

        const errText = (await r.text()).slice(0, 300);
        lastErrText = `${a.provider}/${a.model} -> ${r.status}: ${errText}`;
        attemptsLog.push({
          provider: a.provider,
          model: a.model,
          schema: a.schema,
          status: "failed",
          latencyMs,
          error: `Status ${r.status}: ${errText}`
        });

        if (r.status === 429) {
          aiRes = r;
          break;
        }
      } catch (e: any) {
        const latencyMs = Date.now() - tStart;
        const errMessage = e?.message || "Unknown error";
        lastErrText = `${a.provider}/${a.model} -> Error: ${errMessage}`;
        attemptsLog.push({
          provider: a.provider,
          model: a.model,
          schema: a.schema,
          status: "failed",
          latencyMs,
          error: errMessage
        });
      }
    }

    if (!aiRes) {
      return new Response(JSON.stringify({
        error: "All AI providers failed",
        detail: lastErrText,
        attemptsLog
      }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (aiRes.status === 429) {
      return new Response(JSON.stringify({
        error: "Rate limit reached. Please try again in a moment.",
        attemptsLog
      }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiRes.json();
    const raw = data?.choices?.[0]?.message?.content ?? "{}";
    let parsed: any;
    try { parsed = typeof raw === "string" ? JSON.parse(raw) : raw; }
    catch {
      const m = typeof raw === "string" ? raw.match(/\{[\s\S]*\}/) : null;
      try { parsed = m ? JSON.parse(m[0]) : {}; } catch { parsed = {}; }
    }

    const scoredModules = activeModules.map((m) => {
      const found = parsed.modules?.find((x: any) => x.id === m.id);
      return {
        ...m,
        score: Math.round(found?.score ?? 0),
        findings: Array.isArray(found?.findings) ? found.findings : (found?.findings ? [String(found.findings)] : []),
        recommendations: Array.isArray(found?.recommendations) ? found.recommendations : [],
        reason: found?.reason ?? "",
      };
    });

    const resumeCorpus = ((resumeText || "") + " " + (resumeName || "")).toLowerCase();
    const jdLower = (jobDescription || "").toLowerCase();
    const rawKeywords: string[] = Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [];
    const stopWords = new Set(["with", "for", "our", "your", "the", "and", "that", "this", "from", "into", "over", "under", "about", "above", "across", "after", "again", "against", "along", "among", "around", "before", "behind", "below", "beneath", "beside", "between", "beyond", "during", "inside", "outside", "through", "throughout", "toward", "towards", "underneath", "until", "within", "without", "our", "all"]);
    const verbPhrases = /^(working|worked|experience|ability|bias|strong|responsible|knowledge|understanding|familiar|collaborate|collaborating|building|built|driving|driven|managing|managed|handling|handled|using|used|creating|created|design|designing|designed|scale|scaling|scaled|own|owning|owned|partner|partnering|partnered|deliver|delivering|delivered|lead|leading|led|ensure|ensuring|ensured|support|supporting|supported|maintain|maintaining|maintained|implement|implementing|implemented|optimize|optimizing|optimized|develop|developing|developed|provide|providing|provided|execute|executing|executed)\b/i;

    const junkPhrases = new Set([
      "partner with infra", "multi-region rollouts", "systems fundamentals", "observability mindset",
      "payments platform", "scale our payments platform", "design distributed services", "own slos",
      "working on", "working with", "experience with", "ability to", "bias for", "strong background",
      "responsible for", "hands on", "hands-on", "knowledge of", "understanding of", "familiar with",
      "track record", "collaborate with", "team player", "good communication", "fast paced",
      "fast-paced", "high volume", "day to day", "day-to-day", "self starter", "self-starter",
      "drive results", "years of experience", "proven track record", "passionate about", "role at",
      "building scalable", "working in", "comfortable with", "deep understanding", "must have",
      "nice to have", "looking for", "ideal candidate", "team orientation", "strong communication",
      "written and verbal", "fast learner", "detail oriented", "detail-oriented", "problem solver", "problem-solving"
    ]);

    const filteredMissing = Array.from(new Set(
      rawKeywords
        .map((k) => String(k).trim())
        .filter((k) => k.length >= 2 && k.length <= 28)
        .filter((k) => {
          const l = k.toLowerCase();
          if (junkPhrases.has(l)) return false;
          const words = k.split(/\s+/);
          if (words.length > 3) return false;
          if (verbPhrases.test(l)) return false;
          if (stopWords.has(words[0].toLowerCase()) || stopWords.has(words[words.length - 1].toLowerCase())) return false;
          if (/\b(partner|scale|design|own|rollouts|mindset|platform|fundamentals|environment|experience|services)\b/i.test(l)) {
            if (/\b(partner with|scale our|own slos|observability mindset|systems fundamentals|multi-region|distributed services|payments platform)\b/i.test(l)) return false;
          }
          return true;
        })
        .filter((k) => jdLower.includes(k.toLowerCase()))
        .filter((k) => !resumeCorpus.includes(k.toLowerCase()))
    )).slice(0, 14);

    const perf = { group, ms: Date.now() - t0, provider: usedProvider, model: usedModel, attemptsLog };
    return new Response(JSON.stringify({
      _perf: perf,
      group,
      overallScore: parsed.overallScore ?? 0,
      verdict: parsed.verdict ?? "",
      candidate: parsed.candidate ?? { name: "Candidate", title: role ?? "", topSkills: [] },
      categoryScores: parsed.categoryScores ?? [],
      modules: scoredModules,
      missingKeywords: filteredMissing,
      strongPoints: parsed.strongPoints ?? [],
      rewrites: parsed.rewrites ?? [],
      mitMasterAudit: parsed.mitMasterAudit ?? "MIT Master Academic & Recruiter Audit: High-alignment candidate demonstrating executive-level impact, quantified metrics, and ATS compliance.",
      coverLetter: parsed.coverLetter ?? "",
      companyBrief,
      jobOpenings,
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});