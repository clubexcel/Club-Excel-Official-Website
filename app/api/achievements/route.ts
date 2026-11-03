import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { AchievementType, MediaUsageType } from "@prisma/client";
import uploadImageToCloudinary from "@/lib/upload-image-cloudinary";
import { requireAdminAuth } from "@/lib/authorize-admin";
import { revalidateTag, unstable_cache } from "next/cache";
import { attachMedia, getMediaUrlMap } from "@/lib/media";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminAuth();

    if (!auth.success) {
      return auth.response;
    }

    const formData = await request.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;
    const tag = formData.get("tag") as AchievementType;
    const achievedAt = formData.get("achievedAt") as string;
    const image = formData.get("image") as File | null;
    const memberIds = JSON.parse((formData.get("memberIds") as string) || "[]");

    if (!title) {
      return Response.json(
        {
          success: false,
          message: "Title is required",
        },
        {
          status: 400,
        }
      );
    } else if (!tag) {
      return Response.json(
        {
          success: false,
          message: "Achievement tag is required",
        },
        {
          status: 400,
        }
      );
    } else if (!achievedAt) {
      return Response.json(
        {
          success: false,
          message: "Achievement date is required",
        },
        {
          status: 400,
        }
      );
    } else if (memberIds.length === 0) {
      return Response.json(
        {
          success: false,
          message: "At least one member is required.",
        },
        { status: 400 }
      );
    }

    let imageUrl: string | null = null;
    let imagePublicId: string | null = null;

    if (image && image.size > 0) {
      const uploaded = await uploadImageToCloudinary(
        image,
        "club-achievements"
      );
      imageUrl = uploaded.url;
      imagePublicId = uploaded.publicId;
    }

    const achievement = await prisma.$transaction(async (tx) => {
      const created = await tx.achievement.create({
        data: {
          title,
          description: description,
          tag,
          achievedAt: new Date(achievedAt),
          members: {
            connect: memberIds.map((id: string) => ({
              id,
            })),
          },
        },
        include: {
          members: {
            select: { id: true, name: true },
          },
        },
      });

      if (imageUrl) {
        await attachMedia(
          MediaUsageType.ACHIEVEMENT,
          created.id,
          imageUrl,
          imagePublicId,
          tx
        );
      }

      return created;
    });

    revalidateTag("achievements", "max");

    return Response.json(
      {
        success: true,
        message: `${achievement.title} registered successfully`,
        achievement: { ...achievement, imageUrl },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Failed to register achievement:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to register achievement",
      },
      {
        status: 500,
      }
    );
  }
}

const getCachedAchievements = unstable_cache(
  async (skip: number, limit: number, sortBy: string, sortOrder: string) => {
    const [achievements, total] = await Promise.all([
      prisma.achievement.findMany({
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          title: true,
          description: true,
          achievedAt: true,
          tag: true,
          members: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.achievement.count(),
    ]);

    const imageMap = await getMediaUrlMap(
      MediaUsageType.ACHIEVEMENT,
      achievements.map((achievement) => achievement.id)
    );
    const data = achievements.map((achievement) => ({
      id: achievement.id,
      title: achievement.title,
      description: achievement.description ?? "",
      achievedAt: achievement.achievedAt.toISOString(),
      tag: achievement.tag,
      imageUrl: imageMap.get(achievement.id) ?? null,
      members: achievement.members,
    }));

    return { data, total };
  },
  ["achievements-admin-list"],
  { tags: ["achievements"], revalidate: 86400 }
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get("page")!) || 1;
    const limit = parseInt(searchParams.get("limit")!) || 5;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const skip = (page - 1) * limit;

    const { data, total } = await getCachedAchievements(
      skip,
      limit,
      sortBy,
      sortOrder
    );

    return Response.json(
      {
        success: true,
        message: "Achievement fetched successfully",
        data,
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
    console.error("Failed to fetch achievements:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch achievements",
      },
      {
        status: 500,
      }
    );
  }
}
