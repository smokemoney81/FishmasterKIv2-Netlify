import { useQuery } from "@tanstack/react-query";
import MobileHeader from "@/components/layout/mobile-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, Mic, Thermometer, Wind, Droplets, Eye, Camera, Fish, Map, BookOpen, Trophy, HelpCircle, Settings, User, Lightbulb, Activity, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import CatchLogModal from "@/components/catch-log-modal";
import VoiceAssistant from "@/components/voice-assistant";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [, setLocation] = useLocation();
  const [showCatchModal, setShowCatchModal] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const { toast } = useToast();
  
  // Wetter-Daten abrufen
  const { data: weather } = useQuery({ 
    queryKey: ['/api/weather'], 
    queryFn: async () => {
      const response = await fetch("/api/weather?lat=39.0968&lng=-120.0324");
      return response.json();
    }
  });

  return (
    <>
      <MobileHeader />
      
      {/* Übersichtliche Funktions-Struktur */}
      <div className="px-4 py-4 overflow-y-auto pb-20">
        
        {/* Wetter-Info Bar */}
        <Card className="p-3 mb-4 bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border-cyan-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-sm font-semibold text-cyan-300">Aktuelles Wetter</div>
                <div className="text-xs text-gray-300">
                  {weather?.temperature || 18}°C • {weather?.condition || "Klar"} • {weather?.fishingScore || "Gut"}
                </div>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              🎣 Ideal
            </Badge>
          </div>
        </Card>

        {/* Hauptfunktionen */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-cyan-300 mb-3 flex items-center">
            <span className="mr-2">⭐</span> Hauptfunktionen
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Button
              className="h-24 bg-gradient-to-br from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 flex flex-col items-center justify-center"
              onClick={() => setShowCatchModal(true)}
            >
              <Fish className="w-8 h-8 mb-2" />
              <span className="text-sm font-semibold">Fang erfassen</span>
              <span className="text-xs opacity-90">Neuen Fang loggen</span>
            </Button>
            
            <Button
              className="h-24 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex flex-col items-center justify-center"
              onClick={() => setShowVoiceAssistant(true)}
            >
              <Mic className="w-8 h-8 mb-2" />
              <span className="text-sm font-semibold">Sigi KI</span>
              <span className="text-xs opacity-90">Sprach-Assistent</span>
            </Button>
          </div>
        </section>

        {/* Navigation & Entdecken */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-cyan-300 mb-3 flex items-center">
            <span className="mr-2">🗺️</span> Navigation & Entdecken
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="h-20 border-cyan-500/30 hover:border-cyan-400 bg-slate-800/50 flex flex-col items-center justify-center"
              onClick={() => setLocation("/map")}
            >
              <Map className="w-6 h-6 mb-1 text-cyan-400" />
              <span className="text-xs font-medium text-gray-200">Karte</span>
              <span className="text-xs text-gray-400">Angelplätze</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 border-cyan-500/30 hover:border-cyan-400 bg-slate-800/50 flex flex-col items-center justify-center"
              onClick={() => setLocation("/species")}
            >
              <span className="text-2xl mb-1">🐟</span>
              <span className="text-xs font-medium text-gray-200">Fischarten</span>
              <span className="text-xs text-gray-400">Datenbank</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 border-cyan-500/30 hover:border-cyan-400 bg-slate-800/50 flex flex-col items-center justify-center"
              onClick={() => setLocation("/logbook")}
            >
              <BookOpen className="w-6 h-6 mb-1 text-cyan-400" />
              <span className="text-xs font-medium text-gray-200">Logbuch</span>
              <span className="text-xs text-gray-400">Historie</span>
            </Button>
          </div>
        </section>

        {/* KI & Analyse */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-cyan-300 mb-3 flex items-center">
            <span className="mr-2">🤖</span> KI & Analyse
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="h-20 border-cyan-500/30 hover:border-cyan-400 bg-slate-800/50 flex flex-col items-center justify-center"
              onClick={() => setLocation("/identify")}
            >
              <Camera className="w-6 h-6 mb-1 text-cyan-400" />
              <span className="text-xs font-medium text-gray-200">Identifikation</span>
              <span className="text-xs text-gray-400">Fisch-KI</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 border-cyan-500/30 hover:border-cyan-400 bg-slate-800/50 flex flex-col items-center justify-center"
              onClick={() => {
                toast({
                  title: "Wetter-Analyse",
                  description: "Detaillierte Wetter-Prognose wird geladen..."
                });
              }}
            >
              <Thermometer className="w-6 h-6 mb-1 text-orange-400" />
              <span className="text-xs font-medium text-gray-200">Wetter</span>
              <span className="text-xs text-gray-400">Prognose</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 border-cyan-500/30 hover:border-cyan-400 bg-slate-800/50 flex flex-col items-center justify-center"
              onClick={() => {
                toast({
                  title: "Statistiken",
                  description: "Ihre Fang-Statistiken werden analysiert..."
                });
              }}
            >
              <Activity className="w-6 h-6 mb-1 text-green-400" />
              <span className="text-xs font-medium text-gray-200">Statistiken</span>
              <span className="text-xs text-gray-400">Analyse</span>
            </Button>
          </div>
        </section>

        {/* Spiele & Community */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-cyan-300 mb-3 flex items-center">
            <span className="mr-2">🎮</span> Spiele & Community
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="h-20 border-cyan-500/30 hover:border-cyan-400 bg-slate-800/50 flex flex-col items-center justify-center"
              onClick={() => setLocation("/minigame")}
            >
              <Fish className="w-6 h-6 mb-1 text-cyan-400" />
              <span className="text-xs font-medium text-gray-200">Minispiel</span>
              <span className="text-xs text-gray-400">Angel-Game</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 border-cyan-500/30 hover:border-cyan-400 bg-slate-800/50 flex flex-col items-center justify-center"
              onClick={() => {
                toast({
                  title: "Turniere",
                  description: "Kommende Angel-Turniere werden geladen..."
                });
              }}
            >
              <Trophy className="w-6 h-6 mb-1 text-yellow-400" />
              <span className="text-xs font-medium text-gray-200">Turniere</span>
              <span className="text-xs text-gray-400">Events</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 border-cyan-500/30 hover:border-cyan-400 bg-slate-800/50 flex flex-col items-center justify-center"
              onClick={() => {
                toast({
                  title: "Community",
                  description: "Community-Features werden geladen..."
                });
              }}
            >
              <User className="w-6 h-6 mb-1 text-cyan-400" />
              <span className="text-xs font-medium text-gray-200">Community</span>
              <span className="text-xs text-gray-400">Angler</span>
            </Button>
          </div>
        </section>

        {/* Lernen & Tipps */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-cyan-300 mb-3 flex items-center">
            <span className="mr-2">📚</span> Lernen & Tipps
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-20 border-cyan-500/30 hover:border-cyan-400 bg-slate-800/50 flex flex-col items-center justify-center"
              onClick={() => setLocation("/tips")}
            >
              <Lightbulb className="w-6 h-6 mb-1 text-yellow-400" />
              <span className="text-xs font-medium text-gray-200">Tipps</span>
              <span className="text-xs text-gray-400">Ratgeber</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 border-cyan-500/30 hover:border-cyan-400 bg-slate-800/50 flex flex-col items-center justify-center"
              onClick={() => {
                toast({
                  title: "Lexikon",
                  description: "Angel-Lexikon wird geladen..."
                });
              }}
            >
              <BookOpen className="w-6 h-6 mb-1 text-cyan-400" />
              <span className="text-xs font-medium text-gray-200">Lexikon</span>
              <span className="text-xs text-gray-400">Wissen</span>
            </Button>
          </div>
        </section>

        {/* Werkzeuge & Einstellungen */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-cyan-300 mb-3 flex items-center">
            <span className="mr-2">⚙️</span> Werkzeuge & Einstellungen
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="h-20 border-cyan-500/30 hover:border-cyan-400 bg-slate-800/50 flex flex-col items-center justify-center"
              onClick={() => {
                setLocation("/tips");
                toast({
                  title: "Equipment-Planer",
                  description: "Öffne Equipment-Planung..."
                });
              }}
            >
              <Package className="w-6 h-6 mb-1 text-cyan-400" />
              <span className="text-xs font-medium text-gray-200">Equipment</span>
              <span className="text-xs text-gray-400">Planer</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 border-cyan-500/30 hover:border-cyan-400 bg-slate-800/50 flex flex-col items-center justify-center"
              onClick={() => {
                toast({
                  title: "Kalender",
                  description: "Angel-Kalender wird geladen..."
                });
              }}
            >
              <Calendar className="w-6 h-6 mb-1 text-cyan-400" />
              <span className="text-xs font-medium text-gray-200">Kalender</span>
              <span className="text-xs text-gray-400">Planung</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 border-cyan-500/30 hover:border-cyan-400 bg-slate-800/50 flex flex-col items-center justify-center"
              onClick={() => setLocation("/profile")}
            >
              <Settings className="w-6 h-6 mb-1 text-gray-400" />
              <span className="text-xs font-medium text-gray-200">Profil</span>
              <span className="text-xs text-gray-400">Settings</span>
            </Button>
          </div>
        </section>

        {/* Quick Stats */}
        <Card className="p-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-cyan-500/30">
          <h3 className="text-sm font-semibold text-cyan-300 mb-3">Schnell-Statistik</h3>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <div className="text-xl font-bold text-cyan-400">0</div>
              <div className="text-xs text-gray-400">Heute</div>
            </div>
            <div>
              <div className="text-xl font-bold text-cyan-400">0</div>
              <div className="text-xs text-gray-400">Diese Woche</div>
            </div>
            <div>
              <div className="text-xl font-bold text-cyan-400">0</div>
              <div className="text-xs text-gray-400">Diesen Monat</div>
            </div>
            <div>
              <div className="text-xl font-bold text-cyan-400">0</div>
              <div className="text-xs text-gray-400">Gesamt</div>
            </div>
          </div>
        </Card>

      </div>

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