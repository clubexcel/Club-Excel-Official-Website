"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  CalendarDays,
  MapPin,
  Users,
  Clock3,
  Pencil,
  Eye,
  Share2,
  CalendarRange,
} from "lucide-react";
import { EventType } from "@prisma/client";
import EditEventModal from "./EditEventModal";

interface EventOverviewProps {
  id: string;
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  status: string;
  type: EventType;
  venue: string | null;
  startAt: string;
  endAt: string | null;
  registrationStart: string | null;
  registrationEnd: string | null;
  capacity: number | null;
  whatsappLink: string | null;
}

export default function EventOverview({ id }: EventOverviewProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchEvent() {
    setLoading(true);

    try {
      const { data } = await axios.get(`/api/events/${id}`);

      setEvent(data.event);
    } catch (error) {
      console.error(error);

      setEvent(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const statusColor = useMemo(() => {
    switch (event?.status) {
      case "ONGOING":
        return "bg-green-500";

      case "UPCOMING":
        return "bg-blue-500";

      case "COMPLETED":
        return "bg-neutral-500";

      default:
        return "bg-red-500";
    }
  }, [event]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-[340px] rounded-[32px] bg-white/5" />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-36 rounded-3xl bg-white/5" />
          ))}
        </div>

        <div className="h-72 rounded-3xl bg-white/5" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#121212] p-10 text-center text-neutral-500">
        Event not found.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HERO */}

      <section className="relative overflow-hidden rounded-[32px] border border-white/10">
        <img
          src={event.imageUrl ?? "/placeholder.jpg"}
          alt={event.title}
          className="h-[420px] w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="absolute right-6 top-6">
          <span className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-5 py-2 backdrop-blur-xl">
            <span className={`h-2.5 w-2.5 rounded-full ${statusColor}`} />

            <span className="text-sm font-medium">{event.status}</span>
          </span>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-10">
          <div className="max-w-3xl">
            <p className="mb-3 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs tracking-wide text-neutral-300 backdrop-blur">
              {event.type}
            </p>

            <h1 className="text-5xl font-bold tracking-tight">{event.title}</h1>

            <p className="mt-5 text-lg leading-8 text-neutral-300">
              {event.description ??
                "No description has been provided for this event."}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => setIsEditOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-black transition hover:scale-[1.03]"
            >
              <Pencil size={18} />
              Edit Event
            </button>
          </div>
        </div>
      </section>

      {/* Content */}

      <section className="grid gap-8 xl:grid-cols-[2fr_1fr]">
        {/* Left */}

        <div className="space-y-8">
          {/* About */}

          <div className="rounded-[30px] border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-8 backdrop-blur-xl">
            <div className="mb-8 flex items-center gap-3">
              <div className="rounded-2xl bg-blue-500/15 p-3">
                <CalendarRange className="h-6 w-6 text-blue-400" />
              </div>

              <div>
                <h2 className="text-2xl font-semibold">About Event</h2>

                <p className="text-sm text-neutral-500">
                  Description and overview
                </p>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="leading-8 text-neutral-300">
                {event.description ??
                  "No description has been provided for this event."}
              </p>
            </div>
          </div>

          {/* Details */}

          <div className="rounded-[30px] border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-8">
            <h2 className="mb-8 text-2xl font-semibold">Event Details</h2>

            <div className="grid gap-5 md:grid-cols-2">
              <DetailCard label="Event Type" value={event.type} />

              <DetailCard label="Status" value={event.status} />

              <DetailCard
                label="Venue"
                value={event.venue ?? "Not specified"}
              />

              <DetailCard
                label="Capacity"
                value={
                  event.capacity ? `${event.capacity} attendees` : "Unlimited"
                }
              />

              <DetailCard
                label="Start Date"
                value={new Date(event.startAt).toLocaleString()}
              />

              <DetailCard
                label="Registration Ends"
                value={
                  event.registrationEnd
                    ? new Date(event.registrationEnd).toLocaleString()
                    : "Not Configured"
                }
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}

        <div className="space-y-6">
          {/* Status */}

          <div className="rounded-[30px] border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-7">
            <h3 className="mb-6 text-lg font-semibold">Event Status</h3>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="mb-3 flex items-center gap-3">
                <span className={`h-3 w-3 rounded-full ${statusColor}`} />

                <span className="font-medium">{event.status}</span>
              </div>

              <p className="text-sm leading-7 text-neutral-400">
                {event.status === "UPCOMING" &&
                  "The event is scheduled and registrations are open."}

                {event.status === "ONGOING" && "The event is currently live."}

                {event.status === "COMPLETED" &&
                  "The event has ended successfully."}

                {event.status === "CANCELLED" &&
                  "This event has been cancelled."}
              </p>
            </div>
          </div>

          {/* Progress */}

          <div className="rounded-[30px] border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-7">
            <h3 className="mb-6 text-lg font-semibold">
              Registration Progress
            </h3>

            <div className="space-y-5">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-neutral-400">Capacity Used</span>

                  <span>0%</span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-0 rounded-full bg-white transition-all duration-700" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <MiniStat title="Responses" value="0" />

                <MiniStat
                  title="Capacity"
                  value={event.capacity?.toString() ?? "∞"}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {event && (
        <EditEventModal
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          event={event}
          onUpdated={() => {
            fetchEvent();
            setIsEditOpen(false);
          }}
        />
      )}
    </div>
  );
}

interface DetailCardProps {
  label: string;
  value: string;
}

function DetailCard({ label, value }: DetailCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:border-white/20 hover:bg-white/[0.03]">
      <p className="text-sm text-neutral-500">{label}</p>

      <p className="mt-2 text-lg font-medium text-white">{value}</p>
    </div>
  );
}

interface MiniStatProps {
  title: string;
  value: string;
}

function MiniStat({ title, value }: MiniStatProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-sm text-neutral-500">{title}</p>

      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
