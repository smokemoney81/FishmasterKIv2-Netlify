import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import MobileHeader from "@/components/layout/mobile-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Navigation, Star, Compass, Clock, Users, Waves, Fish } from "lucide-react";
import type { FishingSpot } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Map() {
  const [selectedSpot, setSelectedSpot] = useState<FishingSpot | null>(null);
  const { toast } = useToast();
  
  const { data: spots = [], isLoading } = useQuery<FishingSpot[]>({
    queryKey: ["/api/spots"],
  });

  if (isLoading) {
    return (
      <>
        <MobileHeader title="Angel-Karte" />
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-800 h-48 rounded-xl"></div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MobileHeader title="Fishing Map" />
      
      {/* Map Placeholder */}
      <section className="px-4 py-4">
        <Card className="h-64 flex items-center justify-center bg-gradient-to-br from-gray-900/60 to-blue-900/60 backdrop-blur-sm border-2 border-dashed border-cyan-500/30">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-cyan-400 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-100 mb-1">Interaktive Karte</h3>
            <p className="text-sm text-gray-300">Karten-Integration kommt bald</p>
          </div>
        </Card>
      </section>

      {/* Fishing Spots List */}
      <section className="px-4 py-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-100">Angelplätze in der Nähe</h3>
          <div className="flex items-center text-sm text-gray-400">
            <Navigation className="w-4 h-4 mr-1" />
            <span>Nach Entfernung sortiert</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {spots.map((spot) => (
            <Card 
              key={spot.id} 
              className="overflow-hidden bg-gray-900/30 backdrop-blur-sm border border-cyan-500/20 cursor-pointer hover:border-cyan-400/40 transition-colors"
              onClick={() => setSelectedSpot(spot)}
            >
              <div className="relative h-40">
                <img 
                  src={spot.imageUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"} 
                  alt={spot.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-medium">{spot.fishingScore}</span>
                  </div>
                </div>
                <div className="absolute top-3 left-3 bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  <span className="text-xs font-medium text-gray-200">2.3 mi</span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-100">{spot.name}</h4>
                    <p className="text-sm text-gray-300">{spot.description}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {spot.commonSpecies?.slice(0, 2).map((species) => (
                    <Badge key={species} variant="secondary" className="text-xs">
                      {species}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-400">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{spot.accessibility}</span>
                  </div>
                  <div className="text-cyan-400 font-medium">
                    {spot.recentCatches} letzte Fänge
                  </div>
                </div>
                
                {spot.facilities && spot.facilities.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-700/30">
                    <div className="flex flex-wrap gap-1">
                      {spot.facilities.map((facility) => (
                        <Badge key={facility} variant="outline" className="text-xs">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Spot Detail Modal */}
      <Dialog open={!!selectedSpot} onOpenChange={() => setSelectedSpot(null)}>
        <DialogContent className="max-w-md bg-gray-900 border-cyan-500/20">
          {selectedSpot && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl text-gray-100">{selectedSpot.name}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <img 
                    src={selectedSpot.imageUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"} 
                    alt={selectedSpot.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-medium text-gray-800">{selectedSpot.fishingScore}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-100 mb-2">Beschreibung</h4>
                  <p className="text-sm text-gray-300">{selectedSpot.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-100 text-sm mb-1">Entfernung</h5>
                    <div className="flex items-center text-cyan-300">
                      <Compass className="w-4 h-4 mr-1" />
                      <span className="font-semibold">2.3 km</span>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-100 text-sm mb-1">Zugänglichkeit</h5>
                    <div className="flex items-center text-cyan-300">
                      <Users className="w-4 h-4 mr-1" />
                      <span className="font-semibold">{selectedSpot.accessibility}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-100 mb-2">Beliebte Fischarten</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSpot.commonSpecies?.map((species) => (
                      <Badge key={species} className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                        <Fish className="w-3 h-3 mr-1" />
                        {species}
                      </Badge>
                    ))}
                  </div>
                </div>

                {selectedSpot.facilities && selectedSpot.facilities.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-100 mb-2">Ausstattung</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSpot.facilities.map((facility) => (
                        <Badge key={facility} variant="outline" className="text-xs text-gray-300 border-gray-500/30">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Waves className="w-4 h-4 text-blue-400" />
                    <h5 className="font-medium text-gray-100 text-sm">Aktuelle Aktivität</h5>
                  </div>
                  <p className="text-sm text-gray-300">{selectedSpot.recentCatches} Fänge in den letzten 7 Tagen</p>
                  <p className="text-xs text-gray-400 mt-1">Beste Zeit: Früher Morgen und Abenddämmerung</p>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                    onClick={() => setSelectedSpot(null)}
                  >
                    Schließen
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                    onClick={() => {
                      toast({
                        title: "Navigation gestartet!",
                        description: `Route zu ${selectedSpot.name} wird in Karten-App geöffnet.`
                      });
                    }}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Navigation
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
