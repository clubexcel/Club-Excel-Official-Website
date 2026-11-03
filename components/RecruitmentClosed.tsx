import { Clock3 } from "lucide-react";
import Link from "next/link";

interface RecruitmentClosedProps {
  opensAt?: string | Date | null;
}

const RecruitmentClosed = ({ opensAt }: RecruitmentClosedProps) => {
  const formattedDate = opensAt
    ? new Date(opensAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="pt-40 pb-24 px-6 max-w-7xl mx-auto min-h-screen flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-white/[0.03] rounded-full flex items-center justify-center mb-8 border border-white/10">
        <Clock3 className="w-12 h-12 text-neutral-500" />
      </div>
      <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 uppercase">
        Recruitment
        <br />
        <span className="text-blue-500">Not Open</span>
      </h1>
      <p className="text-neutral-400 max-w-xl text-lg font-light leading-relaxed mb-4">
        Recruitment for Club Excel hasn&apos;t started yet. Check back soon.
      </p>
      {formattedDate && (
        <p className="text-neutral-500 text-sm uppercase tracking-widest mb-12">
          Opens on {formattedDate}
        </p>
      )}
      <div className={formattedDate ? "" : "mt-8"}>
        <Link
          href="/"
          className="flex items-center gap-3 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default RecruitmentClosed;
