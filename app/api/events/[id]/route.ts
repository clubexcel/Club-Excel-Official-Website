import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/authorize-admin";
import { EventType, MediaUsageType } from "@prisma/client";
import uploadImageToCloudinary from "@/lib/upload-image-cloudinary";
import { revalidateTag } from "next/cache";
import { getMediaUrl, removeMedia, replaceMedia } from "@/lib/media";

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
          message: "Event id is required",
        },
        { status: 400 }
      );
    }

    const formData = await request.formData();

    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const type = formData.get("type") as EventType | null;
    const startAt = formData.get("startAt") as string | null;
    const endAt = formData.get("endAt") as string | null;
    const venue = formData.get("venue") as string | null;
    const registrationStart = formData.get("registrationStart") as
      string | null;
    const registrationEnd = formData.get("registrationEnd") as string | null;
    const capacity = formData.get("capacity") as string | null;
    const whatsappLink = formData.get("whatsappLink") as string | null;

    const image = formData.get("image") as File | null;

    if (whatsappLink && !/^https:\/\/\S+/.test(whatsappLink)) {
      return Response.json(
        { success: false, message: "WhatsApp link must be a valid https URL" },
        { status: 400 }
      );
    }

    let newImageUrl: string | undefined;
    let newImagePublicId: string | null = null;

    if (image && image.size > 0) {
      const uploaded = await uploadImageToCloudinary(image, "event-images");
      newImageUrl = uploaded.url;
      newImagePublicId = uploaded.publicId;
    }

    const event = await prisma.$transaction(async (tx) => {
      const updated = await tx.event.update({
        where: {
          id,
        },
        data: {
          ...(title !== null && { title }),
          ...(description !== null && { description }),
          ...(type !== null && { type }),
          ...(startAt !== null && { startAt: new Date(startAt) }),
          ...(endAt !== null && {
            endAt: endAt ? new Date(endAt) : null,
          }),
          ...(venue !== null && { venue }),
          ...(registrationStart !== null && {
            registrationStart: registrationStart
              ? new Date(registrationStart)
              : null,
          }),
          ...(registrationEnd !== null && {
            registrationEnd: registrationEnd ? new Date(registrationEnd) : null,
          }),
          ...(capacity !== null && {
            capacity: capacity ? Number(capacity) : null,
          }),
          ...(whatsappLink !== null && {
            whatsappLink: whatsappLink || null,
          }),
        },
      });

      if (newImageUrl) {
        await replaceMedia(
          MediaUsageType.EVENT,
          id,
          newImageUrl,
          newImagePublicId,
          tx
        );
      }

      return updated;
    });

    const imageUrl =
      newImageUrl ?? (await getMediaUrl(MediaUsageType.EVENT, id));

    revalidateTag("events", "max");

    return Response.json(
      {
        success: true,
        message: "Event updated successfully",
        event: { ...event, imageUrl },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed in updating event", error);

    return Response.json(
      {
        success: false,
        message: "Failed to update event",
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
          message: "Event id is required",
        },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.event.delete({
        where: {
          id,
        },
      });

      await removeMedia(MediaUsageType.EVENT, id, tx);
    });

    revalidateTag("events", "max");

    return Response.json(
      {
        success: true,
        message: "Event deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed in deleting event", error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete event",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json(
        {
          success: false,
          message: "Event id is required",
        },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: {
        id,
      },
      include: {
        formFields: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!event) {
      return Response.json(
        {
          success: false,
          message: "Event not found",
        },
        { status: 404 }
      );
    }

    const imageUrl = await getMediaUrl(MediaUsageType.EVENT, id);

    return Response.json(
      {
        success: true,
        message: "Event fetched successfully",
        event: { ...event, imageUrl },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed to fetch event:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch event",
      },
      {
        status: 500,
      }
    );
  }
}
