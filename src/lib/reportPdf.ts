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

  // Header
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, W, 22, "F");
  doc.setTextColor(255); doc.setFont("helvetica", "bold"); doc.setFontSize(18);
  doc.text("ElevateCv — ATS Intelligence Report", M, 14);
  doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text(new Date().toLocaleString(), W - M, 14, { align: "right" });
  y = 30;

  doc.setTextColor(20);
  doc.setFontSize(11);
  doc.text(`Candidate: ${r.candidate?.name || "—"}   |   Target: ${r.role || ""} @ ${r.company || ""}`, M, y); y += 6;
  doc.setFontSize(28); doc.setFont("helvetica", "bold");
  doc.setTextColor(r.overallScore >= 85 ? 16 : r.overallScore >= 70 ? 30 : 200, r.overallScore >= 85 ? 185 : r.overallScore >= 70 ? 130 : 60, 60);
  doc.text(`${r.overallScore}/100`, M, y + 10);
  doc.setTextColor(60);
  doc.setFontSize(10); doc.setFont("helvetica", "normal");
  y = wrap(doc, `Verdict: ${r.verdict}`, M + 40, y + 4, CW - 40, 5) + 6;

  // Category scores
  doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(20);
  doc.text("Category Breakdown", M, y); y += 6;
  doc.setFontSize(10); doc.setFont("helvetica", "normal");
  r.categoryScores?.forEach(c => {
    pageBreak(8);
    doc.setTextColor(60);
    doc.text(`${c.name}`, M, y);
    doc.text(`${c.score}/100`, M + 60, y);
    doc.setDrawColor(230, 230, 230); doc.setFillColor(230, 230, 230);
    doc.rect(M + 80, y - 3, 100, 3, "F");
    doc.setFillColor(c.score >= 80 ? 16 : c.score >= 60 ? 234 : 220, c.score >= 80 ? 185 : c.score >= 60 ? 179 : 60, c.score >= 80 ? 129 : c.score >= 60 ? 8 : 60);
    doc.rect(M + 80, y - 3, Math.max(1, c.score), 3, "F");
    y += 6;
  });

  // Missing keywords
  y += 3; pageBreak(20);
  doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(20);
  doc.text("Missing Keywords (from JD)", M, y); y += 5;
  doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(60);
  y = wrap(doc, (r.missingKeywords || []).join(" · ") || "None detected.", M, y, CW, 5) + 6;

  // Strong points
  pageBreak(20);
  doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(20);
  doc.text("Strong Points", M, y); y += 5;
  doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(60);
  (r.strongPoints || []).forEach(s => { pageBreak(8); y = wrap(doc, `• ${s}`, M, y, CW, 5) + 1; });
  y += 4;

  // Modules
  pageBreak(20);
  doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(20);
  doc.text("Module-by-Module Findings & Recommendations", M, y); y += 6;
  r.modules.filter(m => m.weight !== "Action").forEach(m => {
    pageBreak(30);
    doc.setFillColor(245, 246, 250); doc.rect(M, y - 4, CW, 7, "F");
    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(20);
    doc.text(`${m.name}`, M + 2, y);
    doc.text(`${m.score}/100`, M + CW - 2, y, { align: "right" });
    y += 6;
    doc.setFontSize(9); doc.setFont("helvetica", "italic"); doc.setTextColor(90);
    if (m.reason) y = wrap(doc, `Why: ${m.reason}`, M, y, CW, 4.2) + 2;
    doc.setFont("helvetica", "normal"); doc.setTextColor(60);
    if (m.findings?.length) {
      doc.setFont("helvetica", "bold"); doc.text("Findings:", M, y); y += 4;
      doc.setFont("helvetica", "normal");
      m.findings.forEach(f => { pageBreak(8); y = wrap(doc, `• ${f}`, M + 2, y, CW - 4, 4.2) + 1; });
    }
    if (m.recommendations?.length) {
      y += 1;
      doc.setFont("helvetica", "bold"); doc.setTextColor(16, 130, 90); doc.text("Fix now:", M, y); y += 4;
      doc.setFont("helvetica", "normal"); doc.setTextColor(60);
      m.recommendations.forEach(f => { pageBreak(8); y = wrap(doc, `→ ${f}`, M + 2, y, CW - 4, 4.2) + 1; });
    }
    y += 4;
  });

  // Rewrites
  pageBreak(20);
  doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(20);
  doc.text("AI Rewrites (STAR + Quantified)", M, y); y += 6;
  (r.rewrites || []).forEach(rw => {
    pageBreak(24);
    doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(120, 60, 200);
    doc.text(`[${rw.type}]`, M, y); y += 5;
    doc.setFont("helvetica", "normal"); doc.setTextColor(180, 40, 40);
    y = wrap(doc, `Before: ${rw.before}`, M, y, CW, 4.4) + 1;
    doc.setTextColor(16, 130, 90);
    y = wrap(doc, `After:  ${rw.after}`, M, y, CW, 4.4) + 4;
  });

  // Cover letter
  pageBreak(30);
  doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(20);
  doc.text(`Cover Letter — ${r.company || ""}`, M, y); y += 6;
  doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(60);
  y = wrap(doc, r.coverLetter || "", M, y, CW, 5) + 6;



  // Prompt for other AI tools
  pageBreak(30);
  doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(20);
  doc.text("Paste-into-ChatGPT Prompt", M, y); y += 6;
  doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(60);
  const prompt = `You are a senior recruiter and ATS expert. Using the report below, rewrite my resume to achieve a 90+ ATS score for the ${r.role || "target"} role at ${r.company || "the target company"}. Preserve truthfulness. Weave in the missing keywords naturally. Use STAR + quantified impact in every bullet. Output ATS-safe plain text (no tables/columns/icons). Sound human — no AI-detectable filler.`;
  y = wrap(doc, prompt, M, y, CW, 4.2) + 4;

  // Footer note
  pageBreak(10);
  doc.setFontSize(8); doc.setTextColor(150);
  doc.text("Generated by ElevateCv · elevatecv.app", M, 290);

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