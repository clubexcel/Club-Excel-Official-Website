import prisma from "@/lib/prisma";
import { MediaUsageType, Role } from "@prisma/client";
import { NextRequest } from "next/server";
import { unstable_cache } from "next/cache";
import { getMediaUrlMap } from "@/lib/media";
import { validateQuery } from "@/lib/utils";
import { teamQuerySchema } from "@/lib/validator";

const getCachedTeam = unstable_cache(
  async (
    where: Record<string, unknown>,
    skip: number,
    limit: number,
    sortBy: string,
    sortOrder: string
  ) => {
    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { designation: { sort: "asc", nulls: "last" } },
          { [sortBy]: sortOrder as "asc" | "desc" },
        ],
        include: {
          links: {
            select: { platform: true, url: true },
          },
        },
      }),
      prisma.member.count({ where }),
    ]);

    const imageMap = await getMediaUrlMap(
      MediaUsageType.PROFILE,
      members.map((member) => member.id)
    );

    const membersWithImages = members.map((member) => ({
      ...member,
      imageUrl: imageMap.get(member.id) ?? null,
    }));

    return { members: membersWithImages, total };
  },
  ["our-team-list"],
  { tags: ["members"], revalidate: 86400 }
);

export async function GET(request: NextRequest) {
  const validation = validateQuery(request, teamQuerySchema);

  if (!validation.success) {
    return validation.response;
  }

  const { page, limit, sortBy, sortOrder, role } = validation.data;

  const where = role === "ALL" ? {} : { role: role as Role };

  const skip = (page - 1) * limit;
  try {
    const { members, total } = await getCachedTeam(
      where,
      skip,
      limit,
      sortBy,
      sortOrder
    );

    return Response.json(
      {
        success: true,
        message: `Team fetched successfully`,
        data: members,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed to fetch team:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch team",
      },
      {
        status: 500,
      }
    );
  }
}
