import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import MobileHeader from "@/components/layout/mobile-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Fish } from "lucide-react";
import type { FishSpecies } from "@shared/schema";

export default function Species() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

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
        <MobileHeader title="Fish Species" />
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
            placeholder="Search species or habitat..."
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
            All Levels
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
            <h3 className="font-semibold text-gray-300 mb-1">No species found</h3>
            <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredSpecies.map((fish) => (
              <Card key={fish.id} className="overflow-hidden bg-gray-900/30 backdrop-blur-sm border border-cyan-500/20">
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

      {/* Spacer for bottom navigation */}
      <div className="h-20"></div>
    </>
  );
}
