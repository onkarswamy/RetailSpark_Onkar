import { Sparkles, Loader2, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "../backend.d";
import type { CostTier } from "../hooks/useQueries";

interface FilterPanelProps {
  selectedCategory: Category | null;
  selectedBudget: CostTier | null;
  onCategoryChange: (c: Category | null) => void;
  onBudgetChange: (b: CostTier | null) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const CATEGORY_OPTIONS: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "All Categories" },
  { value: Category.ecommerce, label: "E-Commerce" },
  { value: Category.inStoreTech, label: "In-Store Tech" },
  { value: Category.omnichannel, label: "Omnichannel" },
  { value: Category.sustainability, label: "Sustainability" },
  { value: Category.experiential, label: "Experiential" },
  { value: Category.aiDriven, label: "AI-Driven" },
  { value: Category.supplyChain, label: "Supply Chain" },
];

const BUDGET_OPTIONS: { value: CostTier | "all"; label: string }[] = [
  { value: "all", label: "All Budgets" },
  { value: "low", label: "Low Budget" },
  { value: "medium", label: "Medium Budget" },
  { value: "high", label: "High Budget" },
];

export function FilterPanel({
  selectedCategory,
  selectedBudget,
  onCategoryChange,
  onBudgetChange,
  onGenerate,
  isLoading,
}: FilterPanelProps) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-border/60 fade-in-up">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Label */}
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground shrink-0">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filter Ideas</span>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-8 bg-border/60" />

        {/* Filters row */}
        <div className="flex flex-wrap gap-3 flex-1">
          {/* Category */}
          <Select
            value={selectedCategory ?? "all"}
            onValueChange={(v) =>
              onCategoryChange(v === "all" ? null : (v as Category))
            }
          >
            <SelectTrigger className="w-44 bg-secondary/50 border-border/60 text-sm rounded-xl h-10 focus:ring-primary/50 focus:border-primary/50">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border/60 rounded-xl">
              {CATEGORY_OPTIONS.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="text-sm rounded-lg cursor-pointer hover:bg-secondary/70 focus:bg-secondary/70"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Budget */}
          <Select
            value={selectedBudget ?? "all"}
            onValueChange={(v) =>
              onBudgetChange(v === "all" ? null : (v as CostTier))
            }
          >
            <SelectTrigger className="w-44 bg-secondary/50 border-border/60 text-sm rounded-xl h-10 focus:ring-primary/50 focus:border-primary/50">
              <SelectValue placeholder="Budget Tier" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border/60 rounded-xl">
              {BUDGET_OPTIONS.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="text-sm rounded-lg cursor-pointer hover:bg-secondary/70 focus:bg-secondary/70"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Generate button */}
        <Button
          onClick={onGenerate}
          disabled={isLoading}
          className="relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 h-10 rounded-xl shadow-glow-sm hover:shadow-glow transition-all duration-300 shrink-0 gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing…</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Ideas</span>
            </>
          )}
        </Button>
      </div>

      {/* Loading dots indicator */}
      {isLoading && (
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <span>Analyzing market conditions</span>
          <span className="flex gap-1">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-bounce-dot"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-bounce-dot"
              style={{ animationDelay: "160ms" }}
            />
            <span
              className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-bounce-dot"
              style={{ animationDelay: "320ms" }}
            />
          </span>
        </div>
      )}
    </div>
  );
}
