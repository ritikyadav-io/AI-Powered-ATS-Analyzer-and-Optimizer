import { motion } from "framer-motion";
import { Bot, FileSearch, FileCode2, GitBranch, History, BarChart3 } from "lucide-react";

const items = [
  { icon: Bot, title: "15-node AI pipeline", desc: "Specialised agents for keywords, verbs, metrics, leadership signals — each scored independently." },
  { icon: FileSearch, title: "Recruiter-eye scan", desc: "Simulates the 6-second skim. Flags what catches attention and what gets ignored." },
  { icon: FileCode2, title: "ATS-safe LaTeX export", desc: "Six recruiter-tested templates. One click PDF, zero parser-breaking tables or icons." },
  { icon: GitBranch, title: "Tone variants", desc: "Generate Corporate, Startup, Technical or Executive rewrites — without losing your voice." },
  { icon: History, title: "Version history", desc: "Every revision saved. Diff bullets across applications and roll back instantly." },
  { icon: BarChart3, title: "Skill gap roadmap", desc: "Weekly insights on the skills closing the gap to your dream role." },
];

export function Features() {
  return (
    <section className="container py-6 md:py-10 px-4 md:px-6 max-w-6xl mx-auto" id="features">
      <div className="max-w-2xl mb-12">
        <div className="text-xs font-semibold uppercase tracking-wider text-accent mb-3 font-mono">Built for outcomes</div>
        <h2 className="display-md text-foreground leading-tight">
          Everything you need to land the interview.
        </h2>
        <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">A focused toolkit, not a Christmas tree of features. Each module earns its place by moving your score and your callback rate.</p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className="group relative overflow-hidden rounded-xl border border-border/80 bg-card p-4 sm:p-6"
          >
            <div className="grid h-10 w-10 place-items-center rounded-md bg-secondary text-foreground">
              <it.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-[17px] font-medium text-foreground tracking-tight">{it.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}