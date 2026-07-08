import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

function getScoreTheme(score: number) {
  if (score >= 90) return { 
    from: "#10b981", to: "#059669", 
    bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", 
    label: "🏆 Excellent Match" 
  };
  if (score >= 75) return { 
    from: "#22c55e", to: "#16a34a", 
    bg: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20", 
    label: "✅ Strong Match" 
  };
  if (score >= 60) return { 
    from: "#eab308", to: "#ca8a04", 
    bg: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20", 
    label: "⚠️ Moderate Match" 
  };
  if (score >= 40) return { 
    from: "#f97316", to: "#ea580c", 
    bg: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20", 
    label: "⚠️ Needs Improvement" 
  };
  return { 
    from: "#ef4444", to: "#dc2626", 
    bg: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20", 
    label: "❌ Poor Match" 
  };
}

export function PremiumScoreRing({ score }: { score: number }) {
  const theme = getScoreTheme(score);
  const size = 200;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const animation = animate(count, score, { duration: 1.5, ease: "easeOut" });
    const unsubscribe = rounded.on("change", (v) => setDisplayScore(v));
    return () => {
      animation.stop();
      unsubscribe();
    };
  }, [score]);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Glow behind */}
        <div 
          className="absolute inset-0 rounded-full blur-2xl opacity-20" 
          style={{ background: theme.from }}
        />
        
        <svg width={size} height={size} className="relative z-10 -rotate-90 transform drop-shadow-sm">
          <defs>
            <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={theme.from} />
              <stop offset="100%" stopColor={theme.to} />
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.1" />
            </filter>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-border/40"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#score-gradient)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            filter="url(#shadow)"
          />
        </svg>
        
        <div className="absolute flex flex-col items-center justify-center z-20">
          <div className="flex items-baseline gap-1">
            <span className="font-display text-5xl font-bold tracking-tighter text-foreground">
              {displayScore}
            </span>
            <span className="font-mono text-lg font-medium text-muted-foreground">
              /100
            </span>
          </div>
          <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
            ATS Score
          </span>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold shadow-sm backdrop-blur-sm ${theme.bg}`}
      >
        {theme.label}
      </motion.div>
    </div>
  );
}
