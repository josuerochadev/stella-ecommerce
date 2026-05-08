import { fetchStars, getStarById } from "@/services/api";
import type { Star } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useStarDetail = (id: number | undefined) => {
  const isValidId = id !== undefined && !Number.isNaN(id) && id > 0;

  const starQuery = useQuery({
    queryKey: ["star", id],
    queryFn: () => getStarById(id as number),
    enabled: isValidId,
  });

  const allStarsQuery = useQuery({
    queryKey: ["stars", "all"],
    queryFn: () => fetchStars(),
    enabled: isValidId,
  });

  const relatedStars = allStarsQuery.data?.data?.filter((s: Star) => s.starid !== id) ?? [];

  return {
    star: starQuery.data ?? null,
    relatedStars,
    loading: starQuery.isLoading || allStarsQuery.isLoading,
    error: starQuery.error?.message || allStarsQuery.error?.message || null,
    refetch: starQuery.refetch,
    isValidId,
  };
};
