import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import fishingBackground from "@assets/Hailuo_Image_Gesprochene Sprache Deutsch un_403261198889037828_1754055717118.png";
import { useLanguage } from "@/contexts/language-context";
import LanguageSwitcher from "@/components/language-switcher";

export default function SplashPage() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${fishingBackground})`,
        }}
      >
        {/* Overlay to hide watermark area */}
        <div className="absolute bottom-0 left-0 w-96 h-24 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </div>
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6">
        <p className="text-cyan-300 text-sm tracking-[0.3em] mb-8 animate-fade-in drop-shadow-2xl">
          {t("splash.subtitle")}
        </p>
        
        <h1 className="text-6xl md:text-8xl font-bold mb-16 animate-fade-in-up drop-shadow-2xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-green-300">
            {t("splash.title")}
          </span>
        </h1>
        
        <Button
          onClick={() => setLocation("/home")}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-10 py-6 text-lg rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-500"
        >
          {t("splash.startButton")}
        </Button>
      </div>
    </div>
  );
}