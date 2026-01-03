import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Calendar,
  Tag,
  Megaphone,
  Sparkles,
  Trophy,
  Handshake,
  Newspaper,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type NewsRow = {
  id: string;
  title: string;
  excerpt: string | null;
  category: string;
  image_url: string | null;
  published_at: string | null;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=800&fit=crop";

function formatTanggalID(dateStr: string) {
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

function getCategoryIcon(category: string) {
  const c = (category || "").toLowerCase();
  if (c.includes("pengumuman")) return Megaphone;
  if (c.includes("event")) return Sparkles;
  if (c.includes("prestasi")) return Trophy;
  if (c.includes("kerjasama") || c.includes("kerja sama")) return Handshake;
  return Newspaper;
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border bg-card overflow-hidden animate-pulse">
      <div className="h-44 bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="h-6 w-3/4 bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-2/3 bg-muted rounded" />
        <div className="h-9 w-32 bg-muted rounded mt-2" />
      </div>
    </div>
  );
}

export const NewsSection = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [newsItems, setNewsItems] = useState<NewsRow[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErrorMsg("");

      const { data, error } = await supabase
        .from("news")
        .select("id,title,excerpt,category,image_url,published_at,is_featured,is_published,created_at")
        .eq("is_published", true)
        .order("is_featured", { ascending: false })
        .order("published_at", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        setErrorMsg(error.message);
        setNewsItems([]);
      } else {
        setNewsItems((data as NewsRow[]) || []);
      }

      setLoading(false);
    })();
  }, []);

  const featuredNews = useMemo(
    () => newsItems.find((n) => n.is_featured) || null,
    [newsItems]
  );

  const otherNews = useMemo(
    () => newsItems.filter((n) => !n.is_featured).slice(0, 6),
    [newsItems]
  );

  return (
    <section id="berita" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
              <Newspaper className="w-4 h-4" />
              Berita & Informasi
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Kabar Terbaru dari <span className="text-gradient-gold">Kampus</span>
            </h2>
            <p className="text-muted-foreground mt-3 leading-relaxed">
              Update terbaru seputar pengumuman, event, prestasi, hingga kolaborasi kampus — semua
              dirangkum biar gampang dibaca.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/news")}>
              Lihat Semua
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* States */}
        {loading ? (
          <div className="grid lg:grid-cols-2 gap-8">
            <SkeletonCard />
            <div className="space-y-6">
              <div className="rounded-xl border bg-card p-4 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-40 h-28 bg-muted rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-28 bg-muted rounded" />
                    <div className="h-5 w-3/4 bg-muted rounded" />
                    <div className="h-4 w-full bg-muted rounded" />
                  </div>
                </div>
              </div>
              <div className="rounded-xl border bg-card p-4 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-40 h-28 bg-muted rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-5 w-2/3 bg-muted rounded" />
                    <div className="h-4 w-full bg-muted rounded" />
                  </div>
                </div>
              </div>
              <div className="rounded-xl border bg-card p-4 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-40 h-28 bg-muted rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-20 bg-muted rounded" />
                    <div className="h-5 w-3/5 bg-muted rounded" />
                    <div className="h-4 w-full bg-muted rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : errorMsg ? (
          <div className="text-center py-14 rounded-xl border bg-card">
            <div className="text-red-500 font-semibold">Gagal memuat berita</div>
            <div className="text-muted-foreground mt-2">{errorMsg}</div>
            <Button className="mt-6" variant="outline" onClick={() => window.location.reload()}>
              Coba Lagi
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        ) : newsItems.length === 0 ? (
          <div className="text-center py-14 rounded-xl border bg-card">
            <div className="font-semibold text-foreground">Belum ada berita.</div>
            <div className="text-muted-foreground mt-2">
              Admin belum publish konten. Nanti kalau sudah publish, otomatis tampil di sini.
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Featured */}
            {featuredNews && (
              <Card
                variant="gold"
                className="group overflow-hidden hover:shadow-elevated transition-all duration-300"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={featuredNews.image_url || FALLBACK_IMAGE}
                    alt={featuredNews.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />

                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-gold text-navy text-xs font-semibold inline-flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Berita Utama
                    </span>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatTanggalID(featuredNews.published_at || featuredNews.created_at)}
                    </span>

                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {featuredNews.category}
                    </span>
                  </div>

                  <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {featuredNews.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed line-clamp-3">
                    {featuredNews.excerpt || ""}
                  </p>

                  <div className="mt-5 flex items-center gap-3">
                    <Button
                      variant="gold"
                      onClick={() => navigate(`/news/${featuredNews.id}`)}
                      className="gap-2"
                    >
                      Baca Selengkapnya
                      <ArrowRight className="w-4 h-4" />
                    </Button>

                    <Button variant="outline" onClick={() => navigate("/news")}>
                      Semua Berita
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Other news */}
            <div className="space-y-6">
              {otherNews.map((news) => {
                const Icon = getCategoryIcon(news.category);
                return (
                  <Card
                    key={news.id}
                    variant="elevated"
                    className="group overflow-hidden cursor-pointer hover:shadow-elevated transition-all duration-300"
                    onClick={() => navigate(`/news/${news.id}`)}
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative w-full sm:w-44 h-44 sm:h-auto flex-shrink-0 overflow-hidden">
                        <img
                          src={news.image_url || FALLBACK_IMAGE}
                          alt={news.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* category icon badge */}
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 text-foreground text-xs font-semibold">
                            <Icon className="w-3.5 h-3.5" />
                            {news.category}
                          </span>
                        </div>
                      </div>

                      <CardContent className="p-4 flex flex-col justify-center">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatTanggalID(news.published_at || news.created_at)}
                          </span>
                        </div>

                        <h4 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {news.title}
                        </h4>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {news.excerpt || ""}
                        </p>

                        <div className="mt-3 inline-flex items-center gap-2 text-sm text-primary font-semibold">
                          Baca
                          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
