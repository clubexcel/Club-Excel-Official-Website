import {
  ArrowUpRight,
  Briefcase,
  Infinity,
  Layers,
  Network,
  Zap,
} from "lucide-react";
const AboutSections = () => {
  return (
    <>
      {/* NEW SECTION 1: INTRODUCTION */}
      <section
        id="intro"
        className="relative py-32 bg-black border-t border-white/5 overflow-hidden"
      >
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div data-aos="fade-up" className="inline-block mb-6">
            <span className="py-1 px-3 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-[10px] font-mono tracking-widest uppercase">
              NIST's Premier Tech Hub
            </span>
          </div>

          <h2
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tighter text-white mb-8 leading-[1.1]"
          >
            Pioneering the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
              Digital Frontier
            </span>
          </h2>

          <p
            data-aos="fade-up"
            data-aos-delay="200"
            className="text-neutral-400 text-base md:text-lg leading-relaxed font-light max-w-2xl mx-auto"
          >
            Club Excel is the cornerstone of technical innovation at the
            National Institute of Science and Technology. We are a collective of
            visionaries focused on{" "}
            <span className="text-white font-normal">Full Stack</span>,{" "}
            <span className="text-white font-normal">Cloud Computing</span>, and{" "}
            <span className="text-white font-normal">
              Artificial Intelligence
            </span>
            . We don't just write code; we cultivate the skills that forge the
            future.
          </p>
        </div>
      </section>

      {/* NEW SECTION 2: ABOUT (Bento Grid Style) */}
      <section
        id="about"
        className="relative py-24 bg-black border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <h2
              data-aos="fade-right"
              className="text-3xl md:text-5xl font-medium tracking-tighter text-white"
            >
              The Ecosystem
            </h2>
            <p
              data-aos="fade-left"
              className="text-neutral-500 text-sm max-w-xs mt-4 md:mt-0 text-right"
            >
              Where innovation thrives and boundaries are broken.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Feature Card */}
            <div
              data-aos="fade-up"
              className="md:col-span-2 relative p-8 md:p-12 rounded-3xl bg-neutral-900/20 border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="relative z-10 h-full flex flex-col justify-between min-h-[280px]">
                <div>
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/5 mb-6">
                    <Zap className="w-5 h-5 text-yellow-200" />
                  </div>
                  <h3 className="text-2xl font-medium text-white mb-4">
                    Innovation Unleashed
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed max-w-md">
                    Whether you are a coding enthusiast or just beginning your
                    journey, Club Excel provides the platform to hone your
                    technical skills. We collaborate on inventive projects that
                    push the limits of what's possible in tech.
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-8 pt-8 border-t border-white/5">
                  <div className="text-[10px] uppercase tracking-widest text-neutral-500">
                    Domains
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-neutral-300 border border-white/5">
                      Web
                    </span>
                    <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-neutral-300 border border-white/5">
                      App
                    </span>
                    <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-neutral-300 border border-white/5">
                      AI/ML
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Card */}
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              className="relative p-8 rounded-3xl bg-neutral-900/20 border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden group flex flex-col justify-center"
            >
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Infinity className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">
                  Limitless Potential
                </h3>
                <p className="text-neutral-500 text-xs leading-relaxed">
                  Join us in pushing the boundaries. Be part of the future of
                  technology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION 3: WHY CHOOSE US */}
      <section className="relative py-32 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2
              data-aos="fade-up"
              className="text-3xl md:text-4xl font-semibold tracking-tighter text-white mb-6"
            >
              Why Choose Us?
            </h2>
            <p
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-neutral-400 text-sm"
            >
              Joining Club Excel is more than a membership; it's a career
              accelerator.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div
              data-aos="fade-up"
              className="group relative p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-blue-500/50 transition-all duration-500"
            >
              <div className="h-full bg-black rounded-xl p-8 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
                <div className="w-12 h-12 rounded-lg bg-neutral-900 flex items-center justify-center mb-6 border border-white/10 group-hover:border-blue-500/50 transition-colors">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-medium text-white mb-3">
                  Professional Growth
                </h3>
                <p className="text-neutral-500 text-xs leading-relaxed group-hover:text-neutral-400 transition-colors">
                  Gain hands-on experience that bridges the gap between academic
                  theory and industry demands.
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              className="group relative p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-purple-500/50 transition-all duration-500"
            >
              <div className="h-full bg-black rounded-xl p-8 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
                <div className="w-12 h-12 rounded-lg bg-neutral-900 flex items-center justify-center mb-6 border border-white/10 group-hover:border-purple-500/50 transition-colors">
                  <Network className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-medium text-white mb-3">
                  Industry Gateways
                </h3>
                <p className="text-neutral-500 text-xs leading-relaxed group-hover:text-neutral-400 transition-colors">
                  Open doors to exciting opportunities and connect with a
                  network of successful alumni and experts.
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="group relative p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-emerald-500/50 transition-all duration-500"
            >
              <div className="h-full bg-black rounded-xl p-8 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
                <div className="w-12 h-12 rounded-lg bg-neutral-900 flex items-center justify-center mb-6 border border-white/10 group-hover:border-emerald-500/50 transition-colors">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-medium text-white mb-3">
                  Strong Foundation
                </h3>
                <p className="text-neutral-500 text-xs leading-relaxed group-hover:text-neutral-400 transition-colors">
                  Build a robust technical foundation that prepares you for a
                  thriving career in the ever-evolving tech world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutSections;
