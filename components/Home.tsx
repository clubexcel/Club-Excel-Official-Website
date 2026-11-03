"use client";
import HeroSection from "@/features/home/components/HeroSection";
import Portal from "@/features/home/components/Portal";
import Domains from "@/features/home/components/Domains";
import AboutSections from "@/features/home/components/AboutSections";

const Home = () => {
  return (
    <div className="bg-black">
      {/* Hero Section with Scoped Background Effects */}
      <HeroSection />

      {/* Scroll-Driven Portal Section */}
      <Portal />

      {/* 3D Tilt Services / Domains */}
      <Domains />

      {/* About Sections */}
      <AboutSections />
    </div>
  );
};

export default Home;
