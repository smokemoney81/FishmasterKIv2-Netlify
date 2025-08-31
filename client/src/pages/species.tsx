import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import MobileHeader from "@/components/layout/mobile-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, Fish, Eye, Target, MapPin } from "lucide-react";
import type { FishSpecies } from "@shared/schema";

export default function Species() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedSpecies, setSelectedSpecies] = useState<FishSpecies | null>(null);

  const { data: species = [], isLoading } = useQuery<FishSpecies[]>({
    queryKey: ["/api/species"],
  });

  const filteredSpecies = species.filter((fish) => {
    const matchesSearch = fish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fish.habitat?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = !selectedDifficulty || fish.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const difficulties = ["Beginner Friendly", "Intermediate", "Advanced"];

  if (isLoading) {
    return (
      <>
        <MobileHeader title="Fischarten" />
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-800 h-32 rounded-xl"></div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MobileHeader title="Fish Species" />
      
      {/* Search and Filters */}
      <section className="px-4 py-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            type="text" 
            placeholder="Arten oder Lebensraum suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800/60 border-cyan-500/30 text-white placeholder-gray-400"
          />
        </div>
        
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <Badge 
            variant={selectedDifficulty === null ? "default" : "outline"}
            className="whitespace-nowrap cursor-pointer"
            onClick={() => setSelectedDifficulty(null)}
          >
            Alle Level
          </Badge>
          {difficulties.map((difficulty) => (
            <Badge 
              key={difficulty}
              variant={selectedDifficulty === difficulty ? "default" : "outline"}
              className="whitespace-nowrap cursor-pointer"
              onClick={() => setSelectedDifficulty(difficulty)}
            >
              {difficulty}
            </Badge>
          ))}
        </div>
      </section>

      {/* Species Grid */}
      <section className="px-4 pb-6">
        {filteredSpecies.length === 0 ? (
          <Card className="p-8 text-center bg-gray-900/30 backdrop-blur-sm border border-cyan-500/20">
            <Fish className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-300 mb-1">Keine Arten gefunden</h3>
            <p className="text-sm text-gray-400">Passen Sie Ihre Suche oder Filter an</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredSpecies.map((fish) => (
              <Card 
                key={fish.id} 
                className="overflow-hidden bg-gray-900/30 backdrop-blur-sm border border-cyan-500/20 cursor-pointer hover:border-cyan-400/40 transition-colors"
                onClick={() => setSelectedSpecies(fish)}
              >
                <div className="flex">
                  <div className="w-24 h-24 flex-shrink-0">
                    <img 
                      src={fish.imageUrl || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"} 
                      alt={fish.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-100">{fish.name}</h4>
                        {fish.scientificName && (
                          <p className="text-xs text-gray-400 italic">{fish.scientificName}</p>
                        )}
                      </div>
                      <Badge 
                        variant="secondary"
                        className={`text-xs ${
                          fish.difficulty === "Beginner Friendly" ? "bg-green-100 text-green-700" :
                          fish.difficulty === "Intermediate" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}
                      >
                        {fish.difficulty}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-2">{fish.habitat}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      {fish.averageWeight && (
                        <span>⚖️ {fish.averageWeight} lbs avg</span>
                      )}
                      {fish.averageLength && (
                        <span>📏 {fish.averageLength}" avg</span>
                      )}
                    </div>
                    
                    {fish.commonBaits && fish.commonBaits.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {fish.commonBaits.slice(0, 2).map((bait) => (
                            <Badge key={bait} variant="outline" className="text-xs">
                              {bait}
                            </Badge>
                          ))}
                          {fish.commonBaits.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{fish.commonBaits.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {fish.description && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-slate-600">{fish.description}</p>
                  </div>
                )}
                
                {fish.tips && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-100">
                    <div className="flex items-start space-x-2">
                      <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 text-xs">💡</span>
                      </div>
                      <p className="text-sm text-slate-600">{fish.tips}</p>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Species Detail Modal */}
      <Dialog open={!!selectedSpecies} onOpenChange={() => setSelectedSpecies(null)}>
        <DialogContent className="max-w-md bg-gray-900 border-cyan-500/20">
          {selectedSpecies && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl text-gray-100">{selectedSpecies.name}</DialogTitle>
                {selectedSpecies.scientificName && (
                  <p className="text-sm text-gray-400 italic">{selectedSpecies.scientificName}</p>
                )}
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <img 
                    src={selectedSpecies.imageUrl || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"} 
                    alt={selectedSpecies.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge 
                      className={`text-xs ${
                        selectedSpecies.difficulty === "Beginner Friendly" ? "bg-green-500/80 text-white" :
                        selectedSpecies.difficulty === "Intermediate" ? "bg-yellow-500/80 text-white" :
                        "bg-red-500/80 text-white"
                      }`}
                    >
                      {selectedSpecies.difficulty}
                    </Badge>
                  </div>
                </div>

                {selectedSpecies.description && (
                  <div>
                    <h4 className="font-semibold text-gray-100 mb-2">Beschreibung</h4>
                    <p className="text-sm text-gray-300">{selectedSpecies.description}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-100 mb-2">Lebensraum</h4>
                  <div className="flex items-center text-sm text-gray-300">
                    <MapPin className="w-4 h-4 mr-2 text-cyan-400" />
                    <span>{selectedSpecies.habitat}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {selectedSpecies.averageWeight && (
                    <div>
                      <h5 className="font-medium text-gray-100 text-sm">Durchschnittgewicht</h5>
                      <p className="text-cyan-300 font-semibold">{selectedSpecies.averageWeight} kg</p>
                    </div>
                  )}
                  {selectedSpecies.averageLength && (
                    <div>
                      <h5 className="font-medium text-gray-100 text-sm">Durchschnittlänge</h5>
                      <p className="text-cyan-300 font-semibold">{selectedSpecies.averageLength} cm</p>
                    </div>
                  )}
                </div>

                {selectedSpecies.commonBaits && selectedSpecies.commonBaits.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-100 mb-2">Beliebte Köder</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSpecies.commonBaits.map((bait) => (
                        <Badge key={bait} variant="outline" className="text-xs text-cyan-300 border-cyan-500/30">
                          {bait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSpecies.tips && (
                  <div>
                    <h4 className="font-semibold text-gray-100 mb-2">Angel-Tipps</h4>
                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
                      <p className="text-sm text-gray-300">{selectedSpecies.tips}</p>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                    onClick={() => setSelectedSpecies(null)}
                  >
                    Schließen
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Zu Zielen hinzufügen
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Spacer for bottom navigation */}
      <div className="h-20"></div>
    </>
  );
}
