"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  CheckCircle2,
  XCircle,
  Trash2,
  Search,
  Mail,
  Phone,
  Hash,
  BookOpen,
  Code,
  Inbox,
  Pencil,
} from "lucide-react";
import { Pagination } from "@/components/ui/Pagination";
import Popup from "../../shared/components/Popup";
import EditRecruitmentResponseModal, {
  RecruitmentFormFieldLite as EditableFormField,
  RecruitmentResponseRecord,
} from "./EditRecruitmentResponseModal";

interface RecruitmentResponsesProps {
  id: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const LIMIT = 15;

type SelectionFilter = "all" | "selected" | "pending";

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

const RecruitmentResponses = ({ id }: RecruitmentResponsesProps) => {
  const [page, setPage] = useState(1);
  const [responses, setResponses] = useState<RecruitmentResponseRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [formFields, setFormFields] = useState<EditableFormField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<SelectionFilter>("all");
  const [editingResponse, setEditingResponse] =
    useState<RecruitmentResponseRecord | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const [popup, setPopup] = useState({
    show: false,
    type: "success" as const,
    message: "",
    isConfirm: false,
    onConfirm: () => {},
  });

  const load = async (pageNum = page) => {
    setIsLoading(true);

    try {
      const [{ data: responseData }, { data: driveData }] = await Promise.all([
        axios.get(`/api/recruitment/${id}/response`, {
          params: { page: pageNum, limit: LIMIT },
        }),
        axios.get(`/api/recruitment/${id}`),
      ]);

      setResponses(responseData.data ?? []);
      setPagination(responseData.pagination ?? null);
      setFormFields(driveData.drive?.formFields ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load(page);
  }, [id, page]);

  const toggleSelection = async (response: RecruitmentResponseRecord) => {
    try {
      await axios.patch(`/api/recruitment/${id}/response/${response.id}`, {
        isSelected: !response.isSelected,
      });
      await load(page);
    } catch (err) {
      console.error(err);
    }
  };

  const saveResponseEdit = async (
    responseId: string,
    updates: Record<string, unknown>
  ) => {
    setIsSavingEdit(true);
    try {
      await axios.patch(
        `/api/recruitment/${id}/response/${responseId}`,
        updates
      );
      setEditingResponse(null);
      await load(page);
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

  const deleteResponse = async (response: RecruitmentResponseRecord) => {
    try {
      await axios.delete(`/api/recruitment/${id}/response/${response.id}`);
      await load(page);
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDelete = (response: RecruitmentResponseRecord) => {
    setPopup({
      show: true,
      type: "success",
      message: `Delete the application from ${response.name}?`,
      isConfirm: true,
      onConfirm: () => {
        deleteResponse(response);
        setPopup((p) => ({ ...p, show: false }));
      },
    });
  };

  const labelFor = (fieldName: string) =>
    formFields.find((f) => f.name === fieldName)?.label ?? fieldName;

  const selectedOnPage = useMemo(
    () => responses.filter((r) => r.isSelected).length,
    [responses]
  );

  const visibleResponses = useMemo(() => {
    const q = query.trim().toLowerCase();

    return responses.filter((r) => {
      if (filter === "selected" && !r.isSelected) return false;
      if (filter === "pending" && r.isSelected) return false;

      if (!q) return true;

      return (
        r.name.toLowerCase().includes(q) ||
        r.personalEmail.toLowerCase().includes(q) ||
        r.nistEmail.toLowerCase().includes(q) ||
        r.rollNumber.toLowerCase().includes(q) ||
        r.registrationNo.toLowerCase().includes(q)
      );
    });
  }, [responses, query, filter]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-56 animate-pulse rounded-lg bg-white/5" />
        </div>

        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-[68px] animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
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
          <h2 className="text-2xl font-bold text-white">Applications</h2>
          <p className="mt-1 text-sm text-neutral-500">
            {pagination?.total ?? responses.length} total application
            {(pagination?.total ?? responses.length) === 1 ? "" : "s"} ·{" "}
            {selectedOnPage} selected on this page
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1">
          {(
            [
              { key: "all", label: "All" },
              { key: "selected", label: "Selected" },
              { key: "pending", label: "Pending" },
            ] as { key: SelectionFilter; label: string }[]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                filter === tab.key
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
          placeholder="Search by name, email, roll no., or registration no..."
          className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-white/20"
        />
      </div>

      {visibleResponses.length === 0 ? (
        <div className="flex h-72 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 text-center">
          <Inbox className="h-8 w-8 text-neutral-700" />
          <p className="text-neutral-500">
            {responses.length === 0
              ? "No applications yet for this drive."
              : "No applications match your search or filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleResponses.map((response) => {
            const isOpen = expanded === response.id;
            const extraFields = Object.entries(response.answers ?? {});

            return (
              <div
                key={response.id}
                className={`overflow-hidden rounded-2xl border bg-white/[0.03] transition-colors ${
                  isOpen ? "border-white/20" : "border-white/10"
                }`}
              >
                <div
                  className="flex cursor-pointer items-center justify-between gap-4 p-4 transition hover:bg-white/5"
                  onClick={() => setExpanded(isOpen ? null : response.id)}
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                        response.isSelected
                          ? "bg-green-500/15 text-green-300 ring-1 ring-green-500/30"
                          : "bg-white/10 text-neutral-300 ring-1 ring-white/10"
                      }`}
                    >
                      {initials(response.name) || "?"}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {response.name}
                      </p>
                      <p className="truncate text-xs text-neutral-500">
                        {response.rollNumber} · {response.branch}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelection(response);
                      }}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                        response.isSelected
                          ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                          : "bg-white/5 text-neutral-400 hover:bg-white/10"
                      }`}
                    >
                      {response.isSelected ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          Selected
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" />
                          Pending
                        </>
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingResponse(response);
                      }}
                      className="rounded-lg p-2 text-neutral-300 transition-all hover:bg-white/10"
                      aria-label={`Edit application from ${response.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDelete(response);
                      }}
                      className="rounded-lg p-2 text-red-400 transition-all hover:bg-red-400/10"
                      aria-label={`Delete application from ${response.name}`}
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
                      <div className="grid grid-cols-2 gap-4 px-4 pb-4 pt-4 text-xs md:grid-cols-3">
                        <div className="flex items-start gap-2">
                          <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-600" />
                          <div>
                            <p className="mb-0.5 uppercase tracking-wider text-neutral-600">
                              NIST Email
                            </p>
                            <p className="text-neutral-300">
                              {response.nistEmail}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-600" />
                          <div>
                            <p className="mb-0.5 uppercase tracking-wider text-neutral-600">
                              Personal Email
                            </p>
                            <p className="text-neutral-300">
                              {response.personalEmail}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-600" />
                          <div>
                            <p className="mb-0.5 uppercase tracking-wider text-neutral-600">
                              Phone
                            </p>
                            <p className="text-neutral-300">
                              {response.phoneNumber}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Hash className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-600" />
                          <div>
                            <p className="mb-0.5 uppercase tracking-wider text-neutral-600">
                              Registration No.
                            </p>
                            <p className="text-neutral-300">
                              {response.registrationNo}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="mb-0.5 uppercase tracking-wider text-neutral-600">
                            Gender
                          </p>
                          <p className="text-neutral-300">{response.gender}</p>
                        </div>

                        <div>
                          <p className="mb-0.5 uppercase tracking-wider text-neutral-600">
                            Locality
                          </p>
                          <p className="text-neutral-300">
                            {response.locality}
                          </p>
                        </div>

                        <div className="flex items-start gap-2">
                          <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-600" />
                          <div>
                            <p className="mb-0.5 uppercase tracking-wider text-neutral-600">
                              Branch
                            </p>
                            <p className="text-neutral-300">
                              {response.branch}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="mb-0.5 uppercase tracking-wider text-neutral-600">
                            HackerRank ID
                          </p>
                          <p className="text-neutral-300">
                            {response.hackerrankId}
                          </p>
                        </div>

                        <div className="col-span-2 flex items-start gap-2 md:col-span-3">
                          <Code className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-600" />
                          <div>
                            <p className="mb-0.5 uppercase tracking-wider text-neutral-600">
                              Target Tech Stack
                            </p>
                            <p className="text-neutral-300">
                              {response.techStack}
                            </p>
                          </div>
                        </div>

                        {extraFields.map(([key, value]) => (
                          <div key={key}>
                            <p className="mb-0.5 uppercase tracking-wider text-neutral-600">
                              {labelFor(key)}
                            </p>
                            <p className="text-neutral-300">
                              {String(value) || "—"}
                            </p>
                          </div>
                        ))}
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

      {editingResponse && (
        <EditRecruitmentResponseModal
          record={editingResponse}
          formFields={formFields}
          isSaving={isSavingEdit}
          onClose={() => setEditingResponse(null)}
          onSave={saveResponseEdit}
        />
      )}
    </div>
  );
};

export default RecruitmentResponses;
