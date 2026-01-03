import { 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Facebook,
  Instagram,
  Youtube,
  Linkedin
} from "lucide-react";

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "Youtube" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

const quickLinks = [
  { label: "Tentang Kami", href: "#tentang" },
  { label: "Program Studi", href: "#program-studi" },
  { label: "Galeri", href: "#galeri" },
  { label: "Berita", href: "#berita" },
  { label: "Pendaftaran", href: "#pendaftaran" },
];

const programLinks = [
  { label: "S1 Akuntansi", href: "#" },
  { label: "S1 Manajemen", href: "#" },
  { label: "S2 Manajemen", href: "#" },
  { label: "Kalender Akademik", href: "#" },
  { label: "E-Learning", href: "#" },
];

export const Footer = () => {
  return (
    <footer className="bg-navy text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <a href="#beranda" className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-primary">
                <GraduationCap className="w-8 h-8 text-gold" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg leading-tight text-white">
                  STIE Bisnis Indonesia
                </span>
                <span className="text-xs text-white/60">
                  Excellence in Business Education
                </span>
              </div>
            </a>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Sekolah Tinggi Ilmu Ekonomi & Bisnis Indonesia berkomitmen menghasilkan 
              lulusan profesional yang siap bersaing di era global.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="p-2.5 rounded-lg bg-white/10 text-white/70 hover:bg-gold hover:text-navy transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg text-white mb-5">
              Tautan Cepat
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-gold transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Program Links */}
          <div>
            <h4 className="font-display font-semibold text-lg text-white mb-5">
              Program Studi
            </h4>
            <ul className="space-y-3">
              {programLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-gold transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-semibold text-lg text-white mb-5">
              Hubungi Kami
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm">
                  Jl. Pendidikan No. 123<br />
                  Jakarta Selatan, 12345
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold" />
                <span className="text-white/70 text-sm">(021) 1234-5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold" />
                <span className="text-white/70 text-sm">info@stiebi.ac.id</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gold" />
                <span className="text-white/70 text-sm">
                  Senin - Jumat: 08:00 - 16:00
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60">
            <p>
              © {new Date().getFullYear()} STIE Bisnis Indonesia. Hak Cipta Dilindungi.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-gold transition-colors">
                Kebijakan Privasi
              </a>
              <a href="#" className="hover:text-gold transition-colors">
                Syarat & Ketentuan
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
