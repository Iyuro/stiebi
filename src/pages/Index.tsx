import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ProgramsSection } from "@/components/ProgramsSection";
import { GallerySection } from "@/components/GallerySection";
import { NewsSection } from "@/components/NewsSection";
import { RegistrationSection } from "@/components/RegistrationSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ProgramsSection />
        <GallerySection />
        <NewsSection />
        <RegistrationSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
