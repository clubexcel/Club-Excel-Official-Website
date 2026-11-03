"use client";

import { useState } from "react";
import Image from "next/image";
import { Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Pagination } from "@/components/ui/Pagination";
import ImageLightbox from "./ImageBox";
import { useAchievements } from "../hooks/useAchievements";
import type { AchievementItem } from "../actions/achievements";

const LIMIT = 9;

interface AchievementsSectionProps {
  initialAchievements?: AchievementItem[];
}

export default function AchievementsSection({
  initialAchievements = [],
}: AchievementsSectionProps) {
  const [page, setPage] = useState(1);

  const [lightbox, setLightbox] = useState<{
    images: { imageUrl: string }[];
    index: number;
  } | null>(null);

  const { data, loading } = useAchievements({
    page,
    limit: LIMIT,
    initialAchievements,
  });

  const achievements = data?.data ?? [];
  const pagination = data?.pagination;

  const typeColors: Record<string, string> = {
    general: "bg-blue-500/20 text-blue-400",
    competition: "bg-yellow-500/20 text-yellow-400",
    hackathon: "bg-purple-500/20 text-purple-400",
    certification: "bg-green-500/20 text-green-400",
    award: "bg-orange-500/20 text-orange-400",
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="w-6 h-6 text-yellow-400" />

        <h2 className="text-2xl font-bold">Achievements</h2>

        {pagination && (
          <span className="ml-auto text-neutral-500 text-sm">
            {pagination.total} total
          </span>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white/5 rounded-4xl h-64 animate-pulse"
            />
          ))}
        </div>
      ) : achievements.length === 0 ? (
        <p className="text-neutral-500 text-center py-16">
          No achievements yet. Watch this space!
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((item: any) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-white/3 border border-white/10 rounded-4xl overflow-hidden hover:border-white/20 transition-all duration-300"
              >
                {item.images?.length > 0 && (
                  <div
                    className="relative h-44 overflow-hidden cursor-pointer"
                    onClick={() =>
                      setLightbox({
                        images: item.images,
                        index: 0,
                      })
                    }
                  >
                    <Image
                      src={item.images[0].imageUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {item.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                        +{item.images.length - 1}
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                        typeColors[item.achievementTag] ??
                        "bg-white/10 text-neutral-300"
                      }`}
                    >
                      {item.achievementTag}
                    </span>

                    {item.achievedAt && (
                      <span className="text-neutral-600 text-[10px]">
                        {new Date(item.achievedAt).toLocaleDateString("en-IN")}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                    {item.title ?? item.name}
                  </h3>

                  <p className="text-sm text-neutral-500 line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {pagination && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={pagination.limit}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      <AnimatePresence>
        {lightbox && (
          <ImageLightbox
            images={lightbox.images}
            startIndex={lightbox.index}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
