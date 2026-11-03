"use client";

export type SectionType = "members" | "alumni";

interface TeamToggleProps {
  active: SectionType;
  onChange: (section: SectionType) => void;
}

const buttonStyle = {
  active:
    "bg-purple-500 text-white border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]",
  inactive:
    "bg-transparent text-neutral-500 border-white/10 hover:border-white/20",
};

export default function TeamToggle({ active, onChange }: TeamToggleProps) {
  return (
    <div className="flex justify-center gap-6 mb-20" data-aos="fade-up">
      <button
        onClick={() => onChange("members")}
        className={`px-8 py-3 rounded-full font-mono text-sm tracking-widest transition-all duration-300 border ${
          active === "members" ? buttonStyle.active : buttonStyle.inactive
        }`}
      >
        CORE MEMBERS
      </button>
      <button
        onClick={() => onChange("alumni")}
        className={`px-8 py-3 rounded-full font-mono text-sm tracking-widest transition-all duration-300 border ${
          active === "alumni" ? buttonStyle.active : buttonStyle.inactive
        }`}
      >
        CLUB ALUMNI
      </button>
    </div>
  );
}
