"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { EventStatusType, EventType } from "@prisma/client";

import Popup, { PopupType } from "../../shared/components/Popup";
import EventModal, { EventFormData } from "./EventModal";
import { Pagination } from "@/components/ui/Pagination";
import Link from "next/link";

interface PopupState {
  show: boolean;
  type: PopupType;
  message: string;
  isConfirm: boolean;
  onConfirm: () => void;
}
const LIMIT = 12;

const useAdminEvents = (url: string) => {
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const { data } = await axios.get(url);

      setData(data.events ?? []);
      setPagination(data.pagination ?? null);
    } catch (err) {
      console.error(err);

      setData([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return {
    data,
    pagination,
    isLoading,
    refetch: fetchData,
  } as const;
};

type FieldErrors = Record<string, string>;

const EMPTY_FORM: EventFormData = {
  title: "",
  description: "",
  type: EventType.TECH,
  status: EventStatusType.UPCOMING,
  venue: "",
  startAt: "",
  endAt: "",
  registrationStart: "",
  registrationEnd: "",
  capacity: "",
  whatsappLink: "",
};

const validateEvent = (form: EventFormData) => {
  const errors: FieldErrors = {};

  if (!form.title.trim()) {
    errors.title = "Title is required";
  }

  if (!form.type) {
    errors.type = "Type is required";
  }

  if (!form.startAt) {
    errors.startAt = "Start date is required";
  }

  return errors;
};

const AdminEvents = () => {
  const [page, setPage] = useState(1);

  const {
    data: events,
    pagination,
    isLoading,
    refetch,
  } = useAdminEvents(`/api/events?page=${page}&limit=${LIMIT}`);

  const [showModal, setShowModal] = useState(false);

  const [eventId, setEventId] = useState<string | null>(null);

  const [form, setForm] = useState<EventFormData>(EMPTY_FORM);

  const [errors, setErrors] = useState<FieldErrors>({});

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  const [popup, setPopup] = useState<PopupState>({
    show: false,
    type: "success",
    message: "",
    isConfirm: false,
    onConfirm: () => {},
  });

  const updateField = (
    key: keyof EventFormData,
    value: string | EventType | EventStatusType
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const openAdd = () => {
    setEventId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const openEdit = (event: any) => {
    setEventId(event.id);

    setErrors({});

    setForm({
      title: event.title ?? "",
      description: event.description ?? "",
      type: event.type,
      status: event.status,
      venue: event.venue ?? "",

      startAt: event.startAt
        ? new Date(event.startAt).toISOString().slice(0, 16)
        : "",

      endAt: event.endAt
        ? new Date(event.endAt).toISOString().slice(0, 16)
        : "",

      registrationStart: event.registrationStart
        ? new Date(event.registrationStart).toISOString().slice(0, 16)
        : "",

      registrationEnd: event.registrationEnd
        ? new Date(event.registrationEnd).toISOString().slice(0, 16)
        : "",

      capacity: event.capacity?.toString() ?? "",

      whatsappLink: event.whatsappLink ?? "",
    });

    setImagePreview(event.imageUrl ?? null);
    setImageFile(null);
    setShowModal(true);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateEvent(form);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSaving(true);

    try {
      const fd = new FormData();

      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("type", form.type);
      fd.append("status", form.status);
      fd.append("venue", form.venue);

      fd.append("startAt", form.startAt);

      if (form.endAt) {
        fd.append("endAt", form.endAt);
      }

      if (form.registrationStart) {
        fd.append("registrationStart", form.registrationStart);
      }

      if (form.registrationEnd) {
        fd.append("registrationEnd", form.registrationEnd);
      }

      if (form.capacity) {
        fd.append("capacity", form.capacity);
      }

      if (form.whatsappLink) {
        fd.append("whatsappLink", form.whatsappLink);
      }

      if (imageFile) {
        fd.append("image", imageFile);
      }

      const url = eventId ? `/api/events/${eventId}` : "/api/events";

      const method = eventId ? "PATCH" : "POST";

      const { data } = await axios({
        url,
        method,
        data: fd,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await refetch();

      setPopup({
        show: true,
        type: "success",
        message: data.message,
        isConfirm: false,
        onConfirm: () => {},
      });

      setShowModal(false);
      setEventId(null);
      setForm(EMPTY_FORM);
      setErrors({});
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setPopup({
          show: true,
          type: "error",
          message: err.response?.data?.message ?? "Something went wrong.",
          isConfirm: false,
          onConfirm: () => {},
        });
      } else {
        setPopup({
          show: true,
          type: "error",
          message: "Something went wrong.",
          isConfirm: false,
          onConfirm: () => {},
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">
          Events
          <span className="ml-2 text-sm font-normal text-neutral-500">
            ({pagination?.total ?? events.length})
          </span>
        </h2>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200"
        >
          <Plus className="h-4 w-4" />
          Add Event
        </button>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-[#111] transition hover:border-white/20"
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={event.imageUrl ?? "/placeholder.jpg"}
                alt={event.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Hover Actions */}
              <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
                <button
                  onClick={() => openEdit(event)}
                  className="rounded-lg bg-black/60 p-2 text-white backdrop-blur transition hover:bg-white hover:text-black"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3 p-5">
              <div>
                <h3 className="truncate text-lg font-semibold text-white">
                  {event.title}
                </h3>

                <p className="mt-1 line-clamp-2 text-sm text-neutral-400">
                  {event.description || "No description"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-neutral-300">
                  {event.type}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    event.status === "UPCOMING"
                      ? "bg-blue-500/20 text-blue-300"
                      : event.status === "ONGOING"
                        ? "bg-green-500/20 text-green-300"
                        : event.status === "COMPLETED"
                          ? "bg-neutral-500/20 text-neutral-300"
                          : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {event.status}
                </span>
              </div>

              <div className="space-y-1 text-xs text-neutral-500">
                <p>
                  <span className="text-neutral-400">Start:</span>{" "}
                  {new Date(event.startAt).toLocaleString()}
                </p>

                {event.venue && (
                  <p>
                    <span className="text-neutral-400">Venue:</span>{" "}
                    {event.venue}
                  </p>
                )}

                {event.capacity && (
                  <p>
                    <span className="text-neutral-400">Capacity:</span>{" "}
                    {event.capacity}
                  </p>
                )}
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/dashboard/events/${event.id}`}
                    className="flex-1 rounded-xl bg-white px-4 py-2 text-center text-sm font-semibold text-black transition hover:bg-neutral-200"
                  >
                    Manage Event
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={setPage}
        />
      )}

      {/* Event Modal */}
      {showModal && (
        <EventModal
          eventId={eventId}
          form={form}
          errors={errors}
          imagePreview={imagePreview}
          isSaving={isSaving}
          updateField={updateField}
          setImageFile={setImageFile}
          setImagePreview={setImagePreview}
          onClose={() => setShowModal(false)}
          onSubmit={onSubmit}
        />
      )}

      {/* Popup */}
      <Popup
        show={popup.show}
        type={popup.type}
        message={popup.message}
        isConfirm={popup.isConfirm}
        onConfirm={popup.onConfirm}
        onClose={() =>
          setPopup((prev) => ({
            ...prev,
            show: false,
          }))
        }
      />
    </div>
  );
};

export default AdminEvents;
