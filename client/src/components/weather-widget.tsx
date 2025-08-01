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
        <Card className="p-4 animate-pulse bg-gray-900/70 backdrop-blur-sm border border-cyan-500/30">
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
      <Card className="p-4 bg-gray-900/70 backdrop-blur-sm border border-cyan-500/30">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-100">{t("weather.todaysForecast")}</h3>
          <span className="text-xs text-gray-400">{weather.location}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-100">{weather.temperature}°F</div>
              <div className="text-sm text-gray-400">{weather.condition}</div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-lg font-semibold ${getFishingScoreColor(weather.fishingScore)}`}>
              {weather.fishingScore}
            </div>
            <div className="text-xs text-gray-400">{t("weather.fishingConditions")}</div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
          <span className="flex items-center">
            <Wind className="w-4 h-4 mr-1" />
            {weather.windSpeed} mph
          </span>
          <span className="flex items-center">
            <Droplets className="w-4 h-4 mr-1" />
            {weather.humidity}%
          </span>
          <span className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            {weather.visibility} mi
          </span>
        </div>
      </Card>
    </section>
  );
}
