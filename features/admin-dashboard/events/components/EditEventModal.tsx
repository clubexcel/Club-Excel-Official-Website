"use client";

import { useEffect, useState, type WheelEvent } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Calendar,
  MapPin,
  Users,
  FileText,
  Tag,
  Loader2,
} from "lucide-react";

import { EventType } from "@prisma/client";

interface Event {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  type: EventType;
  venue: string | null;
  startAt: string;
  endAt: string | null;
  registrationStart: string | null;
  registrationEnd: string | null;
  capacity: number | null;
  whatsappLink: string | null;
}

interface EditEventModalProps {
  open: boolean;
  event: Event;
  onClose: () => void;
  onUpdated: () => void;
}

const blurOnWheel = (e: WheelEvent<HTMLInputElement>) => e.currentTarget.blur();

function toInputDate(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  const offset = date.getTimezoneOffset();

  const local = new Date(date.getTime() - offset * 60000);

  return local.toISOString().slice(0, 16);
}

export default function EditEventModal({
  open,
  event,
  onClose,
  onUpdated,
}: EditEventModalProps) {
  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(
    event.imageUrl ?? "/placeholder.jpg"
  );

  useEffect(() => {
    if (!image) {
      setPreview(event.imageUrl ?? "/placeholder.jpg");
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [image, event.imageUrl]);

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [venue, setVenue] = useState("");

  const [type, setType] = useState<EventType>(EventType.NON_TECH);

  const [capacity, setCapacity] = useState("");

  const [startAt, setStartAt] = useState("");

  const [endAt, setEndAt] = useState("");

  const [registrationStart, setRegistrationStart] = useState("");

  const [registrationEnd, setRegistrationEnd] = useState("");

  const [whatsappLink, setWhatsappLink] = useState("");

  useEffect(() => {
    if (!event) return;

    setTitle(event.title);

    setDescription(event.description ?? "");

    setVenue(event.venue ?? "");

    setType(event.type);

    setCapacity(event.capacity?.toString() ?? "");

    setStartAt(toInputDate(event.startAt));

    setEndAt(toInputDate(event.endAt));

    setRegistrationStart(toInputDate(event.registrationStart));

    setRegistrationEnd(toInputDate(event.registrationEnd));

    setWhatsappLink(event.whatsappLink ?? "");

    setImage(null);
  }, [event]);

  async function handleSubmit() {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title.trim());

      formData.append("description", description.trim());

      formData.append("type", type);

      formData.append("venue", venue.trim());

      formData.append("startAt", startAt);

      formData.append("endAt", endAt);

      formData.append("registrationStart", registrationStart);

      formData.append("registrationEnd", registrationEnd);

      formData.append("capacity", capacity);

      formData.append("whatsappLink", whatsappLink.trim());

      if (image) {
        formData.append("image", image);
      }

      await axios.patch(`/api/events/${event.id}`, formData);

      onUpdated();

      onClose();
    } catch (error) {
      console.error(error);

      alert("Failed to update event.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center p-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-lg"
        />

        <motion.div
          initial={{
            scale: 0.96,
            opacity: 0,
            y: 20,
          }}
          animate={{
            scale: 1,
            opacity: 1,
            y: 0,
          }}
          exit={{
            scale: 0.96,
            opacity: 0,
            y: 20,
          }}
          transition={{
            duration: 0.25,
          }}
          className="relative z-10 max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[32px] border border-white/10 bg-[#0d0d0d]"
        >
          {/* Header */}

          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#0d0d0d]/95 px-8 py-6 backdrop-blur">
            <div>
              <h2 className="text-3xl font-bold">Edit Event</h2>

              <p className="mt-1 text-neutral-500">
                Update event details and save changes.
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-8 p-8">
            <div>
              <label className="mb-3 block text-sm font-medium text-neutral-300">
                Event Banner
              </label>

              <label className="group relative block cursor-pointer overflow-hidden rounded-[28px] border border-white/10">
                <img
                  src={preview}
                  alt=""
                  className="h-72 w-full object-cover transition duration-300 group-hover:scale-105"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition group-hover:opacity-100">
                  <div className="rounded-2xl bg-white px-6 py-3 font-semibold text-black">
                    <Upload className="mr-2 inline h-5 w-5" />
                    Change Banner
                  </div>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm text-neutral-400">
                  <FileText size={16} />
                  Title
                </label>

                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none transition focus:border-white/20"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm text-neutral-400">
                  <Tag size={16} />
                  Event Type
                </label>

                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as EventType)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none"
                >
                  {Object.values(EventType).map((item) => (
                    <option key={item} value={item} className="bg-[#111]">
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-neutral-400">
                Description
              </label>

              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none transition focus:border-white/20"
              />
            </div>

            {/* Event Details */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm text-neutral-400">
                  <MapPin size={16} />
                  Venue
                </label>

                <input
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="Auditorium, Seminar Hall..."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none transition focus:border-white/20"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm text-neutral-400">
                  <Users size={16} />
                  Capacity
                </label>

                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  onWheel={blurOnWheel}
                  placeholder="Leave empty for unlimited"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none transition focus:border-white/20"
                />
              </div>
            </div>

            {/* Event Schedule */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
              <h3 className="mb-6 text-xl font-semibold">Event Schedule</h3>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm text-neutral-400">
                    <Calendar size={16} />
                    Start Date & Time
                  </label>

                  <input
                    type="datetime-local"
                    value={startAt}
                    onChange={(e) => setStartAt(e.target.value)}
                    onWheel={blurOnWheel}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none transition focus:border-white/20"
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm text-neutral-400">
                    <Calendar size={16} />
                    End Date & Time
                  </label>

                  <input
                    type="datetime-local"
                    value={endAt}
                    onChange={(e) => setEndAt(e.target.value)}
                    onWheel={blurOnWheel}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none transition focus:border-white/20"
                  />
                </div>
              </div>
            </div>

            {/* Registration */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
              <h3 className="mb-6 text-xl font-semibold">
                Registration Window
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-neutral-400">
                    Registration Opens
                  </label>

                  <input
                    type="datetime-local"
                    value={registrationStart}
                    onChange={(e) => setRegistrationStart(e.target.value)}
                    onWheel={blurOnWheel}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none transition focus:border-white/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-neutral-400">
                    Registration Closes
                  </label>

                  <input
                    type="datetime-local"
                    value={registrationEnd}
                    onChange={(e) => setRegistrationEnd(e.target.value)}
                    onWheel={blurOnWheel}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none transition focus:border-white/20"
                  />
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
              <h3 className="mb-6 text-xl font-semibold">
                WhatsApp Group Link
              </h3>

              <input
                type="url"
                value={whatsappLink}
                onChange={(e) => setWhatsappLink(e.target.value)}
                placeholder="https://chat.whatsapp.com/..."
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none transition focus:border-white/20"
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-4 border-t border-white/10 pt-8">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-2xl border border-white/10 px-6 py-3 transition hover:bg-white/5 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 rounded-2xl bg-white px-7 py-3 font-semibold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
