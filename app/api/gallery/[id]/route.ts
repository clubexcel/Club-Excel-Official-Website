import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import uploadImageToCloudinary from "@/lib/upload-image-cloudinary";
import { requireAdminAuth } from "@/lib/authorize-admin";
import { MediaUsageType } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { attachMedia, removeMedia } from "@/lib/media";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminAuth();

    if (!auth.success) {
      return auth.response;
    }

    const { id } = await params;

    if (!id) {
      return Response.json(
        {
          success: false,
          message: "Album id is required",
        },
        { status: 400 }
      );
    }

    const album = await prisma.galleryAlbum.findUnique({
      where: { id },
    });

    if (!album) {
      return Response.json(
        {
          success: false,
          message: "Album not found",
        },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    const groupName = formData.get("groupName") as string | null;
    const photos = (formData.getAll("photos") as File[]).filter(
      (photo) => photo instanceof File && photo.size > 0
    );

    if (groupName && groupName.trim()) {
      await prisma.galleryAlbum.update({
        where: { id },
        data: { name: groupName.trim() },
      });
    }

    if (photos.length) {
      const uploadedPhotos = await Promise.all(
        photos.map((photo) => uploadImageToCloudinary(photo, "gallery"))
      );

      await prisma.$transaction(async (tx) => {
        for (const { url, publicId } of uploadedPhotos) {
          await attachMedia(
            MediaUsageType.GALLERY,
            id,
            url,
            publicId,
            tx as any
          );
        }
      });
    }

    revalidateTag("gallery", "max");

    return Response.json(
      {
        success: true,
        message: "Album updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update gallery album:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to update gallery album",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminAuth();

    if (!auth.success) {
      return auth.response;
    }

    const { id } = await params;

    if (!id) {
      return Response.json(
        {
          success: false,
          message: "Album id is required",
        },
        { status: 400 }
      );
    }

    const album = await prisma.galleryAlbum.findUnique({
      where: { id },
    });

    if (!album) {
      return Response.json(
        {
          success: false,
          message: "Album not found",
        },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await removeMedia(MediaUsageType.GALLERY, id, tx);

      await tx.galleryAlbum.delete({
        where: { id },
      });
    });

    revalidateTag("gallery", "max");

    return Response.json(
      {
        success: true,
        message: `${album.name} deleted successfully.`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete gallery album:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete gallery album",
      },
      { status: 500 }
    );
  }
}
