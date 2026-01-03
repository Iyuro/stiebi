import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calculator, 
  BarChart3, 
  TrendingUp, 
  Briefcase, 
  Building2,
  ArrowRight,
  GraduationCap
} from "lucide-react";

const programs = [
  {
    level: "Sarjana (S1)",
    items: [
      {
        name: "S1 Akuntansi",
        slug: "s1-akuntansi",
        icon: Calculator,
        description: "Program studi yang mempersiapkan mahasiswa menjadi profesional akuntansi yang kompeten dan beretika.",
        competencies: [
          "Penyusunan Laporan Keuangan",
          "Audit & Assurance",
          "Perpajakan",
          "Sistem Informasi Akuntansi",
        ],
        careers: ["Akuntan Publik", "Auditor Internal", "Konsultan Pajak", "Financial Analyst"],
        color: "primary",
      },
      {
        name: "S1 Manajemen",
        slug: "s1-manajemen",
        icon: BarChart3,
        description: "Program studi yang mengembangkan kemampuan manajerial dan kepemimpinan dalam dunia bisnis.",
        competencies: [
          "Manajemen Strategis",
          "Manajemen Pemasaran",
          "Manajemen Keuangan",
          "Manajemen SDM",
        ],
        careers: ["Manajer Bisnis", "Entrepreneur", "Konsultan Manajemen", "HR Manager"],
        color: "gold",
      },
    ],
  },
  {
    level: "Magister (S2)",
    items: [
      {
        name: "S2 Manajemen",
        slug: "s2-manajemen",
        icon: TrendingUp,
        description: "Program magister untuk mengembangkan pemimpin bisnis dengan wawasan strategis dan analitis.",
        competencies: [
          "Strategic Leadership",
          "Business Analytics",
          "Corporate Finance",
          "Innovation Management",
        ],
        careers: ["CEO/Director", "Senior Consultant", "Business Owner", "Academic Researcher"],
        color: "primary",
      },
    ],
  },
];

export const ProgramsSection = () => {
  return (
    <section id="program-studi" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
            Program Studi
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Pilih Program Studi{" "}
            <span className="text-gradient-gold">Terbaik</span> untuk Anda
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            STIE Bisnis Indonesia menawarkan program studi yang dirancang untuk membekali 
            mahasiswa dengan pengetahuan dan keterampilan yang dibutuhkan di dunia kerja.
          </p>
        </div>

        {/* Programs */}
        {programs.map((level, levelIndex) => (
          <div key={levelIndex} className="mb-16 last:mb-0">
            <div className="flex items-center gap-3 mb-8">
              <GraduationCap className="w-6 h-6 text-gold" />
              <h3 className="font-display text-2xl font-bold text-foreground">
                {level.level}
              </h3>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className={`grid gap-8 ${level.items.length === 1 ? "max-w-2xl mx-auto" : "md:grid-cols-2"}`}>
              {level.items.map((program, index) => (
                <Card
                  key={index}
                  variant="gold"
                  className="group overflow-hidden"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className={`p-4 rounded-xl ${
                        program.color === "gold" 
                          ? "bg-gold text-navy" 
                          : "bg-primary text-gold"
                      }`}>
                        <program.icon className="w-8 h-8" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl mt-4">{program.name}</CardTitle>
                    <CardDescription className="text-base">
                      {program.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Competencies */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gold" />
                        Kompetensi Lulusan
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {program.competencies.map((comp, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 rounded-full bg-muted text-sm text-muted-foreground"
                          >
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Careers */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gold" />
                        Prospek Karier
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {program.careers.map((career, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                            {career}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link to={`/program/${program.slug}`}>
                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                        Lihat Detail Program
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
