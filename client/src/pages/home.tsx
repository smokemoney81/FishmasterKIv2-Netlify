import { useQuery } from "@tanstack/react-query";
import MobileHeader from "@/components/layout/mobile-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, Mic, Thermometer, Wind, Droplets, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import CatchLogModal from "@/components/catch-log-modal";
import VoiceAssistant from "@/components/voice-assistant";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
const startFishingIcon = "/icons/icon_3_1754053799805.png";
const mapIcon = "/icons/icon_4_1754053799779.png";
const weatherIcon = "/icons/icon_1_1754053799814.png";
const kiIcon = "/icons/file_00000000017c6243b22d12cb5649f688_1754053799857.png";

export default function Home() {
  const [, setLocation] = useLocation();
  const [showCatchModal, setShowCatchModal] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const { toast } = useToast();
  
  // Zeit und Wetter State
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState("sunny");

  // Zeit aktualisieren
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Wetter je nach Tageszeit
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

  // Analoge Uhr rendern
  const renderAnalogClock = () => {
    const hour = time.getHours() % 12;
    const minute = time.getMinutes();
    const second = time.getSeconds();
    
    const hourAngle = (hour * 30) + (minute * 0.5);
    const minuteAngle = minute * 6;
    const secondAngle = second * 6;
    
    return (
      <div className="relative w-16 h-16 rounded-full border-2 border-cyan-400 bg-gray-800/60">
        {/* Stunden-Zeiger */}
        <div 
          className="absolute top-1/2 left-1/2 w-0.5 h-4 bg-cyan-300 rounded-full origin-bottom"
          style={{
            transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
            transformOrigin: 'bottom'
          }}
        />
        {/* Minuten-Zeiger */}
        <div 
          className="absolute top-1/2 left-1/2 w-0.5 h-6 bg-cyan-400 rounded-full origin-bottom"
          style={{
            transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`,
            transformOrigin: 'bottom'
          }}
        />
        {/* Sekunden-Zeiger */}
        <div 
          className="absolute top-1/2 left-1/2 w-px h-6 bg-red-400 rounded-full origin-bottom"
          style={{
            transform: `translate(-50%, -100%) rotate(${secondAngle}deg)`,
            transformOrigin: 'bottom'
          }}
        />
        {/* Mittelpunkt */}
        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-cyan-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
      </div>
    );
  };

  // Wetter Icon
  const renderWeatherIcon = () => {
    switch (weather) {
      case "sunny":
        return <span style={{ fontSize: "1.5rem" }}>🌞</span>;
      case "evening":
        return <span style={{ fontSize: "1.5rem" }}>🌇</span>;
      case "night":
        return <span style={{ fontSize: "1.5rem" }}>🌙</span>;
      default:
        return <span style={{ fontSize: "1.5rem" }}>☁️</span>;
    }
  };

  // Wetter-Daten simulieren
  const weatherData = {
    temperature: 18,
    humidity: 65,
    windSpeed: 12,
    visibility: 8.5,
    condition: weather
  };

  return (
    <>
      <MobileHeader />
      
      {/* Kompakte Übersichts-Seite ohne Scrollen */}
      <div className="px-4 py-4 max-h-screen overflow-hidden">
        
        {/* Zeile 1: Zeit und Wetter */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {/* Digitale Uhr */}
          <Card className="p-3 bg-gray-900/60 border-cyan-500/30 text-center">
            <div className="text-cyan-300 text-lg font-mono font-bold">
              {time.toLocaleTimeString("de-DE", { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-xs text-gray-400">Digital</div>
          </Card>
          
          {/* Analoge Uhr */}
          <Card className="p-3 bg-gray-900/60 border-cyan-500/30 flex flex-col items-center">
            {renderAnalogClock()}
            <div className="text-xs text-gray-400 mt-1">Analog</div>
          </Card>
          
          {/* Wetter mit Sonne */}
          <Card className="p-3 bg-gray-900/60 border-cyan-500/30 text-center">
            {renderWeatherIcon()}
            <div className="text-xs text-gray-400">{weatherData.temperature}°C</div>
          </Card>
        </div>
        
        {/* Zeile 2: Wetter-Statistiken */}
        <Card className="p-3 mb-4 bg-gray-900/60 border-cyan-500/30">
          <h3 className="text-sm font-semibold text-gray-100 mb-2">Wetter-Statistiken</h3>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <Thermometer className="w-4 h-4 text-orange-400 mx-auto mb-1" />
              <div className="text-xs text-cyan-300">{weatherData.temperature}°C</div>
            </div>
            <div>
              <Droplets className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <div className="text-xs text-cyan-300">{weatherData.humidity}%</div>
            </div>
            <div>
              <Wind className="w-4 h-4 text-gray-400 mx-auto mb-1" />
              <div className="text-xs text-cyan-300">{weatherData.windSpeed} km/h</div>
            </div>
            <div>
              <Eye className="w-4 h-4 text-green-400 mx-auto mb-1" />
              <div className="text-xs text-cyan-300">{weatherData.visibility} km</div>
            </div>
          </div>
        </Card>
        
        {/* Zeile 3: Haupt-Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* KI Sprach-Assistent Button */}
          <Button
            className="h-16 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex flex-col items-center justify-center"
            onClick={() => setShowVoiceAssistant(true)}
          >
            <Mic className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">KI Sprach-Assistent</span>
          </Button>
          
          {/* Ausrüstungs-Button */}
          <Button
            variant="outline"
            className="h-16 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 flex flex-col items-center justify-center"
            onClick={() => {
              setLocation("/tips");
              toast({
                title: "Ausrüstung",
                description: "Zur Equipment-Planung..."
              });
            }}
          >
            <Package className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Ausrüstung</span>
          </Button>
        </div>
        
        {/* Zeile 4: Navigation Grid */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <Button
            variant="outline"
            className="h-16 border-cyan-500/20 hover:border-cyan-400 flex flex-col items-center justify-center bg-gray-900/30"
            onClick={() => setLocation("/map")}
          >
            <img src={mapIcon} className="w-6 h-6 mb-1" alt="Karte" />
            <span className="text-xs text-cyan-300">Karte</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-16 border-cyan-500/20 hover:border-cyan-400 flex flex-col items-center justify-center bg-gray-900/30"
            onClick={() => setShowCatchModal(true)}
          >
            <img src={startFishingIcon} className="w-6 h-6 mb-1" alt="Angeln" />
            <span className="text-xs text-cyan-300">Angeln</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-16 border-cyan-500/20 hover:border-cyan-400 flex flex-col items-center justify-center bg-gray-900/30"
            onClick={() => setLocation("/species")}
          >
            <span className="text-2xl mb-1">🐟</span>
            <span className="text-xs text-cyan-300">Fische</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-16 border-cyan-500/20 hover:border-cyan-400 flex flex-col items-center justify-center bg-gray-900/30"
            onClick={() => setLocation("/logbook")}
          >
            <span className="text-2xl mb-1">📖</span>
            <span className="text-xs text-cyan-300">Logbuch</span>
          </Button>
        </div>
        
        {/* Zeile 5: Schnell-Info */}
        <Card className="p-3 bg-gray-900/60 border-cyan-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {renderWeatherIcon()}
              <span className="text-sm text-gray-100">
                Perfekte Angel-Zeit! 🎣
              </span>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Aktiv
            </Badge>
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
