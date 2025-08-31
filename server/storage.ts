import { type User, type InsertUser, type FishSpecies, type InsertFishSpecies, type FishingSpot, type InsertFishingSpot, type Catch, type InsertCatch, type Tip, type InsertTip, type Weather, type InsertWeather, type LogbookEntry, type InsertLogbookEntry } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Fish Species
  getFishSpecies(): Promise<FishSpecies[]>;
  getFishSpeciesById(id: string): Promise<FishSpecies | undefined>;
  createFishSpecies(species: InsertFishSpecies): Promise<FishSpecies>;

  // Fishing Spots
  getFishingSpots(): Promise<FishingSpot[]>;
  getFishingSpotById(id: string): Promise<FishingSpot | undefined>;
  createFishingSpot(spot: InsertFishingSpot): Promise<FishingSpot>;
  updateFishingSpot(id: string, updates: Partial<FishingSpot>): Promise<FishingSpot | undefined>;

  // Catches
  getCatches(): Promise<Catch[]>;
  getCatchesByUser(userId: string): Promise<Catch[]>;
  getCatchById(id: string): Promise<Catch | undefined>;
  createCatch(catchData: InsertCatch): Promise<Catch>;
  updateCatch(id: string, updates: Partial<Catch>): Promise<Catch | undefined>;

  // Tips
  getTips(): Promise<Tip[]>;
  getTipById(id: string): Promise<Tip | undefined>;
  createTip(tip: InsertTip): Promise<Tip>;

  // Weather
  getWeatherByLocation(latitude: number, longitude: number): Promise<Weather | undefined>;
  createWeather(weather: InsertWeather): Promise<Weather>;

  // Logbook
  getLogbookEntries(userId?: string): Promise<LogbookEntry[]>;
  getLogbookEntryById(id: string): Promise<LogbookEntry | undefined>;
  createLogbookEntry(entry: InsertLogbookEntry): Promise<LogbookEntry>;
  updateLogbookEntry(id: string, updates: Partial<LogbookEntry>): Promise<LogbookEntry | undefined>;
  deleteLogbookEntry(id: string): Promise<boolean>;
  getUserStats(userId: string): Promise<{ totalPoints: number; totalCatches: number; rank: string; achievements: string[] }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private fishSpecies: Map<string, FishSpecies> = new Map();
  private fishingSpots: Map<string, FishingSpot> = new Map();
  private catches: Map<string, Catch> = new Map();
  private tips: Map<string, Tip> = new Map();
  private weather: Map<string, Weather> = new Map();
  private logbook: Map<string, LogbookEntry> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize mock fish species (nur relevanteste)
    const species = [
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
      }
    ];

    species.forEach(s => this.fishSpecies.set(s.id, s as FishSpecies));

    // Initialize mock fishing spots (nur wichtigste)
    const spots = [
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
      }
    ];

    spots.forEach(s => this.fishingSpots.set(s.id, s as FishingSpot));

    // Initialize mock tips
    const tipsList = [
      {
        id: "early-morning-tip",
        title: "Early Morning Fishing",
        content: "Fish are most active during dawn and dusk when the water temperature is cooler. Try fishing between 5-7 AM for the best results! The low light conditions make fish less wary, and cooler temperatures increase their feeding activity.",
        category: "timing",
        difficulty: "Beginner Friendly",
        imageUrl: "https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        author: "Pro Angler Mike"
      }
    ];

    tipsList.forEach(t => this.tips.set(t.id, t as Tip));
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      totalCatches: 0,
      speciesCount: 0,
      spotsVisited: 0,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Fish Species
  async getFishSpecies(): Promise<FishSpecies[]> {
    return Array.from(this.fishSpecies.values());
  }

  async getFishSpeciesById(id: string): Promise<FishSpecies | undefined> {
    return this.fishSpecies.get(id);
  }

  async createFishSpecies(insertSpecies: InsertFishSpecies): Promise<FishSpecies> {
    const id = randomUUID();
    const species: FishSpecies = { ...insertSpecies, id };
    this.fishSpecies.set(id, species);
    return species;
  }

  // Fishing Spots
  async getFishingSpots(): Promise<FishingSpot[]> {
    return Array.from(this.fishingSpots.values());
  }

  async getFishingSpotById(id: string): Promise<FishingSpot | undefined> {
    return this.fishingSpots.get(id);
  }

  async createFishingSpot(insertSpot: InsertFishingSpot): Promise<FishingSpot> {
    const id = randomUUID();
    const spot: FishingSpot = { ...insertSpot, id };
    this.fishingSpots.set(id, spot);
    return spot;
  }

  async updateFishingSpot(id: string, updates: Partial<FishingSpot>): Promise<FishingSpot | undefined> {
    const spot = this.fishingSpots.get(id);
    if (!spot) return undefined;
    const updatedSpot = { ...spot, ...updates };
    this.fishingSpots.set(id, updatedSpot);
    return updatedSpot;
  }

  // Catches
  async getCatches(): Promise<Catch[]> {
    return Array.from(this.catches.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getCatchesByUser(userId: string): Promise<Catch[]> {
    return Array.from(this.catches.values())
      .filter(c => c.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getCatchById(id: string): Promise<Catch | undefined> {
    return this.catches.get(id);
  }

  async createCatch(insertCatch: InsertCatch): Promise<Catch> {
    const id = randomUUID();
    const catchData: Catch = { 
      ...insertCatch, 
      id,
      createdAt: new Date(),
      likes: 0,
      comments: 0
    };
    this.catches.set(id, catchData);
    return catchData;
  }

  async updateCatch(id: string, updates: Partial<Catch>): Promise<Catch | undefined> {
    const catchData = this.catches.get(id);
    if (!catchData) return undefined;
    const updatedCatch = { ...catchData, ...updates };
    this.catches.set(id, updatedCatch);
    return updatedCatch;
  }

  // Tips
  async getTips(): Promise<Tip[]> {
    return Array.from(this.tips.values());
  }

  async getTipById(id: string): Promise<Tip | undefined> {
    return this.tips.get(id);
  }

  async createTip(insertTip: InsertTip): Promise<Tip> {
    const id = randomUUID();
    const tip: Tip = { 
      ...insertTip, 
      id,
      createdAt: new Date()
    };
    this.tips.set(id, tip);
    return tip;
  }

  // Weather
  async getWeatherByLocation(latitude: number, longitude: number): Promise<Weather | undefined> {
    // For demo purposes, return mock weather data
    return {
      id: "mock-weather",
      location: "Lake Tahoe, CA",
      latitude,
      longitude,
      temperature: 72,
      condition: "Partly Cloudy",
      windSpeed: 5,
      humidity: 65,
      visibility: 10,
      fishingScore: "Excellent",
      timestamp: new Date()
    };
  }

  async createWeather(insertWeather: InsertWeather): Promise<Weather> {
    const id = randomUUID();
    const weather: Weather = { 
      ...insertWeather, 
      id,
      timestamp: new Date()
    };
    this.weather.set(id, weather);
    return weather;
  }

  // Logbook
  async getLogbookEntries(userId?: string): Promise<LogbookEntry[]> {
    const entries = Array.from(this.logbook.values());
    if (userId) {
      return entries.filter(entry => entry.userId === userId);
    }
    return entries;
  }

  async getLogbookEntryById(id: string): Promise<LogbookEntry | undefined> {
    return this.logbook.get(id);
  }

  async createLogbookEntry(insertEntry: InsertLogbookEntry): Promise<LogbookEntry> {
    const id = randomUUID();
    const entry: LogbookEntry = { 
      ...insertEntry, 
      id,
      createdAt: new Date()
    };
    this.logbook.set(id, entry);
    return entry;
  }

  async updateLogbookEntry(id: string, updates: Partial<LogbookEntry>): Promise<LogbookEntry | undefined> {
    const entry = this.logbook.get(id);
    if (!entry) return undefined;
    const updatedEntry = { ...entry, ...updates };
    this.logbook.set(id, updatedEntry);
    return updatedEntry;
  }

  async deleteLogbookEntry(id: string): Promise<boolean> {
    return this.logbook.delete(id);
  }

  async getUserStats(userId: string): Promise<{ totalPoints: number; totalCatches: number; rank: string; achievements: string[] }> {
    const userEntries = await this.getLogbookEntries(userId);
    const totalPoints = userEntries.reduce((sum, entry) => sum + entry.points, 0);
    const totalCatches = userEntries.length;
    
    // Calculate rank based on points
    let rank = "Anfänger";
    if (totalPoints > 1000) rank = "Pro-Angler";
    if (totalPoints > 2000) rank = "Legende";
    if (totalPoints > 4000) rank = "Fischgott";
    
    // Calculate achievements
    const achievements: string[] = [];
    if (userEntries.some(entry => entry.fish.toLowerCase().includes("hecht"))) {
      achievements.push("Hecht-Killer");
    }
    if (userEntries.filter(entry => entry.weight >= 3).length >= 3) {
      achievements.push("3kg Club");
    }
    if (totalCatches >= 5) {
      achievements.push("Fangmeister");
    }
    
    return { totalPoints, totalCatches, rank, achievements };
  }
}

export const storage = new MemStorage();
