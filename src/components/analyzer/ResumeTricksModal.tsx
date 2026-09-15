import React, { useState } from "react";
import { RESUME_TRICKS, ResumeTrick } from "@/data/resumeTricks";
import { Sparkles, Search, Copy, Check, X, BookOpen, Lightbulb, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface ResumeTricksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeTricksModal({ isOpen, onClose }: ResumeTricksModalProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  if (!isOpen) return null;

  const categories = [
    "All",
    "ATS Optimization",
    "STAR Bullet Engineering",
    "Recruiter Psychology",
    "Skill Grouping",
    "Format Safety",
    "Executive Outreach",
  ];

  const filtered = RESUME_TRICKS.filter((trick) => {
    const matchesCategory = selectedCategory === "All" || trick.category === selectedCategory;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      trick.title.toLowerCase().includes(q) ||
      trick.description.toLowerCase().includes(q) ||
      trick.actionableTip.toLowerCase().includes(q) ||
      (trick.formula && trick.formula.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const copyFormula = (trick: ResumeTrick) => {
    const textToCopy = trick.formula ? `${trick.title}: ${trick.formula}` : `${trick.title}: ${trick.actionableTip}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(trick.id);
    toast.success("Strategy copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] flex flex-col my-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/40 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-accent">
              <Sparkles className="h-4 w-4" /> 55+ Executive Resume Tricks & Recruiter Blueprint
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-display">
              50+ Executive Resume Tricks & Strategies
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Master the exact bullet formulas, ATS parsing rules, and 6-second recruiter screen blueprints used at FAANG & Fortune 500 tech.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search 50+ tricks by keyword (e.g. ATS, Google XYZ, Workday, Metrics, Headers)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border/80 bg-background/80 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all shadow-xs"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 select-none">
            {categories.map((cat) => {
              const count =
                cat === "All"
                  ? RESUME_TRICKS.length
                  : RESUME_TRICKS.filter((t) => t.category === cat).length;
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? "bg-accent text-white font-semibold shadow-xs"
                      : "bg-secondary/70 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Tricks Grid */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 max-h-[55vh]">
          {filtered.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((trick) => (
                <div
                  key={trick.id}
                  className="rounded-xl border border-border/80 bg-background/60 p-5 space-y-3 hover:border-accent/40 transition-all shadow-2xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-md">
                        #{trick.id} · {trick.category}
                      </span>
                      <button
                        onClick={() => copyFormula(trick)}
                        className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
                        title="Copy strategy to clipboard"
                      >
                        {copiedId === trick.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>

                    <h3 className="text-sm font-bold text-foreground leading-snug font-display">
                      {trick.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {trick.description}
                    </p>
                  </div>

                  <div className="space-y-2 border-t border-border/40 pt-3">
                    <div className="text-[11px] text-foreground font-medium flex items-start gap-1.5 leading-relaxed">
                      <Lightbulb className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-foreground">Recruiter Action:</strong> {trick.actionableTip}
                      </span>
                    </div>

                    {trick.formula && (
                      <div className="rounded-md bg-secondary/80 border border-border/60 p-2 font-mono text-[11px] text-accent font-semibold flex items-center justify-between gap-2">
                        <span className="truncate">Formula: {trick.formula}</span>
                        <button
                          onClick={() => copyFormula(trick)}
                          className="text-xs text-accent hover:underline shrink-0"
                        >
                          Copy
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center space-y-2">
              <BookOpen className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground font-medium">
                No resume tricks found matching "{search}". Try searching for "ATS", "STAR", or "Metrics".
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border/40 pt-4 text-xs text-muted-foreground">
          <span>Showing {filtered.length} of {RESUME_TRICKS.length} executive recruiter tricks</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-secondary font-medium text-foreground hover:bg-secondary/80 transition-colors"
          >
            Close Blueprint
          </button>
        </div>

      </div>
    </div>
  );
}
