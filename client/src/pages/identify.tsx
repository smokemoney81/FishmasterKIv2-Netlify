import { useState, useRef } from "react";
import MobileHeader from "@/components/layout/mobile-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, Upload, Search, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Identify() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [identificationResult, setIdentificationResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedImage(result);
        analyzeImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true);
    // Simuliere KI-Analyse
    setTimeout(() => {
      const mockResults = [
        { name: "Regenbogenforelle", confidence: 0.92, habitat: "Süßwasser, kalte Seen" },
        { name: "Bachforelle", confidence: 0.78, habitat: "Fließgewässer, Bäche" },
        { name: "Karpfen", confidence: 0.45, habitat: "Stehende Gewässer" }
      ];
      setIdentificationResult(mockResults);
      setIsAnalyzing(false);
      toast({
        title: "Identifikation abgeschlossen!",
        description: "Die KI hat mögliche Übereinstimmungen gefunden."
      });
    }, 2000);
  };

  const handleCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  return (
    <>
      <MobileHeader title="Fisch-Identifikation" />
      
      {/* Camera Section */}
      <section className="px-4 py-6">
        <Card className="p-6 text-center bg-gray-900/30 backdrop-blur-sm border border-cyan-500/20">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Camera className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-100 mb-2">Identifizieren Sie Ihren Fisch</h3>
          <p className="text-gray-300 mb-6">Machen Sie ein Foto oder laden Sie ein Bild hoch für die sofortige Fisch-Identifikation</p>
          
          <div className="space-y-3">
            <input
              type="file"
              ref={cameraInputRef}
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              className="hidden"
            />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button 
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              onClick={handleCameraCapture}
              disabled={isAnalyzing}
            >
              <Camera className="w-5 h-5 mr-2" />
              Foto aufnehmen
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
              onClick={handleUploadClick}
              disabled={isAnalyzing}
            >
              <Upload className="w-5 h-5 mr-2" />
              Aus Galerie hochladen
            </Button>
          </div>
        </Card>
      </section>

      {/* Quick Identification */}
      <section className="px-4 py-2">
        <Card className="p-4 bg-gray-900/30 backdrop-blur-sm border border-cyan-500/20">
          <h4 className="font-semibold text-gray-100 mb-3">Schnelle Arten-Suche</h4>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              type="text" 
              placeholder="Nach Name oder Eigenschaften suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800/60 border-cyan-500/30 text-white placeholder-gray-400"
            />
          </div>
        </Card>
      </section>

      {/* Identification Tips */}
      <section className="px-4 py-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Fotografie-Tipps</h3>
        <div className="space-y-3">
          <Card className="p-4 bg-gray-900/30 backdrop-blur-sm border border-cyan-500/20">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-cyan-400 font-semibold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-100">Gute Beleuchtung</h4>
                <p className="text-sm text-gray-300">Machen Sie Fotos bei natürlichem Tageslicht für beste Ergebnisse</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gray-900/30 backdrop-blur-sm border border-cyan-500/20">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-cyan-400 font-semibold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-100">Ganzkörper-Aufnahme</h4>
                <p className="text-sm text-gray-300">Erfassen Sie den ganzen Fisch einschließlich Flossen und Schwanz</p>
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
