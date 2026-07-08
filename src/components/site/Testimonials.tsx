import { motion } from "framer-motion";

const quotes = [
  { name: "Priya R.", role: "Product Manager · ex-Stripe", quote: "Went from 0 callbacks in 6 weeks to 4 onsites in 11 days. The recruiter scan module is unreal.", initials: "PR" },
  { name: "Marcus L.", role: "Senior SWE · Datadog", quote: "I'd dismissed ATS scoring as gimmick. ElevateCv broke my score down so granularly I rewrote 30% of my bullets in one sitting.", initials: "ML" },
  { name: "Jenna K.", role: "Designer · Figma", quote: "The LaTeX export is the cleanest I've ever shipped. Recruiters keep asking which template I used.", initials: "JK" },
  { name: "David O.", role: "Data Scientist · Uber", quote: "Firecrawl intel + the cold email generator secured me 3 interviews in a week. It literally writes the outreach for you.", initials: "DO" },
];

export function Testimonials() {
  return (
    <section className="container py-6 md:py-10 px-4 md:px-6 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <div className="text-xs font-semibold uppercase tracking-wider text-accent mb-3 font-mono">Loved by candidates</div>
        <h2 className="display-md text-foreground leading-tight">Quietly, ruthlessly effective.</h2>
      </div>
      <div className="grid gap-3 sm:gap-6 grid-cols-2">
        {quotes.map((q, i) => (
          <motion.figure
            key={q.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="relative rounded-2xl border border-border/80 bg-card p-3 sm:p-6"
          >
            <blockquote className="text-[10px] sm:text-[15px] leading-relaxed text-foreground">"{q.quote}"</blockquote>
            <figcaption className="mt-3 sm:mt-5 flex items-center gap-2 sm:gap-3">
              <div className="flex h-6 w-6 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-secondary font-mono text-[9px] sm:text-sm font-semibold text-foreground">
                {q.initials}
              </div>
              <div>
                <div className="font-semibold text-foreground text-[10px] sm:text-sm">{q.name}</div>
                <div className="text-[9px] sm:text-xs text-muted-foreground">{q.role}</div>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}