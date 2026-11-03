import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import uploadImageToCloudinary from "@/lib/upload-image-cloudinary";
import { requireAdminAuth } from "@/lib/authorize-admin";
import { MediaUsageType } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { getMediaUrl, removeMedia, replaceMedia } from "@/lib/media";
import { validateFormData } from "@/lib/utils";
import { updateMemberSchema } from "@/lib/validator";

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
          message: "Member ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const member = await prisma.$transaction(async (tx) => {
      const deleted = await tx.member.delete({
        where: {
          id,
        },
      });

      await removeMedia(MediaUsageType.PROFILE, id, tx);

      return deleted;
    });

    revalidateTag("members", "max");

    return Response.json(
      {
        success: true,
        message: `${member.name} deleted successfully.`,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed to delete member:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete member.",
      },
      {
        status: 500,
      }
    );
  }
}

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
          message: "Member ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const validation = await validateFormData(request, updateMemberSchema);

    if (!validation.success) {
      return validation.response;
    }

    const {
      name,
      email,
      phone,
      role,
      year,
      designation,
      skills,
      links,
      image,
    } = validation.data;

    let newImageUrl: string | undefined;
    let newImagePublicId: string | null = null;

    if (image && image.size > 0) {
      const uploaded = await uploadImageToCloudinary(image, "club-members");
      newImageUrl = uploaded.url;
      newImagePublicId = uploaded.publicId;
    }

    const member = await prisma.$transaction(async (tx) => {
      const updated = await tx.member.update({
        where: {
          id,
        },
        data: {
          name,
          email,
          phone,
          role,
          year,
          designation,
          skills,
        },
      });

      if (links !== undefined) {
        await tx.memberLink.deleteMany({ where: { memberId: id } });

        if (links.length) {
          await tx.memberLink.createMany({
            data: links.map((link) => ({
              memberId: id,
              platform: link.platform,
              url: link.url,
            })),
          });
        }
      }

      if (newImageUrl) {
        await replaceMedia(
          MediaUsageType.PROFILE,
          id,
          newImageUrl,
          newImagePublicId,
          tx
        );
      }

      return updated;
    });

    const imageUrl =
      newImageUrl ?? (await getMediaUrl(MediaUsageType.PROFILE, id));

    const currentLinks = await prisma.memberLink.findMany({
      where: { memberId: id },
      select: { platform: true, url: true },
    });

    revalidateTag("members", "max");

    return Response.json(
      {
        success: true,
        message: `${member.name} updated successfully.`,
        member: { ...member, imageUrl, links: currentLinks },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed to update member:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to update member.",
      },
      {
        status: 500,
      }
    );
  }
}
