import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Sparkles,
  TrendingUp,
  BarChart3,
  Bookmark,
  Zap,
  Heart,
} from "lucide-react";

import { HeroBanner } from "./components/HeroBanner";
import { FilterPanel } from "./components/FilterPanel";
import { IdeasGrid } from "./components/IdeasGrid";
import { TrendsSection } from "./components/TrendsSection";
import { SavedIdeasSection } from "./components/SavedIdeasSection";
import { IdeaDetailModal } from "./components/IdeaDetailModal";

import {
  useAllIdeas,
  useAllMarketTrends,
  useTrendingIdeas,
  useSavedIdeas,
  useSavedIdeasDetails,
  useSaveIdea,
  useUnsaveIdea,
  useFilteredIdeas,
  usePopulateInitialData,
  type RetailIdea,
  type CostTier,
} from "./hooks/useQueries";
import { Category } from "./backend.d";
import { useActor } from "./hooks/useActor";

export default function App() {
  const { actor, isFetching: actorLoading } = useActor();

  const [activeTab, setActiveTab] = useState("discover");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<CostTier | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<RetailIdea | null>(null);
  const [isFiltered, setIsFiltered] = useState(false);

  // Populate initial data once
  const populate = usePopulateInitialData();
  const populateMutate = populate.mutate;
  useEffect(() => {
    if (actor && !actorLoading) {
      populateMutate();
    }
  }, [actor, actorLoading, populateMutate]);

  // Data queries
  const { data: allIdeas = [], isLoading: ideasLoading } = useAllIdeas();
  const { data: trends = [], isLoading: trendsLoading } = useAllMarketTrends();
  const { data: trendingIdeas = [], isLoading: trendingLoading } = useTrendingIdeas();
  const { data: savedIds = [] } = useSavedIdeas();
  const savedIdeasDetails = useSavedIdeasDetails();

  const { data: filteredIdeas = [], isLoading: filterLoading } = useFilteredIdeas(
    isFiltered ? selectedCategory : null,
    isFiltered ? selectedBudget : null
  );

  const saveIdeaMutation = useSaveIdea();
  const unsaveIdeaMutation = useUnsaveIdea();

  const savedSet = new Set(savedIds.map((id) => id.toString()));

  const handleToggleSave = async (ideaId: bigint) => {
    const isSaved = savedSet.has(ideaId.toString());
    try {
      if (isSaved) {
        await unsaveIdeaMutation.mutateAsync(ideaId);
        toast.success("Idea removed from saved");
      } else {
        await saveIdeaMutation.mutateAsync(ideaId);
        toast.success("Idea saved!");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("auth") || msg.includes("unauthorized") || msg.includes("Anonymous")) {
        toast.error("Sign in to save ideas");
      } else {
        toast.error("Failed to save idea. Please try again.");
      }
    }
  };

  const handleGenerateIdeas = () => {
    setIsFiltered(true);
  };

  const displayedIdeas =
    isFiltered ? filteredIdeas : activeTab === "trending" ? trendingIdeas : allIdeas;
  const isLoadingIdeas =
    ideasLoading || trendingLoading || (isFiltered && filterLoading);

  const statsData = {
    total: allIdeas.length,
    trending: trendingIdeas.length,
    trendsTracked: trends.length,
  };

  return (
    <div className="min-h-screen bg-background bg-mesh">
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: "oklch(0.16 0.025 258)",
            border: "1px solid oklch(0.28 0.03 255)",
            color: "oklch(0.95 0.012 250)",
          },
        }}
      />

      {/* Hero */}
      <HeroBanner stats={statsData} />

      {/* Main content */}
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            setActiveTab(v);
            if (v !== "discover") setIsFiltered(false);
          }}
          className="space-y-8"
        >
          {/* Tab nav */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <TabsList className="bg-secondary/50 border border-border p-1 rounded-xl backdrop-blur-sm">
              <TabsTrigger
                value="discover"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-glow-sm rounded-lg px-4 py-2 text-sm font-medium transition-all gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Discover
              </TabsTrigger>
              <TabsTrigger
                value="trending"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-glow-sm rounded-lg px-4 py-2 text-sm font-medium transition-all gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger
                value="market"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-glow-sm rounded-lg px-4 py-2 text-sm font-medium transition-all gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Market Trends
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-glow-sm rounded-lg px-4 py-2 text-sm font-medium transition-all gap-2"
              >
                <Bookmark className="w-4 h-4" />
                Saved
                {savedIds.length > 0 && (
                  <span className="ml-1 bg-accent text-accent-foreground text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center">
                    {savedIds.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Discover tab */}
          <TabsContent value="discover" className="space-y-6 mt-0">
            <FilterPanel
              selectedCategory={selectedCategory}
              selectedBudget={selectedBudget}
              onCategoryChange={setSelectedCategory}
              onBudgetChange={setSelectedBudget}
              onGenerate={handleGenerateIdeas}
              isLoading={isFiltered && filterLoading}
            />
            <IdeasGrid
              ideas={displayedIdeas}
              isLoading={isLoadingIdeas}
              savedIds={savedSet}
              onToggleSave={handleToggleSave}
              onViewDetails={setSelectedIdea}
            />
          </TabsContent>

          {/* Trending tab */}
          <TabsContent value="trending" className="mt-0">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-serif text-2xl text-foreground">
                  Hot Right Now
                </h2>
              </div>
              <p className="text-muted-foreground text-sm">
                Ideas gaining momentum based on current market signals
              </p>
            </div>
            <IdeasGrid
              ideas={trendingIdeas}
              isLoading={trendingLoading}
              savedIds={savedSet}
              onToggleSave={handleToggleSave}
              onViewDetails={setSelectedIdea}
            />
          </TabsContent>

          {/* Market trends tab */}
          <TabsContent value="market" className="mt-0">
            <TrendsSection trends={trends} isLoading={trendsLoading} />
          </TabsContent>

          {/* Saved tab */}
          <TabsContent value="saved" className="mt-0">
            <SavedIdeasSection
              ideas={savedIdeasDetails}
              savedIds={savedSet}
              onToggleSave={handleToggleSave}
              onViewDetails={setSelectedIdea}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border/50 py-8">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="w-4 h-4 text-primary" />
              <span className="font-semibold text-foreground font-serif">RetailSpark</span>
              <span>— Market Intelligence for Retail Innovators</span>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              © 2026. Built with{" "}
              <Heart className="w-3.5 h-3.5 text-destructive fill-destructive inline" />{" "}
              using{" "}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Idea Detail Modal */}
      {selectedIdea && (
        <IdeaDetailModal
          idea={selectedIdea}
          isSaved={savedSet.has(selectedIdea.id.toString())}
          onToggleSave={handleToggleSave}
          onClose={() => setSelectedIdea(null)}
        />
      )}
    </div>
  );
}
