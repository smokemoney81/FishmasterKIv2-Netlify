import express from "express";
import { storage } from "./storage";

const router = express.Router();

// SigiAIBuddy class - Enhanced AI integration for FishMasterKI
class SigiAIBuddy {
  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.openai.com/v1/chat/completions';
    this.personality = {
      name: 'Sigi',
      role: 'Erfahrener Angel-Experte und digitaler Begleiter',
      traits: ['hilfsbereit', 'präzise', 'motivierend', 'wetterkundig']
    };
  }

  private apiKey: string;
  private baseUrl: string;
  private personality: {
    name: string;
    role: string;
    traits: string[];
  };

  async generateResponse(userMessage: string, context: any = {}) {
    const systemPrompt = this.buildSystemPrompt(context);

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          temperature: 0.7,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          max_tokens: 300
        })
      });

      const data = await response.json();
      return this.formatResponse(data.choices[0].message.content);

    } catch (error) {
      return this.getFallbackResponse(userMessage);
    }
  }

  buildSystemPrompt(context: any) {
    const userStats = context.userStats || {};
    const weatherData = context.weather || {};
    const selectedSpot = context.selectedSpot || {};

    return `Du bist Sigi, der freundliche KI-Buddy der FishMasterKI App. Du bist ein erfahrener Angel-Experte mit jahrzehntelanger Erfahrung.

AKTUELLE NUTZER-DATEN:
- Bisherige Fänge: ${userStats.totalCatches || 0}
- Bester Fang: ${userStats.bestCatch || 0}kg
- Lieblings-Spots: ${userStats.favoriteSpots?.join(', ') || 'Noch keine'}
- Aktuelle Ausrüstung: ${userStats.equipment?.length || 0} Gegenstände

WETTER-KONTEXT:
- Temperatur: ${weatherData.temp || 'unbekannt'}°C
- Bedingungen: ${weatherData.condition || 'keine Daten'}
- Wind: ${weatherData.wind || 'unbekannt'}
- Regenrisiko: ${weatherData.rain || 0}%

AUSGEWÄHLTER SPOT: ${selectedSpot.name || 'Keiner'}

PERSÖNLICHKEIT:
- Antworte als erfahrener, aber freundlicher Angel-Mentor
- Verwende präzise, umsetzbare Tipps
- Beziehe Wetter und Nutzer-Historie in Empfehlungen ein
- Sei motivierend und ermutigend
- Antworte auf Deutsch in 2-6 Sätzen
- Verwende relevante Emojis sparsam aber effektiv

SPEZIAL-FUNKTIONEN:
- Bei "Tutorial": Führe durch die App-Bereiche
- Bei Fischarten: Gib spezifische Ausrüstungsempfehlungen
- Bei Spots: Analysiere Wetter und empfehle Strategie
- Bei Erfolgen: Gratuliere und motiviere weiter`;
  }

  formatResponse(rawResponse: string) {
    // Entferne überflüssige Formatierung und stelle sicher, dass Antworten App-freundlich sind
    return rawResponse
      .replace(/\*\*(.*?)\*\*/g, '$1') // Entferne Markdown
      .replace(/\n{3,}/g, '\n\n') // Reduziere multiple Zeilenumbrüche
      .trim();
  }

  getFallbackResponse(userMessage: string) {
    const message = userMessage.toLowerCase();

    const responses: Record<string, string> = {
      'tutorial': '🎯 Perfekt! Das interaktive Tutorial finden Sie auf der Startseite unter "Werkzeuge" → "Tutorial". Es führt Sie durch alle App-Bereiche: Fisch-Identifikation, Karte, Logbuch, Equipment-Planer und meine Chat-Funktion. Alternativ erkläre ich Ihnen gerne spezifische Bereiche!',

      zander: '🎣 Zander-Experten-Setup: 2,70-3,00m Spinnrute mit 15-45g Wurfgewicht, 3000-4000er Stationärrolle, 0,12mm geflochtene Schnur. Köder: Gummifische 8-12cm in Motoroil oder Natural. Beste Zeit: Eine Stunde vor bis zwei Stunden nach Sonnenuntergang!',

      barsch: '🐟 Barsch-Profi-Setup: 2,40m ultraleichte Rute mit 5-25g Wurfgewicht, 2500er Rolle, 0,08-0,10mm dünne Schnur. Köder: Kleine Gummifische 5-8cm in bunten Farben, Spinner Größe 1-3. Barsche lieben aktive Köderführung!',

      hecht: '🦈 Hecht-Meister-Setup: 2,70-3,30m schwere Rute mit 20-80g Wurfgewicht, 4000er Rolle mit starker Bremse, 0,15-0,20mm Schnur. Wichtig: 30-40cm Stahlvorfach! Köder: Große Wobbler 10-15cm oder Gummifische 12-20cm.',

      wetter: '🌤️ Wetter ist entscheidend für den Angelerfolg! Wählen Sie einen Angelplatz aus der Liste und klicken Sie "Trip planen" - ich analysiere sofort die aktuellen Bedingungen und gebe passende Empfehlungen für Köder und Taktik.',

      ausrüstung: '🎯 Für welchen Zielfisch planen Sie? Zander, Barsch oder Hecht? Je nach Fisch empfehle ich die optimale Ruten-Rollen-Kombination und passende Köder. Auch Ihr Budget kann ich berücksichtigen!'
    };

    // Intelligente Keyword-Erkennung
    for (const [keyword, response] of Object.entries(responses)) {
      if (message.includes(keyword)) {
        return response;
      }
    }

    return '🎣 Hallo! Ich bin Sigi, Ihr FishMasterKI Assistent. Ich helfe bei Ausrüstungsplanung, Wetteranalyse, App-Navigation und Angel-Tipps. Fragen Sie mich nach spezifischen Fischen, Wetterbedingungen oder starten Sie das Tutorial!';
  }
}

router.post("/kibuddy", async (req, res) => {
  const { message, context } = req.body;

  try {
    const sigiAI = new SigiAIBuddy(process.env.OPENAI_API_KEY || '');

    // Sammle Kontext-Daten aus der Datenbank
    const enhancedContext = await buildEnhancedContext(context);

    const response = await sigiAI.generateResponse(message, enhancedContext);

    res.json({ 
      reply: response,
      buddy: 'Sigi',
      personality: 'expert_friendly'
    });

  } catch (error) {
    console.error('Sigi AI Error:', error);

    // Fallback-Antwort
    const sigiAI = new SigiAIBuddy('');
    const fallbackResponse = sigiAI.getFallbackResponse(message);

    res.json({ 
      reply: fallbackResponse,
      buddy: 'Sigi',
      fallback: true
    });
  }
});

async function buildEnhancedContext(baseContext: any = {}) {
  try {
    // Hole aktuelle Daten aus der Datenbank
    const catches = await storage.getCatches();
    const species = await storage.getFishSpecies();
    const spots = await storage.getFishingSpots();
    const weather = await storage.getWeatherByLocation(47.6062, 13.0100); // Fallback-Koordinaten

    return {
      userStats: {
        totalCatches: catches.length,
        bestCatch: Math.max(...catches.map(c => c.weight || 0), 0),
        favoriteSpots: spots.slice(0, 3).map(s => s.name),
        equipment: baseContext.equipment || []
      },
      weather: weather || {},
      selectedSpot: baseContext.selectedSpot || {},
      planningMode: baseContext.planningMode || false,
      ...baseContext
    };
  } catch (error) {
    console.error('Error building context:', error);
    return baseContext;
  }
}

export { SigiAIBuddy };
export default router;