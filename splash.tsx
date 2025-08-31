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
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
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
          <Button onClick={() => setLocation("/home")}>
            Jetzt Angeln Starten
          </Button>
        </div>
      </div>
    </div>
  );
}
