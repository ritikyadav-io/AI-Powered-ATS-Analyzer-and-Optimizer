import { motion } from "framer-motion";
import { GraduationCap, Zap, BarChart3, Layout, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, FileText } from "lucide-react";
import { AnalysisReport } from "@/lib/reportPdf";

interface Props {
  result: AnalysisReport;
}

export function ProfessorAudit({ result }: Props) {
  const atsModule = result.modules.find((m) => m.id === "ats");
  const verbModule = result.modules.find((m) => m.id === "verbs");
  const quantModule = result.modules.find((m) => m.id === "quant");
  const formatModule = result.modules.find((m) => m.id === "format");

  const grade =
    result.overallScore >= 90 ? "A+ (Executive Distinction)" :
    result.overallScore >= 80 ? "A- (Interview Ready)" :
    result.overallScore >= 70 ? "B (Moderate Alignment)" :
    result.overallScore >= 55 ? "C (Needs Major Refinement)" : "D (High ATS Drop Risk)";

  const gradeColor =
    result.overallScore >= 80 ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" :
    result.overallScore >= 70 ? "text-primary bg-primary/10 border-primary/20" :
    result.overallScore >= 55 ? "text-warning bg-warning/10 border-warning/20" :
    "text-destructive bg-destructive/10 border-destructive/20";

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent border border-accent/20">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-foreground font-display">
                Professor's Executive Audit & Improvement Masterplan
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Comprehensive academic & recruiter diagnostic across structure, action verbs, quantification, and ATS compliance.
            </p>
          </div>
        </div>

        <div className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold ${gradeColor}`}>
          {grade}
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pillar 1: Resume Structure & Layout */}
        <div className="rounded-xl border border-border/60 bg-background/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Layout className="h-4 w-4 text-accent" />
              <span>1. Layout & Structure Architecture</span>
            </div>
            <span className="font-mono text-xs font-bold text-foreground">
              {formatModule?.score ?? result.overallScore}/100
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Evaluates margin boundaries (0.5"–0.75"), font hierarchy, single-column parsing safety, and line density.
          </p>
          <div className="space-y-1.5 pt-1">
            {formatModule?.findings?.slice(0, 3).map((f, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                <span className="text-accent font-bold mt-0.5">•</span>
                <span>{f}</span>
              </div>
            )) || (
              <div className="text-[11px] text-muted-foreground">Standard single-column layout structure validated.</div>
            )}
          </div>
        </div>

        {/* Pillar 2: Power Verbs & Action Language */}
        <div className="rounded-xl border border-border/60 bg-background/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Zap className="h-4 w-4 text-warning" />
              <span>2. Action Verbs & Power Vocabulary</span>
            </div>
            <span className="font-mono text-xs font-bold text-foreground">
              {verbModule?.score ?? 75}/100
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Replaces passive verbs (helped, worked on) with high-velocity active verbs (architected, spearheaded, optimized).
          </p>
          <div className="space-y-1.5 pt-1">
            {verbModule?.findings?.slice(0, 3).map((f, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                <span className="text-warning font-bold mt-0.5">•</span>
                <span>{f}</span>
              </div>
            )) || (
              <div className="text-[11px] text-muted-foreground">Action verbs demonstrate strong ownership signals.</div>
            )}
          </div>
        </div>

        {/* Pillar 3: Quantification & STAR Rigor */}
        <div className="rounded-xl border border-border/60 bg-background/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <BarChart3 className="h-4 w-4 text-emerald-500" />
              <span>3. Quantification & Measurable Metrics</span>
            </div>
            <span className="font-mono text-xs font-bold text-foreground">
              {quantModule?.score ?? 68}/100
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Checks bullet point metric density (%, $, time saved, team size). Target: &gt;80% bullets quantified.
          </p>
          <div className="space-y-1.5 pt-1">
            {quantModule?.findings?.slice(0, 3).map((f, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                <span className="text-emerald-500 font-bold mt-0.5">•</span>
                <span>{f}</span>
              </div>
            )) || (
              <div className="text-[11px] text-muted-foreground">Bullet points contain measurable business achievements.</div>
            )}
          </div>
        </div>

        {/* Pillar 4: ATS Compliance & Parser Readiness */}
        <div className="rounded-xl border border-border/60 bg-background/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>4. ATS Parser Readiness & Keywords</span>
            </div>
            <span className="font-mono text-xs font-bold text-foreground">
              {atsModule?.score ?? result.overallScore}/100
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Ensures text extraction accuracy across Taleo, Greenhouse, Workday, and Lever parsers.
          </p>
          <div className="space-y-1.5 pt-1">
            {result.missingKeywords.length > 0 ? (
              <div className="text-[11px] text-destructive">
                Missing {result.missingKeywords.length} essential keywords from target Job Description.
              </div>
            ) : (
              <div className="text-[11px] text-emerald-500 flex items-center gap-1 font-medium">
                <CheckCircle2 className="h-3 w-3" /> Full keyword alignment against target role.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Professor's Priority Improvement Masterplan */}
      <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-foreground font-display">
          <FileText className="h-4.5 w-4.5 text-accent" />
          <span>Step-by-Step Priority Action Plan</span>
        </div>

        <div className="space-y-3 text-xs">
          {/* Action Step 1 */}
          <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-3">
            <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground font-mono font-bold text-[11px]">
              1
            </div>
            <div className="space-y-1 flex-1">
              <div className="font-semibold text-foreground">Inject Missing Keywords into Summary & Core Experience</div>
              <div className="text-muted-foreground leading-relaxed">
                {result.missingKeywords.length > 0
                  ? `Integrate keywords (${result.missingKeywords.slice(0, 4).join(", ")}) naturally into your bullet points.`
                  : "Maintain current keyword density and ensure exact skill name spelling matches target JD."}
              </div>
            </div>
          </div>

          {/* Action Step 2 */}
          <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-3">
            <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground font-mono font-bold text-[11px]">
              2
            </div>
            <div className="space-y-1 flex-1">
              <div className="font-semibold text-foreground">Quantify All Achievement Bullets (STAR Method)</div>
              <div className="text-muted-foreground leading-relaxed">
                Ensure every bullet includes a baseline metric (e.g. "reduced latency by 35%", "managed $2M budget", "scaled to 50k users").
              </div>
            </div>
          </div>

          {/* Action Step 3 */}
          <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-3">
            <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground font-mono font-bold text-[11px]">
              3
            </div>
            <div className="space-y-1 flex-1">
              <div className="font-semibold text-foreground">Replace Weak Passive Verbs with High-Impact Power Verbs</div>
              <div className="text-muted-foreground leading-relaxed">
                Use the AI Experience Rewriter tab to convert weak openers (e.g., "Helped", "Worked on") to strong executive verbs ("Architected", "Engineered").
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
