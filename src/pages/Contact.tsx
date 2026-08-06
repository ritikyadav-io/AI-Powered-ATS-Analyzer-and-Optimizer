import SiteLayout from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, MapPin, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Contact() {
  return (
    <SiteLayout>
      <section className="container pt-8 pb-12 max-w-5xl mx-auto">
        <div className="mb-10 text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-accent font-mono">24/7 Priority Support</div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground font-display">Get in touch</h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">Sales, support, enterprise licensing, or candidate audits — we read every message and respond within 2 hours.</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="space-y-4">
              {[
                { icon: Mail, label: "Email", value: "hello@elevatecv.app" },
                { icon: MessageSquare, label: "Support", value: "Mon–Fri · within 4h" },
                { icon: MapPin, label: "HQ", value: "Bengaluru · Berlin · remote" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="grid h-10 w-10 place-items-center rounded-md bg-secondary text-foreground"><Icon className="h-5 w-5" /></div>
                  <div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                    <div className="font-semibold text-foreground mt-0.5">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <form className="space-y-4 rounded-xl border border-border/80 bg-card p-8" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="n" className="text-sm font-medium text-foreground">Name</Label>
                <Input id="n" className="bg-card border-border/80 focus-visible:ring-foreground" placeholder="Aarav Mehta" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="e" className="text-sm font-medium text-foreground">Email</Label>
                <Input id="e" type="email" className="bg-card border-border/80 focus-visible:ring-foreground" placeholder="you@company.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="s" className="text-sm font-medium text-foreground">Subject</Label>
              <Input id="s" className="bg-card border-border/80 focus-visible:ring-foreground" placeholder="What's up?" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="m" className="text-sm font-medium text-foreground">Message</Label>
              <Textarea id="m" className="bg-card border-border/80 focus-visible:ring-foreground" rows={6} placeholder="Tell us a bit…" />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground font-medium rounded-md py-2.5 hover:opacity-90 transition-opacity select-none">
              Send message
            </Button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}