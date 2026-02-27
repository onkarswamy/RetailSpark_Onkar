import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import type { RetailIdea, MarketTrend, Category } from "../backend.d";

// Re-export types for convenience
export type { RetailIdea, MarketTrend };

// CostTier as string union since it may not be exported
export type CostTier = "low" | "medium" | "high";

const POPULATE_KEY = "retailspark_populated_v1";

export function usePopulateInitialData() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const alreadyPopulated = localStorage.getItem(POPULATE_KEY);
      if (alreadyPopulated) return;
      await actor.populateInitialData();
      localStorage.setItem(POPULATE_KEY, "1");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      queryClient.invalidateQueries({ queryKey: ["trends"] });
      queryClient.invalidateQueries({ queryKey: ["trending"] });
    },
  });
}

export function useAllIdeas() {
  const { actor, isFetching } = useActor();
  return useQuery<RetailIdea[]>({
    queryKey: ["ideas", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllIdeas();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllMarketTrends() {
  const { actor, isFetching } = useActor();
  return useQuery<MarketTrend[]>({
    queryKey: ["trends"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMarketTrends();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTrendingIdeas() {
  const { actor, isFetching } = useActor();
  return useQuery<RetailIdea[]>({
    queryKey: ["trending"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTrendingIdeas();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFilteredIdeas(
  category: Category | null,
  budget: CostTier | null
) {
  const { actor, isFetching } = useActor();
  return useQuery<RetailIdea[]>({
    queryKey: ["ideas", "filtered", category, budget],
    queryFn: async () => {
      if (!actor) return [];
      // Pass CostTier as string (backend accepts it)
      return actor.filterIdeas(category, budget as unknown as never, null);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSavedIdeas() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint[]>({
    queryKey: ["saved"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getSavedIdeas();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSavedIdeasDetails() {
  const { data: allIdeas } = useAllIdeas();
  const { data: savedIds } = useSavedIdeas();

  if (!allIdeas || !savedIds) return [];
  const savedSet = new Set(savedIds.map((id) => id.toString()));
  return allIdeas.filter((idea) => savedSet.has(idea.id.toString()));
}

export function useSaveIdea() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ideaId: bigint) => {
      if (!actor) throw new Error("No actor");
      await actor.saveIdea(ideaId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved"] });
    },
  });
}

export function useUnsaveIdea() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ideaId: bigint) => {
      if (!actor) throw new Error("No actor");
      await actor.unsaveIdea(ideaId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved"] });
    },
  });
}
