import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Sun, Wind, Droplets, Eye } from "lucide-react";
import type { Weather } from "@shared/schema";
import { useLanguage } from "@/contexts/language-context";

export default function WeatherWidget() {
  const { t } = useLanguage();
  const { data: weather } = useQuery<Weather>({
    queryKey: ["/api/weather"],
    queryFn: async () => {
      const response = await fetch("/api/weather?lat=39.0968&lng=-120.0324");
      return response.json();
    },
  });

  if (!weather) {
    return (
      <section className="px-4 py-4">
        <Card className="p-4 animate-pulse bg-gray-900/30 backdrop-blur-sm border border-cyan-500/20">
          <div className="h-20 bg-gray-800 rounded"></div>
        </Card>
      </section>
    );
  }

  const getFishingScoreColor = (score: string) => {
    switch (score.toLowerCase()) {
      case "excellent": return "text-green-400";
      case "good": return "text-blue-400";
      case "fair": return "text-yellow-400";
      case "poor": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  return (
    <section className="px-4 py-4">
      <div className="bg-gray-900/50 backdrop-blur-md border border-cyan-500/30 rounded-xl p-6 relative overflow-hidden">
        {/* Underwater gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-blue-900/30 to-teal-900/20 rounded-xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-cyan-100">Heutige Angelvorhersage</h3>
            <span className="text-xs text-cyan-300 bg-cyan-500/20 px-2 py-1 rounded-full">{weather.location}</span>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Sun className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{weather.temperature}°F</div>
                <div className="text-sm text-cyan-300">{weather.condition}</div>
              </div>
            </div>
            <div className="text-right bg-gray-800/50 rounded-lg p-3 border border-cyan-500/20">
              <div className={`text-xl font-bold ${getFishingScoreColor(weather.fishingScore || "Poor")}`}>
                {weather.fishingScore || "Poor"}
              </div>
              <div className="text-xs text-cyan-400">Angelbedingungen</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 bg-gray-800/30 rounded-lg p-4 border border-cyan-500/20">
            <div className="text-center">
              <Wind className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
              <div className="text-sm font-medium text-white">{weather.windSpeed} mph</div>
              <div className="text-xs text-cyan-400">Wind</div>
            </div>
            <div className="text-center">
              <Droplets className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
              <div className="text-sm font-medium text-white">{weather.humidity}%</div>
              <div className="text-xs text-cyan-400">Feuchtigkeit</div>
            </div>
            <div className="text-center">
              <Eye className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
              <div className="text-sm font-medium text-white">{weather.visibility} mi</div>
              <div className="text-xs text-cyan-400">Sicht</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
