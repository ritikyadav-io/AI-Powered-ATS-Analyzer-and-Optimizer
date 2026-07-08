import { motion } from "framer-motion";
import { ArrowRight, Sparkles, FileCheck2, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/analyzer/ScoreRing";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="container relative px-4 pt-4 pb-8 md:px-6 md:pt-12 md:pb-16">
        <div className="grid items-center gap-6 lg:grid-cols-[1.1fr_0.9fr] max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 rounded bg-secondary px-2.5 py-1 text-[12px] font-medium text-foreground"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>15-node AI · ATS-safe export</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-4 display-lg md:display-xl text-foreground"
            >
              Your resume,<br />
              re-engineered for the bots.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-3 md:mt-4 max-w-xl text-[15px] md:text-[16px] leading-relaxed text-muted-foreground"
            >
              Upload your resume, paste a job description, and ElevateCv runs 15 specialised AI modules to score, rewrite and ATS-armor it — in under 12 seconds.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center w-full sm:w-auto gap-3"
            >
              <Link to="/analyzer" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto group bg-primary text-primary-foreground font-medium rounded-md px-5 py-2.5 text-[15px] sm:text-[14px] hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 h-14 sm:h-10">
                  Analyze my resume <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/pricing" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-card text-foreground border border-border/80 font-medium rounded-md px-5 py-2.5 text-[15px] sm:text-[14px] hover:bg-secondary/40 transition-colors h-14 sm:h-10">
                  See pricing
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-8 grid max-w-md grid-cols-3 gap-3"
            >
              {[
                { icon: FileCheck2, label: "ATS-pass rate", value: "94%" },
                { icon: Zap, label: "Avg. analysis", value: "11s" },
                { icon: Shield, label: "Stays private", value: "100%" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-xl border border-border/80 bg-card p-3.5">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <div className="mt-1.5 font-display text-xl font-semibold text-foreground tracking-tight">{value}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Floating preview card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden md:block"
          >
            <div className="relative rounded-xl border border-border/80 bg-card p-6">
              <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-border" />
                  <div className="h-2.5 w-2.5 rounded-full bg-border" />
                  <div className="h-2.5 w-2.5 rounded-full bg-border" />
                </div>
                <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">resume.pdf · analyzing</div>
              </div>
              <div className="flex flex-col items-center">
                <ScoreRing value={92} size={180} />
                <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                  {["+18 keywords", "−4 weak verbs", "+9 metrics"].map(t => (
                    <span key={t} className="rounded border border-border bg-secondary px-2.5 py-0.5 font-mono text-[10px] text-foreground">{t}</span>
                  ))}
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { l: "Keywords", v: 88 }, { l: "Format", v: 96 },
                  { l: "Impact", v: 84 }, { l: "Clarity", v: 95 },
                ].map(({ l, v }) => (
                  <div key={l} className="rounded-lg border border-border/60 bg-background/50 p-3">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-muted-foreground">{l}</span>
                      <span className="font-mono font-semibold">{v}</span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="absolute -left-6 -bottom-4 hidden rounded-lg border border-border/80 bg-card p-4 shadow-none md:block"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-success/10 text-success"><FileCheck2 className="h-5 w-5" /></div>
                <div>
                  <div className="text-xs font-semibold text-foreground">Recruiter-ready</div>
                  <div className="font-mono text-[10px] text-muted-foreground mt-0.5">passed 14/15 modules</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Logo strip */}
        <div className="mt-16 md:mt-24 border-t border-border/40 pt-8">
          <div className="text-center font-mono text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">trusted by candidates landing offers at</div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 opacity-60">
            {["STRIPE", "LINEAR", "VERCEL", "NOTION", "FIGMA", "AIRBNB", "DATADOG"].map(l => (
              <div key={l} className="font-display text-sm font-bold tracking-widest sm:text-lg text-foreground">{l}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}