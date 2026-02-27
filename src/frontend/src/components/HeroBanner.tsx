import { Zap, TrendingUp, Lightbulb, Activity } from "lucide-react";

interface HeroBannerProps {
  stats: {
    total: number;
    trending: number;
    trendsTracked: number;
  };
}

export function HeroBanner({ stats }: HeroBannerProps) {
  return (
    <header className="relative overflow-hidden">
      {/* Hero image background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/generated/hero-banner.dim_1200x400.jpg')",
        }}
      />
      {/* Layered dark overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/75 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />

      {/* Decorative glowing orbs */}
      <div className="absolute top-8 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute top-4 right-1/3 w-48 h-48 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="relative container max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Logo / wordmark */}
        <div className="flex items-center gap-3 mb-6 fade-in-up">
          <div className="p-2.5 rounded-xl bg-primary/15 border border-primary/30 shadow-glow-sm">
            <Zap className="w-6 h-6 text-primary animate-float" />
          </div>
          <span className="font-serif text-xl font-normal tracking-wide text-foreground/80">
            RetailSpark
          </span>
        </div>

        {/* Main heading */}
        <div className="max-w-3xl">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight mb-4 fade-in-up stagger-2">
            <span className="text-gradient-blue">Discover Breakthrough</span>
            <br />
            <span className="text-foreground">Retail Innovations</span>
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-xl leading-relaxed fade-in-up stagger-3">
            Powered by real-time market intelligence. Explore curated ideas
            across every retail frontier — from AI-driven stores to
            sustainability-first supply chains.
          </p>
        </div>

        {/* Stats bar */}
        <div className="mt-10 flex flex-wrap gap-4 fade-in-up stagger-4">
          <StatPill
            icon={<Lightbulb className="w-4 h-4" />}
            label="Total Ideas"
            value={stats.total}
            color="primary"
          />
          <StatPill
            icon={<TrendingUp className="w-4 h-4" />}
            label="Trending Now"
            value={stats.trending}
            color="accent"
          />
          <StatPill
            icon={<Activity className="w-4 h-4" />}
            label="Market Signals"
            value={stats.trendsTracked}
            color="success"
          />
        </div>
      </div>
    </header>
  );
}

interface StatPillProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "primary" | "accent" | "success";
}

const colorMap = {
  primary: {
    bg: "bg-primary/10 border-primary/25",
    icon: "text-primary",
    value: "text-primary",
  },
  accent: {
    bg: "bg-accent/10 border-accent/25",
    icon: "text-accent",
    value: "text-accent",
  },
  success: {
    bg: "bg-success/10 border-success/25",
    icon: "text-success",
    value: "text-success",
  },
};

function StatPill({ icon, label, value, color }: StatPillProps) {
  const c = colorMap[color];
  return (
    <div
      className={`flex items-center gap-3 px-5 py-3 rounded-xl border glass-card ${c.bg} backdrop-blur-md`}
    >
      <span className={c.icon}>{icon}</span>
      <div>
        <div className={`text-2xl font-bold font-mono ${c.value}`}>
          {value}
        </div>
        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          {label}
        </div>
      </div>
    </div>
  );
}
