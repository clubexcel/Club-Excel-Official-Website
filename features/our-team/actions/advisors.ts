import prisma from "@/lib/prisma";
import { MediaUsageType, Role } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { getMediaUrlMap } from "@/lib/media";
import { MemberSocialLink } from "./members";

export interface AdvisorItem {
  id: string;
  name: string;
  role: string;
  designation: string | null;
  imageUrl: string | null;
  links: MemberSocialLink[];
}

export const getAdvisors = unstable_cache(
  async (): Promise<AdvisorItem[]> => {
    const advisors = await prisma.member.findMany({
      where: {
        role: Role.ADVISOR,
      },
      select: {
        id: true,
        name: true,
        role: true,
        designation: true,
        links: {
          select: {
            platform: true,
            url: true,
          },
        },
      },
    });

    const imageMap = await getMediaUrlMap(
      MediaUsageType.PROFILE,
      advisors.map((advisor) => advisor.id)
    );

    return advisors.map((advisor) => ({
      id: advisor.id,
      name: advisor.name,
      role: advisor.role,
      designation: advisor.designation,
      imageUrl: imageMap.get(advisor.id) ?? null,
      links: advisor.links,
    }));
  },
  ["advisors-list"],
  { tags: ["members"], revalidate: 86400 }
);
