"use client";
import React, { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X, Image as ImageIcon } from "lucide-react";
import { Pagination } from "@/components/ui/Pagination";
import Popup from "../../shared/components/Popup";
import axios from "axios";

const LIMIT = 9;

interface GalleryImage {
  id: string;
  imageUrl: string;
}

interface GalleryAlbum {
  id: string;
  groupName: string;
  images: GalleryImage[];
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const AdminGallery: React.FC = () => {
  const [page, setPage] = useState(1);
  const [gallery, setGallery] = useState<GalleryAlbum[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    type: "success" as const,
    message: "",
    isConfirm: false,
    onConfirm: () => {},
  });
  const [groupName, setGroupName] = useState("");

  const [editingAlbum, setEditingAlbum] = useState<GalleryAlbum | null>(null);
  const [removingImageId, setRemovingImageId] = useState<string | null>(null);

  const fetchGallery = async (pageNum = page) => {
    setIsLoading(true);

    try {
      const { data } = await axios.get(
        `/api/gallery?page=${pageNum}&limit=${LIMIT}`
      );

      setGallery(data.data ?? []);
      setPagination(data.pagination ?? null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery(
      page
    ); /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [page]);

  const openAdd = () => {
    setEditingAlbum(null);
    setGroupName("");
    setPhotoFiles([]);
    setShowModal(true);
  };

  const openEdit = (album: GalleryAlbum) => {
    setEditingAlbum(album);
    setGroupName(album.groupName);
    setPhotoFiles([]);
    setShowModal(true);
  };

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!groupName)
      return setPopup({
        show: true,
        type: "success",
        message: "Album name required",
        isConfirm: false,
        onConfirm: () => {},
      });
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("groupName", groupName);
      photoFiles.forEach((f) => fd.append("photos", f));

      if (editingAlbum) {
        await axios.patch(`/api/gallery/${editingAlbum.id}`, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.post("/api/gallery", fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setShowModal(false);
      setPhotoFiles([]);
      setGroupName("");
      setEditingAlbum(null);
      setPopup({
        show: true,
        type: "success",
        message: editingAlbum ? "Album updated!" : "Gallery album added!",
        isConfirm: false,
        onConfirm: () => {},
      });

      if (editingAlbum) {
        fetchGallery(page);
      } else {
        setPage(1);
        fetchGallery(1);
      }
    } catch (err) {
      console.error(err);
      setPopup({
        show: true,
        type: "success",
        message: "Unable to save.",
        isConfirm: false,
        onConfirm: () => {},
      });
    } finally {
      setSaving(false);
    }
  };

  const removeImage = async (albumId: string, imageId: string) => {
    setRemovingImageId(imageId);

    try {
      await axios.delete(`/api/gallery/${albumId}/media/${imageId}`);

      setEditingAlbum((prev) =>
        prev
          ? { ...prev, images: prev.images.filter((img) => img.id !== imageId) }
          : prev
      );

      fetchGallery(page);
    } catch (err) {
      console.error(err);
      setPopup({
        show: true,
        type: "success",
        message: "Unable to remove photo.",
        isConfirm: false,
        onConfirm: () => {},
      });
    } finally {
      setRemovingImageId(null);
    }
  };

  const confirmRemoveImage = (albumId: string, imageId: string) =>
    setPopup({
      show: true,
      type: "success",
      message: "Remove this photo from the album?",
      isConfirm: true,
      onConfirm: () => {
        setPopup((p) => ({ ...p, show: false }));
        removeImage(albumId, imageId);
      },
    });

  const confirmDelete = (id: string, name: string) =>
    setPopup({
      show: true,
      type: "success",
      message: `Delete "${name}"?`,
      isConfirm: true,
      onConfirm: async () => {
        try {
          await axios.delete(`/api/gallery/${id}`);
          setPopup((p) => ({ ...p, show: false }));
          fetchGallery(page);
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

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">
          Gallery{" "}
          <span className="text-neutral-500 text-sm font-normal ml-2">
            ({pagination?.total ?? 0} albums)
          </span>
        </h2>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl font-semibold text-sm hover:bg-neutral-200 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Album
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gallery.map((g) => (
          <div
            key={g.id}
            className="group bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all"
          >
            <div className="grid grid-cols-2 gap-0.5 h-36 overflow-hidden">
              {g.images?.slice(0, 4).map((img, i) => (
                <div
                  key={img.id}
                  className="relative overflow-hidden bg-white/5"
                >
                  <img
                    src={img.imageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  {i === 3 && g.images.length > 4 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm font-bold">
                      +{g.images.length - 4}
                    </div>
                  )}
                </div>
              ))}
              {!g.images?.length && (
                <div className="col-span-2 flex items-center justify-center text-neutral-600">
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold text-sm">
                  {g.groupName}
                </p>
                <p className="text-neutral-500 text-xs">
                  {g.images?.length ?? 0} photos
                </p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button
                  onClick={() => openEdit(g)}
                  className="p-2 text-neutral-300 hover:bg-white/10 rounded-lg"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => confirmDelete(g.id, g.groupName)}
                  className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {gallery.length === 0 && (
          <p className="text-neutral-500 col-span-3 text-center py-16">
            No gallery albums yet.
          </p>
        )}
      </div>

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">
                {editingAlbum ? "Edit Gallery Album" : "Add Gallery Album"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black block mb-1">
                  Album Name
                </label>
                <input
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. Sankalp 2024"
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-all border-white/10 focus:border-white/20`}
                />
              </div>

              {editingAlbum && editingAlbum.images.length > 0 && (
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black block mb-2">
                    Current Photos
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {editingAlbum.images.map((img) => (
                      <div
                        key={img.id}
                        className="relative aspect-square rounded-lg overflow-hidden group/photo"
                      >
                        <img
                          src={img.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            confirmRemoveImage(editingAlbum.id, img.id)
                          }
                          disabled={removingImageId === img.id}
                          className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/photo:opacity-100 transition-all disabled:opacity-100"
                        >
                          {removingImageId === img.id ? (
                            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          ) : (
                            <X className="w-4 h-4 text-white" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black block mb-1">
                  {editingAlbum ? "Add More Photos" : "Photos"}
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="w-full text-neutral-400 text-sm"
                  onChange={(e) =>
                    setPhotoFiles(Array.from(e.target.files ?? []))
                  }
                />
                {photoFiles.length > 0 && (
                  <p className="text-neutral-500 text-xs mt-1">
                    {photoFiles.length} files selected
                  </p>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-white/10 rounded-xl text-neutral-400 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-white text-black rounded-xl font-semibold text-sm disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingAlbum
                      ? "Save Changes"
                      : "Add Album"}
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

export default AdminGallery;
