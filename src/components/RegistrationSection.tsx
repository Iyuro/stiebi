import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  GraduationCap, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2,
  ArrowRight,
  Sparkles,
  School,
  Calendar
} from "lucide-react";

export const RegistrationSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    birth_date: "",
    birth_place: "",
    address: "",
    program: "",
    education_level: "",
    previous_school: "",
    graduation_year: "",
    parent_name: "",
    parent_phone: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from("registrations").insert({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        birth_date: formData.birth_date || null,
        birth_place: formData.birth_place || null,
        address: formData.address || null,
        program: formData.program,
        education_level: formData.education_level || null,
        previous_school: formData.previous_school || null,
        graduation_year: formData.graduation_year ? parseInt(formData.graduation_year) : null,
        parent_name: formData.parent_name || null,
        parent_phone: formData.parent_phone || null,
      });

      if (error) throw error;

      toast({
        title: "Pendaftaran Berhasil!",
        description: "Tim kami akan menghubungi Anda dalam 1-2 hari kerja.",
      });

      // Reset form
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        birth_date: "",
        birth_place: "",
        address: "",
        program: "",
        education_level: "",
        previous_school: "",
        graduation_year: "",
        parent_name: "",
        parent_phone: "",
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Gagal Mendaftar",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    "Beasiswa hingga 100% untuk mahasiswa berprestasi",
    "Fasilitas pembelajaran modern dan lengkap",
    "Program magang di perusahaan ternama",
    "Jaringan alumni yang luas di seluruh Indonesia",
  ];

  return (
    <section id="pendaftaran" className="py-24 bg-primary relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Info */}
          <div className="text-white lg:sticky lg:top-24">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/20 text-gold font-semibold text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Pendaftaran Dibuka
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Daftar Sekarang &{" "}
              <span className="text-gold">Wujudkan Impianmu</span>
            </h2>
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              Bergabunglah dengan ribuan mahasiswa yang telah memilih STIE Bisnis Indonesia 
              sebagai langkah awal menuju karier sukses di dunia ekonomi dan bisnis.
            </p>

            {/* Benefits List */}
            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-white/90">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* Contact Info */}
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
              <h4 className="font-semibold text-gold mb-4">Butuh Bantuan?</h4>
              <div className="space-y-3 text-white/80 text-sm">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gold" />
                  (021) 1234-5678
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gold" />
                  admisi@stiebi.ac.id
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <Card variant="glass" className="bg-white shadow-elevated">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-gold" />
              </div>
              <CardTitle className="text-2xl">Formulir Pendaftaran</CardTitle>
              <CardDescription>
                Lengkapi data di bawah ini untuk mendaftar sebagai calon mahasiswa baru
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Nama Lengkap *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Masukkan nama lengkap Anda"
                    value={formData.full_name}
                    onChange={(e) => handleChange("full_name", e.target.value)}
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contoh@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    Nomor Telepon *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                  />
                </div>

                {/* Birth Date & Place */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="birth_place" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      Tempat Lahir
                    </Label>
                    <Input
                      id="birth_place"
                      placeholder="Kota kelahiran"
                      value={formData.birth_place}
                      onChange={(e) => handleChange("birth_place", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birth_date" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      Tanggal Lahir
                    </Label>
                    <Input
                      id="birth_date"
                      type="date"
                      value={formData.birth_date}
                      onChange={(e) => handleChange("birth_date", e.target.value)}
                    />
                  </div>
                </div>

                {/* Program */}
                <div className="space-y-2">
                  <Label htmlFor="program" className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    Program Studi *
                  </Label>
                  <Select 
                    value={formData.program}
                    onValueChange={(value) => handleChange("program", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih program studi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="S1 Akuntansi">S1 Akuntansi</SelectItem>
                      <SelectItem value="S1 Manajemen">S1 Manajemen</SelectItem>
                      <SelectItem value="S2 Manajemen">S2 Manajemen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Education Level */}
                <div className="space-y-2">
                  <Label htmlFor="education_level" className="flex items-center gap-2">
                    <School className="w-4 h-4 text-muted-foreground" />
                    Pendidikan Terakhir
                  </Label>
                  <Select 
                    value={formData.education_level}
                    onValueChange={(value) => handleChange("education_level", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih pendidikan terakhir" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SMA/SMK">SMA/SMK</SelectItem>
                      <SelectItem value="D3">D3</SelectItem>
                      <SelectItem value="S1">S1</SelectItem>
                      <SelectItem value="S2">S2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Previous School & Graduation Year */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="previous_school">Asal Sekolah/PT</Label>
                    <Input
                      id="previous_school"
                      placeholder="Nama sekolah/universitas"
                      value={formData.previous_school}
                      onChange={(e) => handleChange("previous_school", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="graduation_year">Tahun Lulus</Label>
                    <Input
                      id="graduation_year"
                      type="number"
                      placeholder="2024"
                      min="1990"
                      max="2030"
                      value={formData.graduation_year}
                      onChange={(e) => handleChange("graduation_year", e.target.value)}
                    />
                  </div>
                </div>

                {/* Parent Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="parent_name">Nama Orang Tua</Label>
                    <Input
                      id="parent_name"
                      placeholder="Nama orang tua/wali"
                      value={formData.parent_name}
                      onChange={(e) => handleChange("parent_name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parent_phone">Telepon Orang Tua</Label>
                    <Input
                      id="parent_phone"
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                      value={formData.parent_phone}
                      onChange={(e) => handleChange("parent_phone", e.target.value)}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    Alamat Lengkap
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="Masukkan alamat lengkap Anda"
                    rows={3}
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="gold"
                  size="xl"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Mengirim..."
                  ) : (
                    <>
                      Daftar Sekarang
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Dengan mendaftar, Anda menyetujui syarat dan ketentuan yang berlaku.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
