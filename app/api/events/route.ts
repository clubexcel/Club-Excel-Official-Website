import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { requireAdminAuth } from "@/lib/authorize-admin";
import uploadImageToCloudinary from "@/lib/upload-image-cloudinary";
import { EventStatusType, EventType, MediaUsageType } from "@prisma/client";
import { revalidateTag, unstable_cache } from "next/cache";
import { attachMedia, getMediaUrlMap } from "@/lib/media";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminAuth();

    if (!auth.success) {
      return auth.response;
    }

    const user = auth.user;

    const formData = await request.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;
    const type = formData.get("type") as EventType;
    const status = (formData.get("status") as EventStatusType) || undefined;
    const startAt = formData.get("startAt") as string;
    const endAt = formData.get("endAt") as string | null;
    const venue = formData.get("venue") as string | null;
    const registrationStart = formData.get("registrationStart") as
      string | null;
    const registrationEnd = formData.get("registrationEnd") as string | null;
    const capacity = formData.get("capacity") as string | null;
    const whatsappLink = formData.get("whatsappLink") as string | null;

    const image = formData.get("image") as File | null;

    if (!title) {
      return Response.json(
        { success: false, message: "Title is required" },
        { status: 400 }
      );
    }

    if (!type) {
      return Response.json(
        { success: false, message: "Type is required" },
        { status: 400 }
      );
    }

    if (!startAt) {
      return Response.json(
        { success: false, message: "Start date is required" },
        { status: 400 }
      );
    }

    if (!user) {
      return Response.json(
        { success: false, message: "User not authorized" },
        { status: 403 }
      );
    }

    if (whatsappLink && !/^https:\/\/\S+/.test(whatsappLink)) {
      return Response.json(
        { success: false, message: "WhatsApp link must be a valid https URL" },
        { status: 400 }
      );
    }

    let imageUrl: string | null = null;
    let imagePublicId: string | null = null;

    if (image && image.size > 0) {
      const uploaded = await uploadImageToCloudinary(image, "event-images");
      imageUrl = uploaded.url;
      imagePublicId = uploaded.publicId;
    }

    const event = await prisma.$transaction(async (tx) => {
      const created = await tx.event.create({
        data: {
          title,
          description,
          type,
          status,
          startAt: new Date(startAt),
          endAt: endAt ? new Date(endAt) : null,
          venue,
          registrationStart: registrationStart
            ? new Date(registrationStart)
            : null,
          registrationEnd: registrationEnd ? new Date(registrationEnd) : null,
          capacity: capacity ? Number(capacity) : null,
          whatsappLink: whatsappLink || null,
          createdBy: user.id,
        },
      });

      if (imageUrl) {
        await attachMedia(
          MediaUsageType.EVENT,
          created.id,
          imageUrl,
          imagePublicId,
          tx
        );
      }

      return created;
    });

    revalidateTag("events", "max");

    return Response.json(
      {
        success: true,
        message: `Event ${event.title} registered successfully`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed in registering event", error);

    return Response.json(
      {
        success: false,
        message: "Failed to register event",
      },
      { status: 500 }
    );
  }
}

const getCachedEvents = unstable_cache(
  async (
    where: Record<string, unknown>,
    skip: number,
    limit: number,
    sortBy: string,
    sortOrder: string
  ) => {
    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder as "asc" | "desc",
        },
        include: {
          _count: {
            select: { responses: true },
          },
        },
      }),
      prisma.event.count({ where }),
    ]);

    const imageMap = await getMediaUrlMap(
      MediaUsageType.EVENT,
      events.map((event) => event.id)
    );

    const eventsWithImages = events.map((event) => ({
      ...event,
      imageUrl: imageMap.get(event.id) ?? null,
    }));

    return { events: eventsWithImages, total };
  },
  ["events-admin-list"],
  { tags: ["events"], revalidate: 86400 }
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get("page")!) || 1;
    const limit = parseInt(searchParams.get("limit")!) || 5;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    const where = {
      ...(type ? { type: type as EventType } : {}),
      ...(status ? { status: status as EventStatusType } : {}),
    };

    const { events, total } = await getCachedEvents(
      where,
      skip,
      limit,
      sortBy,
      sortOrder
    );

    return Response.json(
      {
        success: true,
        message: `Event fetched successfully`,
        events,
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
    console.error("Failed in fetching events", error);
    return Response.json(
      {
        success: false,
        message: "Failed to fetching events",
      },
      {
        status: 500,
      }
    );
  }
}
