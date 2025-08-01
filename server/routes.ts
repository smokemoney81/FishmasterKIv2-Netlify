import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ObjectStorageService } from "./objectStorage";
import { insertCatchSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Users
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid user data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  // Fish Species
  app.get("/api/species", async (req, res) => {
    try {
      const species = await storage.getFishSpecies();
      res.json(species);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch species" });
    }
  });

  app.get("/api/species/:id", async (req, res) => {
    try {
      const species = await storage.getFishSpeciesById(req.params.id);
      if (!species) {
        return res.status(404).json({ error: "Species not found" });
      }
      res.json(species);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch species" });
    }
  });

  // Fishing Spots
  app.get("/api/spots", async (req, res) => {
    try {
      const spots = await storage.getFishingSpots();
      res.json(spots);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fishing spots" });
    }
  });

  app.get("/api/spots/:id", async (req, res) => {
    try {
      const spot = await storage.getFishingSpotById(req.params.id);
      if (!spot) {
        return res.status(404).json({ error: "Fishing spot not found" });
      }
      res.json(spot);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fishing spot" });
    }
  });

  // Catches
  app.get("/api/catches", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const catches = userId 
        ? await storage.getCatchesByUser(userId)
        : await storage.getCatches();
      res.json(catches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch catches" });
    }
  });

  app.post("/api/catches", async (req, res) => {
    try {
      const catchData = insertCatchSchema.parse(req.body);
      const newCatch = await storage.createCatch(catchData);
      res.status(201).json(newCatch);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid catch data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create catch" });
    }
  });

  app.patch("/api/catches/:id/like", async (req, res) => {
    try {
      const catchData = await storage.getCatchById(req.params.id);
      if (!catchData) {
        return res.status(404).json({ error: "Catch not found" });
      }
      
      const updatedCatch = await storage.updateCatch(req.params.id, {
        likes: (catchData.likes || 0) + 1
      });
      res.json(updatedCatch);
    } catch (error) {
      res.status(500).json({ error: "Failed to like catch" });
    }
  });

  // Tips
  app.get("/api/tips", async (req, res) => {
    try {
      const tips = await storage.getTips();
      res.json(tips);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tips" });
    }
  });

  app.get("/api/tips/:id", async (req, res) => {
    try {
      const tip = await storage.getTipById(req.params.id);
      if (!tip) {
        return res.status(404).json({ error: "Tip not found" });
      }
      res.json(tip);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tip" });
    }
  });

  // Weather
  app.get("/api/weather", async (req, res) => {
    try {
      const { lat, lng } = req.query;
      if (!lat || !lng) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
      }
      
      const weather = await storage.getWeatherByLocation(
        parseFloat(lat as string),
        parseFloat(lng as string)
      );
      
      if (!weather) {
        return res.status(404).json({ error: "Weather data not found" });
      }
      
      res.json(weather);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  });

  // Object Storage for catch photos
  app.post("/api/objects/upload", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving object:", error);
      res.status(404).json({ error: "Object not found" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
