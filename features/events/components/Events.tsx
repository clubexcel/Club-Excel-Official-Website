"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  ArrowRight,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { EventItem } from "../actions/events";
import { EventStatusType } from "@prisma/client";
import ImageCarousel from "./Imagecarousal";

interface EventsProps {
  events?: EventItem[];
}

const statusLabel = (status: EventStatusType) =>
  status.charAt(0) + status.slice(1).toLowerCase();

const registerHref = (event: EventItem) => `/events/${event.id}/register`;

const EventDetailsModal = ({
  event,
  onClose,
}: {
  event: EventItem;
  onClose: () => void;
}) => {
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
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-6xl bg-[#080808] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.2)] flex flex-col md:flex-row max-h-[90vh]"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="md:w-1/2 h-64 md:h-auto flex-shrink-0 overflow-hidden">
          <ImageCarousel images={event.imageUrl ? [event.imageUrl] : []} />
        </div>

        <div className="flex-1 p-8 md:p-12 overflow-y-auto bg-gradient-to-br from-indigo-500/[0.02] to-transparent">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span
              className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-black border border-white/10 ${
                isUpcoming
                  ? "bg-indigo-600 text-white"
                  : "bg-neutral-800 text-neutral-300"
              }`}
            >
              {statusLabel(event.status)}
            </span>

            <span className="px-4 py-1.5 rounded-full bg-white/5 text-[10px] uppercase tracking-[0.2em] font-black text-neutral-300 border border-white/10">
              {event.type.replace("_", " ")}
            </span>

            {!!event._count?.responses && (
              <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] uppercase tracking-[0.2em] font-black border border-indigo-500/20">
                <Users className="w-3 h-3" />
                {event._count.responses} Registered
              </span>
            )}
          </div>

          <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
            {event.title}
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[
              ["Date", new Date(event.startAt).toLocaleDateString("en-IN")],
              [
                "Start",
                new Date(event.startAt).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              ],
              ["Venue", event.venue ?? "TBA"],
            ].map(([label, val]) => (
              <div key={label} className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-neutral-600 font-black">
                  {label}
                </p>
                <p className="text-lg font-bold text-white">{val}</p>
              </div>
            ))}
          </div>

          {event.description && (
            <div className="p-6 bg-white/[0.03] border border-white/5 rounded-[2rem] mb-8">
              <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-indigo-500 mb-4">
                <ShieldCheck className="w-4 h-4" />
                Details
              </h4>
              <p className="text-neutral-300 whitespace-pre-wrap text-sm leading-relaxed">
                {event.description}
              </p>
            </div>
          )}

          {isUpcoming ? (
            <Link
              href={registerHref(event)}
              className="block w-full text-center bg-indigo-600 text-white font-black py-5 rounded-3xl hover:bg-white hover:text-black transition-all duration-500 uppercase tracking-widest"
            >
              Register Now <ArrowRight className="w-5 h-5 inline ml-2" />
            </Link>
          ) : (
            <div className="w-full text-center bg-neutral-800/50 text-neutral-500 font-black py-5 rounded-3xl border border-white/5 uppercase">
              Registration Closed
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const EventCard = ({ event }: { event: EventItem }) => {
  const isUpcoming = event.status === EventStatusType.UPCOMING;

  return (
    <div className="group relative bg-[#0a0a0a]/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] overflow-hidden hover:border-indigo-500/30 hover:shadow-[0_40px_80px_-20px_rgba(99,102,241,0.3)] transition-all duration-700 flex flex-col md:flex-row md:h-[320px]">
      <div className="md:w-2/5 relative h-56 md:h-auto overflow-hidden flex-shrink-0">
        <ImageCarousel images={event.imageUrl ? [event.imageUrl] : []} />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]/60 hidden md:block pointer-events-none" />
      </div>

      <div className="flex-1 p-6 flex flex-col">
        <div className="flex justify-between items-start mb-3 gap-4">
          <h3 className="text-xl font-black group-hover:text-indigo-400 transition-colors line-clamp-2">
            {event.title}
          </h3>

          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <span
              className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-black border border-white/10 ${
                isUpcoming
                  ? "bg-indigo-600 text-white"
                  : "bg-neutral-800 text-neutral-300"
              }`}
            >
              {statusLabel(event.status)}
            </span>
            <span className="text-neutral-600 text-[9px] uppercase font-black tracking-widest">
              {event.type.replace("_", " ")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {[
            {
              icon: Calendar,
              label: "Date",
              val: new Date(event.startAt).toLocaleDateString("en-IN"),
            },
            {
              icon: Clock,
              label: "Time",
              val: new Date(event.startAt).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
            { icon: MapPin, label: "Venue", val: event.venue ?? "TBA" },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-indigo-500" />
              </div>
              <div>
                <p className="text-[8px] uppercase tracking-widest text-neutral-600 font-black">
                  {label}
                </p>
                <p className="text-[10px] font-bold text-white truncate">
                  {val}
                </p>
              </div>
            </div>
          ))}
        </div>

        {event.description && (
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 mb-4 flex-1 overflow-hidden">
            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-2">
              <ShieldCheck className="w-3 h-3" />
              Details
            </h4>
            <p className="text-neutral-400 text-xs line-clamp-3">
              {event.description}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto">
          {!!event._count?.responses && (
            <span className="flex items-center gap-2 text-indigo-400 font-black uppercase text-[10px]">
              <Users className="w-4 h-4" />
              {event._count.responses} Registered
            </span>
          )}

          {isUpcoming ? (
            <Link
              href={registerHref(event)}
              onClick={(e) => e.stopPropagation()}
              className="ml-auto flex items-center gap-2 text-indigo-400 font-black uppercase text-[10px] hover:gap-4 transition-all"
            >
              Register <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="ml-auto text-neutral-600 text-[10px] font-black uppercase">
              {statusLabel(event.status)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const Events = ({ events = [] }: EventsProps) => {
  const [statusFilter, setStatusFilter] = useState<
    EventStatusType | undefined
  >();

  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const filteredEvents = statusFilter
    ? events.filter((event) => event.status === statusFilter)
    : events;

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Events</h1>
          <p className="text-neutral-400 max-w-xl mx-auto">
            Explore our workshops, hackathons, and flagship events.
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-3 justify-center mb-10">
          {[
            undefined,
            EventStatusType.UPCOMING,
            EventStatusType.ONGOING,
            EventStatusType.COMPLETED,
          ].map((status) => (
            <button
              key={status ?? "all"}
              onClick={() => setStatusFilter(status)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                statusFilter === status
                  ? "bg-white text-black"
                  : "border border-white/10 text-neutral-400 hover:text-white hover:border-white/30"
              }`}
            >
              {status ? statusLabel(status) : "All"}
            </button>
          ))}
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center text-neutral-500 py-24">
            No events found.
          </div>
        ) : (
          <div className="space-y-6">
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedEvent(event)}
                className="cursor-pointer"
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <EventDetailsModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;
