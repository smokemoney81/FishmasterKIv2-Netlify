import { useQuery } from "@tanstack/react-query";
import MobileHeader from "@/components/layout/mobile-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Clock, User } from "lucide-react";
import type { Tip } from "@shared/schema";

export default function Tips() {
  const { data: tips = [], isLoading } = useQuery<Tip[]>({
    queryKey: ["/api/tips"],
  });

  if (isLoading) {
    return (
      <>
        <MobileHeader title="Fishing Tips" />
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 h-40 rounded-xl"></div>
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
            <h3 className="text-lg font-semibold text-slate-800">Today's Featured Tip</h3>
          </div>
          
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 overflow-hidden">
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
                  <h4 className="font-semibold text-slate-800 mb-2">{tips[0].title}</h4>
                  <p className="text-sm text-slate-600 mb-3">{tips[0].content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-slate-500">
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
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Browse by Category</h3>
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-2xl">🎣</span>
            </div>
            <h4 className="font-medium text-slate-800">Techniques</h4>
            <p className="text-xs text-slate-500">Fishing methods & strategies</p>
          </Card>
          
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-2xl">🛠️</span>
            </div>
            <h4 className="font-medium text-slate-800">Equipment</h4>
            <p className="text-xs text-slate-500">Gear recommendations</p>
          </Card>
          
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-amber-100 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-2xl">⏰</span>
            </div>
            <h4 className="font-medium text-slate-800">Timing</h4>
            <p className="text-xs text-slate-500">Best times to fish</p>
          </Card>
          
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-2xl">📍</span>
            </div>
            <h4 className="font-medium text-slate-800">Locations</h4>
            <p className="text-xs text-slate-500">Where to find fish</p>
          </Card>
        </div>
      </section>

      {/* Popular Tips */}
      <section className="px-4 py-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Popular Tips</h3>
        <div className="space-y-4">
          {/* Mock popular tips since we only have one in our data */}
          <Card className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm">🌅</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-800 mb-1">Best Times for Fishing</h4>
                <p className="text-sm text-slate-600 mb-2">Dawn and dusk are prime fishing times when fish are most active</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">Timing</Badge>
                  <Badge variant="outline" className="text-xs">Beginner</Badge>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-sm">🎯</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-800 mb-1">Reading Water Structure</h4>
                <p className="text-sm text-slate-600 mb-2">Look for drop-offs, underwater structures, and vegetation where fish hide</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">Technique</Badge>
                  <Badge variant="outline" className="text-xs">Intermediate</Badge>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-amber-600 text-sm">🌡️</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-800 mb-1">Water Temperature Matters</h4>
                <p className="text-sm text-slate-600 mb-2">Fish activity changes with water temperature - adjust your strategy accordingly</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">Strategy</Badge>
                  <Badge variant="outline" className="text-xs">Advanced</Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Spacer for bottom navigation */}
      <div className="h-20"></div>
    </>
  );
}
