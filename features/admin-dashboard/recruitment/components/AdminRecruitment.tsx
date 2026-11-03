"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  Plus,
  Users,
  Calendar,
  Trash2,
  ArrowRight,
  Lock,
  Unlock,
  Loader2,
} from "lucide-react";

import { Pagination } from "@/components/ui/Pagination";
import Popup from "../../shared/components/Popup";
import RecruitmentDriveModal, {
  RecruitmentDriveFormData,
} from "./RecruitmentModal";

const LIMIT = 9;

interface RecruitmentDrive {
  id: string;
  title: string;
  description: string | null;
  year: number;
  status: "UPCOMING" | "OPEN" | "CLOSED";
  registrationStart: string | null;
  registrationEnd: string | null;
  createdAt: string;
  _count: { responses: number };
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const statusStyles: Record<RecruitmentDrive["status"], string> = {
  OPEN: "bg-green-500/15 text-green-300 ring-1 ring-green-500/30",
  UPCOMING: "bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/30",
  CLOSED: "bg-white/10 text-neutral-400 ring-1 ring-white/10",
};

export default function AdminRecruitment() {
  const [page, setPage] = useState(1);
  const [drives, setDrives] = useState<RecruitmentDrive[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [popup, setPopup] = useState({
    show: false,
    type: "success" as const,
    message: "",
    isConfirm: false,
    onConfirm: () => {},
  });

  const fetchDrives = async (pageNum = page) => {
    setIsLoading(true);

    try {
      const { data } = await axios.get("/api/recruitment", {
        params: {
          page: pageNum,
          limit: LIMIT,
          sortBy: "year",
          sortOrder: "desc",
        },
      });

      setDrives(data.drives ?? []);
      setPagination(data.pagination ?? null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives(page);
  }, [page]);

  const createDrive = async (data: RecruitmentDriveFormData) => {
    setIsCreating(true);

    try {
      await axios.post("/api/recruitment", data);
      setShowCreateModal(false);
      fetchDrives(1);
      setPage(1);
    } catch (err) {
      console.error(err);
      setPopup({
        show: true,
        type: "success",
        message: "Unable to create this drive.",
        isConfirm: false,
        onConfirm: () => {},
      });
    } finally {
      setIsCreating(false);
    }
  };

  const deleteDrive = async (drive: RecruitmentDrive) => {
    try {
      await axios.delete(`/api/recruitment/${drive.id}`);
      fetchDrives(page);
    } catch (err) {
      console.error(err);
      setPopup({
        show: true,
        type: "success",
        message: "Unable to delete this drive.",
        isConfirm: false,
        onConfirm: () => {},
      });
    }
  };

  const confirmDelete = (drive: RecruitmentDrive) => {
    setPopup({
      show: true,
      type: "success",
      message: `Delete "${drive.title}"? This removes its form and every application submitted to it.`,
      isConfirm: true,
      onConfirm: () => {
        deleteDrive(drive);
        setPopup((p) => ({ ...p, show: false }));
      },
    });
  };

  const setRegistrationStatus = async (
    drive: RecruitmentDrive,
    status: "OPEN" | "CLOSED"
  ) => {
    setTogglingId(drive.id);

    try {
      await axios.patch(`/api/recruitment/${drive.id}`, { status });
      await fetchDrives(page);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        `Unable to ${status === "OPEN" ? "open" : "close"} registration for this drive.`;

      setPopup({
        show: true,
        type: "success",
        message,
        isConfirm: false,
        onConfirm: () => {},
      });
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Recruitment Drives</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Every recruitment cycle, past and present — each with its own
            application form and applicants.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 font-semibold text-black transition hover:bg-neutral-200"
        >
          <Plus className="h-4 w-4" />
          New Drive
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
            />
          ))}
        </div>
      ) : drives.length === 0 ? (
        <div className="flex h-72 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 text-center">
          <Users className="h-8 w-8 text-neutral-700" />
          <p className="text-neutral-500">
            No recruitment drives yet. Create one to start accepting
            applications.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {drives.map((drive) => (
            <div
              key={drive.id}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-white">
                    {drive.title}
                  </h3>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${statusStyles[drive.status]}`}
                  >
                    {drive.status}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-2 text-sm text-neutral-500">
                  <Calendar className="h-3.5 w-3.5" />
                  {drive.year}
                </div>

                {drive.description && (
                  <p className="mt-3 line-clamp-2 text-sm text-neutral-400">
                    {drive.description}
                  </p>
                )}

                <div className="mt-4 flex items-center gap-2 text-sm text-neutral-400">
                  <Users className="h-3.5 w-3.5" />
                  {drive._count.responses} application
                  {drive._count.responses === 1 ? "" : "s"}
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2">
                <Link
                  href={`/dashboard/recruitment/${drive.id}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200"
                >
                  Manage
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                {drive.status === "OPEN" ? (
                  <button
                    onClick={() => setRegistrationStatus(drive, "CLOSED")}
                    disabled={togglingId === drive.id}
                    className="rounded-xl border border-white/10 p-2.5 text-neutral-300 transition hover:bg-white/10 disabled:opacity-40"
                    aria-label={`Close registration for ${drive.title}`}
                  >
                    {togglingId === drive.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => setRegistrationStatus(drive, "OPEN")}
                    disabled={togglingId === drive.id}
                    className="rounded-xl border border-white/10 p-2.5 text-green-400 transition hover:bg-green-500/10 disabled:opacity-40"
                    aria-label={`Open registration for ${drive.title}`}
                  >
                    {togglingId === drive.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Unlock className="h-4 w-4" />
                    )}
                  </button>
                )}

                <button
                  onClick={() => confirmDelete(drive)}
                  className="rounded-xl border border-white/10 p-2.5 text-red-400 transition hover:bg-red-500/10"
                  aria-label={`Delete ${drive.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={setPage}
        />
      )}

      <Popup
        show={popup.show}
        type={popup.type}
        message={popup.message}
        isConfirm={popup.isConfirm}
        onConfirm={popup.onConfirm}
        onClose={() => setPopup((p) => ({ ...p, show: false }))}
      />

      {showCreateModal && (
        <RecruitmentDriveModal
          isSaving={isCreating}
          onClose={() => setShowCreateModal(false)}
          onCreate={createDrive}
        />
      )}
    </div>
  );
}
