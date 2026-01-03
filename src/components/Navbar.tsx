import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, GraduationCap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

type NavItem =
  | { label: string; type: "anchor"; href: `#${string}` }
  | { label: string; type: "route"; to: string };

const NAV_ITEMS: NavItem[] = [
  { label: "Beranda", type: "anchor", href: "#beranda" },
  { label: "Tentang", type: "anchor", href: "#tentang" },
  { label: "Program Studi", type: "anchor", href: "#program-studi" },
  { label: "Galeri", type: "anchor", href: "#galeri" },
  { label: "Berita", type: "anchor", href: "#berita" },
  // Ganti ke "/login" kalau kamu punya halaman login sendiri
  { label: "Login", type: "route", to: "/admin" },
];

function scrollToHash(hash: string) {
  const id = hash.replace("#", "");
  const el = document.getElementById(id);
  if (!el) return;

  // offset kalau navbar fixed (biar gak ketutup)
  const yOffset = 90;
  const y = el.getBoundingClientRect().top + window.scrollY - yOffset;

  window.scrollTo({ top: y, behavior: "smooth" });
}

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change (biar gak nyangkut)
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // If URL has a hash (e.g. /#tentang) then scroll
  useEffect(() => {
    if (!isHomePage) return;
    if (!location.hash) return;

    // wait DOM render
    const t = window.setTimeout(() => scrollToHash(location.hash), 50);
    return () => window.clearTimeout(t);
  }, [isHomePage, location.hash]);

  const headerClass = useMemo(() => {
    return `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? "bg-white/90 backdrop-blur-xl shadow-soft py-3"
        : "bg-transparent py-5"
    }`;
  }, [isScrolled]);

  const logoChipClass = useMemo(() => {
    return `p-2 rounded-2xl transition-all duration-300 ${
      isScrolled ? "bg-primary" : "bg-white/10 backdrop-blur-sm"
    }`;
  }, [isScrolled]);

  const brandTitleClass = useMemo(() => {
    return `font-display font-bold text-lg leading-tight transition-colors ${
      isScrolled ? "text-primary" : "text-white"
    }`;
  }, [isScrolled]);

  const brandSubClass = useMemo(() => {
    return `text-xs transition-colors ${
      isScrolled ? "text-muted-foreground" : "text-white/80"
    }`;
  }, [isScrolled]);

  const desktopLinkClass = (active?: boolean) =>
    `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isScrolled
        ? `text-foreground hover:bg-muted hover:text-primary ${
            active ? "bg-muted text-primary" : ""
          }`
        : `text-white/90 hover:text-white hover:bg-white/10 ${
            active ? "bg-white/15 text-white" : ""
          }`
    }`;

  const handleAnchorClick = (href: string) => {
    // Jika bukan di homepage, balik dulu ke "/" bawa hash
    if (!isHomePage) {
      navigate(`/${href}`);
      return;
    }
    scrollToHash(href);
  };

  return (
    <header className={headerClass}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/#beranda"
          onClick={(e) => {
            e.preventDefault();
            if (!isHomePage) navigate("/#beranda");
            else handleAnchorClick("#beranda");
          }}
          className="flex items-center gap-3 group select-none"
          aria-label="STIE Bisnis Indonesia"
        >
          <div className={logoChipClass}>
            <GraduationCap className="w-8 h-8 text-gold" />
          </div>
          <div className="flex flex-col">
            <span className={brandTitleClass}>STIE Bisnis Indonesia</span>
            <span className={brandSubClass}>Excellence in Business Education</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            if (item.type === "anchor") {
              const active = isHomePage && location.hash === item.href;
              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => handleAnchorClick(item.href)}
                  className={desktopLinkClass(active)}
                >
                  {item.label}
                </button>
              );
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => desktopLinkClass(isActive)}
              >
                {item.label}
              </NavLink>
            );
          })}

          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => desktopLinkClass(isActive)}>
              <span className="inline-flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Admin
              </span>
            </NavLink>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          className={`lg:hidden p-2 rounded-xl transition-colors ${
            isScrolled ? "text-primary hover:bg-muted" : "text-white hover:bg-white/10"
          }`}
          aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl shadow-elevated animate-fade-in">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              if (item.type === "anchor") {
                return (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleAnchorClick(item.href);
                    }}
                    className="text-left px-4 py-3 rounded-xl text-foreground font-medium hover:bg-muted transition-colors"
                  >
                    {item.label}
                  </button>
                );
              }

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl font-medium transition-colors ${
                      isActive ? "bg-muted text-primary" : "text-foreground hover:bg-muted"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              );
            })}

            {isAdmin && (
              <NavLink
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${
                    isActive ? "bg-muted text-primary" : "text-foreground hover:bg-muted"
                  }`
                }
              >
                <Shield className="w-4 h-4" />
                Admin Panel
              </NavLink>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
