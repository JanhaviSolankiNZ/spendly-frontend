import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { SpendlyLogo } from "@/assets/SpendlyLogo";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const scrollTo = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 shrink-0">
        <SpendlyLogo className="w-8 h-8" />
        <h1 className="leading-none text-base sm:text-xl font-bold text-muted-foreground">
          Spendly
        </h1>
      </Link>
      <nav className="hidden sm:flex items-center gap-6">
        {LINKS.map((l) => (
          <button
            key={l.label}
            onClick={() => scrollTo(l.href)}
            className="text-sm text-secondary hover:text-muted-foreground transition-colors cursor-pointer"
          >
            {l.label}
          </button>
        ))}
      </nav>
      <div className="hidden sm:flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="border-border text-secondary cursor-pointer"
          onClick={() => navigate("/signin")}
        >
          Sign in
        </Button>
        <Button
          size="sm"
          className="cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Get started free
        </Button>
      </div>
      <button
        className="sm:hidden p-2 text-secondary cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
         {open && (
        <div className={cn("sm:hidden absolute top-14 left-0 right-0 bg-card border-b border-border z-50 overflow-hidden transition-all duration-500 ease-in-out", open ? "max-h-96 opacity-100 translate-y-0 p-4" : "max-h-0 opacity-0 -translate-y-2 py-0 pointer-events-none")}>
          {LINKS.map((l) => (
            <button
              key={l.label}
              onClick={() => scrollTo(l.href)}
              className="block w-full text-left text-sm text-secondary hover:text-muted-foreground py-1.5 cursor-pointer"
            >
              {l.label}
            </button>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-border text-secondary cursor-pointer"
              onClick={() => { setOpen(false); navigate("/signin"); }}
            >
              Sign in
            </Button>
            <Button
              size="sm"
              className="w-full cursor-pointer"
              onClick={() => { setOpen(false); navigate("/signup"); }}
            >
              Get started free
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
