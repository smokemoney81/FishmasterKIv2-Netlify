import type { FishSpecies, FishingSpot, Tip } from "@shared/schema";

export const mockFishSpecies: FishSpecies[] = [
  {
    id: "rainbow-trout",
    name: "Rainbow Trout",
    scientificName: "Oncorhynchus mykiss",
    description: "A popular game fish known for its vibrant colors and fighting spirit.",
    habitat: "Freshwater lakes and streams",
    difficulty: "Beginner Friendly",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
    averageWeight: 2.5,
    averageLength: 14,
    tips: "Best caught early morning or late evening with spinners or flies.",
    commonBaits: ["Spinners", "Flies", "Worms", "Salmon eggs"]
  },
  {
    id: "largemouth-bass",
    name: "Largemouth Bass",
    scientificName: "Micropterus salmoides",
    description: "A popular freshwater game fish known for its aggressive strikes.",
    habitat: "Warm water lakes and ponds",
    difficulty: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
    averageWeight: 3.5,
    averageLength: 16,
    tips: "Target structure like fallen trees and weed beds.",
    commonBaits: ["Plastic worms", "Crankbaits", "Jigs", "Topwater lures"]
  },
  {
    id: "coho-salmon",
    name: "Coho Salmon",
    scientificName: "Oncorhynchus kisutch",
    description: "A prized salmon species known for its acrobatic fights.",
    habitat: "Rivers and streams during spawning",
    difficulty: "Advanced",
    imageUrl: "https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
    averageWeight: 8,
    averageLength: 24,
    tips: "Fish during salmon runs in fall months.",
    commonBaits: ["Salmon flies", "Spoons", "Roe", "Spinners"]
  },
  {
    id: "northern-pike",
    name: "Northern Pike",
    scientificName: "Esox lucius",
    description: "An aggressive predator fish with distinctive markings.",
    habitat: "Weedy lakes and slow rivers",
    difficulty: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
    averageWeight: 6,
    averageLength: 28,
    tips: "Use steel leaders to prevent bite-offs.",
    commonBaits: ["Large spoons", "Jerkbaits", "Live bait", "Spinnerbaits"]
  }
];

export const mockFishingSpots: FishingSpot[] = [
  {
    id: "crystal-lake",
    name: "Crystal Lake",
    description: "Known for rainbow trout and bass fishing",
    latitude: 39.0968,
    longitude: -120.0324,
    fishingScore: 9.2,
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
    accessibility: "Easy access with parking",
    facilities: ["Boat ramp", "Restrooms", "Picnic area"],
    bestSeasons: ["Spring", "Summer", "Fall"],
    commonSpecies: ["Rainbow Trout", "Largemouth Bass"],
    recentCatches: 12
  },
  {
    id: "whispering-river",
    name: "Whispering River",
    description: "Perfect for fly fishing and salmon runs",
    latitude: 39.1234,
    longitude: -120.4567,
    fishingScore: 8.7,
    imageUrl: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
    accessibility: "Moderate hike required",
    facilities: ["Trail access only"],
    bestSeasons: ["Fall", "Spring"],
    commonSpecies: ["Coho Salmon", "Rainbow Trout"],
    recentCatches: 8
  }
];

export const mockTips: Tip[] = [
  {
    id: "early-morning-tip",
    title: "Early Morning Fishing",
    content: "Fish are most active during dawn and dusk when the water temperature is cooler. Try fishing between 5-7 AM for the best results! The low light conditions make fish less wary, and cooler temperatures increase their feeding activity.",
    category: "timing",
    difficulty: "Beginner Friendly",
    imageUrl: "https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
    author: "Pro Angler Mike",
    createdAt: new Date()
  }
];
