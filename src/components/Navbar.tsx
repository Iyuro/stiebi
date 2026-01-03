import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, GraduationCap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { label: "Beranda", href: "#beranda" },
  { label: "Tentang", href: "#tentang" },
  { label: "Program Studi", href: "#program-studi" },
  { label: "Galeri", href: "#galeri" },
  { label: "Berita", href: "#berita" },
  { label: "Pendaftaran", href: "#pendaftaran" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-soft py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#beranda" className="flex items-center gap-3 group">
          <div className={`p-2 rounded-xl transition-all duration-300 ${
            isScrolled ? "bg-primary" : "bg-white/10 backdrop-blur-sm"
          }`}>
            <GraduationCap className={`w-8 h-8 ${isScrolled ? "text-gold" : "text-gold"}`} />
          </div>
          <div className="flex flex-col">
            <span className={`font-display font-bold text-lg leading-tight transition-colors ${
              isScrolled ? "text-primary" : "text-white"
            }`}>
              STIE Bisnis Indonesia
            </span>
            <span className={`text-xs transition-colors ${
              isScrolled ? "text-muted-foreground" : "text-white/80"
            }`}>
              Excellence in Business Education
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isScrolled
                  ? "text-foreground hover:bg-muted hover:text-primary"
                  : "text-white/90 hover:text-white hover:bg-white/10"
              }`}
            >
              {item.label}
            </a>
          ))}
          {isAdmin && (
            <Link to="/admin">
              <Button variant="ghost" size="sm" className={`${
                isScrolled ? "text-primary" : "text-white"
              }`}>
                <Shield className="w-4 h-4 mr-1" />
                Admin
              </Button>
            </Link>
          )}
          {isHomePage ? (
            <a href="#pendaftaran">
              <Button variant={isScrolled ? "gold" : "hero"} size="sm" className="ml-2">
                Daftar Sekarang
              </Button>
            </a>
          ) : (
            <Link to="/#pendaftaran">
              <Button variant={isScrolled ? "gold" : "hero"} size="sm" className="ml-2">
                Daftar Sekarang
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`lg:hidden p-2 rounded-lg transition-colors ${
            isScrolled ? "text-primary hover:bg-muted" : "text-white hover:bg-white/10"
          }`}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-elevated animate-fade-in">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-foreground font-medium hover:bg-muted transition-colors"
              >
                {item.label}
              </a>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-foreground font-medium hover:bg-muted transition-colors flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Admin Panel
              </Link>
            )}
            <Button variant="gold" className="mt-4 w-full">
              Daftar Sekarang
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};
