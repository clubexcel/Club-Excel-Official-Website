import { ArrowDown, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRecruitmentStatus } from "@/hooks/useRecruitments";

const HeroSection = () => {
  const { status: recruitmentStatus } = useRecruitmentStatus();
  const isRecruitmentOpen = recruitmentStatus?.isOpen ?? false;

  return (
    <>
      <section
        id="hero"
        className="relative min-h-[110vh] flex flex-col justify-center items-center pt-20 overflow-hidden"
      >
        {/* Background Video Container */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Hero Background Video */}
          <div className="absolute inset-0 w-full h-full">
            <video
              src="https://res.cloudinary.com/dxekdqdu9/video/upload/v1771253789/Make_a_loop_202602162022_phra5_bs0rat.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-60"
            />
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black"></div>
          </div>

          {/* Bottom fade for smooth transition to all black sections */}
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto space-y-8">
          <div
            data-aos="fade-down"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm text-[10px] tracking-widest text-neutral-400 uppercase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            NIST's Premier Tech Community
          </div>

          <h1
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-neutral-500 leading-[0.9] lg:leading-[0.85] hover-trigger cursor-default drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            UNITED AS
            <br />
            EXCELITES
          </h1>

          <p
            data-aos="fade-up"
            data-aos-delay="200"
            className="max-w-xl mx-auto text-neutral-400 text-sm md:text-base font-light leading-relaxed"
          >
            Club Excel is the architect of the future. We merge code,
            creativity, and chaos to forge the next generation of technologists.
          </p>

          <div
            data-aos="fade-up"
            data-aos-delay="300"
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            <a
              href="#intro"
              className="group relative px-8 py-4 bg-white text-black text-xs font-semibold rounded-full overflow-hidden transition-all hover:scale-105 hover-trigger"
            >
              <span className="relative z-10 flex items-center gap-2">
                Discover More <ArrowDown className="w-3 h-3" />
              </span>
            </a>
            {isRecruitmentOpen && (
              <Link
                href="/recruitment"
                className="group relative px-8 py-4 bg-transparent border border-white/20 text-white text-xs font-semibold rounded-full overflow-hidden transition-all hover:scale-105 hover:border-white/40 hover-trigger"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Join Now <ArrowUpRight className="w-3 h-3" />
                </span>
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
