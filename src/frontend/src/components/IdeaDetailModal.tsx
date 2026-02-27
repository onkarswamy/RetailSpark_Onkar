import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, TrendingUp, Tag, Zap, Target, Wrench } from "lucide-react";
import type { RetailIdea } from "../hooks/useQueries";
import { Category, Difficulty } from "../backend.d";
import { cn } from "@/lib/utils";

interface IdeaDetailModalProps {
  idea: RetailIdea;
  isSaved: boolean;
  onToggleSave: (id: bigint) => void;
  onClose: () => void;
}

const categoryLabels: Record<Category, string> = {
  [Category.ecommerce]: "E-Commerce",
  [Category.inStoreTech]: "In-Store Tech",
  [Category.omnichannel]: "Omnichannel",
  [Category.sustainability]: "Sustainability",
  [Category.experiential]: "Experiential",
  [Category.aiDriven]: "AI-Driven",
  [Category.supplyChain]: "Supply Chain",
};

const difficultyConfig: Record<Difficulty, { label: string; color: string }> = {
  [Difficulty.easy]: {
    label: "Easy",
    color: "text-emerald-300 bg-emerald-500/15 border-emerald-500/30",
  },
  [Difficulty.medium]: {
    label: "Medium",
    color: "text-yellow-300 bg-yellow-500/15 border-yellow-500/30",
  },
  [Difficulty.hard]: {
    label: "Hard",
    color: "text-red-300 bg-red-500/15 border-red-500/30",
  },
};

const costLabels: Record<string, string> = {
  low: "Low Cost",
  medium: "Medium Cost",
  high: "High Cost",
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

export function IdeaDetailModal({
  idea,
  isSaved,
  onToggleSave,
  onClose,
}: IdeaDetailModalProps) {
  const score = Number(idea.opportunityScore);
  const diff = difficultyConfig[idea.implementationDifficulty];
  const catLabel = categoryLabels[idea.category] ?? String(idea.category);
  const costLabel = costLabels[String(idea.estimatedCostTier)] ?? String(idea.estimatedCostTier);

  // Parse implementation steps from fullDescription
  const steps = parseImplementationSteps(idea.fullDescription);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto bg-card border-border/60 rounded-2xl p-0 scrollbar-thin">
        {/* Hero section */}
        <div className="relative overflow-hidden rounded-t-2xl p-6 pb-5 bg-gradient-to-br from-secondary/80 via-card to-card border-b border-border/40">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

          <DialogHeader className="space-y-0">
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-primary/15 border border-primary/30 text-primary">
                {catLabel}
              </span>
              {idea.trending && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border border-accent/40 bg-accent/15 text-accent pulse-gold">
                  <TrendingUp className="w-3 h-3" />
                  Trending
                </span>
              )}
              {diff && (
                <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-md border", diff.color)}>
                  {diff.label}
                </span>
              )}
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-secondary/50 border border-border/40 text-muted-foreground">
                {costLabel}
              </span>
            </div>

            <DialogTitle className="font-serif text-2xl leading-snug text-foreground text-left">
              {idea.title}
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Opportunity score */}
          <div className="glass-card rounded-xl p-4 border border-border/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Target className="w-4 h-4" />
                Opportunity Score
              </div>
              <span className={cn("text-xl font-bold font-mono", getScoreTextColor(score))}>
                {score}
                <span className="text-sm text-muted-foreground">/100</span>
              </span>
            </div>
            <div className="h-2 w-full bg-secondary/60 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-700", getScoreColor(score))}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          {/* Short description */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Overview
            </h3>
            <p className="text-foreground/90 leading-relaxed text-sm">
              {idea.shortDescription}
            </p>
          </div>

          {/* Full description / implementation steps */}
          {steps.length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-primary" />
                Implementation Steps
              </h3>
              <ol className="space-y-3">
                {steps.map((step, i) => (
                  <li key={`step-${step.slice(0, 20)}-${i.toString()}`} className="flex gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-foreground/85 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-primary" />
                Details
              </h3>
              <p className="text-foreground/85 leading-relaxed text-sm whitespace-pre-wrap">
                {idea.fullDescription}
              </p>
            </div>
          )}

          {/* Tags */}
          {idea.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {idea.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-lg bg-secondary/40 text-muted-foreground border border-border/40"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Save button */}
          <Button
            onClick={() => onToggleSave(idea.id)}
            className={cn(
              "w-full h-11 rounded-xl font-semibold gap-2 transition-all duration-300",
              isSaved
                ? "bg-accent/15 border border-accent/40 text-accent hover:bg-accent/25"
                : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-sm hover:shadow-glow"
            )}
            variant={isSaved ? "outline" : "default"}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4" />
                Saved to Collection
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                Save This Idea
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function parseImplementationSteps(fullDescription: string): string[] {
  // Try to parse numbered list patterns like "1. Step", "1) Step", or line-separated
  const numberedPattern = /\d+[.)]\s+(.+?)(?=\d+[.)]\s|\n\n|$)/gs;
  const matches = [...fullDescription.matchAll(numberedPattern)];
  if (matches.length >= 2) {
    return matches.map((m) => m[1].trim()).filter(Boolean);
  }

  // Try to split by newlines or bullet points
  const lines = fullDescription
    .split(/\n/)
    .map((l) => l.replace(/^[-•*]\s+/, "").trim())
    .filter((l) => l.length > 20);

  if (lines.length >= 3) return lines;

  return [];
}
