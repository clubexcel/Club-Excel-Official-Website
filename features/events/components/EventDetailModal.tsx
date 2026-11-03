"use client";

import Link from "next/link";
import { Calendar, Clock, MapPin, Users, X } from "lucide-react";
import { motion } from "framer-motion";
import { EventStatusType } from "@prisma/client";

import type { EventItem } from "../actions/events";
import ImageCarousel from "./Imagecarousal";

interface EventDetailsModalProps {
  event: EventItem;
  onClose: () => void;
}

export default function EventDetailsModal({
  event,
  onClose,
}: EventDetailsModalProps) {
  const isUpcoming = event.status === EventStatusType.UPCOMING;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
    >
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] border border-white/10 bg-[#0A0A0A] p-6 md:p-8"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full bg-white/5 p-2 text-neutral-400 hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 h-48 overflow-hidden rounded-2xl">
          <ImageCarousel images={event.imageUrl ? [event.imageUrl] : []} />
        </div>

        <h2 className="mb-2 text-2xl font-bold text-white">{event.title}</h2>

        <div className="mb-4 flex flex-wrap gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
              isUpcoming
                ? "bg-blue-500/20 text-blue-400"
                : "bg-neutral-500/20 text-neutral-400"
            }`}
          >
            {event.status.charAt(0) + event.status.slice(1).toLowerCase()}
          </span>

          <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-neutral-300">
            {event.type}
          </span>
        </div>

        {event.description && (
          <p className="mb-6 text-sm leading-relaxed text-neutral-400">
            {event.description}
          </p>
        )}

        <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-neutral-400">
            <Calendar className="h-4 w-4 text-blue-400" />
            {new Date(event.startAt).toLocaleDateString("en-IN")}
          </div>

          <div className="flex items-center gap-2 text-neutral-400">
            <Clock className="h-4 w-4 text-blue-400" />
            {new Date(event.startAt).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="flex items-center gap-2 text-neutral-400">
            <Users className="h-4 w-4 text-blue-400" />
            Capacity: {event.capacity ?? "Unlimited"}
          </div>

          <div className="flex items-center gap-2 text-neutral-400">
            <MapPin className="h-4 w-4 text-blue-400" />
            {event.venue ?? "Venue will be announced"}
          </div>
        </div>

        {isUpcoming && (
          <Link
            href={`/events/${event.id}/register`}
            className="block w-full rounded-2xl bg-white py-4 text-center font-bold text-black transition-all hover:bg-neutral-200"
          >
            Register Now
          </Link>
        )}
      </motion.div>
    </motion.div>
  );
}
