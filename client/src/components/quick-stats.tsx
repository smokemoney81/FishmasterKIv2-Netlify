import { Card } from "@/components/ui/card";

export default function QuickStats() {
  // In a real app, these would come from user data
  const stats = {
    totalCatches: 47,
    speciesCount: 12,
    spotsVisited: 8,
  };

  return (
    <section className="px-4 py-6 bg-gradient-to-r from-blue-500 to-cyan-600">
      <div className="text-center text-white">
        <h2 className="text-2xl font-bold mb-2">Willkommen zurück, Angler!</h2>
        <p className="text-blue-100 mb-4">Bereit für Ihr nächstes Angelabenteuer?</p>
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border-0">
            <div className="text-2xl font-bold text-white">{stats.totalCatches}</div>
            <div className="text-xs text-blue-100">Gefangene Fische</div>
          </Card>
          <Card className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border-0">
            <div className="text-2xl font-bold text-white">{stats.speciesCount}</div>
            <div className="text-xs text-blue-100">Gefundene Arten</div>
          </Card>
          <Card className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border-0">
            <div className="text-2xl font-bold text-white">{stats.spotsVisited}</div>
            <div className="text-xs text-blue-100">Besuchte Plätze</div>
          </Card>
        </div>
      </div>
    </section>
  );
}
