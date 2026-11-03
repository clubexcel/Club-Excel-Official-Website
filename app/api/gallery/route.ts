import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import uploadImageToCloudinary from "@/lib/upload-image-cloudinary";
import { requireAdminAuth } from "@/lib/authorize-admin";
import { MediaUsageType } from "@prisma/client";
import { revalidateTag, unstable_cache } from "next/cache";
import { attachMedia } from "@/lib/media";

const getCachedGallery = unstable_cache(
  async (skip: number, limit: number) => {
    const [albums, total] = await Promise.all([
      prisma.galleryAlbum.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.galleryAlbum.count(),
    ]);

    const albumIds = albums.map((album) => album.id);

    const usages = albumIds.length
      ? await prisma.mediaUsage.findMany({
          where: {
            type: MediaUsageType.GALLERY,
            entityId: { in: albumIds },
          },
          include: { media: true },
          orderBy: { createdAt: "asc" },
        })
      : [];

    const data = albums.map((album) => ({
      id: album.id,
      groupName: album.name,
      images: usages
        .filter((usage) => usage.entityId === album.id)
        .map((usage) => ({
          id: usage.media.id,
          imageUrl: usage.media.url,
        })),
    }));

    return { data, total };
  },
  ["gallery-list"],
  { tags: ["gallery"], revalidate: 86400 }
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get("page")!) || 1;
    const limit = parseInt(searchParams.get("limit")!) || 9;
    const skip = (page - 1) * limit;

    const { data, total } = await getCachedGallery(skip, limit);

    return Response.json(
      {
        success: true,
        message: "Gallery fetched successfully",
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch gallery:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch gallery",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminAuth();

    if (!auth.success) {
      return auth.response;
    }

    const formData = await request.formData();

    const groupName = formData.get("groupName") as string | null;
    const photos = formData.getAll("photos") as File[];

    if (!groupName || !groupName.trim()) {
      return Response.json(
        {
          success: false,
          message: "Album name is required",
        },
        { status: 400 }
      );
    }

    if (
      !photos.length ||
      photos.every((p) => !(p instanceof File) || !p.size)
    ) {
      return Response.json(
        {
          success: false,
          message: "At least one photo is required",
        },
        { status: 400 }
      );
    }

    const album = await prisma.galleryAlbum.create({
      data: { name: groupName.trim() },
    });

    const uploadedPhotos = await Promise.all(
      photos
        .filter((photo) => photo instanceof File && photo.size > 0)
        .map((photo) => uploadImageToCloudinary(photo, "gallery"))
    );

    await prisma.$transaction(async (tx) => {
      for (const { url, publicId } of uploadedPhotos) {
        await attachMedia(
          MediaUsageType.GALLERY,
          album.id,
          url,
          publicId,
          tx as any
        );
      }
    });

    revalidateTag("gallery", "max");

    return Response.json(
      {
        success: true,
        message: "Gallery album created successfully",
        album,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create gallery album:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to create gallery album",
      },
      { status: 500 }
    );
  }
}
