import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

import Index from "./pages/Index";
import ProgramDetail from "./pages/ProgramDetail";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import AdminEvents from "./pages/AdminEvents";
import AdminNews from "./pages/AdminNews";
import NewsDetail from "./pages/NewsDetail";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/program/:slug" element={<ProgramDetail />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            {/* Auth */}
            <Route path="/auth" element={<Auth />} />

            {/* Admin */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/news" element={<AdminNews />} />
            <Route path="/admin/events" element={<AdminEvents />} />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
