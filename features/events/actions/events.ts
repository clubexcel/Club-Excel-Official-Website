import prisma from "@/lib/prisma";
import { EventStatusType, EventType, MediaUsageType } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { getMediaUrlMap } from "@/lib/media";

export interface EventItem {
  id: string;
  title: string;
  description?: string | null;
  status: EventStatusType;
  imageUrl: string | null;
  type: EventType;
  startAt: Date;
  venue?: string | null;
  capacity?: number | null;
  _count?: {
    responses: number;
  };
}

export const getEvents = unstable_cache(
  async (): Promise<EventItem[]> => {
    const events = await prisma.event.findMany({
      orderBy: [{ status: "asc" }, { startAt: "desc" }],
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        type: true,
        startAt: true,
        venue: true,
        capacity: true,
        _count: {
          select: { responses: true },
        },
      },
    });

    const imageMap = await getMediaUrlMap(
      MediaUsageType.EVENT,
      events.map((event) => event.id)
    );

    return events.map((event) => ({
      ...event,
      imageUrl: imageMap.get(event.id) ?? null,
    }));
  },
  ["event-list"],
  { tags: ["events"], revalidate: 86400 }
);
