import { Link, NavLink, useLocation } from "react-router-dom";
import { Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/analyzer", label: "Analyzer" },
  { to: "/pricing", label: "Pricing" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 text-white">
      <nav className="container relative flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img src="/logo.png" alt="ElevateCv Logo" className="h-8 w-8 object-contain" style={{ mixBlendMode: 'screen' }} />
          <span className="font-display text-base font-bold tracking-tight text-white">ElevateCv</span>
          <span className="ml-1.5 hidden rounded border border-white/20 bg-white/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-zinc-300 sm:inline">beta</span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-1.5 text-[14px] font-medium transition-colors ${
                  isActive ? "text-white font-semibold" : "text-zinc-400 hover:text-white"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/analyzer" className="hidden sm:block">
            <Button size="sm" className="bg-white text-black font-medium rounded-md px-4 py-2 hover:bg-zinc-200 transition-colors">
              Analyze resume
            </Button>
          </Link>
          <button
            className="grid h-9 w-9 place-items-center rounded-md border border-white/20 bg-white/5 text-zinc-300 hover:text-white md:hidden"
            onClick={() => setOpen(o => !o)}
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="container relative pb-4 md:hidden">
          <div className="bg-[#0f0f0f] border border-white/10 mt-2 rounded-lg p-2.5 shadow-lg">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`block rounded px-3 py-2 text-[14px] font-medium transition-colors ${loc.pathname === l.to ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"}`}
              >
                {l.label}
              </Link>
            ))}
            <Link to="/analyzer" onClick={() => setOpen(false)} className="block mt-2">
              <Button size="sm" className="w-full bg-white text-black font-medium rounded-md py-2 hover:bg-zinc-200 transition-colors">
                Analyze resume
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}