"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Popup from "../../shared/components/Popup";

interface EventSettingsProps {
  id: string;
}

const EventSettings = ({ id }: EventSettingsProps) => {
  const router = useRouter();

  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [togglingRegistration, setTogglingRegistration] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchEvent() {
      setLoadingStatus(true);

      try {
        const { data } = await axios.get(`/api/events/${id}`);

        if (!cancelled) {
          setRegistrationEnabled(data.event.registrationEnabled ?? true);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) {
          setLoadingStatus(false);
        }
      }
    }

    fetchEvent();

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleToggleRegistration() {
    const next = !registrationEnabled;

    setTogglingRegistration(true);

    try {
      const formData = new FormData();

      formData.append("registrationEnabled", String(next));

      await axios.patch(`/api/events/${id}`, formData);

      setRegistrationEnabled(next);
    } catch (error) {
      console.error(error);

      alert("Failed to update registration status.");
    } finally {
      setTogglingRegistration(false);
    }
  }

  async function handleDelete() {
    setShowConfirm(true);
  }

  async function performDelete() {
    setShowConfirm(false);
    setDeleting(true);

    try {
      await axios.delete(`/api/events/${id}`);

      router.push("/dashboard?tab=events");
    } catch (error) {
      console.error(error);

      alert("Failed to delete event.");

      setDeleting(false);
    }
  }

  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Settings</h2>

      <div className="rounded-3xl border border-white/10 bg-[#111] p-8">
        <h3 className="text-lg font-semibold text-white">Event Settings</h3>

        <div className="mt-8 space-y-5">
          <div className="flex items-center justify-between rounded-2xl border border-white/10 p-5">
            <div>
              <p className="font-medium text-white">Registration</p>

              <p className="text-sm text-neutral-500">
                Enable or disable registrations.
              </p>
            </div>

            <button
              onClick={handleToggleRegistration}
              disabled={loadingStatus || togglingRegistration}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
                registrationEnabled
                  ? "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                  : "bg-white/10 text-neutral-300 hover:bg-white/20"
              }`}
            >
              {togglingRegistration && (
                <Loader2 size={16} className="animate-spin" />
              )}
              {loadingStatus
                ? "Loading..."
                : registrationEnabled
                  ? "Enabled"
                  : "Disabled"}
            </button>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-red-500/30 bg-red-500/5 p-5">
            <div>
              <p className="font-medium text-red-400">Delete Event</p>

              <p className="text-sm text-red-300/70">
                Permanently remove this event.
              </p>
            </div>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleting && <Loader2 size={16} className="animate-spin" />}
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
      <Popup
        show={showConfirm}
        type="confirm"
        message="This will permanently delete this event and cannot be undone. Are you sure?"
        onClose={() => setShowConfirm(false)}
        onConfirm={performDelete}
        isConfirm={true}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default EventSettings;
