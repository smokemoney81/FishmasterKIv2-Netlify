import { Search, Bell, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import LanguageSwitcher from "@/components/language-switcher";
const logoImage = "/icons/file_0000000014b4620aa3c30bfbe711a238_1754053799846.png";

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
}

export default function MobileHeader({ title, showBack = false }: MobileHeaderProps) {
  const [, setLocation] = useLocation();

  return (
    <header className="bg-gray-900/90 backdrop-blur-sm border-b border-cyan-500/30 sticky top-0 z-50">
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
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-cyan-400 transition-colors">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-cyan-400 transition-colors">
            <Bell className="w-5 h-5" />
          </Button>
          <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
