import { jsPDF } from "jspdf";

export type AnalysisModule = {
  id: string; name: string; icon: string; desc: string; weight: string;
  score: number; findings: string[]; recommendations?: string[]; reason?: string;
};
export type AnalysisReport = {
  overallScore: number;
  verdict: string;
  candidate: { name: string; title: string; topSkills: string[] };
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
    if (y + need > 285) { doc.addPage(); y = M; }
  };

  // Header Banner
  doc.setFillColor(15, 23, 42); // Deep slate charcoal
  doc.rect(0, 0, W, 24, "F");
  doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(16);
  doc.text("ElevateCv — Executive ATS & Recruiter Report", M, 13);
  doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(203, 213, 225);
  doc.text(`AUDIT DATE: ${new Date().toLocaleDateString()} | CONFIDENTIAL`, W - M, 13, { align: "right" });
  y = 32;

  // Metadata & Score Box
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10); doc.setFont("helvetica", "bold");
  doc.text(`Candidate: ${r.candidate?.name || "Candidate"}   |   Target: ${r.role || "Target Role"} @ ${r.company || "Target Company"}`, M, y); 
  y += 7;

  // Score Badge
  doc.setFontSize(26); doc.setFont("helvetica", "bold");
  const sColor: [number, number, number] = r.overallScore >= 85 ? [16, 185, 129] : r.overallScore >= 70 ? [37, 99, 235] : r.overallScore >= 55 ? [217, 119, 6] : [220, 38, 38];
  doc.setTextColor(...sColor);
  doc.text(`${r.overallScore}/100`, M, y + 8);

  doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(71, 85, 105);
  y = wrap(doc, `Executive Verdict: ${r.verdict}`, M + 42, y + 2, CW - 42, 4.5) + 6;

  // ----------------------------------------------------
  // 🎓 PROFESSOR'S DIAGNOSTIC AUDIT & MASTERPLAN
  // ----------------------------------------------------
  pageBreak(45);
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(M, y - 2, CW, 42, 2, 2, "FD");

  doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(15, 23, 42);
  doc.text("Professor's Executive Audit & Structural Diagnostic", M + 4, y + 4);
  
  doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(100, 116, 139);
  doc.text(`Audit Grade: ${r.overallScore >= 85 ? "A+ (Executive Distinction)" : r.overallScore >= 75 ? "A- (Interview Ready)" : r.overallScore >= 60 ? "B (Moderate Alignment)" : "C/D (High ATS Drop Risk)"}`, W - M - 4, y + 4, { align: "right" });

  y += 9;
  doc.setFontSize(8.5); doc.setFont("helvetica", "bold"); doc.setTextColor(30, 41, 59);
  
  // 4 Diagnostic Sub-Blocks
  doc.text("1. Structure & Layout Architecture:", M + 4, y);
  doc.setFont("helvetica", "normal"); doc.setTextColor(71, 85, 105);
  doc.text("Margins 0.5\"-0.75\", single-column parsing safety, line density optimization.", M + 55, y);
  y += 5.5;

  doc.setFont("helvetica", "bold"); doc.setTextColor(30, 41, 59);
  doc.text("2. Power Verbs & Action Language:", M + 4, y);
  doc.setFont("helvetica", "normal"); doc.setTextColor(71, 85, 105);
  doc.text("Replaces passive phrasing (helped, managed) with high-impact executive verbs.", M + 55, y);
  y += 5.5;

  doc.setFont("helvetica", "bold"); doc.setTextColor(30, 41, 59);
  doc.text("3. Quantification & STAR Rigor:", M + 4, y);
  doc.setFont("helvetica", "normal"); doc.setTextColor(71, 85, 105);
  doc.text("Evaluates metrics density (%, $, time saved). Target: >80% bullets quantified.", M + 55, y);
  y += 5.5;

  doc.setFont("helvetica", "bold"); doc.setTextColor(30, 41, 59);
  doc.text("4. Priority Action Plan:", M + 4, y);
  doc.setFont("helvetica", "normal"); doc.setTextColor(71, 85, 105);
  doc.text(`1. Add missing keywords  2. Quantify bullets with numbers  3. Enhance action verbs`, M + 55, y);
  y += 12;

  // Category Breakdown
  pageBreak(30);
  doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(15, 23, 42);
  doc.text("Category Breakdown & Performance Pillars", M, y); y += 6;
  doc.setFontSize(9); doc.setFont("helvetica", "normal");
  r.categoryScores?.forEach(c => {
    pageBreak(7);
    doc.setTextColor(51, 65, 85);
    doc.text(`${c.name}`, M, y);
    doc.text(`${c.score}/100`, M + 55, y);
    doc.setDrawColor(226, 232, 240); doc.setFillColor(241, 245, 249);
    doc.rect(M + 72, y - 3, 100, 3, "F");
    const barColor: [number, number, number] = c.score >= 80 ? [16, 185, 129] : c.score >= 60 ? [234, 179, 8] : [239, 68, 68];
    doc.setFillColor(...barColor);
    doc.rect(M + 72, y - 3, Math.max(1, c.score), 3, "F");
    y += 5.5;
  });

  // Missing keywords
  y += 4; pageBreak(20);
  doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(15, 23, 42);
  doc.text("Missing Critical Keywords (from target Job Description)", M, y); y += 5;
  doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(71, 85, 105);
  y = wrap(doc, (r.missingKeywords || []).join(" · ") || "None detected. Excellent keyword coverage!", M, y, CW, 4.5) + 6;

  // Strong points
  pageBreak(20);
  doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(15, 23, 42);
  doc.text("Core Resume Strengths", M, y); y += 5;
  doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(71, 85, 105);
  (r.strongPoints || []).forEach(s => { pageBreak(7); y = wrap(doc, `• ${s}`, M, y, CW, 4.5) + 1; });
  y += 4;

  // Modules
  pageBreak(20);
  doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(15, 23, 42);
  doc.text("Module-by-Module Findings & Copy-Paste Recommendations", M, y); y += 6;
  r.modules.filter(m => m.weight !== "Action").forEach(m => {
    pageBreak(30);
    doc.setFillColor(241, 245, 249); doc.rect(M, y - 4, CW, 6.5, "F");
    doc.setFontSize(9.5); doc.setFont("helvetica", "bold"); doc.setTextColor(30, 41, 59);
    doc.text(`${m.name} (${m.weight})`, M + 2, y);
    doc.text(`${m.score}/100`, M + CW - 2, y, { align: "right" });
    y += 5.5;
    doc.setFontSize(8.5); doc.setFont("helvetica", "italic"); doc.setTextColor(100, 116, 139);
    if (m.reason) y = wrap(doc, `Why: ${m.reason}`, M, y, CW, 4) + 2;
    doc.setFont("helvetica", "normal"); doc.setTextColor(71, 85, 105);
    if (m.findings?.length) {
      doc.setFont("helvetica", "bold"); doc.text("Findings:", M, y); y += 4;
      doc.setFont("helvetica", "normal");
      m.findings.forEach(f => { pageBreak(7); y = wrap(doc, `• ${f}`, M + 2, y, CW - 4, 4) + 1; });
    }
    if (m.recommendations?.length) {
      y += 1;
      doc.setFont("helvetica", "bold"); doc.setTextColor(16, 185, 129); doc.text("Actionable Fixes:", M, y); y += 4;
      doc.setFont("helvetica", "normal"); doc.setTextColor(71, 85, 105);
      m.recommendations.forEach(f => { pageBreak(7); y = wrap(doc, `→ ${f}`, M + 2, y, CW - 4, 4) + 1; });
    }
    y += 4;
  });

  // Rewrites
  pageBreak(20);
  doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(15, 23, 42);
  doc.text("Executive AI Bullet Rewrites (STAR + Quantified Impact)", M, y); y += 6;
  (r.rewrites || []).forEach(rw => {
    pageBreak(24);
    doc.setFontSize(8.5); doc.setFont("helvetica", "bold"); doc.setTextColor(124, 58, 237);
    doc.text(`[${rw.type}]`, M, y); y += 4.5;
    doc.setFont("helvetica", "normal"); doc.setTextColor(220, 38, 38);
    y = wrap(doc, `Before: ${rw.before}`, M, y, CW, 4.2) + 1;
    doc.setTextColor(16, 185, 129);
    y = wrap(doc, `After:  ${rw.after}`, M, y, CW, 4.2) + 4;
  });

  // Cover letter
  pageBreak(30);
  doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(15, 23, 42);
  doc.text(`Tailored Cover Letter — ${r.company || ""}`, M, y); y += 6;
  doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(51, 65, 85);
  y = wrap(doc, r.coverLetter || "", M, y, CW, 4.8) + 6;

  // ChatGPT Prompt
  pageBreak(30);
  doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(15, 23, 42);
  doc.text("Paste-into-ChatGPT Prompt", M, y); y += 6;
  doc.setFontSize(8.5); doc.setFont("helvetica", "normal"); doc.setTextColor(71, 85, 105);
  const prompt = `You are a senior recruiter and ATS expert. Using the report below, rewrite my resume to achieve a 90+ ATS score for the ${r.role || "target"} role at ${r.company || "the target company"}. Preserve truthfulness. Weave in the missing keywords naturally. Use STAR + quantified impact in every bullet. Output ATS-safe plain text (no tables/columns/icons). Sound human — no AI-detectable filler.`;
  y = wrap(doc, prompt, M, y, CW, 4) + 4;

  // Footer note
  pageBreak(10);
  doc.setFontSize(8); doc.setTextColor(148, 163, 184);
  doc.text("Generated by ElevateCv Executive Audit Engine · elevatecv.app", M, 290);

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