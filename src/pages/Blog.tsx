import SiteLayout from "@/components/site/SiteLayout";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";

const posts = [
  {
    slug: "ats-myths",
    title: "5 ATS myths that are killing your callback rate",
    excerpt: "Many candidates believe ATS automatically rejects resumes based on a score. Here is how parser ranking systems actually work, and what you must optimize for to get human eyes.",
    read: "6 min read",
    tag: "ATS",
    date: "Apr 22, 2026",
    content: [
      "In the tech job market, the Applicant Tracking System (ATS) has been cast as the ultimate villain. Rumors circulate about cold, heartless robots scanning resumes in milliseconds and instantly rejecting anyone without a perfect score. The truth is far less dramatic, but understanding how these systems actually function is critical to landing interviews.",
      "Here are the five most pervasive ATS myths busted, and how you can use this knowledge to climb to the top of the recruiter's pile.",
      "Myth 1: The ATS rejects resumes automatically. Almost no company sets up their ATS to auto-reject candidates based on a keyword match score. Recruiters are terrified of missing out on great talent. Instead, the ATS acts as a search engine and ranking database. It parses your resume into structured fields and ranks you against the job description. If you are ranked low, you aren't auto-rejected—your resume simply sits at the bottom of a list of 500 applicants, and the recruiter will likely never scroll down far enough to see it.",
      "Myth 2: You must use a single-column plain text file. While it's true that complex tables, text boxes, and background graphics can scramble old parser engines, modern parsers (like those in Workday, Greenhouse, and Lever) easily handle standard PDFs. A clean, single-column or light double-column layout using standard headings is completely safe and looks far more professional to human eyes.",
      "Myth 3: Keyword stuffing is the secret to ranking. In the early 2000s, pasting the job description in white font at the bottom of the page could cheat the system. Today, parsers detect invisible text and flag keyword stuffing as spam. Modern systems use semantic matching: they search for context. If a job description asks for 'React development,' the parser looks for React alongside related terms like 'JavaScript,' 'Redux,' and 'frontend components.'",
      "Myth 4: The ATS grades you on a percentage score. The 'ATS score' you see in online checkers is a simulation. The recruiter's dashboard doesn't show a grade like '72%.' It shows search results sorted by relevance. When a recruiter searches for 'Kubernetes' and 'Golang,' the candidates who have those terms with the highest density and recency appear first.",
      "Myth 5: Standard templates make you look generic. Recruiters scan resumes in six seconds. They want to find your title, company history, and education instantly. Using a non-standard, highly creative layout might stand out, but it usually frustrates recruiters because they have to hunt for basic information. Use a clean, chronological layout with clear headings."
    ]
  },
  {
    slug: "quantify-bullets",
    title: "How to quantify any bullet — even when you don't have numbers",
    excerpt: "You don't need a million dollars in budget to show metrics. Learn the formulas for scaling and mapping impact using proxies, frequency, and scale parameters.",
    read: "8 min read",
    tag: "Writing",
    date: "Apr 14, 2026",
    content: [
      "One of the most common pieces of resume advice is: 'Quantify your accomplishments.' But what if you are a backend developer who works on maintenance, a designer, or an individual contributor at a startup where metrics aren't tracked? How do you write quantitative bullets when you don't have access to revenue data?",
      "The secret is that you can quantify three things on any resume: scale, frequency, and scope. Here is the framework for converting passive descriptions into impact-driven metrics.",
      "1. Quantify the Scale of your Environment. If you didn't increase sales, you can still describe the size of the infrastructure you touched. Did you work on a database? How many tables or records did it hold? Did you support an internal team? How many engineers used your tools? Example: 'Maintained internal CI/CD pipelines supporting 45+ active developers across 12 microservices.'",
      "2. Quantify the Frequency of your Output. If your work is operational, numbers can represent how often you performed tasks. This shows throughput and reliability. Example: 'Conducted weekly security audits and triaged an average of 15 system alerts, reducing mean-time-to-resolution by 22%.'",
      "3. Use Proxy Metrics and Estimates. Recruiters do not expect IRS-level audits on your resume. It is perfectly acceptable to use conservative estimates. If you optimized a query, did it feel faster? Open the Chrome DevTools or database console and look at the latency. If it went from 800ms to 200ms, that is a 75% reduction. Write it: 'Optimized database queries, reducing API response latency by 75% for 5 key endpoints.'",
      "4. The Formula: Action + Context + Result. Every bullet should follow this structure. Don't just say what you did; explain the business problem and the outcome. Example: 'Redesigned the onboarding form (Action) to reduce user drop-off (Context), resulting in a 14% increase in successful sign-ups over 30 days (Result).'"
    ]
  },
  {
    slug: "swe-resume",
    title: "The 2026 software engineer resume blueprint",
    excerpt: "A complete walkthrough of the structure, technical sections, and bullet density required for senior and staff software engineer roles in today's tech market.",
    read: "11 min read",
    tag: "Roles",
    date: "Apr 03, 2026",
    content: [
      "The hiring market for software engineers has undergone a structural shift. The era of the generalist who memorizes LeetCode but can't deploy a production service is closing. Recruiters in 2026 are looking for product-minded engineers who understand architecture, cost efficiency, and business outcomes.",
      "Here is the architectural blueprint for a modern software engineer resume that ranks high in search indexes and converts to interviews.",
      "1. The Header: Keep it clean. Name, title (matching the role you are applying to), email, phone, location (city/state is enough), GitHub link, and LinkedIn link. Remove physical addresses and headshots.",
      "2. The Technical Skills Grid: Group your skills logically. Do not paste a single block of 50 keywords. Group them into: Languages, Frameworks, Cloud & DevOps, Databases & Tools. This makes it scannable for recruiters and highly searchable for parsers.",
      "3. Professional Experience: Lead with impact. Every bullet must start with a strong action verb (e.g., Architected, Orchestrated, Refactored, Maintained). Avoid passive verbs like 'Assisted' or 'Responsible for.' Highlight your experience with system design, scaling issues, and cross-team collaboration.",
      "4. The Stack in Context: Don't just list technologies in your skills grid; mention them directly inside your bullet points. Example: 'Architected a distributed worker queue in Go and Redis, reducing background task latency by 40%.' This proves to the parser and recruiter that you actually used the technology in production."
    ]
  },
  {
    slug: "pm-resume",
    title: "Product manager resumes that get past Workday",
    excerpt: "Product resumes require a careful balance of execution metrics, strategic scope, and product lifecycle markers. Here is what recruiters look for.",
    read: "9 min read",
    tag: "Roles",
    date: "Mar 28, 2026",
    content: [
      "Product Management is one of the most competitive fields in tech. A single PM opening at a top company can attract over 1,000 applications. Because PMs don't have standard coding tests, your resume is the sole filter that determines whether you get a callback.",
      "To win, your resume must prove that you can deliver value under uncertainty. Here is how to structure your PM resume for success.",
      "1. Focus on Business Outcomes, Not Features. A bad PM bullet says: 'Shipped a new dashboard.' A great PM bullet says: 'Launched a real-time analytics dashboard for enterprise clients, increasing customer retention by 8% and generating ₹4.2M in annual recurring revenue.' Show that you own the metric, not just the roadmap.",
      "2. Highlight the Product Lifecycle. Proven experience across the full product lifecycle (from discovery and design to launch and scaling) is highly sought after. Make sure your bullets reflect product discovery, user research, post-launch iteration, and cross-functional leadership.",
      "3. Show Collaborative Scope. PMs work with engineering, design, marketing, and sales. Highlight your ability to align stakeholders. Example: 'Led a cross-functional squad of 8 engineers and 2 product designers to redesign the checkout flow, reducing checkout friction and cart abandonment by 18%.'"
    ]
  },
  {
    slug: "cover-letter",
    title: "Cover letters in 2026: short, strange, effective",
    excerpt: "Recruiters spend less than 2 seconds on cover letters. Learn the three-paragraph conversational template that actually gets read and establishes immediate rapport.",
    read: "5 min read",
    tag: "Writing",
    date: "Mar 12, 2026",
    content: [
      "Let's be honest: almost nobody reads cover letters. Most candidates generate a generic, 400-word block of AI fluff that begins with 'Dear Hiring Manager, I am writing to express my interest in...' and proceeds to repeat their resume bullet points.",
      "If you write cover letters like this, you are wasting your time. In 2026, the only effective cover letter is short, conversational, and highly targeted. Here is the template that gets read.",
      "Paragraph 1: The Hook. Start with a direct connection to the company or product. Avoid formal greetings if possible, or keep them brief. Example: 'I've been tracking Stripe's Billing API updates for the last year, and when I saw the opening for the Billing Integration team, I knew I had to apply.'",
      "Paragraph 2: The Proof. Highlight one single, highly relevant accomplishment from your resume that directly maps to their active problem. Example: 'At my previous company, I rebuilt our core billing pipeline in Go and SQL, resolving concurrency bottlenecks that saved us $20k/month. I know Stripe handles scale issues on a different level, but I've faced the base bottlenecks firsthand.'",
      "Paragraph 3: The Close. Keep it professional and brief. Example: 'I'd love to chat about how my background fits your roadmap. Let me know when you're free.' That is it. Under 150 words. Punchy, authentic, and human."
    ]
  },
  {
    slug: "linkedin",
    title: "Your LinkedIn summary is doing nothing. Here's the fix.",
    excerpt: "Stop writing generic summaries. Optimize your profile for search algorithms and recruiters using semantic density, career milestones, and technical context.",
    read: "7 min read",
    tag: "Brand",
    date: "Feb 28, 2026",
    content: [
      "LinkedIn is a search engine. When recruiters are looking for talent, they don't browse profiles randomly. They type specific queries into LinkedIn Recruiter: 'Senior Software Engineer' AND 'React' AND 'Bengaluru.'",
      "If your profile isn't optimized for these search queries, you don't exist. Here is how to write a LinkedIn summary that turns your profile into a recruiter magnet.",
      "1. Use Semantic Keyword Density. Your summary is the highest-weight index field on your profile. Write a structured list of core competencies near the bottom of your summary. Example: 'Core Stack: JavaScript, React, Node.js, AWS, Kubernetes, Postgres.' This ensures you appear in multi-keyword search queries.",
      "2. The Three-Second Pitch. The first three lines of your summary are visible before a user clicks 'See more.' Make them count. State your role, years of experience, and your biggest achievement. Example: 'Senior Software Engineer with 6+ years of experience specializing in high-throughput backend services. Developed core billing engines at Stripe and scaled API infrastructures to 10M+ daily hits.'",
      "3. Clear Call to Action. Make it easy for recruiters to contact you. Provide your professional email or link your resume directly at the bottom of your summary."
    ]
  }
];

export default function Blog() {
  const [activePost, setActivePost] = useState<typeof posts[0] | null>(null);

  return (
    <SiteLayout>
      {activePost ? (
        <section className="container px-4 sm:px-6 pt-6 pb-12 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/40">
            <button 
              onClick={() => setActivePost(null)}
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors select-none font-semibold"
            >
              <ArrowLeft className="h-4 w-4 text-accent" /> Back to all articles
            </button>
          </div>
          
          <article>
            <header className="mb-8">
              <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-4">
                <span className="rounded bg-secondary px-2.5 py-0.5 text-foreground">{activePost.tag}</span>
                <span>{activePost.date}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {activePost.read}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground font-display leading-tight mb-4">{activePost.title}</h1>
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground italic font-light border-l-2 border-accent/40 pl-4 py-1">{activePost.excerpt}</p>
            </header>
            
            <div className="space-y-6 text-base md:text-lg leading-[1.8] text-foreground/90 font-normal">
              {activePost.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </article>
        </section>
      ) : (
        <section className="container px-4 sm:px-6 pt-8 pb-14 max-w-7xl mx-auto">
          <header className="mb-10 text-center max-w-3xl mx-auto space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-accent font-mono">Engineering & Career Blueprints</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground font-display">Resume Intelligence Insights</h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">Tactical ATS guides, recruiter teardowns, and bullet-quantification blueprints for modern technical careers.</p>
          </header>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <motion.article
                key={p.slug}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 hover:border-accent/40 transition-colors"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                    <span className="rounded bg-secondary px-2 py-0.5 text-foreground">{p.tag}</span>
                    <span>{p.date}</span>
                    <span>·</span>
                    <span>{p.read}</span>
                  </div>
                  
                  <h2 className="text-lg font-bold tracking-tight text-foreground group-hover:text-accent transition-colors cursor-pointer mb-2 leading-snug font-display">
                    <button onClick={() => setActivePost(p)} className="text-left font-display">
                      {p.title}
                    </button>
                  </h2>
                  
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">{p.excerpt}</p>
                </div>
                
                <button 
                  onClick={() => setActivePost(p)} 
                  className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:text-accent transition-colors select-none"
                >
                  Read article <span className="text-sm font-normal">→</span>
                </button>
              </motion.article>
            ))}
          </div>
        </section>
      )}
    </SiteLayout>
  );
}