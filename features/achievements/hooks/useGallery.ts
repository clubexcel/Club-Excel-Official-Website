import axios from "axios";
import { useEffect, useState } from "react";

export interface GalleryImage {
  id: string;
  imageUrl: string;
}

export interface GalleryAlbum {
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

interface FetchParams {
  page?: number;
  limit?: number;
}

export function useGallery(params: FetchParams = {}) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 9;

  const [gallery, setGallery] = useState<GalleryAlbum[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchGallery = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.get("/api/gallery", {
          params: { page, limit },
        });

        if (!cancelled) {
          setGallery(data.data ?? []);
          setPagination(data.pagination ?? null);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("Failed to load gallery");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchGallery();

    return () => {
      cancelled = true;
    };
  }, [page, limit]);

  return {
    data: {
      data: gallery,
      pagination,
    },
    loading,
    error,
    setGallery,
  };
}

export function useDeleteGallery(
  setGallery: React.Dispatch<React.SetStateAction<GalleryAlbum[]>>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteGallery = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete(`/api/gallery/${id}`);
      setGallery((prev) => prev.filter((item) => item.id !== id));
      return { success: true };
    } catch (err) {
      console.error(err);
      setError("Failed to delete album");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteGallery,
    loading,
    error,
  };
}
