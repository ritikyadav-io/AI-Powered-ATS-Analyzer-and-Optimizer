import { motion } from "framer-motion";
import { moduleDefs } from "@/data/sampleAnalysis";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

export function Pipeline() {
  return (
    <section className="container py-6 md:py-10 max-w-6xl mx-auto">
      <div className="mx-auto max-w-2xl text-center mb-12">
        <div className="text-xs font-semibold uppercase tracking-wider text-accent mb-3 font-mono">Inside the engine</div>
        <h2 className="display-md text-foreground leading-tight">15 specialised modules. One pipeline.</h2>
        <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">Every module is a focused agent with its own prompt, rubric and output.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {moduleDefs.map((m, i) => {
          const Icon = (Icons as unknown as Record<string, LucideIcon>)[m.icon] ?? Icons.Sparkles;
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.02 }}
              className="group rounded-xl border border-border/80 bg-card p-4 sm:p-5"
            >
              <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-3">
                <div className="grid h-7 w-7 place-items-center rounded-md bg-secondary text-foreground"><Icon className="h-3.5 w-3.5" /></div>
                <span className="font-mono text-[10px] text-muted-foreground">n{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="text-sm font-semibold text-foreground tracking-tight">{m.name}</div>
              <div className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-normal">{m.desc}</div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}