import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import MobileHeader from "@/components/layout/mobile-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Lightbulb, Clock, User, Package, Check, Plus } from "lucide-react";
import type { Tip } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Tips() {
  const [showEquipmentPlanner, setShowEquipmentPlanner] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { toast } = useToast();
  
  const { data: tips = [], isLoading } = useQuery<Tip[]>({
    queryKey: ["/api/tips"],
  });

  const equipmentCategories = {
    "Ruten & Rollen": [
      "Spinnrute (2,1-2,7m)",
      "Grundrute (3,0-3,6m)", 
      "Spinnrolle (2500-4000er)",
      "Freilaufrolle",
      "Angelschnur (0,25-0,35mm)",
      "Geflochtene Schnur"
    ],
    "Köder & Haken": [
      "Wobbler (verschiedene Größen)",
      "Gummifische",
      "Blinker", 
      "Lebendige Würmer",
      "Mais",
      "Boilies",
      "Einzelhaken (Gr. 6-12)",
      "Drillingshaken"
    ],
    "Zubehör": [
      "Kescher",
      "Rutenhalter", 
      "Angelkoffer",
      "Wirbel & Snaps",
      "Bleigewichte",
      "Bissanzeiger",
      "Zange",
      "Maßband"
    ],
    "Komfort": [
      "Angelstuhl",
      "Sonnenschirm",
      "Kühlbox", 
      "Thermosflasche",
      "Erste-Hilfe-Set",
      "Handtuch",
      "Regenkleidung"
    ]
  };

  const toggleItem = (item: string) => {
    setSelectedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  if (isLoading) {
    return (
      <>
        <MobileHeader title="Angel-Tipps & Tricks" />
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-800 h-40 rounded-xl"></div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MobileHeader title="Fishing Tips" />
      
      {/* Featured Tip */}
      {tips.length > 0 && (
        <section className="px-4 py-6">
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-gray-100">Tipp des Tages</h3>
          </div>
          
          <Card className="bg-gradient-to-r from-gray-900/60 to-blue-900/60 backdrop-blur-sm border border-cyan-500/30 overflow-hidden">
            {tips[0].imageUrl && (
              <div className="h-32">
                <img 
                  src={tips[0].imageUrl} 
                  alt={tips[0].title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-100 mb-2">{tips[0].title}</h4>
                  <p className="text-sm text-gray-300 mb-3">{tips[0].content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-gray-400">
                      {tips[0].author && (
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {tips[0].author}
                        </span>
                      )}
                      {tips[0].difficulty && (
                        <Badge variant="outline" className="text-xs">
                          {tips[0].difficulty}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* Categories */}
      <section className="px-4 py-2">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Nach Kategorie durchsuchen</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer bg-gray-900/30 backdrop-blur-sm border border-cyan-500/20">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-2xl">🎣</span>
            </div>
            <h4 className="font-medium text-gray-100">Techniken</h4>
            <p className="text-xs text-gray-400">Angel-Methoden & Strategien</p>
          </Card>
          
          <Card 
            className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer bg-gray-900/30 backdrop-blur-sm border border-cyan-500/20"
            onClick={() => setShowEquipmentPlanner(true)}
          >
            <div className="w-12 h-12 bg-cyan-500/20 rounded-full mx-auto mb-2 flex items-center justify-center">
              <Package className="w-6 h-6 text-cyan-400" />
            </div>
            <h4 className="font-medium text-gray-100">Ausrüstung planen</h4>
            <p className="text-xs text-gray-400">Angel-Equipment auswählen</p>
          </Card>
          
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer bg-gray-900/30 backdrop-blur-sm border border-cyan-500/20">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-2xl">⏰</span>
            </div>
            <h4 className="font-medium text-gray-100">Timing</h4>
            <p className="text-xs text-gray-400">Beste Zeiten zum Angeln</p>
          </Card>
          
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer bg-gray-900/30 backdrop-blur-sm border border-cyan-500/20">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-2xl">📍</span>
            </div>
            <h4 className="font-medium text-gray-100">Angelplätze</h4>
            <p className="text-xs text-gray-400">Wo man Fische findet</p>
          </Card>
        </div>
      </section>

      {/* Popular Tips */}
      <section className="px-4 py-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Beliebte Tipps</h3>
        <div className="space-y-4">
          {/* Nur relevante Popular Tips */}
          <Card className="p-4 bg-gray-900/30 backdrop-blur-sm border border-cyan-500/20">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-cyan-400 text-sm">🌅</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-100 mb-1">Beste Zeiten zum Angeln</h4>
                <p className="text-sm text-gray-300 mb-2">Morgen- und Abenddämmerung sind optimale Angelzeiten, wenn Fische am aktivsten sind</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">Timing</Badge>
                  <Badge variant="outline" className="text-xs">Anfänger</Badge>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gray-900/30 backdrop-blur-sm border border-cyan-500/20">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-cyan-400 text-sm">🎯</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-100 mb-1">Gewässerstruktur lesen</h4>
                <p className="text-sm text-gray-300 mb-2">Achten Sie auf Abbruchkanten, Unterwasserstrukturen und Vegetation, wo sich Fische verstecken</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">Technik</Badge>
                  <Badge variant="outline" className="text-xs">Fortgeschritten</Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Equipment Planner Modal */}
      <Dialog open={showEquipmentPlanner} onOpenChange={setShowEquipmentPlanner}>
        <DialogContent className="max-w-md bg-gray-900 border-cyan-500/20 max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-100 flex items-center">
              <Package className="w-5 h-5 mr-2 text-cyan-400" />
              Equipment-Planung
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="text-sm text-gray-300">
              Wählen Sie Ihre Angel-Ausrüstung für die nächste Tour:
            </div>

            {Object.entries(equipmentCategories).map(([category, items]) => (
              <div key={category} className="space-y-3">
                <h4 className="font-semibold text-gray-100 border-b border-cyan-500/20 pb-1">
                  {category}
                </h4>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item} className="flex items-center space-x-3">
                      <Checkbox
                        id={item}
                        checked={selectedItems.includes(item)}
                        onCheckedChange={() => toggleItem(item)}
                        className="border-cyan-500/30"
                      />
                      <label 
                        htmlFor={item}
                        className="text-sm text-gray-300 cursor-pointer flex-1"
                      >
                        {item}
                      </label>
                      {selectedItems.includes(item) && (
                        <Check className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-gray-700/30">
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-cyan-400" />
                  <span className="font-medium text-gray-100 text-sm">
                    Ausgewählt: {selectedItems.length} Artikel
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                  onClick={() => setSelectedItems([])}
                >
                  Alle abwählen
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  onClick={() => {
                    toast({
                      title: "Equipment-Liste gespeichert!",
                      description: `${selectedItems.length} Artikel zu Ihrer Angel-Liste hinzugefügt.`
                    });
                    setShowEquipmentPlanner(false);
                  }}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Liste speichern
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Spacer for bottom navigation */}
      <div className="h-20"></div>
    </>
  );
}
