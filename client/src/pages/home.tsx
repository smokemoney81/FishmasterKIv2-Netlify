import { useQuery } from "@tanstack/react-query";
import MobileHeader from "@/components/layout/mobile-header";
import QuickStats from "@/components/quick-stats";
import WeatherWidget from "@/components/weather-widget";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Plus, Lightbulb, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import CatchLogModal from "@/components/catch-log-modal";
import VoiceAssistant from "@/components/voice-assistant";
import { useLocation } from "wouter";
import type { FishingSpot, FishSpecies, Catch } from "@shared/schema";
import { useLanguage } from "@/contexts/language-context";
import fishMasterBackground from "@assets/file_000000001858620a97cb33f0ecc79a29_1754058073370.png";
const startFishingIcon = "/icons/icon_3_1754053799805.png";
const mapIcon = "/icons/icon_4_1754053799779.png";
const weatherIcon = "/icons/icon_1_1754053799814.png";
const kiIcon = "/icons/file_00000000017c6243b22d12cb5649f688_1754053799857.png";

export default function Home() {
  const [, setLocation] = useLocation();
  const [showCatchModal, setShowCatchModal] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const { t } = useLanguage();
  
  // Zeit und Wetter State
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState("sunny"); // sunny, evening, rain

  // Zeit aktualisieren
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Beispiel Wetter Logik (später API einbauen)
  useEffect(() => {
    const hour = time.getHours();
    if (hour >= 18 && hour < 21) {
      setWeather("evening");
    } else if (hour >= 21 || hour < 6) {
      setWeather("night");
    } else {
      setWeather("sunny");
    }
  }, [time]);

  // Icon abhängig vom Wetter
  const renderWeatherIcon = () => {
    switch (weather) {
      case "sunny":
        return <span style={{ fontSize: "2rem" }}>🌞</span>;
      case "evening":
        return <span style={{ fontSize: "2rem" }}>🌇</span>;
      case "night":
        return <span style={{ fontSize: "2rem" }}>🌙</span>;
      case "rain":
        return <span style={{ fontSize: "2rem" }}>🌧️</span>;
      default:
        return <span style={{ fontSize: "2rem" }}>☁️</span>;
    }
  };

  const { data: spots = [] } = useQuery<FishingSpot[]>({
    queryKey: ["/api/spots"],
  });

  const { data: species = [] } = useQuery<FishSpecies[]>({
    queryKey: ["/api/species"],
  });

  const { data: catches = [] } = useQuery<Catch[]>({
    queryKey: ["/api/catches"],
  });

  const featuredSpots = spots.slice(0, 1);
  const featuredSpecies = species.slice(0, 2);
  const recentCatches = catches.slice(0, 2);

  return (
    <>
      <MobileHeader />
      
      {/* Zeit und Wetter Sektion */}
      <section className="px-4 py-6">
        <div className="bg-gray-900/40 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            {time.toLocaleTimeString("de-DE")}
          </h2>
          <div className="mb-4">{renderWeatherIcon()}</div>
          <p className="text-cyan-300 text-sm mb-4">
            Perfekte Zeit zum Angeln! 🎣
          </p>
          
          {/* Button für KI-Assistent */}
          <Button
            className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow-lg hover:bg-green-600 transition"
            onClick={() => setShowVoiceAssistant(true)}
          >
            🎤 KI-Assistent starten
          </Button>
        </div>
      </section>
      
      <QuickStats />
      
      <WeatherWidget />

      {/* Quick Actions */}
      <section className="px-4 py-2">
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-center space-y-2 bg-gray-900/30 backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-400 transition-all"
            onClick={() => setLocation("/map")}
          >
            <img src={mapIcon} className="w-10 h-10 object-contain" alt={t("quickActions.map")} />
            <span className="text-xs font-medium text-cyan-300">{t("quickActions.map")}</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-center space-y-2 bg-gray-900/30 backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-400 transition-all"
            onClick={() => setShowCatchModal(true)}
          >
            <img src={startFishingIcon} className="w-10 h-10 object-contain" alt={t("quickActions.startFishing")} />
            <span className="text-xs font-medium text-cyan-300">{t("quickActions.startFishing")}</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-center space-y-2 bg-gray-900/30 backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-400 transition-all"
            onClick={() => setLocation("/tips")}
          >
            <img src={weatherIcon} className="w-10 h-10 object-contain" alt={t("quickActions.weather")} />
            <span className="text-xs font-medium text-cyan-300">{t("quickActions.weather")}</span>
          </Button>
        </div>
      </section>

      {/* Featured Locations */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-100">Beliebte Angelplätze</h3>
          <Button variant="link" className="text-cyan-400 text-sm font-medium p-0 hover:text-cyan-300" onClick={() => setLocation("/map")}>
            Alle anzeigen
          </Button>
        </div>
        <div className="space-y-3">
          {featuredSpots.map((spot) => (
            <Card key={spot.id} className="overflow-hidden bg-gray-900/30 backdrop-blur-sm border border-cyan-500/20">
              <div className="relative h-32">
                <img 
                  src={spot.imageUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"} 
                  alt={spot.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  {spot.fishingScore}
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-100 mb-1">{spot.name}</h4>
                <p className="text-sm text-gray-400 mb-2">{spot.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    2.3 mi
                  </span>
                  <span className="text-orange-400 font-medium">{spot.recentCatches} Fänge</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Species Spotlight */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-100">Fischarten-Guide</h3>
          <Button variant="link" className="text-cyan-400 text-sm font-medium p-0 hover:text-cyan-300" onClick={() => setLocation("/species")}>
            Alle durchsuchen
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {featuredSpecies.map((species) => (
            <Card key={species.id} className="overflow-hidden bg-gray-900/30 backdrop-blur-sm border border-cyan-500/20">
              <div className="relative h-24">
                <img 
                  src={species.imageUrl || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"} 
                  alt={species.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h4 className="font-semibold text-gray-100 text-sm mb-1">{species.name}</h4>
                <p className="text-xs text-gray-400 mb-2">{species.habitat}</p>
                <div className={`text-xs font-medium ${
                  species.difficulty === "Beginner Friendly" ? "text-green-400" :
                  species.difficulty === "Intermediate" ? "text-orange-400" :
                  "text-red-400"
                }`}>
                  {species.difficulty}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Community Catches */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-100">Community Catches</h3>
          <Button variant="link" className="text-cyan-400 text-sm font-medium p-0 hover:text-cyan-300">
            See More
          </Button>
        </div>
        <div className="space-y-3">
          {recentCatches.length === 0 ? (
            <Card className="p-6 text-center bg-gray-900/70 backdrop-blur-sm border border-cyan-500/30">
              <p className="text-gray-400">No catches logged yet. Be the first to share your catch!</p>
            </Card>
          ) : (
            recentCatches.map((catchData) => (
              <Card key={catchData.id} className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">JD</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-800">Angler</span>
                      <span className="text-xs text-slate-500">Recently</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{catchData.notes || "Great catch!"}</p>
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      {catchData.weight && (
                        <span>
                          <span className="mr-1">⚖️</span>
                          {catchData.weight} lbs
                        </span>
                      )}
                      {catchData.length && (
                        <span>
                          <span className="mr-1">📏</span>
                          {catchData.length} in
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {catchData.photoUrl && (
                  <div className="mt-3 rounded-lg overflow-hidden">
                    <img 
                      src={catchData.photoUrl} 
                      alt="Catch photo" 
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </section>

      {/* Spacer for bottom navigation */}
      <div className="h-20"></div>

      <CatchLogModal 
        isOpen={showCatchModal} 
        onClose={() => setShowCatchModal(false)} 
      />
      
      <VoiceAssistant
        isOpen={showVoiceAssistant}
        onClose={() => setShowVoiceAssistant(false)}
      />
    </>
  );
}
