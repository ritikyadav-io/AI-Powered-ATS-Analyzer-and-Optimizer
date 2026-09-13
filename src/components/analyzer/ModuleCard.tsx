import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  name: string;
  desc: string;
  icon: string;
  score: number;
  weight: string;
  index: number;
  reason?: string;
  findings?: string[];
  recommendations?: string[];
  perfText?: string;
};

export function ModuleCard({ name, desc, icon, score, weight, index, reason, findings, recommendations, perfText }: Props) {
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[icon] ?? Icons.Sparkles;
  const isAction = score === 0;
  const tone = isAction
    ? "text-accent border-accent/20 bg-accent/5"
    : score >= 85 
      ? "text-success border-success/20 bg-success/5" 
      : score >= 70 
        ? "text-primary border-primary/20 bg-primary/5" 
        : score >= 55 
          ? "text-warning border-warning/20 bg-warning/5" 
          : "text-destructive border-destructive/20 bg-destructive/5";

  const [expanded, setExpanded] = useState(false);
  const hasDetail = (findings?.length ?? 0) + (recommendations?.length ?? 0) > 0 || !!reason;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      className="group relative overflow-hidden rounded-xl border border-border/80 bg-card p-4 transition-colors flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-secondary text-foreground">
            <Icon className="h-4.5 w-4.5" />
          </div>
          <span className={`rounded-md border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${tone}`}>
            {weight}
          </span>
        </div>
        
        <h3 className="mt-3 font-display text-sm font-semibold tracking-tight text-foreground leading-tight">{name}</h3>
        <p className="mt-1 text-[11px] text-muted-foreground leading-normal">{desc}</p>

        {!isAction && (
          <div className="mt-3">
            <div className="flex items-baseline justify-between text-[10px] text-muted-foreground">
              <span>Score</span>
              <span className="font-mono font-semibold text-foreground">{score}/100</span>
            </div>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${score}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className={`h-full rounded-full ${
                  score >= 85 ? "bg-success" : score >= 70 ? "bg-primary" : score >= 55 ? "bg-warning" : "bg-destructive"
                }`}
              />
            </div>
          </div>
        )}

        {hasDetail && (
          <div className="mt-3 border-t border-border/40 pt-3 space-y-2.5">
            {reason && (
              <p className="text-[10px] leading-normal text-muted-foreground italic">
                "{reason}"
              </p>
            )}
            
            {findings && findings.length > 0 && (
              <div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Line-by-Line Findings</div>
                <ul className="space-y-1 text-[10px] text-muted-foreground leading-normal">
                  {(expanded ? findings : findings.slice(0, 2)).map((f, idx) => {
                    const isRemove = f.toUpperCase().startsWith("REMOVE:");
                    const isAdd = f.toUpperCase().startsWith("ADD:");
                    const isRewrite = f.toUpperCase().startsWith("REWRITE:");
                    const cleanText = f.replace(/^(REMOVE|ADD|REWRITE):\s*/i, "");

                    return (
                      <li key={idx} className="flex items-start gap-1.5 py-0.5">
                        {isRemove ? (
                          <span className="shrink-0 bg-destructive/15 text-destructive font-mono font-bold px-1 rounded text-[8px] uppercase">REMOVE</span>
                        ) : isAdd ? (
                          <span className="shrink-0 bg-primary/15 text-primary font-mono font-bold px-1 rounded text-[8px] uppercase">ADD</span>
                        ) : isRewrite ? (
                          <span className="shrink-0 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-bold px-1 rounded text-[8px] uppercase">REWRITE</span>
                        ) : (
                          <span className="text-destructive font-semibold">•</span>
                        )}
                        <span className="text-foreground/90 font-medium">{cleanText}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {expanded && recommendations && recommendations.length > 0 && (
              <div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-success mb-1">Fix to reach 90+</div>
                <ul className="space-y-1 text-[10px] text-muted-foreground leading-normal">
                  {recommendations.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-success font-semibold">→</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {expanded && perfText && (
              <div className="text-[9px] text-muted-foreground border-t border-border/40 pt-1.5 font-mono flex items-center justify-between">
                <span>Model:</span>
                <span className="font-semibold text-foreground">{perfText}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {hasDetail && (findings?.length > 2 || (recommendations?.length ?? 0) > 0) && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 w-full text-center text-[10px] font-semibold text-primary hover:text-accent transition-colors border-t border-border/40 pt-2 select-none"
        >
          {expanded ? "Show less" : "Show recommendations"}
        </button>
      )}
    </motion.div>
  );
}