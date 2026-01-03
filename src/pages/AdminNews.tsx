import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowRight,
  Calendar,
  Crown,
  Eye,
  EyeOff,
  FileText,
  Image as ImageIcon,
  Search,
  Sparkles,
  Star,
  Tag,
  Trash2,
  PencilLine,
  XCircle,
} from "lucide-react";

type NewsRow = {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  category: string;
  image_url: string | null;
  published_at: string | null;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
};

const CATEGORIES = ["Pengumuman", "Event", "Prestasi", "Kerjasama"] as const;

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

export default function AdminNews() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<NewsRow[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Pengumuman");
  const [publishedAt, setPublishedAt] = useState<string>("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  // UI helpers
  const [q, setQ] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");

  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  const imagePreview = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    if (imageUrl) return imageUrl;
    return "";
  }, [imageFile, imageUrl]);

  useEffect(() => {
    return () => {
      if (imageFile && imagePreview) URL.revokeObjectURL(imagePreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFile]);

  // guard admin/staff
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

  async function fetchNews() {
    setLoading(true);
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false });

    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setRows((data as NewsRow[]) || []);
  }

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setExcerpt("");
    setContent("");
    setCategory("Pengumuman");
    setPublishedAt("");
    setIsFeatured(false);
    setIsPublished(true);
    setImageFile(null);
    setImageUrl("");
  }

  function fillForm(row: NewsRow) {
    setEditingId(row.id);
    setTitle(row.title);
    setExcerpt(row.excerpt ?? "");
    setContent(row.content ?? "");
    setCategory(row.category as any);
    setPublishedAt(row.published_at ? row.published_at.slice(0, 10) : "");
    setIsFeatured(row.is_featured);
    setIsPublished(row.is_published);
    setImageUrl(row.image_url ?? "");
    setImageFile(null);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadImageIfNeeded(): Promise<string | null> {
    if (!imageFile) return imageUrl ? imageUrl : null;

    const ext = imageFile.name.split(".").pop() || "jpg";
    const filePath = `news/${Date.now()}-${slugFileName(title || "news")}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("news")
      .upload(filePath, imageFile, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("news").getPublicUrl(filePath);
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

      // featured single source of truth (opsional)
      if (isFeatured) {
        await supabase
          .from("news")
          .update({ is_featured: false })
          .neq("id", editingId ?? "00000000-0000-0000-0000-000000000000");
      }

      if (!isEditing) {
        const { error } = await supabase.from("news").insert({
          title: title.trim(),
          excerpt: excerpt.trim() || null,
          content: content.trim() || null,
          category,
          image_url: finalImageUrl,
          published_at: publishedAt || null,
          is_featured: isFeatured,
          is_published: isPublished,
        });
        if (error) throw error;

        toast({ title: "Sukses", description: "Berita berhasil ditambahkan." });
      } else {
        const { error } = await supabase
          .from("news")
          .update({
            title: title.trim(),
            excerpt: excerpt.trim() || null,
            content: content.trim() || null,
            category,
            image_url: finalImageUrl,
            published_at: publishedAt || null,
            is_featured: isFeatured,
            is_published: isPublished,
          })
          .eq("id", editingId);

        if (error) throw error;

        toast({ title: "Sukses", description: "Berita berhasil diupdate." });
      }

      resetForm();
      await fetchNews();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Gagal menyimpan berita.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id: string) {
    const ok = confirm("Yakin hapus berita ini?");
    if (!ok) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("news").delete().eq("id", id);
      if (error) throw error;

      toast({ title: "Deleted", description: "Berita berhasil dihapus." });
      await fetchNews();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Gagal menghapus berita.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function togglePublish(row: NewsRow) {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("news")
        .update({ is_published: !row.is_published })
        .eq("id", row.id);

      if (error) throw error;
      await fetchNews();
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
    const query = q.trim().toLowerCase();

    return rows
      .filter((r) => {
        if (filterCategory !== "all" && r.category !== filterCategory) return false;
        if (filterStatus === "published" && !r.is_published) return false;
        if (filterStatus === "draft" && r.is_published) return false;

        if (!query) return true;

        const hay = `${r.title} ${r.excerpt ?? ""} ${r.content ?? ""}`.toLowerCase();
        return hay.includes(query);
      })
      .sort((a, b) => {
        // pinned featured on top
        if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
        const ad = a.published_at || a.created_at;
        const bd = b.published_at || b.created_at;
        return new Date(bd).getTime() - new Date(ad).getTime();
      });
  }, [rows, q, filterCategory, filterStatus]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Form */}
      <Card className="border shadow-soft overflow-hidden">
        <CardHeader className="bg-muted/30">
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-gold" />
            {isEditing ? "Edit Berita" : "Tambah Berita Baru"}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                Judul
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul berita..."
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                Kategori
              </Label>
              <select
                className="w-full h-10 rounded-md border px-3 bg-background"
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

            {/* Published date */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                Tanggal Publish
              </Label>
              <Input
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
              />
            </div>

            {/* Excerpt */}
            <div className="space-y-2 md:col-span-2">
              <Label>Excerpt</Label>
              <Input
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Ringkasan berita..."
              />
            </div>

            {/* Content */}
            <div className="space-y-2 md:col-span-2">
              <Label>Content (optional)</Label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Isi lengkap berita..."
                className="min-h-[140px] w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Image Upload + Preview */}
            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                Gambar
              </Label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  />

                  {imageUrl ? (
                    <div className="text-xs text-muted-foreground break-all">
                      Current URL: {imageUrl}
                    </div>
                  ) : null}

                  {(imageFile || imageUrl) ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-2"
                      onClick={() => {
                        setImageFile(null);
                        setImageUrl("");
                      }}
                      disabled={loading}
                    >
                      <XCircle className="w-4 h-4" />
                      Hapus Gambar
                    </Button>
                  ) : null}
                </div>

                {/* Preview size fix (lebih tinggi & premium) */}
                <div className="relative overflow-hidden rounded-xl border bg-muted/20 h-[220px] md:h-[260px]">
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

            {/* Toggles */}
            <div className="flex flex-wrap gap-3 md:col-span-2">
              <label className="flex items-center gap-2 text-sm bg-muted/30 border rounded-full px-4 py-2">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                <span className="inline-flex items-center gap-2">
                  <Star className="w-4 h-4 text-gold" />
                  Jadikan Berita Utama
                </span>
              </label>

              <label className="flex items-center gap-2 text-sm bg-muted/30 border rounded-full px-4 py-2">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                />
                <span className="inline-flex items-center gap-2">
                  {isPublished ? (
                    <>
                      <Eye className="w-4 h-4 text-emerald-600" />
                      Published
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                      Draft
                    </>
                  )}
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 md:col-span-2">
              <Button type="submit" variant="gold" disabled={loading} className="gap-2">
                {loading ? "Memproses..." : isEditing ? "Update Berita" : "Tambah Berita"}
                <ArrowRight className="w-4 h-4" />
              </Button>

              {isEditing ? (
                <Button type="button" variant="outline" onClick={resetForm} disabled={loading} className="gap-2">
                  Batal
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* List */}
      <Card className="border shadow-soft overflow-hidden">
        <CardHeader className="bg-muted/30">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Daftar Berita
            </CardTitle>

            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Cari judul/isi..."
                  className="pl-9 w-full sm:w-[260px]"
                />
              </div>

              <select
                className="h-10 rounded-md border px-3 bg-background"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">Semua Kategori</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
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
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {filteredRows.length === 0 ? (
            <div className="text-muted-foreground">Belum ada data / tidak ada yang cocok dengan filter.</div>
          ) : (
            <div className="space-y-3">
              {filteredRows.map((r) => {
                const dateText = formatTanggalID(r.published_at || r.created_at);
                return (
                  <div
                    key={r.id}
                    className="p-4 border rounded-xl flex flex-col md:flex-row md:items-center gap-4 justify-between hover:shadow-soft transition-shadow"
                  >
                    <div className="min-w-0 flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-muted/40 border flex items-center justify-center">
                        {r.is_featured ? (
                          <Star className="w-5 h-5 text-gold" />
                        ) : (
                          <FileText className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="font-semibold truncate max-w-[520px]">
                            {r.title}
                          </div>

                          {r.is_featured ? (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-gold/15 text-gold-dark border border-gold/25">
                              Berita Utama
                            </span>
                          ) : null}

                          {r.is_published ? (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                              Published
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground border">
                              Draft
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1">
                            <Tag className="w-4 h-4" />
                            {r.category}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {dateText}
                          </span>
                        </div>

                        {r.excerpt ? (
                          <div className="text-sm text-muted-foreground mt-2 line-clamp-2 max-w-3xl">
                            {r.excerpt}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2"
                        onClick={() => fillForm(r)}
                        disabled={loading}
                      >
                        <PencilLine className="w-4 h-4" />
                        Edit
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2"
                        onClick={() => togglePublish(r)}
                        disabled={loading}
                      >
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

                      <Button
                        type="button"
                        variant="destructive"
                        className="gap-2"
                        onClick={() => onDelete(r.id)}
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
