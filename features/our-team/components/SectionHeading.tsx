import { ReactNode } from "react";

interface SectionHeadingProps {
  title: string;
  accent: "blue" | "purple";
  children?: ReactNode;
}

const accentStyles = {
  blue: "text-blue-500",
  purple: "text-purple-500",
};

const dotStyles = {
  blue: "bg-blue-500",
  purple: "bg-purple-500",
};

export default function SectionHeading({
  title,
  accent,
  children,
}: SectionHeadingProps) {
  return (
    <h2
      data-aos="fade-right"
      className={`text-sm font-mono ${accentStyles[accent]} mb-16 uppercase tracking-widest flex items-center gap-3`}
    >
      <span
        className={`w-2.5 h-2.5 rounded-full animate-pulse ${dotStyles[accent]}`}
      />
      {title}
      {children}
    </h2>
  );
}
