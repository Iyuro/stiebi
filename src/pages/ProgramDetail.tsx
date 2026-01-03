import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calculator, 
  BarChart3, 
  TrendingUp,
  BookOpen,
  Clock,
  Users,
  Award,
  CheckCircle,
  ArrowLeft,
  GraduationCap,
  Briefcase,
  FileText,
  CreditCard,
  Calendar
} from "lucide-react";

const programsData = {
  "s1-akuntansi": {
    name: "S1 Akuntansi",
    icon: Calculator,
    level: "Sarjana (S1)",
    duration: "8 Semester (4 Tahun)",
    credits: "144 SKS",
    accreditation: "Terakreditasi BAN-PT",
    description: "Program Studi Akuntansi STIE Bisnis Indonesia mempersiapkan mahasiswa menjadi profesional akuntansi yang kompeten, beretika, dan siap menghadapi tantangan global. Kurikulum kami dirancang untuk membekali lulusan dengan pengetahuan teoretis dan praktis di bidang akuntansi keuangan, audit, perpajakan, dan sistem informasi akuntansi.",
    vision: "Menjadi program studi akuntansi terkemuka yang menghasilkan lulusan profesional, berintegritas, dan berdaya saing global.",
    mission: [
      "Menyelenggarakan pendidikan akuntansi berkualitas dengan standar internasional",
      "Melaksanakan penelitian yang berkontribusi pada pengembangan ilmu akuntansi",
      "Menghasilkan lulusan yang kompeten dan beretika profesional",
      "Menjalin kemitraan dengan dunia industri dan profesi akuntansi"
    ],
    curriculum: {
      semester1: ["Pengantar Akuntansi I", "Pengantar Ekonomi Mikro", "Matematika Ekonomi", "Bahasa Indonesia", "Pendidikan Pancasila"],
      semester2: ["Pengantar Akuntansi II", "Pengantar Ekonomi Makro", "Statistika Bisnis I", "Pengantar Manajemen", "Bahasa Inggris I"],
      semester3: ["Akuntansi Keuangan Menengah I", "Akuntansi Biaya", "Statistika Bisnis II", "Hukum Bisnis", "Pengantar Perpajakan"],
      semester4: ["Akuntansi Keuangan Menengah II", "Sistem Informasi Akuntansi", "Manajemen Keuangan", "Perpajakan I", "Bahasa Inggris II"],
      semester5: ["Akuntansi Keuangan Lanjutan I", "Auditing I", "Perpajakan II", "Akuntansi Manajemen", "Metodologi Penelitian"],
      semester6: ["Akuntansi Keuangan Lanjutan II", "Auditing II", "Akuntansi Sektor Publik", "Etika Profesi Akuntansi", "Praktikum Akuntansi"],
      semester7: ["Teori Akuntansi", "Akuntansi Forensik", "Seminar Akuntansi", "Magang Industri", "Mata Kuliah Pilihan"],
      semester8: ["Skripsi", "Ujian Komprehensif"]
    },
    competencies: [
      "Menyusun dan menganalisis laporan keuangan sesuai standar akuntansi",
      "Melakukan audit dan assurance dengan standar profesional",
      "Mengelola perpajakan perusahaan secara efektif",
      "Mengoperasikan sistem informasi akuntansi berbasis teknologi",
      "Menerapkan etika profesi dalam praktik akuntansi"
    ],
    careers: ["Akuntan Publik", "Auditor Internal", "Konsultan Pajak", "Financial Analyst", "Accounting Manager", "Cost Accountant", "Internal Auditor", "Tax Manager"],
    fees: {
      registration: "Rp 500.000",
      tuitionPerSemester: "Rp 4.500.000 - Rp 6.000.000",
      developmentFee: "Rp 8.000.000",
      facilityFee: "Rp 2.000.000 per tahun",
      notes: "Tersedia beasiswa prestasi akademik dan beasiswa ekonomi"
    }
  },
  "s1-manajemen": {
    name: "S1 Manajemen",
    icon: BarChart3,
    level: "Sarjana (S1)",
    duration: "8 Semester (4 Tahun)",
    credits: "144 SKS",
    accreditation: "Terakreditasi BAN-PT",
    description: "Program Studi Manajemen STIE Bisnis Indonesia mengembangkan kemampuan manajerial dan kepemimpinan mahasiswa untuk menjadi pemimpin bisnis yang inovatif dan adaptif. Fokus pembelajaran meliputi manajemen strategis, pemasaran, keuangan, dan sumber daya manusia.",
    vision: "Menjadi program studi manajemen unggulan yang menghasilkan pemimpin bisnis berkarakter dan berwawasan global.",
    mission: [
      "Menyelenggarakan pendidikan manajemen yang inovatif dan relevan dengan kebutuhan industri",
      "Mengembangkan penelitian di bidang manajemen dan bisnis",
      "Membentuk lulusan berjiwa entrepreneur dan kepemimpinan",
      "Membangun jejaring dengan dunia usaha dan industri"
    ],
    curriculum: {
      semester1: ["Pengantar Manajemen", "Pengantar Ekonomi Mikro", "Matematika Ekonomi", "Bahasa Indonesia", "Pendidikan Pancasila"],
      semester2: ["Pengantar Akuntansi", "Pengantar Ekonomi Makro", "Statistika Bisnis I", "Pengantar Bisnis", "Bahasa Inggris I"],
      semester3: ["Manajemen Pemasaran", "Manajemen Keuangan I", "Statistika Bisnis II", "Hukum Bisnis", "Perilaku Organisasi"],
      semester4: ["Manajemen SDM", "Manajemen Keuangan II", "Manajemen Operasional", "Sistem Informasi Manajemen", "Bahasa Inggris II"],
      semester5: ["Manajemen Strategis", "Studi Kelayakan Bisnis", "Kewirausahaan", "Manajemen Risiko", "Metodologi Penelitian"],
      semester6: ["Kepemimpinan", "Manajemen Rantai Pasok", "Digital Marketing", "Etika Bisnis", "Praktikum Manajemen"],
      semester7: ["Manajemen Perubahan", "Business Analytics", "Seminar Manajemen", "Magang Industri", "Mata Kuliah Pilihan"],
      semester8: ["Skripsi", "Ujian Komprehensif"]
    },
    competencies: [
      "Merancang dan mengimplementasikan strategi bisnis",
      "Mengelola sumber daya manusia secara efektif",
      "Menganalisis pasar dan mengembangkan strategi pemasaran",
      "Mengelola keuangan perusahaan dengan baik",
      "Memimpin dan mengelola perubahan organisasi"
    ],
    careers: ["Manajer Bisnis", "Entrepreneur", "Konsultan Manajemen", "HR Manager", "Marketing Manager", "Operations Manager", "Business Development", "Project Manager"],
    fees: {
      registration: "Rp 500.000",
      tuitionPerSemester: "Rp 4.500.000 - Rp 6.000.000",
      developmentFee: "Rp 8.000.000",
      facilityFee: "Rp 2.000.000 per tahun",
      notes: "Tersedia beasiswa prestasi akademik dan beasiswa ekonomi"
    }
  },
  "s2-manajemen": {
    name: "S2 Manajemen",
    icon: TrendingUp,
    level: "Magister (S2)",
    duration: "4 Semester (2 Tahun)",
    credits: "42 SKS",
    accreditation: "Terakreditasi BAN-PT",
    description: "Program Magister Manajemen STIE Bisnis Indonesia dirancang untuk mengembangkan pemimpin bisnis dengan wawasan strategis dan kemampuan analitis tingkat lanjut. Program ini cocok bagi profesional yang ingin meningkatkan karier ke posisi eksekutif.",
    vision: "Menjadi program magister manajemen terdepan yang menghasilkan pemimpin bisnis visioner dan berintegritas.",
    mission: [
      "Mengembangkan kompetensi kepemimpinan strategis tingkat lanjut",
      "Melaksanakan penelitian terapan yang berdampak pada praktik bisnis",
      "Membangun jejaring profesional yang luas",
      "Mengintegrasikan teori dan praktik manajemen kontemporer"
    ],
    curriculum: {
      semester1: ["Manajemen Strategis Lanjutan", "Ekonomi Manajerial", "Metodologi Penelitian Bisnis", "Kepemimpinan Transformasional", "Manajemen Keuangan Korporat"],
      semester2: ["Manajemen Pemasaran Strategis", "Manajemen SDM Strategis", "Business Analytics & Big Data", "Corporate Governance", "Manajemen Inovasi"],
      semester3: ["Manajemen Risiko Korporat", "Strategic Decision Making", "Tesis Proposal", "Mata Kuliah Konsentrasi I", "Mata Kuliah Konsentrasi II"],
      semester4: ["Tesis", "Ujian Tesis"]
    },
    competencies: [
      "Merumuskan dan mengeksekusi strategi bisnis tingkat korporat",
      "Menganalisis data bisnis untuk pengambilan keputusan strategis",
      "Memimpin transformasi organisasi",
      "Mengelola risiko dan tata kelola perusahaan",
      "Melakukan penelitian bisnis terapan"
    ],
    careers: ["CEO/Direktur", "Senior Consultant", "Business Owner", "Academic Researcher", "Chief Strategy Officer", "VP Operations", "Managing Director", "Executive Advisor"],
    fees: {
      registration: "Rp 750.000",
      tuitionPerSemester: "Rp 8.000.000 - Rp 12.000.000",
      developmentFee: "Rp 15.000.000",
      facilityFee: "Rp 3.000.000 per tahun",
      notes: "Tersedia beasiswa untuk karyawan perusahaan mitra dan alumni berprestasi"
    }
  }
};

const registrationSteps = [
  { step: 1, title: "Pendaftaran Online", description: "Isi formulir pendaftaran di website dan unggah dokumen yang diperlukan" },
  { step: 2, title: "Pembayaran Biaya Pendaftaran", description: "Lakukan pembayaran biaya pendaftaran melalui transfer bank" },
  { step: 3, title: "Verifikasi Dokumen", description: "Tim admisi akan memverifikasi kelengkapan dan keabsahan dokumen" },
  { step: 4, title: "Tes Seleksi", description: "Ikuti tes potensi akademik dan wawancara (untuk S2)" },
  { step: 5, title: "Pengumuman", description: "Hasil seleksi diumumkan melalui website dan email" },
  { step: 6, title: "Daftar Ulang", description: "Calon mahasiswa yang diterima melakukan daftar ulang dan pembayaran" }
];

export const ProgramDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const program = slug ? programsData[slug as keyof typeof programsData] : null;

  if (!program) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Program tidak ditemukan</h1>
          <Link to="/#program-studi">
            <Button variant="gold">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Program Studi
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = program.icon;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-navy via-primary to-navy-light relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/#program-studi" className="inline-flex items-center text-gold hover:text-gold-light mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Program Studi
          </Link>
          
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="p-6 rounded-2xl bg-gold text-navy">
              <IconComponent className="w-16 h-16" />
            </div>
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-gold/20 text-gold text-sm font-medium mb-3">
                {program.level}
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                {program.name}
              </h1>
              <p className="text-white/80 text-lg max-w-2xl">
                {program.description}
              </p>
              
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center gap-2 text-white/90">
                  <Clock className="w-5 h-5 text-gold" />
                  <span>{program.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <BookOpen className="w-5 h-5 text-gold" />
                  <span>{program.credits}</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Award className="w-5 h-5 text-gold" />
                  <span>{program.accreditation}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Card variant="gold">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-gold" />
                  Visi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{program.vision}</p>
              </CardContent>
            </Card>
            
            <Card variant="gold">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-gold" />
                  Misi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {program.mission.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
              Kurikulum
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Struktur <span className="text-gradient-gold">Kurikulum</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(program.curriculum).map(([semester, courses], index) => (
              <Card key={semester} variant="elevated" className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-gold" />
                    Semester {index + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {courses.map((course, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                        {course}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Competencies & Careers */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Card variant="gold">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-gold" />
                  Kompetensi Lulusan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {program.competencies.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card variant="gold">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-gold" />
                  Prospek Karier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {program.careers.map((career, index) => (
                    <div key={index} className="flex items-center gap-2 text-muted-foreground">
                      <span className="w-2 h-2 rounded-full bg-gold" />
                      {career}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Fees */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
              Biaya Pendidikan
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Investasi <span className="text-gradient-gold">Pendidikan</span>
            </h2>
          </div>

          <Card variant="gold" className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gold" />
                    <span className="font-medium">Biaya Pendaftaran</span>
                  </div>
                  <span className="text-lg font-semibold text-gold">{program.fees.registration}</span>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gold" />
                    <span className="font-medium">SPP per Semester</span>
                  </div>
                  <span className="text-lg font-semibold text-gold">{program.fees.tuitionPerSemester}</span>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-gold" />
                    <span className="font-medium">Biaya Pengembangan</span>
                  </div>
                  <span className="text-lg font-semibold text-gold">{program.fees.developmentFee}</span>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gold" />
                    <span className="font-medium">Biaya Fasilitas</span>
                  </div>
                  <span className="text-lg font-semibold text-gold">{program.fees.facilityFee}</span>
                </div>

                <div className="bg-gold/10 rounded-lg p-4 flex items-start gap-3">
                  <Award className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{program.fees.notes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Registration Steps */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
              Cara Pendaftaran
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Alur <span className="text-gradient-gold">Pendaftaran</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {registrationSteps.map((step, index) => (
              <Card key={step.step} variant="elevated" className="relative animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-gold text-navy font-bold flex items-center justify-center">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-foreground mt-4 mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/#pendaftaran">
              <Button variant="gold" size="lg">
                <Calendar className="w-5 h-5 mr-2" />
                Daftar Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProgramDetail;
