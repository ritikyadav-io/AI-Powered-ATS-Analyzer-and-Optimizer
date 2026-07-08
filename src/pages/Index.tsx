import SiteLayout from "@/components/site/SiteLayout";
import { Hero } from "@/components/site/Hero";
import { Features } from "@/components/site/Features";
import { ScoreShowcase } from "@/components/site/ScoreShowcase";
import { Pipeline } from "@/components/site/Pipeline";
import { Comparison } from "@/components/site/Comparison";
import { Testimonials } from "@/components/site/Testimonials";
import { CTA } from "@/components/site/CTA";

export default function Index() {
  return (
    <SiteLayout>
      <Hero />
      <ScoreShowcase />
      <Features />
      <Pipeline />
      <Comparison />
      <Testimonials />
    </SiteLayout>
  );
}
