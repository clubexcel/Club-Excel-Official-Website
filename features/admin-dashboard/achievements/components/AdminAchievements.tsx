"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  X,
  Pencil,
  Search,
  Trophy,
  Calendar,
  Users,
} from "lucide-react";
import { Pagination } from "@/components/ui/Pagination";
import Popup from "../../shared/components/Popup";
import { AchievementType } from "@prisma/client";
import axios from "axios";

const LIMIT = 10;
const TYPES = [
  "hackathon",
  "competition",
  "certification",
  "workshop",
  "internship",
  "placement",
  "research",
  "publication",
  "open_source",
  "other",
] as const;

interface MemberLite {
  id: string;
  name: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string | null;
  achievedAt: string;
  tag: AchievementType;
  imageUrl: string | null;
  members: MemberLite[];
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type ModalMode = "create" | "edit";

const emptyForm = {
  title: "",
  description: "",
  tag: "hackathon" as string,
  achievedAt: "",
  memberIds: [] as string[],
};

function toDateInput(value: string | Date) {
  return new Date(value).toISOString().slice(0, 10);
}

function tagLabel(tag: string | null | undefined) {
  if (!tag) return "unspecified";
  return tag.replaceAll("_", " ").toLowerCase();
}

const AdminAchievements: React.FC = () => {
  const [page, setPage] = useState(1);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState<string>("all");

  const [members, setMembers] = useState<MemberLite[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [memberQuery, setMemberQuery] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [memberError, setMemberError] = useState("");

  const [popup, setPopup] = useState({
    show: false,
    type: "success" as const,
    message: "",
    isConfirm: false,
    onConfirm: () => {},
  });

  const fetchAchievements = async (pageNum = page) => {
    setIsLoading(true);

    try {
      const { data } = await axios.get(
        `/api/achievements?page=${pageNum}&limit=${LIMIT}`
      );

      setAchievements(data.data ?? []);
      setPagination(data.pagination ?? null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements(page);
  }, [page]);

  const loadMembers = async () => {
    setMembersLoading(true);

    try {
      const { data } = await axios.get("/api/our-team", {
        params: { role: "ALL", limit: 100 },
      });

      setMembers(
        (data.data ?? []).map((m: any) => ({ id: m.id, name: m.name }))
      );
    } catch (err) {
      console.error("Failed to load members for achievement picker:", err);
      setMembers([]);
    } finally {
      setMembersLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setEditingId(null);
    setForm(emptyForm);
    setPhotoFiles([]);
    setMemberError("");
    setMemberQuery("");
    setShowModal(true);
    loadMembers();
  };

  const openEditModal = (a: Achievement) => {
    setModalMode("edit");
    setEditingId(a.id);
    setForm({
      title: a.title,
      description: a.description ?? "",
      tag: a.tag.toLowerCase(),
      achievedAt: toDateInput(a.achievedAt),
      memberIds: a.members.map((m) => m.id),
    });
    setPhotoFiles([]);
    setMemberError("");
    setMemberQuery("");
    setShowModal(true);
    loadMembers();
  };

  const toggleMember = (id: string) => {
    setForm((f) => ({
      ...f,
      memberIds: f.memberIds.includes(id)
        ? f.memberIds.filter((m) => m !== id)
        : [...f.memberIds, id],
    }));
    setMemberError("");
  };

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (form.memberIds.length === 0) {
      setMemberError("Select at least one member.");
      return;
    }

    setSaving(true);

    try {
      if (modalMode === "create") {
        const fd = new FormData();
        fd.append("title", form.title);
        fd.append("description", form.description);
        fd.append("tag", form.tag.toUpperCase());
        fd.append("achievedAt", form.achievedAt);
        fd.append("memberIds", JSON.stringify(form.memberIds));
        if (photoFiles[0]) fd.append("image", photoFiles[0]);

        await axios.post("/api/achievements", fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setPopup({
          show: true,
          type: "success",
          message: "Achievement added!",
          isConfirm: false,
          onConfirm: () => {},
        });
        fetchAchievements(1);
        setPage(1);
      } else {
        if (!editingId) return;

        await axios.patch(`/api/achievements/${editingId}`, {
          title: form.title,
          description: form.description,
          tag: form.tag.toUpperCase(),
          achievedAt: new Date(form.achievedAt).toISOString(),
          memberIds: form.memberIds,
        });

        setPopup({
          show: true,
          type: "success",
          message: "Achievement updated!",
          isConfirm: false,
          onConfirm: () => {},
        });
        fetchAchievements(page);
      }

      setShowModal(false);
      setPhotoFiles([]);
      setForm(emptyForm);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      setPopup({
        show: true,
        type: "success",
        message:
          modalMode === "create" ? "Unable to save." : "Unable to update.",
        isConfirm: false,
        onConfirm: () => {},
      });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id: string, title: string) =>
    setPopup({
      show: true,
      type: "success",
      message: `Delete "${title}"?`,
      isConfirm: true,
      onConfirm: async () => {
        try {
          await axios.delete(`/api/achievements/${id}`);
          setPopup((p) => ({ ...p, show: false }));
          fetchAchievements(page);
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

  const visibleAchievements = useMemo(() => {
    const q = query.trim().toLowerCase();

    return achievements.filter((a) => {
      if (tagFilter !== "all" && a.tag !== tagFilter) return false;

      if (!q) return true;

      return (
        a.title.toLowerCase().includes(q) ||
        (a.description?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [achievements, query, tagFilter]);

  const visibleMembers = useMemo(() => {
    const q = memberQuery.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) => m.name.toLowerCase().includes(q));
  }, [members, memberQuery]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-7 w-40 animate-pulse rounded-lg bg-white/5" />
          <div className="h-9 w-36 animate-pulse rounded-xl bg-white/5" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
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
          <h2 className="text-lg font-bold text-white">Achievements</h2>
          <p className="mt-1 text-xs text-neutral-500">
            {pagination?.total ?? achievements.length} total
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-neutral-200"
        >
          <Plus className="h-4 w-4" /> Add Achievement
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or description..."
            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-white/20"
          />
        </div>

        <select
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm capitalize text-white outline-none focus:border-white/20"
        >
          <option value="all" className="bg-[#0A0A0A]">
            All types
          </option>
          {TYPES.map((t) => (
            <option key={t} value={t.toUpperCase()} className="bg-[#0A0A0A]">
              {tagLabel(t)}
            </option>
          ))}
        </select>
      </div>

      {visibleAchievements.length === 0 ? (
        <div className="flex h-56 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 text-center">
          <Trophy className="h-8 w-8 text-neutral-700" />
          <p className="text-neutral-500">
            {achievements.length === 0
              ? "No achievements yet."
              : "No achievements match your search or filter."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {visibleAchievements.map((a) => (
            <div
              key={a.id}
              className="group flex overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-white/20"
            >
              {a.imageUrl ? (
                <img
                  src={a.imageUrl}
                  alt=""
                  className="h-full w-24 flex-shrink-0 object-cover"
                />
              ) : (
                <div className="flex h-full w-24 flex-shrink-0 items-center justify-center bg-white/5">
                  <Trophy className="h-6 w-6 text-neutral-600" />
                </div>
              )}

              <div className="min-w-0 flex-1 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {a.title}
                    </p>
                    <span className="mt-1 inline-block rounded-full bg-white/5 px-2 py-0.5 text-[10px] uppercase text-neutral-400">
                      {tagLabel(a.tag)}
                    </span>
                  </div>

                  <div className="flex flex-shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => openEditModal(a)}
                      className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white"
                      aria-label={`Edit ${a.title}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => confirmDelete(a.id, a.title)}
                      className="rounded-lg p-1.5 text-red-400 hover:bg-red-400/10"
                      aria-label={`Delete ${a.title}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {a.description && (
                  <p className="mt-2 line-clamp-2 text-xs text-neutral-500">
                    {a.description}
                  </p>
                )}

                <p className="mt-2 flex items-center gap-1.5 text-[11px] text-neutral-600">
                  <Calendar className="h-3 w-3" />
                  {new Date(a.achievedAt).toLocaleDateString()}
                </p>

                {a.members.length > 0 && (
                  <p className="mt-1.5 flex items-start gap-1.5 text-[11px] text-neutral-500">
                    <Users className="mt-0.5 h-3 w-3 flex-shrink-0" />
                    <span className="line-clamp-1">
                      {a.members.map((m) => m.name).join(", ")}
                    </span>
                  </p>
                )}
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-[#0A0A0A] p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                {modalMode === "create"
                  ? "Add Achievement"
                  : "Edit Achievement"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-neutral-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  Title
                </label>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={3}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-neutral-500">
                    Type
                  </label>
                  <select
                    value={form.tag}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, tag: e.target.value }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm capitalize text-white"
                  >
                    {TYPES.map((t) => (
                      <option key={t} value={t} className="bg-[#0A0A0A]">
                        {tagLabel(t)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-neutral-500">
                    Date Achieved
                  </label>
                  <input
                    type="date"
                    value={form.achievedAt}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, achievedAt: e.target.value }))
                    }
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500">
                    Members
                    <span className="ml-1 text-red-400">*</span>
                  </label>
                  {form.memberIds.length > 0 && (
                    <span className="text-[10px] text-neutral-500">
                      {form.memberIds.length} selected
                    </span>
                  )}
                </div>

                <input
                  value={memberQuery}
                  onChange={(e) => setMemberQuery(e.target.value)}
                  placeholder="Search members..."
                  className="mb-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-white/20"
                />

                <div
                  className={`max-h-48 space-y-1 overflow-y-auto rounded-xl border p-2 ${
                    memberError ? "border-red-500/50" : "border-white/10"
                  }`}
                >
                  {membersLoading ? (
                    <p className="p-2 text-xs text-neutral-500">
                      Loading members...
                    </p>
                  ) : visibleMembers.length === 0 ? (
                    <p className="p-2 text-xs text-neutral-500">
                      No members found.
                    </p>
                  ) : (
                    visibleMembers.map((m) => (
                      <label
                        key={m.id}
                        className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-neutral-300 hover:bg-white/5"
                      >
                        <input
                          type="checkbox"
                          checked={form.memberIds.includes(m.id)}
                          onChange={() => toggleMember(m.id)}
                          className="accent-white"
                        />
                        {m.name}
                      </label>
                    ))
                  )}
                </div>

                {memberError && (
                  <p className="mt-1 text-xs text-red-400">{memberError}</p>
                )}
              </div>

              {modalMode === "create" ? (
                <div>
                  <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-neutral-500">
                    Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full text-sm text-neutral-400"
                    onChange={(e) =>
                      setPhotoFiles(
                        Array.from(e.target.files ?? []).slice(0, 1)
                      )
                    }
                  />
                </div>
              ) : (
                <p className="text-xs text-neutral-600">
                  Photo can only be set when an achievement is first created.
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-white/10 py-3 text-sm text-neutral-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-white py-3 text-sm font-semibold text-black disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : modalMode === "create"
                      ? "Add Achievement"
                      : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

export default AdminAchievements;
