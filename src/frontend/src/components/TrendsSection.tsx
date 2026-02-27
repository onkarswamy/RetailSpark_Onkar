import { Activity, TrendingUp, AlertCircle, Minus } from "lucide-react";
import type { MarketTrend } from "../hooks/useQueries";
import { Category, ImpactLevel } from "../backend.d";
import { cn } from "@/lib/utils";

interface TrendsSectionProps {
  trends: MarketTrend[];
  isLoading: boolean;
}

const impactConfig: Record<
  ImpactLevel,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  [ImpactLevel.high]: {
    label: "High Impact",
    icon: <TrendingUp className="w-3.5 h-3.5" />,
    color: "text-red-300",
    bg: "bg-red-500/15 border-red-500/30",
  },
  [ImpactLevel.medium]: {
    label: "Medium Impact",
    icon: <Activity className="w-3.5 h-3.5" />,
    color: "text-yellow-300",
    bg: "bg-yellow-500/15 border-yellow-500/30",
  },
  [ImpactLevel.low]: {
    label: "Low Impact",
    icon: <Minus className="w-3.5 h-3.5" />,
    color: "text-blue-300",
    bg: "bg-blue-500/15 border-blue-500/30",
  },
};

const categoryShortLabels: Record<Category, string> = {
  [Category.ecommerce]: "E-Commerce",
  [Category.inStoreTech]: "In-Store",
  [Category.omnichannel]: "Omnichannel",
  [Category.sustainability]: "Sustainability",
  [Category.experiential]: "Experiential",
  [Category.aiDriven]: "AI",
  [Category.supplyChain]: "Supply Chain",
};

export function TrendsSection({ trends, isLoading }: TrendsSectionProps) {
  return (
    <section className="space-y-6">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
          <Activity className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="font-serif text-2xl text-foreground">
            Current Market Intelligence
          </h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Real-time signals shaping the retail landscape
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }, (_, i) => `t-sk-${i}`).map((k) => (
            <div
              key={k}
              className="glass-card rounded-2xl p-5 border border-border/60 space-y-3"
            >
              <div className="h-5 w-1/3 rounded shimmer" />
              <div className="h-4 w-full rounded shimmer" />
              <div className="h-4 w-4/5 rounded shimmer" />
              <div className="flex gap-2">
                <div className="h-5 w-16 rounded-md shimmer" />
                <div className="h-5 w-20 rounded-md shimmer" />
              </div>
            </div>
          ))}
        </div>
      ) : trends.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-secondary/30 border border-border/40">
            <AlertCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="font-serif text-xl text-foreground">No trends available</p>
          <p className="text-muted-foreground text-sm">
            Market trend data will appear here once the system is populated.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trends.map((trend, i) => (
            <TrendCard
              key={trend.id.toString()}
              trend={trend}
              style={{ animationDelay: `${i * 0.06}s` }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

interface TrendCardProps {
  trend: MarketTrend;
  style?: React.CSSProperties;
}

function TrendCard({ trend, style }: TrendCardProps) {
  const impact = impactConfig[trend.impactLevel] ?? {
    label: String(trend.impactLevel),
    icon: <Activity className="w-3.5 h-3.5" />,
    color: "text-muted-foreground",
    bg: "bg-muted/15 border-muted/30",
  };

  return (
    <article
      className="group glass-card rounded-2xl p-5 border border-border/60 card-hover flex flex-col gap-3 overflow-hidden fade-in-up"
      style={style}
    >
      {/* Top shine */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-foreground text-sm leading-snug flex-1 group-hover:text-primary transition-colors duration-200">
          {trend.name}
        </h3>
        <span
          className={cn(
            "inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md border shrink-0",
            impact.bg,
            impact.color
          )}
        >
          {impact.icon}
          {impact.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
        {trend.description}
      </p>

      {/* Affected categories */}
      {trend.affectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          {trend.affectedCategories.map((cat) => (
            <span
              key={String(cat)}
              className="text-xs px-2 py-0.5 rounded-md bg-secondary/40 text-muted-foreground border border-border/40"
            >
              {categoryShortLabels[cat] ?? String(cat)}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
