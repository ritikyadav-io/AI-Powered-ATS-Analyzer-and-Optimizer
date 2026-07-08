import { Link } from "react-router-dom";
import { Sparkles, Github, Twitter, Linkedin, Mail } from "lucide-react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function Footer() {
  const cols = [
    { title: "Product", links: [
      ["Resume Analyzer", "/analyzer"],
      ["ATS Score Checker", "/analyzer"],
      ["AI Resume Rewriter", "/analyzer"],
      ["Cover Letter Writer", "/analyzer"],
      ["LinkedIn Optimizer", "/analyzer"],
      ["Pricing Plans", "/pricing"],
    ] },
    { title: "Resources", links: [
      ["Technical Blog", "/blog"],
      ["ATS Guide 2026", "/blog"],
      ["Keyword Database", "/blog"],
      ["FAQs", "/info/faq"],
    ] },
    { title: "Company", links: [
      ["About Us", "/info/about"],
      ["Contact Support", "/contact"],
      ["Careers (Hiring)", "/info/careers"],
      ["Brand Assets", "/contact"],
    ] },
    { title: "Legal", links: [
      ["Privacy Policy", "/info/privacy"],
      ["Terms of Service", "/info/terms"],
      ["GDPR Compliance", "/info/privacy"],
      ["DPA Agreement", "/info/privacy"],
    ] },
  ];
  return (
    <footer className="relative mt-8 border-t border-white/10 bg-[#0a0a0a] text-white">
      <div className="container px-4 py-8 md:px-6 md:py-16">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.4fr_repeat(4,1fr)] md:gap-12">
          <div className="sm:col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="ElevateCv Logo" className="h-8 w-8 object-contain" style={{ mixBlendMode: 'screen' }} />
              <span className="font-display text-base font-bold text-white">ElevateCv</span>
            </Link>
            <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-zinc-400">
              AI resume intelligence for ATS scoring, AI rewrites, job description mapping, cover letters, and LinkedIn.
            </p>
            <div className="mt-4 flex gap-2">
              {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                <a key={i} href="#" aria-label="social" className="grid h-8 w-8 place-items-center rounded-md border border-white/10 bg-white/5 text-zinc-400 transition-colors hover:text-white hover:bg-white/10">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {cols.map(c => (<FooterCol key={c.title} title={c.title} links={c.links as [string,string][]} />))}
        </div>


        <div className="mt-6 border-t border-white/10 pt-4 text-[11px] leading-relaxed text-zinc-400">
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:gap-4 font-mono text-[10px]">
            <div>© {new Date().getFullYear()} ElevateCv Labs. All rights reserved.</div>
            <div>v1.0 · made for humans, optimized for bots</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-w-0 border-b border-white/10 pb-2 sm:border-0 sm:pb-0">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between py-1.5 text-left font-display text-[11px] font-semibold uppercase tracking-wide text-white sm:pointer-events-none sm:py-0 sm:text-sm sm:normal-case sm:tracking-normal"
        aria-expanded={open}
      >
        {title}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform sm:hidden text-zinc-400 ${open ? "rotate-180" : ""}`} />
      </button>
      <ul className={`space-y-1 sm:mt-4 sm:space-y-2 sm:block ${open ? "mt-1.5 block" : "hidden"}`}>
        {links.map(([label, to]) => (
          <li key={label}>
            <Link to={to} className="block truncate text-[12px] text-zinc-400 transition-colors hover:text-white sm:text-sm">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}