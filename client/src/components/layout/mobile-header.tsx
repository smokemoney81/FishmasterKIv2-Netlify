import { Search, Bell, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import LanguageSwitcher from "@/components/language-switcher";
import { useScrollHide } from "@/hooks/use-scroll-hide";
const logoImage = "/icons/file_0000000014b4620aa3c30bfbe711a238_1754053799846.png";

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
}

export default function MobileHeader({ title, showBack = false }: MobileHeaderProps) {
  const [, setLocation] = useLocation();
  const isVisible = useScrollHide(50);

  return (
    <header className={`bg-gray-900/50 backdrop-blur-sm border-b border-cyan-500/20 sticky top-0 z-50 transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          {showBack ? (
            <Button variant="ghost" size="sm" onClick={() => setLocation("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          ) : (
            <img src={logoImage} className="h-10 w-auto object-contain" alt="FishMasterKI" />
          )}
          <h1 className="text-xl font-bold text-cyan-400">
            {title || "FishMasterKI"}
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
