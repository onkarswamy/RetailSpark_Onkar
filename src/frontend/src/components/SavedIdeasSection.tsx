import { Bookmark, Star } from "lucide-react";
import { IdeasGrid } from "./IdeasGrid";
import type { RetailIdea } from "../hooks/useQueries";

interface SavedIdeasSectionProps {
  ideas: RetailIdea[];
  savedIds: Set<string>;
  onToggleSave: (id: bigint) => void;
  onViewDetails: (idea: RetailIdea) => void;
}

export function SavedIdeasSection({
  ideas,
  savedIds,
  onToggleSave,
  onViewDetails,
}: SavedIdeasSectionProps) {
  return (
    <section className="space-y-6">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
          <Bookmark className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="font-serif text-2xl text-foreground">Saved Ideas</h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            {ideas.length > 0
              ? `${ideas.length} idea${ideas.length === 1 ? "" : "s"} saved to your collection`
              : "Your bookmarked ideas will appear here"}
          </p>
        </div>
      </div>

      {ideas.length === 0 ? (
        <EmptySavedState />
      ) : (
        <IdeasGrid
          ideas={ideas}
          isLoading={false}
          savedIds={savedIds}
          onToggleSave={onToggleSave}
          onViewDetails={onViewDetails}
        />
      )}
    </section>
  );
}

function EmptySavedState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
      {/* Decorative icon cluster */}
      <div className="relative">
        <div className="p-6 rounded-3xl bg-secondary/30 border border-border/40">
          <Bookmark className="w-12 h-12 text-muted-foreground/60" />
        </div>
        <div className="absolute -top-2 -right-2 p-2 rounded-xl bg-accent/15 border border-accent/30">
          <Star className="w-4 h-4 text-accent" />
        </div>
      </div>

      <div className="max-w-sm">
        <p className="font-serif text-2xl text-foreground mb-2">
          No saved ideas yet
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Bookmark ideas from the{" "}
          <span className="text-primary font-medium">Discover</span> or{" "}
          <span className="text-primary font-medium">Trending</span> tabs to
          build your innovation collection. Sign in to sync across sessions.
        </p>
      </div>
    </div>
  );
}
