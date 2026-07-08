import SiteLayout from "@/components/site/SiteLayout";
import { Check, Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const tiers = [
  { 
    name: "Free", 
    price: "0", 
    period: "forever", 
    desc: "Try ElevateCv risk-free.",
    features: ["3 resume analyses (lifetime)", "Full 15-node ATS pipeline", "Downloadable PDF report", "Cover letter + LinkedIn draft"], 
    cta: "Coming Soon", 
    highlight: false 
  },
  { 
    name: "Monthly", 
    price: "99", 
    period: "/month", 
    desc: "Active job hunt.",
    features: ["Unlimited resume analyses", "Unlimited AI rewrites & cover letters", "All 15 AI modules & tone variants", "Resume version history", "Priority AI queue", "ATS-safe PDF export"], 
    cta: "Coming Soon", 
    highlight: true 
  },
  { 
    name: "Yearly", 
    price: "499", 
    period: "/year", 
    desc: "Best value — save 58%.",
    features: ["Everything in Monthly", "12 months unlimited access", "Executive tone module", "Skill gap roadmap", "Early access to new modules", "Email support"], 
    cta: "Coming Soon", 
    highlight: false 
  },
];

const faqs = [
  { q: "How many resumes can I analyze on the Free plan?", a: "3 full analyses — no card required. Upgrade to Monthly (₹99) or Yearly (₹499) for unlimited runs." },
  { q: "Do Monthly and Yearly really include unlimited analyses?", a: "Yes. Unlimited resume analyses, rewrites, cover letters and LinkedIn generations. Fair-use only." },
  { q: "Will the ATS PDF export be AI-detectable?", a: "No. ElevateCv rewrites are calibrated to sound human-written — natural cadence, first-person voice, no filler." },
  { q: "Can I cancel anytime?", a: "Yes, monthly is no-contract. Yearly is pro-rated." },
  { q: "Do you accept UPI, cards and international payments?", a: "Yes — UPI, Rupay, all major cards and international payments via Razorpay/Stripe." },
];

export default function Pricing() {
  return (
    <SiteLayout>
      <section className="container py-8 md:py-12 max-w-5xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">Simple, transparent pricing.</h1>
          <p className="text-[15px] sm:text-base text-muted-foreground">Unlock the full power of the 15-node ATS pipeline to land more interviews.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`relative rounded-xl border p-6 flex flex-col justify-between transition-colors duration-200 ${
                t.highlight 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-card text-foreground border-border/80"
              }`}
            >
              {t.highlight && (
                <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-accent px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-white">
                  <Sparkles className="h-2.5 w-2.5" /> Most popular
                </span>
              )}
              
              <div>
                <h2 className="text-xl font-medium tracking-tight mb-1">{t.name}</h2>
                <div className={`text-xs ${t.highlight ? "text-primary-foreground/75" : "text-muted-foreground"} mb-4`}>{t.desc}</div>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-4xl font-semibold tracking-tight">₹{t.price}</span>
                  <span className={`text-xs ${t.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{t.period}</span>
                </div>
                
                <ul className="space-y-2.5 mb-5">
                  {t.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs leading-normal">
                      <Check className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 ${t.highlight ? "text-accent" : "text-primary"}`} />
                      <span className={t.highlight ? "text-primary-foreground/90" : "text-foreground/90"}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                disabled 
                className={`w-full py-2 px-4 rounded-md text-xs font-semibold tracking-tight cursor-not-allowed transition-opacity duration-150 ${
                  t.highlight 
                    ? "bg-white text-primary hover:opacity-90" 
                    : "bg-background text-foreground border border-border hover:opacity-90"
                }`}
              >
                Coming Soon
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="faq" className="container py-16 border-t border-border/40">
        <div className="mx-auto max-w-3xl">
          <h2 className="display-md text-center mb-12">Frequently asked questions</h2>
          <div className="space-y-1 divide-y divide-border/40">
            {faqs.map((f, i) => (
              <details key={i} className="group py-6">
                <summary className="flex cursor-pointer items-center justify-between text-[18px] font-medium text-foreground py-2 select-none hover:text-accent transition-colors">
                  {f.q}
                  <span className="text-muted-foreground font-light text-2xl transition-transform group-open:rotate-45 select-none">+</span>
                </summary>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground max-w-2xl">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}