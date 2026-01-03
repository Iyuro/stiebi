import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

type NewsDetailRow = {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  category: string;
  image_url: string | null;
  published_at: string | null;
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

export default function NewsDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [row, setRow] = useState<NewsDetailRow | null>(null);

  useEffect(() => {
    (async () => {
      if (!id) {
        setErrorMsg("ID berita tidak ditemukan.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMsg("");

      const { data, error } = await supabase
        .from("news")
        .select("id,title,excerpt,content,category,image_url,published_at,created_at")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        setErrorMsg(error.message);
        setRow(null);
      } else if (!data) {
        setErrorMsg("Berita tidak ditemukan atau belum dipublish.");
        setRow(null);
      } else {
        setRow(data as NewsDetailRow);
      }

      setLoading(false);
    })();
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between gap-3 mb-6">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
        </div>

        {loading ? (
          <div className="rounded-xl border bg-card p-6 text-muted-foreground">
            Loading detail berita...
          </div>
        ) : errorMsg ? (
          <div className="rounded-xl border bg-card p-6">
            <div className="font-semibold text-red-500">Gagal</div>
            <div className="text-muted-foreground mt-2">{errorMsg}</div>
          </div>
        ) : !row ? null : (
          <Card className="overflow-hidden">
            <div className="relative aspect-[16/7] overflow-hidden">
              <img
                src={row.image_url || FALLBACK_IMAGE}
                alt={row.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
            </div>

            <CardContent className="p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatTanggalID(row.published_at || row.created_at)}
                </span>
                <span className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  {row.category}
                </span>
              </div>

              <h1 className="font-display text-2xl md:text-4xl font-bold text-foreground">
                {row.title}
              </h1>

              {row.excerpt ? (
                <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
                  {row.excerpt}
                </p>
              ) : null}

              <div className="mt-8 prose prose-neutral max-w-none">
                {/* kalau content kosong, tetap tampilkan fallback */}
                {row.content?.trim()
                  ? row.content
                      .split("\n")
                      .filter(Boolean)
                      .map((p, idx) => <p key={idx}>{p}</p>)
                  : <p>Konten lengkap belum diisi oleh admin.</p>}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
