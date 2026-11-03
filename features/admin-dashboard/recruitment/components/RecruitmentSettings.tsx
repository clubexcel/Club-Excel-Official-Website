"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2, Lock, Unlock } from "lucide-react";
import Popup from "../../shared/components/Popup";
import {
  SelectField,
  TextAreaField,
  TextField,
} from "../../shared/components/FormField";

interface RecruitmentSettingsProps {
  id: string;
}

interface DriveFormState {
  title: string;
  description: string;
  year: number;
  status: "UPCOMING" | "OPEN" | "CLOSED";
  registrationStart: string;
  registrationEnd: string;
  whatsappLink: string;
}

const toDatetimeLocal = (value: string | null) => {
  if (!value) return "";
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

const statusStyles: Record<DriveFormState["status"], string> = {
  OPEN: "bg-green-500/15 text-green-300 ring-1 ring-green-500/30",
  UPCOMING: "bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/30",
  CLOSED: "bg-white/10 text-neutral-400 ring-1 ring-white/10",
};

const RecruitmentSettings = ({ id }: RecruitmentSettingsProps) => {
  const router = useRouter();

  const [form, setForm] = useState<DriveFormState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [togglingRegistration, setTogglingRegistration] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [popup, setPopup] = useState({
    show: false,
    type: "success" as const,
    message: "",
    isConfirm: false,
    onConfirm: () => {},
  });

  const fetchDrive = async () => {
    setLoading(true);

    try {
      const { data } = await axios.get(`/api/recruitment/${id}`);

      const d = data.drive;
      setForm({
        title: d.title,
        description: d.description ?? "",
        year: d.year,
        status: d.status,
        registrationStart: toDatetimeLocal(d.registrationStart),
        registrationEnd: toDatetimeLocal(d.registrationEnd),
        whatsappLink: d.whatsappLink ?? "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const updateField = <K extends keyof DriveFormState>(
    key: K,
    value: DriveFormState[K]
  ) => setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  const setRegistrationStatus = async (status: "OPEN" | "CLOSED") => {
    setTogglingRegistration(true);

    try {
      await axios.patch(`/api/recruitment/${id}`, { status });
      await fetchDrive();

      setPopup({
        show: true,
        type: "success",
        message:
          status === "OPEN"
            ? "Registration is now open — this drive is live on /recruitment."
            : "Registration is now closed.",
        isConfirm: false,
        onConfirm: () => {},
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        `Failed to ${status === "OPEN" ? "open" : "close"} registration.`;

      setPopup({
        show: true,
        type: "success",
        message,
        isConfirm: false,
        onConfirm: () => {},
      });
    } finally {
      setTogglingRegistration(false);
    }
  };

  const handleSave = async () => {
    if (!form) return;

    setSaving(true);

    try {
      await axios.patch(`/api/recruitment/${id}`, form);
      await fetchDrive();

      setPopup({
        show: true,
        type: "success",
        message: "Drive settings saved.",
        isConfirm: false,
        onConfirm: () => {},
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? "Failed to save drive settings.";

      setPopup({
        show: true,
        type: "success",
        message,
        isConfirm: false,
        onConfirm: () => {},
      });
    } finally {
      setSaving(false);
    }
  };

  const performDelete = async () => {
    setShowConfirm(false);
    setDeleting(true);

    try {
      await axios.delete(`/api/recruitment/${id}`);

      router.push("/dashboard?tab=recruitment");
    } catch (error) {
      console.error(error);

      setPopup({
        show: true,
        type: "success",
        message: "Failed to delete this drive.",
        isConfirm: false,
        onConfirm: () => {},
      });

      setDeleting(false);
    }
  };

  if (loading || !form) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Settings</h2>

      <div className="rounded-3xl border border-white/10 bg-[#111] p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Registration Status
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              Only one drive can be open for applications at a time.
            </p>
          </div>

          <span
            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${statusStyles[form.status]}`}
          >
            {form.status}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => setRegistrationStatus("OPEN")}
            disabled={togglingRegistration || form.status === "OPEN"}
            className="flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-semibold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {togglingRegistration ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Unlock size={16} />
            )}
            Open Registration
          </button>

          <button
            onClick={() => setRegistrationStatus("CLOSED")}
            disabled={togglingRegistration || form.status === "CLOSED"}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {togglingRegistration ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Lock size={16} />
            )}
            Close Registration
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#111] p-8">
        <h3 className="text-lg font-semibold text-white">Drive Details</h3>

        <div className="mt-8 space-y-5">
          <TextField
            label="Title"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
          />

          <TextAreaField
            label="Description"
            optional
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Year"
              type="number"
              value={form.year}
              onChange={(e) => updateField("year", Number(e.target.value))}
            />
            <SelectField
              label="Status"
              value={form.status}
              onChange={(e) =>
                updateField(
                  "status",
                  e.target.value as DriveFormState["status"]
                )
              }
              options={[
                { label: "Upcoming", value: "UPCOMING" },
                { label: "Open", value: "OPEN" },
                { label: "Closed", value: "CLOSED" },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Registration Start"
              optional
              type="datetime-local"
              value={form.registrationStart}
              onChange={(e) => updateField("registrationStart", e.target.value)}
            />
            <TextField
              label="Registration End"
              optional
              type="datetime-local"
              value={form.registrationEnd}
              onChange={(e) => updateField("registrationEnd", e.target.value)}
            />
          </div>

          <TextField
            label="WhatsApp Group Link"
            optional
            type="url"
            placeholder="https://chat.whatsapp.com/..."
            value={form.whatsappLink}
            onChange={(e) => updateField("whatsappLink", e.target.value)}
          />

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#111] p-8">
        <div className="flex items-center justify-between rounded-2xl border border-red-500/30 bg-red-500/5 p-5">
          <div>
            <p className="font-medium text-red-400">Delete Drive</p>
            <p className="text-sm text-red-300/70">
              Permanently removes this drive, its form, and every application
              submitted to it.
            </p>
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            disabled={deleting}
            className="flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting && <Loader2 size={16} className="animate-spin" />}
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <Popup
        show={showConfirm}
        type="confirm"
        message="This will permanently delete this drive, its form fields, and every application submitted to it. Are you sure?"
        onClose={() => setShowConfirm(false)}
        onConfirm={performDelete}
        isConfirm={true}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <Popup
        show={popup.show}
        type={popup.type}
        message={popup.message}
        isConfirm={popup.isConfirm}
        onConfirm={popup.onConfirm}
        onClose={() => setPopup((p) => ({ ...p, show: false }))}
      />
    </div>
  );
};

export default RecruitmentSettings;
