import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/authorize-admin";
import { revalidateTag } from "next/cache";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json(
        { success: false, message: "Drive id is required" },
        { status: 400 }
      );
    }

    const drive = await prisma.recruitmentDrive.findUnique({
      where: { id },
      include: {
        formFields: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: { responses: true },
        },
      },
    });

    if (!drive) {
      return Response.json(
        { success: false, message: "Recruitment drive not found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Recruitment drive fetched successfully",
        drive,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch recruitment drive:", error);

    return Response.json(
      { success: false, message: "Failed to fetch recruitment drive" },
      { status: 500 }
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
        { success: false, message: "Drive id is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      title,
      description,
      year,
      status,
      registrationStart,
      registrationEnd,
      whatsappLink,
    } = body;

    if (whatsappLink && !/^https:\/\/\S+/.test(whatsappLink)) {
      return Response.json(
        { success: false, message: "WhatsApp link must be a valid https URL" },
        { status: 400 }
      );
    }

    if (status === "OPEN") {
      const conflicting = await prisma.recruitmentDrive.findFirst({
        where: { status: "OPEN", id: { not: id } },
        select: { id: true, title: true },
      });

      if (conflicting) {
        return Response.json(
          {
            success: false,
            message: `"${conflicting.title}" is already open for registration. Close it before opening this drive.`,
            conflictingDriveId: conflicting.id,
          },
          { status: 409 }
        );
      }
    }

    const drive = await prisma.recruitmentDrive.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(year !== undefined && { year: Number(year) }),
        ...(status !== undefined && { status }),
        ...(registrationStart !== undefined && {
          registrationStart: registrationStart
            ? new Date(registrationStart)
            : null,
        }),
        ...(registrationEnd !== undefined && {
          registrationEnd: registrationEnd ? new Date(registrationEnd) : null,
        }),
        ...(whatsappLink !== undefined && {
          whatsappLink: whatsappLink || null,
        }),
      },
    });

    revalidateTag("recruitments", "max");

    return Response.json(
      {
        success: true,
        message: "Recruitment drive updated successfully",
        drive,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update recruitment drive:", error);

    return Response.json(
      { success: false, message: "Failed to update recruitment drive" },
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
        { success: false, message: "Drive id is required" },
        { status: 400 }
      );
    }

    try {
      await prisma.recruitmentDrive.delete({ where: { id } });
    } catch (error: any) {
      if (error?.code !== "P2025") {
        throw error;
      }
    }

    revalidateTag("recruitments", "max");

    return Response.json(
      {
        success: true,
        message: "Recruitment drive deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete recruitment drive:", error);

    return Response.json(
      { success: false, message: "Failed to delete recruitment drive" },
      { status: 500 }
    );
  }
}
