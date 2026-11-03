import prisma from "@/lib/prisma";
import { MediaUsageType } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { getMediaUrlMap } from "@/lib/media";

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  achievedAt: string;
  achievementTag: string;
  images: Array<{ imageUrl: string }>;
}

export const getAchievements = unstable_cache(
  async (): Promise<AchievementItem[]> => {
    const achievements = await prisma.achievement.findMany({
      orderBy: {
        achievedAt: "desc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        achievedAt: true,
        tag: true,
      },
    });

    const imageMap = await getMediaUrlMap(
      MediaUsageType.ACHIEVEMENT,
      achievements.map((achievement) => achievement.id)
    );

    return achievements.map((achievement) => {
      const imageUrl = imageMap.get(achievement.id);

      return {
        id: achievement.id,
        title: achievement.title,
        description: achievement.description ?? "",
        achievedAt: achievement.achievedAt.toISOString(),
        achievementTag: achievement.tag.toLowerCase(),
        images: imageUrl ? [{ imageUrl }] : [],
      };
    });
  },
  ["achievements-list"],
  { tags: ["achievements"], revalidate: 86400 }
);
