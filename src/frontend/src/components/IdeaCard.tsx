import { Bookmark, BookmarkCheck, Eye, TrendingUp, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { RetailIdea } from "../hooks/useQueries";
import { Category, Difficulty } from "../backend.d";
import { cn } from "@/lib/utils";

interface IdeaCardProps {
  idea: RetailIdea;
  isSaved: boolean;
  onToggleSave: (id: bigint) => void;
  onViewDetails: (idea: RetailIdea) => void;
  style?: React.CSSProperties;
}

const categoryConfig: Record<
  Category,
  { label: string; color: string; bgColor: string }
> = {
  [Category.ecommerce]: {
    label: "E-Commerce",
    color: "text-blue-300",
    bgColor: "bg-blue-500/15 border-blue-500/30",
  },
  [Category.inStoreTech]: {
    label: "In-Store Tech",
    color: "text-violet-300",
    bgColor: "bg-violet-500/15 border-violet-500/30",
  },
  [Category.omnichannel]: {
    label: "Omnichannel",
    color: "text-cyan-300",
    bgColor: "bg-cyan-500/15 border-cyan-500/30",
  },
  [Category.sustainability]: {
    label: "Sustainability",
    color: "text-emerald-300",
    bgColor: "bg-emerald-500/15 border-emerald-500/30",
  },
  [Category.experiential]: {
    label: "Experiential",
    color: "text-pink-300",
    bgColor: "bg-pink-500/15 border-pink-500/30",
  },
  [Category.aiDriven]: {
    label: "AI-Driven",
    color: "text-primary",
    bgColor: "bg-primary/15 border-primary/30",
  },
  [Category.supplyChain]: {
    label: "Supply Chain",
    color: "text-orange-300",
    bgColor: "bg-orange-500/15 border-orange-500/30",
  },
};

const difficultyConfig: Record<
  Difficulty,
  { label: string; color: string }
> = {
  [Difficulty.easy]: { label: "Easy", color: "text-emerald-300 bg-emerald-500/15 border-emerald-500/30" },
  [Difficulty.medium]: { label: "Medium", color: "text-yellow-300 bg-yellow-500/15 border-yellow-500/30" },
  [Difficulty.hard]: { label: "Hard", color: "text-red-300 bg-red-500/15 border-red-500/30" },
};

const costConfig: Record<string, { label: string; color: string }> = {
  low: { label: "Low Cost", color: "text-emerald-300 bg-emerald-500/10 border-emerald-500/25" },
  medium: { label: "Mid Cost", color: "text-yellow-300 bg-yellow-500/10 border-yellow-500/25" },
  high: { label: "High Cost", color: "text-red-300 bg-red-500/10 border-red-500/25" },
};

function getScoreColor(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-yellow-500";
  return "bg-red-500";
}

function getScoreTextColor(score: number): string {
  if (score >= 80) return "text-emerald-300";
  if (score >= 60) return "text-yellow-300";
  return "text-red-300";
}

export function IdeaCard({ idea, isSaved, onToggleSave, onViewDetails, style }: IdeaCardProps) {
  const cat = categoryConfig[idea.category] ?? {
    label: idea.category,
    color: "text-muted-foreground",
    bgColor: "bg-muted/15 border-muted/30",
  };
  const diff = difficultyConfig[idea.implementationDifficulty] ?? {
    label: idea.implementationDifficulty,
    color: "text-muted-foreground bg-muted/15 border-muted/30",
  };
  const cost = costConfig[String(idea.estimatedCostTier)] ?? {
    label: String(idea.estimatedCostTier),
    color: "text-muted-foreground bg-muted/10 border-muted/25",
  };
  const score = Number(idea.opportunityScore);

  return (
    <article
      className="group relative glass-card rounded-2xl p-5 border border-border/60 card-hover flex flex-col gap-4 overflow-hidden"
      style={style}
    >
      {/* Subtle top shine */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none" />

      {/* Header row: category + trending */}
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border",
            cat.bgColor,
            cat.color
          )}
        >
          {cat.label}
        </span>

        <div className="flex items-center gap-2">
          {idea.trending && (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border border-accent/40 bg-accent/15 text-accent pulse-gold">
              <TrendingUp className="w-3 h-3" />
              Hot
            </span>
          )}
          <button
            type="button"
            onClick={() => onToggleSave(idea.id)}
            className={cn(
              "p-1.5 rounded-lg transition-all duration-200",
              isSaved
                ? "text-accent bg-accent/15 border border-accent/30"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent"
            )}
            aria-label={isSaved ? "Unsave idea" : "Save idea"}
          >
            {isSaved ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Title */}
      <div>
        <h3 className="font-semibold text-foreground text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {idea.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {idea.shortDescription}
        </p>
      </div>

      {/* Opportunity Score */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-medium">Opportunity Score</span>
          <span className={cn("font-bold font-mono", getScoreTextColor(score))}>
            {score}/100
          </span>
        </div>
        <div className="h-1.5 w-full bg-secondary/60 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-700", getScoreColor(score))}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Meta chips */}
      <div className="flex flex-wrap gap-2">
        <span
          className={cn(
            "text-xs font-semibold px-2 py-0.5 rounded-md border",
            diff.color
          )}
        >
          {diff.label}
        </span>
        <span
          className={cn(
            "text-xs font-semibold px-2 py-0.5 rounded-md border",
            cost.color
          )}
        >
          {cost.label}
        </span>
      </div>

      {/* Tags */}
      {idea.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {idea.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-md bg-secondary/40 text-muted-foreground border border-border/40"
            >
              #{tag}
            </span>
          ))}
          {idea.tags.length > 4 && (
            <span className="text-xs px-2 py-0.5 rounded-md text-muted-foreground">
              +{idea.tags.length - 4}
            </span>
          )}
        </div>
      )}

      {/* View details button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewDetails(idea)}
        className="mt-auto w-full rounded-xl border border-border/50 bg-secondary/30 hover:bg-primary/10 hover:border-primary/40 hover:text-primary text-muted-foreground transition-all duration-200 gap-2 text-sm"
      >
        <Eye className="w-4 h-4" />
        View Details
      </Button>
    </article>
  );
}
