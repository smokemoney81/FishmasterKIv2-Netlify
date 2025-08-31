import { useQuery } from "@tanstack/react-query";
import MobileHeader from "@/components/layout/mobile-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Star } from "lucide-react";
import type { FishingSpot } from "@shared/schema";

export default function Map() {
  const { data: spots = [], isLoading } = useQuery<FishingSpot[]>({
    queryKey: ["/api/spots"],
  });

  if (isLoading) {
    return (
      <>
        <MobileHeader title="Fishing Map" />
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 h-48 rounded-xl"></div>
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
            <h3 className="font-semibold text-gray-100 mb-1">Interactive Map</h3>
            <p className="text-sm text-gray-300">Map integration coming soon</p>
          </div>
        </Card>
      </section>

      {/* Fishing Spots List */}
      <section className="px-4 py-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-100">Nearby Fishing Spots</h3>
          <div className="flex items-center text-sm text-gray-400">
            <Navigation className="w-4 h-4 mr-1" />
            <span>Sort by distance</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {spots.map((spot) => (
            <Card key={spot.id} className="overflow-hidden bg-gray-900/30 backdrop-blur-sm border border-cyan-500/20">
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
                  <div className="flex items-center text-slate-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{spot.accessibility}</span>
                  </div>
                  <div className="text-orange-500 font-medium">
                    {spot.recentCatches} recent catches
                  </div>
                </div>
                
                {spot.facilities && spot.facilities.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
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

      {/* Spacer for bottom navigation */}
      <div className="h-20"></div>
    </>
  );
}
