import { useMemo, useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";

export type TeamMemberCardSize = "advisor" | "member";

export interface TeamMemberCardLink {
  platform: string;
  url: string;
}

export interface TeamMemberCardProps {
  name: string;
  role: string;
  designation?: string | null;
  img: string | null;
  label: string;
  accent: "blue" | "purple";
  size: TeamMemberCardSize;
  links?: TeamMemberCardLink[];
  delay?: number;
}

const accentHoverClass = {
  blue: "hover:from-blue-500/50",
  purple: "hover:from-purple-500/50",
};

const imageSizeClass = {
  advisor: "w-64 h-64 rounded-2xl",
  member: "w-40 h-40 rounded-3xl",
};

const fallbackAvatar = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=111&color=fff`;

const resolveSrc = (img: string | null, name: string) =>
  img ? `${img}` : fallbackAvatar(name);

export default function TeamMemberCard({
  name,
  designation,
  label,
  img,
  links = [],
  accent,
  size,
  delay = 0,
}: TeamMemberCardProps) {
  const [src, setSrc] = useState<string>(() => resolveSrc(img, name));

  const linkedin = links.find((link) => link.platform === "linkedin");

  useEffect(() => {
    setSrc(resolveSrc(img, name));
  }, [img, name]);

  const handleError = () => {
    setSrc(fallbackAvatar(name));
  };

  const wrapperClass = useMemo(
    () =>
      `group relative p-1 rounded-[2.5rem] bg-linear-to-b from-white/10 to-transparent ${accentHoverClass[accent]} transition-all duration-500 tilt-card min-h-120 ${
        linkedin ? "cursor-pointer" : ""
      }`,
    [accent, linkedin]
  );

  const goToLinkedin = () => {
    if (linkedin) {
      window.open(linkedin.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      data-aos="fade-up"
      data-aos-delay={delay}
      className={wrapperClass}
      role={linkedin ? "link" : undefined}
      tabIndex={linkedin ? 0 : undefined}
      onClick={goToLinkedin}
      onKeyDown={(e) => {
        if (linkedin && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          goToLinkedin();
        }
      }}
    >
      {linkedin && (
        <a
          href={linkedin.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} on LinkedIn`}
          title="LinkedIn"
          onClick={(e) => e.stopPropagation()}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 backdrop-blur-md text-white opacity-0 rotate-45 scale-75 translate-x-1 -translate-y-1 group-hover:opacity-100 group-hover:rotate-0 group-hover:scale-100 group-hover:translate-x-0 group-hover:translate-y-0 hover:bg-white hover:text-black transition-all duration-300"
        >
          <ArrowUpRight className="w-4 h-4" />
        </a>
      )}

      <div className="h-full bg-[#080808] rounded-[2.4rem] p-10 border border-white/5 relative overflow-hidden flex flex-col items-center justify-center text-center">
        <div
          className={`${imageSizeClass[size]} relative overflow-hidden mb-8 border border-white/5 group-hover:border-purple-500/20 transition-all duration-700 bg-neutral-900 shadow-2xl`}
        >
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            onError={handleError}
          />
        </div>

        <h4 className="text-2xl font-bold text-white mb-3 tracking-tight leading-tight">
          {name}
        </h4>
        <p className="text-[11px] text-purple-400/80 font-mono uppercase tracking-[0.25em]">
          {label}
        </p>
        {designation &&
          designation.trim().toLowerCase() !== label.trim().toLowerCase() && (
            <p className="text-neutral-300 font-mono text-[11px] tracking-widest uppercase mt-2">
              {designation}
            </p>
          )}
      </div>
    </div>
  );
}
