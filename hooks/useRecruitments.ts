import axios from "axios";
import { useEffect, useState } from "react";

interface FetchParams {
  page?: number;
  limit?: number;
  status?: string;
}

const fetchDrives = async (params: FetchParams = {}) => {
  const query = new URLSearchParams();

  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.status) query.set("status", params.status);

  const { data } = await axios.get(`/api/recruitment?${query}`);

  return data;
};

export function useRecruitmentDrives(params: FetchParams = {}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchDrives(params);

        if (mounted) {
          setData(result);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [params.page, params.limit, params.status]);

  return {
    data,
    loading,
    error,
    refetch: () => fetchDrives(params).then(setData),
  };
}

interface RecruitmentStatus {
  isOpen: boolean;
  opensAt: string | null;
  driveId: string | null;
}

export function useRecruitmentStatus() {
  const [status, setStatus] = useState<RecruitmentStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    axios
      .get("/api/recruitment/status")
      .then(({ data }) => {
        if (mounted) {
          setStatus({
            isOpen: Boolean(data.isOpen),
            opensAt: data.opensAt ?? null,
            driveId: data.driveId ?? null,
          });
        }
      })
      .catch(() => {
        if (mounted) {
          setStatus({ isOpen: false, opensAt: null, driveId: null });
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { status, loading };
}

export function useSubmitRecruitment(driveId: string | null | undefined) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submitRecruitment = async (data: any) => {
    if (!driveId) {
      const err = new Error("No active recruitment drive to apply to.");
      setError(err);
      throw err;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `/api/recruitment/${driveId}/response`,
        data
      );

      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message ?? err.message ?? "Submission failed";

      const newError = new Error(message);
      setError(newError);
      throw newError;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitRecruitment,
    loading,
    error,
  };
}
