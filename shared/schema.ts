import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  displayName: text("display_name").notNull(),
  avatar: text("avatar"),
  totalCatches: real("total_catches").default(0),
  speciesCount: real("species_count").default(0),
  spotsVisited: real("spots_visited").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const fishSpecies = pgTable("fish_species", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  scientificName: text("scientific_name"),
  description: text("description"),
  habitat: text("habitat"),
  difficulty: text("difficulty"), // "Beginner Friendly", "Intermediate", "Advanced"
  imageUrl: text("image_url"),
  averageWeight: real("average_weight"),
  averageLength: real("average_length"),
  tips: text("tips"),
  commonBaits: json("common_baits").$type<string[]>(),
});

export const fishingSpots = pgTable("fishing_spots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  fishingScore: real("fishing_score"), // 1-10 rating
  imageUrl: text("image_url"),
  accessibility: text("accessibility"),
  facilities: json("facilities").$type<string[]>(),
  bestSeasons: json("best_seasons").$type<string[]>(),
  commonSpecies: json("common_species").$type<string[]>(),
  recentCatches: real("recent_catches").default(0),
});

export const catches = pgTable("catches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  speciesId: varchar("species_id").references(() => fishSpecies.id),
  spotId: varchar("spot_id").references(() => fishingSpots.id),
  weight: real("weight"),
  length: real("length"),
  photoUrl: text("photo_url"),
  notes: text("notes"),
  baitUsed: text("bait_used"),
  weatherConditions: text("weather_conditions"),
  waterTemperature: real("water_temperature"),
  isReleased: boolean("is_released").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  likes: real("likes").default(0),
  comments: real("comments").default(0),
});

export const tips = pgTable("tips", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category"), // "technique", "equipment", "timing", "location"
  difficulty: text("difficulty"),
  imageUrl: text("image_url"),
  author: text("author"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const weather = pgTable("weather", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  location: text("location").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  temperature: real("temperature"),
  condition: text("condition"),
  windSpeed: real("wind_speed"),
  humidity: real("humidity"),
  visibility: real("visibility"),
  fishingScore: text("fishing_score"), // "Poor", "Fair", "Good", "Excellent"
  timestamp: timestamp("timestamp").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertFishSpeciesSchema = createInsertSchema(fishSpecies).omit({
  id: true,
});

export const insertFishingSpotSchema = createInsertSchema(fishingSpots).omit({
  id: true,
});

export const insertCatchSchema = createInsertSchema(catches).omit({
  id: true,
  createdAt: true,
  likes: true,
  comments: true,
});

export const insertTipSchema = createInsertSchema(tips).omit({
  id: true,
  createdAt: true,
});

export const insertWeatherSchema = createInsertSchema(weather).omit({
  id: true,
  timestamp: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type FishSpecies = typeof fishSpecies.$inferSelect;
export type InsertFishSpecies = z.infer<typeof insertFishSpeciesSchema>;

export type FishingSpot = typeof fishingSpots.$inferSelect;
export type InsertFishingSpot = z.infer<typeof insertFishingSpotSchema>;

export type Catch = typeof catches.$inferSelect;
export type InsertCatch = z.infer<typeof insertCatchSchema>;

export type Tip = typeof tips.$inferSelect;
export type InsertTip = z.infer<typeof insertTipSchema>;

export type Weather = typeof weather.$inferSelect;
export type InsertWeather = z.infer<typeof insertWeatherSchema>;
