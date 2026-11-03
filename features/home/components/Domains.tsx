import {
  Blocks,
  BrainCircuit,
  Cloud,
  LayoutGrid,
  Shield,
  Smartphone,
} from "lucide-react";
import React from "react";

const Domains = () => {
  return (
    <>
      <section id="domains" className="py-32 bg-black relative">
        {/* Decoration */}
        <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-blue-900/5 blur-[60px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h2 className="text-xs font-mono text-blue-500 mb-12 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>{" "}
            System Modules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {/* Full Stack Card */}
            <div className="tilt-card group h-[420px] relative rounded-3xl bg-[#080808] border border-white/10 hover:border-white/20 transition-all duration-300 p-8 overflow-hidden hover-trigger hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.15)]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="tilt-content relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/5 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-colors">
                    <LayoutGrid className="w-6 h-6 text-white group-hover:text-blue-200 transition-colors" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white tracking-tight mb-2">
                    Full Stack Development
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    Architecting scalable web solutions from root to node.
                  </p>
                </div>

                {/* Visual: Code Window */}
                <div className="tilt-inner mt-8 translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out test-padding">
                  <div className="code-window p-5 shadow-2xl bg-black/90 backdrop-blur border-white/10 group-hover:border-blue-500/20 transition-colors">
                    <div className="flex gap-2 mb-4 opacity-40">
                      <span className="code-dot bg-red-500"></span>
                      <span className="code-dot bg-yellow-500"></span>
                      <span className="code-dot bg-green-500"></span>
                    </div>
                    <div className="text-neutral-400 font-mono text-[11px]">
                      <span className="text-purple-400">const</span> app ={" "}
                      <span className="text-blue-400">new</span> NextApp();
                      <br />
                      <span className="text-purple-400">await</span> app.
                      <span className="text-yellow-300">deploy</span>({"{"}
                      <br />
                      &nbsp;&nbsp;target:{" "}
                      <span className="text-green-400">'serverless'</span>,
                      <br />
                      &nbsp;&nbsp;mode:{" "}
                      <span className="text-green-400">'production'</span>
                      <br />
                      {"}"});
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI/ML Card */}
            <div className="tilt-card group h-[420px] relative rounded-3xl bg-[#080808] border border-white/10 hover:border-white/20 transition-all duration-300 p-8 overflow-hidden hover-trigger hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.15)]">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="tilt-content relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/5 group-hover:bg-purple-500/10 group-hover:border-purple-500/20 transition-colors">
                    <BrainCircuit className="w-6 h-6 text-white group-hover:text-purple-200 transition-colors" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white tracking-tight mb-2">
                    Data Science/AI ML
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    Training models to predict, analyze and automate the future.
                  </p>
                </div>

                {/* Visual: Data Graph */}
                <div className="tilt-inner mt-8 translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out test-padding">
                  <div className="code-window p-5 shadow-2xl bg-black/90 backdrop-blur border-white/10 h-32 flex items-end justify-between gap-2 group-hover:border-purple-500/20 transition-colors">
                    <div className="w-full bg-purple-500/20 h-[40%] rounded-sm transition-all duration-700 delay-75 group-hover:bg-purple-500/40 group-hover:h-[60%]"></div>
                    <div className="w-full bg-purple-500/40 h-[70%] rounded-sm transition-all duration-700 delay-100 group-hover:bg-purple-500/60 group-hover:h-[50%]"></div>
                    <div className="w-full bg-purple-500/60 h-[50%] rounded-sm transition-all duration-700 delay-150 group-hover:bg-purple-500/80 group-hover:h-[80%]"></div>
                    <div className="w-full bg-purple-500/80 h-[90%] rounded-sm transition-all duration-700 delay-200 group-hover:bg-white group-hover:h-[95%]"></div>
                    <div className="w-full bg-white h-[60%] rounded-sm transition-all duration-700 delay-300 group-hover:bg-purple-500/30 group-hover:h-[70%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* App Dev Card */}
            <div className="tilt-card group h-[420px] relative rounded-3xl bg-[#080808] border border-white/10 hover:border-white/20 transition-all duration-300 p-8 overflow-hidden hover-trigger hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.15)]">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="tilt-content relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/5 group-hover:bg-green-500/10 group-hover:border-green-500/20 transition-colors">
                    <Smartphone className="w-6 h-6 text-white group-hover:text-green-200 transition-colors" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white tracking-tight mb-2">
                    Mobile Development
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    Crafting seamless experiences for iOS and Android
                    ecosystems.
                  </p>
                </div>

                {/* Visual: Phone Mockup */}
                <div className="tilt-inner mt-8 flex justify-center translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <div className="w-36 h-44 border-[6px] border-neutral-800 bg-neutral-900 rounded-t-3xl border-b-0 relative overflow-hidden shadow-2xl group-hover:border-neutral-700 transition-colors">
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-neutral-800 rounded-full"></div>
                    <div className="mt-8 mx-3 space-y-3 opacity-60">
                      <div className="h-10 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-lg w-full"></div>
                      <div className="flex gap-2">
                        <div className="h-16 bg-gradient-to-b from-neutral-800 to-neutral-700 rounded-lg w-1/2"></div>
                        <div className="h-16 bg-gradient-to-b from-neutral-800 to-neutral-700 rounded-lg w-1/2"></div>
                      </div>
                      <div className="h-20 bg-gradient-to-br from-neutral-800 to-neutral-700 rounded-lg w-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Blockchain Card */}
            <div className="tilt-card group h-[420px] relative rounded-3xl bg-[#080808] border border-white/10 hover:border-white/20 transition-all duration-300 p-8 overflow-hidden hover-trigger hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.15)]">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="tilt-content relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/5 group-hover:bg-orange-500/10 group-hover:border-orange-500/20 transition-colors">
                    <Blocks className="w-6 h-6 text-white group-hover:text-orange-200 transition-colors" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white tracking-tight mb-2">
                    Blockchain Development
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    Decentralized protocols and smart contract engineering.
                  </p>
                </div>

                {/* Visual: Blocks */}
                <div className="tilt-inner mt-8 flex items-center justify-center gap-3 translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out opacity-80 test-padding-more">
                  <div className="w-12 h-12 border border-orange-500/50 bg-orange-500/10 rounded-lg flex items-center justify-center text-[10px] font-mono text-orange-400 shadow-[0_0_15px_-5px_rgba(249,115,22,0.5)]">
                    HASH
                  </div>
                  <div className="w-8 h-[1px] bg-neutral-700 relative">
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1 h-1 bg-white rounded-full animate-[ping_1.5s_linear_infinite]"></div>
                  </div>
                  <div className="w-12 h-12 border border-white/20 bg-white/5 rounded-lg flex items-center justify-center text-[10px] font-mono text-neutral-300">
                    0x4F
                  </div>
                  <div className="w-8 h-[1px] bg-neutral-700"></div>
                  <div className="w-12 h-12 border border-white/20 bg-white/5 rounded-lg flex items-center justify-center text-[10px] font-mono text-neutral-300">
                    0x9A
                  </div>
                </div>
              </div>
            </div>

            {/* Cybersecurity Card */}
            <div className="tilt-card group h-[420px] relative rounded-3xl bg-[#080808] border border-white/10 hover:border-white/20 transition-all duration-300 p-8 overflow-hidden hover-trigger hover:shadow-[0_0_40px_-10px_rgba(239,68,68,0.15)]">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="tilt-content relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/5 group-hover:bg-red-500/10 group-hover:border-red-500/20 transition-colors">
                    <Shield className="w-6 h-6 text-white group-hover:text-red-200 transition-colors" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white tracking-tight mb-2">
                    Cybersecurity
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    Securing digital assets through advanced defensive
                    protocols.
                  </p>
                </div>

                {/* Visual: Security Terminal */}
                <div className="tilt-inner mt-8 translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out test-padding">
                  <div className="code-window p-5 shadow-2xl bg-black/90 backdrop-blur border-white/10 group-hover:border-red-500/20 transition-colors">
                    <div className="text-red-500 font-mono text-[10px] mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>{" "}
                      SYSTEM STATUS: SECURE
                    </div>
                    <div className="text-neutral-500 font-mono text-[9px] space-y-1">
                      <div>&gt; scanning ports... 100%</div>
                      <div>&gt; encryption: AES-256 [ACTIVE]</div>
                      <div className="text-green-500/50">
                        &gt; firewall: operational
                      </div>
                      <div className="text-green-500/50">
                        &gt; no threats detected.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cloud Computing Card */}
            <div className="tilt-card group h-[420px] relative rounded-3xl bg-[#080808] border border-white/10 hover:border-white/20 transition-all duration-300 p-8 overflow-hidden hover-trigger hover:shadow-[0_0_40px_-10px_rgba(14,165,233,0.15)]">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="tilt-content relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/5 group-hover:bg-sky-500/10 group-hover:border-sky-500/20 transition-colors">
                    <Cloud className="w-6 h-6 text-white group-hover:text-sky-200 transition-colors" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white tracking-tight mb-2">
                    Cloud Computing
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    Deploying elastic architectures at global scale.
                  </p>
                </div>

                {/* Visual: Cloud Nodes */}
                <div className="tilt-inner mt-8 flex flex-col gap-3 translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out opacity-80 backdrop-blur-sm p-4 bg-white/5 rounded-xl border border-white/5 group-hover:border-sky-500/20">
                  <div className="flex justify-between items-center px-2">
                    <div className="h-1.5 w-1/3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-500 w-[75%] animate-pulse"></div>
                    </div>
                    <span className="text-[9px] font-mono text-sky-400">
                      AWS-EAST-1
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <div className="h-1.5 w-1/3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-500 w-[60%] animate-pulse"></div>
                    </div>
                    <span className="text-[9px] font-mono text-sky-400">
                      GCP-GLOBAL
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <div className="h-1.5 w-1/3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-500 w-[90%] animate-pulse"></div>
                    </div>
                    <span className="text-[9px] font-mono text-sky-400">
                      AZURE-CORE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Domains;
