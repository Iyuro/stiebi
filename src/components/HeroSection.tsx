import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroCampus from "@/assets/hero-campus.jpg";

export const HeroSection = () => {
  return (
    <section
      id="beranda"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroCampus}
          alt="Kampus STIE Bisnis Indonesia"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-gold/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />

      {/* Content */}
      <div className="relative container mx-auto px-4 py-32 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            Pendaftaran Mahasiswa Baru 2025/2026 Dibuka
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6 animate-fade-in-up">
            Membangun Generasi{" "}
            <span className="text-gradient-gold">Profesional</span>
            <br />
            di Bidang Ekonomi & Bisnis
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 animate-fade-in-delay-1">
            Sekolah Tinggi Ilmu Ekonomi & Bisnis Indonesia menghadirkan pendidikan berkualitas 
            tinggi untuk mencetak pemimpin bisnis masa depan yang berintegritas dan berdaya saing global.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
            <Button variant="hero" size="xl">
              <span>Daftar Mahasiswa Baru</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="hero-outline" size="xl">
              <Play className="w-5 h-5" />
              <span>Lihat Program Studi</span>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-fade-in-delay-3">
            {[
              { value: "25+", label: "Tahun Pengalaman" },
              { value: "5000+", label: "Alumni Sukses" },
              { value: "50+", label: "Dosen Profesional" },
              { value: "98%", label: "Tingkat Kelulusan" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <div className="font-display text-3xl md:text-4xl font-bold text-gold mb-1">
                  {stat.value}
                </div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 animate-bounce">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/60 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};
