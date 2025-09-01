import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import fishingBackground from "@assets/grok_image_kec1rq_1756607643897.jpg";
import { useLanguage } from "@/contexts/language-context";
import LanguageSwitcher from "@/components/language-switcher";
import TutorialModal from "@/components/tutorial-modal";
import { useState } from "react";
import { HelpCircle } from "lucide-react";

export default function SplashPage() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image with blue fish */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${fishingBackground})`,
        }}
      >
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
      </div>
      
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      {/* Tutorial Button */}
      <div className="absolute top-4 left-4 z-20">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowTutorial(true)}
          className="border-cyan-500/30 bg-slate-800/50 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Tutorial
        </Button>
      </div>

      {/* Main Splash Content */}
      <div className="relative z-10 text-center px-6 flex flex-col items-center justify-center min-h-screen">
        {/* Logo/Title Area */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 drop-shadow-2xl animate-fade-in">
            FISH<span className="text-cyan-400">MASTER</span>
          </h1>
          <div className="text-2xl md:text-3xl font-light text-cyan-300 tracking-[0.3em] mb-2 animate-fade-in animation-delay-300">
            KI
          </div>
          <p className="text-cyan-200 text-lg tracking-[0.2em] mb-8 animate-fade-in animation-delay-500 drop-shadow-lg">
            {t("splash.subtitle")}
          </p>
        </div>

        {/* App Features */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 animate-fade-in animation-delay-700">
          <div className="flex items-center text-white/90 text-sm">
            <span className="mr-2">🎣</span>
            <span>Angel-Experte</span>
          </div>
          <div className="flex items-center text-white/90 text-sm">
            <span className="mr-2">🌊</span>
            <span>Wetter-Analyse</span>
          </div>
          <div className="flex items-center text-white/90 text-sm">
            <span className="mr-2">📱</span>
            <span>KI-Assistent</span>
          </div>
        </div>
        
        {/* Start Button */}
        <Button
          onClick={() => setLocation("/home")}
          className="bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 hover:from-cyan-400 hover:via-blue-400 hover:to-cyan-500 text-white px-12 py-6 text-xl font-bold rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-1000 border-2 border-cyan-300/30"
        >
          <span className="mr-3">🎣</span>
          {t("splash.startButton")}
        </Button>

        {/* Bottom decoration */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce animation-delay-1500">
          <div className="w-1 h-12 bg-gradient-to-b from-cyan-400 to-transparent rounded-full"></div>
        </div>
      </div>

      <TutorialModal 
        isOpen={showTutorial} 
        onClose={() => setShowTutorial(false)} 
      />
    </div>
  );
}