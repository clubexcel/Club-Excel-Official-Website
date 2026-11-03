"use client";

import { motion } from "framer-motion";

export type TeamTab = "core" | "alumni";

interface TeamTabsProps {
  active: TeamTab;
  onChange: (tab: TeamTab) => void;
}

export default function TeamTabs({ active, onChange }: TeamTabsProps) {
  return (
    <div className="flex justify-center mb-24">
      <div className="flex gap-5">
        <button
          onClick={() => onChange("core")}
          className={`
            relative
            w-60
            h-16
            rounded-full
            uppercase
            tracking-[0.35em]
            text-lg
            font-medium
            transition-all
            duration-300
            overflow-hidden
            ${
              active === "core"
                ? "text-white"
                : "text-neutral-500 border border-white/10 hover:border-white/20"
            }
          `}
        >
          {active === "core" && (
            <motion.div
              layoutId="team-tab"
              className="
                absolute
                inset-0
                rounded-full
                bg-gradient-to-r
                from-violet-500
                to-purple-500
                shadow-[0_0_35px_rgba(168,85,247,0.7)]
              "
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 30,
              }}
            />
          )}

          <span className="relative z-10">CORE MEMBERS</span>
        </button>

        <button
          onClick={() => onChange("alumni")}
          className={`
            relative
            w-60
            h-16
            rounded-full
            uppercase
            tracking-[0.35em]
            text-lg
            font-medium
            transition-all
            duration-300
            overflow-hidden
            ${
              active === "alumni"
                ? "text-white"
                : "text-neutral-500 border border-white/10 hover:border-white/20"
            }
          `}
        >
          {active === "alumni" && (
            <motion.div
              layoutId="team-tab"
              className="
                absolute
                inset-0
                rounded-full
                bg-gradient-to-r
                from-violet-500
                to-purple-500
                shadow-[0_0_35px_rgba(168,85,247,0.7)]
              "
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 30,
              }}
            />
          )}

          <span className="relative z-10">CLUB ALUMNI</span>
        </button>
      </div>
    </div>
  );
}
