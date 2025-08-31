import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
const fishingBackground = "/file_000000001858620a97cb43f0ecc79a29_1754058073370.png";
import { useLanguage } from "@/contexts/language-context";
import LanguageSwitcher from "@/components/language-switcher";

export default function SplashPage() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image with the new splash screen */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${fishingBackground})`,
        }}
      >
      </div>
      
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      {/* Main Content - positioned to not overlap with the existing "FISHMASTER KI" text */}
      <div className="relative z-10 text-center px-6 mt-32">
        <p className="text-cyan-300 text-sm tracking-[0.3em] mb-8 animate-fade-in drop-shadow-2xl">
          {t("splash.subtitle")}
        </p>
        
        <Button
          onClick={() => setLocation("/home")}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white px-10 py-6 text-lg rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-500"
        >
          {t("splash.startButton")}
        </Button>
      </div>
    </div>
  );
}