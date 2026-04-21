import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import OccasionGrid from "@/components/OccasionGrid";
import SoulCinema from "@/components/SoulCinema";
import JoinTeamTeaser from "@/components/JoinTeamTeaser";
import GetInTouch from "@/components/GetInTouch";
import AboutTeaser from "@/components/AboutTeaser";
import StatsBar from "@/components/StatsBar";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <main className="relative bg-background text-foreground font-manrope">
      <Navbar />

      <HeroSection />

      <AboutTeaser />

      <StatsBar />

      <OccasionGrid />

      <SoulCinema />

      <Testimonials />

      <JoinTeamTeaser />

      <GetInTouch />

      <Footer />
    </main>
  );
}
