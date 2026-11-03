import { CornerRightDown, Terminal } from "lucide-react";
import React from "react";

const Portal = () => {
  return (
    <>
      <section
        id="portal"
        className="relative py-32 bg-black border-t border-white/5 overflow-hidden"
      >
        <div className="bg-grid-small absolute inset-0 z-0"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20">
            <div data-aos="fade-right">
              <h2 className="text-4xl md:text-6xl font-medium tracking-tighter text-white mb-4">
                The Portal
              </h2>
              <p className="text-neutral-500 text-sm max-w-sm">
                Step into a world where lines of code translate into tangible
                impact.
              </p>
            </div>
            <div className="hidden md:block">
              <CornerRightDown className="w-12 h-12 text-neutral-700 animate-bounce" />
            </div>
          </div>

          {/* The "Portal" Window */}
          <div className="portal-container rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-md p-3 shadow-[0_0_50px_-12px_rgba(59,130,246,0.15)]">
            <div className="portal-window relative aspect-auto sm:aspect-video bg-[#050505] rounded-xl overflow-hidden group border border-white/5">
              {/* Fake UI Top Bar */}
              <div className="absolute top-0 left-0 right-0 h-9 bg-neutral-900/90 border-b border-white/5 flex items-center px-4 gap-2 z-20">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50 hover:bg-red-500 transition-colors"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50 hover:bg-yellow-500 transition-colors"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50 hover:bg-green-500 transition-colors"></div>
                </div>
                <div className="mx-auto text-[10px] text-neutral-500 font-mono tracking-widest flex items-center gap-2">
                  <Terminal className="w-3 h-3" /> club_excel_core.sys
                </div>
              </div>

              {/* Content */}
              <>
                {/* Desktop  */}
                <div className="absolute inset-0 pt-9 hidden md:flex items-center justify-center">
                  <div className="grid grid-cols-2 w-full h-full">
                    {/* Terminal Side */}
                    <div className="border-r border-white/5 p-10 flex flex-col justify-center bg-black/40">
                      <div className="font-mono text-xs text-blue-400 mb-4 tracking-wide">
                        &gt; initiating_sequence...
                      </div>

                      <div className="font-mono text-xs text-neutral-400 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-600">[00:01]</span>
                          Loading modules...
                        </div>

                        <div className="flex items-center gap-2 text-green-400/80">
                          <span className="text-neutral-600">[00:02]</span>
                          [OK] Full Stack Development
                        </div>

                        <div className="flex items-center gap-2 text-green-400/80">
                          <span className="text-neutral-600">[00:03]</span>
                          [OK] Data Science/AI ML
                        </div>

                        <div className="flex items-center gap-2 text-green-400/80">
                          <span className="text-neutral-600">[00:04]</span>
                          [OK] Blockchain Development
                        </div>

                        <div className="flex items-center gap-2 text-green-400/80">
                          <span className="text-neutral-600">[00:05]</span>
                          [OK] Mobile Development
                        </div>

                        <div className="flex items-center gap-2 text-green-400/80">
                          <span className="text-neutral-600">[00:06]</span>
                          [OK] Cybersecurity
                        </div>

                        <div className="flex items-center gap-2 text-green-400/80">
                          <span className="text-neutral-600">[00:07]</span>
                          [OK] Cloud Computing
                        </div>

                        <div className="mt-4 text-blue-400">
                          &gt; Ready for input
                          <span className="blink-cursor inline-block w-2 h-4 align-middle bg-blue-400 ml-1"></span>
                        </div>
                      </div>
                    </div>

                    {/* Visual Side */}
                    <div className="relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-48 h-48 border border-white/5 rounded-full animate-[spin_20s_linear_infinite]"></div>

                        <div className="w-32 h-32 border border-blue-500/30 rounded-full absolute animate-[spin_10s_linear_infinite] border-t-transparent border-r-transparent"></div>

                        <div className="w-48 h-48 border border-purple-500/20 rounded-full absolute animate-[spin_15s_linear_infinite_reverse] border-b-transparent border-l-transparent"></div>

                        <div className="absolute w-2 h-2 bg-white rounded-full blur-[2px] animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile */}
                <div className="block md:hidden pt-9">
                  <div className="bg-black/40 p-6">
                    <div className="font-mono text-xs text-blue-400 mb-4 tracking-wide">
                      &gt; initiating_sequence...
                    </div>

                    <div className="font-mono text-[11px] text-neutral-400 space-y-3">
                      <div className="flex gap-2">
                        <span className="text-neutral-600">[00:01]</span>
                        Loading modules...
                      </div>

                      {[
                        "Full Stack Development",
                        "Data Science / AI ML",
                        "Blockchain Development",
                        "Mobile Development",
                        "Cybersecurity",
                        "Cloud Computing",
                      ].map((item, i) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 text-green-400/80"
                        >
                          <span className="text-neutral-600">
                            [00:0{i + 2}]
                          </span>
                          [OK] {item}
                        </div>
                      ))}

                      <div className="mt-6 text-blue-400">
                        &gt; Ready for input
                        <span className="blink-cursor inline-block w-2 h-4 align-middle bg-blue-400 ml-1"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Portal;
