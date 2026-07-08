import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="container py-6 md:py-8 max-w-6xl mx-auto">
      <div className="relative overflow-hidden rounded-xl border border-border/80 bg-card p-8 sm:p-12 md:p-16 text-center">
        <div className="relative">
          <h2 className="display-md text-foreground max-w-2xl mx-auto tracking-tight">Stop guessing. Start interviewing.</h2>
          <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-muted-foreground">First analysis is free. No card. No spam. Just a brutally honest score and the rewrites that fix it.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/analyzer">
              <Button size="lg" className="bg-primary text-primary-foreground font-medium rounded-md px-5 py-2.5 text-[15px] hover:opacity-90 transition-opacity flex items-center gap-1.5">
                Run my free analysis <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="bg-card text-foreground border border-border/80 font-medium rounded-md px-5 py-2.5 text-[15px] hover:bg-secondary/40 transition-colors">
                View plans
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}