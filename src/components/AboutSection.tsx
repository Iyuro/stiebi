import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Target, Award, Users, Lightbulb, TrendingUp } from "lucide-react";

const values = [
  {
    icon: BookOpen,
    title: "Pendidikan Berkualitas",
    description: "Kurikulum berbasis kompetensi yang relevan dengan kebutuhan industri modern.",
  },
  {
    icon: Target,
    title: "Fokus Karier",
    description: "Program magang dan kerjasama dengan perusahaan ternama untuk peluang karier.",
  },
  {
    icon: Award,
    title: "Akreditasi Unggul",
    description: "Diakui secara nasional dengan akreditasi terbaik dari BAN-PT.",
  },
  {
    icon: Users,
    title: "Dosen Profesional",
    description: "Tenaga pengajar berpengalaman dari akademisi dan praktisi industri.",
  },
  {
    icon: Lightbulb,
    title: "Inovasi & Riset",
    description: "Mendorong penelitian dan pengembangan di bidang ekonomi dan bisnis.",
  },
  {
    icon: TrendingUp,
    title: "Jaringan Alumni",
    description: "Komunitas alumni kuat yang tersebar di berbagai sektor industri.",
  },
];

export const AboutSection = () => {
  return (
    <section id="tentang" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 text-gold-dark font-semibold text-sm mb-4">
            Tentang Kami
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Sekolah Tinggi Ilmu Ekonomi{" "}
            <span className="text-primary">&</span> Bisnis Indonesia
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            STIE Bisnis Indonesia adalah institusi pendidikan tinggi yang berdedikasi untuk menghasilkan 
            lulusan kompeten dan berintegritas di bidang ekonomi dan bisnis, siap menghadapi tantangan 
            global dengan keunggulan lokal.
          </p>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card variant="elevated" className="p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary text-gold">
                <Target className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-3">Visi</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Menjadi perguruan tinggi unggul dan terkemuka di Indonesia dalam bidang ilmu ekonomi 
                  dan bisnis yang menghasilkan lulusan berkompeten, beretika, dan berwawasan global 
                  pada tahun 2030.
                </p>
              </div>
            </div>
          </Card>

          <Card variant="elevated" className="p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gold text-navy">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-3">Misi</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                    Menyelenggarakan pendidikan berkualitas tinggi berbasis kompetensi
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                    Mengembangkan penelitian yang inovatif dan aplikatif
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                    Melaksanakan pengabdian masyarakat yang bermanfaat
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Values Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <Card
              key={index}
              variant="feature"
              className="p-6 group cursor-pointer"
            >
              <CardContent className="p-0">
                <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4 group-hover:bg-primary group-hover:text-gold transition-all duration-300">
                  <value.icon className="w-6 h-6" />
                </div>
                <h4 className="font-display text-xl font-semibold text-foreground mb-2">
                  {value.title}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
