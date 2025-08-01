import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";

export default function QuickStats() {
  const { t } = useLanguage();
  // In a real app, these would come from user data
  const stats = {
    totalCatches: 47,
    speciesCount: 12,
    spotsVisited: 8,
  };

  return (
    <section className="px-4 py-6 bg-gray-900/30 backdrop-blur-sm rounded-lg mx-4 border border-cyan-500/20">
      <div className="text-center text-white">
        <h2 className="text-2xl font-bold mb-2">{t("home.welcome")}</h2>
        <p className="text-cyan-300 mb-4">{t("home.ready")}</p>
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border-0">
            <div className="text-2xl font-bold text-white">{stats.totalCatches}</div>
            <div className="text-xs text-cyan-300">{t("home.caughtFish")}</div>
          </Card>
          <Card className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border-0">
            <div className="text-2xl font-bold text-white">{stats.speciesCount}</div>
            <div className="text-xs text-cyan-300">{t("home.foundSpecies")}</div>
          </Card>
          <Card className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border-0">
            <div className="text-2xl font-bold text-white">{stats.spotsVisited}</div>
            <div className="text-xs text-cyan-300">{t("home.visitedSpots")}</div>
          </Card>
        </div>
      </div>
    </section>
  );
}
