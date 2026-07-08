import { motion } from "framer-motion";
import { categoryScores } from "@/data/sampleAnalysis";

export function ScoreShowcase() {
  return (
    <section className="container py-6 md:py-8 px-4 md:px-6">
      <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-10 md:p-12 max-w-6xl mx-auto">
        <div className="grid items-center gap-8 md:gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-accent mb-3 font-mono">The score that matters</div>
            <h2 className="display-md text-foreground leading-tight">A single ATS number. Eight reasons behind it.</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">Most tools give you a vague grade. We break the score into measurable pillars so every revision moves the needle.</p>
            
            <div className="mt-8 grid grid-cols-2 gap-3 sm:max-w-md">
              {[
                ["Keyword density", "vs JD"],
                ["Quantified impact", "% bullets"],
                ["Format risk", "tables, columns"],
                ["Verb strength", "weak → strong"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg border border-border/60 bg-background/50 p-3 sm:p-4">
                  <div className="text-sm font-semibold text-foreground">{k}</div>
                  <div className="font-mono text-[10px] text-muted-foreground mt-1">{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {categoryScores.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-center gap-4 rounded-lg border border-border/60 bg-background/30 p-3.5 sm:p-4"
              >
                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <div className="text-sm font-medium text-foreground">{c.name}</div>
                    <div className="font-mono text-xs font-semibold" style={{ color: c.color }}>{c.score}</div>
                  </div>
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${c.score}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.1 + i * 0.04, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: c.color }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}