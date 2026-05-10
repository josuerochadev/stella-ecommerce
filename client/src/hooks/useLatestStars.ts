// client/src/hooks/useLatestStars.ts

import { fetchStars } from "@/services/api";
import type { Star } from "@/types/index";
import { useQuery } from "@tanstack/react-query";

export const useLatestStars = (limit = 6) => {
  const query = useQuery({
    queryKey: ["stars", "latest", limit],
    queryFn: async () => {
      const response = await fetchStars();
      const data = Array.isArray(response.data) ? response.data : (response as unknown as Star[]);
      return data.slice(0, limit);
    },
  });

  return {
    stars: query.data ?? [],
    loading: query.isLoading,
    error: query.error?.message ?? null,
    refetch: query.refetch,
  };
};
