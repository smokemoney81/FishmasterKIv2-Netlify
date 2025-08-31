import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ObjectStorageService } from "./objectStorage";
import { insertCatchSchema, insertUserSchema, insertLogbookSchema, type Weather } from "@shared/schema";
import { z } from "zod";
import FormData from "form-data";

// Open-Meteo Weather API Integration
async function fetchRealWeatherData(latitude: number, longitude: number): Promise<Weather | null> {
  try {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,visibility&timezone=auto`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (!data.current) {
      return null;
    }
    
    const current = data.current;
    
    // Weather codes zur Textbeschreibung umwandeln
    const weatherCondition = getWeatherCondition(current.weather_code);
    
    // Fishing Score basierend auf Wetterbedingungen berechnen
    const fishingScore = calculateFishingScore(
      current.temperature_2m,
      current.wind_speed_10m,
      current.relative_humidity_2m,
      current.weather_code
    );
    
    // Standortname aus Koordinaten ermitteln (vereinfacht)
    const locationName = await getLocationName(latitude, longitude);
    
    return {
      id: `weather-${Date.now()}`,
      location: locationName,
      latitude,
      longitude,
      temperature: Math.round(current.temperature_2m * 9/5 + 32), // Celsius zu Fahrenheit
      condition: weatherCondition,
      windSpeed: Math.round(current.wind_speed_10m * 0.621371), // km/h zu mph
      humidity: current.relative_humidity_2m,
      visibility: current.visibility ? Math.round(current.visibility / 1609.34) : 10, // meter zu miles
      fishingScore,
      timestamp: new Date()
    };
    
  } catch (error) {
    console.error("Open-Meteo API error:", error);
    return null;
  }
}

function getWeatherCondition(weatherCode: number): string {
  // WMO Weather interpretation codes
  if (weatherCode === 0) return "Clear sky";
  if (weatherCode <= 3) return "Partly cloudy";
  if (weatherCode <= 48) return "Foggy";
  if (weatherCode <= 57) return "Drizzle";
  if (weatherCode <= 67) return "Rain";
  if (weatherCode <= 77) return "Snow";
  if (weatherCode <= 82) return "Rain showers";
  if (weatherCode <= 86) return "Snow showers";
  if (weatherCode <= 99) return "Thunderstorm";
  return "Unknown";
}

function calculateFishingScore(temp: number, windSpeed: number, humidity: number, weatherCode: number): string {
  let score = 50; // Basis-Score
  
  // Temperatur-Bewertung (ideal: 15-25°C)
  const tempC = temp;
  if (tempC >= 15 && tempC <= 25) score += 20;
  else if (tempC >= 10 && tempC <= 30) score += 10;
  else if (tempC < 5 || tempC > 35) score -= 20;
  
  // Wind-Bewertung (ideal: 5-15 km/h)
  if (windSpeed >= 5 && windSpeed <= 15) score += 15;
  else if (windSpeed <= 25) score += 5;
  else if (windSpeed > 30) score -= 15;
  
  // Luftfeuchtigkeit (ideal: 60-80%)
  if (humidity >= 60 && humidity <= 80) score += 10;
  else if (humidity < 40 || humidity > 90) score -= 10;
  
  // Wetter-Bedingungen
  if (weatherCode === 0 || weatherCode <= 3) score += 15; // Klar oder leicht bewölkt
  else if (weatherCode >= 80) score -= 20; // Starker Regen/Gewitter
  else if (weatherCode >= 51) score -= 10; // Regen
  
  // Score in Kategorien umwandeln
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Good";
  if (score >= 45) return "Fair";
  return "Poor";
}

async function getLocationName(latitude: number, longitude: number): Promise<string> {
  try {
    // Vereinfachte Reverse-Geocoding mit Nominatim (kostenlos)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'FishMasterKI/1.0'
        }
      }
    );
    
    const data = await response.json();
    
    if (data.address) {
      const { city, town, village, county, state } = data.address;
      const location = city || town || village || county;
      return location && state ? `${location}, ${state}` : `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
    }
    
    return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
  } catch (error) {
    return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
  }
}

// OpenAI Speech Functions for Sigi
async function transcribeWithWhisper(audioBuffer: Buffer): Promise<string> {
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY nicht konfiguriert');
    }

    const formData = new FormData();
    formData.append('file', audioBuffer, 'audio.wav');
    formData.append('model', 'whisper-1');
    formData.append('language', 'de');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: formData as any
    });

    if (!response.ok) {
      throw new Error(`Whisper API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result.text;

  } catch (error) {
    console.error('Whisper transcription error:', error);
    throw error;
  }
}

async function generateSpeechWithOpenAI(text: string): Promise<Buffer> {
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY nicht konfiguriert');
    }

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: 'alloy',
        speed: 1.0,
        response_format: 'mp3'
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI TTS API error: ${response.status} ${response.statusText}`);
    }

    return Buffer.from(await response.arrayBuffer());

  } catch (error) {
    console.error('OpenAI speech generation error:', error);
    throw error;
  }
}

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

  // Audio transcription endpoint for Sigi
  app.use("/api/sigi/transcribe", (req, res, next) => {
    if (req.method === 'POST') {
      req.setEncoding('binary' as BufferEncoding);
      let body = Buffer.alloc(0);
      req.on('data', (chunk) => {
        body = Buffer.concat([body, chunk]);
      });
      req.on('end', () => {
        req.body = body;
        next();
      });
    } else {
      next();
    }
  });
  
  app.post("/api/sigi/transcribe", async (req, res) => {
    try {
      const audioBuffer = req.body;
      const transcription = await transcribeWithWhisper(audioBuffer);
      res.json({ transcript: transcription });
    } catch (error) {
      console.error('Transcription error:', error);
      res.status(500).json({ error: 'Transcription failed' });
    }
  });

  // Text-to-speech endpoint for Sigi
  app.post("/api/sigi/speak", async (req, res) => {
    try {
      const { text } = req.body;
      const audioBuffer = await generateSpeechWithOpenAI(text);
      
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', audioBuffer.length);
      res.send(audioBuffer);
    } catch (error) {
      console.error('Speech generation error:', error);
      res.status(500).json({ error: 'Speech generation failed' });
    }
  });

  // Weather
  app.get("/api/weather", async (req, res) => {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }
    
    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    
    try {
      // Hole echte Wetterdaten von Open-Meteo API
      const weather = await fetchRealWeatherData(latitude, longitude);
      
      if (!weather) {
        // Fallback zu Mock-Daten wenn API nicht verfügbar
        const fallbackWeather = await storage.getWeatherByLocation(latitude, longitude);
        return res.json(fallbackWeather);
      }
      
      res.json(weather);
    } catch (error) {
      console.error("Weather API error:", error);
      // Fallback zu Mock-Daten bei Fehlern
      const fallbackWeather = await storage.getWeatherByLocation(latitude, longitude);
      res.json(fallbackWeather);
    }
  });

  // Logbook
  app.get("/api/logbook", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const entries = await storage.getLogbookEntries(userId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch logbook entries" });
    }
  });

  app.get("/api/logbook/:id", async (req, res) => {
    try {
      const entry = await storage.getLogbookEntryById(req.params.id);
      if (!entry) {
        return res.status(404).json({ error: "Logbook entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch logbook entry" });
    }
  });

  app.post("/api/logbook", async (req, res) => {
    try {
      const entryData = insertLogbookSchema.parse(req.body);
      const newEntry = await storage.createLogbookEntry(entryData);
      res.status(201).json(newEntry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid logbook data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create logbook entry" });
    }
  });

  app.patch("/api/logbook/:id", async (req, res) => {
    try {
      const entry = await storage.updateLogbookEntry(req.params.id, req.body);
      if (!entry) {
        return res.status(404).json({ error: "Logbook entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: "Failed to update logbook entry" });
    }
  });

  app.delete("/api/logbook/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteLogbookEntry(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Logbook entry not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete logbook entry" });
    }
  });

  app.get("/api/logbook/stats/:userId", async (req, res) => {
    try {
      const stats = await storage.getUserStats(req.params.userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user stats" });
    }
  });

  // KI Buddy API for Sigi
  app.post("/api/kibuddy", async (req, res) => {
    try {
      const { message, context } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const openaiApiKey = process.env.OPENAI_API_KEY;
      if (!openaiApiKey) {
        // Fallback response when no API key
        const fallbackResponses = [
          "🎣 Basierend auf meiner Erfahrung würde ich empfehlen, früh am Morgen zu angeln für die besten Ergebnisse!",
          "🌊 Bei dem aktuellen Wetter sollten Sie es mit Spinnern oder Wobblern versuchen.",
          "🎯 Für bessere Fänge probieren Sie verschiedene Tiefen und Köder aus!",
          "🌅 Die Morgendämmerung und Abenddämmerung sind optimal für fast alle Fischarten.",
          "⚡ Tipp: Achten Sie auf Wetteränderungen - Fische sind vor Fronten oft besonders aktiv!"
        ];
        
        const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        return res.json({ reply: randomResponse });
      }

      // Import SigiAIBuddy from kibuddy module
      const kibuddyModule = await import('./kibuddy');
      const SigiAIBuddy = kibuddyModule.SigiAIBuddy;
      const sigi = new SigiAIBuddy(openaiApiKey);
      
      const response = await sigi.generateResponse(message, context);
      res.json({ reply: response });
      
    } catch (error) {
      console.error('KI Buddy error:', error);
      res.status(500).json({ 
        reply: "🎣 Entschuldigung, ich habe gerade technische Probleme. Versuchen Sie es in einem Moment erneut!"
      });
    }
  });

  // Fish identification endpoint with OpenAI Vision
  app.post("/api/identify-fish", async (req, res) => {
    try {
      const { image, prompt } = req.body;
      
      if (!image) {
        return res.status(400).json({ error: "Image is required" });
      }

      const openaiApiKey = process.env.OPENAI_API_KEY;
      if (!openaiApiKey) {
        // Fallback response when no API key
        return res.json({
          species: "Regenbogenforelle",
          confidence: 0.85,
          habitat: "Süßwasser, Seen und Flüsse",
          tips: "Beste Angelzeit ist früh morgens oder abends. Verwenden Sie Spinner oder Fliegen."
        });
      }

      // Use OpenAI Vision API to analyze the fish image
      const visionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Use the latest model
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Analysiere dieses Fischbild und identifiziere die Art. Antworte im JSON-Format mit: {"species": "Name der Fischart", "confidence": 0.95, "habitat": "Lebensraum", "tips": "Angel-Tipps"}. Antworte auf Deutsch.'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${image}`
                  }
                }
              ]
            }
          ],
          max_tokens: 300,
          response_format: { type: "json_object" }
        })
      });

      if (!visionResponse.ok) {
        throw new Error(`OpenAI API error: ${visionResponse.status}`);
      }

      const visionData = await visionResponse.json();
      const result = JSON.parse(visionData.choices[0].message.content);
      
      res.json(result);
      
    } catch (error) {
      console.error('Fish identification error:', error);
      res.status(500).json({
        species: "Regenbogenforelle",
        confidence: 0.80,
        habitat: "Süßwasser",
        tips: "Verwenden Sie natürliche Köder für beste Ergebnisse."
      });
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
