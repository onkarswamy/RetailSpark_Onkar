import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface RetailIdea {
    id: bigint;
    title: string;
    tags: Array<string>;
    trending: boolean;
    shortDescription: string;
    category: Category;
    estimatedCostTier: CostTier;
    fullDescription: string;
    implementationDifficulty: Difficulty;
    opportunityScore: bigint;
}
export interface MarketTrend {
    id: bigint;
    impactLevel: ImpactLevel;
    name: string;
    description: string;
    affectedCategories: Array<Category>;
}
export enum Category {
    experiential = "experiential",
    omnichannel = "omnichannel",
    inStoreTech = "inStoreTech",
    aiDriven = "aiDriven",
    supplyChain = "supplyChain",
    sustainability = "sustainability",
    ecommerce = "ecommerce"
}
export enum Difficulty {
    easy = "easy",
    hard = "hard",
    medium = "medium"
}
export enum ImpactLevel {
    low = "low",
    high = "high",
    medium = "medium"
}
export interface backendInterface {
    addIdea(idea: RetailIdea): Promise<bigint>;
    addMarketTrend(trend: MarketTrend): Promise<bigint>;
    filterIdeas(category: Category | null, budget: CostTier | null, trendIds: Array<bigint> | null): Promise<Array<RetailIdea>>;
    filterIdeasByBudget(costTier: CostTier): Promise<Array<RetailIdea>>;
    filterIdeasByCategory(category: Category): Promise<Array<RetailIdea>>;
    getAllIdeas(): Promise<Array<RetailIdea>>;
    getAllMarketTrends(): Promise<Array<MarketTrend>>;
    getIdea(id: bigint): Promise<RetailIdea>;
    getIdeasByCategory(category: Category): Promise<Array<RetailIdea>>;
    getSavedIdeas(): Promise<Array<bigint>>;
    getTrendingIdeas(): Promise<Array<RetailIdea>>;
    populateInitialData(): Promise<void>;
    saveIdea(ideaId: bigint): Promise<void>;
    unsaveIdea(ideaId: bigint): Promise<void>;
}
