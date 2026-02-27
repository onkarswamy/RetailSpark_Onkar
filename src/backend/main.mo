import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import List "mo:core/List";
import Bool "mo:core/Bool";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

actor {
  type Difficulty = {
    #easy;
    #medium;
    #hard;
  };

  type CostTier = {
    #low;
    #medium;
    #high;
  };

  type ImpactLevel = {
    #high;
    #medium;
    #low;
  };

  type Category = {
    #ecommerce;
    #inStoreTech;
    #omnichannel;
    #sustainability;
    #experiential;
    #aiDriven;
    #supplyChain;
  };

  type RetailIdea = {
    id : Nat;
    title : Text;
    shortDescription : Text;
    fullDescription : Text;
    category : Category;
    opportunityScore : Nat;
    implementationDifficulty : Difficulty;
    estimatedCostTier : CostTier;
    tags : [Text];
    trending : Bool;
  };

  type MarketTrend = {
    id : Nat;
    name : Text;
    description : Text;
    impactLevel : ImpactLevel;
    affectedCategories : [Category];
  };

  module MarketTrend {
    public func compare(x : MarketTrend, y : MarketTrend) : Order.Order {
      Nat.compare(x.id, y.id);
    };
  };

  module Category {
    public func compare(x : Category, y : Category) : Order.Order {
      switch (x, y) {
        case (#ecommerce, #ecommerce) { #equal };
        case (#ecommerce, _) { #less };
        case (#inStoreTech, #ecommerce) { #greater };
        case (#inStoreTech, #inStoreTech) { #equal };
        case (#inStoreTech, _) { #less };
        case (#omnichannel, #ecommerce) { #greater };
        case (#omnichannel, #inStoreTech) { #greater };
        case (#omnichannel, #omnichannel) { #equal };
        case (#omnichannel, _) { #less };
        case (#sustainability, #sustainability) { #equal };
        case (#sustainability, _) { #less };
        case (#experiential, #ecommerce) { #greater };
        case (#experiential, #inStoreTech) { #greater };
        case (#experiential, #omnichannel) { #greater };
        case (#experiential, #sustainability) { #greater };
        case (#experiential, #experiential) { #equal };
        case (#experiential, _) { #less };
        case (#aiDriven, #aiDriven) { #equal };
        case (#aiDriven, _) { #greater };
        case (#supplyChain, #supplyChain) { #equal };
        case (#supplyChain, _) { #greater };
      };
    };
  };

  module RetailIdea {
    public func compare(x : RetailIdea, y : RetailIdea) : Order.Order {
      switch (Nat.compare(x.opportunityScore, y.opportunityScore)) {
        case (#greater) { #less };
        case (order) { order };
      };
    };
  };

  var nextIdeaId = 1;
  let ideas = Map.empty<Nat, RetailIdea>();
  let trends = Map.empty<Nat, MarketTrend>();
  let userSavedIdeas = Map.empty<Principal, Set.Set<Nat>>();

  public shared ({ caller }) func saveIdea(ideaId : Nat) : async () {
    if (not ideas.containsKey(ideaId)) {
      Runtime.trap("Idea does not exist. Search for a valid idea id first.");
    };
    let savedSet = switch (userSavedIdeas.get(caller)) {
      case (null) { Set.empty<Nat>() };
      case (?existing) { existing };
    };
    savedSet.add(ideaId);
    userSavedIdeas.add(caller, savedSet);
  };

  public shared ({ caller }) func unsaveIdea(ideaId : Nat) : async () {
    switch (userSavedIdeas.get(caller)) {
      case (null) { () };
      case (?savedSet) {
        savedSet.remove(ideaId);
        userSavedIdeas.add(caller, savedSet);
      };
    };
  };

  public query ({ caller }) func getSavedIdeas() : async [Nat] {
    switch (userSavedIdeas.get(caller)) {
      case (null) { [] };
      case (?savedSet) { savedSet.toArray() };
    };
  };

  public query ({ caller }) func filterIdeasByCategory(category : Category) : async [RetailIdea] {
    ideas.values().toArray().filter(
      func(idea) {
        idea.category == category;
      }
    );
  };

  public query ({ caller }) func filterIdeasByBudget(costTier : CostTier) : async [RetailIdea] {
    ideas.values().toArray().filter(
      func(idea) {
        idea.estimatedCostTier == costTier;
      }
    );
  };

  public query ({ caller }) func getIdea(id : Nat) : async RetailIdea {
    switch (ideas.get(id)) {
      case (?idea) { idea };
      case (null) { Runtime.trap("Idea not found.") };
    };
  };

  public query ({ caller }) func getAllIdeas() : async [RetailIdea] {
    ideas.values().toArray();
  };

  public query ({ caller }) func getAllMarketTrends() : async [MarketTrend] {
    trends.values().toArray();
  };

  public query ({ caller }) func filterIdeas(
    category : ?Category,
    budget : ?CostTier,
    trendIds : ?[Nat]
  ) : async [RetailIdea] {
    let filteredList = ideas.values().toList<RetailIdea>().filter(
      func(idea) {
        let matchesCategory = switch (category) {
          case (null) { true };
          case (?cat) { idea.category == cat };
        };

        let matchesBudget = switch (budget) {
          case (null) { true };
          case (?cost) { idea.estimatedCostTier == cost };
        };

        matchesCategory and matchesBudget
      }
    );
    filteredList.toArray().sort();
  };

  public shared ({ caller }) func addIdea(idea : RetailIdea) : async Nat {
    let id = nextIdeaId;
    nextIdeaId += 1;
    let newIdea = {
      id;
      title = idea.title;
      shortDescription = idea.shortDescription;
      fullDescription = idea.fullDescription;
      category = idea.category;
      opportunityScore = idea.opportunityScore;
      implementationDifficulty = idea.implementationDifficulty;
      estimatedCostTier = idea.estimatedCostTier;
      tags = idea.tags;
      trending = idea.trending;
    };
    ideas.add(id, newIdea);
    id;
  };

  public shared ({ caller }) func addMarketTrend(trend : MarketTrend) : async Nat {
    let id = nextIdeaId;
    nextIdeaId += 1;
    let newTrend = {
      id;
      name = trend.name;
      description = trend.description;
      impactLevel = trend.impactLevel;
      affectedCategories = trend.affectedCategories;
    };
    trends.add(id, newTrend);
    id;
  };

  public shared ({ caller }) func populateInitialData() : async () {
    if (ideas.size() > 0) { return };

    let initialIdeas : [RetailIdea] = [
      {
        id = 1;
        title = "AI-Powered Personalized Shopping";
        shortDescription = "Customized product recommendations using AI.";
        fullDescription = "Uses machine learning to analyze customer preferences and shopping history to provide highly personalized shopping experiences across online and in-store channels.";
        category = #aiDriven;
        opportunityScore = 95;
        implementationDifficulty = #hard;
        estimatedCostTier = #high;
        tags = ["AI", "Personalization", "Cross-Channel"];
        trending = true;
      },
      {
        id = 2;
        title = "Augmented Reality (AR) Try-Ons";
        shortDescription = "Virtual try-ons for clothing and accessories.";
        fullDescription = "AR tech allows customers to visualize apparel, cosmetics, or furniture in real-world settings via their smartphones or in-store kiosks.";
        category = #experiential;
        opportunityScore = 85;
        implementationDifficulty = #medium;
        estimatedCostTier = #medium;
        tags = ["AR", "Experience", "In-Store"];
        trending = true;
      },
      // Additional initial ideas should be populated here following the same structure.
    ];

    for (idea in initialIdeas.values()) {
      ideas.add(idea.id, idea);
    };

    let initialTrends : [MarketTrend] = [
      {
        id = 1;
        name = "Sustainability Demand";
        description = "Growing consumer preference for environmentally friendly products.";
        impactLevel = #high;
        affectedCategories = [#sustainability, #ecommerce, #inStoreTech];
      },
      {
        id = 2;
        name = "Omnichannel Integration";
        description = "Seamless integration of online and offline retail experiences.";
        impactLevel = #high;
        affectedCategories = [#omnichannel, #ecommerce, #inStoreTech, #experiential];
      },
      // Additional initial trends should be populated here following the same structure.
    ];

    for (trend in initialTrends.values()) {
      trends.add(trend.id, trend);
    };
  };

  public query ({ caller }) func getTrendingIdeas() : async [RetailIdea] {
    ideas.values().toArray().filter(
      func(idea) {
        idea.trending;
      }
    );
  };

  public query ({ caller }) func getIdeasByCategory(category : Category) : async [RetailIdea] {
    ideas.values().toArray().filter(
      func(idea) {
        idea.category == category;
      }
    );
  };
};
