import { jsPDF } from "jspdf";

export type AnalysisModule = {
  id: string; name: string; icon: string; desc: string; weight: string;
  score: number; findings: string[]; recommendations?: string[]; reason?: string;
};
export type CandidateData = {
  name: string;
  title: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  summary?: string;
  topSkills: string[];
  skills?: string[] | Record<string, string>;
  experience?: {
    role: string;
    company: string;
    period: string;
    location?: string;
    bullets: string[];
  }[];
  education?: {
    school: string;
    degree: string;
    year: string;
    coursework?: string;
  }[];
  projects?: {
    name: string;
    subtitle?: string;
    desc?: string;
    bullets?: string[];
  }[];
  certifications?: string[];
};

export type AnalysisReport = {
  overallScore: number;
  verdict: string;
  candidate: CandidateData;
  categoryScores: { name: string; score: number; tone: string }[];
  modules: AnalysisModule[];
  missingKeywords: string[];
  strongPoints: string[];
  rewrites: { type: string; before: string; after: string }[];

  coverLetter: string;
  mitMasterAudit?: string;
  companyBrief?: string;
  chanceOfInterviewing?: string;
  coldEmail?: string;
  recruiterDm?: string;
  company?: string;
  role?: string;
};

export function filterGenuineKeywords(keywords: string[]): string[] {
  if (!Array.isArray(keywords)) return [];
  const junkPhrases = new Set([
    "working on", "working with", "experience with", "ability to", "bias for",
    "strong background", "responsible for", "hands on", "hands-on", "knowledge of",
    "understanding of", "familiar with", "track record", "collaborate with",
    "team player", "good communication", "fast paced", "fast-paced", "high volume",
    "day to day", "day-to-day", "self starter", "self-starter", "drive results",
    "years of experience", "proven track record", "passionate about", "role at",
    "building scalable", "working in", "comfortable with", "deep understanding",
    "must have", "nice to have", "looking for", "ideal candidate", "team orientation",
    "strong communication", "written and verbal", "fast learner", "detail oriented",
    "detail-oriented", "problem solver", "problem-solving"
  ]);

  return keywords
    .map(k => (typeof k === "string" ? k.trim() : ""))
    .filter(k => {
      if (!k || k.length < 2 || k.length > 40) return false;
      const lower = k.toLowerCase();
      if (junkPhrases.has(lower)) return false;
      if (/^(working|worked|experience|ability|bias|strong|responsible|knowledge|understanding|familiar|collaborate|building|driving|managing|handling|using|creating)\b/i.test(lower)) {
        return false;
      }
      return true;
    });
}

export function enhanceBullet(bullet: string, rewrites: { before: string; after: string }[] = []): string {
  if (!bullet || typeof bullet !== "string") return "";
  const trimmed = bullet.trim();
  if (!trimmed) return "";

  // 1. Match against AI rewrites from the analysis
  for (const rw of rewrites) {
    if (!rw.after) continue;
    const bLower = trimmed.toLowerCase();
    const rwBeforeLower = (rw.before || "").toLowerCase();
    if (rwBeforeLower && (bLower.includes(rwBeforeLower) || rwBeforeLower.includes(bLower.slice(0, 20)))) {
      return rw.after;
    }
  }

  // 2. Power verb replacements for passive or weak openers
  let updated = trimmed;
  const weakVerbMap: [RegExp, string][] = [
    [/^\b(helped|assisted)\s+(build|to build|building)\b/i, "Engineered"],
    [/^\b(helped|assisted)\s+(create|to create|creating)\b/i, "Developed"],
    [/^\b(helped|assisted)\s+(automate|to automate|automating)\b/i, "Automated"],
    [/^\b(helped|assisted)\s+(design|to design|designing)\b/i, "Architected"],
    [/^\b(helped|assisted)\s+(migrate|to migrate|migrating)\b/i, "Spearheaded migration of"],
    [/^\b(helped|assisted)\s+(optimize|to optimize|optimizing)\b/i, "Optimized"],
    [/^\b(helped|assisted|worked)\s+on\b/i, "Spearheaded development of"],
    [/^\bworked\s+across\b/i, "Collaborated across"],
    [/^\bworked\s+with\b/i, "Partnered with"],
    [/^\bresponsible\s+for\b/i, "Spearheaded"],
    [/^\bbuilt\s+and\s+deployed\b/i, "Engineered and deployed"],
    [/^\bimproved\s+performance\b/i, "Optimized latency and system performance"],
    [/^\bcreated\b/i, "Developed and deployed"],
    [/^\bmanaged\b/i, "Directed"],
    [/^\bhandled\b/i, "Orchestrated"]
  ];

  for (const [pattern, replacement] of weakVerbMap) {
    if (pattern.test(updated)) {
      updated = updated.replace(pattern, replacement);
      break;
    }
  }

  if (updated.length > 0) {
    updated = updated.charAt(0).toUpperCase() + updated.slice(1);
  }

  return updated;
}

export function enhanceSummary(summaryText: string, company: string, title?: string): string {
  if (!summaryText || summaryText.trim().length < 20) {
    return `${title || "High-impact Artificial Intelligence and Software Engineering student"} with a proven track record of engineering scalable backend data pipelines, full-stack platforms, and cloud infrastructure aligned for ${company || "target teams"}. Comfortable working across Python, SQL, REST APIs, and AWS services with strong computer science fundamentals.`;
  }
  let s = summaryText.trim();
  s = s.replace(/^(a|an)?\s*student\b/i, "High-impact student");
  if (company && !s.toLowerCase().includes(company.toLowerCase())) {
    s += ` Specialized in delivering production-grade data pipelines and software solutions tailored for ${company}.`;
  }
  return s;
}

function wrap(doc: jsPDF, text: string, x: number, y: number, w: number, lh = 5) {
  const lines = doc.splitTextToSize(text || "", w);
  lines.forEach((ln: string, i: number) => doc.text(ln, x, y + i * lh));
  return y + lines.length * lh;
}

export function buildAnalysisPdf(r: AnalysisReport): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210, M = 14, CW = W - M * 2;
  let y = M;

  const pageBreak = (need = 20) => {
    if (y + need > 275) {
      doc.addPage();
      y = 18;
    }
  };

  // Helper for section header lines (Academic Research Paper style)
  const drawSectionHeader = (numberStr: string, titleStr: string) => {
    pageBreak(16);
    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(0.4);
    doc.line(M, y, W - M, y);
    y += 4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`${numberStr}. ${titleStr.toUpperCase()}`, M, y);
    y += 2.5;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.2);
    doc.line(M, y, W - M, y);
    y += 5;
  };

  // ====================================================
  // 1. PAPER HEADER BANNER
  // ====================================================
  doc.setFillColor(15, 23, 42); // Executive Slate Charcoal
  doc.rect(0, 0, W, 26, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("ELEVATECV — EXECUTIVE ATS AUDIT & RESEARCH REPORT", M, 11);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(203, 213, 225);
  const docId = `ELEVATECV-ATS-${Math.floor(100000 + Math.random() * 900000)}`;
  doc.text(`DOC ID: ${docId}   |   CONFIDENTIAL RESEARCH AUDIT`, W - M, 11, { align: "right" });

  doc.setFontSize(8.5);
  doc.setTextColor(226, 232, 240);
  const candName = r.candidate?.name || "Candidate";
  const targetRole = r.role || "Target Role";
  const targetComp = r.company || "Target Company";
  doc.text(`CANDIDATE: ${candName}   |   TARGET: ${targetRole} @ ${targetComp}   |   DATE: ${new Date().toLocaleDateString()}`, M, 19);

  y = 32;

  // ====================================================
  // 2. ABSTRACT & EXECUTIVE VERDICT (RESEARCH BOX)
  // ====================================================
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(M, y, CW, 26, 1.5, 1.5, "FD");

  // Score Badge Circle/Box
  const sColor: [number, number, number] = r.overallScore >= 85 ? [16, 185, 129] : r.overallScore >= 70 ? [37, 99, 235] : r.overallScore >= 55 ? [217, 119, 6] : [220, 38, 38];
  doc.setFillColor(...sColor);
  doc.roundedRect(M + 3, y + 3, 28, 20, 1, 1, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`${r.overallScore}`, M + 17, y + 12, { align: "center" });
  doc.setFontSize(7);
  doc.text("ATS SCORE", M + 17, y + 18, { align: "center" });

  // Verdict Abstract Text
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("Abstract & Executive Recruiter Verdict:", M + 34, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  wrap(doc, r.verdict || "High-alignment candidate evaluated through 15-node ATS diagnostic scanning.", M + 34, y + 12, CW - 36, 4);

  y += 31;

  // ====================================================
  // 3. SECTION 1: PERFORMANCE MATRIX & CATEGORY BREAKDOWN
  // ====================================================
  drawSectionHeader("1", "Performance Matrix & Category Score Breakdown");

  if (r.categoryScores && r.categoryScores.length > 0) {
    r.categoryScores.forEach(c => {
      pageBreak(7);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text(c.name, M + 2, y);

      doc.setFont("helvetica", "bold");
      const pillarColor: [number, number, number] = c.score >= 80 ? [16, 185, 129] : c.score >= 60 ? [217, 119, 6] : [220, 38, 38];
      doc.setTextColor(...pillarColor);
      doc.text(`${c.score}/100`, M + 65, y, { align: "right" });

      // Progress Bar Track
      doc.setFillColor(226, 232, 240);
      doc.roundedRect(M + 70, y - 3, 90, 3.5, 0.5, 0.5, "F");

      // Progress Bar Fill
      doc.setFillColor(...pillarColor);
      doc.roundedRect(M + 70, y - 3, Math.max(2, (c.score / 100) * 90), 3.5, 0.5, 0.5, "F");

      // Status Pill
      const statusText = c.score >= 80 ? "EXCELLENT" : c.score >= 60 ? "MODERATE" : "CRITICAL";
      doc.setFontSize(7);
      doc.text(statusText, M + 165, y);

      y += 6;
    });
  }
  y += 4;

  // ====================================================
  // 4. SECTION 2: PROFESSOR'S DIAGNOSTIC AUDIT
  // ====================================================
  drawSectionHeader("2", "Professor's Diagnostic Audit & Structural Masterplan");

  pageBreak(40);
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(M, y, CW, 38, 1, 1, "FD");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Executive Diagnostic Grade:", M + 4, y + 5);

  const gradeStr = r.overallScore >= 85 ? "A+ (Executive Distinction)" : r.overallScore >= 75 ? "A- (Interview Ready)" : r.overallScore >= 60 ? "B (Moderate Alignment)" : "C/D (High ATS Drop Risk)";
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...sColor);
  doc.text(gradeStr, M + 48, y + 5);

  let auditY = y + 11;
  const auditPoints = [
    ["1. Layout Architecture:", "Single-column parsing safety, 0.5\"-0.75\" margins, standard section headings."],
    ["2. Action Language Density:", "Replaces passive verbs (helped, managed) with executive action power verbs."],
    ["3. STAR Quantification:", "Evaluates metrics density (%, $, time saved). Target: >80% bullets quantified."],
    ["4. Priority Action Plan:", "1. Integrate missing JD keywords  2. Add numerical impact  3. Elevate action verbs."]
  ];

  auditPoints.forEach(([label, desc]) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(label, M + 4, auditY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(desc, M + 46, auditY);
    auditY += 5.5;
  });

  y += 43;

  // ====================================================
  // 5. SECTION 3: KEYWORD DENSITY GAP ANALYSIS
  // ====================================================
  drawSectionHeader("3", "Keyword Density Gap Analysis (Target Job Description)");

  pageBreak(15);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(220, 38, 38);
  doc.text("Missing Critical Keywords:", M + 2, y);
  y += 4.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const genuineKw = filterGenuineKeywords(r.missingKeywords || []);
  const kwStr = genuineKw.length > 0 ? genuineKw.join("   |   ") : "None detected. Perfect keyword coverage!";
  y = wrap(doc, kwStr, M + 2, y, CW - 4, 4.5) + 6;

  // ====================================================
  // 6. SECTION 4: CORE RESUME STRENGTHS
  // ====================================================
  drawSectionHeader("4", "Core Candidate Strengths & High-Alignment Points");

  if (r.strongPoints && r.strongPoints.length > 0) {
    r.strongPoints.forEach(sp => {
      pageBreak(7);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(16, 185, 129);
      doc.text("[+]", M + 2, y);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      y = wrap(doc, sp.trim(), M + 8, y, CW - 10, 4.2) + 1.5;
    });
  }
  y += 4;

  // ====================================================
  // 7. SECTION 5: MODULE-BY-MODULE DIAGNOSTIC FINDINGS
  // ====================================================
  drawSectionHeader("5", "Module-by-Module Diagnostic Findings & Fixes");

  const displayModules = (r.modules || []).filter(m => m.weight !== "Action");
  displayModules.forEach(m => {
    pageBreak(24);
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(M, y, CW, 6, 0.5, 0.5, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`${m.name}  (${m.weight} Weight)`, M + 3, y + 4.2);

    const modColor: [number, number, number] = m.score >= 80 ? [16, 185, 129] : m.score >= 60 ? [217, 119, 6] : [220, 38, 38];
    doc.setTextColor(...modColor);
    doc.text(`${m.score}/100`, W - M - 3, y + 4.2, { align: "right" });

    y += 8.5;

    if (m.reason) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      y = wrap(doc, `Analysis Rationale: ${m.reason}`, M + 2, y, CW - 4, 3.8) + 2;
    }

    if (m.findings && m.findings.length > 0) {
      pageBreak(8);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text("Findings:", M + 2, y);
      y += 3.8;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      m.findings.forEach(f => {
        pageBreak(6);
        doc.text("-", M + 4, y);
        y = wrap(doc, f.trim(), M + 8, y, CW - 10, 3.8) + 1;
      });
    }

    if (m.recommendations && m.recommendations.length > 0) {
      pageBreak(8);
      y += 1;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(16, 185, 129);
      doc.text("Actionable Recommendations:", M + 2, y);
      y += 3.8;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      m.recommendations.forEach(rec => {
        pageBreak(6);
        doc.text("->", M + 4, y);
        y = wrap(doc, rec.trim(), M + 9, y, CW - 11, 3.8) + 1;
      });
    }

    y += 4;
  });

  // ====================================================
  // 8. SECTION 6: COMPARATIVE AI BULLET REWRITES
  // ====================================================
  drawSectionHeader("6", "Executive AI Bullet Rewrites (STAR Method)");

  if (r.rewrites && r.rewrites.length > 0) {
    r.rewrites.forEach((rw, idx) => {
      pageBreak(22);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(124, 58, 237);
      doc.text(`[Rewrite #${idx + 1} - ${rw.type}]`, M + 2, y);
      y += 4.2;

      // Before
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(220, 38, 38);
      y = wrap(doc, `Original:  "${rw.before}"`, M + 4, y, CW - 6, 3.8) + 1;

      // After
      doc.setFont("helvetica", "bold");
      doc.setTextColor(16, 185, 129);
      y = wrap(doc, `Upgraded: "${rw.after}"`, M + 4, y, CW - 6, 3.8) + 4;
    });
  }

  // ====================================================
  // 9. APPENDIX A: TAILORED COVER LETTER
  // ====================================================
  if (r.coverLetter && r.coverLetter.trim().length > 10) {
    drawSectionHeader("7", "Appendix A: Tailored Executive Cover Letter");
    pageBreak(30);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    y = wrap(doc, r.coverLetter.trim(), M + 2, y, CW - 4, 4.2) + 6;
  }

  // ====================================================
  // 10. APPENDIX B: CHATGPT REGENERATION MASTER PROMPT
  // ====================================================
  drawSectionHeader("8", "Appendix B: ChatGPT Master Regeneration Prompt");
  pageBreak(25);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const promptText = `You are a senior recruiter and ATS expert. Using the report findings above, rewrite my resume to achieve a 90+ ATS score for the ${r.role || "target"} role at ${r.company || "the target company"}. Preserve truthfulness. Weave in these missing keywords: ${(r.missingKeywords || []).join(", ") || "none"}. Use STAR + quantified impact in every bullet. Output ATS-safe plain text without tables or columns.`;
  
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(M, y, CW, 20, 1, 1, "FD");
  wrap(doc, promptText, M + 3, y + 4, CW - 6, 3.8);

  // ====================================================
  // 11. DYNAMIC MULTI-PAGE HEADER & FOOTER ENGINE
  // ====================================================
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);

    // Running Header for Pages 2+
    if (p > 1) {
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.2);
      doc.line(M, 10, W - M, 10);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text("ELEVATECV EXECUTIVE ATS AUDIT & RESEARCH REPORT", M, 8);
      doc.text("CONFIDENTIAL", W - M, 8, { align: "right" });
    }

    // Running Footer on All Pages
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.2);
    doc.line(M, 287, W - M, 287);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text("ElevateCv Research Engine · elevatecv.app", M, 291);
    doc.text(`Page ${p} of ${totalPages}`, W - M, 291, { align: "right" });
  }

  return doc;
}

export function buildCoverLetterPdf(r: AnalysisReport): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210, M = 20, CW = W - M * 2;
  let y = M;
  doc.setFont("times", "bold"); doc.setFontSize(16);
  doc.text(r.candidate?.name || "Candidate", M, y); y += 6;
  doc.setFont("times", "normal"); doc.setFontSize(10); doc.setTextColor(80);
  doc.text(`Application: ${r.role || ""} @ ${r.company || ""}`, M, y); y += 8;
  doc.setTextColor(20); doc.setFontSize(11);
  wrap(doc, r.coverLetter || "", M, y, CW, 6);
  return doc;
}

export function buildImprovedResumePdf(r: AnalysisReport): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210, M = 15, CW = W - M * 2; // 15mm = 0.6 in margins (ATS standard)
  let y = 14;

  const pageBreak = (need = 14) => {
    if (y + need > 282) {
      doc.addPage();
      y = 14;
    }
  };

  const drawH2 = (title: string) => {
    pageBreak(14);
    doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(15, 23, 42);
    doc.text(title, M, y);
    y += 1.5;
    doc.setDrawColor(30, 41, 59); doc.setLineWidth(0.5); doc.line(M, y, W - M, y);
    y += 4.5;
  };

  const candName = (r.candidate?.name && r.candidate.name !== "Candidate") ? r.candidate.name : "RITIK YADAV";
  const targetCompany = r.company || "Target Company";
  const missingKwList = (r.missingKeywords && r.missingKeywords.length > 0)
    ? r.missingKeywords.join(" · ")
    : "Python · SQL · AWS · REST API · Data Analytics · Machine Learning";

  // ----------------------------------------------------
  // H1: CANDIDATE HEADER
  // ----------------------------------------------------
  doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.setTextColor(15, 23, 42);
  doc.text(candName.toUpperCase(), W / 2, y, { align: "center" });
  y += 5.5;

  doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(71, 85, 105);
  const contactParts = [
    r.candidate?.phone || "+91-8824318839",
    r.candidate?.email || "yadavritik2027@gmail.com",
    r.candidate?.linkedin || "linkedin.com/in/ritikyadav18",
    r.candidate?.github || "github.com/ritikyadav-io",
    r.candidate?.location || "Jaipur, 302039"
  ].filter(Boolean);
  const contactStr = contactParts.join("  |  ");
  
  const contactLines = doc.splitTextToSize(contactStr, CW);
  contactLines.forEach((ln: string) => {
    doc.text(ln, W / 2, y, { align: "center" });
    y += 4;
  });
  y += 1;

  doc.setDrawColor(15, 23, 42); doc.setLineWidth(0.8);
  doc.line(M, y, W - M, y);
  y += 5.5;

  // ----------------------------------------------------
  // 1. PROFESSIONAL SUMMARY
  // ----------------------------------------------------
  drawH2("Professional Summary");
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(51, 65, 85);
  const rawSummary = r.candidate?.summary || `${r.candidate?.title || "B.Tech Artificial Intelligence and Data Science student"} with a genuine interest in software development, from building full-stack platforms to automating backend data pipelines aligned for ${targetCompany}. Comfortable working across Python, SQL, HTML/CSS, REST APIs, and cloud tools, with a solid grounding in core computer science fundamentals including data structures, databases, and operating systems. Has built and shipped real projects, including a full-stack job-search platform and a resume analysis tool, alongside hands-on internship experience spanning cloud data engineering and full-stack development.`;
  const summaryText = enhanceSummary(rawSummary, targetCompany, r.candidate?.title);
  y = wrap(doc, summaryText, M, y, CW, 4) + 4;

  // ----------------------------------------------------
  // 2. EDUCATION
  // ----------------------------------------------------
  drawH2("Education");
  const educationEntries = (r.candidate?.education && r.candidate.education.length > 0)
    ? r.candidate.education
    : [{
        degree: "Bachelor of Technology – Artificial Intelligence and Data Science",
        year: "2023 — 2027",
        school: "Arya College of Engineering and IT (RTU Affiliated), Jaipur",
        coursework: "Data Structures and Algorithms (DSA), Operating Systems (OS), Database Management Systems (DBMS), Machine Learning (ML), Cloud Computing (CC)"
      }];

  educationEntries.forEach(edu => {
    pageBreak(14);
    doc.setFont("helvetica", "bold"); doc.setFontSize(9.5); doc.setTextColor(15, 23, 42);
    doc.text(edu.degree, M, y);
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(15, 23, 42);
    doc.text(edu.year, W - M, y, { align: "right" });
    y += 4.5;
    doc.setFont("helvetica", "italic"); doc.setFontSize(9); doc.setTextColor(71, 85, 105);
    doc.text(edu.school, M + 2, y);
    y += 4.5;
    if (edu.coursework) {
      doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(71, 85, 105);
      doc.text("Relevant Coursework:", M + 2, y);
      const labelW = doc.getTextWidth("Relevant Coursework: ");
      doc.setFont("helvetica", "normal");
      y = wrap(doc, edu.coursework.trim(), M + 2 + labelW, y, CW - 2 - labelW, 3.8) + 3;
    }
    y += 1.5;
  });
  y += 2.5;

  // ----------------------------------------------------
  // 3. PROFESSIONAL EXPERIENCE
  // ----------------------------------------------------
  drawH2("Professional Experience");

  const drawRoleEntry = (roleTitle: string, companyName: string, period: string, locationStr: string, bullets: string[]) => {
    pageBreak(20);
    const titleCompany = `${roleTitle} - ${companyName}`;
    doc.setFont("helvetica", "bold"); doc.setFontSize(9.5); doc.setTextColor(15, 23, 42);
    doc.text(titleCompany, M, y);
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(15, 23, 42);
    doc.text(period, W - M, y, { align: "right" });
    y += 4.5;
    if (locationStr) {
      doc.setFont("helvetica", "italic"); doc.setFontSize(8.5); doc.setTextColor(100, 116, 139);
      doc.text(locationStr, M + 2, y);
      y += 4;
    }
    doc.setFont("helvetica", "normal"); doc.setFontSize(8.8); doc.setTextColor(51, 65, 85);
    bullets.forEach(b => {
      pageBreak(7);
      doc.text("-", M + 2, y);
      y = wrap(doc, b.trim(), M + 6, y, CW - 6, 3.8) + 1.2;
    });
    y += 2.5;
  };

  const experienceEntries = (r.candidate?.experience && r.candidate.experience.length > 0)
    ? r.candidate.experience
    : [
        {
          role: "AWS Data Engineer Intern",
          company: "Graas Solutions",
          period: "May 2026 — Jul 2026",
          location: "Jaipur, India",
          bullets: (r.rewrites && r.rewrites.length >= 3) ? [r.rewrites[0].after, r.rewrites[1].after, r.rewrites[2].after] : [
            "Built automated reporting dashboards using SQL, Python, and AWS Lambda, helping the team move from manual reports toward real-time reporting.",
            "Worked on SQL query optimization and ETL pipelines using AWS Glue and Redshift, making data compilation faster and more reliable for the team.",
            "Helped automate data pipelines using AWS Lambda and S3, organizing data from multiple sources into clean, structured schemas."
          ]
        },
        {
          role: "Full Stack Developer Intern",
          company: "Groot Software",
          period: "May 2025 — Jul 2025",
          location: "Jaipur, India",
          bullets: [
            "Built and deployed responsive web pages using HTML, CSS, and JavaScript, integrating REST APIs to fetch and render live data on both frontend and backend.",
            "Worked across the stack to debug layout issues and improve component structure, collaborating with senior developers using Git version control."
          ]
        }
      ];

  experienceEntries.forEach(exp => {
    const bulletsToUse = exp.bullets.map(b => enhanceBullet(b, r.rewrites));
    drawRoleEntry(exp.role, exp.company, exp.period, exp.location || "", bulletsToUse);
  });

  // ----------------------------------------------------
  // 4. PROJECTS
  // ----------------------------------------------------
  drawH2("Projects");

  const drawProjectEntry = (projTitle: string, subtitle: string, bullets: string[]) => {
    pageBreak(16);
    doc.setFont("helvetica", "bold"); doc.setFontSize(9.5); doc.setTextColor(15, 23, 42);
    const mainTitle = projTitle;
    doc.text(mainTitle, M, y);
    const titleWidth = doc.getTextWidth(mainTitle);
    if (subtitle) {
      doc.setFont("helvetica", "italic"); doc.setFontSize(8.5); doc.setTextColor(100, 116, 139);
      doc.text(`|  ${subtitle}`, M + titleWidth + 2.5, y);
    }
    y += 4.5;
    doc.setFont("helvetica", "normal"); doc.setFontSize(8.8); doc.setTextColor(51, 65, 85);
    bullets.forEach(b => {
      pageBreak(7);
      doc.text("-", M + 2, y);
      y = wrap(doc, b.trim(), M + 6, y, CW - 6, 3.8) + 1.2;
    });
    y += 2.5;
  };

  const projectEntries = (r.candidate?.projects && r.candidate.projects.length > 0)
    ? r.candidate.projects.map(p => ({
        title: p.name,
        subtitle: p.subtitle || "",
        bullets: (p.bullets || (p.desc ? [p.desc] : [])).map(b => enhanceBullet(b, r.rewrites))
      }))
    : [
        {
          title: "Trail – Job Platforms Pipeline",
          subtitle: "Associated with Graas Solutions (P) Ltd",
          bullets: [
            "Built a full-stack job pipeline platform that fetches listings from multiple job platforms and displays them together on one unified screen, so users don't have to check each site separately.",
            "Used AI to generate per-listing JD summaries, personalized cold emails, and outreach messages, helping candidates apply faster with tailored, professional communication.",
            "Added direct apply links and job filters for domain, experience level, and location, making it easier for users to find roles that actually match their profile."
          ].map(b => enhanceBullet(b, r.rewrites))
        },
        {
          title: "ElevateCv – ATS Tracking Tool",
          subtitle: "Python, NLP, ATS Scoring",
          bullets: [
            "Built an ATS tracking tool where users upload a resume and job description together, triggering an automated analysis instead of manual review.",
            "Designed a multi-stage evaluation pipeline that checks power verbs, action verbs, keyword usage, and formatting to generate a resume quality score.",
            "Delivered a detailed report highlighting specific sections, phrases, and keywords to improve, turning the score into a clear, actionable plan."
          ].map(b => enhanceBullet(b, r.rewrites))
        }
      ];

  projectEntries.forEach(p => drawProjectEntry(p.title, p.subtitle, p.bullets));

  // ----------------------------------------------------
  // 5. TECHNICAL SKILLS
  // ----------------------------------------------------
  drawH2("Technical Skills");

  const drawSkillRow = (label: string, val: string) => {
    pageBreak(7);
    doc.setFont("helvetica", "bold"); doc.setFontSize(8.8); doc.setTextColor(30, 41, 59);
    const labelStr = `•  ${label}: `;
    const labelWidth = doc.getTextWidth(labelStr);
    doc.text(labelStr, M, y);
    doc.setFont("helvetica", "normal"); doc.setTextColor(71, 85, 105);
    y = wrap(doc, val.trim(), M + labelWidth, y, CW - labelWidth, 3.8) + 1.2;
  };

  if (r.candidate?.skills) {
    if (Array.isArray(r.candidate.skills)) {
      drawSkillRow("Skills", r.candidate.skills.join(", "));
    } else if (typeof r.candidate.skills === "object") {
      Object.entries(r.candidate.skills).forEach(([cat, list]) => {
        drawSkillRow(cat, Array.isArray(list) ? list.join(", ") : String(list));
      });
    }
  } else if (r.candidate?.topSkills && r.candidate.topSkills.length > 0) {
    drawSkillRow("Core Technical Stack", r.candidate.topSkills.join(", "));
  } else {
    drawSkillRow("Programming Languages", "Python, HTML, CSS, REST API, SQL");
    drawSkillRow("Analytics & Data Tools", "Power BI, Excel (VLOOKUP, Pivot Tables, INDEX-MATCH), Matplotlib, Seaborn");
    drawSkillRow("Databases", "Amazon RDS, MySQL, Supabase, Database Schema Design");
    drawSkillRow("Cloud", "AWS (S3, Lambda, QuickSight, Athena, Redshift, Glue, CloudWatch)");
    drawSkillRow("Currently Building", "Data Structures and Algorithms (DSA) – practicing problem-solving on arrays, strings, and recursion");
  }
  y += 2.5;

  // ----------------------------------------------------
  // 6. CERTIFICATIONS
  // ----------------------------------------------------
  drawH2("Certifications");
  const certs = (r.candidate?.certifications && r.candidate.certifications.length > 0)
    ? r.candidate.certifications
    : [
        "Java Programming Professional Certification - IIT Bombay (2024)",
        "HubSpot Data Integration Certificate - HubSpot Academy (2025)",
        "Technical Automation Proficiency - Cursor, Lovable, Claude, ChatGPT for Data Pipeline Development"
      ];
  certs.forEach(c => {
    pageBreak(6);
    doc.setFont("helvetica", "normal"); doc.setFontSize(8.8); doc.setTextColor(51, 65, 85);
    doc.text("-", M + 2, y);
    y = wrap(doc, c.trim(), M + 6, y, CW - 6, 3.8) + 1.5;
  });

  return doc;
}

function escapeLatex(str: string): string {
  if (!str) return "";
  return str
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/&/g, "\\&")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");
}

export function generateLatexResume(r: AnalysisReport): string {
  const candName = (r.candidate?.name && r.candidate.name !== "Candidate") ? r.candidate.name : "RITIK YADAV";
  const phone = r.candidate?.phone || "+91-8824318839";
  const email = r.candidate?.email || "yadavritik2027@gmail.com";
  const linkedin = r.candidate?.linkedin || "linkedin.com/in/ritikyadav18";
  const github = r.candidate?.github || "github.com/ritikyadav-io";
  const location = r.candidate?.location || "Jaipur, 302039";

  const targetCompany = r.company || "Target Company";
  const rawSummary = r.candidate?.summary || `${r.candidate?.title || "B.Tech Artificial Intelligence and Data Science student"} with a genuine interest in software development, from building full-stack platforms to automating backend data pipelines aligned for ${targetCompany}. Comfortable working across Python, SQL, HTML/CSS, REST APIs, and cloud tools, with a solid grounding in core computer science fundamentals including data structures, databases, and operating systems. Has built and shipped real projects, alongside hands-on internship experience.`;
  const summaryText = enhanceSummary(rawSummary, targetCompany, r.candidate?.title);

  // Education
  const educationEntries = (r.candidate?.education && r.candidate.education.length > 0)
    ? r.candidate.education
    : [{
        degree: "Bachelor of Technology – Artificial Intelligence and Data Science",
        year: "2023 — 2027",
        school: "Arya College of Engineering and IT (RTU Affiliated), Jaipur",
        coursework: "Data Structures and Algorithms (DSA), Operating Systems (OS), Database Management Systems (DBMS), Machine Learning (ML), Cloud Computing (CC)"
      }];

  const latexEdu = educationEntries.map(edu => `  \\resumeSubheading
    {${escapeLatex(edu.school)}}{${escapeLatex(edu.year)}}
    {${escapeLatex(edu.degree)}}{${escapeLatex(location)}}
  \\resumeItemListStart
    \\resumeItem{Relevant Coursework: ${escapeLatex(edu.coursework || "")}}
  \\resumeItemListEnd`).join("\n\n");

  // Experience
  const experienceEntries = (r.candidate?.experience && r.candidate.experience.length > 0)
    ? r.candidate.experience
    : [
        {
          role: "AWS Data Engineer Intern",
          company: "Graas Solutions",
          period: "May 2026 — Jul 2026",
          location: "Jaipur, India",
          bullets: [
            "Built automated reporting dashboards using SQL, Python, and AWS Lambda, helping the team move from manual reports toward real-time reporting.",
            "Worked on SQL query optimization and ETL pipelines using AWS Glue and Redshift, making data compilation faster and more reliable for the team.",
            "Helped automate data pipelines using AWS Lambda and S3, organizing data from multiple sources into clean, structured schemas."
          ]
        },
        {
          role: "Full Stack Developer Intern",
          company: "Groot Software",
          period: "May 2025 — Jul 2025",
          location: "Jaipur, India",
          bullets: [
            "Built and deployed responsive web pages using HTML, CSS, and JavaScript, integrating REST APIs to fetch and render live data on both frontend and backend.",
            "Worked across the stack to debug layout issues and improve component structure, collaborating with senior developers using Git version control."
          ]
        }
      ];

  const latexExp = experienceEntries.map(exp => {
    const bullets = exp.bullets.map(b => `    \\resumeItem{${escapeLatex(enhanceBullet(b, r.rewrites))}}`).join("\n");
    return `  \\resumeSubheading
    {${escapeLatex(exp.role)} \\textendash\\ ${escapeLatex(exp.company)}}{${escapeLatex(exp.period)}}
    {}{${escapeLatex(exp.location || location)}}
  \\resumeItemListStart
${bullets}
  \\resumeItemListEnd`;
  }).join("\n\n");

  // Projects
  const projectEntries = (r.candidate?.projects && r.candidate.projects.length > 0)
    ? r.candidate.projects.map(p => ({
        title: p.name,
        subtitle: p.subtitle || "",
        bullets: (p.bullets || (p.desc ? [p.desc] : [])).map(b => enhanceBullet(b, r.rewrites))
      }))
    : [
        {
          title: "Trail – Job Platforms Pipeline",
          subtitle: "Associated with Graas Solutions (P) Ltd",
          bullets: [
            "Built a full-stack job pipeline platform that fetches listings from multiple job platforms and displays them together on one unified screen, so users don't have to check each site separately.",
            "Used AI to generate per-listing JD summaries, personalized cold emails, and outreach messages, helping candidates apply faster with tailored, professional communication.",
            "Added direct apply links and job filters for domain, experience level, and location, making it easier for users to find roles that actually match their profile."
          ]
        },
        {
          title: "ElevateCv – ATS Tracking Tool",
          subtitle: "Python, NLP, ATS Scoring",
          bullets: [
            "Built an ATS tracking tool where users upload a resume and job description together, triggering an automated analysis instead of manual review.",
            "Designed a multi-stage evaluation pipeline that checks power verbs, action verbs, keyword usage, and formatting to generate a resume quality score.",
            "Delivered a detailed report highlighting specific sections, phrases, and keywords to improve, turning the score into a clear, actionable plan."
          ]
        }
      ];

  const latexProj = projectEntries.map(p => {
    const bullets = p.bullets.map(b => `    \\resumeItem{${escapeLatex(enhanceBullet(b, r.rewrites))}}`).join("\n");
    return `  \\resumeProjectHeading
    {\\textbf{${escapeLatex(p.title)}}${p.subtitle ? ` $|$ \\emph{${escapeLatex(p.subtitle)}}` : ""}}{}
  \\resumeItemListStart
${bullets}
  \\resumeItemListEnd`;
  }).join("\n\n");

  // Skills
  let latexSkills = "";
  if (r.candidate?.skills) {
    if (Array.isArray(r.candidate.skills)) {
      latexSkills = `  \\resumeItem{\\textbf{Technical Stack:} ${escapeLatex(r.candidate.skills.join(", "))}}`;
    } else if (typeof r.candidate.skills === "object") {
      latexSkills = Object.entries(r.candidate.skills).map(([cat, list]) => 
        `  \\resumeItem{\\textbf{${escapeLatex(cat)}:} ${escapeLatex(Array.isArray(list) ? list.join(", ") : String(list))}}`
      ).join("\n");
    }
  } else if (r.candidate?.topSkills && r.candidate.topSkills.length > 0) {
    latexSkills = `  \\resumeItem{\\textbf{Core Technical Stack:} ${escapeLatex(r.candidate.topSkills.join(", "))}}`;
  } else {
    latexSkills = `  \\resumeItem{\\textbf{Programming Languages:} Python, HTML, CSS, REST API, SQL}
  \\resumeItem{\\textbf{Analytics \\& Data Tools:} Power BI, Excel (VLOOKUP, Pivot Tables, INDEX-MATCH), Matplotlib, Seaborn}
  \\resumeItem{\\textbf{Databases:} Amazon RDS, MySQL, Supabase, Database Schema Design}
  \\resumeItem{\\textbf{Cloud \\& DevOps:} AWS (S3, Lambda, QuickSight, Athena, Redshift, Glue, CloudWatch)}
  \\resumeItem{\\textbf{Currently Building:} Data Structures and Algorithms (DSA) -- practicing problem-solving on arrays, strings, and recursion}`;
  }

  // Certifications
  const certs = (r.candidate?.certifications && r.candidate.certifications.length > 0)
    ? r.candidate.certifications
    : [
        "Java Programming Professional Certification -> IIT Bombay (2024)",
        "HubSpot Data Integration Certificate -> HubSpot Academy (2025)",
        "Technical Automation Proficiency -> Cursor, Lovable, Claude, ChatGPT for Data Pipeline Development"
      ];
  const latexCerts = certs.map(c => `  \\resumeItem{${escapeLatex(c)}}`).join("\n");

  return `%-------------------------------------------------------------------
% Open-Source LaTeX Resume Template (90+ ATS Score Optimized)
% License: MIT — free to use, modify, and distribute
% Compile with: xelatex resume.tex
% Requires: the Carlito font (free, metric-compatible with Calibri)
%   Debian/Ubuntu: sudo apt install fonts-crosextra-carlito
%   macOS:         brew install --cask font-carlito
%   Or download from Google Fonts and install manually.
%-------------------------------------------------------------------

\\documentclass[letterpaper,10.5pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\hypersetup{
    colorlinks=false,
    pdfborder={0 0 0},
}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{fontspec}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% ---- Font ----
\\setmainfont{Carlito}

% ---- Margins ----
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-0.5in}
\\addtolength{\\textheight}{1in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% ---- Section heading style: bold title + full-width black rule ----
\\titleformat{\\section}{
  \\vspace{-4pt}\\raggedright\\large\\bfseries
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% ---- Reusable commands ----
\\newcommand{\\resumeItem}[1]{
  \\item\\small{#1 \\vspace{-2pt}}
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-1pt}\\item
    \\begin{tabular*}{\\linewidth}{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & \\textbf{\\small #2} \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-6pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{\\linewidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & \\textbf{\\small #2}\\\\
    \\end{tabular*}\\vspace{-6pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.2in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}[leftmargin=0.2in, label=$\\rightarrow$]}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------------------------------
\\begin{document}

% ==================== HEADER ====================
\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLatex(candName.toUpperCase())}} \\\\ \\vspace{3pt}
    \\small ${escapeLatex(phone)} $|$
    \\href{mailto:${escapeLatex(email)}}{${escapeLatex(email)}} $|$
    \\href{https://${escapeLatex(linkedin)}}{${escapeLatex(linkedin)}} $|$
    \\href{https://${escapeLatex(github)}}{${escapeLatex(github)}} $|$
    ${escapeLatex(location)}
\\end{center}

% ==================== SUMMARY ====================
\\section{Professional Summary}
\\resumeSubHeadingListStart
  \\resumeItem{${escapeLatex(summaryText)}}
\\resumeSubHeadingListEnd

% ==================== EDUCATION ====================
\\section{Education}
\\resumeSubHeadingListStart
${latexEdu}
\\resumeSubHeadingListEnd

% ==================== EXPERIENCE ====================
\\section{Professional Experience}
\\resumeSubHeadingListStart
${latexExp}
\\resumeSubHeadingListEnd

% ==================== PROJECTS ====================
\\section{Projects}
\\resumeSubHeadingListStart
${latexProj}
\\resumeSubHeadingListEnd

% ==================== TECHNICAL SKILLS ====================
\\section{Technical Skills}
\\resumeSubHeadingListStart
${latexSkills}
\\resumeSubHeadingListEnd

% ==================== CERTIFICATIONS ====================
\\section{Certifications}
\\resumeSubHeadingListStart
${latexCerts}
\\resumeSubHeadingListEnd

\\end{document}
`;
}

export function generateWordResumeHtml(r: AnalysisReport): string {
  const candName = (r.candidate?.name && r.candidate.name !== "Candidate") ? r.candidate.name : "RITIK YADAV";
  const phone = r.candidate?.phone || "+91-8824318839";
  const email = r.candidate?.email || "yadavritik2027@gmail.com";
  const linkedin = r.candidate?.linkedin || "linkedin.com/in/ritikyadav18";
  const github = r.candidate?.github || "github.com/ritikyadav-io";
  const location = r.candidate?.location || "Jaipur, 302039";

  const targetCompany = r.company || "Target Company";
  const rawSummary = r.candidate?.summary || `${r.candidate?.title || "B.Tech Artificial Intelligence and Data Science student"} with a genuine interest in software development, from building full-stack platforms to automating backend data pipelines aligned for ${targetCompany}. Comfortable working across Python, SQL, HTML/CSS, REST APIs, and cloud tools, with a solid grounding in core computer science fundamentals including data structures, databases, and operating systems. Has built and shipped real projects, alongside hands-on internship experience.`;
  const summaryText = enhanceSummary(rawSummary, targetCompany, r.candidate?.title);

  // Education
  const educationEntries = (r.candidate?.education && r.candidate.education.length > 0)
    ? r.candidate.education
    : [{
        degree: "Bachelor of Technology – Artificial Intelligence and Data Science",
        year: "2023 — 2027",
        school: "Arya College of Engineering and IT (RTU Affiliated), Jaipur",
        coursework: "Data Structures and Algorithms (DSA), Operating Systems (OS), Database Management Systems (DBMS), Machine Learning (ML), Cloud Computing (CC)"
      }];

  const eduHtml = educationEntries.map(edu => `
    <table style="width:100%; border-collapse:collapse; margin-bottom: 2pt;">
      <tr>
        <td style="font-weight:bold; font-size:10.5pt; text-align:left;">• ${edu.degree}</td>
        <td style="font-weight:bold; font-size:10pt; text-align:right; font-family:monospace;">${edu.year}</td>
      </tr>
    </table>
    <div style="font-style:italic; font-size:10pt; color:#4B5563; padding-left:12pt; margin-bottom:2pt;">${edu.school}</div>
    ${edu.coursework ? `<div style="font-size:9.5pt; color:#374151; padding-left:12pt; margin-bottom:4pt;">- <strong>Relevant Coursework:</strong> ${edu.coursework}</div>` : ""}
  `).join("");

  // Experience
  const experienceEntries = (r.candidate?.experience && r.candidate.experience.length > 0)
    ? r.candidate.experience
    : [
        {
          role: "AWS Data Engineer Intern",
          company: "Graas Solutions",
          period: "May 2026 — Jul 2026",
          location: "Jaipur, India",
          bullets: [
            "Built automated reporting dashboards using SQL, Python, and AWS Lambda, helping the team move from manual reports toward real-time reporting.",
            "Worked on SQL query optimization and ETL pipelines using AWS Glue and Redshift, making data compilation faster and more reliable for the team.",
            "Helped automate data pipelines using AWS Lambda and S3, organizing data from multiple sources into clean, structured schemas."
          ]
        },
        {
          role: "Full Stack Developer Intern",
          company: "Groot Software",
          period: "May 2025 — Jul 2025",
          location: "Jaipur, India",
          bullets: [
            "Built and deployed responsive web pages using HTML, CSS, and JavaScript, integrating REST APIs to fetch and render live data on both frontend and backend.",
            "Worked across the stack to debug layout issues and improve component structure, collaborating with senior developers using Git version control."
          ]
        }
      ];

  const expHtml = experienceEntries.map(exp => {
    const bulletsHtml = exp.bullets.map(b => `<li style="margin-bottom:2pt;">${enhanceBullet(b, r.rewrites)}</li>`).join("");
    return `
      <table style="width:100%; border-collapse:collapse; margin-top:4pt; margin-bottom:2pt;">
        <tr>
          <td style="font-weight:bold; font-size:10.5pt; text-align:left;">• ${exp.role} – ${exp.company}</td>
          <td style="font-weight:bold; font-size:10pt; text-align:right; font-family:monospace;">${exp.period} ${exp.location ? `| ${exp.location}` : ""}</td>
        </tr>
      </table>
      <ul style="margin-top:2pt; margin-bottom:6pt; padding-left:18pt; font-size:10pt; color:#374151;">
        ${bulletsHtml}
      </ul>
    `;
  }).join("");

  // Projects
  const projectEntries = (r.candidate?.projects && r.candidate.projects.length > 0)
    ? r.candidate.projects.map(p => ({
        title: p.name,
        subtitle: p.subtitle || "",
        bullets: (p.bullets || (p.desc ? [p.desc] : [])).map(b => enhanceBullet(b, r.rewrites))
      }))
    : [
        {
          title: "Trail – Job Platforms Pipeline",
          subtitle: "Associated with Graas Solutions (P) Ltd",
          bullets: [
            "Built a full-stack job pipeline platform that fetches listings from multiple job platforms and displays them together on one unified screen, so users don't have to check each site separately.",
            "Used AI to generate per-listing JD summaries, personalized cold emails, and outreach messages, helping candidates apply faster with tailored, professional communication.",
            "Added direct apply links and job filters for domain, experience level, and location, making it easier for users to find roles that actually match their profile."
          ]
        },
        {
          title: "ElevateCv – ATS Tracking Tool",
          subtitle: "Python, NLP, ATS Scoring",
          bullets: [
            "Built an ATS tracking tool where users upload a resume and job description together, triggering an automated analysis instead of manual review.",
            "Designed a multi-stage evaluation pipeline that checks power verbs, action verbs, keyword usage, and formatting to generate a resume quality score.",
            "Delivered a detailed report highlighting specific sections, phrases, and keywords to improve, turning the score into a clear, actionable plan."
          ]
        }
      ];

  const projHtml = projectEntries.map(p => {
    const bulletsHtml = p.bullets.map(b => `<li style="margin-bottom:2pt;">${b}</li>`).join("");
    return `
      <div style="font-weight:bold; font-size:10.5pt; margin-top:4pt; margin-bottom:2pt;">• ${p.title} ${p.subtitle ? `<span style="font-weight:normal; font-style:italic; color:#6B7280;">| ${p.subtitle}</span>` : ""}</div>
      <ul style="margin-top:2pt; margin-bottom:6pt; padding-left:18pt; font-size:10pt; color:#374151;">
        ${bulletsHtml}
      </ul>
    `;
  }).join("");

  // Skills
  let skillsHtml = "";
  if (r.candidate?.skills) {
    if (Array.isArray(r.candidate.skills)) {
      skillsHtml = `<div style="font-size:10pt; margin-bottom:3pt;"><strong>• Core Technical Stack:</strong> ${r.candidate.skills.join(", ")}</div>`;
    } else if (typeof r.candidate.skills === "object") {
      skillsHtml = Object.entries(r.candidate.skills).map(([cat, list]) => 
        `<div style="font-size:10pt; margin-bottom:3pt;"><strong>• ${cat}:</strong> ${Array.isArray(list) ? list.join(", ") : String(list)}</div>`
      ).join("");
    }
  } else if (r.candidate?.topSkills && r.candidate.topSkills.length > 0) {
    skillsHtml = `<div style="font-size:10pt; margin-bottom:3pt;"><strong>• Core Technical Stack:</strong> ${r.candidate.topSkills.join(", ")}</div>`;
  } else {
    skillsHtml = `
      <div style="font-size:10pt; margin-bottom:3pt;"><strong>• Programming Languages:</strong> Python, HTML, CSS, REST API, SQL</div>
      <div style="font-size:10pt; margin-bottom:3pt;"><strong>• Analytics & Data Tools:</strong> Power BI, Excel (VLOOKUP, Pivot Tables, INDEX-MATCH), Matplotlib, Seaborn</div>
      <div style="font-size:10pt; margin-bottom:3pt;"><strong>• Databases:</strong> Amazon RDS, MySQL, Supabase, Database Schema Design</div>
      <div style="font-size:10pt; margin-bottom:3pt;"><strong>• Cloud & DevOps:</strong> AWS (S3, Lambda, QuickSight, Athena, Redshift, Glue, CloudWatch)</div>
      <div style="font-size:10pt; margin-bottom:3pt;"><strong>• Currently Building:</strong> Data Structures and Algorithms (DSA) — practicing problem-solving on arrays, strings, and recursion</div>
    `;
  }

  // Certifications
  const certs = (r.candidate?.certifications && r.candidate.certifications.length > 0)
    ? r.candidate.certifications
    : [
        "Java Programming Professional Certification → IIT Bombay (2024)",
        "HubSpot Data Integration Certificate → HubSpot Academy (2025)",
        "Technical Automation Proficiency → Cursor, Lovable, Claude, ChatGPT for Data Pipeline Development"
      ];
  const certsHtml = certs.map(c => `<div style="font-size:10pt; margin-bottom:2pt; padding-left:6pt;">• ${c}</div>`).join("");

  return `<html xmlns:o='urn:schemas-microsoft-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>${candName} Resume</title>
<!--[if gte mso 9]>
<xml>
 <w:WordDocument>
  <w:View>Print</w:View>
  <w:Zoom>100</w:Zoom>
  <w:DoNotOptimizeForCustomXSL/>
 </w:WordDocument>
</xml>
<![endif]-->
<style>
@page WordSection1 {
  size: 8.5in 11.0in;
  margin: 0.5in 0.5in 0.5in 0.5in;
  mso-header-margin: 0.5in;
  mso-footer-margin: 0.5in;
}
div.WordSection1 { page: WordSection1; }
body {
  font-family: 'Calibri', 'Arial', sans-serif;
  font-size: 10.5pt;
  line-height: 1.25;
  color: #111827;
}
h1 {
  font-size: 20pt;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  margin: 0 0 2pt 0;
}
.contact-line {
  text-align: center;
  font-size: 9.5pt;
  color: #4B5563;
  margin-bottom: 10pt;
}
h2 {
  font-size: 11pt;
  font-weight: bold;
  text-transform: uppercase;
  border-bottom: 1.5pt solid #111827;
  padding-bottom: 1pt;
  margin-top: 10pt;
  margin-bottom: 4pt;
  color: #111827;
}
</style>
</head>
<body>
<div class="WordSection1">

<h1>${candName}</h1>
<div class="contact-line">
  ${phone} | ${email} | ${linkedin} | ${github} | ${location}
</div>

<h2>Professional Summary</h2>
<div style="font-size:10pt; line-height:1.3; margin-bottom:6pt;">${summaryText}</div>

<h2>Education</h2>
${eduHtml}

<h2>Professional Experience</h2>
${expHtml}

<h2>Projects</h2>
${projHtml}

<h2>Technical Skills</h2>
${skillsHtml}

<h2>Certifications</h2>
${certsHtml}

</div>
</body>
</html>`;
}