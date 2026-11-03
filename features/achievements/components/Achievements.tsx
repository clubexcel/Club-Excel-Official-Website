"use client";

import { useState } from "react";
import { Trophy } from "lucide-react";

import AchievementsSection from "./AchievementsSection";
import GallerySection from "./GallerySection";
import type { AchievementItem } from "../actions/achievements";

const tabs = [
  { id: "achievements", label: "Achievements" },
  { id: "gallery", label: "Gallery" },
] as const;

interface AchievementsProps {
  achievements?: AchievementItem[];
}

export default function Achievements({ achievements = [] }: AchievementsProps) {
  const [activeTab, setActiveTab] = useState<"achievements" | "gallery">(
    "achievements"
  );

  return (
    <div className="min-h-screen bg-[#050505] px-4 pb-16 pt-24 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/3 px-4 py-2 text-sm text-neutral-400">
            <Trophy className="h-4 w-4 text-yellow-400" />
            Club milestones
          </div>

          <h1 className="mb-4 text-4xl font-bold md:text-6xl">
            Achievements & Gallery
          </h1>

          <p className="mx-auto max-w-2xl text-neutral-400">
            Explore our recent recognitions, competition wins, and highlights
            from the club’s journey.
          </p>
        </div>

        <div className="mb-12 flex justify-center">
          <div className="flex gap-3 rounded-full border border-white/10 bg-white/3 p-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-pressed={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-6 py-2.5 text-sm font-semibold capitalize transition-all ${
                    isActive
                      ? "bg-white text-black shadow-lg shadow-white/10"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === "achievements" ? (
          <AchievementsSection initialAchievements={achievements} />
        ) : (
          <GallerySection />
        )}
      </div>
    </div>
  );
}
