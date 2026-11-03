"use client";
import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Trash2,
  ChevronDown,
  Mail,
  Phone,
  Search,
  Inbox,
  Pencil,
} from "lucide-react";
import { Pagination } from "@/components/ui/Pagination";
import Popup from "../../shared/components/Popup";
import EditInquiryModal, { ContactInquiryRecord } from "./EditInquiryModal";
import axios from "axios";

const LIMIT = 15;

type QueryStatus = "PENDING" | "READ" | "RESOLVED";

interface ContactQuery {
  id: string;
  name: string;
  email: string;
  phoneNo: string;
  message: string;
  status: QueryStatus;
  createdAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type StatusFilter = "all" | QueryStatus;

const STATUS_STYLES: Record<QueryStatus, string> = {
  PENDING: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
  READ: "bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/30",
  RESOLVED: "bg-green-500/15 text-green-300 ring-1 ring-green-500/30",
};

const STATUS_LABELS: Record<QueryStatus, string> = {
  PENDING: "Pending",
  READ: "Read",
  RESOLVED: "Resolved",
};

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

const AdminQueries: React.FC = () => {
  const [page, setPage] = useState(1);
  const [queries, setQueries] = useState<ContactQuery[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [editingQuery, setEditingQuery] = useState<ContactInquiryRecord | null>(
    null
  );
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    type: "success" as const,
    message: "",
    isConfirm: false,
    onConfirm: () => {},
  });

  const fetchQueries = async (pageNum = page) => {
    setIsLoading(true);

    try {
      const { data } = await axios.get(
        `/api/contact-us?page=${pageNum}&limit=${LIMIT}`
      );

      setQueries(data.data ?? []);
      setPagination(data.pagination ?? null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries(
      page
    ); /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [page]);

  const confirmDeleteQuery = (id: string, name: string) =>
    setPopup({
      show: true,
      type: "success",
      message: `Delete query from ${name}?`,
      isConfirm: true,
      onConfirm: async () => {
        try {
          await axios.delete(`/api/contact-us/${id}`);
          setPopup((p) => ({ ...p, show: false }));
          fetchQueries(page);
        } catch (err) {
          console.error(err);
          setPopup({
            show: true,
            type: "success",
            message: "Unable to delete.",
            isConfirm: false,
            onConfirm: () => {},
          });
        }
      },
    });

  const saveQueryEdit = async (
    id: string,
    data: Omit<ContactInquiryRecord, "id">
  ) => {
    setIsSavingEdit(true);
    try {
      await axios.patch(`/api/contact-us/${id}`, data);
      setEditingQuery(null);
      fetchQueries(page);
    } catch (err) {
      console.error(err);
      setPopup({
        show: true,
        type: "success",
        message: "Unable to save changes.",
        isConfirm: false,
        onConfirm: () => {},
      });
    } finally {
      setIsSavingEdit(false);
    }
  };

  const quickSetStatus = async (q: ContactQuery, status: QueryStatus) => {
    if (q.status === status) return;

    try {
      await axios.patch(`/api/contact-us/${q.id}`, { status });
      fetchQueries(page);
    } catch (err) {
      console.error(err);
      setPopup({
        show: true,
        type: "success",
        message: "Unable to update status.",
        isConfirm: false,
        onConfirm: () => {},
      });
    }
  };

  const visibleQueries = useMemo(() => {
    const q = query.trim().toLowerCase();

    return queries.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }

      if (!q) return true;

      return (
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.phoneNo?.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q)
      );
    });
  }, [queries, query, statusFilter]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-7 w-48 animate-pulse rounded-lg bg-white/5" />

        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-[64px] animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">Contact Queries</h2>
          <p className="mt-1 text-xs text-neutral-500">
            {pagination?.total ?? queries.length} total quer
            {(pagination?.total ?? queries.length) === 1 ? "y" : "ies"}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1">
          {(
            [
              { key: "all", label: "All" },
              { key: "PENDING", label: "Pending" },
              { key: "READ", label: "Read" },
              { key: "RESOLVED", label: "Resolved" },
            ] as { key: StatusFilter; label: string }[]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                statusFilter === tab.key
                  ? "bg-white text-black"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email, phone, or message..."
          className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-white/20"
        />
      </div>

      {visibleQueries.length === 0 ? (
        <div className="flex h-72 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 text-center">
          <Inbox className="h-8 w-8 text-neutral-700" />
          <p className="text-neutral-500">
            {queries.length === 0
              ? "No queries yet."
              : "No queries match your search or filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleQueries.map((q) => {
            const isOpen = expanded === q.id;

            return (
              <div
                key={q.id}
                className={`overflow-hidden rounded-2xl border bg-white/[0.03] transition-colors ${
                  isOpen ? "border-white/20" : "border-white/10"
                }`}
              >
                <div
                  className="flex cursor-pointer items-center justify-between gap-4 p-4 transition-all hover:bg-white/5"
                  onClick={() => setExpanded(isOpen ? null : q.id)}
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-neutral-300 ring-1 ring-white/10">
                      {initials(q.name) || "?"}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-white">
                          {q.name}
                        </p>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[q.status]}`}
                        >
                          {STATUS_LABELS[q.status]}
                        </span>
                      </div>
                      <p className="truncate text-xs text-neutral-500">
                        {new Date(q.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingQuery(q);
                      }}
                      className="rounded-lg p-2 text-neutral-300 transition-all hover:bg-white/10"
                      aria-label={`Edit query from ${q.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDeleteQuery(q.id, q.name);
                      }}
                      className="rounded-lg p-2 text-red-400 transition-all hover:bg-red-400/10"
                      aria-label={`Delete query from ${q.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4 text-neutral-500" />
                    </motion.div>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden border-t border-white/5"
                    >
                      <div className="space-y-3 px-4 pb-4 pt-4">
                        <div className="flex flex-wrap gap-4 text-xs">
                          <span className="flex items-center gap-1.5 text-neutral-400">
                            <Mail className="h-3 w-3" />
                            {q.email}
                          </span>

                          {q.phoneNo && (
                            <span className="flex items-center gap-1.5 text-neutral-400">
                              <Phone className="h-3 w-3" />
                              {q.phoneNo}
                            </span>
                          )}
                        </div>

                        <p className="rounded-xl bg-white/5 p-3 text-sm leading-relaxed text-neutral-300">
                          {q.message}
                        </p>

                        <div
                          className="flex flex-wrap gap-2 pt-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {(
                            ["PENDING", "READ", "RESOLVED"] as QueryStatus[]
                          ).map((s) => (
                            <button
                              key={s}
                              onClick={() => quickSetStatus(q, s)}
                              disabled={q.status === s}
                              className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition disabled:cursor-default ${
                                q.status === s
                                  ? STATUS_STYLES[s]
                                  : "bg-white/5 text-neutral-500 hover:bg-white/10 hover:text-neutral-300"
                              }`}
                            >
                              Mark {STATUS_LABELS[s]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
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

      {editingQuery && (
        <EditInquiryModal
          record={editingQuery}
          isSaving={isSavingEdit}
          onClose={() => setEditingQuery(null)}
          onSave={saveQueryEdit}
        />
      )}
    </div>
  );
};

export default AdminQueries;
