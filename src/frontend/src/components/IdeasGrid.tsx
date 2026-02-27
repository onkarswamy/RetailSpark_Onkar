import { Lightbulb } from "lucide-react";
import { IdeaCard } from "./IdeaCard";
import { IdeaCardSkeleton } from "./IdeaCardSkeleton";
import type { RetailIdea } from "../hooks/useQueries";

interface IdeasGridProps {
  ideas: RetailIdea[];
  isLoading: boolean;
  savedIds: Set<string>;
  onToggleSave: (id: bigint) => void;
  onViewDetails: (idea: RetailIdea) => void;
}

export function IdeasGrid({
  ideas,
  isLoading,
  savedIds,
  onToggleSave,
  onViewDetails,
}: IdeasGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }, (_, i) => `skeleton-${i}`).map((id) => (
          <IdeaCardSkeleton key={id} />
        ))}
      </div>
    );
  }

  if (ideas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
        <div className="p-5 rounded-2xl bg-secondary/30 border border-border/40">
          <Lightbulb className="w-10 h-10 text-muted-foreground" />
        </div>
        <div>
          <p className="font-serif text-2xl text-foreground mb-2">No ideas found</p>
          <p className="text-muted-foreground text-sm max-w-sm">
            Try adjusting your filters or click "Generate Ideas" to discover
            opportunities aligned with your criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {ideas.map((idea, i) => (
        <IdeaCard
          key={idea.id.toString()}
          idea={idea}
          isSaved={savedIds.has(idea.id.toString())}
          onToggleSave={onToggleSave}
          onViewDetails={onViewDetails}
          style={{ animationDelay: `${i * 0.05}s` }}
        />
      ))}
    </div>
  );
}
