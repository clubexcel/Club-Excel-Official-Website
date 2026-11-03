"use client";

import { useMemo } from "react";
import type { AchievementItem } from "../actions/achievements";

interface FetchAchievementsParams {
  page?: number;
  limit?: number;
  initialAchievements?: AchievementItem[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function useAchievements({
  page = 1,
  limit = 9,
  initialAchievements = [],
}: FetchAchievementsParams = {}) {
  const data = useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: initialAchievements.slice(start, end),
      pagination: {
        page,
        limit,
        total: initialAchievements.length,
        totalPages: Math.max(1, Math.ceil(initialAchievements.length / limit)),
        hasNextPage: end < initialAchievements.length,
        hasPrevPage: page > 1,
      } satisfies PaginationMeta,
    };
  }, [page, limit, initialAchievements]);

  return {
    data,
    loading: false,
    error: null,
  };
}
