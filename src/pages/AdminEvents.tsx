import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  Image as ImageIcon,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";

type EventRow = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string | null;
  event_date: string | null;
  is_published: boolean;
  created_at: string;
};

const CATEGORIES = ["Seminar", "Wisuda", "Workshop", "Kegiatan Mahasiswa"] as const;

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=800&fit=crop";

function slugFileName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function formatTanggalID(dateStr: string) {
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

function classNames(...arr: Array<string | false | undefined | null>) {
  return arr.filter(Boolean).join(" ");
}

export default function AdminEvents() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<EventRow[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Seminar");
  const [eventDate, setEventDate] = useState<string>("");
  const [isPublished, setIsPublished] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  // ui states
  const [query, setQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title_asc" | "title_desc">("newest");

  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  const imagePreview = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    if (imageUrl) return imageUrl;
    return "";
  }, [imageFile, imageUrl]);

  // cleanup object URL
  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  // Guard: login + role admin/staff
  useEffect(() => {
    (async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;
      if (!user) return navigate("/auth");

      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return navigate("/");
      }

      const roleList = (roles ?? []).map((r: any) => r.role);
      const allowed = roleList.includes("admin") || roleList.includes("staff");
      if (!allowed) navigate("/");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  async function fetchEvents() {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setRows((data as EventRow[]) || []);
  }

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setCategory("Seminar");
    setEventDate("");
    setIsPublished(true);
    setImageFile(null);
    setImageUrl("");
  }

  function fillForm(row: EventRow) {
    setEditingId(row.id);
    setTitle(row.title);
    setDescription(row.description ?? "");
    setCategory(row.category as any);
    setEventDate(row.event_date ?? "");
    setIsPublished(row.is_published);
    setImageUrl(row.image_url ?? "");
    setImageFile(null);

    toast({
      title: "Mode Edit",
      description: `Mengedit: ${row.title}`,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadImageIfNeeded(): Promise<string | null> {
    if (!imageFile) return imageUrl ? imageUrl : null;

    const ext = imageFile.name.split(".").pop() || "jpg";
    const filePath = `events/${Date.now()}-${slugFileName(title || "event")}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("events")
      .upload(filePath, imageFile, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("events").getPublicUrl(filePath);
    return data.publicUrl;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      toast({ title: "Oops", description: "Judul wajib diisi.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const finalImageUrl = await uploadImageIfNeeded();

      if (!isEditing) {
        const { error } = await supabase.from("events").insert({
          title: title.trim(),
          description: description.trim() || null,
          category,
          image_url: finalImageUrl,
          event_date: eventDate || null,
          is_published: isPublished,
        });
        if (error) throw error;

        toast({
          title: "Sukses ✨",
          description: "Event berhasil ditambahkan.",
        });
      } else {
        const { error } = await supabase
          .from("events")
          .update({
            title: title.trim(),
            description: description.trim() || null,
            category,
            image_url: finalImageUrl,
            event_date: eventDate || null,
            is_published: isPublished,
          })
          .eq("id", editingId);

        if (error) throw error;

        toast({
          title: "Sukses ✅",
          description: "Event berhasil diupdate.",
        });
      }

      resetForm();
      await fetchEvents();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err?.message || "Gagal menyimpan data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id: string) {
    const ok = confirm("Yakin hapus event ini?");
    if (!ok) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;

      toast({ title: "Deleted", description: "Event berhasil dihapus." });
      await fetchEvents();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Gagal menghapus data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function togglePublish(row: EventRow) {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("events")
        .update({ is_published: !row.is_published })
        .eq("id", row.id);

      if (error) throw error;

      toast({
        title: "Updated",
        description: row.is_published ? "Event di-unpublish." : "Event dipublish.",
      });

      await fetchEvents();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Gagal update publish.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const filteredRows = useMemo(() => {
    const q = query.toLowerCase().trim();

    let result = [...rows];

    if (q) {
      result = result.filter((r) => {
        const hay = `${r.title} ${(r.description ?? "")} ${r.category}`.toLowerCase();
        return hay.includes(q);
      });
    }

    if (filterCategory !== "all") {
      result = result.filter((r) => r.category === filterCategory);
    }

    if (filterStatus !== "all") {
      result = result.filter((r) => (filterStatus === "published" ? r.is_published : !r.is_published));
    }

    switch (sortBy) {
      case "oldest":
        result.sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
        break;
      case "title_asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title_desc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        result.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
        break;
    }

    return result;
  }, [rows, query, filterCategory, filterStatus, sortBy]);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-sm text-muted-foreground shadow-sm">
            <Sparkles className="w-4 h-4 text-gold" />
            Admin Panel — Konten Galeri
          </div>
          <h1 className="mt-3 font-display text-2xl md:text-3xl font-bold text-foreground">
            Kegiatan & Momen <span className="text-gradient-gold">Berkesan</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Tambah, edit, publish/unpublish, dan atur event kampus dengan rapi.
          </p>
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <Button variant="outline" onClick={resetForm} disabled={loading}>
              <X className="w-4 h-4" />
              Batal Edit
            </Button>
          ) : null}
          <Button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} disabled={loading}>
            <Plus className="w-4 h-4" />
            Tambah Event
          </Button>
        </div>
      </div>

      {/* Form */}
      <Card className="overflow-hidden border bg-card shadow-elevated">
        <CardHeader className="border-b bg-gradient-to-r from-navy/5 via-primary/5 to-gold/10">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-primary" />
              {isEditing ? "Update Event" : "Tambah Event Baru"}
            </span>

            <span
              className={classNames(
                "text-xs px-2 py-1 rounded-full border",
                isPublished ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" : "bg-amber-500/10 text-amber-700 border-amber-500/20"
              )}
            >
              {isPublished ? "Published" : "Draft"}
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-5 md:p-6">
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-muted-foreground" />
                Judul
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Wisuda Periode 2024"
                className="transition-all focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                Kategori
              </Label>
              <select
                className="w-full h-10 rounded-md border px-3 bg-background transition-all focus:ring-2 focus:ring-primary/30"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-muted-foreground" />
                Deskripsi
              </Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi singkat event..."
                className="transition-all focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                Tanggal (optional)
              </Label>
              <Input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="transition-all focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                {isPublished ? <Eye className="w-4 h-4 text-muted-foreground" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                Status
              </Label>
              <select
                className="w-full h-10 rounded-md border px-3 bg-background transition-all focus:ring-2 focus:ring-primary/30"
                value={isPublished ? "published" : "draft"}
                onChange={(e) => setIsPublished(e.target.value === "published")}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                Gambar
              </Label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  />
                  {imageUrl ? (
                    <div className="mt-2 text-xs text-muted-foreground break-all">
                      Current URL: {imageUrl}
                    </div>
                  ) : null}
                </div>

                <div className="relative overflow-hidden rounded-xl border bg-muted/30 h-[220px] md:h-[260px]">
  <img
    src={imagePreview || FALLBACK_IMAGE}
    alt="Preview"
    className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-[1.03]"
    loading="lazy"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-navy/35 via-transparent to-transparent" />
  <div className="absolute bottom-2 left-2 text-xs text-white/90 bg-black/30 px-2 py-1 rounded-full">
    Preview
  </div>
</div>

              </div>
            </div>

            <div className="flex gap-2 md:col-span-2">
              <Button type="submit" disabled={loading} className="min-w-[160px]">
                {loading ? "Memproses..." : isEditing ? (
                  <>
                    <Pencil className="w-4 h-4" />
                    Update Event
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Tambah Event
                  </>
                )}
              </Button>

              {isEditing ? (
                <Button type="button" variant="outline" onClick={resetForm} disabled={loading}>
                  <X className="w-4 h-4" />
                  Batal
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Toolbar */}
      <Card className="border bg-card shadow-soft">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full sm:w-[320px]">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari judul / deskripsi / kategori..."
                className="pl-9"
              />
            </div>

            <select
              className="h-10 rounded-md border px-3 bg-background"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">Semua Kategori</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              className="h-10 rounded-md border px-3 bg-background"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
            >
              <option value="all">Semua Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => fetchEvents()} disabled={loading}>
              Refresh
            </Button>

            <div className="flex items-center gap-2 rounded-md border px-3 h-10 bg-background">
              <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
              <select
                className="bg-transparent outline-none text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="title_asc">Judul A-Z</option>
                <option value="title_desc">Judul Z-A</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* List */}
      <Card className="border bg-card shadow-elevated overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center justify-between">
            <span>Daftar Event</span>
            <span className="text-sm text-muted-foreground">
              {filteredRows.length} item
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 md:p-6 space-y-3">
          {filteredRows.length === 0 ? (
            <div className="text-muted-foreground py-6 text-center">
              Belum ada data yang cocok.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRows.map((r) => (
                <div
                  key={r.id}
                  className="group p-4 border rounded-xl flex flex-col md:flex-row md:items-center gap-4 justify-between bg-background hover:shadow-soft transition-all"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="relative w-24 h-16 rounded-lg overflow-hidden border bg-muted/30 flex-shrink-0">
                      <img
                        src={r.image_url || FALLBACK_IMAGE}
                        alt={r.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="font-semibold truncate">{r.title}</div>

                        <span
                          className={classNames(
                            "text-xs px-2 py-0.5 rounded-full border",
                            r.is_published
                              ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-700 border-amber-500/20"
                          )}
                        >
                          {r.is_published ? "Published" : "Draft"}
                        </span>

                        <span className="text-xs px-2 py-0.5 rounded-full border bg-muted/50 text-muted-foreground">
                          {r.category}
                        </span>
                      </div>

                      <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {r.description || "—"}
                      </div>

                      <div className="text-xs text-muted-foreground mt-2 flex flex-wrap gap-3">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {r.event_date ? formatTanggalID(r.event_date) : "Tanpa tanggal"}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          Dibuat: {formatTanggalID(r.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 md:justify-end">
                    <Button type="button" variant="outline" onClick={() => fillForm(r)} disabled={loading}>
                      <Pencil className="w-4 h-4" />
                      Edit
                    </Button>

                    <Button type="button" variant="outline" onClick={() => togglePublish(r)} disabled={loading}>
                      {r.is_published ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          Publish
                        </>
                      )}
                    </Button>

                    <Button type="button" variant="destructive" onClick={() => onDelete(r.id)} disabled={loading}>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer hint */}
      <div className="text-center text-xs text-muted-foreground pb-6">
        Tip: pakai <span className="font-semibold">Published</span> untuk tampil di halaman galeri publik.
      </div>
    </div>
  );
}
