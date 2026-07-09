import SiteLayout from "@/components/site/SiteLayout";
import { UploadZone } from "@/components/analyzer/UploadZone";
import { ScoreRing } from "@/components/analyzer/ScoreRing";
import { PremiumScoreRing } from "@/components/analyzer/PremiumScoreRing";
import { ModuleCard } from "@/components/analyzer/ModuleCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles, Loader2, Download, FileCode2, Wand2, Eye, GitCompare, ChevronRight, AlertTriangle, AlertCircle, X, CheckCircle2, Circle, History as HistoryIcon, Trash2, FileDown, Mail, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { buildAnalysisPdf, buildCoverLetterPdf, AnalysisReport } from "@/lib/reportPdf";
import { getHistory, saveHistory, removeHistory, HistoryEntry } from "@/lib/historyStore";
import { Pencil, Check, Copy } from "lucide-react";
import { Link } from "react-router-dom";

function EditableBlock({ title, value, onChange }: { title: string; value: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  useEffect(() => { setDraft(value); }, [value]);
  return (
    <div className="rounded-xl border border-border/80 bg-card p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="text-[15px] font-medium text-foreground">{title}</div>
        <div className="flex gap-1.5">
          <button
            onClick={() => { navigator.clipboard.writeText(value); toast.success("Copied"); }}
            className="grid h-7 w-7 place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground"
            aria-label="Copy"
          ><Copy className="h-3.5 w-3.5" /></button>
          {editing ? (
            <button
              onClick={() => { onChange(draft); setEditing(false); toast.success("Saved"); }}
              className="grid h-7 w-7 place-items-center rounded-md border border-primary/50 bg-primary/10 text-primary"
              aria-label="Save"
            ><Check className="h-3.5 w-3.5" /></button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="grid h-7 w-7 place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground"
              aria-label="Edit"
            ><Pencil className="h-3.5 w-3.5" /></button>
          )}
        </div>
      </div>
      {editing ? (
        <Textarea rows={10} value={draft} onChange={(e) => setDraft(e.target.value)} className="mt-3 text-sm leading-relaxed" />
      ) : (
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{value}</p>
      )}
    </div>
  );
}

type Stage = "input" | "analyzing" | "results";
const tones = ["Corporate", "Startup", "Technical", "Executive"] as const;

type AnalysisResult = AnalysisReport;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const s = r.result as string;
      resolve(s.split(",")[1] ?? "");
    };
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export default function Analyzer() {
  const [stage, setStage] = useState<Stage>("input");
  const [tone, setTone] = useState<(typeof tones)[number]>("Technical");
  const [tab, setTab] = useState<"modules" | "rewrite" | "preview">("modules");

  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [company, setCompany] = useState("Stripe");
  const [role, setRole] = useState("Senior Backend Engineer");
  const [jd, setJd] = useState("We're hiring a Senior Backend Engineer to scale our payments platform. You'll design distributed services in Go and TypeScript, own SLOs, and partner with infra on multi-region rollouts. Strong systems fundamentals, observability mindset, and a bias for measurable impact.");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(() => getHistory());
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const [debugFailPrimary, setDebugFailPrimary] = useState(false);
  const [perfMetrics, setPerfMetrics] = useState<any>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const [pendingResult, setPendingResult] = useState<{ report: AnalysisResult; perf: any } | null>(null);

  // Fast forward to results view instantly when background compilation resolves
  useEffect(() => {
    if (stage === "analyzing" && pendingResult) {
      setResult(pendingResult.report);
      setPerfMetrics(pendingResult.perf);
      setStage("results");
      setPendingResult(null);
    }
  }, [pendingResult, stage]);

  const invokeGroup = async (group: "critical" | "high" | "action", body: Record<string, unknown>) => {
    const t0 = performance.now();
    const { data, error } = await supabase.functions.invoke("analyze-resume", {
      body: { ...body, group, debugFailPrimary },
    });
    const ms = Math.round(performance.now() - t0);
    if (error) throw new Error(`[${group}] ${error.message}`);
    if ((data as any)?.error) throw new Error(`[${group}] ${(data as any).error}`);
    const perf = (data as any)?._perf;
    console.info(`[perf] group=${group} client=${ms}ms server=${perf?.ms ?? "?"}ms provider=${perf?.provider ?? "?"} model=${perf?.model ?? "?"}`);
    return data as any;
  };

  const run = async () => {
    setError(null);
    if (!file) {
      toast.error("Please upload a PDF or DOCX resume first.");
      return;
    }
    if (jd.trim().length < 20) {
      toast.error("Paste the job description.");
      return;
    }
    setStage("analyzing");
    setPendingResult(null);
    try {
      let resumeFile: string | undefined;
      let resumeMime: string | undefined;
      let resumeName: string | undefined;
      if (file) {
        resumeFile = await fileToBase64(file);
        resumeMime = file.type || "application/pdf";
        resumeName = file.name;
      }
      const base = { resumeText, resumeFile, resumeMime, resumeName, jobDescription: jd, company, role, tone };
      const tAll = performance.now();

      const [g1, g2, g3] = await Promise.all([
        invokeGroup("critical", base),
        invokeGroup("high", base),
        invokeGroup("action", base),
      ]);

      console.info(`[perf] total=${Math.round(performance.now() - tAll)}ms`);

      const allModules = [...g1.modules, ...g2.modules];
      let totalScore = 0;
      let totalWeight = 0;
      allModules.forEach(m => {
        let w = 1.0;
        if (m.weight === "Critical") w = 1.5;
        else if (m.weight === "High") w = 1.2;
        else if (m.weight === "Medium") w = 1.0;
        totalScore += (m.score || 0) * w;
        totalWeight += w;
      });
      const computedScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;

      const merged: AnalysisResult = {
        overallScore: computedScore,
        verdict: g3.verdict || "",
        candidate: g1.candidate ?? { name: "Candidate", title: role, topSkills: [] },
        categoryScores: g1.categoryScores ?? [],
        modules: allModules,
        missingKeywords: g1.missingKeywords ?? [],
        strongPoints: g1.strongPoints ?? [],
        rewrites: g3.rewrites ?? [],
        linkedinSummary: g3.linkedinSummary || "",
        coverLetter: g3.coverLetter || "",
        companyBrief: g1.companyBrief || "",
      };
      const withMeta = { ...merged, company, role };
      
      saveHistory({
        company, role,
        overallScore: withMeta.overallScore,
        candidateName: withMeta.candidate?.name || "Candidate",
        report: withMeta,
      });
      setHistory(getHistory());
      
      setPendingResult({
        report: withMeta,
        perf: {
          totalMs: Math.round(performance.now() - tAll),
          criticalPerf: g1._perf,
          highPerf: g2._perf,
          actionPerf: g3._perf
        }
      });
    } catch (e: any) {
      setError(e?.message ?? "Analysis failed");
      toast.error(e?.message ?? "Analysis failed");
      setStage("input");
    }
  };

  const toneColor = (t: string) =>
    t === "success" ? "hsl(var(--success))" : t === "warning" ? "hsl(var(--warning))" : "hsl(var(--destructive))";

  const downloadFullReport = () => {
    if (!result) return;
    const doc = buildAnalysisPdf(result);
    doc.save(`ElevateCv-Report-${(result.company || "target").replace(/\s+/g, "_")}.pdf`);
    toast.success("PDF report downloaded — paste it into any AI tool with your resume.");
  };
  const downloadCoverLetter = () => {
    if (!result) return;
    const doc = buildCoverLetterPdf(result);
    doc.save(`Cover-Letter-${(result.company || "target").replace(/\s+/g, "_")}.pdf`);
  };
  const loadHistory = (h: HistoryEntry) => {
    setResult(h.report); setCompany(h.company); setRole(h.role);
    setStage("results"); window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <SiteLayout>
      <section className="container px-4 pt-4 pb-8 md:px-6 max-w-6xl mx-auto">

        <AnimatePresence mode="wait">
          {stage === "input" && (
            <motion.div key="input" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col lg:grid lg:grid-cols-[1.1fr_1fr] gap-6 w-full min-w-0">
              {/* Left column — resume upload + history */}
              <div className="space-y-6 min-w-0 w-full">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">step 1 · resume</div>
                <UploadZone onFile={setFile} />
                {error && (
                  <div className="flex flex-col sm:flex-row items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold">Analysis failed</div>
                      <div className="mt-0.5 break-all text-xs opacity-90">{error}</div>
                    </div>
                    <Button size="sm" variant="outline" onClick={run} className="shrink-0 border-destructive/40 text-destructive hover:bg-destructive/10">
                      Retry
                    </Button>
                  </div>
                )}
                {history.length > 0 && (
                  <div className="rounded-xl border border-border/80 bg-card p-4">
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground min-w-0">
                        <HistoryIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="truncate">Resume version history</span>
                      </div>
                      <button onClick={() => { localStorage.removeItem("resumai.history.v1"); setHistory([]); }} className="text-xs text-muted-foreground hover:text-accent shrink-0">Clear all</button>
                    </div>
                    <div className="max-h-56 space-y-2 overflow-y-auto">
                      {history.map(h => (
                        <div key={h.id} className="flex items-center gap-2 rounded-lg border border-border/80 bg-background/50 px-3 py-2.5 min-w-0">
                          <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-md font-mono text-xs font-semibold ${h.overallScore >= 85 ? "bg-success/10 text-success" : h.overallScore >= 70 ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"}`}>{h.overallScore}</div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium text-foreground">{h.role} @ {h.company}</div>
                            <div className="text-[10px] text-muted-foreground">{new Date(h.createdAt).toLocaleString()}</div>
                          </div>
                          <button onClick={() => loadHistory(h)} className="text-xs font-medium text-primary hover:underline shrink-0">Open</button>
                          <button onClick={() => { removeHistory(h.id); setHistory(getHistory()); }} className="text-muted-foreground hover:text-destructive shrink-0"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right column — JD + settings */}
              <div className="space-y-6 min-w-0 w-full">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">step 2 · target role</div>
                <div className="rounded-xl border border-border/80 bg-card p-4 space-y-4 w-full min-w-0">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 min-w-0">
                      <Label htmlFor="company" className="text-sm font-medium text-foreground">Company</Label>
                      <Input id="company" className="w-full bg-card border-border/80 focus-visible:ring-foreground" placeholder="e.g. Stripe" value={company} onChange={e => setCompany(e.target.value)} />
                    </div>
                    <div className="space-y-2 min-w-0">
                      <Label htmlFor="role" className="text-sm font-medium text-foreground">Target role</Label>
                      <Input id="role" className="w-full bg-card border-border/80 focus-visible:ring-foreground" placeholder="e.g. Senior Backend Engineer" value={role} onChange={e => setRole(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jd" className="text-sm font-medium text-foreground">Job description</Label>
                    <Textarea id="jd" className="w-full bg-card border-border/80 focus-visible:ring-foreground" rows={8} placeholder="Paste the job description…" value={jd} onChange={e => setJd(e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium text-muted-foreground">Rewrite tone</span>
                    <div className="flex flex-wrap gap-1.5 bg-background p-1.5 rounded-2xl border border-border/60 w-full">
                      {tones.map(t => (
                        <button key={t} type="button" onClick={() => setTone(t)}
                          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                            tone === t
                              ? "bg-card text-foreground border border-border/80 shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}>{t}</button>
                      ))}
                    </div>
                  </div>
                  <Button size="lg" onClick={run} className="w-full h-11 bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium rounded-md select-none" disabled={!file || !jd || !company || !role || stage === "analyzing"}>
                    {stage === "analyzing" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : "Run AI Analysis"}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {stage === "analyzing" && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-auto max-w-xl">
              <div className="rounded-xl border border-border/80 bg-card p-10 text-center flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-5" />
                <h2 className="font-display text-xl font-semibold text-foreground tracking-tight">Analyzing your resume against {company}...</h2>
                <p className="text-[15px] text-muted-foreground mt-3 max-w-sm leading-relaxed">Crawling company details via Firecrawl, parsing job description, and running the 15-node ATS pipeline.</p>
              </div>
            </motion.div>
          )}

          {stage === "results" && result && (
            <motion.div key="results" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              {/* Top summary Grid */}
              <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
                
                {/* 1. Score Box (Premium SaaS Hero Card) */}
                <div className="col-span-1 lg:col-span-2 rounded-[24px] border border-border/60 bg-card p-5 sm:p-10 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_24px_-8px_rgba(0,0,0,0.2)] flex flex-col-reverse lg:flex-row items-center lg:items-start xl:items-center gap-8 lg:gap-10 overflow-hidden relative w-full">
                  {/* Subtle glass reflection overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 pointer-events-none" />
                  
                  {/* Left Column (70%) */}
                  <div className="flex-1 w-full relative z-10 flex flex-col justify-center text-center lg:text-left">
                    <span className="text-[10px] sm:text-[12px] font-bold tracking-[0.2em] uppercase text-muted-foreground font-mono mb-2 sm:mb-3 block">Overall ATS Score</span>
                    <h2 className={`text-2xl sm:text-3xl xl:text-4xl font-bold tracking-tight mb-3 sm:mb-4 ${
                      result.overallScore >= 90 ? "text-emerald-600 dark:text-emerald-400" :
                      result.overallScore >= 75 ? "text-green-600 dark:text-green-400" :
                      result.overallScore >= 60 ? "text-yellow-600 dark:text-yellow-400" :
                      result.overallScore >= 40 ? "text-orange-600 dark:text-orange-400" :
                      "text-red-600 dark:text-red-400"
                    }`}>
                      {result.overallScore >= 90 ? "Excellent Match" :
                       result.overallScore >= 75 ? "Strong Match" :
                       result.overallScore >= 60 ? "Moderate Match" :
                       result.overallScore >= 40 ? "Needs Improvement" :
                       "Poor Match"}
                    </h2>
                    <p className="text-[14px] sm:text-[16px] text-muted-foreground leading-relaxed max-w-xl mb-6 sm:mb-8 mx-auto lg:mx-0">
                      {result.verdict}
                    </p>
                    
                    {/* Findings Chips */}
                    <div className="flex flex-col gap-3 w-full max-w-xl">
                      {result.missingKeywords.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="group flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3 sm:p-4 hover:bg-destructive/10 transition-colors">
                          <div className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-destructive/20 text-destructive"><X className="h-3 w-3" /></div>
                          <div>
                            <div className="text-sm font-semibold text-foreground">Missing Critical Keywords</div>
                            <div className="text-xs text-muted-foreground mt-1">Add {result.missingKeywords.slice(0, 3).join(", ")} to boost match rate.</div>
                          </div>
                        </motion.div>
                      )}
                      
                      {result.categoryScores.some(c => c.score < 70) && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="group flex items-start gap-3 rounded-xl border border-orange-500/20 bg-orange-500/5 p-3 sm:p-4 hover:bg-orange-500/10 transition-colors">
                          <div className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-orange-500/20 text-orange-600"><AlertTriangle className="h-3 w-3" /></div>
                          <div>
                            <div className="text-sm font-semibold text-foreground">Weak Category Performance</div>
                            <div className="text-xs text-muted-foreground mt-1">Improve your {result.categoryScores.find(c => c.score < 70)?.name.toLowerCase()} for better ranking.</div>
                          </div>
                        </motion.div>
                      )}
                      
                      {result.overallScore >= 80 && result.missingKeywords.length === 0 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="group flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 sm:p-4 hover:bg-emerald-500/10 transition-colors">
                          <div className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/20 text-emerald-600"><CheckCircle2 className="h-3 w-3" /></div>
                          <div>
                            <div className="text-sm font-semibold text-foreground">Excellent Keyword Coverage</div>
                            <div className="text-xs text-muted-foreground mt-1">You perfectly align with the core requirements of this JD.</div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                  
                  {/* Right Column (30%) */}
                  <div className="w-full md:w-auto relative z-10 flex shrink-0 justify-center">
                    <PremiumScoreRing score={result.overallScore} />
                  </div>
                </div>

                {/* 2. Category breakdown */}
                <div className="rounded-xl border border-border/80 bg-card p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/40 pb-3 mb-4">
                    <h2 className="text-lg font-semibold tracking-tight text-foreground font-display">Category breakdown</h2>
                    <span className="font-mono text-xs text-muted-foreground">{result.candidate.name} · {result.candidate.title}</span>
                  </div>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {result.categoryScores.map(c => (
                      <div key={c.name} className="rounded-lg border border-border/60 bg-background/30 p-3">
                        <div className="flex items-baseline justify-between text-xs mb-2">
                          <h3 className="font-medium text-foreground">{c.name}</h3>
                          <span className="font-mono font-semibold" style={{ color: toneColor(c.tone) }}>{c.score}</span>
                        </div>
                        <div className="h-1 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full" style={{ width: `${c.score}%`, background: toneColor(c.tone) }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Company Intelligence */}
                {result.companyBrief && (
                  <div className="rounded-xl border border-border/80 bg-card p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-3 border-b border-border/40 pb-3 mb-1">
                      <div className="grid h-8 w-8 place-items-center rounded-md bg-secondary text-foreground">
                        <Sparkles className="h-3.5 w-3.5" />
                      </div>
                      <h2 className="text-lg font-semibold tracking-tight text-foreground font-display">Company Intel & Assessment</h2>
                    </div>
                    {result.chanceOfInterviewing && (
                      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-sm font-medium text-foreground leading-relaxed shadow-sm">
                        {result.chanceOfInterviewing}
                      </div>
                    )}
                    <div className="space-y-1 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      <span className="font-semibold text-foreground block uppercase tracking-wider text-[10px]">Firecrawl Live Intel</span>
                      {result.companyBrief}
                    </div>
                  </div>
                )}

                {/* 4. Missing Keywords */}
                <div className="rounded-xl border border-border/80 bg-card p-6 flex flex-col">
                  <div className="border-b border-border/40 pb-3 mb-4">
                    <h2 className="text-lg font-semibold tracking-tight text-foreground font-display">Missing keywords</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Identified in the JD but missing from your resume</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 flex-1 content-start">
                    {result.missingKeywords.length > 0 ? (
                      result.missingKeywords.map(k => (
                        <span key={k} className="rounded-md border border-destructive/20 bg-destructive/10 px-2.5 py-1 font-mono text-[11px] text-destructive">{k}</span>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground w-full text-center py-4 bg-success/5 border border-success/20 rounded-md text-success font-medium">No missing keywords detected. Perfect coverage!</div>
                    )}
                  </div>
                </div>

              </div>

              {/* Export bar (Moved Below Top Grid) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border/80 bg-card p-4 sm:p-6">
                <div className="text-sm max-w-xl">
                  <div className="font-semibold text-[17px] text-foreground mb-1">One-click ATS report</div>
                  <div className="text-xs text-muted-foreground leading-normal">Full PDF with scores, gaps, rewrites & cover letter — paste into ChatGPT/Claude to regenerate a 90+ resume.</div>
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 w-full sm:w-auto">
                  <button onClick={downloadFullReport} className="bg-accent text-white font-medium rounded-md px-[18px] py-[10px] text-sm hover:opacity-90 transition-opacity flex items-center gap-1.5">
                    <FileDown className="h-4 w-4" /> Download full PDF report
                  </button>
                  <button onClick={downloadCoverLetter} className="bg-card text-foreground border border-border/80 font-medium rounded-md px-[18px] py-[10px] text-sm hover:bg-secondary/20 transition-colors flex items-center gap-1.5">
                    <Mail className="h-4 w-4" /> Cover letter PDF
                  </button>
                  <button onClick={() => setStage("input")} className="text-muted-foreground hover:text-foreground text-sm font-medium px-4">New analysis</button>
                </div>
              </div>

              {/* Networking Action Nodes */}
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="grid h-6 w-6 place-items-center rounded-md bg-secondary text-foreground">
                    <Mail className="h-3 w-3" />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight font-display text-foreground">Outreach Templates</h3>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                  <EditableBlock 
                    title="Cold Email" 
                    value={result.coldEmail || `Subject: Experienced ${role} candidate - ${result.candidate.name}\n\nHi [Hiring Manager Name],\n\nI hope this email finds you well.\n\nI recently came across the ${role} opening at ${company} and was immediately drawn to the opportunity. With my background in [Your Key Skill/Tech], I have successfully [Insert Key Achievement or Metric, e.g., scaled systems to handle 10k RPS].\n\nI’ve attached my resume for your review. I would love to briefly connect and discuss how my experience aligns with ${company}'s current goals.\n\nBest regards,\n${result.candidate.name}\n[Your LinkedIn URL]\n[Your Portfolio/GitHub]`} 
                    onChange={(v) => { if(result) result.coldEmail = v; }} 
                  />
                  <EditableBlock 
                    title="LinkedIn Connection Request" 
                    value={`Hi [Name],\n\nI'm ${result.candidate.name}. I saw the recent opening for the ${role} position at ${company}. Given my background in [Your Field], I've been following ${company}'s work and would love to connect and stay in touch!\n\nBest,\n${result.candidate.name}`} 
                    onChange={(v) => {}} 
                  />
                  <EditableBlock 
                    title="Recruiter Follow-up" 
                    value={result.recruiterDm || `Hi [Recruiter Name],\n\nI hope you're having a great week.\n\nI recently submitted my application for the ${role} role at ${company}. I know you are likely reviewing many applications, but I wanted to quickly reiterate my strong interest. With my recent experience in [Key Skill], I am confident I could hit the ground running and deliver value to the team.\n\nPlease let me know if there is any additional information I can provide. I look forward to the possibility of discussing this further.\n\nThank you for your time,\n${result.candidate.name}`} 
                    onChange={(v) => { if(result) result.recruiterDm = v; }} 
                  />
                </div>
              </div>

              {/* Pipeline Diagnostics & Fallback Timeline */}
              {perfMetrics && (
                <div className="rounded-xl border border-border/80 bg-card overflow-hidden">
                  <div
                    onClick={() => setShowDiagnostics(!showDiagnostics)}
                    className="flex w-full cursor-pointer items-center justify-between px-5 py-4 text-left font-display text-sm font-semibold transition-colors hover:bg-surface-elevated/20 select-none"
                  >
                    <div className="flex items-center gap-2 text-primary">
                      <Sparkles className="h-4 w-4" />
                      <span>Pipeline Diagnostics & Fallback Timeline</span>
                      <span className="font-mono text-xs text-muted-foreground">({perfMetrics.totalMs}ms total)</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(perfMetrics, null, 2));
                          const downloadAnchor = document.createElement('a');
                          downloadAnchor.setAttribute("href", dataStr);
                          downloadAnchor.setAttribute("download", `elevatecv_perf_metrics_${Date.now()}.json`);
                          document.body.appendChild(downloadAnchor);
                          downloadAnchor.click();
                          downloadAnchor.remove();
                          toast.success("Metrics exported!");
                        }}
                        className="text-xs font-normal text-muted-foreground hover:text-foreground hover:underline"
                      >
                        Export Metrics (JSON)
                      </button>
                      <ChevronRight className={`h-4 w-4 transition-transform ${showDiagnostics ? "rotate-90" : ""}`} />
                    </div>
                  </div>
                  
                  {showDiagnostics && (
                    <div className="border-t border-border/40 bg-surface-elevated/10 p-5 space-y-4 text-xs">
                      {[
                        { label: "Critical Modules Group", data: perfMetrics.criticalPerf },
                        { label: "High Modules Group", data: perfMetrics.highPerf },
                        { label: "Action & Text Generation Group", data: perfMetrics.actionPerf }
                      ].map((group, groupIdx) => (
                        <div key={groupIdx} className="space-y-2">
                          <div className="font-semibold text-foreground flex flex-wrap items-center justify-between gap-1">
                            <span>{group.label}</span>
                            {group.data ? (
                              <span className="font-mono text-[10px] text-muted-foreground">
                                resolved via {group.data.provider} ({group.data.model}) in {group.data.ms}ms
                              </span>
                            ) : (
                              <span className="text-destructive font-mono text-[10px]">Failed to fetch diagnostics</span>
                            )}
                          </div>
                          
                          {group.data?.attemptsLog && (
                            <div className="relative pl-4 ml-1.5 border-l border-border/60 space-y-3">
                              {group.data.attemptsLog.map((attempt: any, attemptIdx: number) => (
                                <div key={attemptIdx} className="relative">
                                  <div className={`absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 ${
                                    attempt.status === "success" 
                                      ? "bg-success border-background" 
                                      : "bg-destructive border-background"
                                  }`} />
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                    <div className="font-medium text-foreground">
                                      {attempt.provider === "lovable" ? "Lovable Gateway" : "OpenRouter"}
                                      <span className="font-mono text-[10px] text-muted-foreground ml-1.5">({attempt.model})</span>
                                    </div>
                                    <div className="font-mono text-[10px] flex items-center gap-2">
                                      <span className={attempt.status === "success" ? "text-success font-semibold" : "text-destructive font-semibold"}>
                                        {attempt.status.toUpperCase()}
                                      </span>
                                      {attempt.latencyMs > 0 && <span className="text-muted-foreground">({attempt.latencyMs}ms)</span>}
                                    </div>
                                  </div>
                                  {attempt.error && (
                                    <p className="mt-1 text-[11px] text-destructive/80 font-mono break-words leading-normal bg-destructive/5 rounded p-1.5 border border-destructive/10">
                                      {attempt.error}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tabs */}
              <div className="flex flex-wrap gap-1 border-b border-border/40">
                {[
                  { id: "modules" as const, label: "Modules", icon: Eye },
                  { id: "rewrite" as const, label: "AI Rewrite", icon: Wand2 },
                  { id: "preview" as const, label: "Compare & Export", icon: FileCode2 },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-2 border-b-2 px-4 py-3 text-[15px] font-medium transition-all ${
                      tab === t.id 
                        ? "border-foreground text-foreground" 
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <t.icon className="h-4 w-4" /> {t.label}
                  </button>
                ))}
              </div>

              {tab === "modules" && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {result.modules
                    .filter(m => !["rewrite", "linkedin", "cover", "coverLetter"].includes(m.id))
                    .map((m, i) => {
                      const criticalIds = ["ats", "quant", "keywords", "skills"];
                      const isCritical = criticalIds.includes(m.id);
                      const perf = isCritical ? perfMetrics?.criticalPerf : perfMetrics?.highPerf;
                      const perfText = perf ? `${perf.provider === "lovable" ? "Lovable" : "OpenRouter"} (${perf.model.split("/").pop()})` : undefined;

                      return (
                        <ModuleCard 
                          key={m.id}
                          index={i} 
                          name={m.name} 
                          desc={m.desc} 
                          icon={m.icon} 
                          score={m.score} 
                          weight={m.weight} 
                          findings={m.findings}
                          recommendations={m.recommendations}
                          reason={m.reason}
                          perfText={perfText}
                        />
                      );
                    })}
                </div>
              )}

              {tab === "rewrite" && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/80 bg-card p-5">
                    <div className="flex flex-wrap items-center gap-2.5 text-xs">
                      <span className="text-muted-foreground">Tone:</span>
                      <div className="inline-flex gap-1 bg-background p-1 rounded-full border border-border/60">
                        {tones.map(t => (
                          <button
                            key={t}
                            onClick={() => setTone(t)}
                            className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all ${
                              tone === t 
                                ? "bg-card text-foreground border border-border/80 shadow-sm" 
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >{t}</button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={downloadCoverLetter} className="bg-card text-foreground border border-border/80 font-medium rounded-md px-3.5 py-2 text-xs hover:bg-secondary/20 transition-colors flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Cover letter PDF</button>
                      <button onClick={downloadFullReport} className="bg-accent text-white font-medium rounded-md px-3.5 py-2 text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5"><Download className="h-3.5 w-3.5" /> Full report PDF</button>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {result.rewrites.map((r, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="rounded-xl border border-border/80 bg-card p-6"
                      >
                        <div className="mb-3 flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider font-semibold">
                          <span className="rounded bg-accent/10 px-2 py-0.5 text-accent">{r.type}</span>
                          <ChevronRight className="h-3 w-3 text-muted-foreground" />
                          <span className="text-success">applied</span>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="rounded-lg border border-border/60 bg-background/20 p-4">
                            <div className="mb-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Before</div>
                            <div className="text-[14px] leading-relaxed text-muted-foreground line-through decoration-muted-foreground/30">{r.before}</div>
                          </div>
                          <div className="rounded-lg border border-border/65 bg-success/5 p-4">
                            <div className="mb-1 font-mono text-[9px] uppercase tracking-wider text-success">After</div>
                            <div className="text-[14px] leading-relaxed text-foreground font-medium">{r.after}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <EditableBlock
                      title={`Cover letter · ${company}`}
                      value={result.coverLetter}
                      onChange={(v) => setResult(r => r ? ({ ...r, coverLetter: v }) : r)}
                    />
                    {result.coldEmail && (
                      <EditableBlock
                        title={`Cold Email to Hiring Manager`}
                        value={result.coldEmail}
                        onChange={(v) => setResult(r => r ? ({ ...r, coldEmail: v }) : r)}
                      />
                    )}
                    {result.recruiterDm && (
                      <EditableBlock
                        title={`LinkedIn DM to Recruiter`}
                        value={result.recruiterDm}
                        onChange={(v) => setResult(r => r ? ({ ...r, recruiterDm: v }) : r)}
                      />
                    )}
                  </div>
                </div>
              )}

              {tab === "preview" && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      <GitCompare className="h-3.5 w-3.5" /> Full compare & export · ATS-safe format
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={downloadCoverLetter}><Mail className="mr-1 h-3.5 w-3.5" /> Cover letter</Button>
                      <Button size="sm" onClick={downloadFullReport} className="bg-gradient-primary text-primary-foreground"><Download className="mr-1 h-3.5 w-3.5" /> Download report PDF</Button>
                    </div>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-xl border border-border/80 bg-card p-6">
                      <h3 className="font-mono text-[10px] uppercase tracking-wider font-semibold text-success">Strong points</h3>
                      <ul className="mt-3 space-y-2 text-sm">
                        {result.strongPoints.map((s, i) => <li key={i} className="flex gap-2"><span className="text-success">✓</span><span className="text-foreground/90">{s}</span></li>)}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-border/80 bg-card p-6">
                      <h3 className="font-mono text-[10px] uppercase tracking-wider font-semibold text-destructive">Keyword gap (from JD)</h3>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {result.missingKeywords.length > 0 ? result.missingKeywords.map(k => (
                          <span key={k} className="rounded-md border border-destructive/20 bg-destructive/5 px-2.5 py-1 font-mono text-[10px] text-destructive">{k}</span>
                        )) : <span className="text-xs text-muted-foreground">No missing keywords — great coverage.</span>}
                      </div>
                    </div>
                    <div className="rounded-xl border border-border/80 bg-card p-6 lg:col-span-2">
                      <h3 className="font-mono text-[10px] uppercase tracking-wider font-semibold text-primary">Company intel · {company}</h3>
                      <pre className="mt-3 whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">{result.companyBrief?.trim() ? result.companyBrief : `No public research surfaced for "${company}". The analysis still used the JD you pasted — try a more specific company name for richer context.`}</pre>
                    </div>
                    <div className="rounded-xl border border-border/80 bg-card p-6 lg:col-span-2">
                      <h3 className="text-lg font-medium text-foreground tracking-tight">Paste-into-any-AI prompt</h3>
                      <p className="mt-1 text-xs text-muted-foreground leading-normal">Copy this along with your resume + the downloaded PDF into ChatGPT, Claude or Gemini to regenerate a 90+ ATS-optimized resume.</p>
                      <pre className="mt-4 max-h-56 overflow-auto rounded-lg border border-border bg-background p-4 font-mono text-xs leading-relaxed text-muted-foreground">{`You are a senior recruiter and ATS expert. Using the ElevateCv report attached, rewrite my resume to reach a 90+ ATS score for the ${role} role at ${company}. Preserve truthfulness. Weave in these missing JD keywords naturally: ${result.missingKeywords.join(", ") || "(none)"}. Use STAR + quantified impact in every bullet. Output ATS-safe plain text (no tables, columns, icons, or unusual fonts). Sound human — no AI-detectable filler.`}</pre>
                      <button onClick={() => { navigator.clipboard.writeText(`You are a senior recruiter and ATS expert. Using the ElevateCv report attached, rewrite my resume to reach a 90+ ATS score for the ${role} role at ${company}. Preserve truthfulness. Weave in these missing JD keywords naturally: ${result.missingKeywords.join(", ") || "(none)"}. Use STAR + quantified impact in every bullet. Output ATS-safe plain text (no tables, columns, icons, or unusual fonts). Sound human — no AI-detectable filler.`); toast.success("Prompt copied"); }} className="mt-4 bg-card text-foreground border border-border/80 font-medium rounded-md px-3.5 py-2 text-xs hover:bg-secondary/20 transition-colors">Copy prompt</button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </SiteLayout>
  );
}