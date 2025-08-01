import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Target, Award } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { apiRequest } from "@/lib/queryClient";
import type { LogbookEntry, InsertLogbookEntry } from "@shared/schema";

export default function Logbook() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fish: "",
    weight: "",
    spot: "",
    gear: "",
  });

  // Mock user ID for now
  const userId = "default-user";

  // Fetch logbook entries
  const { data: entries = [] } = useQuery<LogbookEntry[]>({
    queryKey: ["/api/logbook", userId],
    queryFn: async () => {
      const response = await fetch(`/api/logbook?userId=${userId}`);
      return response.json();
    },
  });

  // Fetch user stats
  const { data: stats } = useQuery<{
    totalPoints: number;
    totalCatches: number;
    rank: string;
    achievements: string[];
  }>({
    queryKey: ["/api/logbook/stats", userId],
    queryFn: async () => {
      const response = await fetch(`/api/logbook/stats/${userId}`);
      return response.json();
    },
  });

  // Create logbook entry mutation
  const createEntry = useMutation({
    mutationFn: async (data: InsertLogbookEntry) => {
      const response = await apiRequest("POST", "/api/logbook", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/logbook"] });
      queryClient.invalidateQueries({ queryKey: ["/api/logbook/stats"] });
      toast({
        title: t("logbook.saveSuccess"),
        description: t("logbook.saveSuccessDesc"),
      });
      setFormData({ fish: "", weight: "", spot: "", gear: "" });
    },
    onError: () => {
      toast({
        title: t("logbook.saveError"),
        description: t("logbook.saveErrorDesc"),
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const weight = parseFloat(formData.weight);
    if (!formData.fish || isNaN(weight) || !formData.spot || !formData.gear) {
      toast({
        title: t("logbook.validationError"),
        description: t("logbook.validationErrorDesc"),
        variant: "destructive",
      });
      return;
    }

    const points = Math.round(weight * 100); // 100 points per kg
    const date = new Date().toLocaleDateString("de-DE");

    createEntry.mutate({
      userId,
      fish: formData.fish,
      weight,
      spot: formData.spot,
      gear: formData.gear,
      date,
      points,
    });
  };

  const getAchievementIcon = (achievement: string) => {
    switch (achievement) {
      case "Hecht-Killer":
        return <Target className="w-5 h-5" />;
      case "3kg Club":
        return <Trophy className="w-5 h-5" />;
      case "Fangmeister":
        return <Award className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold text-center text-green-400">
          🐟 {t("logbook.title")}
        </h1>

        {/* Entry Form */}
        <Card className="p-4 bg-gray-900/70 backdrop-blur-sm border border-green-500/30">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              placeholder={t("logbook.fishType")}
              value={formData.fish}
              onChange={(e) => setFormData({ ...formData, fish: e.target.value })}
              className="bg-gray-800 border-green-500/30 text-white placeholder:text-gray-400"
            />
            <Input
              type="number"
              step="0.1"
              placeholder={t("logbook.weight")}
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="bg-gray-800 border-green-500/30 text-white placeholder:text-gray-400"
            />
            <Input
              placeholder={t("logbook.spot")}
              value={formData.spot}
              onChange={(e) => setFormData({ ...formData, spot: e.target.value })}
              className="bg-gray-800 border-green-500/30 text-white placeholder:text-gray-400"
            />
            <Textarea
              placeholder={t("logbook.gear")}
              value={formData.gear}
              onChange={(e) => setFormData({ ...formData, gear: e.target.value })}
              rows={3}
              className="bg-gray-800 border-green-500/30 text-white placeholder:text-gray-400"
            />
            <Button
              type="submit"
              disabled={createEntry.isPending}
              className="w-full bg-green-500 hover:bg-green-600 text-black font-bold"
            >
              🎣 {t("logbook.save")}
            </Button>
          </form>
        </Card>

        {/* Stats */}
        {stats && (
          <Card className="p-4 bg-gray-900/70 backdrop-blur-sm border border-green-500/30">
            <h2 className="text-xl font-bold text-green-400 mb-3">
              🏆 {t("logbook.yourRanking")}
            </h2>
            <div className="space-y-2 text-gray-100">
              <p>
                {t("logbook.points")}: <span className="text-green-400">{stats.totalPoints}</span>
              </p>
              <p>
                {t("logbook.rank")}: <span className="text-green-400">{stats.rank}</span>
              </p>
              <div>
                {t("logbook.achievements")}:{" "}
                {stats.achievements.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {stats.achievements.map((achievement) => (
                      <span
                        key={achievement}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-sm"
                      >
                        {getAchievementIcon(achievement)}
                        {achievement}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400">–</span>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Catch List */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-green-400">
            📖 {t("logbook.yourCatches")}
          </h2>
          {entries.length > 0 ? (
            entries.map((entry) => (
              <Card
                key={entry.id}
                className="p-3 bg-gray-800/70 backdrop-blur-sm border border-green-500/20"
              >
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <strong className="text-green-400">{entry.fish}</strong>
                    <span className="text-green-300">{entry.weight} kg</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    {t("logbook.spotLabel")}: {entry.spot}
                  </p>
                  <p className="text-sm text-gray-300">
                    {t("logbook.gearLabel")}: {entry.gear}
                  </p>
                  <p className="text-xs text-gray-400">{entry.date}</p>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-400">{t("logbook.noCatches")}</p>
          )}
        </div>
      </div>
    </div>
  );
}