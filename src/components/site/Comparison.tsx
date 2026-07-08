import { Check, X, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const rows = [
  {
    feature: "Analysis Engine",
    elevate: "15-node parallel LLM agents",
    writer: "Single prompt API wrapper",
    scanner: "Static regex parser",
    win: true
  },
  {
    feature: "Company Intel Crawl",
    elevate: "Live Firecrawl search indexing",
    writer: "None (manual copy-paste)",
    scanner: "None",
    win: true
  },
  {
    feature: "Rewrite Wording",
    elevate: "STAR format + custom metrics",
    writer: "Generic AI clichés & buzzwords",
    scanner: "No text suggestions",
    win: true
  },
  {
    feature: "Diagnostics Timeline",
    elevate: "Live latency & provider metrics",
    writer: "Black box execution",
    scanner: "No transparency",
    win: true
  },
  {
    feature: "Export Readiness",
    elevate: "Font-safe structured PDF",
    writer: "Parser-breaking canvas designs",
    scanner: "Plain text files only",
    win: true
  },
  {
    feature: "Upfront Cost",
    elevate: "Free (3 full scans)",
    writer: "Paywall before scanning",
    scanner: "Paywall before scanning",
    win: true
  }
];

export function Comparison() {
  return (
    <section className="container py-8 md:py-12 px-4 md:px-6 max-w-6xl mx-auto">
      <div className="mx-auto max-w-2xl text-center mb-12">
        <div className="text-xs font-semibold uppercase tracking-wider text-accent mb-3 font-mono">Side-by-side comparison</div>
        <h2 className="display-md text-foreground leading-tight">Engineered to outperform.</h2>
        <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">Why high-growth tech candidates choose ElevateCv over typical tools.</p>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-border/80 bg-card">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border/40 bg-secondary/30">
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">Capability</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-foreground font-mono bg-secondary/50 relative w-1/3">
                  <span className="flex items-center gap-1 text-accent">
                    <Sparkles className="h-3 w-3" /> ElevateCv
                  </span>
                </th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono w-1/3">Typical AI Writer</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono w-1/3">Basic ATS Scanner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs">
              {rows.map((r, idx) => (
                <tr key={idx} className="hover:bg-secondary/10 transition-colors">
                  <td className="p-4 font-medium text-foreground">{r.feature}</td>
                  <td className="p-4 font-semibold text-foreground bg-secondary/20 relative">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-success flex-shrink-0" />
                      <span>{r.elevate}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <X className="h-3.5 w-3.5 text-destructive/60 flex-shrink-0" />
                      <span>{r.writer}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <X className="h-3.5 w-3.5 text-destructive/60 flex-shrink-0" />
                      <span>{r.scanner}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid gap-4">
        {rows.map((r, idx) => (
          <div key={idx} className="rounded-xl border border-border/80 bg-card overflow-hidden">
            <div className="bg-secondary/30 p-3 border-b border-border/40 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {r.feature}
            </div>
            <div className="p-4 grid gap-4 text-sm">
              <div>
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-accent mb-1.5 font-mono">
                  <Sparkles className="h-3 w-3" /> ElevateCv
                </div>
                <div className="flex items-start gap-2 font-semibold text-foreground">
                  <Check className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                  <span>{r.elevate}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/40">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 font-mono">Typical AI</div>
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <X className="h-3.5 w-3.5 text-destructive/60 flex-shrink-0 mt-0.5" />
                    <span>{r.writer}</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 font-mono">Basic ATS</div>
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <X className="h-3.5 w-3.5 text-destructive/60 flex-shrink-0 mt-0.5" />
                    <span>{r.scanner}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
