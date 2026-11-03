"use client";

import React from "react";
import { EventStatusType, EventType } from "@prisma/client";
import { Upload, X } from "lucide-react";

export type EventFormData = {
  title: string;
  description: string;

  type: EventType;
  status: EventStatusType;

  venue: string;

  startAt: string;
  endAt: string;

  registrationStart: string;
  registrationEnd: string;

  capacity: string;

  whatsappLink: string;
};

type FieldErrors = Record<string, string>;

const blurOnWheel = (e: React.WheelEvent<HTMLInputElement>) =>
  e.currentTarget.blur();

interface EventModalProps {
  eventId: string | null;

  form: EventFormData;

  errors: FieldErrors;

  imagePreview: string | null;

  isSaving: boolean;

  updateField: (
    key: keyof EventFormData,
    value: string | EventType | EventStatusType
  ) => void;

  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;

  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;

  onClose: () => void;

  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const EventModal = ({
  eventId,
  form,
  errors,
  imagePreview,
  isSaving,
  updateField,
  setImageFile,
  setImagePreview,
  onClose,
  onSubmit,
}: EventModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0A0A0A] p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">
            {eventId ? "Edit Event" : "Create Event"}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-400 transition hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Banner */}
          <div className="flex items-center gap-4">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Upload className="h-8 w-8 text-neutral-600" />
              )}
            </div>

            <label className="cursor-pointer rounded-xl border border-white/10 px-4 py-2 text-sm text-neutral-400 transition hover:border-white/20 hover:text-white">
              {imagePreview ? "Change Banner" : "Upload Banner"}

              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (!file) return;

                  setImageFile(file);

                  const reader = new FileReader();

                  reader.onloadend = () =>
                    setImagePreview(reader.result as string);

                  reader.readAsDataURL(file);
                }}
              />
            </label>
          </div>

          {/* Title */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              Title
            </label>

            <input
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className={`mt-1 w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white transition focus:outline-none ${
                errors.title
                  ? "border-red-500"
                  : "border-white/10 focus:border-white/20"
              }`}
            />

            {errors.title && (
              <p className="mt-1 text-xs text-red-400">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              Description
            </label>

            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="mt-1 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition focus:border-white/20 focus:outline-none"
            />
          </div>

          {/* Type + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                Type
              </label>

              <select
                value={form.type}
                onChange={(e) =>
                  updateField("type", e.target.value as EventType)
                }
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-white/20 focus:outline-none"
              >
                {Object.values(EventType).map((type) => (
                  <option key={type} value={type} className="bg-[#0A0A0A]">
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                Status
              </label>

              <select
                value={form.status}
                onChange={(e) =>
                  updateField("status", e.target.value as EventStatusType)
                }
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-white/20 focus:outline-none"
              >
                {Object.values(EventStatusType).map((status) => (
                  <option key={status} value={status} className="bg-[#0A0A0A]">
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Venue */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              Venue
            </label>

            <input
              value={form.venue}
              onChange={(e) => updateField("venue", e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition focus:border-white/20 focus:outline-none"
              placeholder="Main Auditorium"
            />
          </div>

          {/* Start + End */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                Start At
              </label>

              <input
                type="datetime-local"
                value={form.startAt}
                onChange={(e) => updateField("startAt", e.target.value)}
                onWheel={blurOnWheel}
                className={`mt-1 w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white transition focus:outline-none ${
                  errors.startAt
                    ? "border-red-500"
                    : "border-white/10 focus:border-white/20"
                }`}
              />

              {errors.startAt && (
                <p className="mt-1 text-xs text-red-400">{errors.startAt}</p>
              )}
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                End At
              </label>

              <input
                type="datetime-local"
                value={form.endAt}
                onChange={(e) => updateField("endAt", e.target.value)}
                onWheel={blurOnWheel}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-white/20 focus:outline-none"
              />
            </div>
          </div>

          {/* Registration Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                Registration Starts
              </label>

              <input
                type="datetime-local"
                value={form.registrationStart}
                onChange={(e) =>
                  updateField("registrationStart", e.target.value)
                }
                onWheel={blurOnWheel}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-white/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                Registration Ends
              </label>

              <input
                type="datetime-local"
                value={form.registrationEnd}
                onChange={(e) => updateField("registrationEnd", e.target.value)}
                onWheel={blurOnWheel}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-white/20 focus:outline-none"
              />
            </div>
          </div>

          {/* Capacity */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              Capacity
            </label>

            <input
              type="number"
              min={1}
              value={form.capacity}
              onChange={(e) => updateField("capacity", e.target.value)}
              onWheel={blurOnWheel}
              placeholder="100"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-white/20 focus:outline-none"
            />
          </div>

          {/* WhatsApp Group Link */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              WhatsApp Group Link{" "}
              <span className="normal-case tracking-normal text-neutral-600">
                (optional)
              </span>
            </label>

            <input
              type="url"
              value={form.whatsappLink}
              onChange={(e) => updateField("whatsappLink", e.target.value)}
              placeholder="https://chat.whatsapp.com/..."
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-white/20 focus:outline-none"
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 py-3 text-neutral-400 transition hover:border-white/20 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 rounded-xl bg-white py-3 font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving
                ? "Saving..."
                : eventId
                  ? "Update Event"
                  : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
