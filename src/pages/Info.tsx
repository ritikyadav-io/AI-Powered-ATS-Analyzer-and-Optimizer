import SiteLayout from "@/components/site/SiteLayout";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, HelpCircle, Briefcase } from "lucide-react";

interface ContentItem {
  icon: any;
  subhead: string;
  body: string[];
  extra?: React.ReactNode;
}

const contentMap: Record<string, ContentItem> = {
  about: {
    icon: Sparkles,
    subhead: "Building the intelligence layer for your job hunt.",
    body: [
      "ElevateCv was started by a team of software engineers and technical recruiters who realized the modern job application process was broken. Between keyword-stuffed search queries, blind ATS filters, and generic templates, great candidates were getting lost in the noise.",
      "We built a 15-node parallel analysis engine to give you the exact feedback needed to pass the bots and capture recruiter attention. Our pipeline combines semantic analysis, power verb auditing, and custom metrics synthesis to deliver brutally honest reviews in under 12 seconds.",
      "Our mission is simple: level the playing field for candidates. No gates, no secret rankings. Just clean data and clear rewrites that get you interviews."
    ]
  },
  careers: {
    icon: Briefcase,
    subhead: "Help us bridge the gap between talent and opportunity.",
    body: [
      "We are a small, fully remote team of engineers, designers, and career experts building the future of resume and application intelligence. We operate in a high-trust environment with low meeting overhead and high ownership.",
      "We offer competitive salaries, health coverage, home office allowances, and flexible working hours. We believe in building simple, fast products that solve real problems.",
      "We are actively looking for collaborative people who take pride in their craft. If you are passionate about LLM systems, React performance, or product design, we'd love to chat."
    ],
    extra: (
      <div className="mt-8 rounded-xl border border-border/80 bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Open Roles</h3>
        <ul className="space-y-4">
          {[
            { title: "Senior Backend Engineer (Go / LLMs)", location: "Remote · Full-time" },
            { title: "Product Designer (React / Tailwind)", location: "Remote · Part-time" },
            { title: "Technical Writer & Content Strategist", location: "Remote · Contract" }
          ].map(r => (
            <li key={r.title} className="flex justify-between items-center text-sm border-b border-border/40 pb-3 last:border-0 last:pb-0">
              <div>
                <div className="font-semibold text-foreground">{r.title}</div>
                <div className="text-muted-foreground mt-0.5">{r.location}</div>
              </div>
              <Link to="/contact" className="inline-flex items-center gap-1 font-semibold text-accent hover:underline">
                Apply <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  },
  privacy: {
    icon: ShieldCheck,
    subhead: "Your data privacy is our absolute priority.",
    body: [
      "We design our architecture around data minimization. We do not sell your personal data, contact information, or uploaded resume contents to third-party advertising companies.",
      "All parsed text is processed using encrypted API endpoints and cached securely. Resumes are automatically purged from our servers 30 days after upload unless you explicitly choose to save them for revision history.",
      "We use secure payment processors like Stripe. We never store or capture your credit card details on our databases."
    ]
  },
  terms: {
    icon: ShieldCheck,
    subhead: "Terms of Service for ElevateCv.",
    body: [
      "By using ElevateCv, you agree to these Terms. Our services are provided 'as is' for resume analysis, scoring, and text generation. You retain full ownership of all resume files and content you upload.",
      "Commercial scraping, unauthorized API calling, or automated bot submission to our pipeline is strictly prohibited and will result in IP bans.",
      "We reserve the right to limit access or modify features to maintain platform stability and protect computing resources."
    ]
  },
  faq: {
    icon: HelpCircle,
    subhead: "Frequently Asked Questions",
    body: [],
    extra: (
      <div className="space-y-4 mt-6">
        {[
          { q: "Is my resume kept private?", a: "Yes. We process all parsing and scanning via secure, SSL-encrypted requests. Your data is never rented, sold, or shared with external parties." },
          { q: "How does the 15-node pipeline work?", a: "When you upload your resume, our engine parallelizes calls across multiple models, processing ATS compliance, keyword analysis, achievement strength, and grammatical clarity concurrently." },
          { q: "Are the resume templates actually ATS-compliant?", a: "Yes. Our structural recommendations utilize standard chronological formats, avoiding tables, text boxes, and complex graphics that scramble older parser engines." },
          { q: "How do I upgrade or cancel my plan?", a: "Since pricing is coming soon, you can run up to 3 free analyses. Once premium plans launch, you'll be able to manage subscriptions directly via Stripe billing dashboards." }
        ].map((faq, idx) => (
          <div key={idx} className="rounded-xl border border-border/80 bg-card p-5 sm:p-6">
            <h3 className="text-base font-semibold text-foreground mb-2">{faq.q}</h3>
            <p className="text-sm md:text-[15px] leading-relaxed text-muted-foreground">{faq.a}</p>
          </div>
        ))}
      </div>
    )
  }
};

export default function Info() {
  const { type = "about" } = useParams<{ type: string }>();
  const item = contentMap[type] || contentMap.about;
  const Icon = item.icon;

  return (
    <SiteLayout>
      <section className="container px-4 sm:px-6 pt-12 pb-16 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <header className="mb-10">
            <h1 className="text-4xl md:text-5xl font-display font-medium text-foreground tracking-tight capitalize mb-4">
              {type.replace("-", " ")}
            </h1>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-secondary text-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">{item.subhead}</h2>
            </div>
          </header>
          
          <div className="space-y-5 text-sm md:text-[16px] leading-relaxed text-muted-foreground">
            {item.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {item.extra}
        </motion.div>
      </section>
    </SiteLayout>
  );
}
