import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AlertTriangle, Home, LogOut } from "lucide-react";

export default function AccessDenied() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);
  const [isSigningOut, setIsSigningOut] = useState(true);

  const fallbackToAuth = useMemo(() => () => {
    // paksa ke auth biar aman (dan gak nyangkut history)
    navigate("/auth", { replace: true });
  }, [navigate]);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        // 1) signout supabase (hapus session server-side)
        await supabase.auth.signOut();

        // 2) bersihin local storage (biar gak ada token nyangkut)
        // aman buat local dev & prod
        localStorage.clear();
      } catch (e) {
        // kalau signOut gagal pun, kita tetap redirect
        console.error("Auto signOut error:", e);
      } finally {
        if (mounted) setIsSigningOut(false);
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    // countdown redirect ke /auth
    const t = setInterval(() => {
      setCountdown((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(t);
          fallbackToAuth();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [fallbackToAuth]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-24 bg-gradient-to-br from-navy via-primary to-navy-light min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
            <Card className="bg-white shadow-elevated">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>

                <CardTitle className="text-2xl">Akses Ditolak</CardTitle>
                <CardDescription>
                  Kamu tidak memiliki izin untuk mengakses halaman ini.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
                  {isSigningOut ? (
                    <div className="flex items-center justify-center gap-2">
                      <LogOut className="w-4 h-4" />
                      Sedang mengeluarkan akun dan membersihkan sesi...
                    </div>
                  ) : (
                    <div className="text-center">
                      Kamu akan diarahkan ke halaman login dalam{" "}
                      <span className="font-semibold text-foreground">{countdown}</span> detik.
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="gold"
                    className="w-full"
                    onClick={() => navigate("/", { replace: true })}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Kembali ke Beranda
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={fallbackToAuth}
                  >
                    Login Admin
                  </Button>
                </div>
              </CardContent>
            </Card>

            <p className="text-center text-xs text-white/80 mt-4">
              Tip: pastikan kamu login memakai email yang diizinkan (mis. domain kampus).
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
