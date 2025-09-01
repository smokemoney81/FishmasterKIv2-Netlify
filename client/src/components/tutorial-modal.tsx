
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, X, Fish, Camera, MapPin, BookOpen, Package, MessageCircle } from "lucide-react";

interface TutorialStep {
  title: string;
  content: string;
  icon: React.ReactNode;
  feature: string;
}

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps: TutorialStep[] = [
    {
      title: "Willkommen bei FishMasterKI!",
      content: "Ihr intelligenter Angel-Begleiter mit KI-Power. Lassen Sie uns die wichtigsten Funktionen erkunden.",
      icon: <Fish className="w-8 h-8 text-cyan-400" />,
      feature: "Übersicht"
    },
    {
      title: "Fisch-Identifikation",
      content: "Fotografieren Sie Ihren Fang und lassen Sie die KI die Fischart bestimmen. Einfach Foto aufnehmen und analysieren lassen!",
      icon: <Camera className="w-8 h-8 text-cyan-400" />,
      feature: "KI-Identifikation"
    },
    {
      title: "Angelplätze entdecken",
      content: "Finden Sie die besten Angelplätze in Ihrer Nähe mit detaillierten Informationen zu Fischarten und Bedingungen.",
      icon: <MapPin className="w-8 h-8 text-green-400" />,
      feature: "Karte & Spots"
    },
    {
      title: "Fangbuch führen",
      content: "Dokumentieren Sie alle Ihre Fänge mit Fotos, Gewicht, Ort und Datum. Verfolgen Sie Ihre Angel-Erfolge!",
      icon: <BookOpen className="w-8 h-8 text-blue-400" />,
      feature: "Logbuch"
    },
    {
      title: "Equipment-Planer",
      content: "Planen Sie Ihre Ausrüstung für jeden Angeltrip. Erstellen Sie Checklisten und vergessen Sie nie wieder wichtiges Equipment.",
      icon: <Package className="w-8 h-8 text-orange-400" />,
      feature: "Ausrüstung"
    },
    {
      title: "Sigi - Ihr KI-Assistent",
      content: "Chatten Sie mit Sigi, Ihrem persönlichen Angel-Experten. Fragen Sie nach Tipps, Wetter oder App-Hilfe!",
      icon: <MessageCircle className="w-8 h-8 text-purple-400" />,
      feature: "KI-Chat"
    }
  ];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentTutorialStep = tutorialSteps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gray-900 border-cyan-500/20">
        <DialogHeader className="relative">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl text-gray-100 flex items-center">
              {currentTutorialStep.icon}
              <span className="ml-3">Tutorial</span>
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Progress indicator */}
          <div className="flex items-center space-x-2 mt-4">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full flex-1 ${
                  index <= currentStep 
                    ? 'bg-cyan-500' 
                    : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
          
          <Badge variant="outline" className="mt-2 w-fit">
            {currentStep + 1} von {tutorialSteps.length}
          </Badge>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-cyan-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              {currentTutorialStep.icon}
            </div>
            
            <h3 className="text-lg font-semibold text-gray-100 mb-2">
              {currentTutorialStep.title}
            </h3>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              {currentTutorialStep.content}
            </p>
            
            <Badge 
              variant="secondary" 
              className="mt-3 bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
            >
              {currentTutorialStep.feature}
            </Badge>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-700/30">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>

            {currentStep === tutorialSteps.length - 1 ? (
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                Tutorial beenden
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700"
              >
                Weiter
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
