import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useLocation, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const getPageTitle = (path: string) => {
  if (path.startsWith("/pricing")) return "Pricing";
  if (path.startsWith("/contact")) return "Contact";
  if (path.startsWith("/blog")) return "Blog";
  if (path.startsWith("/analyzer")) return "Resume Analyzer";
  if (path.startsWith("/info/about")) return "About Us";
  if (path.startsWith("/info/careers")) return "Careers";
  if (path.startsWith("/info/privacy")) return "Privacy Policy";
  if (path.startsWith("/info/terms")) return "Terms of Service";
  if (path.startsWith("/info/faq")) return "FAQ";
  return "";
};

export default function SiteLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isLanding = pathname === "/";

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        {isLanding ? (
          <Navbar />
        ) : (
          <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md border-b border-border/40 h-14 flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center">
              <Link 
                to="/" 
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-card px-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary/40 select-none shadow-none"
              >
                <ArrowLeft className="h-3 w-3" /> Back
              </Link>
            </div>
            
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <h1 className="text-sm font-semibold tracking-tight text-foreground select-none">
                {getPageTitle(pathname)}
              </h1>
            </div>
            
            <div className="w-12" /> {/* Spacer */}
          </header>
        )}
        <main className={!isLanding ? "pt-4 pb-2" : ""}>{children}</main>
      </div>
      <Footer />
    </div>
  );
}