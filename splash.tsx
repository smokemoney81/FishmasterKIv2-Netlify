import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import fishingBackground from "@assets/grok_image_kec1rq_1756607643897.jpg";
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
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
      </div>

      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      {/* Main Splash Content */}
      <div className="relative z-10 text-center px-6 flex flex-col items-center justify-center min-h-screen">
        <div className="mb-12">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 drop-shadow-2xl">
            FISH<span className="text-cyan-400">MASTER</span>
          </h1>
          <div className="text-2xl md:text-3xl font-light text-cyan-300 tracking-[0.3em] mb-2">
            KI
          </div>
          <p className="text-cyan-200 text-lg tracking-[0.2em] mb-8 drop-shadow-lg">
            {t("splash.subtitle")}
          </p>
          {/* Start Button */}
          <Button
            onClick={() => setLocation("/home")}
            className="bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 hover:from-cyan-400 hover:via-blue-400 hover:to-cyan-500 text-white px-12 py-6 text-xl font-bold rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105"
          >
            Jetzt Angeln Starten
          </Button>
        </div>
        {/* Bottom decoration */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-1 h-12 bg-gradient-to-b from-cyan-400 to-transparent rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
