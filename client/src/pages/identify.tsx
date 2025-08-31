import MobileHeader from "@/components/layout/mobile-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Search } from "lucide-react";

export default function Identify() {
  return (
    <>
      <MobileHeader title="Fish Identification" />
      
      {/* Camera Section */}
      <section className="px-4 py-6">
        <Card className="p-6 text-center bg-gray-900/30 backdrop-blur-sm border border-cyan-500/20">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Camera className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-100 mb-2">Identify Your Fish</h3>
          <p className="text-gray-300 mb-6">Take a photo or upload an image to get instant fish species identification</p>
          
          <div className="space-y-3">
            <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
              <Camera className="w-5 h-5 mr-2" />
              Take Photo
            </Button>
            <Button variant="outline" className="w-full border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10">
              <Upload className="w-5 h-5 mr-2" />
              Upload from Gallery
            </Button>
          </div>
        </Card>
      </section>

      {/* Quick Identification */}
      <section className="px-4 py-2">
        <Card className="p-4 bg-gray-900/30 backdrop-blur-sm border border-cyan-500/20">
          <h4 className="font-semibold text-gray-100 mb-3">Quick Species Search</h4>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or characteristics..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800/60 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </Card>
      </section>

      {/* Identification Tips */}
      <section className="px-4 py-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Photography Tips</h3>
        <div className="space-y-3">
          <Card className="p-4 bg-gray-900/30 backdrop-blur-sm border border-cyan-500/20">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-cyan-400 font-semibold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-100">Good Lighting</h4>
                <p className="text-sm text-gray-300">Take photos in natural daylight for best results</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gray-900/30 backdrop-blur-sm border border-cyan-500/20">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-cyan-400 font-semibold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-100">Full Body Shot</h4>
                <p className="text-sm text-gray-300">Capture the entire fish including fins and tail</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-medium text-slate-800">Clear Focus</h4>
                <p className="text-sm text-slate-600">Ensure the fish is in sharp focus with visible details</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Recent Identifications */}
      <section className="px-4 py-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Identifications</h3>
        <Card className="p-6 text-center">
          <div className="text-slate-400 mb-2">🔍</div>
          <p className="text-slate-500">No recent identifications</p>
          <p className="text-sm text-slate-400">Start by taking your first fish photo!</p>
        </Card>
      </section>

      {/* Spacer for bottom navigation */}
      <div className="h-20"></div>
    </>
  );
}
