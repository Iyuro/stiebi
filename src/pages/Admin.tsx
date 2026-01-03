import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  FileText,
  LogOut,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  GraduationCap,
  Home,
  RefreshCw,
  Sparkles,
  CalendarDays,
  Newspaper,
  ChevronRight,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  School,
  User,
} from "lucide-react";

interface Registration {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  birth_date: string | null;
  birth_place: string | null;
  address: string | null;
  program: string;
  education_level: string | null;
  previous_school: string | null;
  graduation_year: number | null;
  parent_name: string | null;
  parent_phone: string | null;
  status: "pending" | "verified" | "accepted" | "rejected";
  notes: string | null;
  created_at: string;
}

const STATUS_LABEL: Record<Registration["status"], string> = {
  pending: "Menunggu",
  verified: "Terverifikasi",
  accepted: "Diterima",
  rejected: "Ditolak",
};

function formatTanggalID(dateStr: string) {
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

export default function Admin() {
  const { user, isLoading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const isActive = (path: string) => location.pathname.startsWith(path);

  useEffect(() => {
    if (!isLoading && !user) navigate("/auth");
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) fetchRegistrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAdmin]);

  const fetchRegistrations = async () => {
    setLoadingData(true);
    try {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRegistrations((data as Registration[]) || []);
    } catch (error: any) {
      console.error("Error fetching registrations:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data pendaftaran.",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const updateStatus = async (id: string, status: Registration["status"]) => {
    try {
      const { error } = await supabase.from("registrations").update({ status }).eq("id", id);
      if (error) throw error;

      setRegistrations((prev) => prev.map((reg) => (reg.id === id ? { ...reg, status } : reg)));

      toast({
        title: "Status Diperbarui",
        description: `Status pendaftaran berhasil diubah menjadi ${STATUS_LABEL[status]}.`,
      });
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Gagal memperbarui status.",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const s = searchTerm.toLowerCase();
      const matchesSearch =
        reg.full_name.toLowerCase().includes(s) ||
        reg.email.toLowerCase().includes(s) ||
        reg.phone.includes(searchTerm);
      const matchesStatus = statusFilter === "all" || reg.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [registrations, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: registrations.length,
      pending: registrations.filter((r) => r.status === "pending").length,
      verified: registrations.filter((r) => r.status === "verified").length,
      accepted: registrations.filter((r) => r.status === "accepted").length,
      rejected: registrations.filter((r) => r.status === "rejected").length,
    };
  }, [registrations]);

  const getStatusBadge = (status: Registration["status"]) => {
    const config = {
      pending: { label: "Menunggu", variant: "secondary" as const, icon: Clock },
      verified: { label: "Terverifikasi", variant: "default" as const, icon: ShieldCheck },
      accepted: { label: "Diterima", variant: "default" as const, icon: CheckCircle },
      rejected: { label: "Ditolak", variant: "destructive" as const, icon: XCircle },
    };

    const { label, variant, icon: Icon } = config[status];
    return (
      <Badge variant={variant} className="inline-flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Akses Ditolak</h2>
            <p className="text-muted-foreground mb-4">
              Anda tidak memiliki izin untuk mengakses halaman ini.
            </p>
            <Button onClick={() => navigate("/")} variant="outline" className="gap-2">
              <Home className="w-4 h-4" />
              Kembali ke Beranda
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      {/* Premium Header */}
      <header className="sticky top-0 z-50">
        <div className="border-b bg-background/65 backdrop-blur-xl supports-[backdrop-filter]:bg-background/45">
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gold/70 to-transparent" />

          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* Brand */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-gold/30 via-primary/20 to-transparent blur-lg" />
                    <div className="relative rounded-2xl border bg-card/70 p-2 shadow-soft">
                      <GraduationCap className="w-7 h-7 text-gold" />
                    </div>
                  </div>

                  <div className="leading-tight">
                    <div className="flex items-center gap-2">
                      <h1 className="font-display text-lg md:text-xl font-bold tracking-tight text-foreground">
                        Admin Panel
                      </h1>
                      <span className="inline-flex items-center gap-1 rounded-full border bg-gold/10 px-2 py-0.5 text-xs font-semibold text-gold-dark">
                        <Sparkles className="w-3.5 h-3.5" />
                        Premium
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">STIE Bisnis Indonesia</p>
                  </div>
                </div>

                <div className="lg:hidden">
                  <Button variant="outline" size="sm" onClick={() => navigate("/")} className="gap-2">
                    <Home className="w-4 h-4" />
                    Beranda
                  </Button>
                </div>
              </div>

              {/* Nav */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant={isActive("/admin") ? "default" : "outline"}
                  onClick={() => navigate("/admin")}
                  className="gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Registrasi
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </Button>

                <Button
                  variant={isActive("/admin/events") ? "default" : "outline"}
                  onClick={() => navigate("/admin/events")}
                  className="gap-2"
                >
                  <CalendarDays className="w-4 h-4" />
                  Kegiatan & Momen
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </Button>

                <Button
                  variant={isActive("/admin/news") ? "default" : "outline"}
                  onClick={() => navigate("/admin/news")}
                  className="gap-2"
                >
                  <Newspaper className="w-4 h-4" />
                  News
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </Button>

                <div className="hidden lg:flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/")}
                    className="text-foreground hover:bg-muted gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Beranda
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-foreground hover:bg-muted gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>

                <div className="lg:hidden w-full flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-foreground hover:bg-muted gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full border bg-muted/40 px-2 py-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin
              </span>
              <span>/</span>
              <span className="font-medium text-foreground/80">Registrasi</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard label="Total Pendaftar" value={stats.total} icon={Users} />
          <StatCard label="Menunggu" value={stats.pending} icon={Clock} tone="warn" />
          <StatCard label="Terverifikasi" value={stats.verified} icon={ShieldCheck} tone="info" />
          <StatCard label="Diterima" value={stats.accepted} icon={CheckCircle} tone="success" />
          <StatCard label="Ditolak" value={stats.rejected} icon={XCircle} tone="danger" />
        </div>

        {/* Table */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Data Pendaftaran Mahasiswa Baru
              </CardTitle>

              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari nama, email, atau telepon..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full md:w-72"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-52">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="verified">Terverifikasi</SelectItem>
                    <SelectItem value="accepted">Diterima</SelectItem>
                    <SelectItem value="rejected">Ditolak</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={fetchRegistrations} className="gap-2">
                  <RefreshCw className={`w-4 h-4 ${loadingData ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {loadingData ? (
              <div className="flex items-center justify-center py-14">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : filteredRegistrations.length === 0 ? (
              <div className="text-center py-14 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Tidak ada data pendaftaran.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead>Nama</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telepon</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredRegistrations.map((reg) => (
                      <TableRow
                        key={reg.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="font-medium">{reg.full_name}</TableCell>
                        <TableCell className="text-muted-foreground">{reg.email}</TableCell>
                        <TableCell className="text-muted-foreground">{reg.phone}</TableCell>
                        <TableCell>{reg.program}</TableCell>
                        <TableCell>{getStatusBadge(reg.status)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatTanggalID(reg.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => {
                              setSelectedRegistration(reg);
                              setIsDetailOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                            Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Detail Pendaftaran
            </DialogTitle>
            <DialogDescription>
              Informasi lengkap pendaftar mahasiswa baru
            </DialogDescription>
          </DialogHeader>

          {selectedRegistration && (
            <div className="space-y-6">
              {/* Top strip */}
              <div className="rounded-xl border bg-muted/30 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-lg font-semibold">{selectedRegistration.full_name}</div>
                  <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {selectedRegistration.email}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {selectedRegistration.phone}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedRegistration.status)}
                </div>
              </div>

              {/* Grid detail */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow label="Program Studi" value={selectedRegistration.program} icon={School} />
                <InfoRow
                  label="Tanggal Daftar"
                  value={formatTanggalID(selectedRegistration.created_at)}
                  icon={Clock}
                />
                <InfoRow label="Tempat Lahir" value={selectedRegistration.birth_place || "-"} icon={MapPin} />
                <InfoRow
                  label="Tanggal Lahir"
                  value={
                    selectedRegistration.birth_date
                      ? formatTanggalID(selectedRegistration.birth_date)
                      : "-"
                  }
                  icon={CalendarDays}
                />
                <InfoRow label="Pendidikan Terakhir" value={selectedRegistration.education_level || "-"} icon={School} />
                <InfoRow label="Asal Sekolah/PT" value={selectedRegistration.previous_school || "-"} icon={School} />
                <InfoRow label="Tahun Lulus" value={String(selectedRegistration.graduation_year ?? "-")} icon={School} />
                <InfoRow label="Nama Orang Tua" value={selectedRegistration.parent_name || "-"} icon={User} />
                <InfoRow label="Telepon Orang Tua" value={selectedRegistration.parent_phone || "-"} icon={Phone} />
              </div>

              <div className="rounded-xl border p-4">
                <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Alamat
                </div>
                <div className="font-medium">{selectedRegistration.address || "-"}</div>
              </div>

              {/* Actions */}
              <div className="rounded-xl border p-4">
                <div className="text-sm text-muted-foreground mb-3">
                  Ubah Status
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => updateStatus(selectedRegistration.id, "pending")}
                    disabled={selectedRegistration.status === "pending"}
                  >
                    <Clock className="w-4 h-4" />
                    Menunggu
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => updateStatus(selectedRegistration.id, "verified")}
                    disabled={selectedRegistration.status === "verified"}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Verifikasi
                  </Button>

                  <Button
                    variant="default"
                    size="sm"
                    className="gap-2"
                    onClick={() => updateStatus(selectedRegistration.id, "accepted")}
                    disabled={selectedRegistration.status === "accepted"}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Terima
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                    onClick={() => updateStatus(selectedRegistration.id, "rejected")}
                    disabled={selectedRegistration.status === "rejected"}
                  >
                    <XCircle className="w-4 h-4" />
                    Tolak
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ------------------ UI helpers (local) ------------------ */

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: any;
  tone?: "warn" | "success" | "danger" | "info";
}) {
  const toneClass =
    tone === "warn"
      ? "from-yellow-500/15 via-transparent to-transparent"
      : tone === "success"
      ? "from-green-500/15 via-transparent to-transparent"
      : tone === "danger"
      ? "from-red-500/15 via-transparent to-transparent"
      : tone === "info"
      ? "from-sky-500/15 via-transparent to-transparent"
      : "from-primary/15 via-transparent to-transparent";

  const iconBg =
    tone === "warn"
      ? "bg-yellow-500/10 text-yellow-600"
      : tone === "success"
      ? "bg-green-500/10 text-green-600"
      : tone === "danger"
      ? "bg-red-500/10 text-red-600"
      : tone === "info"
      ? "bg-sky-500/10 text-sky-600"
      : "bg-primary/10 text-primary";

  return (
    <Card className="relative overflow-hidden shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elevated">
      <div className={`absolute inset-0 bg-gradient-to-br ${toneClass}`} />
      <CardContent className="relative p-4 flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${iconBg} border border-white/20`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: any;
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <Icon className="w-4 h-4" />
        {label}
      </div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}
