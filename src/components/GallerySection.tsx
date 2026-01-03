import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, ZoomIn, Calendar, Users, Award, BookOpen } from "lucide-react";

const categories = [
  { id: "all", label: "Semua" },
  { id: "seminar", label: "Seminar", icon: BookOpen },
  { id: "wisuda", label: "Wisuda", icon: Award },
  { id: "workshop", label: "Workshop", icon: Users },
  { id: "mahasiswa", label: "Kegiatan Mahasiswa", icon: Calendar },
];

// mapping tab -> value di DB
const tabToDbCategory: Record<string, string | null> = {
  all: null,
  seminar: "Seminar",
  wisuda: "Wisuda",
  workshop: "Workshop",
  mahasiswa: "Kegiatan Mahasiswa",
};

// mapping value DB -> tab id (buat label display)
const dbCategoryToTab: Record<string, string> = {
  Seminar: "seminar",
  Wisuda: "wisuda",
  Workshop: "workshop",
  "Kegiatan Mahasiswa": "mahasiswa",
};

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

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=800&fit=crop";

export const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<EventRow | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErrorMsg("");

      // fetch published events (public page)
      const { data, error } = await supabase
        .from("events")
        .select("id,title,description,category,image_url,event_date,is_published,created_at")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) {
        setErrorMsg(error.message);
        setEvents([]);
      } else {
        setEvents((data as EventRow[]) || []);
      }

      setLoading(false);
    })();
  }, []);

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return events;

    const dbCat = tabToDbCategory[activeCategory];
    if (!dbCat) return events;

    return events.filter((e) => e.category === dbCat);
  }, [activeCategory, events]);

  return (
    <section id="galeri" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 text-gold-dark font-semibold text-sm mb-4">
            Galeri Kampus
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Kegiatan & Momen <span className="text-primary">Berkesan</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Dokumentasi berbagai kegiatan akademik dan kemahasiswaan di STIE Bisnis Indonesia.
          </p>
        </div>

        {/* Category Tabs */}
        <Tabs defaultValue="all" className="mb-12" onValueChange={setActiveCategory}>
          <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent h-auto p-0">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="px-5 py-2.5 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-card shadow-soft text-muted-foreground transition-all"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* States */}
        {loading ? (
          <div className="text-center text-muted-foreground py-10">Loading galeri...</div>
        ) : errorMsg ? (
          <div className="text-center text-red-500 py-10">
            Gagal memuat data: {errorMsg}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            Belum ada event untuk kategori ini.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => {
              const tabId = dbCategoryToTab[item.category] ?? "all";
              const label = categories.find((c) => c.id === tabId)?.label ?? item.category;

              return (
                <Card
                  key={item.id}
                  variant="elevated"
                  className="group overflow-hidden cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedImage(item)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image_url || FALLBACK_IMAGE}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="p-3 rounded-full bg-gold text-navy">
                        <ZoomIn className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <span className="text-xs text-gold font-semibold uppercase tracking-wider">
                      {label}
                    </span>
                    <h4 className="font-display text-lg font-semibold text-foreground mt-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.description || ""}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/95 backdrop-blur-md animate-fade-in"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-w-4xl w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
              <img
                src={selectedImage.image_url || FALLBACK_IMAGE}
                alt={selectedImage.title}
                className="w-full rounded-xl shadow-elevated"
              />
              <div className="mt-4 text-center">
                <h4 className="font-display text-2xl font-bold text-white">
                  {selectedImage.title}
                </h4>
                <p className="text-white/70 mt-1">{selectedImage.description || ""}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
