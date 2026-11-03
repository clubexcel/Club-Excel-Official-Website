import { NextRequest } from "next/server";
import uploadImageToCloudinary from "@/lib/upload-image-cloudinary";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/authorize-admin";
import { MediaUsageType } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { attachMedia } from "@/lib/media";
import { validateFormData } from "@/lib/utils";
import { createMemberSchema } from "@/lib/validator";
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminAuth();

    if (!auth.success) {
      return auth.response;
    }

    const validation = await validateFormData(request, createMemberSchema);

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

    let imageUrl: string | null = null;
    let imagePublicId: string | null = null;

    if (image && image.size > 0) {
      const uploaded = await uploadImageToCloudinary(image, "club-members");
      imageUrl = uploaded.url;
      imagePublicId = uploaded.publicId;
    }

    const member = await prisma.$transaction(async (tx) => {
      const created = await tx.member.create({
        data: {
          name,
          email,
          phone: phone ?? null,
          role,
          year: year ?? null,
          designation: designation ?? null,
          skills: skills ?? [],
        },
      });

      if (links && links.length) {
        await tx.memberLink.createMany({
          data: links.map((link) => ({
            memberId: created.id,
            platform: link.platform,
            url: link.url,
          })),
        });
      }

      if (imageUrl) {
        await attachMedia(
          MediaUsageType.PROFILE,
          created.id,
          imageUrl,
          imagePublicId,
          tx
        );
      }

      return created;
    });

    revalidateTag("members", "max");

    return Response.json(
      {
        success: true,
        message: `${member.name} registered successfully`,
        member: { ...member, imageUrl, links: links ?? [] },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Failed to register member:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to register member",
      },
      {
        status: 500,
      }
    );
  }
}
