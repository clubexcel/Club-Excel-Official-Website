import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/authorize-admin";
import { revalidateTag } from "next/cache";
import { MediaUsageType } from "@prisma/client";
import { removeMedia } from "@/lib/media";

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
          message: "Achievement id is required",
        },
        {
          status: 400,
        }
      );
    }

    const data = await request.json();

    const achievement = await prisma.achievement.findUnique({
      where: {
        id,
      },
    });

    if (!achievement) {
      return Response.json(
        {
          success: false,
          message: "Achievement not found",
        },
        {
          status: 404,
        }
      );
    }

    const updatedAchievement = await prisma.achievement.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });

    revalidateTag("achievements", "max");

    return Response.json(
      {
        success: true,
        message: "Achievement updated successfully",
        achievement: updatedAchievement,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed in updating achievement", error);

    return Response.json(
      {
        success: false,
        message: "Failed to update achievement",
      },
      {
        status: 500,
      }
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
          message: "Achievement id is required",
        },
        {
          status: 400,
        }
      );
    }

    const achievement = await prisma.achievement.findUnique({
      where: { id },
    });

    if (!achievement) {
      return Response.json(
        {
          success: false,
          message: "Achievement not found",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.achievement.delete({
        where: { id },
      });

      await removeMedia(MediaUsageType.ACHIEVEMENT, id, tx);
    });

    revalidateTag("achievements", "max");

    return Response.json(
      {
        success: true,
        message: "Achievement deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed in deleting achievement", error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete achievement",
      },
      {
        status: 500,
      }
    );
  }
}
